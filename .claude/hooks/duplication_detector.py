#!/usr/bin/env python3
"""
Code Duplication Detector Hook
PostToolUse hook for detecting structural code similarity across features

Purpose: Detect code duplication between features to reduce technical debt
Priority: IMPORTANT
Execution Time: 8-20 seconds
Exit Codes: 0=success, 1=error, 2=fix_required
"""

import sys
import ast
import re
import hashlib
import difflib
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

# Add shared utilities to path
sys.path.insert(0, str(Path(__file__).parent / "shared"))
from hook_utils import (
    parse_hook_input,
    get_file_path_from_input,
    is_typescript_file,
    should_skip_file,
    log_hook_result,
    exit_with_message,
    get_project_root,
    is_in_feature_directory,
    get_feature_name,
    load_cache,
    save_cache,
    get_file_hash
)


class DuplicationResult:
    """Represents a code duplication finding"""
    
    def __init__(self, current_function: str, similar_function: str, 
                 similar_file: str, similarity: float, function_type: str = "function"):
        self.current_function = current_function
        self.similar_function = similar_function
        self.similar_file = similar_file
        self.similarity = similarity
        self.function_type = function_type
    
    def __str__(self):
        return (f"Function '{self.current_function}' is {self.similarity:.1f}% similar to "
                f"'{self.similar_function}' in {self.similar_file}")


class CodeFunction:
    """Represents a function/method extracted from code"""
    
    def __init__(self, name: str, code: str, file_path: str, start_line: int = 0):
        self.name = name
        self.code = code
        self.file_path = file_path
        self.start_line = start_line
        self.normalized_code = self._normalize_code(code)
        self.structural_hash = self._get_structural_hash()
    
    def _normalize_code(self, code: str) -> str:
        """Normalize code for comparison by removing whitespace and comments"""
        # Remove single-line comments
        code = re.sub(r'//.*?\n', '\n', code)
        # Remove multi-line comments
        code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
        # Normalize whitespace
        code = ' '.join(code.split())
        # Remove string literals for structural comparison
        code = re.sub(r'["\'][^"\']*["\']', '""', code)
        # Remove numeric literals
        code = re.sub(r'\b\d+\b', '0', code)
        return code
    
    def _get_structural_hash(self) -> str:
        """Get hash of normalized code structure"""
        return hashlib.md5(self.normalized_code.encode()).hexdigest()


