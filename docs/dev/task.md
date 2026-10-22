# 🧪 Review Teknis & Panduan Instrumen Black Box Testing
**Platform Pembelajaran Adaptif MAGURU — Persiapan BAB III Metodologi Penelitian R&D**  
*Tinjauan Resmi CTO atas Lembar Pengujian Fungsional Sistem*  
**Status Dokumen:** Terverifikasi & Selaras dengan Codebase Aktif  
**Target:** Instrumen Pengujian Black Box Testing (Uji Ahli / Fungsional)  

---

## 1. 📌 Ringkasan Status & Keselarasan Ruang Lingkup MVP

Seluruh **8 fungsi** yang diajukan dalam kisi-kisi pengujian Anda **100% TELAH TERIMPLEMENTASI** dalam *codebase* aktif MAGURU (Frontend Next.js `maguru` dan Backend AI Microservice `maguru-model`). 

Pemisahan antara **Pengujian Fungsional (Black Box)** dan **Evaluasi Kualitas Respons AI (Pedagogical Evaluation)** yang Anda terapkan sudah **sangat tepat secara metodologis**:
- **Black Box Testing:** Menguji *keterandalan sistem, integritas alur logika, validasi input-output, status basis data, dan transisi antarmuka*.
- **Evaluasi Respons AI:** Dilakukan terpisah menggunakan kuesioner ahli/rubrik pedagogis (misal: uji kepatuhan metode Sokrates).

---

## 2. 🔍 Rincian Verifikasi 8 Fungsi Utama

---

### Fungsi 1: Initial Assessment (Pre-Test Diagnostik Mahasiswa)

