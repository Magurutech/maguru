#!/usr/bin/env python3
"""
Accessibility Checker Hook
PostToolUse hook for WCAG 2.1 AA compliance validation

Purpose: Validate accessibility compliance for React components
Priority: CRITICAL  
Execution Time: 1-3 seconds
Exit Codes: 0=success, 1=error, 2=fix_required
"""

import sys
import re
import ast
from pathlib import Path
from typing import List, Dict, Any, Optional

# Add shared utilities to path
sys.path.insert(0, str(Path(__file__).parent / "shared"))
from hook_utils import (
    parse_hook_input,
    get_file_path_from_input,
    is_react_component_file,
    should_skip_file,
    log_hook_result,
    exit_with_message,
    safe_file_operation
)


class AccessibilityIssue:
    """Represents an accessibility issue found in code"""
    
    def __init__(self, type_: str, severity: str, message: str, line: int = 0, element: str = ""):
        self.type = type_
        self.severity = severity  # 'error' or 'warning'
        self.message = message
        self.line = line
        self.element = element
    
    def __str__(self):
        prefix = "❌" if self.severity == "error" else "⚠️"
        line_info = f" (line {self.line})" if self.line > 0 else ""
        return f"{prefix} {self.message}{line_info}"


class AccessibilityChecker:
    """WCAG 2.1 AA compliance checker for React components"""
    
    def __init__(self):
        self.issues: List[AccessibilityIssue] = []
        self.content = ""
        self.lines = []
    
    def check_file(self, file_path: str) -> List[AccessibilityIssue]:
        """
        Check React component file for accessibility issues
        Returns list of AccessibilityIssue objects
        """
        self.issues = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                self.content = f.read()
                self.lines = self.content.split('\n')
        except Exception as e:
            self.issues.append(AccessibilityIssue(
                "file_error", "error", f"Could not read file: {e}"
            ))
            return self.issues
        
        # Run all accessibility checks
        self._check_image_alt_text()
        self._check_button_accessibility()
        self._check_form_labels()
        self._check_keyboard_navigation()
        self._check_semantic_html()
        self._check_color_contrast_patterns()
        self._check_heading_hierarchy()
        self._check_link_accessibility()
        
        return self.issues
    
    def _check_image_alt_text(self):
        """Check all img and Image components have alt text"""
        # Check HTML img tags
        img_pattern = r'<img\s+([^>]*)>'
        for match in re.finditer(img_pattern, self.content, re.IGNORECASE):
            attrs = match.group(1)
            line_num = self.content[:match.start()].count('\n') + 1
            
            if 'alt=' not in attrs and 'alt =' not in attrs:
                self.issues.append(AccessibilityIssue(
                    "missing_alt", "error", 
                    "Image missing alt attribute for screen readers",
                    line_num, match.group(0)
                ))
            elif re.search(r'alt\s*=\s*["\'][\s]*["\']', attrs):
                self.issues.append(AccessibilityIssue(
                    "empty_alt", "warning",
                    "Image has empty alt text - use alt='' only for decorative images",
                    line_num
                ))
        
        # Check Next.js Image components
        image_pattern = r'<Image\s+([^>]*?)/?>'
        for match in re.finditer(image_pattern, self.content):
            attrs = match.group(1)
            line_num = self.content[:match.start()].count('\n') + 1
            
            if 'alt=' not in attrs:
                self.issues.append(AccessibilityIssue(
                    "missing_alt", "error",
                    "Next.js Image component missing alt prop",
                    line_num, match.group(0)
                ))
    
    def _check_button_accessibility(self):
        """Check buttons have accessible names"""
        # Check button elements
        button_pattern = r'<button\s*([^>]*?)>(.*?)</button>'
        for match in re.finditer(button_pattern, self.content, re.DOTALL):
            attrs = match.group(1)
            content = match.group(2).strip()
            line_num = self.content[:match.start()].count('\n') + 1
            
            # Check if button has accessible name
            has_aria_label = 'aria-label=' in attrs
            has_aria_labelledby = 'aria-labelledby=' in attrs
            has_text_content = bool(re.sub(r'<[^>]+>', '', content).strip())
            
            if not (has_aria_label or has_aria_labelledby or has_text_content):
                self.issues.append(AccessibilityIssue(
                    "missing_button_label", "error",
                    "Button missing accessible name (text content, aria-label, or aria-labelledby)",
                    line_num
                ))
            
            # Check for icon-only buttons
            if '<svg' in content or 'Icon' in content:
                if not has_aria_label and not has_text_content:
                    self.issues.append(AccessibilityIssue(
                        "icon_button_label", "error",
                        "Icon button needs aria-label for screen readers",
                        line_num
                    ))
        
        # Check clickable divs that should be buttons
        clickable_div_pattern = r'<div\s+([^>]*?)onClick'
        for match in re.finditer(clickable_div_pattern, self.content):
            attrs = match.group(1)
            line_num = self.content[:match.start()].count('\n') + 1
            
            if 'role=' not in attrs:
                self.issues.append(AccessibilityIssue(
                    "clickable_div", "error",
                    "Clickable div should be a button or have role='button'",
                    line_num
                ))
    
    def _check_form_labels(self):
        """Check form inputs have labels"""
        # Check input elements
        input_pattern = r'<input\s+([^>]*?)/?>'
        for match in re.finditer(input_pattern, self.content):
            attrs = match.group(1)
            line_num = self.content[:match.start()].count('\n') + 1
            
            # Skip hidden inputs
            if 'type="hidden"' in attrs:
                continue
            
            # Check for label association
            has_id = re.search(r'id\s*=\s*["\']([^"\']+)["\']', attrs)
            has_aria_label = 'aria-label=' in attrs
            has_aria_labelledby = 'aria-labelledby=' in attrs
            has_placeholder = 'placeholder=' in attrs
            
            if has_id:
                input_id = has_id.group(1)
                # Check if there's a corresponding label
                label_pattern = rf'<label\s+[^>]*?for\s*=\s*["\']?{re.escape(input_id)}["\']?'
                has_label = re.search(label_pattern, self.content)
                
                if not (has_label or has_aria_label or has_aria_labelledby):
                    suggestion = "Use <label htmlFor='{}'> or aria-label".format(input_id)
                    if has_placeholder:
                        suggestion += " (placeholder is not sufficient for accessibility)"
                    
                    self.issues.append(AccessibilityIssue(
                        "missing_input_label", "error",
                        f"Form input missing accessible label. {suggestion}",
                        line_num
                    ))
    
    def _check_keyboard_navigation(self):
        """Check for keyboard navigation support"""
        # Check for onClick without keyboard event handlers
        onclick_pattern = r'onClick\s*='
        for match in re.finditer(onclick_pattern, self.content):
            line_num = self.content[:match.start()].count('\n') + 1
            
            # Get the full element
            start = match.start()
            element_start = self.content.rfind('<', 0, start)
            element_end = self.content.find('>', start)
            
            if element_start >= 0 and element_end >= 0:
                element = self.content[element_start:element_end + 1]
                
                # Skip if it's already a button or link
                if element.startswith(('<button', '<a ')):
                    continue
                
                # Check for keyboard handlers
                has_keyboard = any(handler in element for handler in [
                    'onKeyDown', 'onKeyPress', 'onKeyUp'
                ])
                
                if not has_keyboard:
                    self.issues.append(AccessibilityIssue(
                        "missing_keyboard_support", "warning",
                        "Interactive element needs keyboard support (onKeyDown/onKeyPress)",
                        line_num
                    ))
    
    def _check_semantic_html(self):
        """Check for semantic HTML usage"""
        # Check for generic divs used for lists
        if '<div' in self.content and 'map(' in self.content:
            # Look for patterns that suggest lists
            list_patterns = [
                r'\.map\s*\(\s*\([^)]*\)\s*=>\s*<div',
                r'\.map\s*\(\s*[^)]*\s*=>\s*<div'
            ]
            
            for pattern in list_patterns:
                matches = re.finditer(pattern, self.content)
                for match in matches:
                    line_num = self.content[:match.start()].count('\n') + 1
                    self.issues.append(AccessibilityIssue(
                        "semantic_html", "warning",
                        "Consider using <ul>/<ol> and <li> for lists instead of div",
                        line_num
                    ))
        
        # Check for missing main landmark
        if 'export default' in self.content and 'Page' in self.content:
            if '<main' not in self.content:
                self.issues.append(AccessibilityIssue(
                    "missing_main", "warning",
                    "Page component should have <main> landmark for screen readers"
                ))
    
    def _check_color_contrast_patterns(self):
        """Check for potential color contrast issues"""
        # Look for inline styles with color
        color_patterns = [
            r'style\s*=\s*\{\{[^}]*color\s*:',
            r'className\s*=\s*["\'][^"\']*text-gray-400',  # Low contrast text
            r'className\s*=\s*["\'][^"\']*text-gray-300',
        ]
        
        for pattern in color_patterns:
            for match in re.finditer(pattern, self.content):
                line_num = self.content[:match.start()].count('\n') + 1
                self.issues.append(AccessibilityIssue(
                    "color_contrast", "warning",
                    "Check color contrast meets WCAG AA standards (4.5:1 for normal text)",
                    line_num
                ))
    
    def _check_heading_hierarchy(self):
        """Check heading hierarchy"""
        headings = []
        heading_pattern = r'<h([1-6])[^>]*>'
        
        for match in re.finditer(heading_pattern, self.content):
            level = int(match.group(1))
            line_num = self.content[:match.start()].count('\n') + 1
            headings.append((level, line_num))
        
        # Check for skipped heading levels
        for i, (level, line_num) in enumerate(headings):
            if i > 0:
                prev_level = headings[i-1][0]
                if level > prev_level + 1:
                    self.issues.append(AccessibilityIssue(
                        "heading_hierarchy", "warning",
                        f"Heading level jumps from h{prev_level} to h{level} - consider h{prev_level + 1}",
                        line_num
                    ))
    
    def _check_link_accessibility(self):
        """Check link accessibility"""
        # Check for links without descriptive text
        link_pattern = r'<a\s+([^>]*?)>(.*?)</a>'
        for match in re.finditer(link_pattern, self.content, re.DOTALL):
            attrs = match.group(1)
            content = match.group(2).strip()
            line_num = self.content[:match.start()].count('\n') + 1
            
            # Remove HTML tags from content
            text_content = re.sub(r'<[^>]+>', '', content).strip()
            
            # Check for generic link text
            generic_texts = ['click here', 'read more', 'here', 'more', 'link']
            if text_content.lower() in generic_texts:
                self.issues.append(AccessibilityIssue(
                    "generic_link_text", "warning",
                    f"Link text '{text_content}' is not descriptive - use meaningful link text",
                    line_num
                ))
            
            # Check external links
            if 'href=' in attrs and ('http://' in attrs or 'https://' in attrs):
                if 'target="_blank"' in attrs:
                    has_rel_noopener = 'rel=' in attrs and 'noopener' in attrs
                    if not has_rel_noopener:
                        self.issues.append(AccessibilityIssue(
                            "external_link_security", "warning",
                            "External link with target='_blank' should include rel='noopener noreferrer'",
                            line_num
                        ))


