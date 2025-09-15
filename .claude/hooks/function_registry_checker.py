#!/usr/bin/env python3

import json
import sys
import os
import re
import ast
from pathlib import Path
from typing import List, Dict, Optional

def extract_functions_from_code(code_content: str, file_extension: str) -> List[Dict]:
    """Extract function definitions from code content."""
    functions = []
    
    try:
        if file_extension in ['.ts', '.tsx', '.js', '.jsx']:
            # TypeScript/JavaScript function extraction using regex
            # Pattern untuk function declarations
            patterns = [
                # function functionName(params) 
                r'function\s+(\w+)\s*\([^)]*\)',
                # const functionName = (params) => 
                r'const\s+(\w+)\s*=\s*\([^)]*\)\s*=>',
                # export function functionName(params)
                r'export\s+function\s+(\w+)\s*\([^)]*\)',
                # export const functionName = (params) =>
                r'export\s+const\s+(\w+)\s*=\s*\([^)]*\)\s*=>',
                # functionName: (params) =>
                r'(\w+):\s*\([^)]*\)\s*=>',
                # async function functionName(params)
                r'async\s+function\s+(\w+)\s*\([^)]*\)',
                # async functionName(params)
                r'async\s+(\w+)\s*\([^)]*\)\s*{',
                # class methods: methodName(params)
                r'\s+(\w+)\s*\([^)]*\)\s*{',
            ]
            
            for pattern in patterns:
                matches = re.finditer(pattern, code_content, re.MULTILINE | re.IGNORECASE)
                for match in matches:
                    func_name = match.group(1)
                    # Skip common keywords and short names
                    if func_name not in ['if', 'for', 'while', 'switch', 'catch', 'try', 'else', 'return', 'var', 'let', 'const'] and len(func_name) > 2:
                        functions.append({
                            'name': func_name,
                            'type': 'function',
                            'context': match.group(0)[:100]  # First 100 chars for context
                        })
        
        elif file_extension == '.py':
            # Python function extraction using AST
            try:
                tree = ast.parse(code_content)
                for node in ast.walk(tree):
                    if isinstance(node, ast.FunctionDef):
                        functions.append({
                            'name': node.name,
                            'type': 'function',
                            'context': f"def {node.name}(...)"
                        })
                    elif isinstance(node, ast.AsyncFunctionDef):
                        functions.append({
                            'name': node.name,
                            'type': 'async_function', 
                            'context': f"async def {node.name}(...)"
                        })
            except SyntaxError:
                # Fallback to regex for Python if AST fails
                python_patterns = [
                    r'def\s+(\w+)\s*\(',
                    r'async\s+def\s+(\w+)\s*\('
                ]
                for pattern in python_patterns:
                    matches = re.finditer(pattern, code_content, re.MULTILINE)
                    for match in matches:
                        functions.append({
                            'name': match.group(1),
                            'type': 'function',
                            'context': match.group(0)
                        })
    
    except Exception as e:
        # If extraction fails, return empty list - don't block development
        pass
    
    return functions

def parse_readme_functions(readme_path: str) -> List[Dict]:
    """Parse README.md to extract documented functions."""
    functions = []
    
    try:
        with open(readme_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for function registry sections
        # Pattern: - `functionName(params)` - Description
        function_pattern = r'-\s*`(\w+)\([^)]*\)`\s*-\s*(.+)'
        matches = re.finditer(function_pattern, content, re.MULTILINE)
        
        for match in matches:
            func_name = match.group(1)
            description = match.group(2).strip()
            
            functions.append({
                'name': func_name,
                'description': description,
                'context': match.group(0),
                'keywords': extract_keywords_from_description(description)
            })
    
    except (FileNotFoundError, IOError, UnicodeDecodeError):
        # README.md doesn't exist or can't be read - not an error
        pass
    except Exception:
        # Any other error - don't block development
        pass
    
    return functions

def extract_keywords_from_description(description: str) -> set:
    """Extract meaningful keywords from function description."""
    # Remove common stop words
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
        'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
    }
    
    # Extract words and filter
    words = re.findall(r'\w+', description.lower())
    keywords = {word for word in words if word not in stop_words and len(word) > 2}
    
    return keywords

