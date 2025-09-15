#!/usr/bin/env python3
"""
Quick TypeScript Type Check Hook
PostToolUse hook for incremental TypeScript validation

Purpose: Validate TypeScript compilation errors after file edits
Priority: CRITICAL
Execution Time: 5-15 seconds
Exit Codes: 0=success, 1=error, 2=fix_required
"""

import sys
import os
import re
from pathlib import Path

# Add shared utilities to path
sys.path.insert(0, str(Path(__file__).parent / "shared"))
from hook_utils import (
    parse_hook_input,
    get_file_path_from_input,
    is_typescript_file,
    should_skip_file,
    run_command_with_timeout,
    log_hook_result,
    exit_with_message,
    get_project_root,
    load_cache,
    save_cache,
    get_file_hash
)


def get_tsconfig_path(file_path: str) -> str:
    """Find the appropriate tsconfig.json for the file"""
    project_root = get_project_root()
    file_dir = Path(file_path).parent
    
    # Look for tsconfig.json in file directory and parents
    current = Path(file_dir)
    while current >= project_root:
        tsconfig = current / "tsconfig.json"
        if tsconfig.exists():
            return str(tsconfig)
        current = current.parent
    
    # Fall back to project root tsconfig
    return str(project_root / "tsconfig.json")


def run_incremental_type_check(file_path: str) -> tuple[bool, str]:
    """
    Run incremental TypeScript type checking on specific file
    Returns (success, output) tuple
    """
    project_root = get_project_root()
    
    try:
        # Use yarn type-check with specific file focus
        # Note: We check the specific file but the command checks project-wide
        # for better accuracy of type relationships
        result = run_command_with_timeout([
            "yarn", "type-check"
        ], timeout=30, cwd=str(project_root))
        
        # If no errors, type check passed
        if result.returncode == 0:
            return True, "TypeScript compilation successful"
        
        # Parse TypeScript errors to see if they relate to our file
        error_output = result.stderr or result.stdout
        file_specific_errors = extract_file_specific_errors(error_output, file_path)
        
        if file_specific_errors:
            return False, file_specific_errors
        
        # If errors exist but not for our file, still report them
        # as they might be related (imports, dependencies, etc.)
        if error_output:
            return False, f"TypeScript compilation failed:\n{error_output}"
        
        return False, "TypeScript compilation failed with unknown error"
        
    except TimeoutError:
        return False, "TypeScript check timed out (>30s)"
    except FileNotFoundError:
        return False, "TypeScript compiler not available (yarn type-check failed)"
    except Exception as e:
        return False, f"TypeScript check error: {str(e)}"


def extract_file_specific_errors(error_output: str, file_path: str) -> str:
    """
    Extract errors specific to the edited file
    Returns formatted error string or empty if no file-specific errors
    """
    if not error_output:
        return ""
    
    file_name = Path(file_path).name
    file_path_normalized = Path(file_path).as_posix()
    
    relevant_lines = []
    lines = error_output.split('\n')
    
    for i, line in enumerate(lines):
        # Check if line contains our file
        if (file_name in line or 
            file_path_normalized in line or
            file_path in line):
            relevant_lines.append(line)
            
            # Include next few lines that might contain error details
            for j in range(i + 1, min(i + 4, len(lines))):
                next_line = lines[j].strip()
                if next_line and not next_line.startswith(('error TS', 'Found ', 'npm ERR!')):
                    relevant_lines.append(lines[j])
                else:
                    break
    
    if relevant_lines:
        return '\n'.join(relevant_lines)
    
    # If no file-specific errors found, but there are errors,
    # return first few error lines as they might be related
    error_lines = [line for line in lines if 'error TS' in line]
    if error_lines:
        return '\n'.join(error_lines[:3])  # First 3 errors
    
    return ""


def check_type_cache(file_path: str) -> bool:
    """
    Check if file was recently type-checked and hasn't changed
    Returns True if cached result is valid (no need to re-check)
    """
    cache = load_cache("type_check_cache")
    file_hash = get_file_hash(file_path)
    
    if not file_hash:
        return False
    
    cached_data = cache.get(file_path)
    if not cached_data:
        return False
    
    # Check if file hash matches (file unchanged)
    if cached_data.get("hash") == file_hash:
        # Check if cache is recent (within 5 minutes)
        cache_time = cached_data.get("timestamp", 0)
        current_time = __import__('time').time()
        
        if current_time - cache_time < 300:  # 5 minutes
            return cached_data.get("success", False)
    
    return False


def update_type_cache(file_path: str, success: bool) -> None:
    """Update type check cache with result"""
    cache = load_cache("type_check_cache")
    file_hash = get_file_hash(file_path)
    
    cache[file_path] = {
        "hash": file_hash,
        "success": success,
        "timestamp": __import__('time').time()
    }
    
    # Keep cache size reasonable (last 50 files)
    if len(cache) > 50:
        # Keep only most recent entries
        sorted_items = sorted(
            cache.items(), 
            key=lambda x: x[1].get("timestamp", 0), 
            reverse=True
        )
        cache = dict(sorted_items[:50])
    
    save_cache("type_check_cache", cache)


def main():
    """Main hook execution"""
    try:
        # Parse input from Claude Code
        input_data = parse_hook_input()
        file_path = get_file_path_from_input(input_data)
        session_id = input_data.get("session_id", "unknown")
        
        # Skip if no file path
        if not file_path:
            exit_with_message(0, "No file path provided - skipping type check")
        
        # Skip non-TypeScript files
        if not is_typescript_file(file_path):
            exit_with_message(0, f"Skipping non-TypeScript file: {file_path}")
        
        # Skip files that should be ignored
        if should_skip_file(file_path):
            exit_with_message(0, f"Skipping ignored file: {file_path}")
        
        # Check if file exists
        if not Path(file_path).exists():
            exit_with_message(0, f"File does not exist: {file_path}")
        
        # Check cache first for performance
        if check_type_cache(file_path):
            log_hook_result("quick_type_check", file_path, session_id, "cached_success")
            exit_with_message(0, f"TypeScript validation passed (cached): {file_path}")
        
        # Run TypeScript type check
        success, output = run_incremental_type_check(file_path)
        
        # Update cache
        update_type_cache(file_path, success)
        
        # Log result
        log_hook_result(
            "quick_type_check", 
            file_path, 
            session_id, 
            "success" if success else "failed",
            {"output": output}
        )
        
        if success:
            exit_with_message(0, f"TypeScript validation passed: {file_path}")
        else:
            # Format error message for Claude
            error_msg = f"TypeScript validation failed: {file_path}"
            details = f"{output}\n\n💡 Fix the TypeScript errors above and I'll try again."
            exit_with_message(2, error_msg, details)
    
    except Exception as e:
        # Unexpected error - log and exit gracefully
        try:
            input_data = parse_hook_input() if 'input_data' not in locals() else input_data
            session_id = input_data.get("session_id", "unknown")
            file_path = get_file_path_from_input(input_data) if 'file_path' not in locals() else file_path
            
            log_hook_result(
                "quick_type_check", 
                file_path or "unknown", 
                session_id, 
                "error",
                {"error": str(e)}
            )
        except:
            pass
        
        exit_with_message(1, f"TypeScript check hook error: {str(e)}")


if __name__ == "__main__":
    main()