📊 Analisis Mendalam & Pertanyaan Klarifikasi
Berdasarkan analisis saya terhadap:

✅ docs/rules/task.md (jawaban Anda)
✅ prisma/schema.prisma (database saat ini)
✅ features/langserve/api.ts (LangServe integration)
✅ docs/task/sprint-2.md (sprint requirements)
🔴 CRITICAL GAPS - Perlu Klarifikasi Segera
1. Course Structure: Sections & Lessons
Masalah: Schema saat ini HANYA punya Course dan Enrollment. Tidak ada:

❌ Section (Bab dalam course)
❌ Lesson (Materi dalam section)
❌ CourseItem (Item dalam course)
Pertanyaan:

A. Apakah Sprint 2 ini JUGA harus membuat Section & Lesson models?
   - Atau kita asumsikan Quiz langsung attached ke Course (tanpa section/lesson)?

B. Dari docs/rules/plan.md, disebutkan:
   "Course → Sections → Lessons → Content"
   
   Apakah ini sudah diimplementasi di Sprint 1?
   - Jika BELUM, kita perlu buat dulu sebelum Quiz System
   - Jika SUDAH, dimana file schema-nya?

C. Quiz akan di-attach ke mana?
   Option 1: Quiz per Course (1 quiz untuk seluruh course)
   Option 2: Quiz per Section (setiap bab punya quiz)
   Option 3: Quiz per Lesson (setiap lesson bisa punya quiz)
   
   Pilih mana? Ini akan mempengaruhi schema design.
2. Quiz Attachment Point
Dari sprint-2.md:

CREATE TABLE quizzes (
  course_item_id UUID REFERENCES course_items(id),  -- ⚠️ Tabel ini tidak ada!
  ...
);
Pertanyaan:

A. Apa itu "course_items"?
   - Apakah ini sama dengan "Lesson"?
   - Atau ini adalah abstraksi untuk "bisa lesson, bisa quiz, bisa video"?

B. Jika course_items belum ada, kita perlu buat dulu?
   - Atau kita ubah schema quiz untuk langsung reference ke Course?

C. Rekomendasi saya:
   Option A (Simple): Quiz → Course (langsung)
   Option B (Flexible): Quiz → CourseItem → Section → Course
   
   Pilih mana?
3. Review Materials Reference
Dari sprint-2.md:

CREATE TABLE review_materials (
  section_id UUID REFERENCES course_sections(id),  -- ⚠️ Tabel ini tidak ada!
  ...
);
Pertanyaan:

A. Apakah "course_sections" sama dengan "Section" yang disebutkan di plan.md?
B. Jika belum ada, kita buat dulu atau skip Review Flow untuk Sprint 2?
C. Alternative: Review materials bisa reference ke Course saja (tanpa section)?
🟡 MEDIUM PRIORITY - Perlu Keputusan Design
4. Quiz Attempt Strategy
Dari task.md schema:

model QuizScore {
  @@unique([quizId, userId]) // Satu user, satu attempt per quiz
}
Pertanyaan:

A. Apakah user hanya boleh attempt quiz SATU KALI?
   - Jika gagal (< 70%), tidak bisa retry?
   - Atau bisa retry setelah review?

B. Jika bisa multiple attempts:
   - Kita perlu ubah schema (remove unique constraint)
   - Tambah field "attemptNumber" atau "isRetake"
   - Simpan history semua attempts atau hanya yang terbaru?

C. Rekomendasi saya:
   - Allow multiple attempts (untuk learning)
   - Simpan best score saja (untuk progress tracking)
   - Atau simpan semua attempts (untuk analytics)?
5. Quiz Question Types
Dari sprint-2.md:

Multiple Choice
Code Completion
Pertanyaan:

A. Code Completion format:
   - User menulis code di text editor?
   - Atau fill-in-the-blank style?
   - Bagaimana validasi jawaban? (exact match? fuzzy match? run code?)

B. Apakah perlu support question types lain?
   - True/False
   - Short Answer
   - Essay (manual grading)

C. Untuk MVP Sprint 2, fokus ke Multiple Choice dulu?
   - Code Completion bisa Phase 2?
6. Hint Cooldown Mechanism
Dari sprint-2.md:

