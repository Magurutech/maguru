#!/usr/bin/env python3

import json
import sys
import subprocess
import os
import re
from pathlib import Path

def check_node_version(min_version="18.0.0"):
    """Check if Node.js version meets minimum requirement."""
    try:
        result = subprocess.run(["node", "--version"], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode != 0:
            return False, "Node.js tidak terdeteksi"
        
        # Parse version dari output seperti "v18.17.0"
        version_str = result.stdout.strip().lstrip('v')
        current_version = tuple(map(int, version_str.split('.')))
        required_version = tuple(map(int, min_version.split('.')))
        
        if current_version < required_version:
            return False, f"Node.js versi {version_str} terdeteksi, minimum {min_version} diperlukan"
        
        return True, f"Node.js {version_str} ✅"
        
    except (subprocess.TimeoutExpired, subprocess.SubprocessError, FileNotFoundError):
        return False, "Node.js tidak terdeteksi atau tidak dapat diakses"
    except Exception as e:
        return False, f"Error checking Node.js version: {str(e)}"

def check_yarn_version(min_version="1.22.0"):
    """Check if Yarn version meets minimum requirement."""
    try:
        result = subprocess.run(["yarn", "--version"], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode != 0:
            return False, "Yarn tidak terdeteksi"
        
        version_str = result.stdout.strip()
        current_version = tuple(map(int, version_str.split('.')))
        required_version = tuple(map(int, min_version.split('.')))
        
        if current_version < required_version:
            return False, f"Yarn versi {version_str} terdeteksi, minimum {min_version} diperlukan"
            
        return True, f"Yarn {version_str} ✅"
        
    except (subprocess.TimeoutExpired, subprocess.SubprocessError, FileNotFoundError):
        return False, "Yarn tidak terdeteksi atau tidak dapat diakses"
    except Exception as e:
        return False, f"Error checking Yarn version: {str(e)}"

def check_env_vars(required_vars):
    """Check if required environment variables are present."""
    missing_vars = []
    present_vars = []
    
    for var_name in required_vars:
        var_value = os.getenv(var_name)
        if var_value is None or var_value.strip() == "":
            missing_vars.append(var_name)
        else:
            # Don't log actual values for security
            present_vars.append(f"{var_name} ✅")
    
    return missing_vars, present_vars

def validate_project_environment():
    """Validate complete project environment for Maguru."""
    issues = []
    success_items = []
    
    # Check Node.js version
    node_ok, node_msg = check_node_version("18.0.0")
    if node_ok:
        success_items.append(node_msg)
    else:
        issues.append(f"❌ {node_msg}")
    
    # Check Yarn version  
    yarn_ok, yarn_msg = check_yarn_version("1.22.0")
    if yarn_ok:
        success_items.append(yarn_msg)
    else:
        issues.append(f"❌ {yarn_msg}")
    
    # Check critical environment variables for Maguru
    required_env_vars = [
        "DATABASE_URL",
        "NEXTAUTH_SECRET", 
        "CLERK_SECRET_KEY"
    ]
    
    missing_vars, present_vars = check_env_vars(required_env_vars)
    success_items.extend(present_vars)
    
    if missing_vars:
        issues.append(f"❌ Environment variables tidak ditemukan: {', '.join(missing_vars)}")
    
    # Additional checks - optional but recommended
    optional_vars = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]
    missing_optional, present_optional = check_env_vars(optional_vars)
    
    if present_optional:
        success_items.extend([f"{var} ✅ (optional)" for var in present_optional])
    
    if missing_optional:
        # Only warning for optional vars
        issues.append(f"⚠️  Optional environment variables tidak ada: {', '.join(missing_optional)}")
    
    return issues, success_items

def main():
    try:
        # Read input data from stdin
        input_data = json.load(sys.stdin)
        
        # Only validate for Bash commands that might affect environment
        tool_input = input_data.get("tool_input", {})
        command = tool_input.get("command", "")
        
        # Skip validation for simple read commands
        if command:
            # Only validate for potentially dangerous commands
            dangerous_patterns = [
                r"\bnpm\s+install",
                r"\byarn\s+install", 
                r"\bnpx\s+",
                r"\byarn\s+add",
                r"\byarn\s+remove",
                r"\bnpm\s+run",
                r"\byarn\s+run",
                r"\byarn\s+dev",
                r"\byarn\s+build",
                r"\byarn\s+start",
                r"\bmigrate",
                r"\bprisma",
                r"\bnext\s+dev",
                r"\bnext\s+build"
            ]
            
            needs_validation = any(re.search(pattern, command, re.IGNORECASE) 
                                 for pattern in dangerous_patterns)
            
            if not needs_validation:
                # Skip validation for safe commands
                sys.exit(0)
        
        # Perform environment validation
        issues, success_items = validate_project_environment()
        
        if success_items:
            print("✅ Environment checks passed:", file=sys.stderr)
            for item in success_items:
                print(f"  {item}", file=sys.stderr)
        
        if issues:
            # Separate critical vs warning issues
            critical_issues = [issue for issue in issues if issue.startswith("❌")]
            warning_issues = [issue for issue in issues if issue.startswith("⚠️")]
            
            if critical_issues:
                print("🚨 Critical environment issues:", file=sys.stderr)
                for issue in critical_issues:
                    print(f"  {issue}", file=sys.stderr)
                
                print("\n💡 Quick fixes:", file=sys.stderr)
                print("  - Install Node.js 18+: https://nodejs.org/", file=sys.stderr)
                print("  - Install Yarn: npm install -g yarn", file=sys.stderr)
                print("  - Setup environment: cp .env.example .env.local", file=sys.stderr)
                print("  - Run: yarn env:validate", file=sys.stderr)
                
                # Block execution for critical issues
                sys.exit(2)
            
            if warning_issues:
                # Only warnings, allow execution to continue
                print("⚠️  Environment warnings:", file=sys.stderr)
                for issue in warning_issues:
                    print(f"  {issue}", file=sys.stderr)
                sys.exit(0)
        
        # All checks passed
        print("✅ Environment validation passed", file=sys.stderr)
        sys.exit(0)
        
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON input: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error in validate_environment hook: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()