def calculate_name_similarity(name1: str, name2: str) -> float:
    """Calculate similarity between function names."""
    name1_lower = name1.lower()
    name2_lower = name2.lower()
    
    # Exact match
    if name1_lower == name2_lower:
        return 1.0
    
    # Check for common semantic patterns
    semantic_patterns = [
        # CRUD operations
        ('create', 'add'), ('create', 'insert'), ('add', 'insert'),
        ('get', 'fetch'), ('get', 'retrieve'), ('fetch', 'retrieve'),
        ('update', 'edit'), ('update', 'modify'), ('edit', 'modify'),
        ('delete', 'remove'), ('delete', 'destroy'), ('remove', 'destroy'),
        # Common variations
        ('validate', 'check'), ('validate', 'verify'), ('check', 'verify'),
        ('format', 'transform'), ('format', 'convert'), ('transform', 'convert'),
        ('send', 'dispatch'), ('send', 'emit'), ('dispatch', 'emit'),
        ('init', 'initialize'), ('init', 'setup'), ('initialize', 'setup')
    ]
    
    for pattern1, pattern2 in semantic_patterns:
        if (pattern1 in name1_lower and pattern2 in name2_lower) or \
           (pattern2 in name1_lower and pattern1 in name2_lower):
            return 0.9
    
    # Levenshtein distance for typos
    distance = levenshtein_distance(name1_lower, name2_lower)
    max_len = max(len(name1_lower), len(name2_lower))
    
    if max_len == 0:
        return 0.0
    
    similarity = 1 - (distance / max_len)
    
    # Only consider high similarity as potential duplicates
    if similarity >= 0.8:
        return similarity
    
    return 0.0

