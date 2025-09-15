#!/usr/bin/env python3

import json
import sys
import os
import re
import shutil
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict

def is_protected_file(file_path: str) -> bool:
    """Check if file is protected from editing."""
    protected_patterns = [
        # Database and schemas
        r'prisma[/\\]schema\.prisma$',
        r'prisma[/\\]migrations[/\\]',
        
        # Environment files
        r'\.env$',
        r'\.env\.production$',
        r'\.env\.local$', 
        r'\.env\.development$',
        
        # Package management
        r'package\.json$',
        r'package-lock\.json$',
        r'yarn\.lock$',
        r'pnpm-lock\.yaml$',
        
        # Git and system files
        r'\.git[/\\]',
        r'\.github[/\\]workflows[/\\]',
        
        # Critical config files
        r'next\.config\.(js|ts)$',
        r'tailwind\.config\.(js|ts)$',
        r'tsconfig\.json$',
        
        # Security files
        r'\.claude[/\\]settings\.json$'
    ]
    
    normalized_path = file_path.replace('\\', '/')
    
    for pattern in protected_patterns:
        if re.search(pattern, normalized_path, re.IGNORECASE):
            return True
    
    return False

def is_critical_file(file_path: str) -> bool:
    """Check if file should be backed up before editing."""
    critical_patterns = [
        # Main application files
        r'app[/\\]layout\.(tsx?|jsx?)$',
        r'app[/\\]page\.(tsx?|jsx?)$',
        r'app[/\\]globals\.css$',
        
        # API routes
        r'app[/\\]api[/\\].*[/\\]route\.(ts|js)$',
        
        # Core service files
        r'features[/\\][^/\\]+[/\\]services[/\\].*Service\.(ts|js)$',
        r'features[/\\][^/\\]+[/\\]adapters[/\\].*Adapter\.(ts|js)$',
        
        # Core library files
        r'lib[/\\].*\.(ts|js)$',
        
        # Main component files
        r'components[/\\]ui[/\\].*\.(tsx?|jsx?)$'
    ]
    
    normalized_path = file_path.replace('\\', '/')
    
    for pattern in critical_patterns:
        if re.search(pattern, normalized_path, re.IGNORECASE):
            return True
    
    return False

def detect_cross_feature_edit(file_path: str, operation_context: str = "") -> Optional[dict]:
    """Detect edits that cross feature boundaries."""
    normalized_path = file_path.replace('\\', '/')
    
    # Extract feature from file path
    feature_match = re.search(r'features[/\\]([^/\\]+)', normalized_path, re.IGNORECASE)
    if not feature_match:
        return None
    
    target_feature = feature_match.group(1)
    
    # Check if operation context suggests cross-feature dependency
    if operation_context:
        # Look for imports from other features
        other_feature_imports = re.findall(
            r'from\s+[\'"]@?/?features[/\\]([^/\\]+)[/\\]',
            operation_context,
            re.IGNORECASE
        )
        
        # Also check require statements
        other_feature_requires = re.findall(
            r'require\s*\(\s*[\'"]@?/?features[/\\]([^/\\]+)[/\\]',
            operation_context,
            re.IGNORECASE
        )
        
        cross_imports = other_feature_imports + other_feature_requires
        cross_imports = [f for f in cross_imports if f != target_feature]
        
        if cross_imports:
            return {
                'target_feature': target_feature,
                'cross_imports': list(set(cross_imports)),
                'type': 'import_dependency'
            }
    
    return None

def create_backup(file_path: str) -> Optional[str]:
    """Create backup of critical file."""
    try:
        if not os.path.exists(file_path):
            return None
        
        # Create backup directory if it doesn't exist
        backup_dir = Path(file_path).parent / '.backups'
        backup_dir.mkdir(exist_ok=True)
        
        # Generate backup filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_name = os.path.basename(file_path)
        backup_path = backup_dir / f"{file_name}.{timestamp}.backup"
        
        # Copy file to backup
        shutil.copy2(file_path, backup_path)
        
        return str(backup_path)
        
    except Exception as e:
        # Don't fail if backup creation fails
        return None

def validate_typescript_imports(file_path: str, new_content: str) -> List[str]:
    """Validate TypeScript import paths."""
    issues = []
    
    if not file_path.endswith(('.ts', '.tsx')):
        return issues
    
    # Check for problematic import patterns
    problematic_patterns = [
        # Relative imports going too many levels up
        (r'from\s+[\'"](\.\./\.\./\.\./.*)[\'"]', 'Import goes 3+ levels up - consider absolute import'),
        
        # Direct node_modules imports without proper types
        (r'from\s+[\'"](?!@?[a-z])(.*node_modules.*)[\'"]', 'Direct node_modules import detected'),
        
        # Missing file extensions for local files
        (r'from\s+[\'"](\./[^\'\"]*(?<!\.js)(?<!\.ts)(?<!\.jsx)(?<!\.tsx))[\'"]', 
         'Local import missing file extension'),
        
        # Circular dependency patterns (basic detection)
        (r'from\s+[\'"].*features[/\\]([^/\\]+)[/\\].*[\'"].*import.*from.*features[/\\]\1', 
         'Potential circular dependency detected')
    ]
    
    for pattern, message in problematic_patterns:
        matches = re.finditer(pattern, new_content, re.MULTILINE | re.IGNORECASE)
        for match in matches:
            issues.append(f"⚠️  {message}: {match.group(1)}")
    
    return issues

