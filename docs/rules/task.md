# Sprint 2: Quiz & Assessment System - Hasil Klarifikasi

**Tanggal:** 2026-03-07

---

## ✅ Keputusan Terfinal (Disetujui User)

| # | Pertanyaan | Keputusan | Alasan |
|---|-------------|-------------|---------|
| 1 | Course Structure | ✅ **Quiz per Lesson** | Align dengan plan.md, lebih granular untuk feedback spesifik |
| 2 | Quiz Attachment | ✅ **Lesson as attachment point** | Lampirkan quiz ke lessonId |
| 3 | Section & Lesson Creation | ✅ **Sprint 2 MULAI dengan buat Section & Lesson models** | Sebagai prerequisite untuk quiz attachment |
| 4 | Quiz Attempts | ✅ **Multiple attempts dengan best score tracking** | Lebih user-friendly untuk learning |
| 5 | Question Types MVP | ✅ **Multiple Choice saja untuk Sprint 2** | Code Completion bisa Sprint 2.1 atau Sprint 3 |
| 6 | Hint Cooldown | ✅ **5 menit per question** | Simple dan mudah diimplementasi |
| 7 | Diagnostic Test | ✅ **SKIP untuk Sprint 2** | Fokus Quiz+Hint+Review, Diagnostic jadi Sprint terpisah |
| 8 | LangServe Rate Limiting | ✅ **SKIP untuk MVP** | Implementasi nanti jika ada issue abuse |

---

## 📋 Brainstorming Results - Arsitektur & Design

### 1. Quiz Attachment Decision
**Keputusan:** Quiz attached ke Lesson (bukan ke Course langsung)

**Alasan:**
- Lebih granular untuk feedback spesifik dari LangServe AI
- Lesson adalah unit pembelajaran yang logis
- Sesuai dengan struktur "Course → Section → Lesson" di plan.md

**Implikasi:**
- Quiz punya `lessonId` sebagai foreign key
- Setiap lesson bisa punya 0 atau 1 quiz
- Quiz bisa opsional (tidak semua lesson harus punya quiz)

### 2. Schema Hierarchy
```
Course
  └─ Section (bab)
      └─ Lesson (materi)
          └─ Quiz (opsional)
              └─ QuizQuestion (soal)
                  └─ QuizAnswer (pilihan)
```

### 3. Quiz Scoring Strategy
**Approach:** Multiple attempts with best score tracking

**Alasan:**
- User-friendly: User bisa belajar dari kesalahan
- Progress tracking: Best score digunakan untuk mengukur kemajuan
- Analytics: Semua attempts disimpan untuk insight

**Model:**
```prisma
model QuizScore {
  id           String   @id @default(uuid())
  quizId       String
  userId        String
  attemptNumber Int      @default(1)
  score        Float
  totalPoints  Int
  passed       Boolean
  isBestScore  Boolean  @default(false)  // Track best score
  completedAt  DateTime @default(now())

  @@unique([quizId, userId, attemptNumber])
}
```

### 4. Hint System Design
**Approach:** Progressive hints dengan cooldown

**3 Level Hint:**
1. **Halus** - Hint ringan yang tidak memberi jawaban langsung
2. **Konseptual** - Menjelaskan konsep yang relevan
3. **Langsung** - Menunjuk ke arah solusi

**Cooldown:** 5 menit per question per user

**Trigger Reset:**
- User submit quiz (semua hint terkait reset)
- User pindah ke lesson lain

### 5. Review Flow Trigger
**Kondisi:** Score < 70% (failed quiz)

**Flow:**
1. Detect quiz dengan score < 70%
2. Identifikasi topik yang gagal (dari question metadata)
3. Rekomendasi lesson yang relevan
4. Buat review session di database
5. Setelah user selesai review, tawarkan verification quiz

---

## 🎯 Sprint 2 Final Scope

### Phase 1: Quiz System (Core - Blocking) - 2-3 Hari
| Component | Deskripsi |
|-----------|-----------|
| Database Schema | Section, Lesson, Quiz, QuizQuestion, QuizAnswer, QuizScore, HintRequest |
| API Routes | Quiz CRUD, Submit answers, Calculate score |
| Creator UI | Quiz Builder interface (buat/edit quiz, attach ke lesson) |
| Student UI | Quiz taking interface (tampil soal, pilih jawaban, submit) |
| Scoring | Automatic calculation dengan 70% threshold |
| LangServe | Quiz feedback integration |

### Phase 2: Hint System (Parallel with Phase 1) - 1-2 Hari
| Component | Deskripsi |
|-----------|-----------|
| Hint Request Tracking | Simpan semua request hint di database |
| Cooldown Enforcement | Cek last request, blokir jika < 5 menit |
| Hint UI | Tombol hint di learning interface |
| LangServe | 3-level progressive hints |

### Phase 3: Review Flow (Depends on Phase 1) - 1-2 Hari
| Component | Deskripsi |
|-----------|-----------|
| Failed Quiz Detection | Query quizScores dengan passed=false |
| Weak Topics Mapping | Identifikasi topic dari questions yang salah |
| Alternative Content | Rekomendasi lesson untuk review |
| Verification Quiz | Mini quiz untuk verifikasi setelah review |

### Phase 4: SKIP - Diagnostic Test (Onboarding Flow)
- Diagnostic test akan jadi Sprint 3 (Onboarding Enhancement)
- Fokus Sprint 2 ke core learning loop

---

## 📊 Prerequisite Checklist Sebelum Implementasi

| Item | Status | Catatan |
|-------|---------|----------|
| Section & Lesson models dibuat | ⏳ Perlu buat dulu |
| Prisma migration dijalankan | ⏳ Setelah schema update |
| LangServe server running | ⏳ Validasi di env dev/prod |
| CMS Quiz Builder UI exists | ⏳ Perlu buat di Creator Dashboard |

---

## 🎬 Next Steps

1. Review dan setujui keputusan di atas
2. Update docs/feat/quiz.md dengan detail yang sudah disetujui
3. Buat implementation plan detail untuk setiap Phase
4. Mulai implementasi Phase 1 (Quiz System)

---

## Referensi

- Quiz feature epic: `docs/feat/quiz.md`
- Sprint 1 plan: `docs/rules/plan.md`
- LangServe API: `docs/api/langserve/langserve.json`
