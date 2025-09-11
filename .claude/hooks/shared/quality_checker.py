"""
Quality checking utilities for Claude Code hooks.
Provides TypeScript, ESLint, and other quality validation functionality.
"""

import subprocess
import json
from pathlib import Path
from typing import Dict, List, Optional, Any, Union
from datetime import datetime


class QualityChecker:
    """Utility class for code quality checks."""
    
    def __init__(self, project_root: Optional[Path] = None):
        self.project_root = project_root or Path.cwd()
    
    def check_typescript(self, timeout: int = 30) -> Dict[str, Any]:
        """Run TypeScript type checking."""
        try:
            start_time = datetime.now()
            
            result = subprocess.run([
                "yarn", "type-check"
            ], capture_output=True, text=True, timeout=timeout, cwd=self.project_root)
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            if result.returncode == 0:
                return {
                    "status": "passed",
                    "message": "TypeScript compilation clean",
                    "duration": duration,
                    "errors": [],
                    "warnings": []
                }
            else:
                # Parse TypeScript errors
                errors = self._parse_typescript_errors(result.stderr)
                
                return {
                    "status": "failed",
                    "message": f"TypeScript errors found: {len(errors)} errors",
                    "duration": duration,
                    "errors": errors,
                    "warnings": [],
                    "raw_output": result.stderr[:1000]  # Limit output
                }
                
        except subprocess.TimeoutExpired:
            return {
                "status": "timeout",
                "message": f"TypeScript check timed out after {timeout}s",
                "duration": timeout,
                "errors": [],
                "warnings": []
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"TypeScript check failed: {str(e)}",
                "duration": 0,
                "errors": [],
                "warnings": []
            }
    
    def check_eslint(self, timeout: int = 20) -> Dict[str, Any]:
        """Run ESLint checking."""
        try:
            start_time = datetime.now()
            
            result = subprocess.run([
                "yarn", "lint"
            ], capture_output=True, text=True, timeout=timeout, cwd=self.project_root)
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            if result.returncode == 0:
                return {
                    "status": "passed",
                    "message": "ESLint clean - no warnings or errors",
                    "duration": duration,
                    "errors": [],
                    "warnings": []
                }
            else:
                # Parse ESLint output
                issues = self._parse_eslint_output(result.stdout)
                errors = [issue for issue in issues if issue["severity"] == "error"]
                warnings = [issue for issue in issues if issue["severity"] == "warning"]
                
                status = "failed" if errors else "warnings"
                message = f"ESLint issues: {len(errors)} errors, {len(warnings)} warnings"
                
                return {
                    "status": status,
                    "message": message,
                    "duration": duration,
                    "errors": errors,
                    "warnings": warnings,
                    "raw_output": result.stdout[:1000]  # Limit output
                }
                
        except subprocess.TimeoutExpired:
            return {
                "status": "timeout",
                "message": f"ESLint check timed out after {timeout}s",
                "duration": timeout,
                "errors": [],
                "warnings": []
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"ESLint check failed: {str(e)}",
                "duration": 0,
                "errors": [],
                "warnings": []
            }
    
    def check_build(self, timeout: int = 120) -> Dict[str, Any]:
        """Check if the project builds successfully."""
        try:
            start_time = datetime.now()
            
            result = subprocess.run([
                "yarn", "build"
            ], capture_output=True, text=True, timeout=timeout, cwd=self.project_root)
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            if result.returncode == 0:
                return {
                    "status": "passed",
                    "message": "Build completed successfully",
                    "duration": duration,
                    "errors": []
                }
            else:
                return {
                    "status": "failed",
                    "message": "Build failed",
                    "duration": duration,
                    "errors": result.stderr[:1000],
                    "raw_output": result.stderr[:1000]
                }
                
        except subprocess.TimeoutExpired:
            return {
                "status": "timeout",
                "message": f"Build timed out after {timeout}s",
                "duration": timeout,
                "errors": []
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Build check failed: {str(e)}",
                "duration": 0,
                "errors": []
            }
    
    def run_comprehensive_check(self) -> Dict[str, Any]:
        """Run comprehensive quality checks."""
        start_time = datetime.now()
        
        checks = {
            "typescript": self.check_typescript(),
            "eslint": self.check_eslint()
        }
        
        # Calculate overall status
        all_passed = all(check["status"] == "passed" for check in checks.values())
        has_errors = any(check["status"] == "failed" for check in checks.values())
        has_warnings = any(check.get("warnings") for check in checks.values())
        
        if all_passed:
            overall_status = "passed"
            overall_message = "All quality checks passed"
        elif has_errors:
            overall_status = "failed"
            overall_message = "Quality checks failed - errors found"
        elif has_warnings:
            overall_status = "warnings"
            overall_message = "Quality checks passed with warnings"
        else:
            overall_status = "unknown"
            overall_message = "Quality check status unknown"
        
        end_time = datetime.now()
        total_duration = (end_time - start_time).total_seconds()
        
        return {
            "overall_status": overall_status,
            "overall_message": overall_message,
            "total_duration": total_duration,
            "timestamp": end_time.isoformat(),
            "checks": checks,
            "summary": self._generate_quality_summary(checks)
        }
    
    def _parse_typescript_errors(self, stderr: str) -> List[Dict[str, Any]]:
        """Parse TypeScript error output."""
        errors = []
        
        if not stderr:
            return errors
        
        # Basic parsing - TypeScript errors usually follow pattern:
        # file.ts(line,col): error TS#### message
        lines = stderr.split('\n')
        
        for line in lines:
            if 'error TS' in line:
                try:
                    # Extract file, line, column, and message
                    parts = line.split(': error TS', 1)
                    if len(parts) == 2:
                        location = parts[0].strip()
                        error_info = parts[1].strip()
                        
                        # Extract error code and message
                        error_parts = error_info.split(': ', 1)
                        error_code = error_parts[0] if error_parts else ""
                        error_message = error_parts[1] if len(error_parts) > 1 else error_info
                        
                        errors.append({
                            "location": location,
                            "code": error_code,
                            "message": error_message,
                            "severity": "error"
                        })
                except Exception:
                    # Fallback: add raw line
                    errors.append({
                        "location": "unknown",
                        "code": "",
                        "message": line.strip(),
                        "severity": "error"
                    })
        
        return errors[:20]  # Limit to prevent overwhelming output
    
    def _parse_eslint_output(self, stdout: str) -> List[Dict[str, Any]]:
        """Parse ESLint output."""
        issues = []
        
        if not stdout:
            return issues
        
        # ESLint output format varies, try to parse common patterns
        lines = stdout.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('✖'):
                continue
            
            # Pattern: file:line:col severity message [rule]
            if ':' in line and ('error' in line or 'warning' in line):
                try:
                    parts = line.split()
                    if len(parts) >= 3:
                        location = parts[0]  # file:line:col
                        severity = "error" if "error" in line else "warning"
                        message = ' '.join(parts[2:])
                        
                        issues.append({
                            "location": location,
                            "severity": severity,
                            "message": message
                        })
                except Exception:
                    continue
        
        return issues[:50]  # Limit to prevent overwhelming output
    
    def _generate_quality_summary(self, checks: Dict[str, Any]) -> Dict[str, Any]:
        """Generate quality summary from check results."""
        total_errors = 0
        total_warnings = 0
        failed_checks = []
        passed_checks = []
        
        for check_name, check_result in checks.items():
            if check_result["status"] == "passed":
                passed_checks.append(check_name)
            elif check_result["status"] in ["failed", "warnings"]:
                if check_result["status"] == "failed":
                    failed_checks.append(check_name)
                
                total_errors += len(check_result.get("errors", []))
                total_warnings += len(check_result.get("warnings", []))
        
        return {
            "total_checks": len(checks),
            "passed_checks": len(passed_checks),
            "failed_checks": len(failed_checks),
            "total_errors": total_errors,
            "total_warnings": total_warnings,
            "passing_rate": len(passed_checks) / len(checks) if checks else 0,
            "recommendations": self._generate_recommendations(checks)
        }
    
    def _generate_recommendations(self, checks: Dict[str, Any]) -> List[str]:
        """Generate improvement recommendations based on check results."""
        recommendations = []
        
        for check_name, check_result in checks.items():
            if check_result["status"] == "failed":
                if check_name == "typescript":
                    recommendations.append("Fix TypeScript compilation errors before continuing")
                elif check_name == "eslint":
                    recommendations.append("Address ESLint errors - zero warnings policy enforced")
                elif check_name == "build":
                    recommendations.append("Resolve build failures before deployment")
            
            elif check_result["status"] == "warnings":
                if check_name == "eslint":
                    recommendations.append("Run 'yarn lint:fix' to auto-fix ESLint warnings")
            
            elif check_result["status"] == "timeout":
                recommendations.append(f"Optimize {check_name} performance - check timed out")
        
        # General recommendations
        if not recommendations:
            recommendations.append("All quality checks passed - great work!")
        
        return recommendations
    
    def get_quality_metrics(self) -> Dict[str, Any]:
        """Get current quality metrics for the project."""
        try:
            # Run quick checks
            ts_result = self.check_typescript(timeout=15)
            eslint_result = self.check_eslint(timeout=10)
            
            # Calculate metrics
            ts_clean = ts_result["status"] == "passed"
            eslint_clean = eslint_result["status"] == "passed"
            
            quality_score = 0
            if ts_clean:
                quality_score += 0.5
            if eslint_clean:
                quality_score += 0.5
            
            return {
                "timestamp": datetime.now().isoformat(),
                "typescript_clean": ts_clean,
                "eslint_clean": eslint_clean,
                "quality_score": quality_score,
                "status": "healthy" if quality_score == 1.0 else "needs_improvement" if quality_score > 0 else "critical",
                "details": {
                    "typescript": {
                        "status": ts_result["status"],
                        "duration": ts_result.get("duration", 0),
                        "error_count": len(ts_result.get("errors", []))
                    },
                    "eslint": {
                        "status": eslint_result["status"],
                        "duration": eslint_result.get("duration", 0),
                        "error_count": len(eslint_result.get("errors", [])),
                        "warning_count": len(eslint_result.get("warnings", []))
                    }
                }
            }
            
        except Exception as e:
            return {
                "timestamp": datetime.now().isoformat(),
                "typescript_clean": None,
                "eslint_clean": None,
                "quality_score": 0,
                "status": "error",
                "error": str(e)
            }