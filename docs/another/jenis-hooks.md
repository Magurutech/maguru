# Claude Code Hook Strategy Guide

> **Insight**: Hook strategy is like designing a quality pipeline - the key is balancing thoroughness with speed. Your current setup shows you value immediate feedback (notifications + audio), which tells me you prefer fast iteration cycles over batch validation.

This guide explores optimal hook strategies for specific workflows through discovery questions and practical implementations.

## 🤔 Discovery Questions

### About Your Current Pain Points

- What specific TypeScript errors do you encounter most often that slip through your current ts_lint.py hook?
- When you mention "duplication code analysis" - are you thinking about copy-pasted components between features, or more subtle structural duplications?
- How often do you find yourself running yarn type-check manually right now?

### About Your Development Flow

- Do you prefer catching issues immediately as you edit (potentially slower), or would you rather batch them at certain moments?
- What's your tolerance for hook execution time? Your current setup seems fast - should we maintain that speed?
- Are you working solo or with a team? (This affects notification strategies)

### About Quality Standards

- You have zero-warning ESLint tolerance - should type-check errors also be completely blocking?
- For duplication detection, what percentage would trigger a warning vs. blocking?
- Should hooks auto-fix issues when possible, or just report them?

## 📋 Hook Strategy Recommendation

### PreToolUse Hooks - Prevention Layer

```json
{
  "PreToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {"type": "command", "command": "uv run .claude/hooks/use_bun.py"},
        {"type": "command", "command": "uv run .claude/hooks/validate_environment.py"}
      ]
    },
    {
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [
        {"type": "command", "command": "uv run .claude/hooks/pre_edit_validation.py"}
      ]
    }
  ]
}
```

### PostToolUse Hooks - Quality Gates

```json
{
  "PostToolUse": [
    {
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [
        {"type": "command", "command": "uv run .claude/hooks/quick_type_check.py"},
        {"type": "command", "command": "uv run .claude/hooks/ts_lint.py"},
        {"type": "command", "command": "uv run .claude/hooks/duplication_detector.py"},
        {"type": "command", "command": "uv run .claude/hooks/windows_notification.py"}
      ]
    }
  ]
}
```

### UserPromptSubmit - Context & Planning

```json
{
  "UserPromptSubmit": [
    {
      "matcher": "",
      "hooks": [
        {"type": "command", "command": "uv run .claude/hooks/session_analyzer.py"}
      ]
    }
  ]
}
```

### SessionStart/End - Lifecycle

```json
{
  "SessionStart": [
    {"type": "command", "command": "uv run .claude/hooks/project_health_check.py"}
  ],
  "SessionEnd": [
    {"type": "command", "command": "uv run .claude/hooks/cleanup_and_report.py"}
  ]
}
```

## 🎯 Specific Hook Ideas for Your Needs

### For Type-Checking

- **quick_type_check.py** - Incremental TypeScript validation (fast, 2-5s)
- **deep_type_analysis.py** - Full project type check (slower, runs on SessionStart)
- **type_coverage_tracker.py** - Monitor type safety improvements

### For Duplication Detection

- **component_similarity.py** - Detect similar React components across features
- **logic_duplication.py** - Find duplicated business logic patterns
- **style_duplication.py** - Detect CSS/Tailwind class patterns

### Performance & Quality

- **bundle_impact_analyzer.py** - Check if changes affect bundle size
- **accessibility_checker.py** - WCAG compliance for new components
- **test_coverage_guard.py** - Ensure new code has tests

## 💡 Questions to Refine the Strategy

1. **Type-Check Priority**: Should type errors be as blocking as ESLint errors, or just warnings?
2. **Duplication Threshold**: What's your comfort level - 10% duplication as warning, 20% as error?
3. **Performance Budget**: How much time are you willing to spend on hooks per edit? (Current seems ~2-3 seconds)
4. **Auto-Fix Philosophy**: Should hooks try to fix issues automatically, or just report them?
5. **Feature-Specific Rules**: Should features/auth/ have stricter security checks than features/homepage/?

