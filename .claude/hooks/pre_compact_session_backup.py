#!/usr/bin/env python3

import json
import sys
import re
import subprocess
import os
import hashlib
from datetime import datetime
from pathlib import Path

def get_git_info():
    """Get current git branch and status information."""
    try:
        # Get current branch
        branch_result = subprocess.run(
            ["git", "branch", "--show-current"], 
            capture_output=True, text=True, timeout=1
        )
        current_branch = branch_result.stdout.strip() if branch_result.returncode == 0 else "unknown"
        
        # Get git status
        status_result = subprocess.run(
            ["git", "status", "--porcelain"], 
            capture_output=True, text=True, timeout=1
        )
        
        if status_result.returncode == 0:
            status_lines = status_result.stdout.strip().split('\n') if status_result.stdout.strip() else []
            modified_files = len([line for line in status_lines if line.startswith(' M') or line.startswith('M')])
            untracked_files = len([line for line in status_lines if line.startswith('??')])
            uncommitted_changes = len(status_lines) > 0
        else:
            modified_files = 0
            untracked_files = 0
            uncommitted_changes = False
            
        return {
            "branch": current_branch,
            "uncommitted_changes": uncommitted_changes,
            "modified_files": modified_files,
            "untracked_files": untracked_files
        }
    except Exception as e:
        return {
            "branch": "unknown",
            "uncommitted_changes": False,
            "modified_files": 0,
            "untracked_files": 0,
            "error": str(e)
        }

def detect_current_feature():
    """Detect which feature is currently being worked on based on modified files."""
    try:
        # Get list of modified files
        result = subprocess.run(
            ["git", "diff", "--name-only", "HEAD"], 
            capture_output=True, text=True, timeout=1
        )
        
        if result.returncode != 0:
            return "unknown"
            
        modified_files = result.stdout.strip().split('\n') if result.stdout.strip() else []
        
        # Also check unstaged changes
        unstaged_result = subprocess.run(
            ["git", "diff", "--name-only"], 
            capture_output=True, text=True, timeout=1
        )
        
        if unstaged_result.returncode == 0 and unstaged_result.stdout.strip():
            modified_files.extend(unstaged_result.stdout.strip().split('\n'))
        
        # Remove duplicates
        modified_files = list(set(modified_files))
        
        # Detect feature based on file paths
        feature_patterns = {
            'course': [r'features/course/', r'app/course/', r'course'],
            'auth': [r'features/auth/', r'app/auth/', r'auth'],
            'user_manage': [r'features/user_manage/', r'app/user/', r'user'],
            'homepage': [r'features/homepage/', r'app/(home)', r'homepage']
        }
        
        feature_scores = {feature: 0 for feature in feature_patterns}
        
        for file_path in modified_files:
            for feature, patterns in feature_patterns.items():
                for pattern in patterns:
                    if re.search(pattern, file_path, re.IGNORECASE):
                        feature_scores[feature] += 1
        
        # Return the feature with highest score, or 'general' if no clear winner
        if max(feature_scores.values()) == 0:
            return "general"
        
        return max(feature_scores, key=feature_scores.get)
        
    except Exception:
        return "general"

def detect_task_type(git_branch):
    """Detect task type based on git branch naming patterns."""
    if not git_branch or git_branch == "unknown":
        return "general"
    
    branch_lower = git_branch.lower()
    
    if any(keyword in branch_lower for keyword in ['feature/', 'feat/']):
        return "feature"
    elif any(keyword in branch_lower for keyword in ['fix/', 'bugfix/', 'hotfix/']):
        return "bugfix"
    elif any(keyword in branch_lower for keyword in ['refactor/', 'refact/']):
        return "refactor"
    elif any(keyword in branch_lower for keyword in ['docs/', 'doc/']):
        return "docs"
    elif any(keyword in branch_lower for keyword in ['test/', 'tests/']):
        return "test"
    else:
        return "general"

