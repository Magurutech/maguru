"""
Context management utilities for Claude Code hooks.
Provides session context persistence and cross-session continuity functionality.
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta


class ContextManager:
    """Manages session context and persistence for Claude Code hooks."""
    
    def __init__(self, project_root: Optional[Path] = None):
        self.project_root = project_root or Path.cwd()
        self.claude_dir = self.project_root / ".claude"
        self.context_dir = self.claude_dir / "context"
        self.reports_dir = self.claude_dir / "reports"
        
        # Ensure directories exist
        self.context_dir.mkdir(parents=True, exist_ok=True)
        self.reports_dir.mkdir(parents=True, exist_ok=True)
    
    def save_session_context(self, context_data: Dict[str, Any]) -> bool:
        """Save session context data."""
        try:
            context_file = self.context_dir / "session_context.json"
            
            # Add metadata
            context_data.update({
                "timestamp": datetime.now().isoformat(),
                "project_root": str(self.project_root)
            })
            
            with open(context_file, "w", encoding="utf-8") as f:
                json.dump(context_data, f, indent=2, ensure_ascii=False)
            
            return True
            
        except Exception as e:
            self._log_error(f"Failed to save session context: {e}")
            return False
    
    def load_session_context(self) -> Dict[str, Any]:
        """Load the most recent session context."""
        try:
            context_file = self.context_dir / "session_context.json"
            
            if context_file.exists():
                with open(context_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            
            return {}
            
        except Exception as e:
            self._log_error(f"Failed to load session context: {e}")
            return {}
    
    def save_health_report(self, health_data: Dict[str, Any]) -> bool:
        """Save project health report."""
        try:
            # Save detailed report with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = self.reports_dir / f"health_{timestamp}.json"
            
            health_data.update({
                "timestamp": datetime.now().isoformat(),
                "report_type": "health_check"
            })
            
            with open(report_file, "w", encoding="utf-8") as f:
                json.dump(health_data, f, indent=2, ensure_ascii=False)
            
            # Update latest health report
            latest_file = self.reports_dir / "latest_health.json"
            with open(latest_file, "w", encoding="utf-8") as f:
                json.dump(health_data, f, indent=2, ensure_ascii=False)
            
            return True
            
        except Exception as e:
            self._log_error(f"Failed to save health report: {e}")
            return False
    
    def load_latest_health_report(self) -> Dict[str, Any]:
        """Load the latest health report."""
        try:
            latest_file = self.reports_dir / "latest_health.json"
            
            if latest_file.exists():
                with open(latest_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            
            return {}
            
        except Exception as e:
            self._log_error(f"Failed to load health report: {e}")
            return {}
    
    def save_session_report(self, session_data: Dict[str, Any]) -> bool:
        """Save session end report."""
        try:
            # Save detailed report with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = self.reports_dir / f"session_{timestamp}.json"
            
            session_data.update({
                "timestamp": datetime.now().isoformat(),
                "report_type": "session_end"
            })
            
            with open(report_file, "w", encoding="utf-8") as f:
                json.dump(session_data, f, indent=2, ensure_ascii=False)
            
            # Update latest session summary
            latest_file = self.reports_dir / "latest_session.json"
            with open(latest_file, "w", encoding="utf-8") as f:
                json.dump(session_data, f, indent=2, ensure_ascii=False)
            
            return True
            
        except Exception as e:
            self._log_error(f"Failed to save session report: {e}")
            return False
    
    def load_latest_session_report(self) -> Dict[str, Any]:
        """Load the latest session report."""
        try:
            latest_file = self.reports_dir / "latest_session.json"
            
            if latest_file.exists():
                with open(latest_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            
            return {}
            
        except Exception as e:
            self._log_error(f"Failed to load session report: {e}")
            return {}
    
    def get_historical_data(self, data_type: str = "all", days: int = 7) -> List[Dict[str, Any]]:
        """Get historical data from reports."""
        try:
            cutoff_date = datetime.now() - timedelta(days=days)
            historical_data = []
            
            # Define file patterns based on data type
            patterns = []
            if data_type in ["all", "health"]:
                patterns.append("health_*.json")
            if data_type in ["all", "session"]:
                patterns.append("session_*.json")
            
            for pattern in patterns:
                for report_file in self.reports_dir.glob(pattern):
                    try:
                        # Check if file is within date range based on filename
                        timestamp_str = report_file.stem.split('_', 1)[1]
                        file_date = datetime.strptime(timestamp_str, "%Y%m%d_%H%M%S")
                        
                        if file_date >= cutoff_date:
                            with open(report_file, "r", encoding="utf-8") as f:
                                data = json.load(f)
                                data["file_date"] = file_date.isoformat()
                                historical_data.append(data)
                    except Exception:
                        continue
            
            # Sort by timestamp
            historical_data.sort(key=lambda x: x.get("timestamp", ""))
            return historical_data
            
        except Exception as e:
            self._log_error(f"Failed to get historical data: {e}")
            return []
    
    def cleanup_old_reports(self, keep_days: int = 30) -> int:
        """Clean up old report files."""
        try:
            cutoff_date = datetime.now() - timedelta(days=keep_days)
            cleaned_count = 0
            
            for report_file in self.reports_dir.glob("*.json"):
                # Skip latest files
                if report_file.name.startswith("latest_"):
                    continue
                
                try:
                    # Extract timestamp from filename
                    name_parts = report_file.stem.split('_')
                    if len(name_parts) >= 2:
                        timestamp_str = '_'.join(name_parts[1:])
                        file_date = datetime.strptime(timestamp_str, "%Y%m%d_%H%M%S")
                        
                        if file_date < cutoff_date:
                            report_file.unlink()
                            cleaned_count += 1
                except Exception:
                    continue
            
            return cleaned_count
            
        except Exception as e:
            self._log_error(f"Failed to cleanup old reports: {e}")
            return 0
    
    def get_context_summary(self) -> Dict[str, Any]:
        """Get summary of current context state."""
        try:
            session_context = self.load_session_context()
            latest_health = self.load_latest_health_report()
            latest_session = self.load_latest_session_report()
            
            # Count available reports
            health_reports = len(list(self.reports_dir.glob("health_*.json")))
            session_reports = len(list(self.reports_dir.glob("session_*.json")))
            
            return {
                "timestamp": datetime.now().isoformat(),
                "has_session_context": bool(session_context),
                "last_health_check": latest_health.get("timestamp"),
                "last_session_end": latest_session.get("timestamp"),
                "available_reports": {
                    "health_reports": health_reports,
                    "session_reports": session_reports
                },
                "context_age_hours": self._calculate_context_age(session_context),
                "storage_usage": self._calculate_storage_usage()
            }
            
        except Exception as e:
            self._log_error(f"Failed to get context summary: {e}")
            return {"error": str(e)}
    
    def persist_prompt_analysis(self, analysis: Dict[str, Any]) -> bool:
        """Persist prompt analysis results."""
        try:
            analysis_file = self.context_dir / "prompt_analysis.json"
            
            # Keep history of recent analyses
            history = []
            if analysis_file.exists():
                try:
                    with open(analysis_file, "r", encoding="utf-8") as f:
                        history = json.load(f).get("history", [])
                except Exception:
                    history = []
            
            # Add current analysis
            analysis_with_timestamp = {
                **analysis,
                "timestamp": datetime.now().isoformat()
            }
            
            history.append(analysis_with_timestamp)
            
            # Keep only recent analyses (last 20)
            history = history[-20:]
            
            # Save updated history
            data = {
                "current": analysis_with_timestamp,
                "history": history,
                "last_updated": datetime.now().isoformat()
            }
            
            with open(analysis_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            return True
            
        except Exception as e:
            self._log_error(f"Failed to persist prompt analysis: {e}")
            return False
    
    def get_recent_analyses(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent prompt analyses."""
        try:
            analysis_file = self.context_dir / "prompt_analysis.json"
            
            if analysis_file.exists():
                with open(analysis_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return data.get("history", [])[-limit:]
            
            return []
            
        except Exception as e:
            self._log_error(f"Failed to get recent analyses: {e}")
            return []
    
    def _calculate_context_age(self, context: Dict[str, Any]) -> Optional[float]:
        """Calculate age of context in hours."""
        try:
            if not context or "timestamp" not in context:
                return None
            
            context_time = datetime.fromisoformat(context["timestamp"].replace("Z", "+00:00"))
            now = datetime.now()
            
            # Handle timezone naive datetime
            if context_time.tzinfo is None:
                context_time = context_time.replace(tzinfo=None)
            if now.tzinfo is None:
                now = now.replace(tzinfo=None)
            
            age = now - context_time
            return age.total_seconds() / 3600
            
        except Exception:
            return None
    
    def _calculate_storage_usage(self) -> Dict[str, Any]:
        """Calculate storage usage of context files."""
        try:
            total_size = 0
            file_count = 0
            
            for file_path in [self.context_dir, self.reports_dir]:
                if file_path.exists():
                    for file in file_path.rglob("*.json"):
                        total_size += file.stat().st_size
                        file_count += 1
            
            return {
                "total_size_bytes": total_size,
                "total_size_mb": round(total_size / 1024 / 1024, 2),
                "file_count": file_count
            }
            
        except Exception:
            return {"total_size_bytes": 0, "total_size_mb": 0, "file_count": 0}
    
    def _log_error(self, message: str):
        """Log error message to stderr."""
        import sys
        print(f"ContextManager Error: {message}", file=sys.stderr)