What resonates with your workflow? Which pain points are you trying to solve most urgently?

---

## 🛡️ PreToolUse Hooks - Prevention Layer

Hook #1: use_bun.py (Yang Sudah Ada)

Apa yang dilakukan:

# Memaksa penggunaan yarn daripada npm/pnpm

if "npm install" in command:
print("❌ Gunakan 'yarn add' bukan 'npm install'")
sys.exit(2) # Block dan minta perbaikan

Manfaat:

- ✅ Konsistensi package manager di seluruh tim
- ✅ Mencegah konflik lock file (yarn.lock vs package-lock.json)
- ✅ Enforce project standards dari awal

### Hook #2: validate_environment.py (Rekomendasi Baru)

**Apa yang akan dilakukan:**

```python
# Validasi environment sebelum menjalankan command
def validate_environment():
    # Check Node.js version
    if not check_node_version(">=18.0.0"):
        return error("Node.js versi minimum 18.0.0 diperlukan")
    
    # Check yarn version
    if not check_yarn_version(">=1.22.0"):
        return error("Yarn versi minimum 1.22.0 diperlukan")
    
    # Validate important env vars for Maguru
    required_env = ["DATABASE_URL", "NEXTAUTH_SECRET", "CLERK_SECRET_KEY"]
    missing = check_env_vars(required_env)
    if missing:
        return error(f"Environment variables hilang: {missing}")
    
    return success("Environment valid")
```

**Manfaat untuk Maguru:**
- ✅ **Prevent Runtime Errors**: Pastikan environment siap sebelum deploy
- ✅ **Team Consistency**: Semua developer punya setup yang sama
- ✅ **Security Check**: Pastikan secret keys tersedia
- ✅ **Database Safety**: Validasi DATABASE_URL sebelum migration

### Hook #3: pre_edit_validation.py (Rekomendasi Baru)

**Apa yang akan dilakukan:**

```python
# Validasi sebelum edit file
def pre_edit_validation(file_path, operation):
    # File protection
    if is_protected_file(file_path):
        return error(f"File {file_path} dilindungi dari edit")
    
    # Feature boundary check
    if violates_feature_boundary(file_path, operation):
        return warning("Edit lintas feature - pastikan ini disengaja")
    
    # Backup critical files
    if is_critical_file(file_path):
        create_backup(file_path)
    
    # TypeScript import validation
    if file_path.endswith('.ts', '.tsx'):
        validate_import_paths(operation)
    
    return success("Pre-edit validation passed")
```

**Manfaat Khusus untuk Maguru:**
- ✅ **Feature Isolation**: Mencegah coupling antar features (course ↔ auth)
- ✅ **Critical File Protection**: Protect prisma schema, env files
- ✅ **Import Path Safety**: Pastikan relative imports tidak rusak
- ✅ **Automatic Backup**: Backup otomatis file penting

### **Hook #4: `function_registry_checker.py` - README.md Function Registry**

**Konsep GAME-CHANGING:**
Sebelum Claude Code melakukan Edit/MultiEdit, hook akan cek README.md di folder tersebut untuk mencegah duplikasi fungsi. README.md berperan sebagai "function registry" yang mendokumentasikan semua fungsi yang ada di folder.

**Implementation Logic:**

```python
def check_function_registry(file_path, new_code):
    # 1. Cek README.md di folder target
    folder_path = os.path.dirname(file_path)
    readme_path = os.path.join(folder_path, "README.md")

    # 2. Parse existing functions dari README.md
    existing_functions = parse_readme_functions(readme_path)

    # 3. Extract new functions dari code yang akan dibuat
    new_functions = extract_functions_from_code(new_code)

    # 4. Analisis similarity dan duplikasi
    duplications = find_similar_functions(existing_functions, new_functions)

    return handle_duplication_results(duplications)
```

**Format README.md yang Diharapkan:**

