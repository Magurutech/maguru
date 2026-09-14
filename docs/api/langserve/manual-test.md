# 🧪 Panduan Manual Testing & Dokumentasi API: Automated AI Quiz Generator

Dokumen ini berisi panduan pengujian endpoint AI Quiz Generator melalui Postman, cURL, maupun PowerShell, serta penjelasan struktur log debug di server backend.

---

## 🌐 1. Spesifikasi Endpoint

* **URL**: `http://localhost:8000/api/v1/generate-quiz`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`

### 📥 Request Body Schema
```json
{
  "course_id": "test-course-python",
  "section_id": "section-01",
  "num_questions": 5,
  "difficulty": "medium",
  "question_style": "code_analysis",
  "lesson_content": "Bab: Pengenalan Python List. List diakses dengan index mulai dari 0..."
}
```

| Field | Tipe | Wajib? | Keterangan |
| :--- | :--- | :--- | :--- |
| `course_id` | `string` | Ya | ID atau slug unik kursus |
| `section_id` | `string` | Opsional | ID bab/section |
| `num_questions` | `number` | Opsional | Jumlah soal (`3`, `5`, atau `10`, default `5`) |
| `difficulty` | `string` | Opsional | Tingkat kesulitan (`easy`, `medium`, `hard`) |
| `question_style` | `string` | Opsional | Arketipe soal: `balanced`, `code_analysis`, `case_study`, `conceptual` |
| `lesson_content` | `string` | Opsional | Konten materi kurikulum dari database atau catatan khusus |

---

### 📤 Response Body Schema
```json
{
  "status": "success",
  "course_id": "test-course-python",
  "section_id": "section-01",
  "questions": [
    {
      "question": "Perhatikan cuplikan kode berikut:\n```python\n1: data = [10, 20, 30]\n2: print(data[5])\n```\nBaris nomor berapakah yang akan memicu IndexError?",
      "options": {
        "a": "Baris 1",
        "b": "Baris 2",
        "c": "Tidak ada baris yang memicu error",
        "d": "Semua baris memicu error"
      },
      "correct": "b",
      "topic": "List Indexing",
      "micro_skill": "list-indexing",
      "hints": [
        "Ingat kembali bahwa indeks list di Python dimulai dari 0 dan berakhir pada len(list)-1.",
        "Periksa baris 2 saat mencoba mengakses indeks 5 pada list yang hanya memiliki 3 elemen."
      ],
      "difficulty": "medium",
      "explanation": "Baris 2 memicu IndexError karena indeks 5 melebihi batas panjang data (panjang 3, indeks valid 0-2)."
    }
  ]
}
```

---

## 🚀 2. Cara Import & Menguji di Postman

1. Buka aplikasi **Postman**.
2. Klik tombol **Import** (di pojok kiri atas).
3. Pilih file: [`docs/api/langserve/Maguru_AI_Quiz_Generator.postman_collection.json`](file:///d:/.maguru/maguru/docs/api/langserve/Maguru_AI_Quiz_Generator.postman_collection.json).
4. Jalankan salah satu request:
   * **1. Generate Standard Quiz (5 Soal Medium)**
   * **2. Generate Quick Quiz (3 Soal Easy)**
   * **3. Generate Advanced Case Study with Code Snippets (5 Soal Hard)**
5. Klik tombol **Send** dan amati response status `200 OK` serta array `questions` yang dihasilkan.

---

## 💻 3. Pengujian Cepat via Terminal (PowerShell / cURL)

### A. PowerShell
```powershell
$body = @{
  course_id = "test-course-python"
  num_questions = 3
  difficulty = "easy"
  lesson_content = "Bab: Pengenalan Python. Python dibuat oleh Guido van Rossum."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/generate-quiz" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 6
```

### B. cURL
```bash
curl -X POST http://localhost:8000/api/v1/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "test-course-python",
    "num_questions": 3,
    "difficulty": "easy",
    "lesson_content": "Bab: Pengenalan Python. Python dibuat oleh Guido van Rossum."
  }'