class DuplicationDetector:
    """Detects code duplication across the project"""
    
    def __init__(self, similarity_threshold: float = 75.0):
        self.similarity_threshold = similarity_threshold
        self.warning_threshold = 60.0
        self.project_root = get_project_root()
    
    def analyze_file(self, file_path: str) -> List[DuplicationResult]:
        """
        Analyze file for duplications compared to other files
        Returns list of duplication results
        """
        if not is_typescript_file(file_path):
            return []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception:
            return []
        
        # Extract functions from current file
        current_functions = self._extract_functions(content, file_path)
        if not current_functions:
            return []
        
        # Find similar functions in other files
        duplications = []
        current_feature = get_feature_name(file_path)
        
        # Search across all TypeScript files in the project
        for target_file in self._get_comparison_files(file_path, current_feature):
            similarities = self._compare_with_file(current_functions, target_file)
            duplications.extend(similarities)
        
        return duplications
    
    def _extract_functions(self, content: str, file_path: str) -> List[CodeFunction]:
        """Extract functions from TypeScript/JavaScript content"""
        functions = []
        
        # TypeScript/JavaScript function patterns
        patterns = [
            # Function declarations: function name() {}
            r'function\s+(\w+)\s*\([^)]*\)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}',
            # Arrow functions: const name = () => {}
            r'(?:const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}',
            # Method definitions: methodName() {}
            r'(\w+)\s*\([^)]*\)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}',
            # React component functions: export const Component = () => {}
            r'export\s+(?:const|function)\s+(\w+)\s*(?:=\s*)?\([^)]*\)\s*(?:=>\s*)?\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}',
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
            for match in matches:
                name = match.group(1)
                code = match.group(2)
                
                # Skip very small functions (less than 3 lines of actual code)
                code_lines = [line.strip() for line in code.split('\n') if line.strip()]
                if len(code_lines) < 3:
                    continue
                
                # Calculate line number
                start_line = content[:match.start()].count('\n') + 1
                
                functions.append(CodeFunction(name, code, file_path, start_line))
        
        return functions
    
    def _get_comparison_files(self, current_file: str, current_feature: Optional[str]) -> List[str]:
        """Get list of files to compare against"""
        comparison_files = []
        
        # If in features directory, compare with other features
        if current_feature:
            features_dir = self.project_root / "features"
            if features_dir.exists():
                for feature_dir in features_dir.iterdir():
                    if (feature_dir.is_dir() and 
                        feature_dir.name != current_feature and
                        not feature_dir.name.startswith('.')):
                        
                        # Get TypeScript files in this feature
                        for ts_file in feature_dir.rglob("*.ts*"):
                            if (ts_file.suffix in ['.ts', '.tsx'] and
                                not should_skip_file(str(ts_file)) and
                                str(ts_file) != current_file):
                                comparison_files.append(str(ts_file))
        
        # Also compare with shared components and utilities
        shared_dirs = ['components', 'lib', 'hooks']
        for shared_dir in shared_dirs:
            shared_path = self.project_root / shared_dir
            if shared_path.exists():
                for ts_file in shared_path.rglob("*.ts*"):
                    if (ts_file.suffix in ['.ts', '.tsx'] and
                        not should_skip_file(str(ts_file)) and
                        str(ts_file) != current_file):
                        comparison_files.append(str(ts_file))
        
        return comparison_files[:20]  # Limit to avoid performance issues
    
    def _compare_with_file(self, current_functions: List[CodeFunction], 
                          target_file: str) -> List[DuplicationResult]:
        """Compare current functions with functions in target file"""
        try:
            with open(target_file, 'r', encoding='utf-8') as f:
                target_content = f.read()
        except Exception:
            return []
        
        target_functions = self._extract_functions(target_content, target_file)
        duplications = []
        
        for current_func in current_functions:
            for target_func in target_functions:
                # Skip if same function name and very different sizes
                size_ratio = len(current_func.code) / max(len(target_func.code), 1)
                if size_ratio < 0.3 or size_ratio > 3.0:
                    continue
                
                similarity = self._calculate_similarity(current_func, target_func)
                
                if similarity >= self.warning_threshold:
                    duplications.append(DuplicationResult(
                        current_func.name,
                        target_func.name,
                        target_file,
                        similarity
                    ))
        
        return duplications
    
    def _calculate_similarity(self, func1: CodeFunction, func2: CodeFunction) -> float:
        """Calculate similarity percentage between two functions"""
        # First check structural hash for exact matches
        if func1.structural_hash == func2.structural_hash:
            return 100.0
        
        # Use difflib for sequence matching on normalized code
        similarity = difflib.SequenceMatcher(
            None, 
            func1.normalized_code, 
            func2.normalized_code
        ).ratio()
        
        return similarity * 100
    
    def _get_cache_key(self, file_path: str) -> str:
        """Get cache key for file"""
        file_hash = get_file_hash(file_path)
        return f"{file_path}:{file_hash}"
    
    def check_cache(self, file_path: str) -> Optional[List[DuplicationResult]]:
        """Check if analysis is cached and file hasn't changed"""
        cache = load_cache("duplication_cache")
        cache_key = self._get_cache_key(file_path)
        
        cached_data = cache.get(cache_key)
        if cached_data:
            # Check if cache is recent (within 10 minutes)
            cache_time = cached_data.get("timestamp", 0)
            current_time = __import__('time').time()
            
            if current_time - cache_time < 600:  # 10 minutes
                # Reconstruct DuplicationResult objects
                results = []
                for item in cached_data.get("results", []):
                    results.append(DuplicationResult(
                        item["current_function"],
                        item["similar_function"],
                        item["similar_file"],
                        item["similarity"]
                    ))
                return results
        
        return None
    
    def update_cache(self, file_path: str, results: List[DuplicationResult]) -> None:
        """Update cache with analysis results"""
        cache = load_cache("duplication_cache")
        cache_key = self._get_cache_key(file_path)
        
        # Convert results to serializable format
        serializable_results = []
        for result in results:
            serializable_results.append({
                "current_function": result.current_function,
                "similar_function": result.similar_function,
                "similar_file": result.similar_file,
                "similarity": result.similarity
            })
        
        cache[cache_key] = {
            "results": serializable_results,
            "timestamp": __import__('time').time()
        }
        
        # Keep cache size reasonable (last 30 entries)
        if len(cache) > 30:
            sorted_items = sorted(
                cache.items(),
                key=lambda x: x[1].get("timestamp", 0),
                reverse=True
            )
            cache = dict(sorted_items[:30])
        
        save_cache("duplication_cache", cache)


def main():
    """Main hook execution"""
    try:
        # Parse input from Claude Code
        input_data = parse_hook_input()
        file_path = get_file_path_from_input(input_data)
        session_id = input_data.get("session_id", "unknown")
        
        # Skip if no file path
        if not file_path:
            exit_with_message(0, "No file path provided - skipping duplication check")
        
        # Skip non-TypeScript files
        if not is_typescript_file(file_path):
            exit_with_message(0, f"Skipping non-TypeScript file: {file_path}")
        
        # Skip files that should be ignored
        if should_skip_file(file_path):
            exit_with_message(0, f"Skipping ignored file: {file_path}")
        
        # Check if file exists
        if not Path(file_path).exists():
            exit_with_message(0, f"File does not exist: {file_path}")
        
        # Skip very small files
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if len(content) < 200:  # Very small files
                    exit_with_message(0, f"Skipping small file: {file_path}")
        except Exception:
            exit_with_message(0, f"Could not read file: {file_path}")
        
        # Initialize detector
        detector = DuplicationDetector(similarity_threshold=75.0)
        
        # Check cache first
        cached_results = detector.check_cache(file_path)
        if cached_results is not None:
            duplications = cached_results
            cache_used = True
        else:
            # Run duplication analysis
            duplications = detector.analyze_file(file_path)
            detector.update_cache(file_path, duplications)
            cache_used = False
        
        # Categorize results
        blocking_duplications = [d for d in duplications if d.similarity >= detector.similarity_threshold]
        warning_duplications = [d for d in duplications if detector.warning_threshold <= d.similarity < detector.similarity_threshold]
        
        # Log results
        log_hook_result(
            "duplication_detector",
            file_path,
            session_id,
            "blocked" if blocking_duplications else "success",
            {
                "blocking_count": len(blocking_duplications),
                "warning_count": len(warning_duplications),
                "cache_used": cache_used,
                "duplications": [str(d) for d in duplications]
            }
        )
        
        if blocking_duplications:
            # High similarity found - block and suggest refactoring
            error_msg = f"High code duplication detected in {file_path}"
            details = "🔍 Code Duplication Analysis:\n\n"
            
            for dup in blocking_duplications:
                details += f"❌ {dup}\n"
            
            details += f"\n💡 Consider extracting common logic to a shared utility or component."
            details += f"\n📁 Suggested locations: lib/utils/ or components/shared/"
            
            if warning_duplications:
                details += f"\n\n⚠️ Additional similarities to review:\n"
                for dup in warning_duplications[:3]:  # Show first 3
                    details += f"   {dup}\n"
            
            exit_with_message(2, error_msg, details)
        
        elif warning_duplications:
            # Medium similarity - warn but don't block
            warning_msg = f"Code similarities detected in {file_path}"
            details = "🔍 Consider reviewing these similarities:\n\n"
            
            for dup in warning_duplications[:5]:  # Show first 5
                details += f"⚠️ {dup}\n"
            
            details += f"\n💡 Consider refactoring if these are truly duplicated logic."
            
            print(details, file=sys.stderr)
            exit_with_message(0, f"Duplication check passed with warnings: {file_path}")
        
        else:
            # No significant duplication found
            cache_note = " (cached)" if cache_used else ""
            exit_with_message(0, f"No significant code duplication detected: {file_path}{cache_note}")
    
    except Exception as e:
        # Unexpected error - log and exit gracefully
        try:
            input_data = parse_hook_input() if 'input_data' not in locals() else input_data
            session_id = input_data.get("session_id", "unknown")
            file_path = get_file_path_from_input(input_data) if 'file_path' not in locals() else file_path
            
            log_hook_result(
                "duplication_detector",
                file_path or "unknown",
                session_id,
                "error",
                {"error": str(e)}
            )
        except:
            pass
        
        exit_with_message(1, f"Duplication detector hook error: {str(e)}")


if __name__ == "__main__":
    main()