```markdown
# Features/Course/Services - Function Registry

## Available Functions

### courseService.ts

- `createCourse(data: CourseData)` - Create new course with validation
- `updateCourse(id: string, data: Partial<CourseData>)` - Update existing course
- `getCourseById(id: string)` - Fetch course by ID

### courseValidation.ts

- `validateCourseData(data: CourseData)` - Validate course input data
- `sanitizeCourseTitle(title: string)` - Clean and format course title
```

**Similarity Detection:**

- **Exact Match** (similarity: 1.0) → ❌ Block: `createCourse` vs `createCourse`
- **Semantic Match** (similarity: 0.9) → ❌ Block: `createCourse` vs `addCourse`
- **Typo Detection** (similarity: 0.8) → ⚠️ Warning: `createCourse` vs `createCorse`
- **Description Match** (similarity: 0.7) → ⚠️ Warning: "Create course" vs "Add new course"

**Manfaat untuk Maguru Platform:**

- 🎯 **Zero Function Duplication**: Mencegah copy-paste functions
- 📚 **Living Documentation**: README.md auto-maintained function registry
- 🔍 **Smart Discovery**: Claude temukan existing functions sebelum bikin baru
- 🏗️ **Architecture Integrity**: Clean separation per folder/feature
- 👥 **Team Knowledge Sharing**: Semua tau function apa saja yang available
- ⚡ **Development Speed**: Reuse existing functions, tidak recreate

## 🎯 Skenario Konkret: Bagaimana Hooks Ini Bekerja

### Skenario 1: Developer Baru Join Tim

```bash
# Developer menjalankan command salah
Claude: "npm install @types/react"

# Hook validate_environment.py triggered:
❌ Node.js versi 16.x terdeteksi, minimum 18.0.0 diperlukan
❌ Environment variable CLERK_SECRET_KEY tidak ditemukan
💡 Jalankan: nvm use 18 && cp .env.example .env.local

# Command diblokir sampai environment valid
```

### Skenario 2: Edit File Lintas Feature

```bash
# Claude mencoba edit file auth dari feature course
Claude: Edit "features/auth/components/LoginForm.tsx"

# Hook pre_edit_validation.py triggered:
⚠️ Warning: Editing auth component from course context
⚠️ Apakah ini cross-feature dependency yang disengaja?
💾 Backup created: features/auth/components/LoginForm.tsx.backup
✅ Proceed with caution
```

### Skenario 3: Package Manager Enforcement

```bash
# Developer terbiasa dengan npm
Claude: "npm install react-query"

# Hook use_bun.py triggered:
❌ Gunakan 'yarn add react-query' bukan 'npm install'
💡 Alasan: Konsistensi dengan yarn.lock project
🚫 Command diblokir
```

🚀 Implementasi Bertahap

**Skenario Contoh:**

```bash
# Claude akan buat function: createNewCourse()
# Hook baca README.md, temukan: createCourse()
# Result: ❌ "Function 'createCourse' sudah ada! Gunakan existing atau beri nama spesifik"

# Claude akan buat function: validateUserInput()
# Hook baca README.md, temukan: validateCourseData()
# Result: ⚠️ "Function mirip ada: validateCourseData(). Apakah ini duplikasi?"
```

```python
# Feature boundary detection
def detect_cross_feature_edits():
    return analyze_import_patterns()
```

## 💡 Manfaat Jangka Panjang

### Untuk Solo Development

- 🎯 **Faster Debugging**: Masalah tertangkap sebelum menjadi bug
- 🔄 **Consistent Workflow**: Tidak perlu ingat semua aturan manual
- 📈 **Quality Improvement**: Code quality naik secara otomatis

### Untuk Tim Development

- 👥 **Onboarding Speed**: Developer baru langsung ikut standards
- 🔧 **Reduced PR Reviews**: Banyak isu tertangkap sebelum commit
- 📊 **Metrics**: Track compliance dengan project standards

### Untuk Maguru Platform

- 🏗️ **Architecture Integrity**: Feature boundaries terjaga
- 🔐 **Security**: Environment dan secrets selalu valid
- ⚡ **Performance**: Prevent problematic patterns early
