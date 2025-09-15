#!/usr/bin/env python3
"""
SessionEnd Hook: Cleanup and Report
Comprehensive session lifecycle management that runs at the end of development sessions.

This hook provides:
- Session summary generation (files modified, features touched)
- Quality metrics assessment (TypeScript, ESLint status)  
- Git status analysis and recommendations
- Next session task suggestions
- Temporary file cleanup and resource management
- Cross-session continuity preparation
- Development insights and analytics

Outputs session summary and prepares context for future sessions.
"""

import sys
import json
import os
import shutil
import glob
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Any, List

# Add shared utilities to path
sys.path.insert(0, str(Path(__file__).parent / "shared"))

from project_analyzer import ProjectAnalyzer
from git_utils import GitUtils
from quality_checker import QualityChecker
from context_manager import ContextManager


class SessionManager:
    """Comprehensive session lifecycle manager for session end."""
    
    def __init__(self):
        self.project_root = Path.cwd()
        self.claude_dir = self.project_root / ".claude"
        self.analyzer = ProjectAnalyzer(self.project_root)
        self.git_utils = GitUtils(self.project_root)
        self.quality_checker = QualityChecker(self.project_root)
        self.context_manager = ContextManager(self.project_root)
    
    def generate_session_summary(self) -> Dict[str, Any]:
        """Generate comprehensive session summary."""
        start_time = datetime.now()
        
        # Get session data
        modified_files = self.get_modified_files()
        features_analysis = self.analyze_features_worked_on(modified_files)
        quality_metrics = self.assess_quality_improvements()
        git_analysis = self.analyze_git_status()
        development_insights = self.generate_development_insights(modified_files, features_analysis)
        next_tasks = self.suggest_next_tasks(quality_metrics, git_analysis)
        
        end_time = datetime.now()
        analysis_duration = (end_time - start_time).total_seconds()
        
        session_summary = {
            "session_end": end_time.isoformat(),
            "analysis_duration": round(analysis_duration, 2),
            "files_modified": modified_files,
            "features_analysis": features_analysis,
            "quality_metrics": quality_metrics,
            "git_analysis": git_analysis,
            "development_insights": development_insights,
            "next_session_tasks": next_tasks,
            "session_statistics": self.calculate_session_statistics(modified_files, features_analysis)
        }
        
        return session_summary
    
    def get_modified_files(self) -> List[str]:
        """Get comprehensive list of files modified in this session."""
        modified_files = []
        
        # Try multiple strategies to capture all modified files
        strategies = [
            lambda: self.git_utils.get_modified_files(since_hours=1),
            lambda: self.git_utils.get_modified_files(since_hours=3),
            lambda: self.git_utils.get_unstaged_changes(),
            lambda: self.git_utils.get_staged_changes()
        ]
        
        all_files = set()
        for strategy in strategies:
            try:
                files = strategy()
                all_files.update(files)
            except Exception:
                continue
        
        # Filter out non-relevant files
        relevant_extensions = {'.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md', '.py'}
        exclude_patterns = ['node_modules', '.next', 'dist', 'build', '__pycache__']
        
        for file_path in all_files:
            # Check extension
            if Path(file_path).suffix in relevant_extensions:
                # Check exclude patterns
                if not any(pattern in file_path for pattern in exclude_patterns):
                    modified_files.append(file_path)
        
        return list(set(modified_files))  # Remove duplicates
    
    def analyze_features_worked_on(self, modified_files: List[str]) -> Dict[str, Any]:
        """Analyze which features were worked on based on modified files."""
        features_touched = set()
        file_categories = {
            "components": [],
            "pages": [],
            "hooks": [],
            "services": [],
            "tests": [],
            "config": [],
            "documentation": []
        }
        
        for file_path in modified_files:
            path = Path(file_path)
            
            # Extract feature from path
            if file_path.startswith('features/'):
                parts = file_path.split('/')
                if len(parts) > 1:
                    features_touched.add(parts[1])
            elif file_path.startswith('app/'):
                parts = file_path.split('/')
                if len(parts) > 1:
                    features_touched.add(parts[1])
            
            # Categorize file types
            if 'component' in file_path.lower() or path.suffix in ['.tsx', '.jsx']:
                file_categories["components"].append(file_path)
            elif 'page' in file_path.lower() or '/app/' in file_path:
                file_categories["pages"].append(file_path)
            elif 'hook' in file_path.lower() or file_path.startswith('hooks/'):
                file_categories["hooks"].append(file_path)
            elif 'service' in file_path.lower() or 'adapter' in file_path.lower():
                file_categories["services"].append(file_path)
            elif 'test' in file_path.lower() or 'spec' in file_path.lower():
                file_categories["tests"].append(file_path)
            elif path.suffix == '.json' or 'config' in file_path.lower():
                file_categories["config"].append(file_path)
            elif path.suffix == '.md':
                file_categories["documentation"].append(file_path)
        
        # Analyze development patterns
        development_focus = self.determine_development_focus(file_categories)
        complexity_assessment = self.assess_work_complexity(modified_files, features_touched)
        
        return {
            "features_touched": list(features_touched),
            "file_categories": {k: len(v) for k, v in file_categories.items()},
            "detailed_files": file_categories,
            "development_focus": development_focus,
            "complexity_assessment": complexity_assessment,
            "total_files_modified": len(modified_files)
        }
    
    def assess_quality_improvements(self) -> Dict[str, Any]:
        """Assess code quality improvements made during session."""
        try:
            # Get current quality metrics
            quality_metrics = self.quality_checker.get_quality_metrics()
            
            # Try to compare with previous session if available
            previous_session = self.context_manager.load_latest_session_report()
            previous_quality = previous_session.get("quality_metrics", {})
            
            # Calculate improvements
            improvements = {}
            if previous_quality:
                for metric, current_value in quality_metrics.items():
                    if metric in previous_quality:
                        previous_value = previous_quality[metric]
                        if isinstance(current_value, bool) and isinstance(previous_value, bool):
                            improvements[metric] = {
                                "improved": current_value and not previous_value,
                                "maintained": current_value == previous_value,
                                "regressed": not current_value and previous_value
                            }
            
            return {
                "current_metrics": quality_metrics,
                "previous_metrics": previous_quality,
                "improvements": improvements,
                "overall_quality_trend": self.calculate_quality_trend(improvements)
            }
            
        except Exception as e:
            return {
                "current_metrics": {},
                "error": str(e),
                "overall_quality_trend": "unknown"
            }
    
    def analyze_git_status(self) -> Dict[str, Any]:
        """Analyze Git repository status and provide insights."""
        try:
            status_summary = self.git_utils.get_status_summary()
            branch_info = self.git_utils.get_branch_info()
            recent_commits = self.git_utils.get_recent_commits(count=3)
            commit_stats = self.git_utils.get_commit_stats()
            
            # Generate Git recommendations
            git_recommendations = []
            
            if status_summary.get("total_changes", 0) > 0:
                staged_count = len(status_summary.get("staged_files", []))
                unstaged_count = len(status_summary.get("unstaged_files", []))
                
                if unstaged_count > 0:
                    git_recommendations.append(f"Review and stage {unstaged_count} unstaged changes")
                if staged_count > 0:
                    git_recommendations.append(f"Commit {staged_count} staged changes")
            
            if branch_info.get("needs_push"):
                ahead_count = branch_info.get("ahead", 0)
                git_recommendations.append(f"Push {ahead_count} local commits to remote")
            
            if branch_info.get("needs_pull"):
                behind_count = branch_info.get("behind", 0)
                git_recommendations.append(f"Pull {behind_count} commits from remote")
            
            return {
                "status_summary": status_summary,
                "branch_info": branch_info,
                "recent_commits": recent_commits,
                "commit_stats": commit_stats,
                "recommendations": git_recommendations,
                "repository_health": self.assess_repository_health(status_summary, commit_stats)
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "recommendations": ["Check Git repository status manually"],
                "repository_health": "unknown"
            }
    
    def generate_development_insights(self, modified_files: List[str], features_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate insights about development patterns and productivity."""
        insights = {
            "productivity_metrics": {
                "files_per_hour": 0,
                "features_touched": len(features_analysis.get("features_touched", [])),
                "primary_activity": features_analysis.get("development_focus", "unknown")
            },
            "development_patterns": {
                "frontend_heavy": False,
                "backend_heavy": False,
                "full_stack": False,
                "testing_focus": False,
                "documentation_focus": False
            },
            "technology_usage": self.analyze_technology_usage(modified_files),
            "code_quality_focus": self.analyze_quality_focus(modified_files)
        }
        
        # Analyze development patterns
        file_categories = features_analysis.get("file_categories", {})
        
        frontend_count = file_categories.get("components", 0) + file_categories.get("pages", 0)
        backend_count = file_categories.get("services", 0) + file_categories.get("hooks", 0)
        test_count = file_categories.get("tests", 0)
        docs_count = file_categories.get("documentation", 0)
        
        total_code_files = frontend_count + backend_count
        
        if total_code_files > 0:
            if frontend_count > backend_count * 2:
                insights["development_patterns"]["frontend_heavy"] = True
            elif backend_count > frontend_count * 2:
                insights["development_patterns"]["backend_heavy"] = True
            elif abs(frontend_count - backend_count) <= 1:
                insights["development_patterns"]["full_stack"] = True
        
        if test_count > total_code_files * 0.3:
            insights["development_patterns"]["testing_focus"] = True
        
        if docs_count > total_code_files * 0.2:
            insights["development_patterns"]["documentation_focus"] = True
        
        return insights
    
    def suggest_next_tasks(self, quality_metrics: Dict[str, Any], git_analysis: Dict[str, Any]) -> List[str]:
        """Suggest tasks for next development session."""
        suggestions = []
        
        # Quality-based suggestions
        current_quality = quality_metrics.get("current_metrics", {})
        
        if current_quality.get("typescript_clean") is False:
            suggestions.append("🔧 Fix remaining TypeScript compilation errors")
        
        if current_quality.get("eslint_clean") is False:
            error_count = current_quality.get("details", {}).get("eslint", {}).get("error_count", 0)
            if error_count > 0:
                suggestions.append(f"📋 Address {error_count} ESLint errors (zero warnings policy)")
            else:
                suggestions.append("⚡ Run 'yarn lint:fix' to auto-fix ESLint warnings")
        
        # Git-based suggestions
        git_recommendations = git_analysis.get("recommendations", [])
        for rec in git_recommendations[:2]:  # Top 2 Git recommendations
            suggestions.append(f"🌿 {rec}")
        
        # Project-specific suggestions
        try:
            # Check if tests need attention
            recent_analysis = self.context_manager.get_recent_analyses(limit=5)
            if recent_analysis:
                test_mentions = sum(1 for analysis in recent_analysis 
                                 if analysis.get("core_analysis", {}).get("requires_testing", False))
                
                if test_mentions >= 3:
                    suggestions.append("🧪 Focus on test coverage for recent changes")
        except Exception:
            pass
        
        # Development continuity suggestions
        previous_session = self.context_manager.load_latest_session_report()
        if previous_session:
            prev_features = previous_session.get("features_analysis", {}).get("features_touched", [])
            if prev_features:
                suggestions.append(f"🔄 Continue work on {', '.join(prev_features[:2])} features")
        
        # General development suggestions
        if not suggestions:
            suggestions.extend([
                "🚀 Consider implementing new feature or enhancement",
                "📚 Review and update project documentation",
                "🔍 Analyze performance optimization opportunities"
            ])
        
        return suggestions[:6]  # Limit suggestions
    
    def cleanup_session_artifacts(self) -> Dict[str, Any]:
        """Clean up temporary files and session artifacts."""
        cleanup_results = {
            "files_cleaned": [],
            "directories_cleaned": [],
            "space_freed_mb": 0,
            "errors": []
        }
        
        # Define cleanup paths
        cleanup_paths = [
            self.claude_dir / "temp",
            self.claude_dir / "cache",
            self.project_root / ".next" / "cache",
            # Add other temporary paths as needed
        ]
        
        # File patterns to clean
        file_patterns = [
            "*.log",
            "*.tmp",
            "debug-*.png",
            "*.temp"
        ]
        
        try:
            # Clean directories
            for path in cleanup_paths:
                if path.exists() and path.is_dir():
                    try:
                        space_before = self.calculate_directory_size(path)
                        shutil.rmtree(path)
                        path.mkdir(parents=True, exist_ok=True)  # Recreate empty directory
                        
                        cleanup_results["directories_cleaned"].append(str(path))
                        cleanup_results["space_freed_mb"] += space_before / (1024 * 1024)
                    except Exception as e:
                        cleanup_results["errors"].append(f"Failed to clean {path}: {str(e)}")
            
            # Clean file patterns
            for pattern in file_patterns:
                try:
                    for file_path in self.project_root.glob(pattern):
                        if file_path.is_file():
                            file_size = file_path.stat().st_size
                            file_path.unlink()
                            
                            cleanup_results["files_cleaned"].append(str(file_path))
                            cleanup_results["space_freed_mb"] += file_size / (1024 * 1024)
                except Exception as e:
                    cleanup_results["errors"].append(f"Failed to clean pattern {pattern}: {str(e)}")
            
            # Clean old reports (keep last 30 days)
            cleaned_reports = self.context_manager.cleanup_old_reports(keep_days=30)
            if cleaned_reports > 0:
                cleanup_results["files_cleaned"].append(f"{cleaned_reports} old report files")
            
        except Exception as e:
            cleanup_results["errors"].append(f"General cleanup error: {str(e)}")
        
        cleanup_results["space_freed_mb"] = round(cleanup_results["space_freed_mb"], 2)
        return cleanup_results
    
    def calculate_session_statistics(self, modified_files: List[str], features_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate comprehensive session statistics."""
        return {
            "total_files_modified": len(modified_files),
            "features_count": len(features_analysis.get("features_touched", [])),
            "primary_focus": features_analysis.get("development_focus", "general"),
            "complexity_level": features_analysis.get("complexity_assessment", "medium"),
            "file_type_distribution": features_analysis.get("file_categories", {}),
            "session_duration_estimate": "unknown",  # Could be enhanced with actual tracking
            "productivity_score": self.calculate_productivity_score(modified_files, features_analysis)
        }
    
    # Helper methods
    
    def determine_development_focus(self, file_categories: Dict[str, List[str]]) -> str:
        """Determine primary development focus based on modified files."""
        category_counts = {k: len(v) for k, v in file_categories.items()}
        
        if category_counts.get("tests", 0) > sum(category_counts.values()) * 0.5:
            return "testing"
        elif category_counts.get("documentation", 0) > sum(category_counts.values()) * 0.3:
            return "documentation"
        elif category_counts.get("components", 0) > category_counts.get("services", 0):
            return "frontend"
        elif category_counts.get("services", 0) > category_counts.get("components", 0):
            return "backend"
        else:
            return "full_stack"
    
    def assess_work_complexity(self, modified_files: List[str], features_touched: set) -> str:
        """Assess complexity of work done in session."""
        if len(features_touched) > 2 or len(modified_files) > 10:
            return "high"
        elif len(features_touched) == 0 and len(modified_files) <= 2:
            return "low"
        else:
            return "medium"
    
    def calculate_quality_trend(self, improvements: Dict[str, Any]) -> str:
        """Calculate overall quality trend."""
        if not improvements:
            return "unknown"
        
        improved_count = sum(1 for imp in improvements.values() if imp.get("improved", False))
        regressed_count = sum(1 for imp in improvements.values() if imp.get("regressed", False))
        
        if improved_count > regressed_count:
            return "improving"
        elif regressed_count > improved_count:
            return "declining"
        else:
            return "stable"
    
    def assess_repository_health(self, status_summary: Dict[str, Any], commit_stats: Dict[str, Any]) -> str:
        """Assess overall repository health."""
        if status_summary.get("is_clean", False):
            return "clean"
        elif status_summary.get("total_changes", 0) < 10:
            return "manageable"
        else:
            return "needs_attention"
    
    def analyze_technology_usage(self, modified_files: List[str]) -> Dict[str, int]:
        """Analyze technology usage patterns."""
        tech_usage = {
            "typescript": 0,
            "react": 0,
            "nextjs": 0,
            "tailwind": 0,
            "prisma": 0
        }
        
        for file_path in modified_files:
            if file_path.endswith(('.ts', '.tsx')):
                tech_usage["typescript"] += 1
            if file_path.endswith(('.tsx', '.jsx')):
                tech_usage["react"] += 1
            if '/app/' in file_path or 'page.' in file_path:
                tech_usage["nextjs"] += 1
            if 'tailwind' in file_path or file_path.endswith('.css'):
                tech_usage["tailwind"] += 1
            if 'prisma' in file_path or 'schema' in file_path:
                tech_usage["prisma"] += 1
        
        return tech_usage
    
    def analyze_quality_focus(self, modified_files: List[str]) -> Dict[str, bool]:
        """Analyze focus on code quality improvements."""
        return {
            "test_additions": any('test' in f or 'spec' in f for f in modified_files),
            "type_improvements": any(f.endswith('.ts') for f in modified_files),
            "documentation_updates": any(f.endswith('.md') for f in modified_files),
            "configuration_changes": any('config' in f or f.endswith('.json') for f in modified_files)
        }
    
    def calculate_productivity_score(self, modified_files: List[str], features_analysis: Dict[str, Any]) -> float:
        """Calculate productivity score based on session activity."""
        base_score = min(len(modified_files) * 0.1, 1.0)  # File count contribution
        
        feature_bonus = len(features_analysis.get("features_touched", [])) * 0.2
        complexity_bonus = {
            "high": 0.3,
            "medium": 0.2,
            "low": 0.1
        }.get(features_analysis.get("complexity_assessment", "medium"), 0.2)
        
        return min(base_score + feature_bonus + complexity_bonus, 1.0)
    
    def calculate_directory_size(self, directory: Path) -> int:
        """Calculate total size of directory in bytes."""
        total_size = 0
        try:
            for file_path in directory.rglob("*"):
                if file_path.is_file():
                    total_size += file_path.stat().st_size
        except Exception:
            pass
        return total_size


def main():
    """Main execution function for SessionEnd hook."""
    try:
        manager = SessionManager()
        
        # Generate session summary
        session_summary = manager.generate_session_summary()
        
        # Clean up session artifacts
        cleanup_results = manager.cleanup_session_artifacts()
        session_summary["cleanup_results"] = cleanup_results
        
        # Save session report
        manager.context_manager.save_session_report(session_summary)
        
        # Generate user-friendly output
        print("📋 Session Summary:", file=sys.stderr)
        
        # Files and features
        files_count = session_summary["session_statistics"]["total_files_modified"]
        features_touched = session_summary["features_analysis"]["features_touched"]
        
        print(f"  📁 Files modified: {files_count}", file=sys.stderr)
        
        if features_touched:
            print(f"  🎯 Features: {', '.join(features_touched)}", file=sys.stderr)
        
        # Quality status
        quality_metrics = session_summary["quality_metrics"]
        if quality_metrics.get("current_metrics"):
            ts_clean = quality_metrics["current_metrics"].get("typescript_clean")
            eslint_clean = quality_metrics["current_metrics"].get("eslint_clean")
            
            quality_status = []
            if ts_clean:
                quality_status.append("✅ TypeScript")
            elif ts_clean is False:
                quality_status.append("❌ TypeScript")
            
            if eslint_clean:
                quality_status.append("✅ ESLint")
            elif eslint_clean is False:
                quality_status.append("❌ ESLint")
            
            if quality_status:
                print(f"  🔍 Quality: {' | '.join(quality_status)}", file=sys.stderr)
        
        # Git status
        git_analysis = session_summary["git_analysis"]
        if git_analysis.get("status_summary"):
            total_changes = git_analysis["status_summary"].get("total_changes", 0)
            if total_changes > 0:
                print(f"  🌿 Git: {total_changes} uncommitted changes", file=sys.stderr)
            else:
                print(f"  🌿 Git: Working directory clean", file=sys.stderr)
        
        # Next session tasks
        next_tasks = session_summary["next_session_tasks"]
        if next_tasks:
            print("📝 Next session tasks:", file=sys.stderr)
            for task in next_tasks[:3]:  # Show top 3 tasks
                print(f"  {task}", file=sys.stderr)
        
        # Cleanup results
        if cleanup_results["files_cleaned"] or cleanup_results["directories_cleaned"]:
            total_cleaned = len(cleanup_results["files_cleaned"]) + len(cleanup_results["directories_cleaned"])
            space_freed = cleanup_results["space_freed_mb"]
            if space_freed > 0:
                print(f"🧹 Cleanup: {total_cleaned} items, {space_freed:.1f}MB freed", file=sys.stderr)
            else:
                print(f"🧹 Cleanup: {total_cleaned} items cleaned", file=sys.stderr)
        
        print("✅ Session ended successfully", file=sys.stderr)
        
        # Success exit
        sys.exit(0)
        
    except Exception as e:
        print(f"❌ Session cleanup error: {str(e)}", file=sys.stderr)
        # Don't block session end due to hook failure
        sys.exit(0)


if __name__ == "__main__":
    main()