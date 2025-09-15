#!/usr/bin/env python3
"""
Bundle Impact Analyzer Hook
PostToolUse hook for monitoring bundle size impact of code changes

Purpose: Monitor client-side bundle size changes for performance optimization
Priority: RECOMMENDED
Execution Time: 30-60 seconds
Exit Codes: 0=success, 1=error, 2=fix_required
"""

import sys
import json
import os
import re
from pathlib import Path
from typing import Dict, Any, Optional, List, Tuple

# Add shared utilities to path
sys.path.insert(0, str(Path(__file__).parent / "shared"))
from hook_utils import (
    parse_hook_input,
    get_file_path_from_input,
    is_client_side_file,
    should_skip_file,
    run_command_with_timeout,
    log_hook_result,
    exit_with_message,
    get_project_root,
    load_cache,
    save_cache
)


class BundleAnalyzer:
    """Analyzes bundle size impact of code changes"""
    
    def __init__(self):
        self.project_root = get_project_root()
        self.size_warning_threshold = 10 * 1024  # 10KB
        self.size_blocking_threshold = 50 * 1024  # 50KB
    
    def analyze_bundle_impact(self, file_path: str) -> Dict[str, Any]:
        """
        Analyze the impact of file changes on bundle size
        Returns analysis results including size changes and recommendations
        """
        # Check if file affects client-side bundle
        if not is_client_side_file(file_path):
            return {
                "affects_bundle": False,
                "reason": "File does not affect client-side bundle"
            }
        
        try:
            # Get current bundle stats
            current_stats = self._get_bundle_stats()
            if not current_stats:
                return {
                    "affects_bundle": True,
                    "error": "Could not analyze bundle - build may have failed"
                }
            
            # Load baseline stats for comparison
            baseline_stats = self._load_baseline_stats()
            
            if not baseline_stats:
                # No baseline - create one and return
                self._save_baseline_stats(current_stats)
                return {
                    "affects_bundle": True,
                    "baseline_created": True,
                    "current_size": current_stats.get("total_size", 0),
                    "message": "Baseline bundle size recorded"
                }
            
            # Calculate impact
            impact = self._calculate_bundle_impact(baseline_stats, current_stats)
            
            # Update baseline if changes are acceptable
            if impact.get("total_size_change", 0) < self.size_warning_threshold:
                self._save_baseline_stats(current_stats)
            
            return impact
            
        except Exception as e:
            return {
                "affects_bundle": True,
                "error": f"Bundle analysis failed: {str(e)}"
            }
    
    def _get_bundle_stats(self) -> Optional[Dict[str, Any]]:
        """
        Get current bundle statistics using Next.js build
        Returns bundle stats or None if build fails
        """
        try:
            # Check if we can do a quick size estimate first
            estimate = self._estimate_bundle_impact()
            if estimate and estimate.get("skip_build"):
                return estimate
            
            # Run Next.js build to get accurate bundle stats
            result = run_command_with_timeout([
                "yarn", "build"
            ], timeout=120, cwd=str(self.project_root))  # 2 minutes for build
            
            if result.returncode != 0:
                # Build failed - try to get info from error
                return {
                    "build_failed": True,
                    "error": result.stderr or result.stdout,
                    "total_size": 0
                }
            
            # Parse build output for bundle information
            output = result.stdout or ""
            
            # Look for Next.js build size information
            bundle_info = self._parse_nextjs_build_output(output)
            
            return bundle_info
            
        except TimeoutError:
            return {
                "build_timeout": True,
                "error": "Build timed out (>2 minutes)",
                "total_size": 0
            }
        except Exception as e:
            return {
                "error": f"Bundle analysis error: {str(e)}",
                "total_size": 0
            }
    
    def _parse_nextjs_build_output(self, output: str) -> Dict[str, Any]:
        """Parse Next.js build output for bundle size information"""
        bundle_info = {
            "total_size": 0,
            "pages": {},
            "chunks": {},
            "static_size": 0
        }
        
        lines = output.split('\n')
        
        # Look for size information in build output
        # Next.js typically shows: Route (size) First Load JS
        size_pattern = r'(\S+)\s+(\d+(?:\.\d+)?)\s*([kK]?B)\s+(\d+(?:\.\d+)?)\s*([kK]?B)'
        
        total_size = 0
        
        for line in lines:
            # Parse route size information
            match = re.search(size_pattern, line)
            if match:
                route = match.group(1)
                size_val = float(match.group(2))
                size_unit = match.group(3).lower()
                first_load = float(match.group(4))
                first_load_unit = match.group(5).lower()
                
                # Convert to bytes
                if 'k' in size_unit:
                    size_bytes = int(size_val * 1024)
                else:
                    size_bytes = int(size_val)
                
                if 'k' in first_load_unit:
                    first_load_bytes = int(first_load * 1024)
                else:
                    first_load_bytes = int(first_load)
                
                bundle_info["pages"][route] = {
                    "size": size_bytes,
                    "first_load": first_load_bytes
                }
                
                total_size += first_load_bytes
        
        # Also look for static file sizes
        static_pattern = r'static.*?(\d+(?:\.\d+)?)\s*([kK]?B)'
        for line in lines:
            match = re.search(static_pattern, line, re.IGNORECASE)
            if match:
                size_val = float(match.group(1))
                size_unit = match.group(2).lower()
                
                if 'k' in size_unit:
                    size_bytes = int(size_val * 1024)
                else:
                    size_bytes = int(size_val)
                
                bundle_info["static_size"] += size_bytes
        
        bundle_info["total_size"] = total_size + bundle_info["static_size"]
        
        # If we couldn't parse specific sizes, try to estimate
        if total_size == 0:
            # Look for any size mentions
            size_mentions = re.findall(r'(\d+(?:\.\d+)?)\s*([kK]B)', output)
            if size_mentions:
                estimated_size = 0
                for size_val, unit in size_mentions:
                    size_bytes = float(size_val) * 1024 if 'k' in unit.lower() else float(size_val)
                    estimated_size += size_bytes
                
                bundle_info["total_size"] = int(estimated_size)
                bundle_info["estimated"] = True
        
        return bundle_info
    
    def _estimate_bundle_impact(self) -> Optional[Dict[str, Any]]:
        """
        Quick estimate of bundle impact without full build
        Returns estimate or None if full build needed
        """
        try:
            # Check .next directory for existing build info
            next_dir = self.project_root / ".next"
            if not next_dir.exists():
                return None
            
            # Look for build manifest or trace files
            build_manifest = next_dir / "build-manifest.json"
            if build_manifest.exists():
                with open(build_manifest, 'r') as f:
                    manifest = json.load(f)
                
                # Quick estimate based on manifest
                return {
                    "estimated": True,
                    "total_size": 0,  # Will be calculated in full build
                    "skip_build": False  # Still need full build for accuracy
                }
        
        except Exception:
            pass
        
        return None
    
    def _calculate_bundle_impact(self, baseline: Dict[str, Any], 
                                current: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate the impact between baseline and current bundle stats"""
        baseline_size = baseline.get("total_size", 0)
        current_size = current.get("total_size", 0)
        
        size_change = current_size - baseline_size
        
        impact = {
            "affects_bundle": True,
            "baseline_size": baseline_size,
            "current_size": current_size,
            "total_size_change": size_change,
            "percentage_change": (size_change / max(baseline_size, 1)) * 100,
            "page_changes": [],
            "recommendations": []
        }
        
        # Analyze page-level changes
        baseline_pages = baseline.get("pages", {})
        current_pages = current.get("pages", {})
        
        for page, page_info in current_pages.items():
            if page in baseline_pages:
                baseline_page_size = baseline_pages[page].get("first_load", 0)
                current_page_size = page_info.get("first_load", 0)
                page_change = current_page_size - baseline_page_size
                
                if abs(page_change) > 1024:  # > 1KB change
                    impact["page_changes"].append({
                        "page": page,
                        "size_change": page_change,
                        "current_size": current_page_size
                    })
        
        # Generate recommendations based on size change
        if size_change > self.size_blocking_threshold:
            impact["recommendations"].extend([
                "Consider code splitting for large components",
                "Check for unnecessary dependencies",
                "Use dynamic imports for non-critical code",
                "Optimize images and static assets"
            ])
        elif size_change > self.size_warning_threshold:
            impact["recommendations"].extend([
                "Monitor bundle size trends",
                "Consider lazy loading for new features"
            ])
        
        return impact
    
    def _load_baseline_stats(self) -> Optional[Dict[str, Any]]:
        """Load baseline bundle statistics from cache"""
        cache = load_cache("bundle_baseline")
        return cache.get("baseline")
    
    def _save_baseline_stats(self, stats: Dict[str, Any]) -> None:
        """Save baseline bundle statistics to cache"""
        cache = {
            "baseline": stats,
            "timestamp": __import__('time').time()
        }
        save_cache("bundle_baseline", cache)


def format_size(size_bytes: int) -> str:
    """Format size in bytes to human readable format"""
    if size_bytes >= 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.1f}MB"
    elif size_bytes >= 1024:
        return f"{size_bytes / 1024:.1f}KB"
    else:
        return f"{size_bytes}B"


def main():
    """Main hook execution"""
    try:
        # Parse input from Claude Code
        input_data = parse_hook_input()
        file_path = get_file_path_from_input(input_data)
        session_id = input_data.get("session_id", "unknown")
        
        # Skip if no file path
        if not file_path:
            exit_with_message(0, "No file path provided - skipping bundle analysis")
        
        # Skip files that should be ignored
        if should_skip_file(file_path):
            exit_with_message(0, f"Skipping ignored file: {file_path}")
        
        # Check if file exists
        if not Path(file_path).exists():
            exit_with_message(0, f"File does not exist: {file_path}")
        
        # Initialize analyzer
        analyzer = BundleAnalyzer()
        
        # Analyze bundle impact
        impact = analyzer.analyze_bundle_impact(file_path)
        
        # Log results
        log_hook_result(
            "bundle_impact_analyzer",
            file_path,
            session_id,
            "blocked" if impact.get("total_size_change", 0) > analyzer.size_blocking_threshold else "success",
            impact
        )
        
        # Handle different result types
        if not impact.get("affects_bundle"):
            exit_with_message(0, f"File does not affect bundle: {file_path}")
        
        if impact.get("error"):
            error_msg = impact["error"]
            if "build may have failed" in error_msg:
                exit_with_message(1, f"Bundle analysis failed: {error_msg}")
            else:
                print(f"⚠️ Bundle analysis warning: {error_msg}", file=sys.stderr)
                exit_with_message(0, f"Bundle analysis completed with warnings: {file_path}")
        
        if impact.get("baseline_created"):
            exit_with_message(0, f"Bundle baseline created ({format_size(impact['current_size'])}): {file_path}")
        
        # Check size impact
        size_change = impact.get("total_size_change", 0)
        current_size = impact.get("current_size", 0)
        baseline_size = impact.get("baseline_size", 0)
        
        if size_change > analyzer.size_blocking_threshold:
            # Large increase - block and suggest optimizations
            error_msg = f"Large bundle size increase detected: {file_path}"
            details = f"📊 Bundle Size Impact:\n\n"
            details += f"❌ Size increased by {format_size(size_change)} ({impact.get('percentage_change', 0):.1f}%)\n"
            details += f"📈 Current: {format_size(current_size)} (was {format_size(baseline_size)})\n\n"
            
            # Show page-level changes
            page_changes = impact.get("page_changes", [])
            if page_changes:
                details += "📄 Page-level changes:\n"
                for change in page_changes[:3]:  # Show first 3
                    page_change = change["size_change"]
                    details += f"   {change['page']}: {format_size(page_change):+}\n"
            
            # Show recommendations
            recommendations = impact.get("recommendations", [])
            if recommendations:
                details += "\n💡 Optimization suggestions:\n"
                for rec in recommendations:
                    details += f"   • {rec}\n"
            
            exit_with_message(2, error_msg, details)
        
        elif size_change > analyzer.size_warning_threshold:
            # Medium increase - warn but don't block
            warning_msg = f"Bundle size increased: {file_path}"
            details = f"📊 Bundle Size Impact:\n\n"
            details += f"⚠️ Size increased by {format_size(size_change)} ({impact.get('percentage_change', 0):.1f}%)\n"
            details += f"📈 Current: {format_size(current_size)} (was {format_size(baseline_size)})\n"
            
            recommendations = impact.get("recommendations", [])
            if recommendations:
                details += "\n💡 Consider:\n"
                for rec in recommendations:
                    details += f"   • {rec}\n"
            
            print(details, file=sys.stderr)
            exit_with_message(0, f"Bundle analysis passed with warnings: {file_path}")
        
        elif size_change < -1024:  # Size decreased by more than 1KB
            # Bundle size improved
            exit_with_message(0, f"Bundle size optimized ({format_size(-size_change)} smaller): {file_path}")
        
        else:
            # Minimal impact
            exit_with_message(0, f"Bundle impact minimal ({format_size(size_change):+}): {file_path}")
    
    except Exception as e:
        # Unexpected error - log and exit gracefully
        try:
            input_data = parse_hook_input() if 'input_data' not in locals() else input_data
            session_id = input_data.get("session_id", "unknown")
            file_path = get_file_path_from_input(input_data) if 'file_path' not in locals() else file_path
            
            log_hook_result(
                "bundle_impact_analyzer",
                file_path or "unknown",
                session_id,
                "error",
                {"error": str(e)}
            )
        except:
            pass
        
        exit_with_message(1, f"Bundle impact analyzer hook error: {str(e)}")


if __name__ == "__main__":
    main()