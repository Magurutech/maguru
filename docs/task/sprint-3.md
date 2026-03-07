# Sprint 3: Quiz & Assessment System

**Status:** Draft | **Prioritas:** P1 | **Estimasi:** 3-4 minggu

---

## 📋 Ringkasan

Sprint ini menutup **core learning loop** dengan sistem assessment yang komprehensif. Siswa bisa mengerjakan kuis, mendapatkan skor otomatis, menerima feedback AI personal, dan mendapatkan hint bertingkat saat stuck.

**Tujuan Utama:**
1. Quiz System - Creation, taking, dan scoring
2. Hint System - Progressive hints dengan cooldown
3. Review Flow - Otomatis review untuk failed quizzes
4. LangServe Integration - Feedback, hints, dan greetings

---

## 🎯 User Stories

### Epic 1: Quiz System

**US1.1 - Quiz Creation**
> Sebagai Creator, saya ingin membuat kuis baru (multiple choice) untuk pelajaran saya.

**US1.2 - Quiz Question Management**
> Sebagai Creator, saya ingin menambah, mengedit, dan menghapus soal dalam kuis saya.

**US1.3 - Quiz Taking**
> Sebagai Student, saya ingin mengerjakan kuis dan melihat skor saya secara real-time.

**US1.4 - Quiz Scoring**
> Sebagai Student, saya ingin mendapatkan skor otomatis dengan threshold pass 70%.

---

### Epic 2: Hint System

**US2.1 - Request Hint**
> Sebagai Student, saya ingin meminta hint saat saya stuck pada soal atau exercise.

**US2.2 - Progressive Hints**
> Sebagai Student, saya ingin menerima hint bertingkat (Level 1: halus → Level 2: konseptual → Level 3: langsung).

**US2.3 - Hint Cooldown**
> Sebagai Student, saya ingin melihat kapan saya bisa meminta hint lagi (tombol disable sampai cooldown selesai).

---

### Epic 3: Review Flow

**US3.1 - Failed Quiz Detection**
> Sebagai Student, saya ingin tahu kuis mana yang gagal (skor < 70%) agar saya bisa mengulang materi terkait.

**US3.2 - Weak Topics Mapping**
> Sebagai Student, saya ingin tahu topik apa yang perlu direview setelah gagal kuis.

**US3.3 - Review Mode**
> Sebagai Student, saya ingin masuk mode review dengan konten alternatif untuk topik yang saya lemah.

**US3.4 - Verification Quiz**
> Sebagai Student, saya ingin mengerjakan mini quiz setelah selesai review materi untuk verifikasi pemahaman.

---

## 📝 Tasks

### Phase 1: Database Schema (Hari 1-2)

| # | Task | Deskripsi | Estimasi |
|---|-------|-----------|------------|
| 1.1 | Buat Quiz model di Prisma schema | 2 jam |
| 1.2 | Buat QuizQuestion model di Prisma schema | 2 jam |
| 1.3 | Buat QuizAnswer model di Prisma schema | 2 jam |
| 1.4 | Buat QuizScore model di Prisma schema | 2 jam |
| 1.5 | Buat HintRequest model di Prisma schema | 2 jam |

### Phase 2: API Routes (Hari 2-4)

| # | Task | Deskripsi | Estimasi |
|---|-------|-----------|------------|
| 2.1 | Buat API route untuk create quiz | 3 jam |
| 2.2 | Buat API route untuk list quizzes | 3 jam |
| 2.3 | Buat API route untuk get quiz detail | 2 jam |
| 2.4 | Buat API route untuk update quiz | 3 jam |
| 2.5 | Buat API route untuk delete quiz | 2 jam |
| 2.6 | Buat API route untuk submit quiz answers | 3 jam |
| 2.7 | Buat API route untuk get quiz results | 2 jam |
| 2.8 | Buat API route untuk request hint | 2 jam |
| 2.9 | Buat API route untuk check hint status | 2 jam |
| 2.10 | Buat API route untuk get failed quizzes | 3 jam |
| 2.11 | Buat API route untuk start review session | 3 jam |
| 2.12 | Buat API route untuk get review materials | 3 jam |
| 2.13 | Buat API route untuk submit verification quiz | 3 jam |

