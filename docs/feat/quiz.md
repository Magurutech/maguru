# Quiz Feature

## Ringkasan
Sistem kuis untuk menutup core learning loop. User bisa mengerjakan quiz, mendapatkan skor, dan menerima feedback AI personal.

## Gambaran Besar

```
Creator (Pembuat Quiz)
        ↓
    Quiz Builder Interface
        ↓
    Database (Quizzes, Questions, Answers)
        ↓
Student (Mengerjakan Quiz)
        ↓
    Quiz Taking Interface
        ↓
    Score & Feedback (AI dari LangServe)
```

## Fitur Utama

### 1. Quiz System
- **Creator Side**: Quiz Builder untuk membuat dan mengedit kuis
  - Tipe soal: Multiple Choice
  - Buat soal dengan jawaban benar/salah
  - Set passing threshold (default 70%)
  - Lampirkan quiz ke lesson

- **Student Side**: Interface untuk mengerjakan kuis
  - Tampil soal satu per satu
  - Pilih jawaban
  - Submit semua jawaban
  - Lihat skor dan feedback real-time

- **Scoring Engine**:
  - Hitung skor otomatis
  - Tentukan pass/fail berdasarkan threshold 70%
  - Simpan skor di database
  - Multiple attempts diperbolehkan (simpan best score)

### 2. Hint System
- 3 level hint: Halus → Konseptual → Langsung
- Cooldown 5 menit per question per user
- Tombol hint di learning interface
- Hint request tracking di database

### 3. Review Flow
- Otomatis detect quiz dengan score < 70%
- Identifikasi topik yang perlu di-review
- Rekomendasi lesson yang harus direview
- Verification quiz setelah review

### 4. LangServe Integration
- **Quiz Feedback**: `/quiz-feedback/stream` - Feedback AI untuk setiap jawaban
- **Hint**: `/hint/stream` - Generate hints bertingkat
- **Greeting**: `/greeting/stream` - Sapaan personal untuk student

## Database Tabel yang Dibutuhkan

| Tabel | Tujuan |
|--------|---------|
| Section | Bab dalam course (dibuat untuk lampirkan quiz) |
| Lesson | Materi dalam section (quiz di sini) |
| Quiz | Metadata kuis (title, threshold, dll) |
| QuizQuestion | Soal-soal kuis |
| QuizAnswer | Pilihan jawaban untuk multiple choice |
| QuizScore | Skor user per quiz attempt |
| HintRequest | Tracking penggunaan hint |

## Prioritas Implementasi

1. **Phase 1**: Quiz System (Core)
   - Database schema
   - API routes (CRUD)
   - Creator UI (Quiz Builder)
   - Student UI (Quiz Taking)
   - Scoring engine

2. **Phase 2**: Hint System
   - Hint request tracking
   - Cooldown enforcement
   - LangServe integration

3. **Phase 3**: Review Flow
   - Failed quiz detection
   - Weak topics mapping
   - Alternative content recommendation

## Notes

- Quiz attached ke Lesson (lebih granular untuk feedback spesifik)
- Multiple attempts diperbolehkan untuk learning
- Best score disimpan untuk progress tracking
- Diagnostic test optional (bisa Sprint terpisah)
