# Claude Code Hooks Directory

This directory contains all PostToolUse and PreToolUse hooks for the Maguru e-learning platform.

## 📁 Directory Structure

```
.claude/hooks/
├── README.md                       # This documentation
├── cache/                          # All log files and cache data
│   ├── accessibility_checker_log.json
│   ├── duplication_detector_log.json
│   ├── quick_type_check_log.json
│   ├── duplication_cache.json
│   └── type_check_cache.json
├── shared/                         # Shared utilities
│   └── hook_utils.py              # Common functions for all hooks
├── utils/                          # Additional utilities
│   └── generate_audio_clips.py
│
├── PostToolUse Hooks (Quality Gates):
├── quick_type_check.py            # TypeScript validation (CRITICAL)
├── accessibility_checker.py       # WCAG compliance (CRITICAL)
├── duplication_detector.py        # Code duplication analysis (IMPORTANT)
├── bundle_impact_analyzer.py      # Bundle size monitoring (RECOMMENDED)
├── ts_lint.py                     # ESLint validation (existing)
│
├── PreToolUse Hooks (Prevention):
├── function_registry_checker.py   # Function duplication prevention
├── pre_edit_validation.py         # File safety validation
├── validate_environment.py        # Environment checks
├── use_bun.py                     # Package manager enforcement
│
└── Utility Hooks:
├── windows_notification.py        # User notifications
├── play_audio.py                  # Audio feedback
├── log_pre_tool_use.py           # Command logging
└── check_input.py                # Input validation
```

## 🎯 PostToolUse Quality Gates

### Critical Priority Hooks
- **quick_type_check.py**: TypeScript compilation validation (5-15s)
- **accessibility_checker.py**: WCAG 2.1 AA compliance (1-3s)

### Important Priority Hooks
- **duplication_detector.py**: Cross-feature code similarity detection (8-20s)

### Recommended Priority Hooks
- **bundle_impact_analyzer.py**: Client-side bundle size monitoring (30-60s)

## 🛡️ PreToolUse Prevention Hooks

- **function_registry_checker.py**: Prevents function duplication via README.md registry
- **pre_edit_validation.py**: File safety and cross-feature validation
- **validate_environment.py**: Environment and dependency checks
- **use_bun.py**: Package manager enforcement (yarn over npm/pnpm)

## 📊 Logging and Caching

All hooks now store their data in the `cache/` directory:

- **Log files**: `*_log.json` - Execution history and debugging info
- **Cache files**: `*_cache.json` - Performance optimization data
- **Baseline files**: `bundle_baseline.json` - Performance comparison baselines

## 🔧 Configuration

Hooks are configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {"type": "command", "command": "uv run .claude/hooks/quick_type_check.py"},
          {"type": "command", "command": "uv run .claude/hooks/ts_lint.py"},
          {"type": "command", "command": "uv run .claude/hooks/duplication_detector.py"},
          {"type": "command", "command": "uv run .claude/hooks/accessibility_checker.py"},
          {"type": "command", "command": "uv run .claude/hooks/bundle_impact_analyzer.py"},
          {"type": "command", "command": "uv run .claude/hooks/windows_notification.py"}
        ]
      }
    ]
  }
}
```

## 📈 Performance Expectations

- **Total execution time**: 47-107 seconds for client-side files
- **Typical execution**: 15-30 seconds for most edits
- **Cache hit rate**: ~80% for repeated validations
- **False positive rate**: <5% for all quality gates

## 🚀 Usage

Hooks run automatically when Claude Code performs Write, Edit, or MultiEdit operations. They provide:

- ✅ **Real-time quality feedback**
- ❌ **Blocking for critical issues** (exit code 2)
- ⚠️ **Warnings for improvements** (exit code 0 with stderr)
- 📊 **Comprehensive logging** for quality metrics

## 🔍 Debugging

Check log files in `cache/` directory for detailed execution history:

```bash
# View recent accessibility checks
cat .claude/hooks/cache/accessibility_checker_log.json

# View TypeScript validation history
cat .claude/hooks/cache/quick_type_check_log.json
```

---

*Last updated: 2025-01-11*  
*Version: 1.0*