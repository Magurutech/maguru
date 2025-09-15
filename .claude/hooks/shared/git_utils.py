"""
Git utilities for Claude Code hooks.
Provides common Git operations and status checking functionality.
"""

import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta


class GitUtils:
    """Utility class for Git operations and status checking."""
    
    def __init__(self, project_root: Optional[Path] = None):
        self.project_root = project_root or Path.cwd()
    
    def get_modified_files(self, since_hours: int = 1) -> List[str]:
        """Get list of files modified in the last N hours."""
        try:
            # Try to get files modified since specific time
            since_time = datetime.now() - timedelta(hours=since_hours)
            since_str = since_time.strftime("%Y-%m-%d %H:%M:%S")
            
            result = subprocess.run([
                "git", "diff", "--name-only",
                f"--since={since_str}"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode == 0 and result.stdout.strip():
                return [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]
            
        except Exception:
            pass
        
        # Fallback: get unstaged changes
        return self.get_unstaged_changes()
    
    def get_unstaged_changes(self) -> List[str]:
        """Get list of unstaged changes."""
        try:
            result = subprocess.run([
                "git", "diff", "--name-only"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode == 0:
                return [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]
            
        except Exception:
            pass
        
        return []
    
    def get_staged_changes(self) -> List[str]:
        """Get list of staged changes."""
        try:
            result = subprocess.run([
                "git", "diff", "--cached", "--name-only"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode == 0:
                return [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]
            
        except Exception:
            pass
        
        return []
    
    def get_untracked_files(self) -> List[str]:
        """Get list of untracked files."""
        try:
            result = subprocess.run([
                "git", "ls-files", "--others", "--exclude-standard"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode == 0:
                return [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]
            
        except Exception:
            pass
        
        return []
    
    def get_current_branch(self) -> str:
        """Get the current git branch name."""
        try:
            result = subprocess.run([
                "git", "branch", "--show-current"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode == 0:
                return result.stdout.strip()
            
        except Exception:
            pass
        
        return "unknown"
    
    def get_status_summary(self) -> Dict[str, Any]:
        """Get comprehensive git status summary."""
        try:
            # Get porcelain status
            result = subprocess.run([
                "git", "status", "--porcelain"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode != 0:
                return {"error": "Could not get git status"}
            
            status_lines = result.stdout.strip().split('\n') if result.stdout.strip() else []
            
            # Parse status indicators
            staged_files = []
            unstaged_files = []
            untracked_files = []
            
            for line in status_lines:
                if len(line) < 3:
                    continue
                
                index_status = line[0]
                worktree_status = line[1]
                filename = line[3:].strip()
                
                if index_status in 'MADRC':  # Staged changes
                    staged_files.append(filename)
                
                if worktree_status in 'MD':  # Unstaged changes  
                    unstaged_files.append(filename)
                
                if index_status == '?' and worktree_status == '?':  # Untracked
                    untracked_files.append(filename)
            
            current_branch = self.get_current_branch()
            
            return {
                "current_branch": current_branch,
                "is_clean": len(status_lines) == 0,
                "staged_files": staged_files,
                "unstaged_files": unstaged_files,
                "untracked_files": untracked_files,
                "total_changes": len(status_lines)
            }
            
        except Exception as e:
            return {"error": f"Git status check failed: {str(e)}"}
    
    def get_recent_commits(self, count: int = 5) -> List[Dict[str, str]]:
        """Get recent commit history."""
        try:
            result = subprocess.run([
                "git", "log", 
                f"--max-count={count}",
                "--pretty=format:%H|%s|%an|%ar"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode != 0:
                return []
            
            commits = []
            for line in result.stdout.strip().split('\n'):
                if line.strip():
                    parts = line.split('|', 3)
                    if len(parts) == 4:
                        commits.append({
                            "hash": parts[0][:8],  # Short hash
                            "message": parts[1],
                            "author": parts[2],
                            "date": parts[3]
                        })
            
            return commits
            
        except Exception:
            return []
    
    def is_repository_clean(self) -> bool:
        """Check if the repository has no uncommitted changes."""
        status = self.get_status_summary()
        return status.get("is_clean", False)
    
    def has_uncommitted_changes(self) -> bool:
        """Check if there are uncommitted changes (staged or unstaged)."""
        status = self.get_status_summary()
        return (
            len(status.get("staged_files", [])) > 0 or
            len(status.get("unstaged_files", [])) > 0
        )
    
    def get_branch_info(self) -> Dict[str, Any]:
        """Get detailed branch information."""
        try:
            current_branch = self.get_current_branch()
            
            # Get branch commit count ahead/behind origin
            ahead_behind = {"ahead": 0, "behind": 0}
            try:
                result = subprocess.run([
                    "git", "rev-list", "--left-right", "--count",
                    f"origin/{current_branch}...HEAD"
                ], capture_output=True, text=True, cwd=self.project_root)
                
                if result.returncode == 0:
                    parts = result.stdout.strip().split('\t')
                    if len(parts) == 2:
                        ahead_behind = {
                            "behind": int(parts[0]),
                            "ahead": int(parts[1])
                        }
            except Exception:
                pass
            
            return {
                "current_branch": current_branch,
                "ahead": ahead_behind["ahead"],
                "behind": ahead_behind["behind"],
                "needs_push": ahead_behind["ahead"] > 0,
                "needs_pull": ahead_behind["behind"] > 0
            }
            
        except Exception:
            return {
                "current_branch": "unknown",
                "ahead": 0,
                "behind": 0, 
                "needs_push": False,
                "needs_pull": False
            }
    
    def get_files_changed_since_commit(self, commit_hash: str) -> List[str]:
        """Get files changed since a specific commit."""
        try:
            result = subprocess.run([
                "git", "diff", "--name-only", f"{commit_hash}..HEAD"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode == 0:
                return [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]
            
        except Exception:
            pass
        
        return []
    
    def get_commit_stats(self) -> Dict[str, Any]:
        """Get statistics about recent commits."""
        try:
            # Get commits in last 24 hours
            result = subprocess.run([
                "git", "log", "--since=24.hours.ago", "--oneline"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            commits_today = len(result.stdout.strip().split('\n')) if result.stdout.strip() else 0
            
            # Get total commits
            result = subprocess.run([
                "git", "rev-list", "--count", "HEAD"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            total_commits = int(result.stdout.strip()) if result.returncode == 0 else 0
            
            return {
                "commits_today": commits_today,
                "total_commits": total_commits,
                "active_development": commits_today > 0
            }
            
        except Exception:
            return {
                "commits_today": 0,
                "total_commits": 0,
                "active_development": False
            }