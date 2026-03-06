# Sprint 2 - Quiz & Assessment System

Dokumentasi sprint untuk implementasi sistem kuis dan penilaian.

---

## 📋 Ringkasan

Sprint ini berfokus pada **menutup core learning loop**: Belajar → Praktek → Kuis → Feedback → Review.

**Fitur Utama:**
1. Quiz System - Kuis creation, taking, scoring
2. Diagnostic Test - Baseline assessment untuk user baru
3. Hint System - Progressive hints untuk stuck students
4. Review Flow - Otomatis review untuk failed quizzes

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────┐
│      Quiz & Assessment Architecture      │
├─────────────────────────────────────────────┤
│                                         │
│  ┌────────────┐  ┌──────────┐      │
│  │ Frontend   │  │  API Layer │      │
│  │ (Quiz UI)  │  │  (Supabase│      │
│  └────────────┘  │  + LangServe)│      │
│        │              │               │      │
│        ▼              ▼               ▼      │
│  ┌────────────────────────────────┐       │
│  │     Data Layer (Hybrid)      │       │
│  │  ┌──────────────┐          │       │
│  │  │ Supabase     │          │       │
│  │  │ - Quizzes     │          │       │
│  │  │ - Answers     │          │       │
│  │  │ - Scores      │          │       │
│  │  └──────────────┘          │       │
│  │  ┌──────────────┐          │       │
│  │  │ LangServe     │          │       │
│  │  │ - Feedback     │          │       │
│  │  └──────────────┘          │       │
│  └────────────────────────────────┘       │
└─────────────────────────────────────────────┘
```

---

## 🎯 Gambaran Besar Fitur

### 1. Quiz System
**Deskripsi:** Sistem kuis lengkap untuk mengukur pemahaman siswa setelah belajar materi.

**Komponen Utama:**
- Quiz Builder - Interface untuk membuat pertanyaan (multiple choice, code completion)
- Quiz Taking UI - Tampilan kuis untuk siswa
- Scoring Engine - Hitung skor dan tentukan pass/fail
- Results Display - Tampilkan skor dengan breakdown per topik
- Feedback Integration - Gunakan LangServe untuk feedback detail

---

### 2. Diagnostic Test
**Deskripsi:** Tes diagnostik singkat untuk user baru agar sistem mengerti kekuatan dan kelemahan.

**Komponen Utama:**
- Diagnostic Questions - Bank pertanyaan (15-20 soal)
- Profiling Algorithm - Analisis jawaban untuk mapping kekuatan/kelemahan
- Profile Setup - Form data user untuk personalisasi
- Recommendation Engine - Generate rekomendasi course berdasarkan profil

---

### 3. Hint System
**Deskripsi:** Progressive hints (Level 1-2-3) untuk siswa yang stuck pada exercise.

**Komponen Utama:**
- Hint Button UI - Tombol hint di learning interface
- Hint Level Tracking - Cek dan update level hint saat ini
- Cooldown System - Limit request hint untuk mencegah over-reliance
- LangServe Integration - Call `streamHint()` untuk generate hints

---

### 4. Review Flow
**Deskripsi:** Otomatis review trigger untuk siswa yang gagal kuis (<70%).

**Komponen Utama:**
- Failed Quiz Detection - Identify quizzes dengan score < 70%
- Weak Topics Mapping - Tag topik yang gagal di kuasai
- Review Mode - Special mode dengan konten alternatif
- Verification Quiz - Mini quiz setelah review untuk verifikasi

---

## 🎨 UI/UX Guidelines

### Quiz Taking Layout
```
- Question-by-question display (bukan semua sekaligus)
- Progress indicator: "Question 3 / 10"
- Timer opsional per question / total
- Answer input yang jelas dan mudah
- Feedback langsung setelah submit
```

### Quiz Builder Layout
```
- List view untuk semua pertanyaan
- Form editor untuk setiap pertanyaan
- Preview panel untuk melihat hasil
- Drag-drop untuk reordering
- Validation realtime sebelum save
```

### Diagnostic Test Layout
```
- Timer countdown untuk timed test
- Progress bar untuk soal terjawab
- Auto-save answer lokal (prevent refresh loss)
- Results dengan topic breakdown (strengths/weaknesses)
```

---

## 🚀 API Endpoints

### Quiz Management
```
POST   /api/quizzes                 - Create quiz baru
GET    /api/quizzes                 - List all quizzes
GET    /api/quizzes/[id]             - Get quiz detail
PUT    /api/quizzes/[id]             - Update quiz
DELETE /api/quizzes/[id]             - Delete quiz

POST   /api/quizzes/[id]/questions      - Add question ke quiz
GET    /api/quizzes/[id]/questions      - List questions dalam quiz
PUT    /api/quizzes/[id]/questions/[qId] - Update question
DELETE /api/quizzes/[id]/questions/[qId] - Delete question

