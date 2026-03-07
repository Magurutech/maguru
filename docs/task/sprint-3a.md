# Sprint 2: Quiz & Assessment System - Implementation Plan

**Tanggal:** 2026-03-07
**Status:** Ready for Implementation
**Pendekatan:** Content First (Foundation) → Quiz System → Hint & Review → Diagnostic (Optional)

---

## 📊 Ringkasan

**Focus:** Menutup core learning loop dengan fondasi Content Management yang solid terlebih dahulu.

**Learning Flow yang Lengkap:**
```
Course Foundation (Content) → Quiz System (Assessment) → Learning Support (Hint + Review) → Onboarding (Diagnostic)
     ↓
Content Management Sections (from CMS) → Lessons (Quiz attachments)
```

---

## 🎯 Prioritas Implementasi

| Prioritas | Fitur | Estimasi | Dependencies |
|-----------|--------|-----------|-----------|-----------|
| 🔴 P1 | **Content Foundation** | 1 hari | - |
| 🟢 P2 | **Quiz System** | 3-4 hari | P1 |
| 🟡 P3 | **Hint System** | 1-2 hari | P2, LangServe |
| 🟢 P4 | **Review Flow** | 1-2 hari | P2, Quiz Scores |
| 🟢 P5 | **Diagnostic Test** | 1 hari | P3, Quiz |
| 🟣 P6 | **Integration** | 1 hari | Semua |

**Total Estimasi:** 7-9 hari (Phase 1-5) + 1 hari integration

---

## 🔴 PHASE 1: CONTENT FOUNDATION (Day 1-2)

### User Stories

**US 1.1 (Creator):** "Sebagai creator, saya ingin membuat kuis untuk course React"
**US 1.2 (Creator):** "Sebagai creator, saya ingin mengedit kuis yang sudah ada"
**US 1.3 (Student):** "Sebagai siswa, saya ingin mengerjakan kuis untuk materi React"
**US 1.4 (Student):** "Sebagai siswa, saya ingin lihat hasil kuis saya"
**US 1.5 (Student):** "Sebagai siswa, saya ingin melihat progress belajar"

---

### Task Breakdown

| Task | Deskripsi | Estimasi | Acceptance Criteria |
|------|---------|-----------|----------|
| 1.1 | Buat Section model | Add Section ke Prisma schema | 2j | Section dengan courseId relation |
| 1.2 | Buat Lesson model | Add Lesson ke Prisma schema | 2j | Lesson dengan sectionId dan quizId (opsional) |
| 1.3 | Update Course model | Add sections relation ke Course | 2j | Course.sections Section[] |
| 1.4 | Create Section API | POST /api/sections route | 2j | CRUD sections untuk creator |
| 1.5 | Create Lesson API | POST /api/lessons route | 2j | CRUD lessons dengan quiz attachment |
| 1.6 | Update Course Progress API | PATCH /api/courses/[slug]/progress | 2j | Mark lesson complete tracking |
| 1.7 | Test Section/Lesson flow | Verify creator bisa buat section/lesson dan attach quiz | 2j | Manual testing |

---

## 🟢 PHASE 2: QUIZ SYSTEM CORE (Day 3-7)

### User Stories

**US 2.1 (Creator):** "Sebagai creator, saya ingin membuat kuis untuk course React"
**US 2.2 (Creator):** "Sebagai creator, saya ingin mengedit kuis yang sudah ada"
**US 2.3 (Creator):** "Sebagai creator, saya ingin publish kuis untuk student"
**US 2.4 (Student):** "Sebagai siswa, saya ingin mengerjakan kuis untuk materi React"
**US 2.5 (Student):** "Sebagai siswa, saya ingin lihat skor kuis saya"
**US 2.6 (Student):** "Sebagai siswa, saya ingin menerima feedback AI"

---

### Task Breakdown

| Task | Deskripsi | Estimasi | Acceptance Criteria |
|------|---------|-----------|----------|
| 2.1 | Buat Quiz tables | Add Quiz, QuizQuestion, QuizAnswer, QuizScore | 3j | Tables dengan foreign key relations |
| 2.2 | Quiz CRUD API | Create, Read, Update, Delete quizzes | 2j | RESTful API routes |
| 2.3 | Quiz Builder UI | Form buat/edit quiz dengan multiple choice | 3j | Question bank management |
| 2.4 | Quiz Taking UI | Tampil kuis, pilih jawaban | 3j | One question per screen |
| 2.5 | Scoring algorithm | Hitung skor, pass/fail 70% | 2j | Weighted score calculation |
| 2.6 | Results display | Skor total + breakdown per topik | 3j | Topic breakdown dari jawaban |
| 2.7 | LangServe feedback | Integrasikan /quiz-feedback/stream | 3j | SSE streaming, real-time feedback |

---

## 🟡 PHASE 3: HINT SYSTEM (Day 4-5)

### User Stories

**US 3.1 (Student):** "Saya stuck pada exercise, saya butuh bantuan"
**US 3.2 (Student):** "Saya ingin melihat hint level berapa"

---

### Task Breakdown

| Task | Deskripsi | Estimasi | Acceptance Criteria |
|------|---------|-----------|----------|
| 3.1 | Buat HintRequest table | Add HintRequest ke Prisma schema | 2j | userId, courseItemId, hintLevel tracking |
| 3.2 | Hint request API | POST /api/hints/request route | 2j | Request hint untuk lesson/item |
| 3.3 | Hint status API | GET /api/hints/status route | 2j | Cek cooldown availability |
| 3.4 | Hint button UI | Tombol hint di learning interface | 2j | components/lesson/HintButton.tsx |
| 3.5 | LangServe integration | Stream 3-level hints | 2j | features/langserve/api.ts streamHint() |
| 3.6 | Cooldown logic | 5 menit per question | 2j | lib/hint-cooldown.ts utility |