def generate_session_id(feature, task_type):
    """Generate unique session ID with format: YYYYMMDD-{feature}-{type}-{hash}"""
    now = datetime.now()
    date_str = now.strftime("%Y%m%d")
    time_str = now.strftime("%H%M%S")
    
    # Create a short hash based on timestamp and random factors
    hash_input = f"{time_str}{os.getpid()}{feature}{task_type}".encode()
    short_hash = hashlib.md5(hash_input).hexdigest()[:5]
    
    return f"{date_str}-{feature}-{task_type}-{short_hash}"

def get_active_files():
    """Get list of currently modified/active files."""
    try:
        active_files = []
        
        # Get staged files
        staged_result = subprocess.run(
            ["git", "diff", "--name-only", "--cached"], 
            capture_output=True, text=True, timeout=1
        )
        if staged_result.returncode == 0 and staged_result.stdout.strip():
            active_files.extend(staged_result.stdout.strip().split('\n'))
        
        # Get unstaged files
        unstaged_result = subprocess.run(
            ["git", "diff", "--name-only"], 
            capture_output=True, text=True, timeout=1
        )
        if unstaged_result.returncode == 0 and unstaged_result.stdout.strip():
            active_files.extend(unstaged_result.stdout.strip().split('\n'))
        
        # Get untracked files in project directories
        untracked_result = subprocess.run(
            ["git", "ls-files", "--others", "--exclude-standard"], 
            capture_output=True, text=True, timeout=1
        )
        if untracked_result.returncode == 0 and untracked_result.stdout.strip():
            untracked_files = untracked_result.stdout.strip().split('\n')
            # Only include files in relevant directories
            relevant_untracked = [
                f for f in untracked_files 
                if any(keyword in f for keyword in ['features/', 'app/', 'components/', 'lib/'])
            ]
            active_files.extend(relevant_untracked)
        
        # Remove duplicates and empty strings
        active_files = list(set(f for f in active_files if f.strip()))
        
        return active_files
        
    except Exception:
        return []

def create_session_context(session_id, feature, task_type, git_info, active_files):
    """Create the context.json data structure."""
    now = datetime.now()
    
    return {
        "session_id": session_id,
        "timestamp": now.isoformat() + "Z",
        "project": "maguru",
        "current_feature": feature,
        "active_files": active_files[:10],  # Limit to first 10 files
        "git_branch": git_info["branch"],
        "git_status": {
            "uncommitted_changes": git_info["uncommitted_changes"],
            "modified_files": git_info["modified_files"],
            "untracked_files": git_info["untracked_files"]
        },
        "current_task": f"Working on {feature} {task_type}",
        "task_type": task_type,
        "session_context": {
            "trigger": "pre_compaction",
            "context_status": "backup_created"
        }
    }

def create_session_summary(session_id, context_data):
    """Create the summary.md content."""
    now = datetime.now()
    
    md_content = f"""# Session Summary - {session_id}

Generated: {now.strftime("%Y-%m-%d %H:%M:%S")}

## 🎯 Current Context
- **Feature**: {context_data['current_feature'].title()}
- **Task Type**: {context_data['task_type'].title()}  
- **Branch**: `{context_data['git_branch']}`
- **Files**: {context_data['git_status']['modified_files']} modified, {context_data['git_status']['untracked_files']} untracked

## 📁 Active Files
"""
    
    for file_path in context_data['active_files'][:5]:  # Show first 5 files
        md_content += f"- `{file_path}`\n"
    
    if len(context_data['active_files']) > 5:
        md_content += f"- ... and {len(context_data['active_files']) - 5} more files\n"
    
    md_content += f"""
## 🏗️ Session Information
- **Project**: Maguru E-Learning Platform
- **Framework**: Next.js 15.3.4 with TypeScript
- **Architecture**: Feature-first modular monolith
- **Current Focus**: {context_data['current_task']}

## 📋 Context Backup
This session context was automatically backed up during Claude Code compaction process.

## 🔧 Technical Context
- **Environment**: Development  
- **Package Manager**: Yarn
- **Git Branch**: {context_data['git_branch']}
- **Uncommitted Changes**: {'Yes' if context_data['git_status']['uncommitted_changes'] else 'No'}
"""
    
    return md_content