POST   /api/quizzes/submit           - Submit jawaban kuis
GET    /api/quizzes/[id]/results       - Get results kuis
```

### Diagnostic Test
```
POST   /api/diagnostic/start          - Mulai diagnostic test
GET    /api/diagnostic/questions        - Get pertanyaan diagnostic
POST   /api/diagnostic/submit       - Submit jawaban diagnostic
GET    /api/diagnostic/results        - Get hasil diagnostic
GET    /api/diagnostic/profile         - Get user profile
POST   /api/diagnostic/profile         - Update user profile
GET    /api/diagnostic/recommendations - Get rekomendasi course
```

### Hint System
```
POST   /api/hints/request             - Request hint untuk item
GET    /api/hints/status/[itemId]      - Cek status hint (level, cooldown)
PUT    /api/hints/status/[itemId]      - Update status hint
```

### Review Flow
```
GET    /api/review/failed-quizzes      - Get failed quizzes untuk review
POST   /api/review/[quizId]/start       - Mulai review mode
POST   /api/review/[quizId]/complete    - Selesaikan review
GET    /api/review/[quizId]/materials   - Get materi review
POST   /api/review/[quizId]/verify     - Submit verification quiz
```

---

## 📊 Struktur Data (Supabase)

### Quiz Tables
```sql
-- Quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_item_id UUID REFERENCES course_items(id),
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Questions
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id),
  question_type TEXT NOT NULL, -- 'multiple_choice', 'code_completion'
  question_data JSONB NOT NULL,
  correct_answer JSONB NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER
);

-- Quiz Answers
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  question_id UUID REFERENCES quiz_questions(id),
  answer JSONB NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Scores
CREATE TABLE quiz_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  quiz_id UUID REFERENCES quizzes(id),
  total_score INTEGER,
  max_score INTEGER,
  passed BOOLEAN DEFAULT FALSE,
  topic_breakdown JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Diagnostic Tables
```sql
-- Diagnostic Questions
CREATE TABLE diagnostic_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_data JSONB NOT NULL,
  topics TEXT[],
  difficulty TEXT,
  order_index INTEGER
);

-- Diagnostic Answers
CREATE TABLE diagnostic_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  question_id UUID REFERENCES diagnostic_questions(id),
  answer JSONB NOT NULL,
  is_correct BOOLEAN
);

-- User Profile
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id),
  grade_level TEXT,
  subjects TEXT[],
  study_hours TEXT,
  diagnostic_score JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Paths
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  recommended_courses JSONB NOT NULL,
  weak_topics TEXT[],
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Hint System Tables
```sql
-- Hint Requests
CREATE TABLE hint_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  course_item_id UUID REFERENCES course_items(id),
  hint_level INTEGER DEFAULT 1,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_item_id, hint_level)
);
```

### Review Tables
```sql
-- Review Sessions
CREATE TABLE review_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  quiz_id UUID REFERENCES quizzes(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Review Materials
CREATE TABLE review_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_session_id UUID REFERENCES review_sessions(id),
  section_id UUID REFERENCES course_sections(id),
  alternative_content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔄 Flow Utama

### Quiz Taking Flow
```
Siswa             →  Quiz UI              →  Backend
│                                    │
│  1. Start quiz      →  Fetch question 1   │
│  2. Answer Q1        →  Submit answer      │
│  3. Answer Q2        →  Submit answer      │
│  4. ...             →  Submit all       │
│  5. Finish          →  Calculate score  │
│  6. View results     →  Display score     │
```

### Diagnostic Flow
```
User Baru      →  Profile Setup      →  Diagnostic
│                                     │
│  1. Create account →  Setup learning   │
│  2. Take test     →  Submit answers  │
│  3. View results  →  See strengths     │
│  4. Get courses    →  Recommended path │
```

### Hint Flow
```
Siswa Stuck     →  Hint UI           →  Backend
│                                     │
│  1. Click hint    →  Check level       │
│  2. Get hint     →  Display hint      │
│  3. Continue     →  Update level     │
```

---

## 🎯 Checklist Implementasi

### Phase 1: Setup (Day 1-2)
- [ ] Buat Supabase schema (quizzes, quiz_questions, quiz_answers, quiz_scores)
- [ ] Buat schema diagnostic (questions, answers, profiles, learning_paths)
- [ ] Buat schema hints (hint_requests)
- [ ] Buat schema review (review_sessions, review_materials)
- [ ] Create API routes skeleton

### Phase 2: Quiz System (Day 3-7)
- [ ] Quiz builder UI (multiple choice)
- [ ] Quiz builder UI (code completion)
- [ ] Quiz taking interface
- [ ] Scoring algorithm
- [ ] Results display component
- [ ] LangServe feedback integration
- [ ] Answer submission API
- [ ] Results retrieval API

### Phase 3: Diagnostic Test (Day 4-6)
- [ ] Diagnostic question bank (15-20 soal)
- [ ] Profiling algorithm
- [ ] Profile setup form
- [ ] Recommendation engine
- [ ] Diagnostic taking interface
- [ ] Results display dengan topic breakdown

### Phase 4: Hint System (Day 6-7)
- [ ] Hint button di learning interface
- [ ] Hint level tracking logic
- [ ] Cooldown system
- [ ] LangServe `streamHint()` integration

### Phase 5: Review Flow (Day 8-9)
- [ ] Failed quiz detection logic
- [ ] Weak topics mapping
- [ ] Review mode UI
- [ ] Alternative content delivery
- [ ] Verification quiz

### Phase 6: Integration (Day 10-12)
- [ ] Hubungkan quiz ke course flow
- [ ] Hubungkan diagnostic ke onboarding
- [ ] Hubungkan hint ke learning mode
- [ ] E2E testing semua fitur
- [ ] Performance testing

---

## 📚 Referensi

### Internal
- Analysis Report: `docs/rules/report.md`
- CMS Feature: `docs/feat/cms.md`
- LangServe API: `features/langserve/api.ts`

### External
- Supabase Docs: https://supabase.com/docs
- Best Practices untuk Quizzes: https://www.ncert.org/

---

**Dokumentasi dibuat**: 2026-03-06
**Sprint**: 2
**Durasi**: 2 minggu
**Status**: Ready untuk Implementasi
