# Design Document: Assessment Engine (Sprint 2)

## 1. Overview & Goals
Membangun mesin kuis terpadu (Assessment Engine) untuk mendukung:
1.  **Initial Assessment (Pre-Test / Placement)**: Kuis wajib di awal course untuk merekam baseline pengetahuan dan melompati (*skip*) materi yang sudah dikuasai.
2.  **Section Quiz (Gating)**: Kuis wajib di akhir setiap Section untuk memvalidasi kelulusan materi sebelum siswa diizinkan membuka Section berikutnya.

---

## 2. Arsitektur Gating & Locking Flow
Gating dikelola secara terpusat pada tingkat **UI (Sidebar / Course Outline)** demi efisiensi query dan kemudahan navigasi:

1.  **Gating Kuis Awal (Pre-Test)**:
    - Jika `user_assessments` bertipe `PRE_TEST` belum ada untuk course ini → Sidebar hanya me-render tautan ke halaman Initial Assessment. Seluruh materi lesson dinonaktifkan.
2.  **Gating Section Quiz**:
    - Untuk membuka materi pada Section $N$ (di mana $N > 1$), UI memvalidasi apakah ada record `user_assessments` bertipe `SECTION_QUIZ` untuk Section $N-1$ dengan nilai $\ge 70\%$.
    - Jika belum lulus → Lesson di Section $N$ ditampilkan dengan ikon gembok dan navigasi dinonaktifkan.

---

## 3. Skema Basis Data (Prisma)
Menambahkan relasi `sectionId` opsional pada tabel kuis agar dapat membedakan soal kuis awal dan soal kuis section:

```prisma
model assessment_questions {
  id         String   @id @default(cuid())
  courseId   String   @db.VarChar(255)
  sectionId  String?  @db.VarChar(255) // Null untuk Initial Assessment
  question   String   @db.Text
  options    Json     // { "a": "text", "b": "text", ... }
  correct    String   @db.Char(1)
  topic      String   @db.VarChar(100)
  difficulty String   @default("medium") @db.VarChar(20)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  courses  courses   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  sections sections? @relation(fields: [sectionId], references: [id], onDelete: Cascade)

  @@index([courseId])
  @@index([sectionId])
  @@index([topic])
}

model user_assessments {
  id              String   @id @default(cuid())
  userId          String   @db.VarChar(255)
  courseId        String   @db.VarChar(255)
  sectionId       String?  @db.VarChar(255) // Null untuk PRE_TEST
  score           Float
  type            String   @default("PRE_TEST") @db.VarChar(20) // "PRE_TEST" | "SECTION_QUIZ"
  answers         Json     // { "questionId": "a" }
  durationSeconds Int?     // Durasi pengerjaan kuis dalam detik (Ponytail/YAGNI)
  completedAt     DateTime @default(now())

  courses  courses   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  sections sections? @relation(fields: [sectionId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId, sectionId, type])
  @@index([userId])
  @@index([courseId])
  @@index([sectionId])
}
```

---

## 4. API Contract

### A. GET `/api/assessment/questions`
Mengambil soal berdasarkan konteks kuis.
*   **Query Params**:
    - `courseId` (string, required)
    - `sectionId` (string, optional)
*   **Response (200 OK)**:
    ```json
    {
      "questions": [
        {
          "id": "aq1",
          "question": "Pertanyaan...",
          "options": { "a": "Opsi A", "b": "Opsi B", "c": "Opsi C", "d": "Opsi D" },
          "topic": "variables"
        }
      ]
    }
    ```

### B. POST `/api/assessment/submit`
Mengirimkan jawaban kuis untuk dinilai.
*   **Body Payload**:
    ```json
    {
      "courseId": "c1",
      "sectionId": "s1", // Optional (kirim jika ini Section Quiz)
      "answers": {
        "aq1": "a",
        "aq2": "c"
      },
      "durationSeconds": 120 // Optional (durasi pengerjaan kuis dalam detik)
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "overallScore": 85.0,
      "topicScores": {
        "variables": 100.0,
        "loops": 70.0
      },
      "skippedLessonIds": ["lesson-1"], // Hanya diisi jika kuis PRE_TEST
      "unlockedNextSection": true // Hanya diisi jika kuis SECTION_QUIZ
    }
    ```