def validate_feature_architecture(file_path: str, new_content: str) -> List[str]:
    """Validate adherence to feature architecture patterns."""
    issues = []
    normalized_path = file_path.replace('\\', '/')
    
    # Check if file is in features directory
    if not re.search(r'features[/\\]', normalized_path, re.IGNORECASE):
        return issues
    
    # Validate layer architecture
    layer_patterns = {
        'adapters': r'features[/\\][^/\\]+[/\\]adapters[/\\]',
        'services': r'features[/\\][^/\\]+[/\\]services[/\\]',
        'components': r'features[/\\][^/\\]+[/\\].*components[/\\]',
        'types': r'features[/\\][^/\\]+[/\\]types[/\\]'
    }
    
    current_layer = None
    for layer, pattern in layer_patterns.items():
        if re.search(pattern, normalized_path, re.IGNORECASE):
            current_layer = layer
            break
    
    if current_layer:
        # Check for layer violations in imports
        if current_layer == 'components':
            # Components shouldn't import from services directly
            if re.search(r'from\s+[\'"].*services[/\\]', new_content, re.IGNORECASE):
                issues.append("⚠️  Component importing directly from services - consider using adapters")
        
        elif current_layer == 'adapters':
            # Adapters shouldn't import from other adapters
            if re.search(r'from\s+[\'"].*adapters[/\\]', new_content, re.IGNORECASE):
                issues.append("⚠️  Adapter importing from another adapter - potential architecture violation")
    
    return issues

def pre_edit_validation(file_path: str, tool_input: dict) -> dict:
    """Main pre-edit validation function."""
    try:
        issues = []
        warnings = []
        backups_created = []
        
        # 1. Check if file is protected
        if is_protected_file(file_path):
            return {
                'status': 'error',
                'message': f"❌ File '{file_path}' is protected from editing\n💡 This file is critical to project infrastructure"
            }
        
        # 2. Create backup for critical files
        if is_critical_file(file_path):
            backup_path = create_backup(file_path)
            if backup_path:
                backups_created.append(backup_path)
                warnings.append(f"💾 Backup created: {backup_path}")
        
        # 3. Check for cross-feature edits
        new_content = tool_input.get('new_string', '')
        cross_feature = detect_cross_feature_edit(file_path, new_content)
        
        if cross_feature:
            warnings.append(
                f"⚠️  Cross-feature edit detected: {cross_feature['target_feature']} → {cross_feature['cross_imports']}\n"
                f"   Please ensure this dependency is intentional and properly documented"
            )
        
        # 4. TypeScript import validation
        ts_issues = validate_typescript_imports(file_path, new_content)
        issues.extend(ts_issues)
        
        # 5. Feature architecture validation
        arch_issues = validate_feature_architecture(file_path, new_content)
        issues.extend(arch_issues)
        
        # Compile results
        message_parts = []
        
        if backups_created:
            message_parts.extend(warnings)
        
        if issues:
            message_parts.append("🔍 Pre-edit validation issues:")
            message_parts.extend([f"  {issue}" for issue in issues])
        
        if cross_feature:
            message_parts.append("🔗 Cross-feature dependency detected - please review")
        
        if not message_parts:
            message_parts.append("✅ Pre-edit validation passed")
        
        # Determine status
        if any("❌" in issue for issue in issues):
            status = 'error'
        elif issues or cross_feature:
            status = 'warning'
        else:
            status = 'success'
        
        return {
            'status': status,
            'message': '\n'.join(message_parts),
            'backups': backups_created
        }
        
    except Exception as e:
        # Don't block development on validation errors
        return {
            'status': 'warning',
            'message': f"Pre-edit validation error (non-blocking): {str(e)}"
        }

def main():
    try:
        # Read input data from stdin
        input_data = json.load(sys.stdin)
        
        tool_input = input_data.get("tool_input", {})
        file_path = tool_input.get("file_path", "")
        
        if not file_path:
            sys.exit(0)  # No file to validate
        
        # Only validate relevant file types
        file_extension = os.path.splitext(file_path)[1]
        if file_extension not in ['.ts', '.tsx', '.js', '.jsx', '.py', '.json', '.md', '.css', '.scss']:
            sys.exit(0)
        
        # Perform pre-edit validation
        result = pre_edit_validation(file_path, tool_input)
        
        if result['status'] == 'error':
            print(result['message'], file=sys.stderr)
            sys.exit(2)  # Block execution
        elif result['status'] == 'warning':
            print(result['message'], file=sys.stderr)
            sys.exit(0)  # Continue with warning
        else:
            # Success
            print(result['message'], file=sys.stderr)
            sys.exit(0)
    
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON input: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        # Don't block development on unexpected errors
        print(f"Pre-edit validation hook error (non-blocking): {e}", file=sys.stderr)
        sys.exit(0)

if __name__ == "__main__":
    main()