def main():
    """Main hook execution"""
    try:
        # Parse input from Claude Code
        input_data = parse_hook_input()
        file_path = get_file_path_from_input(input_data)
        session_id = input_data.get("session_id", "unknown")
        
        # Skip if no file path
        if not file_path:
            exit_with_message(0, "No file path provided - skipping accessibility check")
        
        # Skip non-React component files
        if not is_react_component_file(file_path):
            exit_with_message(0, f"Skipping non-React component: {file_path}")
        
        # Skip files that should be ignored
        if should_skip_file(file_path):
            exit_with_message(0, f"Skipping ignored file: {file_path}")
        
        # Check if file exists
        if not Path(file_path).exists():
            exit_with_message(0, f"File does not exist: {file_path}")
        
        # Skip files in certain directories (hooks, services, adapters)
        skip_dirs = ['hooks/', 'services/', 'adapters/', 'types/', 'lib/']
        if any(skip_dir in file_path for skip_dir in skip_dirs):
            exit_with_message(0, f"Skipping non-UI file: {file_path}")
        
        # Run accessibility check
        checker = AccessibilityChecker()
        issues = checker.check_file(file_path)
        
        # Categorize issues
        errors = [issue for issue in issues if issue.severity == "error"]
        warnings = [issue for issue in issues if issue.severity == "warning"]
        
        # Log results
        log_hook_result(
            "accessibility_checker",
            file_path,
            session_id,
            "failed" if errors else "success",
            {
                "errors": len(errors),
                "warnings": len(warnings),
                "issues": [str(issue) for issue in issues]
            }
        )
        
        if errors:
            # Format error message for Claude
            error_msg = f"Accessibility issues found in {file_path}"
            details = "♿ WCAG Compliance Issues:\n\n"
            
            for error in errors:
                details += f"{error}\n"
            
            if warnings:
                details += "\n⚠️ Accessibility Warnings:\n\n"
                for warning in warnings:
                    details += f"{warning}\n"
            
            details += "\n💡 Fix accessibility issues to ensure compliance with WCAG 2.1 AA standards."
            exit_with_message(2, error_msg, details)
        
        elif warnings:
            # Warnings only - pass but inform
            warning_msg = f"Accessibility warnings in {file_path}"
            details = "♿ Consider these accessibility improvements:\n\n"
            
            for warning in warnings:
                details += f"{warning}\n"
            
            print(details, file=sys.stderr)
            exit_with_message(0, f"Accessibility check passed with warnings: {file_path}")
        
        else:
            # All good!
            exit_with_message(0, f"Accessibility check passed: {file_path}")
    
    except Exception as e:
        # Unexpected error - log and exit gracefully
        try:
            input_data = parse_hook_input() if 'input_data' not in locals() else input_data
            session_id = input_data.get("session_id", "unknown")
            file_path = get_file_path_from_input(input_data) if 'file_path' not in locals() else file_path
            
            log_hook_result(
                "accessibility_checker",
                file_path or "unknown",
                session_id,
                "error",
                {"error": str(e)}
            )
        except:
            pass
        
        exit_with_message(1, f"Accessibility check hook error: {str(e)}")


if __name__ == "__main__":
    main()