def levenshtein_distance(s1: str, s2: str) -> int:
    """Calculate Levenshtein distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    
    if len(s2) == 0:
        return len(s1)
    
    previous_row = list(range(len(s2) + 1))
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]

def calculate_semantic_similarity(desc1: str, desc2: str) -> float:
    """Calculate semantic similarity between descriptions."""
    if not desc1 or not desc2:
        return 0.0
    
    keywords1 = extract_keywords_from_description(desc1)
    keywords2 = extract_keywords_from_description(desc2)
    
    if not keywords1 or not keywords2:
        return 0.0
    
    # Jaccard similarity
    intersection = len(keywords1.intersection(keywords2))
    union = len(keywords1.union(keywords2))
    
    if union == 0:
        return 0.0
    
    return intersection / union

def find_similar_functions(existing_functions: List[Dict], new_functions: List[Dict]) -> List[Dict]:
    """Find similar functions between existing and new functions."""
    duplications = []
    
    for new_func in new_functions:
        for existing_func in existing_functions:
            # Calculate name similarity
            name_similarity = calculate_name_similarity(
                new_func['name'], 
                existing_func['name']
            )
            
            # Calculate semantic similarity if descriptions available
            semantic_similarity = 0.0
            if 'description' in existing_func:
                # Try to infer description from context for new function
                new_desc = new_func.get('context', '')
                semantic_similarity = calculate_semantic_similarity(
                    existing_func['description'], 
                    new_desc
                )
            
            # Determine overall similarity
            overall_similarity = max(name_similarity, semantic_similarity)
            
            # Report significant similarities
            if overall_similarity >= 0.7:  # Conservative threshold
                duplications.append({
                    'new_function': new_func['name'],
                    'existing_function': existing_func['name'],
                    'similarity_score': overall_similarity,
                    'similarity_type': 'name' if name_similarity > semantic_similarity else 'semantic',
                    'existing_description': existing_func.get('description', 'No description'),
                    'new_context': new_func.get('context', '')
                })
    
    return duplications

def check_function_registry(file_path: str, new_code: str) -> Dict:
    """Main function to check function registry for duplications."""
    try:
        # Get folder path and look for README.md
        folder_path = os.path.dirname(file_path)
        readme_path = os.path.join(folder_path, "README.md")
        
        # Parse existing functions from README.md
        existing_functions = parse_readme_functions(readme_path)
        
        # If no README.md or no functions documented, suggest creating one
        if not existing_functions:
            return {
                'status': 'suggestion',
                'message': f"📝 No function registry found in {folder_path}\\README.md\n💡 Consider creating a function registry to track functions in this folder"
            }
        
        # Extract file extension
        file_extension = os.path.splitext(file_path)[1]
        
        # Extract functions from new code
        new_functions = extract_functions_from_code(new_code, file_extension)
        
        if not new_functions:
            # No functions detected in new code
            return {'status': 'success', 'message': 'No functions detected in new code'}
        
        # Find similar functions
        duplications = find_similar_functions(existing_functions, new_functions)
        
        if duplications:
            return handle_duplications(duplications, len(existing_functions))
        
        return {
            'status': 'success', 
            'message': f"✅ Function registry check passed - {len(new_functions)} new function(s) detected"
        }
        
    except Exception as e:
        # Don't block development on errors
        return {
            'status': 'error',
            'message': f"Function registry check error (non-blocking): {str(e)}"
        }

def handle_duplications(duplications: List[Dict], total_existing: int) -> Dict:
    """Handle detected function duplications."""
    # Separate by severity
    critical_duplications = [d for d in duplications if d['similarity_score'] >= 0.95]
    warning_duplications = [d for d in duplications if 0.7 <= d['similarity_score'] < 0.95]
    
    if critical_duplications:
        # High similarity - likely duplicates, block execution
        message_lines = ["❌ High similarity functions detected (likely duplicates):"]
        
        for dup in critical_duplications:
            message_lines.append(
                f"  • '{dup['new_function']}' very similar to existing '{dup['existing_function']}' "
                f"(similarity: {dup['similarity_score']:.1%})"
            )
            message_lines.append(f"    Existing: {dup['existing_description']}")
        
        message_lines.append("\n💡 Solutions:")
        message_lines.append("  - Use the existing function if functionality is the same")
        message_lines.append("  - Use a more specific name if functionality is different")
        message_lines.append("  - Update README.md if the existing function is incorrect")
        
        return {
            'status': 'error',
            'message': '\n'.join(message_lines)
        }
    
    elif warning_duplications:
        # Medium similarity - potential duplicates, warn but allow
        message_lines = ["⚠️  Potentially similar functions detected:"]
        
        for dup in warning_duplications:
            message_lines.append(
                f"  • '{dup['new_function']}' similar to existing '{dup['existing_function']}' "
                f"(similarity: {dup['similarity_score']:.1%})"
            )
            message_lines.append(f"    Existing: {dup['existing_description']}")
        
        message_lines.append(f"\n📚 {total_existing} function(s) documented in README.md")
        message_lines.append("💭 If this is intentional, consider updating function registry")
        
        return {
            'status': 'warning',
            'message': '\n'.join(message_lines)
        }
    
    return {'status': 'success', 'message': 'No duplications detected'}

def main():
    try:
        # Read input data from stdin
        input_data = json.load(sys.stdin)
        
        tool_input = input_data.get("tool_input", {})
        file_path = tool_input.get("file_path", "")
        
        # Only check code files
        if not file_path:
            sys.exit(0)
        
        file_extension = os.path.splitext(file_path)[1]
        if file_extension not in ['.ts', '.tsx', '.js', '.jsx', '.py']:
            sys.exit(0)
        
        # Get the new code content
        new_code = tool_input.get("new_string", "")
        if not new_code:
            sys.exit(0)
        
        # Perform function registry check
        result = check_function_registry(file_path, new_code)
        
        if result['status'] == 'error':
            print(result['message'], file=sys.stderr)
            sys.exit(2)  # Block execution
        elif result['status'] == 'warning':
            print(result['message'], file=sys.stderr)
            sys.exit(0)  # Continue with warning
        elif result['status'] == 'suggestion':
            print(result['message'], file=sys.stderr)
            sys.exit(0)  # Continue with suggestion
        else:
            # Success
            print(result['message'], file=sys.stderr)
            sys.exit(0)
    
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON input: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        # Don't block development on unexpected errors
        print(f"Function registry hook error (non-blocking): {e}", file=sys.stderr)
        sys.exit(0)

if __name__ == "__main__":
    main()