def create_session_metadata(session_id, context_data):
    """Create the metadata.json data."""
    now = datetime.now()
    
    return {
        "created_at": now.isoformat() + "Z",
        "session_id": session_id,
        "project_name": "maguru",
        "trigger_type": "automatic_compaction",
        "hook_version": "1.0.0",
        "context_details": {
            "feature": context_data['current_feature'],
            "task_type": context_data['task_type'],
            "git_branch": context_data['git_branch'],
            "active_files_count": len(context_data['active_files'])
        }
    }

def update_sessions_index(session_id, context_data, precompact_dir):
    """Update or create the sessions index file."""
    index_file = precompact_dir / "sessions_index.json"
    
    try:
        # Load existing index or create new one
        if index_file.exists():
            with open(index_file, 'r', encoding='utf-8') as f:
                index_data = json.load(f)
        else:
            index_data = {"sessions": [], "stats": {"total_sessions": 0}}
        
        # Add new session entry
        session_entry = {
            "session_id": session_id,
            "created_at": context_data['timestamp'],
            "feature": context_data['current_feature'],
            "task_type": context_data['task_type'],
            "git_branch": context_data['git_branch'],
            "active_files_count": len(context_data['active_files'])
        }
        
        index_data["sessions"].append(session_entry)
        index_data["stats"]["total_sessions"] = len(index_data["sessions"])
        index_data["stats"]["last_updated"] = context_data['timestamp']
        
        # Keep only last 50 sessions to prevent bloat
        if len(index_data["sessions"]) > 50:
            index_data["sessions"] = index_data["sessions"][-50:]
            index_data["stats"]["total_sessions"] = 50
        
        # Save updated index
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2, ensure_ascii=False)
            
    except Exception as e:
        # Non-blocking error - just log it
        print(f"Warning: Could not update sessions index: {e}", file=sys.stderr)

def main():
    try:
        # Read input data from stdin
        input_data = json.load(sys.stdin)
        
        print("🔄 PreCompact hook: Starting session backup...", file=sys.stderr)
        
        # Detect current context
        git_info = get_git_info()
        current_feature = detect_current_feature()
        task_type = detect_task_type(git_info["branch"])
        active_files = get_active_files()
        
        # Generate unique session ID
        session_id = generate_session_id(current_feature, task_type)
        
        # Create precompact directory structure
        precompact_dir = Path(__file__).parent.parent / "precompact"
        session_dir = precompact_dir / session_id
        
        # Create directories if they don't exist
        precompact_dir.mkdir(exist_ok=True)
        session_dir.mkdir(exist_ok=True)
        
        # Create context data
        context_data = create_session_context(session_id, current_feature, task_type, git_info, active_files)
        
        # Generate and save context.json
        with open(session_dir / "context.json", 'w', encoding='utf-8') as f:
            json.dump(context_data, f, indent=2, ensure_ascii=False)
        
        # Generate and save summary.md
        summary_content = create_session_summary(session_id, context_data)
        with open(session_dir / "summary.md", 'w', encoding='utf-8') as f:
            f.write(summary_content)
        
        # Generate and save metadata.json
        metadata = create_session_metadata(session_id, context_data)
        with open(session_dir / "metadata.json", 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        # Update sessions index
        update_sessions_index(session_id, context_data, precompact_dir)
        
        print(f"✅ PreCompact backup completed: {session_id}", file=sys.stderr)
        print(f"📁 Session saved to: .claude/precompact/{session_id}/", file=sys.stderr)
        
        # Exit with success
        sys.exit(0)
        
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON input: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error in PreCompact hook: {e}", file=sys.stderr)
        # Non-blocking exit - don't prevent compaction
        sys.exit(0)

if __name__ == "__main__":
    main()