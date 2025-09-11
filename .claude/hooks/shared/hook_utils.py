#!/usr/bin/env python3
"""
Shared utilities for Claude Code hooks
Provides common functionality for all PostToolUse quality gates
"""

import json
import sys
import subprocess
import os
import hashlib
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple


def parse_hook_input() -> Dict[str, Any]:
    """
    Standard hook input parsing from stdin
    Returns the parsed JSON data from Claude Code
    """
    try:
        return json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON input: {e}", file=sys.stderr)
        sys.exit(1)


def get_file_path_from_input(input_data: Dict[str, Any]) -> Optional[str]:
    """
    Extract file path from hook input data
    Returns None if no file path found
    """
    tool_input = input_data.get("tool_input", {})
    return tool_input.get("file_path")


def is_typescript_file(file_path: str) -> bool:
    """Check if file is TypeScript/JavaScript"""
    if not file_path:
        return False
    return file_path.endswith(('.ts', '.tsx', '.js', '.jsx'))


def is_react_component_file(file_path: str) -> bool:
    """Check if file is a React component"""
    if not file_path:
        return False
    return (
        file_path.endswith(('.tsx', '.jsx')) and 
        ('components' in file_path or 'component' in file_path)
    )


def is_client_side_file(file_path: str) -> bool:
    """Check if file affects client-side bundle"""
    if not file_path:
        return False
    
    client_patterns = [
        'app/',
        'components/',
        'features/*/components/',
        'features/*/hooks/',
        'lib/',
        'hooks/'
    ]
    
    path = Path(file_path)
    for pattern in client_patterns:
        if path.match(pattern):
            return True
    return False


def should_skip_file(file_path: str) -> bool:
    """Check if file should be skipped (tests, generated, etc.)"""
    if not file_path:
        return True
    
    skip_patterns = [
        '*.test.*',
        '*.spec.*',
        '*.d.ts',
        '*/node_modules/*',
        '*/dist/*',
        '*/build/*',
        '*/coverage/*',
        '*/__tests__/*',
        '*/generated/*'
    ]
    
    path = Path(file_path)
    for pattern in skip_patterns:
        if path.match(pattern):
            return True
    return False


def run_command_with_timeout(
    command: List[str], 
    timeout: int = 30,
    cwd: Optional[str] = None
) -> subprocess.CompletedProcess:
    """
    Run subprocess command with timeout and error handling
    Returns CompletedProcess result
    """
    try:
        return subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=cwd
        )
    except subprocess.TimeoutExpired:
        raise TimeoutError(f"Command timed out after {timeout} seconds: {' '.join(command)}")
    except FileNotFoundError:
        raise FileNotFoundError(f"Command not found: {command[0]}")


def get_file_hash(file_path: str) -> str:
    """Get file content hash for caching"""
    try:
        with open(file_path, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except Exception:
        return ""


def ensure_cache_dir() -> Path:
    """Ensure cache directory exists and return path"""
    cache_dir = Path(__file__).parent.parent / "cache"
    cache_dir.mkdir(exist_ok=True)
    return cache_dir


def load_cache(cache_name: str) -> Dict[str, Any]:
    """Load cache data from JSON file"""
    cache_file = ensure_cache_dir() / f"{cache_name}.json"
    if cache_file.exists():
        try:
            with open(cache_file, 'r') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_cache(cache_name: str, data: Dict[str, Any]) -> None:
    """Save cache data to JSON file"""
    cache_file = ensure_cache_dir() / f"{cache_name}.json"
    try:
        with open(cache_file, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Warning: Failed to save cache {cache_name}: {e}", file=sys.stderr)


def log_hook_result(
    hook_name: str, 
    file_path: str, 
    session_id: str, 
    result: str, 
    details: Optional[Dict[str, Any]] = None
) -> None:
    """Log hook execution result"""
    cache_dir = ensure_cache_dir()
    log_file = cache_dir / f"{hook_name}_log.json"
    
    log_entry = {
        "session_id": session_id,
        "file_path": file_path,
        "result": result,
        "timestamp": __import__('datetime').datetime.now().isoformat(),
        "details": details or {}
    }
    
    # Load existing logs
    logs = []
    if log_file.exists():
        try:
            with open(log_file, 'r') as f:
                logs = json.load(f)
        except Exception:
            logs = []
    
    logs.append(log_entry)
    
    # Keep only last 100 entries
    if len(logs) > 100:
        logs = logs[-100:]
    
    # Save logs
    try:
        with open(log_file, 'w') as f:
            json.dump(logs, f, indent=2)
    except Exception as e:
        print(f"Warning: Failed to save log: {e}", file=sys.stderr)


def exit_with_message(code: int, message: str, details: Optional[str] = None) -> None:
    """
    Exit hook with standardized message format
    
    Args:
        code: Exit code (0=success, 1=error, 2=fix_required)
        message: Main message to display
        details: Optional detailed information
    """
    if code == 0:
        prefix = "✅"
    elif code == 1:
        prefix = "⚠️"
    else:  # code == 2
        prefix = "❌"
    
    print(f"{prefix} {message}", file=sys.stderr)
    if details:
        print(details, file=sys.stderr)
    
    sys.exit(code)


def get_project_root() -> Path:
    """Get project root directory"""
    current = Path.cwd()
    while current != current.parent:
        if (current / "package.json").exists():
            return current
        current = current.parent
    return Path.cwd()


def is_in_feature_directory(file_path: str) -> bool:
    """Check if file is in features directory"""
    return 'features/' in file_path


def get_feature_name(file_path: str) -> Optional[str]:
    """Extract feature name from file path"""
    if not is_in_feature_directory(file_path):
        return None
    
    parts = file_path.split('/')
    try:
        features_idx = parts.index('features')
        if len(parts) > features_idx + 1:
            return parts[features_idx + 1]
    except ValueError:
        pass
    
    return None


def safe_file_operation(func, *args, **kwargs):
    """
    Safely execute file operation with error handling
    """
    try:
        return func(*args, **kwargs)
    except PermissionError:
        print("Permission denied accessing file", file=sys.stderr)
        return None
    except FileNotFoundError:
        print("File not found", file=sys.stderr)
        return None
    except Exception as e:
        print(f"File operation error: {e}", file=sys.stderr)
        return None