```

---

## 🔍 4. Membaca Log Debug Backend

Ketika request dikirimkan ke backend, terminal backend (`python server.py`) akan mencetak log terstruktur berikut:

```text
INFO: [QUIZ_GEN][DISPATCH] Generating 5 'hard' questions for course 'test-course-python' (content len: 145)
INFO: [QUIZ_GEN][RESPONSE] Received raw LLM response (1280 chars)
INFO: [QUIZ_GEN][EXTRACT] Raw text length: 1280 chars
INFO: [QUIZ_GEN][SUCCESS] Successfully parsed 5 quiz questions
```

Jika terjadi masalah parsing LLM, sistem otomatis mengaktifkan *fallback regex recovery* dan mencatat:
```text
INFO: [QUIZ_GEN][RECOVERED] Successfully recovered 5 questions via regex pattern
```
sehingga frontend tidak akan pernah mengalami crash atau layar kosong.

---

## 🖥️ 5. Panduan Manual Testing Melalui UI Creator CMS

Untuk menguji langsung fitur ini di browser melalui antarmuka web Maguru:

### Langkah 1: Pastikan Server Aktif
1. **Frontend Maguru** berjalan di `http://localhost:3001` (atau port Next.js aktif).
2. **Backend Maguru Model** berjalan di `http://localhost:8000` (`python -m uvicorn app.main:app --reload`).

### Langkah 2: Buka Halaman Kuis Kursus
1. Login sebagai **Creator** di Maguru.
2. Buka salah satu kursus Anda di Creator Dashboard: `/creator/courses/[slug]/manage`.
3. Klik tab **"Ujian & Kuis" (Assessment)** di navigasi atas atau klik tombol kelola kuis pada salah satu bab/modul.

### Langkah 3: Buka Modal AI Generator
1. Klik tombol **"Generate Kuis AI"** (dengan ikon kilauan `Sparkles`).
2. Perhatikan dialog modal baru:
   - **Cakupan Materi Pembelajaran**: Anda dapat memilih *Semua Materi dalam Bab Ini* atau memilih salah satu materi spesifik (misal: *Materi #1*).
   - **Fokus Gaya Soal**: Pilih salah satu arketipe:
     - ⚖️ *Kombinasi Seimbang* (Campuran konsep, studi kasus, kode)
     - 💻 *Analisis Kode & Output* (Bug hunting dengan nomor baris kode)
     - 📖 *Studi Kasus & Skenario Cerita* (Simulasi kasus industri)
     - 🧠 *Pemahaman Konseptual* (Prinsip & arsitektur)
   - **Jumlah Pertanyaan**: Pilih `3`, `5`, atau `10`.
   - **Catatan Materi Khusus (Opsional)**: Bisa dikosongkan agar AI otomatis mengambil materi dari database.

### Langkah 4: Generate & Tinjau Hasil (Step 2 Preview)
1. Klik **"Mulai Generate Kuis"**.
2. Amati loading indicator interaktif saat AI memproses kurikulum.
3. Setelah selesai, daftar soal hasil AI akan tampil di modal:
   - **Teks Pertanyaan**: Dapat langsung diedit pada textarea yang fleksibel.
   - **Badge Micro-Skill**: Menampilkan label kompetensi mikro (misal `list-indexing`, `exception-handling`).
   - **Opsi Jawaban**: 4 pilihan ganda (`A`, `B`, `C`, `D`) dapat diedit dan kunci jawaban dapat diganti dengan sekali klik.
   - **Petunjuk Belajar Bertingkat (Progressive Hints)**: Terdapat input untuk `Hint 1` dan `Hint 2` yang dapat disesuaikan.
   - **Regenerate Single**: Tombol putar (`RefreshCw`) untuk meminta AI merancang ulang hanya 1 soal tertentu jika kurang pas.

### Langkah 5: Simpan ke Kurikulum
1. Klik **"Simpan Semua (X) Soal ke Kursus"**.
2. Modal akan tertutup dan kuis otomatis tersimpan ke database.
3. Pada daftar kartu soal utama:
   - Cuplikan kode ditampilkan dalam terminal gelap skeuomorphic lengkap dengan badge bahasa.
   - Badge micro-skill tampil di header kartu.
   - Kotak petunjuk belajar bertingkat (`2 Petunjuk`) dan pembahasan edukatif tampil di bawah opsi jawaban.
