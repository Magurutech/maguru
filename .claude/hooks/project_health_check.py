#!/usr/bin/env python3
"""
SessionStart Hook: Project Health Check
Comprehensive project health validation that runs at the beginning of each development session.

This hook validates:
- Dependencies status (node_modules, package.json vs yarn.lock)
- TypeScript compilation health
- ESLint validation status
- Git repository status
- Environment configuration
- Build system readiness

Outputs health report to stderr and saves detailed report for Claude reference.
"""

import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, Any

# Add shared utilities to path
sys.path.insert(0, str(Path(__file__).parent / "shared"))

from project_analyzer import ProjectAnalyzer
from git_utils import GitUtils
from quality_checker import QualityChecker
from context_manager import ContextManager


class ProjectHealthChecker:
    """Comprehensive project health checker for session start."""
    
    def __init__(self):
        self.project_root = Path.cwd()
        self.analyzer = ProjectAnalyzer(self.project_root)
        self.git_utils = GitUtils(self.project_root)
        self.quality_checker = QualityChecker(self.project_root)
        self.context_manager = ContextManager(self.project_root)
    
    def run_comprehensive_check(self) -> Dict[str, Any]:
        """Run comprehensive project health check."""
        start_time = datetime.now()
        
        checks = {
            "dependencies": self.check_dependencies(),
            "typescript": self.check_typescript_health(), 
            "eslint": self.check_eslint_health(),
            "git": self.check_git_health(),
            "environment": self.check_environment(),
            "build_system": self.check_build_system()
        }
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        # Generate comprehensive health report
        health_report = self.generate_health_report(checks, duration)
        
        # Save report for Claude reference
        self.context_manager.save_health_report(health_report)
        
        return health_report
    
    def check_dependencies(self) -> Dict[str, Any]:
        """Check dependencies health and status."""
        try:
            node_modules = self.project_root / "node_modules"
            package_json = self.project_root / "package.json"
            yarn_lock = self.project_root / "yarn.lock"
            
            if not node_modules.exists():
                return {
                    "status": "error",
                    "score": 0.0,
                    "message": "node_modules directory not found",
                    "recommendation": "Run 'yarn install' to install dependencies",
                    "blocking": True
                }
            
            if not package_json.exists():
                return {
                    "status": "error", 
                    "score": 0.0,
                    "message": "package.json not found",
                    "recommendation": "Ensure you're in the correct project directory",
                    "blocking": True
                }
            
            # Check if dependencies are outdated
            if package_json.exists() and yarn_lock.exists():
                package_time = package_json.stat().st_mtime
                modules_time = node_modules.stat().st_mtime
                
                if package_time > modules_time:
                    return {
                        "status": "warning",
                        "score": 0.6,
                        "message": "Dependencies may be outdated",
                        "recommendation": "Run 'yarn install' to update dependencies",
                        "blocking": False,
                        "details": {
                            "package_json_modified": datetime.fromtimestamp(package_time).isoformat(),
                            "node_modules_modified": datetime.fromtimestamp(modules_time).isoformat()
                        }
                    }
            
            # Check for yarn.lock existence
            if not yarn_lock.exists():
                return {
                    "status": "warning",
                    "score": 0.7,
                    "message": "yarn.lock not found", 
                    "recommendation": "Run 'yarn install' to generate yarn.lock",
                    "blocking": False
                }
            
            return {
                "status": "ok",
                "score": 1.0,
                "message": "Dependencies are up to date",
                "recommendation": None,
                "blocking": False
            }
            
        except Exception as e:
            return {
                "status": "error",
                "score": 0.0, 
                "message": f"Dependencies check failed: {str(e)}",
                "recommendation": "Check file system permissions and project structure",
                "blocking": True
            }
    
    def check_typescript_health(self) -> Dict[str, Any]:
        """Check TypeScript compilation status."""
        try:
            # Use quality checker for detailed TypeScript analysis
            ts_result = self.quality_checker.check_typescript(timeout=30)
            
            if ts_result["status"] == "passed":
                return {
                    "status": "ok",
                    "score": 1.0,
                    "message": "TypeScript compilation clean",
                    "recommendation": None,
                    "blocking": False,
                    "duration": ts_result.get("duration", 0),
                    "details": "No type errors found"
                }
            
            elif ts_result["status"] == "failed":
                error_count = len(ts_result.get("errors", []))
                return {
                    "status": "error",
                    "score": 0.0,
                    "message": f"TypeScript compilation failed: {error_count} errors",
                    "recommendation": "Fix TypeScript errors before continuing development",
                    "blocking": True,
                    "duration": ts_result.get("duration", 0),
                    "details": ts_result.get("raw_output", "")[:200],
                    "error_count": error_count
                }
            
            elif ts_result["status"] == "timeout":
                return {
                    "status": "warning", 
                    "score": 0.3,
                    "message": "TypeScript check timed out",
                    "recommendation": "Consider optimizing TypeScript configuration for faster compilation",
                    "blocking": False,
                    "duration": 30
                }
            
            else:
                return {
                    "status": "warning",
                    "score": 0.5,
                    "message": f"TypeScript check status: {ts_result['status']}",
                    "recommendation": "Investigate TypeScript configuration issues",
                    "blocking": False
                }
                
        except Exception as e:
            return {
                "status": "error",
                "score": 0.0,
                "message": f"TypeScript check failed: {str(e)}",
                "recommendation": "Check TypeScript installation and configuration",
                "blocking": True
            }
    
    def check_eslint_health(self) -> Dict[str, Any]:
        """Check ESLint status and code quality."""
        try:
            # Use quality checker for detailed ESLint analysis
            eslint_result = self.quality_checker.check_eslint(timeout=20)
            
            if eslint_result["status"] == "passed":
                return {
                    "status": "ok",
                    "score": 1.0,
                    "message": "ESLint clean - zero warnings policy maintained",
                    "recommendation": None,
                    "blocking": False,
                    "duration": eslint_result.get("duration", 0)
                }
            
            elif eslint_result["status"] == "failed":
                error_count = len(eslint_result.get("errors", []))
                return {
                    "status": "error",
                    "score": 0.0,
                    "message": f"ESLint errors found: {error_count} errors",
                    "recommendation": "Fix ESLint errors - zero warnings policy enforced",
                    "blocking": True,
                    "duration": eslint_result.get("duration", 0),
                    "error_count": error_count,
                    "details": eslint_result.get("raw_output", "")[:200]
                }
            
            elif eslint_result["status"] == "warnings":
                warning_count = len(eslint_result.get("warnings", []))
                return {
                    "status": "warning",
                    "score": 0.7,
                    "message": f"ESLint warnings found: {warning_count} warnings",
                    "recommendation": "Run 'yarn lint:fix' to auto-fix warnings", 
                    "blocking": False,
                    "duration": eslint_result.get("duration", 0),
                    "warning_count": warning_count
                }
            
            else:
                return {
                    "status": "warning",
                    "score": 0.5,
                    "message": f"ESLint check status: {eslint_result['status']}",
                    "recommendation": "Check ESLint configuration and installation",
                    "blocking": False
                }
                
        except Exception as e:
            return {
                "status": "warning",
                "score": 0.5,
                "message": f"ESLint check failed: {str(e)}",
                "recommendation": "Verify ESLint installation and configuration",
                "blocking": False
            }
    
    def check_git_health(self) -> Dict[str, Any]:
        """Check Git repository status and health."""
        try:
            git_status = self.git_utils.get_status_summary()
            
            if "error" in git_status:
                return {
                    "status": "warning",
                    "score": 0.5,
                    "message": git_status["error"],
                    "recommendation": "Ensure you're in a Git repository",
                    "blocking": False
                }
            
            branch_info = self.git_utils.get_branch_info()
            
            # Determine status based on repository state
            if git_status["is_clean"]:
                status_message = f"Working directory clean on branch '{git_status['current_branch']}'"
                score = 1.0
                status = "ok"
            else:
                total_changes = git_status["total_changes"]
                status_message = f"Repository has {total_changes} uncommitted changes on branch '{git_status['current_branch']}'"
                score = 0.8
                status = "info"
            
            recommendations = []
            if branch_info.get("needs_push"):
                recommendations.append(f"Local branch is {branch_info['ahead']} commits ahead - consider pushing")
            if branch_info.get("needs_pull"):
                recommendations.append(f"Local branch is {branch_info['behind']} commits behind - consider pulling")
            
            return {
                "status": status,
                "score": score,
                "message": status_message,
                "recommendation": "; ".join(recommendations) if recommendations else None,
                "blocking": False,
                "details": {
                    "branch": git_status["current_branch"],
                    "staged_files": len(git_status["staged_files"]),
                    "unstaged_files": len(git_status["unstaged_files"]),
                    "untracked_files": len(git_status["untracked_files"]),
                    "ahead_behind": {
                        "ahead": branch_info.get("ahead", 0),
                        "behind": branch_info.get("behind", 0)
                    }
                }
            }
            
        except Exception as e:
            return {
                "status": "warning",
                "score": 0.5,
                "message": f"Git status check failed: {str(e)}",
                "recommendation": "Check Git configuration and repository status",
                "blocking": False
            }
    
    def check_environment(self) -> Dict[str, Any]:
        """Check environment configuration and variables."""
        try:
            env_files = [".env", ".env.local", ".env.development"]
            found_env_files = []
            
            for env_file in env_files:
                if (self.project_root / env_file).exists():
                    found_env_files.append(env_file)
            
            # Check if required environment files exist
            if not found_env_files:
                return {
                    "status": "warning",
                    "score": 0.6,
                    "message": "No environment files found",
                    "recommendation": "Create .env.local for local environment variables",
                    "blocking": False
                }
            
            # Try to validate environment (if validation script exists)
            try:
                result = subprocess.run([
                    "yarn", "env:validate"
                ], capture_output=True, text=True, timeout=10, cwd=self.project_root)
                
                if result.returncode == 0:
                    return {
                        "status": "ok",
                        "score": 1.0,
                        "message": "Environment validation passed",
                        "recommendation": None,
                        "blocking": False,
                        "details": f"Found environment files: {', '.join(found_env_files)}"
                    }
                else:
                    return {
                        "status": "warning",
                        "score": 0.7,
                        "message": "Environment validation warnings",
                        "recommendation": "Check environment variables configuration",
                        "blocking": False,
                        "details": result.stderr[:200] if result.stderr else "Validation script failed"
                    }
                    
            except subprocess.TimeoutExpired:
                return {
                    "status": "warning",
                    "score": 0.8,
                    "message": "Environment validation timed out",
                    "recommendation": "Check environment validation script performance",
                    "blocking": False
                }
            except FileNotFoundError:
                # env:validate script doesn't exist, just report found files
                return {
                    "status": "ok",
                    "score": 0.9,
                    "message": f"Environment files present: {', '.join(found_env_files)}",
                    "recommendation": None,
                    "blocking": False
                }
                
        except Exception as e:
            return {
                "status": "warning",
                "score": 0.5,
                "message": f"Environment check failed: {str(e)}",
                "recommendation": "Check environment configuration files",
                "blocking": False
            }
    
    def check_build_system(self) -> Dict[str, Any]:
        """Check build system readiness (Next.js)."""
        try:
            # Check for Next.js configuration
            next_config = self.project_root / "next.config.ts"
            if not next_config.exists():
                next_config = self.project_root / "next.config.js"
            
            if not next_config.exists():
                return {
                    "status": "warning",
                    "score": 0.5,
                    "message": "Next.js configuration file not found",
                    "recommendation": "Ensure next.config.ts or next.config.js exists",
                    "blocking": False
                }
            
            # Check for Tailwind configuration
            tailwind_config = self.project_root / "tailwind.config.ts"
            if not tailwind_config.exists():
                tailwind_config = self.project_root / "tailwind.config.js"
            
            # Check for TypeScript configuration
            tsconfig = self.project_root / "tsconfig.json"
            
            config_files = []
            if next_config.exists():
                config_files.append("next.config")
            if tailwind_config.exists():
                config_files.append("tailwind.config")
            if tsconfig.exists():
                config_files.append("tsconfig.json")
            
            return {
                "status": "ok",
                "score": 1.0,
                "message": f"Build system ready: {', '.join(config_files)}",
                "recommendation": None,
                "blocking": False,
                "details": {
                    "next_config": next_config.exists(),
                    "tailwind_config": tailwind_config.exists(),
                    "typescript_config": tsconfig.exists()
                }
            }
            
        except Exception as e:
            return {
                "status": "warning",
                "score": 0.5,
                "message": f"Build system check failed: {str(e)}",
                "recommendation": "Check build configuration files",
                "blocking": False
            }
    
    def generate_health_report(self, checks: Dict[str, Any], duration: float) -> Dict[str, Any]:
        """Generate comprehensive health report."""
        # Calculate overall metrics
        total_score = sum(check.get("score", 0) for check in checks.values())
        average_score = total_score / len(checks) if checks else 0
        
        critical_issues = [
            name for name, check in checks.items()
            if check.get("status") == "error" and check.get("blocking", False)
        ]
        
        warnings = [
            name for name, check in checks.items()
            if check.get("status") in ["warning", "info"]
        ]
        
        # Determine overall status
        if critical_issues:
            overall_status = "critical"
            overall_message = f"Critical issues found: {', '.join(critical_issues)}"
        elif average_score < 0.7:
            overall_status = "needs_attention"
            overall_message = "Multiple issues require attention"
        elif warnings:
            overall_status = "healthy_with_warnings"
            overall_message = f"Healthy with {len(warnings)} warnings"
        else:
            overall_status = "healthy"
            overall_message = "All systems operational"
        
        # Generate recommendations
        recommendations = []
        for check in checks.values():
            if check.get("recommendation"):
                recommendations.append(check["recommendation"])
        
        return {
            "timestamp": datetime.now().isoformat(),
            "overall_status": overall_status,
            "overall_message": overall_message,
            "health_score": round(average_score, 3),
            "duration": round(duration, 2),
            "critical_issues": critical_issues,
            "warnings": warnings,
            "recommendations": recommendations[:5],  # Limit recommendations
            "checks": checks,
            "summary": {
                "total_checks": len(checks),
                "passed_checks": len([c for c in checks.values() if c.get("status") == "ok"]),
                "failed_checks": len([c for c in checks.values() if c.get("status") == "error"]),
                "warning_checks": len([c for c in checks.values() if c.get("status") in ["warning", "info"]]),
                "blocking_issues": len(critical_issues)
            }
        }