### Phase 3: Frontend - Creator Side (Hari 4-6)

| # | Task | Deskripsi | Estimasi |
|---|-------|-----------|------------|
| 3.1 | Buat Quiz Builder UI di Creator Dashboard | 4 jam |
| 3.2 | Implement form untuk multiple choice questions | 4 jam |
| 3.3 | Implement form untuk code completion questions | 4 jam |
| 3.4 | Implement quiz list view | 4 jam |

### Phase 4: Frontend - Student Side (Hari 6-9)

| # | Task | Deskripsi | Estimasi |
|---|-------|-----------|------------|
| 4.1 | Buat Quiz Taking Interface | 6 jam |
| 4.2 | Implement question-by-question display | 4 jam |
| 4.3 | Implement answer selection (multiple choice) | 4 jam |
| 4.4 | Implement timer dan progress indicator | 3 jam |
| 4.5 | Implement score display dengan pass/fail | 3 jam |
| 4.6 | Implement LangServe feedback integration | 4 jam |

### Phase 5: Hint System (Hari 7-8)

| # | Task | Deskripsi | Estimasi |
|---|-------|-----------|------------|
| 5.1 | Implement Hint Button di learning interface | 3 jam |
| 5.2 | Implement hint display (typing animation) | 3 jam |
| 5.3 | Implement hint level tracking | 2 jam |
| 5.4 | Implement cooldown system (5 menit) | 3 jam |
| 5.5 | Integrate dengan LangServe /hint/stream | 2 jam |

### Phase 6: Review Flow (Hari 9-10)

| # | Task | Deskripsi | Estimasi |
|---|-------|-----------|------------|
| 6.1 | Implement failed quiz detection | 3 jam |
| 6.2 | Implement weak topics display | 3 jam |
| 6.3 | Implement review mode UI | 4 jam |
| 6.4 | Implement alternative content display | 3 jam |
| 6.5 | Implement verification quiz | 3 jam |

### Phase 7: LangServe Integration (Hari 11-12)

| # | Task | Deskripsi | Estimasi |
|---|-------|-----------|------------|
| 7.1 | Integrate /quiz-feedback/stream untuk feedback kuis | 4 jam |
| 7.2 | Integrate /hint/stream untuk progressive hints | 2 jam |
| 7.3 | Integrate /greeting/stream untuk personalisasi | 2 jam |

---

## 🎯 Acceptance Criteria

| Epic | Criteria |
|-------|----------|
| US1.1 | Creator bisa buat quiz dengan 1-10 soal | Quiz tercreate dengan section dan questions |
| US1.2 | Creator bisa edit kuis yang sudah ada | Quiz terupdate di database |
| US2.1 | Student bisa meminta hint saat stuck | Hint button muncul jika belum ada request aktif |
| US3.1 | Student bisa melihat kuis yang gagal | GET /api/quizzes/failed mengembalikan list |
| US3.2 | Sistem memberikan skor otomatis (70% pass threshold) | Score terhitung saat submit quiz |

---

## 📊 Timeline

| Minggu | Fokus |
|-------|--------|
| 1 | Database Schema |
| 2 | API Routes |
| 3 | Frontend - Creator Side |
| 4 | Frontend - Student Side |
| 5 | Hint System |
| 6 | Review Flow |
| 7 | LangServe Integration |

---

## 🔗 Dependencies

| Dependensi | Status |
|-----------|--------|
| Sprint 2a selesai | Perlu untuk struktur content ada |
| LangServe endpoints | Sudah siap digunakan |
| Course structure | Perlu Lesson models untuk quiz attachment |

---

## 📝 Catatan

- Diagnostic Test di-skip untuk Sprint 3 (opsional, Sprint terpisah)
- Code Completion quiz di-skip untuk MVP (hanya Multiple Choice)
- Review flow bisa paralel dengan Quiz System
- Hint system independent, bisa dikembangkan paralel