Cooldown system untuk limit hint requests
Pertanyaan:

A. Cooldown berapa lama?
   - Per question: 5 menit? 10 menit?
   - Per user: Max 3 hints per hour?

B. Cooldown reset kapan?
   - Setelah user submit quiz?
   - Setelah user complete lesson?
   - Daily reset?

C. Apakah cooldown per level atau total?
   - User bisa request Level 1, tunggu cooldown, baru Level 2?
   - Atau sekali request hint, langsung dapat semua level?
🟢 LOW PRIORITY - Nice to Have Clarification
7. Diagnostic Test Scope
Pertanyaan:

A. Apakah Diagnostic Test WAJIB di Sprint 2?
   - Atau bisa jadi Sprint 3 (Onboarding Enhancement)?

B. Jika wajib, kapan user mengambil diagnostic test?
   - Saat first sign-up (blocking onboarding)?
   - Atau optional (user bisa skip)?

C. Rekomendasi: Buat diagnostic test sebagai OPTIONAL Phase 4
   - Focus Sprint 2 ke Quiz System + Hint + Review Flow
8. LangServe Rate Limiting
Pertanyaan:

A. Apakah LangServe backend punya rate limiting?
   - Jika ya, berapa limit per user/per minute?

B. Apakah perlu implement rate limiting di Next.js API routes?
   - Untuk protect backend dari abuse?

C. Untuk MVP, kita skip rate limiting dulu?
   - Atau implement simple rate limiting (e.g., max 10 requests/minute)?
🎯 Rekomendasi Keputusan Cepat
Untuk mempercepat development, saya rekomendasikan keputusan berikut (Anda bisa approve atau adjust):

Decision 1: Course Structure (CRITICAL)
✅ REKOMENDASI: Buat Section & Lesson models dulu
   - Quiz attached ke Lesson (paling granular)
   - Review materials reference ke Section
   - Ini align dengan docs/rules/plan.md

Schema:
Course → Section → Lesson → Quiz
                 → Content (markdown/video)
Decision 2: Quiz Attachment (CRITICAL)
✅ REKOMENDASI: Quiz per Lesson
   - Setiap lesson bisa punya 0 atau 1 quiz
   - Quiz optional (tidak semua lesson harus punya quiz)
   - Lebih flexible untuk future expansion

Schema:
model Quiz {
  lessonId String @unique  // One quiz per lesson
  lesson   Lesson @relation(...)
}
Decision 3: Quiz Attempts (MEDIUM)
✅ REKOMENDASI: Multiple attempts allowed
   - User bisa retry quiz setelah review
   - Simpan best score untuk progress tracking
   - Simpan last attempt untuk review flow

Schema:
model QuizScore {
  @@unique([quizId, userId, attemptNumber])
  attemptNumber Int @default(1)
  isBestScore   Boolean @default(false)
}
Decision 4: MVP Scope (MEDIUM)
✅ REKOMENDASI: Sprint 2 MVP Focus
   Phase 1: Quiz System (Multiple Choice only)
   Phase 2: Hint System (3 levels, simple cooldown)
   Phase 3: Review Flow (basic)
   Phase 4: SKIP Diagnostic Test (move to Sprint 3)

Code Completion quiz → Sprint 3
Diagnostic Test → Sprint 3
Advanced analytics → Sprint 4
❓ Pertanyaan untuk Anda
Silakan jawab pertanyaan-pertanyaan berikut agar saya bisa mulai membuat spec:

Course Structure: Apakah Section & Lesson sudah ada? Jika belum, apakah Sprint 2 harus buat dulu?

Quiz Attachment: Quiz attached ke Course, Section, atau Lesson?

Quiz Attempts: Single attempt atau multiple attempts?

Question Types: Multiple Choice only untuk MVP, atau harus include Code Completion?

Diagnostic Test: Wajib di Sprint 2 atau bisa skip?

Hint Cooldown: Berapa lama cooldown? (saran: 5 menit per question)

Atau, jika Anda setuju dengan semua rekomendasi saya di atas, saya bisa langsung mulai membuat spec dengan asumsi tersebut! 🚀

Bagaimana? Mau jawab pertanyaan dulu atau approve rekomendasi saya?