---

## 🟢 PHASE 4: REVIEW FLOW (Day 6-7)

### User Stories

**US 4.1 (Student):** "Saya gagal kuis Python (<70%), mau review"
**US 4.2 (Student):** "Saya selesai review, mau verifikasi"

---

### Task Breakdown

| Task | Deskripsi | Estimasi | Acceptance Criteria |
|------|---------|-----------|----------|
| 4.1 | Failed quiz detection | Query quizScores dengan passed=false | 2j | features/quiz/review.ts |
| 4.2 | Weak topics mapping | Identifikasi topik gagal | 2j | features/quiz/weak-topics.ts |
| 4.3 | Alternative content | Rekomendasi lesson untuk review | 2j | features/course/alternatives.ts |
| 4.4 | Review mode UI | Tampil materi review spesifik | 2j | app/course/[slug]/review/ |
| 4.5 | Verification quiz | Mini quiz setelah review | 2j | features/quiz/verification.tsx |

---

## 🟢 PHASE 5: DIAGNOSTIC TEST (Day 7) - OPSIONAL

### User Stories

**US 5.1 (New User):** "Saya baru daftar, mau ikut tes diagnostik"

---

### Task Breakdown

| Task | Deskripsi | Estimasi | Acceptance Criteria |
|------|---------|-----------|----------|
| 5.1 | Diagnostic tables | DiagnosticQuestions, DiagnosticAnswers, UserProfile, LearningPath | 2j | Add 4 tables ke Prisma |
| 5.2 | Diagnostic question bank | 15-20 soal Python basics | 2j | docs/quiz/diagnostic-questions.md |
| 5.3 | Profiling algorithm | Analisis jawaban, mapping strengths | 2j | features/quiz/profiling.ts |
| 5.4 | Profile setup form | Form user setup data | 2j | app/diagnostic/profile.tsx |
| 5.5 | Recommendation engine | Generate rekomendasi course | 2j | features/quiz/recommendations.ts |
| 5.6 | Diagnostic taking UI | Tampil diagnostic test | 2j | app/diagnostic/test.tsx |

---

## 🟣 PHASE 6: INTEGRATION (Day 8)

### Task Breakdown

| Task | Deskripsi | Estimasi | Acceptance Criteria |
|------|---------|-----------|----------|
| 6.1 | Quiz-Section integration | Hubungkan Quiz ke Course/Lesson flow | 2j | Update models, API routes |
| 6.2 | Quiz-Diagnostic integration | Hubungkan Diagnostic ke course flow | 2j | Update course recommendation engine |
| 6.3 | Hint-Lesson integration | Hubungkan Hint ke lesson flow | 2j | Update Lesson API |
| 6.4 | Dashboard integration | Stats card dengan quiz data | 2j | Update dashboard UI |

---

## 📊 Database Schema Final

```prisma
// Phase 1: Content Foundation
model Section { }
model Lesson { quizId String? }

// Phase 2: Quiz System
model Quiz { }
model QuizQuestion { }
model QuizAnswer { }
model QuizScore { }

// Phase 3: Hint System
model HintRequest { }

// Phase 4: Review Flow
model ReviewSession { }
model ReviewMaterial { }

// Phase 5: Diagnostic Test (Opsional)
model DiagnosticQuestion { }
model DiagnosticAnswer { }
model UserProfile { }
model LearningPath { }
```

---

## 🎯 Success Criteria

### Phase 1: Content Foundation ✅
- [ ] Section model dibuat dengan courseId relation
- [ ] Lesson model dibuat dengan sectionId relation dan quizId
- [ ] Course model diupdate dengan sections relation
- [ ] API routes berfungsi (Section CRUD, Lesson CRUD, Progress tracking)
- [ ] Creator bisa membuat section/lesson dan attach quiz
- [ ] Student bisa akses course dan lihat progress

### Phase 2: Quiz System ✅
- [ ] Quiz CRUD API berfungsi (Create, Read, Update, Delete)
- [ ] QuizBuilder UI untuk membuat/edit quiz
- [ ] QuizTaking UI untuk siswa mengerjakan
- [ ] Scoring engine menghitung skor 70% threshold
- [ ] Results display menunjukkan breakdown
- [ ] LangServe feedback terintegrasi

### Phase 3: Hint System ✅
- [ ] HintRequest table dibuat
- [ ] Hint request/status API
- [ ] Hint button UI di learning interface
- [ ] LangServe `/hint/stream` terintegrasi
- [ ] Cooldown 5 menit per question

### Phase 4: Review Flow ✅
- [ ] Failed quiz detection berfungsi
- [ ] Weak topics mapping menidentifikasi topik gagal
- [ ] Alternative content rekomendasi dibuat
- [ ] Review mode UI untuk akses materi review
- [ ] Verification quiz tersedia

### Phase 5: Diagnostic Test 🟡 (Opsional)
- [ ] Diagnostic tables dibuat jika ada sisa waktu
- [ ] Question bank dibuat
- [ ] Profiling algorithm diimplementasi

### Phase 6: Integration ✅
- [ ] Quiz terhubung ke Course/Lesson flow
- [ ] Diagnostic terhubung ke course recommendation

---

## 📝 Referensi

- CMS Feature: `docs/feat/cms.md`
- Quiz Feature: `docs/feat/quiz.md`
- LangServe API: `features/langserve/api.ts`
- Project Rules: `docs/rules/plan.md`, `docs/rules/report.md`