def main():
    """Main execution function for SessionStart hook."""
    try:
        checker = ProjectHealthChecker()
        
        # Run comprehensive health check
        health_report = checker.run_comprehensive_check()
        
        # Output summary to stderr for user feedback
        status = health_report["overall_status"]
        message = health_report["overall_message"]
        duration = health_report["duration"]
        
        if status == "healthy":
            print(f"✅ Project Health: {message} (checked in {duration}s)", file=sys.stderr)
        elif status == "healthy_with_warnings":
            print(f"⚠️ Project Health: {message} (checked in {duration}s)", file=sys.stderr)
            warnings = health_report["warnings"]
            for warning in warnings[:3]:  # Show first 3 warnings
                check = health_report["checks"][warning]
                print(f"  - {warning}: {check['message']}", file=sys.stderr)
        elif status == "needs_attention":
            print(f"⚠️ Project Health: {message} (checked in {duration}s)", file=sys.stderr)
            for rec in health_report["recommendations"][:2]:
                print(f"  💡 {rec}", file=sys.stderr)
        elif status == "critical":
            print(f"❌ Project Health: {message} (checked in {duration}s)", file=sys.stderr)
            critical_issues = health_report["critical_issues"]
            for issue in critical_issues[:2]:
                check = health_report["checks"][issue]
                print(f"  🚨 {issue}: {check['message']}", file=sys.stderr)
                if check.get("recommendation"):
                    print(f"    💡 {check['recommendation']}", file=sys.stderr)
        
        # Show summary
        summary = health_report["summary"]
        print(f"📊 Summary: {summary['passed_checks']}/{summary['total_checks']} checks passed", file=sys.stderr)
        
        # Exit successfully (don't block session start even with issues)
        sys.exit(0)
        
    except Exception as e:
        print(f"❌ Health check failed: {str(e)}", file=sys.stderr)
        # Don't block session start due to hook failure
        sys.exit(0)


if __name__ == "__main__":
    main()