* **Status Implementasi:** 🟢 **100% Selesai & Aktif**.
* **Komponen & Rute:** [`AssessmentPage.tsx`](file:///d:/.maguru/maguru/features/assessment-engine/components/AssessmentPage.tsx) pada rute `/course/[slug]/learn` *(State: `preTestCompleted = false`)*.
* **Alur Aktual Pengguna:**
  1. Mahasiswa baru mendaftar/membuka kursus Python di `/course/[slug]/learn`.
  2. Sistem secara otomatis mendeteksi status `preTestCompleted == false` dan **mengunci seluruh silabus materi**.
  3. Layar menyajikan tes diagnostik pilihan ganda berbatas waktu. Mahasiswa memilih opsi jawaban (A, B, C, D).
  4. Nomor soal pada *Question Palette* di sisi kanan otomatis terisi.
  5. Pada butir soal terakhir, mahasiswa menekan tombol **"Submit Assessment"**.
* **Kondisi Masukan (Input):**
  - Kumpulan ID butir soal dan kunci pilihan jawaban mahasiswa (`Record<questionId, optionKey>`).
  - Durasi pengerjaan dalam detik.
* **Hasil yang Diharapkan (Expected Result):**
  - Tombol submit dinonaktifkan (*disabled*) jika ada soal yang belum dijawab.
  - Data tersimpan ke tabel `user_assessments` (tipe: `PRE_TEST`).
  - Sistem menghitung persentase skor total dan skor per topik materi, lalu mengalihkan mahasiswa ke Halaman Hasil Penempatan Adaptif (Wireframe 2).
* **Batasan Pengujian (*Testing Constraints*):**
  - Pengujian duplikasi: Mahasiswa yang sudah menyelesaikan pre-test tidak boleh diizinkan submit ulang (HTTP 409 Conflict).
  - Jika mahasiswa keluar sebelum submit, jawaban belum tersimpan permanen dan mereka harus mengulang saat kembali.

---

### Fungsi 2: Rule-Based Placement (Penempatan Materi Berbasis Aturan)

* **Status Implementasi:** 🟢 **100% Selesai & Aktif**.
* **Komponen & Rute:** [`placement.service.ts`](file:///d:/.maguru/maguru/features/assessment-engine/services/placement.service.ts) dipicu oleh `POST /api/assessment/submit`.
* **Alur Aktual Pengguna:**
  1. Segera setelah mahasiswa menekan tombol submit pada Pre-Test, sistem mengevaluasi skor per topik.
  2. Sistem menerapkan ambang batas deterministik (`PLACEMENT_THRESHOLD = 70%`).
  3. Mahasiswa dialihkan ke halaman hasil penempatan ([`AssessmentResultPage.tsx`](file:///d:/.maguru/maguru/features/assessment-engine/components/AssessmentResultPage.tsx)).
  4. Halaman menampilkan: Skor Total (radial gauge), Skor per Topik, dan **Tabel Materi yang Dilewati (*Skipped Lessons*)** dengan badge hijau `LEWATI`.
  5. Ketika mahasiswa menekan tombol **"Mulai Belajar"**, sidebar kurikulum langsung membuka materi aktif pertama yang belum dikuasai, sementara materi yang lolos placement diberi centang selesai `[✓]`.
* **Kondisi Masukan (Input):**
  - Nilai skor topik hasil Pre-Test (misal: *Variabel: 100%*, *Percabangan: 40%*).
* **Hasil yang Diharapkan (Expected Result):**
  - Materi pelajaran yang judulnya memuat topik dengan skor $\ge 70\%$ secara otomatis dibuatkan rekaman pada tabel `lesson_progress` dengan status `completed = true`.
  - Materi terkait tidak perlu dibaca manual oleh mahasiswa, dan bab selanjutnya yang relevan langsung berstatus *unlocked*.
* **Batasan Pengujian (*Testing Constraints*):**
  - Jika semua skor topik $< 70\%$, tabel materi yang dilewati menampilkan pesan kosong (*"Tidak ada materi yang dilewati"*) dan mahasiswa harus memulai dari Pelajaran 1.1.
  - Aturan penempatan dijalankan di server Next.js + Prisma, bukan di LLM, sehingga outputnya harus 100% deterministik dan dapat diulang (*reproducible*).

---

### Fungsi 3: Socratic Co-Teacher (AI Tutor Pendamping Belajar)

* **Status Implementasi:** 🟢 **100% Selesai & Aktif**.
* **Komponen & Rute:** [`ChatbotAssistant.tsx`](file:///d:/.maguru/maguru/features/langserve/chatbot/components/ChatbotAssistant.tsx) pada rute `/course/[slug]/learn?lesson=[id]` yang terhubung ke Backend `maguru-model` rute `/chatbot/stream`.
* **Alur Aktual Pengguna:**
  1. Di ruang baca materi, mahasiswa membuka panel chat AI Co-Teacher "Guru" di sisi kanan.
  2. Mahasiswa mengetik pertanyaan atau mengklik salah satu chip pintasan: *"💡 Jelaskan dengan analogi sederhana"*, *"💻 Berikan contoh kode praktis"*, atau *"❓ Buat 1 kuis latihan singkat"*.
  3. Jawaban AI mengalir secara *streaming* karakter demi karakter (SSE) dengan format teks Markdown terstruktur.
* **Kondisi Masukan (Input):**
  - Teks pertanyaan mahasiswa.
  - Konteks aktif otomatis: `courseId`, `itemTitle` (judul materi yang sedang dibuka), dan `currentContent` (teks materi pelajaran).
* **Hasil yang Diharapkan (Expected Result):**
  - Koneksi SSE berhasil terbentuk (status HTTP 200).
  - Respons AI tidak langsung membeberkan kode solusi final (*Anti-Spoiler*), melainkan memandu pemikiran mahasiswa dengan pertanyaan balik terarah.
  - Teks materi pelajaran aktif dijadikan referensi utama dalam penalaran AI (*RAG grounding*).
* **Batasan Pengujian (*Testing Constraints*):**
  - Pengujian Black Box hanya memverifikasi *apakah streaming berjalan lancar, tombol Stop Streaming berfungsi, dan tombol Retry merespons jika koneksi terputus*. Kualitas pedagogis dievaluasi terpisah.

---

### Fungsi 4: Riwayat Percakapan (Conversation History & Context Continuity)

* **Status Implementasi:** 🟢 **100% Selesai & Aktif**.
* **Mekanisme Penyimpanan yang Benar-Benar Didukung:**
  Sistem MAGURU menggunakan **arsitektur persistensi ganda (Dual-Layer Continuity)**:
  1. **Layer Klien (Browser LocalStorage):**
     - Hook [`useChatbot.ts`](file:///d:/.maguru/maguru/features/langserve/chatbot/hooks/useChatbot.ts) menyimpan gelembung chat ke dalam `localStorage` per kursus (`maguru_chat_${courseId}`).
     - **Hasil:** Jika mahasiswa me-refresh halaman atau berpindah pelajaran, obrolan sebelumnya tidak hilang dari antarmuka.
  2. **Layer Server (Supabase PostgreSQL Checkpointer):**
     - Modul [`checkpointer.py`](file:///d:/.maguru/maguru-model/app/db/checkpointer.py) di backend AI menggunakan `PostgresSaver` dengan *connection pool* yang menyimpan state graph pesan ke tabel `checkpoints` berdasarkan `thread_id`.
     - **Hasil:** Ketika mahasiswa mengirim pertanyaan lanjutan (Turn ke-2), backend membaca histori turn sebelumnya dari database PostgreSQL sehingga AI memahami kata ganti seperti *"Jelaskan contoh kode dari fungsi tadi"*.
  3. **Layer Jangka Panjang (LangGraph Store):**
     - Modul [`store.py`](file:///d:/.maguru/maguru-model/app/db/store.py) mencatat profil pemahaman siswa lintas sesi percakapan.
* **Kondisi Masukan (Input):**
  - Pengiriman pesan bertingkat multi-turn pada `thread_id` yang sama.
  - Aksi me-refresh peramban web (*F5 / Page Reload*).
* **Hasil yang Diharapkan (Expected Result):**
  - Riwayat chat tetap tampil di layar setelah refresh halaman.
  - AI merespons pertanyaan ambigu turn ke-2 secara relevan terhadap konteks turn ke-1.
  - Tombol *"Hapus Riwayat Chat"* membersihkan tampilan dan mereset sesi.
* **Batasan Pengujian (*Testing Constraints*):**
  - Jika mahasiswa membuka peramban mode *Incognito* tanpa akun yang sama, riwayat lokal browser dimulai dari kondisi baru.

---

### Fungsi 5: Progressive Hints (Petunjuk Belajar Bertingkat)

* **Status Implementasi:** 🟢 **100% Selesai & Aktif**.
* **Komponen & Rute:** Komponen kuis [`AssessmentPage.tsx`](file:///d:/.maguru/maguru/features/assessment-engine/components/AssessmentPage.tsx#L307-L358) pada Section Quiz akhir bab.
* **Alur Aktual Pengguna:**
  1. Mahasiswa mengerjakan kuis bab dan merasa ragu pada soal kode tertentu.
  2. Di bawah kartu pilihan jawaban, muncul tombol: *"💡 Butuh Bantuan? Buka Petunjuk Belajar (3 Hint Tersedia)"*.
  3. Mahasiswa mengklik tombol tersebut ➔ Kotak kuning muncul menampilkan **Hint 1 (Konseptual)**.
  4. Jika masih bingung, mahasiswa mengklik tautan `+ Buka Hint Selanjutnya (2)` ➔ **Hint 2 (Alur Logika)** terbuka di bawah Hint 1.
  5. Mahasiswa membaca petunjuk dan memilih jawaban dengan yakin.
* **Kondisi Masukan (Input):**
  - Klik tombol buka petunjuk ke-1, ke-2, atau ke-3.
* **Hasil yang Diharapkan (Expected Result):**
  - Petunjuk terbuka secara bertahap (*sequential*). Mahasiswa tidak dapat langsung melompat ke Hint 3 tanpa membuka Hint 1 dan 2.
  - Petunjuk tidak mengubah atau membocorkan tanda pilihan jawaban yang benar.
* **Batasan Pengujian (*Testing Constraints*):**
  - Hanya aktif pada butir soal yang memiliki data `hints` di basis data.

---

### Fungsi 6: Code Explainer & Eksekusi Kode Peramban

* **Status Implementasi:** 🟢 **100% Selesai & Aktif**.
* **Bentuk & Lokasi Implementasi Aktual:**
  - Di backend AI: Tersedia agen terdedikasi `code_explainer` yang membedah kode menjadi 4 bagian (Tujuan, Baris-per-baris, Analogi, Edge Cases).
  - Di antarmuka pengguna: Terintegrasi langsung di dalam panel Co-Teacher melalui komponen [`ChatMessage.tsx`](file:///d:/.maguru/maguru/features/langserve/chatbot/components/ChatMessage.tsx) dan pelari kode peramban [`runner.ts`](file:///d:/.maguru/maguru/lib/code-runner/runner.ts).
* **Alur Aktual Pengguna:**
  1. Mahasiswa mengirimkan potongan kode ke Co-Teacher atau mengklik chip *"Berikan contoh kode praktis"*.
  2. AI membalas dengan blok kode skeuomorfik khusus yang memiliki bilah kontrol (*brand traffic lights*).
  3. Di dalam blok kode tersebut, terdapat tombol **"Run Code" (Jalankan Kode ▶)**.
  4. Mahasiswa mengklik tombol tersebut ➔ Mini terminal konsol terbuka di bawah blok kode menampilkan output eksekusi (`stdout` atau pesan `stderr`).
* **Kondisi Masukan (Input):**
  - Potongan kode program Python di dalam blok pesan chat.
  - Klik tombol "Run Code".
* **Hasil yang Diharapkan (Expected Result):**
  - Output kode tampil secara instan di terminal bawah kode tanpa me-refresh halaman.
  - Tombol *Copy Code* menyalin teks kode ke papan klip (*clipboard*).
* **Batasan Pengujian (*Testing Constraints*):**
  - Tidak memiliki halaman rute mandiri penuh (misal: `/code-explainer`), melainkan disematkan sebagai widget interaktif di dalam obrolan pembelajaran.

---

### Fungsi 7: Quiz Generator & Pengelolaan Kuis oleh Dosen (Human-in-the-Loop)

* **Status Implementasi:** 🟢 **100% Selesai & Aktif**.
* **Komponen & Rute:** [`QuizEditorPanel.tsx`](file:///d:/.maguru/maguru/features/cms/components/creator/manage/panels/QuizEditorPanel.tsx) pada rute `/creator/courses/[slug]/manage` *(View: `quiz-editor`)*.
* **Alur Aktual Pengguna (Dosen):**
  1. Dosen membuka ruang kerja kursus dan masuk ke tab evaluasi bab.
  2. Dosen mengklik tombol **"✨ Buat Kuis AI"**.
  3. Modal pop-up kurasi terbuka: Dosen memilih cakupan materi bab, jumlah soal (misal: 5 butir), tingkat kesulitan, dan gaya soal.
  4. Dosen mengklik **"Mulai Generate Kuis"** ➔ Frontend menembak `POST /api/v1/generate-quiz` ke backend AI.
  5. AI mengembalikan draf array JSON butir soal lengkap dengan pertanyaan, opsi A-D, kunci jawaban, pembahasan, dan progressive hints.
  6. **Tahap HITL:** Dosen memeriksa draf di modal. Dosen dapat menyunting teks pertanyaan, mengganti kunci benar, mengubah teks hint, menghapus butir soal yang tidak sesuai, atau meregenerasi butir tertentu (`Regenerate Single`).
  7. Dosen menekan tombol **"Simpan Semua Soal ke Kursus"**.
* **Kondisi Masukan (Input):**
  - Pilihan topik bab kurikulum dan jumlah soal di modal.
  - Teks suntingan dosen pada butir soal draf.
  - Klik tombol simpan.
* **Hasil yang Diharapkan (Expected Result):**
  - Draf soal tidak langsung masuk ke basis data saat selesai digenerate; jika dosen klik tombol "Tutup/Batal", draf dibuang tanpa sisa.
  - Saat tombol simpan diklik, seluruh soal yang lolos kurasi tersimpan ke tabel `assessment_questions` PostgreSQL via API Prisma dan langsung muncul di daftar bank soal kurikulum.
* **Batasan Pengujian (*Testing Constraints*):**
  - Pembuatan kuis membutuhkan waktu tunggu 3–10 detik bergantung pada latensi model LLM OpenRouter (tombol harus berstatus *loading/disabled* selama proses).

---

### Fungsi 8: Sinkronisasi Materi ke Basis Pengetahuan Co-Teacher (Knowledge Ingest & RAG)

* **Status Implementasi:** 🟢 **100% Selesai & Aktif**.
* **Mekanisme Pemasukan & Ketersediaan bagi Co-Teacher:**
  1. **Pemasukan/Pembaruan Materi:**
     - Dosen menulis/memperbarui materi pelajaran di CMS menggunakan editor TipTap lalu menyimpannya ke database PostgreSQL Prisma.
     - Dosen mengklik tombol **"1-Click Sync AI" (Sync AI ↺)** pada bilah atas [`ManageHeader.tsx`](file:///d:/.maguru/maguru/features/cms/components/creator/manage/ManageHeader.tsx).
     - Rute API Next.js `/api/creator/courses/[slug]/sync-knowledge` membaca seluruh teks materi dari basis data Prisma dan mengirimkannya ke `POST /api/v1/ingest` pada `maguru-model`.
  2. **Vektorisasi & Penyimpanan:**
     - Backend AI memecah teks pelajaran menjadi potongan (*chunks*), menghasilkan vektor embedding, dan menyimpannya ke tabel `course_knowledge_chunks` (ekstensi PostgreSQL `pgvector`).
  3. **Ketersediaan bagi Co-Teacher:**
     - Saat mahasiswa bertanya di ruang kelas, agen `co_teacher` mengambil embedding pertanyaan siswa dan melakukan *Cosine Similarity Search* terhadap `course_knowledge_chunks` yang memiliki `course_id` sesuai.
     - Potongan silabus yang paling relevan (score > 0.65) otomatis disuntikkan ke dalam *system prompt* LLM sebagai konteks resmi materi.
* **Kondisi Masukan (Input):**
  - Kursus yang memiliki minimal 1 materi pelajaran dengan teks terisi.
  - Klik tombol "Sync AI".
* **Hasil yang Diharapkan (Expected Result):**
  - Tombol menampilkan ikon animasi putar selama proses sinkronisasi.
  - Muncul notifikasi toast: *"Sinkronisasi materi ke AI berhasil"*.
  - Badge indikator pada header berubah menjadi hijau: `[✓ X Chunks AI]` menunjukkan jumlah potongan teks yang berhasil diindeks.
  - Pertanyaan mahasiswa mengenai konsep spesifik silabus dapat dijawab Co-Teacher secara tepat sesuai isi modul yang baru disinkronkan.
* **Batasan Pengujian (*Testing Constraints*):**
  - Jika kursus belum memiliki konten teks (kosong), sistem mengembalikan 0 chunks.
  - Membutuhkan ekstensi `pgvector` aktif di Supabase.

---

## 3. 📋 Matriks Lembar Pengujian Black Box Testing (Siap Dipakai di BAB III)

Tabel berikut dirancang khusus untuk mempermudah penyusunan instrumen pengujian fungsional pada laporan penelitian Anda:

| Kode Uji | Fitur / Fungsi | Skenario Masukan Pengujian | Prosedur Pengujian | Hasil Aktual yang Diharapkan (*Expected Result*) | Status Validasi |
|:---:|:---|:---|:---|:---|:---:|
| **BB-01** | **Initial Assessment (Pre-Test)** | Pengisian seluruh butir soal tes diagnostik pilihan ganda. | 1. Masuk ke `/course/[slug]/learn`.<br>2. Jawab seluruh soal hingga nomor terakhir.<br>3. Klik tombol "Submit Assessment". | Jawaban tersimpan di DB; sistem beralih ke halaman hasil penempatan adaptif. | 🟢 Valid |
| **BB-02** | **Initial Assessment (Validasi)** | Mencoba mengirimkan tes diagnostik saat masih ada soal kosong. | 1. Masuk ke halaman Pre-Test.<br>2. Lewati soal nomor 5 tanpa memilih opsi.<br>3. Navigasi ke nomor terakhir. | Tombol "Submit Assessment" berstatus non-aktif (*disabled*) dan tidak dapat diklik. | 🟢 Valid |
| **BB-03** | **Rule-Based Placement (Lolos)** | Skor Pre-Test pada topik tertentu $\ge 70\%$. | 1. Selesaikan Pre-Test dengan skor Topik Variabel = 80%.<br>2. Submit dan periksa tabel hasil penempatan. | Tabel menampilkan materi Variabel berstatus `Topik Dikuasai` & badge `LEWATI`; status materi otomatis `completed`. | 🟢 Valid |
| **BB-04** | **Rule-Based Placement (Belum Lolos)** | Skor Pre-Test pada topik tertentu $< 70\%$. | 1. Selesaikan Pre-Test dengan skor Topik Looping = 40%.<br>2. Buka silabus belajar kursus. | Modul Looping tetap terkunci atau wajib dipelajari (tidak mendapat status lewati). | 🟢 Valid |
| **BB-05** | **Socratic Co-Teacher (Streaming)** | Pertanyaan teks siswa ke tutor AI di ruang belajar. | 1. Buka ruang belajar materi.<br>2. Buka panel Co-Teacher.<br>3. Kirim pesan: *"Bagaimana cara kerja if di Python?"*. | Respons AI mengalir secara streaming (SSE); teks panduan sokratik tampil bertahap tanpa reload. | 🟢 Valid |
| **BB-06** | **Riwayat Percakapan (Multi-Turn)** | Pertanyaan lanjutan yang bergantung pada turn sebelumnya. | 1. Kirim: *"Apa fungsi while loop?"*.<br>2. Setelah dijawab, kirim: *"Beri contoh kodenya"*. | AI memahami konteks kata ganti "kodenya" merujuk pada while loop dari turn pertama. | 🟢 Valid |
| **BB-07** | **Riwayat Percakapan (Persistensi)** | Refresh halaman peramban saat obrolan sedang berlangsung. | 1. Lakukan percakapan 3 turn dengan Co-Teacher.<br>2. Tekan tombol F5 / Refresh browser. | Obrolan sebelumnya tetap muncul lengkap di layar (dibaca dari LocalStorage/DB). | 🟢 Valid |
| **BB-08** | **Progressive Hints (Scaffolding)** | Permintaan petunjuk saat mengalami kebuntuan pada kuis bab. | 1. Masuk ke Section Quiz bab.<br>2. Klik tombol "Buka Petunjuk Belajar".<br>3. Klik "+ Buka Hint Selanjutnya". | Hint 1 (Konseptual) terbuka; klik kedua membuka Hint 2 (Logika) secara berurutan. | 🟢 Valid |
| **BB-09** | **Code Explainer (Runner)** | Klik tombol eksekusi kode pada blok kode di dalam chat. | 1. Minta Co-Teacher memberikan contoh kode.<br>2. Klik tombol "Run Code / Jalankan Kode ▶". | Terminal interaktif terbuka di bawah kode dan menampilkan output eksekusi program. | 🟢 Valid |
| **BB-10** | **Quiz Generator & HITL (Dosen)** | Generate draf kuis dengan AI dan penyuntingan manual. | 1. Buka Quiz Editor di CMS.<br>2. Klik "Buat Kuis AI" dan pilih 5 soal.<br>3. Edit redaksi pertanyaan draf #1.<br>4. Klik "Simpan Semua Soal ke Kursus". | Soal hasil generate tampil di modal; perubahan teks tersimpan di DB Prisma saat tombol simpan ditekan. | 🟢 Valid |
| **BB-11** | **Quiz Generator (Pembatalan)** | Membatalkan draf kuis hasil generate AI. | 1. Generate kuis AI di modal.<br>2. Klik tombol "Tutup/Batal" tanpa klik simpan. | Tidak ada penambahan soal baru pada tabel `assessment_questions` kurikulum. | 🟢 Valid |
| **BB-12** | **Sinkronisasi RAG Kursus** | Dosen menekan tombol "1-Click Sync AI" setelah mengedit materi. | 1. Simpan materi baru di TipTap Editor.<br>2. Klik tombol "Sync AI" di header workspace. | Muncul notifikasi sukses; badge header terupdate menjadi `[✓ X Chunks AI]`; materi terindeks di pgvector. | 🟢 Valid |

---

## 4. 💡 Catatan Rekomendasi untuk Bab III Skripsi

1. **Format Instrumen:** Matriks tabel **BB-01 hingga BB-12** di atas dapat langsung disalin ke lampiran atau sub-bab instrumen pengujian fungsional skripsi Anda.
2. **Kriteria Kelulusan Uji (*Pass/Fail Criteria*):** Dinyatakan **"Lulus (Pass)"** apabila sistem merespons sesuai kolom *Expected Result*, dan dinyatakan **"Gagal (Fail)"** jika terjadi *crash*, tombol tidak berfungsi, atau data gagal tersimpan ke Supabase PostgreSQL.
3. **Penyelarasan Penguji:** Instrumen ini ditujukan untuk diisi oleh **Penguji Sistem / Software Tester** (bisa rekan sejawat atau pengembang), bukan untuk evaluasi pedagogis dosen ahli materi.
