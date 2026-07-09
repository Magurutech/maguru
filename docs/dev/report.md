# Brainstorming Report: Initial Assessment Engine (Sprint 2)

Dokumen ini menjawab pertanyaan klarifikasi dari `docs/dev/brainstorm.md` berdasarkan spec yang telah disepakati.

---

## Q1: Assessment Scope & Types

**Jawaban: Multiple choice quiz saja (MVP).**

- Format: 4 pilihan ganda (a/b/c/d) per soal
- 5–10 soal per topik per course
- Essay, code challenge, dan open-ended → Out of Scope untuk Sprint 2

*Alasan (YAGNI)*: Auto-grading multiple choice cukup untuk mengukur baseline kognitif siswa dan menjalankan placement logic. Essay/code challenge membutuhkan AI grading atau manual review — kompleksitas yang tidak diperlukan di MVP.

---

## Q2: Assessment Placement

**Jawaban: Pre-assessment saja (sebelum course dimulai).**

- Assessment muncul **satu kali** saat siswa pertama kali mengakses/enroll course
- Bukan mid-assessment, bukan per-lesson quiz
- Hasilnya: skor disimpan sebagai `PRE_TEST` baseline

*Flow*:
```
Siswa enroll course
    ↓
Tampilkan Initial Assessment (jika belum pernah)
    ↓
Submit → Skor tersimpan → Placement logic berjalan
    ↓
Siswa masuk ke course (beberapa lesson sudah di-skip jika skor topik ≥ 70%)
```

---

## Q3: Grading & Feedback

**Jawaban: Auto-grading dengan immediate feedback.**

- Grading otomatis: bandingkan jawaban siswa dengan field `correct` di database
- Feedback langsung setelah submit: tampilkan `overallScore` + `topicScores`
- Tidak ada manual grading atau AI-assisted grading di Sprint 2
- Feedback detail per soal (benar/salah) → bisa ditambah Sprint 3

---

## Q4: Assessment Gating & Gated Flow

**Jawaban: Gated (Wajib di awal pembelajaran).**

- Initial Assessment wajib diselesaikan siswa di awal sebelum mereka dapat mengakses/membaca materi lesson apa pun di dalam course.
- Hasil dari Initial Assessment tetap melakukan *placement* (menandai subtopik yang sudah dikuasai sebagai `completed` sehingga bisa di-skip).
- Ditambah tipe kuis kedua: kuis evaluasi kelulusan materi sebelum siswa dapat melanjutkan pelajaran berikutnya.

---

## Q5: Creator Experience

**Jawaban: Minimal untuk MVP — tidak ada Question Bank atau Randomization.**

- Creator tidak bisa membuat soal via UI di Sprint 2 (Assessment authoring UI → Sprint 4)
- Soal dimasukkan via seed script atau langsung ke database oleh admin
- Tidak ada randomisasi urutan soal di Sprint 2
- Tidak ada pengaturan passing score per-course — threshold tetap **70%** hardcoded

*Alasan (YAGNI)*: Creator UI dan question bank adalah fitur terpisah yang tidak dibutuhkan untuk memvalidasi placement logic di MVP. Seed data cukup untuk testing dan demo awal.

---

## Ringkasan Keputusan

| Aspek | Keputusan |
|:---|:---|
| Format soal | Multiple choice 4 opsi (a/b/c/d) |
| Placement | Pre-assessment satu kali saat enroll |
| Grading | Auto-grading, immediate feedback |
| Gating | **Aktif** (Initial Assessment wajib selesai di awal untuk unlock lesson) |
| Tipe Kuis Tambahan | **Section Quiz** (Kuis penutup di akhir Section untuk unlock Section berikutnya) |
| Creator UI | Out of scope — seed data saja |
| Randomisasi | Out of scope Sprint 2 |
| Passing threshold | 70% hardcoded |

---

## Desain Arsitektur & Gating Flow

### 1. UI-Level Gating (Course Outline / Sidebar Gating)
Pengecekan akses dilakukan satu kali di tingkat komponen UI (Sidebar/Course Outline) saat halaman utama course dimuat:
- Jika user belum menyelesaikan kuis `PRE_TEST` (Initial Assessment) untuk course tersebut, sidebar hanya akan menampilkan link/halaman kuis Initial Assessment, sedangkan seluruh materi lesson lainnya akan dikunci (*disabled*).
- Untuk menampilkan lesson di Section $N$ (di mana $N > 1$), UI memeriksa apakah user sudah memiliki record `user_assessments` bertipe `SECTION_QUIZ` untuk Section $N-1$ dengan skor $\ge 70\%$. Jika belum, materi lessons pada Section $N$ akan ditampilkan dengan ikon gembok (*locked*) dan dinonaktifkan dari klik navigasi.
- *Rationale (Ponytail/YAGNI)*: Menghindari database query overhead di setiap API lesson load. UI-level gating memberikan pengalaman visual kuncian yang mulus bagi siswa dan sangat hemat sumber daya server.

### 2. Skema Database (Prisma Schema)
Model baru yang akan ditambahkan ke `prisma/schema.prisma`:

```prisma
model assessment_questions {
  id         String   @id @default(cuid())
  courseId   String   @db.VarChar(255)
  sectionId  String?  @db.VarChar(255) // Null jika untuk Initial Assessment
  question   String   @db.Text
  options    Json     // { "a": "...", "b": "...", "c": "...", "d": "..." }
  correct    String   @db.Char(1) // "a" | "b" | "c" | "d"
  topic      String   @db.VarChar(100)
  difficulty String   @default("medium") @db.VarChar(20)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  courses  courses   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  sections sections? @relation(fields: [sectionId], references: [id], onDelete: Cascade)

  @@index([courseId])
  @@index([sectionId])
  @@index([topic])
  @@index([courseId, topic])
}

model user_assessments {
  id              String    @id @default(cuid())
  userId          String    @db.VarChar(255)
  courseId        String    @db.VarChar(255)
  sectionId       String?   @db.VarChar(255) // Null jika kuis PRE_TEST
  score           Float     // 0.0 - 100.0
  type            String    @default("PRE_TEST") @db.VarChar(20) // "PRE_TEST" | "SECTION_QUIZ"
  answers         Json      // { "questionId": "a" }
  durationSeconds Int?      // Durasi pengerjaan kuis dalam detik (Ponytail/YAGNI)
  completedAt     DateTime  @default(now())

  courses  courses   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  sections sections? @relation(fields: [sectionId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId, sectionId, type])
  @@index([userId])
  @@index([courseId])
  @@index([sectionId])
}
```
