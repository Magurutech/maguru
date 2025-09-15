"""
Shared project analysis utilities for Claude Code hooks.
Provides common functionality for analyzing project structure, features, and context.
"""

import os
import re
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime


class ProjectAnalyzer:
    """Analyzer for Maguru project structure and context."""
    
    def __init__(self, project_root: Optional[Path] = None):
        self.project_root = project_root or Path.cwd()
        self.features = ["auth", "course", "homepage"]
        
        # Task classification patterns
        self.task_patterns = {
            "component": r"(component|komponen|ui|interface|create.*component)",
            "api": r"(api|endpoint|service|adapter|rest|graphql)",
            "hook": r"(hook|custom hook|state|context)",
            "page": r"(page|halaman|route|routing|navigation)",
            "test": r"(test|testing|spec|e2e|unit test)",
            "fix": r"(fix|bug|error|perbaiki|debug)",
            "refactor": r"(refactor|cleanup|optimize|improve|restructure)"
        }
    
    def detect_feature_context(self, prompt: str) -> str:
        """Detect which feature the user is working on based on prompt content."""
        prompt_lower = prompt.lower()
        
        # Direct feature name detection
        for feature in self.features:
            if feature in prompt_lower:
                return feature
        
        # Advanced detection based on keywords
        if any(word in prompt_lower for word in ["login", "auth", "user", "profile", "sign", "register"]):
            return "auth"
        elif any(word in prompt_lower for word in ["course", "lesson", "curriculum", "learning", "education"]):
            return "course"
        elif any(word in prompt_lower for word in ["landing", "home", "marketing", "hero", "welcome"]):
            return "homepage"
        
        # Check for file paths in prompt
        for feature in self.features:
            if f"features/{feature}" in prompt_lower or f"app/{feature}" in prompt_lower:
                return feature
        
        return "general"
    
    def classify_task_type(self, prompt: str) -> str:
        """Classify the type of development task based on prompt content."""
        prompt_lower = prompt.lower()
        
        for task_type, pattern in self.task_patterns.items():
            if re.search(pattern, prompt_lower):
                return task_type
        
        return "general"
    
    def estimate_complexity(self, prompt: str) -> str:
        """Estimate task complexity based on prompt indicators."""
        complexity_indicators = {
            "high": [
                "architecture", "migration", "refactor system", "new feature", 
                "multiple files", "database", "security", "authentication",
                "integration", "deployment", "infrastructure"
            ],
            "medium": [
                "component", "api", "hook", "integration", "service",
                "adapter", "middleware", "validation", "optimization"
            ],
            "low": [
                "fix", "update", "change", "modify", "text", "style",
                "color", "typo", "small change", "quick fix"
            ]
        }
        
        prompt_lower = prompt.lower()
        
        # Count indicators for each level
        scores = {}
        for level, indicators in complexity_indicators.items():
            score = sum(1 for indicator in indicators if indicator in prompt_lower)
            scores[level] = score
        
        # Return the level with highest score, defaulting to medium
        if scores["high"] > scores["medium"] and scores["high"] > scores["low"]:
            return "high"
        elif scores["low"] > scores["medium"] and scores["low"] > scores["high"]:
            return "low"
        
        return "medium"
    
    def needs_testing(self, prompt: str) -> bool:
        """Determine if the task requires test coverage."""
        prompt_lower = prompt.lower()
        
        # Always require tests for these types
        always_test = [
            "component", "api", "hook", "service", "adapter",
            "authentication", "security", "payment", "data"
        ]
        
        # Never require tests for these types
        never_test = [
            "style", "css", "color", "typo", "text", "documentation"
        ]
        
        if any(keyword in prompt_lower for keyword in always_test):
            return True
        
        if any(keyword in prompt_lower for keyword in never_test):
            return False
        
        # Default: require tests for medium/high complexity tasks
        complexity = self.estimate_complexity(prompt)
        return complexity in ["medium", "high"]
    
    def is_security_sensitive(self, prompt: str) -> bool:
        """Determine if the task involves security-sensitive operations."""
        security_keywords = [
            "auth", "login", "password", "token", "jwt", "session",
            "security", "permission", "role", "access", "credential",
            "encrypt", "decrypt", "hash", "secret", "api key",
            "database", "sql", "injection", "xss", "csrf"
        ]
        
        prompt_lower = prompt.lower()
        return any(keyword in prompt_lower for keyword in security_keywords)
    
    def get_relevant_files(self, feature_context: str) -> List[str]:
        """Get list of relevant files based on feature context."""
        if feature_context == "general":
            return []
        
        relevant_files = []
        
        # Feature directory files
        feature_dir = self.project_root / "features" / feature_context
        if feature_dir.exists():
            for file_path in feature_dir.rglob("*.{ts,tsx,js,jsx}"):
                relevant_files.append(str(file_path.relative_to(self.project_root)))
        
        # App router files
        app_feature_dir = self.project_root / "app" / feature_context
        if app_feature_dir.exists():
            for file_path in app_feature_dir.rglob("*.{ts,tsx,js,jsx}"):
                relevant_files.append(str(file_path.relative_to(self.project_root)))
        
        return relevant_files[:10]  # Limit to prevent overwhelming Claude
    
    def get_coding_standards(self, task_type: str) -> List[str]:
        """Get relevant coding standards based on task type."""
        general_standards = [
            "Use kebab-case for file and directory names",
            "Follow feature-first directory structure",
            "Include TypeScript types for all functions",
            "Use ESLint with zero warnings tolerance"
        ]
        
        specific_standards = {
            "component": [
                "Use shadcn/ui components when possible",
                "Implement proper accessibility (ARIA labels)",
                "Follow React 19 best practices",
                "Include proper TypeScript interfaces for props"
            ],
            "api": [
                "Use appropriate adapter pattern",
                "Include comprehensive error handling", 
                "Add input validation with Zod schemas",
                "Follow RESTful API conventions"
            ],
            "hook": [
                "Follow React hooks naming convention (use prefix)",
                "Implement proper dependency arrays",
                "Handle loading and error states",
                "Use TypeScript generics when appropriate"
            ],
            "page": [
                "Use Next.js App Router conventions",
                "Implement proper metadata and SEO",
                "Handle loading states and error boundaries",
                "Follow responsive design principles"
            ],
            "test": [
                "Use Jest and React Testing Library",
                "Follow AAA pattern (Arrange, Act, Assert)",
                "Test user interactions, not implementation details",
                "Include accessibility testing with jest-axe"
            ]
        }
        
        standards = general_standards.copy()
        if task_type in specific_standards:
            standards.extend(specific_standards[task_type])
        
        return standards
    
    def analyze_modified_files(self, file_paths: List[str]) -> Dict[str, Any]:
        """Analyze recently modified files to understand development patterns."""
        if not file_paths:
            return {"features_touched": [], "file_types": {}, "complexity": "low"}
        
        features_touched = set()
        file_types = {}
        
        for file_path in file_paths:
            # Extract feature from path
            if file_path.startswith('features/'):
                parts = file_path.split('/')
                if len(parts) > 1:
                    features_touched.add(parts[1])
            
            # Count file types
            file_ext = Path(file_path).suffix
            file_types[file_ext] = file_types.get(file_ext, 0) + 1
        
        # Determine complexity based on number of files and features
        complexity = "low"
        if len(file_paths) > 5 or len(features_touched) > 1:
            complexity = "high" 
        elif len(file_paths) > 2 or len(features_touched) == 1:
            complexity = "medium"
        
        return {
            "features_touched": list(features_touched),
            "file_types": file_types,
            "complexity": complexity,
            "total_files": len(file_paths)
        }
    
    def get_project_health_score(self) -> Dict[str, Any]:
        """Calculate overall project health score."""
        try:
            # Check various health indicators
            health_checks = {
                "dependencies": self._check_dependencies_health(),
                "typescript": self._check_typescript_health(),
                "lint": self._check_lint_health(),
                "git": self._check_git_health()
            }
            
            # Calculate overall score
            scores = [check.get("score", 0) for check in health_checks.values()]
            overall_score = sum(scores) / len(scores) if scores else 0
            
            return {
                "overall_score": round(overall_score, 2),
                "status": "healthy" if overall_score > 0.8 else "needs_attention" if overall_score > 0.5 else "critical",
                "checks": health_checks
            }
        except Exception:
            return {
                "overall_score": 0,
                "status": "unknown", 
                "checks": {}
            }
    
    def _check_dependencies_health(self) -> Dict[str, Any]:
        """Check dependencies health."""
        node_modules = self.project_root / "node_modules"
        package_json = self.project_root / "package.json"
        
        if not node_modules.exists():
            return {"score": 0, "message": "node_modules not found"}
        
        if package_json.exists():
            if package_json.stat().st_mtime > node_modules.stat().st_mtime:
                return {"score": 0.5, "message": "Dependencies may be outdated"}
        
        return {"score": 1.0, "message": "Dependencies up to date"}
    
    def _check_typescript_health(self) -> Dict[str, Any]:
        """Quick TypeScript health check."""
        try:
            result = subprocess.run(
                ["yarn", "type-check"],
                capture_output=True,
                text=True,
                timeout=15,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                return {"score": 1.0, "message": "TypeScript compilation clean"}
            else:
                return {"score": 0, "message": "TypeScript errors present"}
        except Exception:
            return {"score": 0.5, "message": "Could not check TypeScript"}
    
    def _check_lint_health(self) -> Dict[str, Any]:
        """Check ESLint health."""
        try:
            result = subprocess.run(
                ["yarn", "lint"],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                return {"score": 1.0, "message": "ESLint clean"}
            else:
                return {"score": 0.5, "message": "ESLint warnings present"}
        except Exception:
            return {"score": 0.5, "message": "Could not check ESLint"}
    
    def _check_git_health(self) -> Dict[str, Any]:
        """Check Git repository health."""
        try:
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.stdout.strip():
                return {"score": 0.8, "message": "Uncommitted changes present"}
            else:
                return {"score": 1.0, "message": "Working directory clean"}
        except Exception:
            return {"score": 0.5, "message": "Could not check git status"}