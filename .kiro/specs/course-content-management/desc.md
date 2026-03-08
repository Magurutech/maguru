# Sprint 2: Content First - Deskripsi & Hasil Brainstorming

**Tanggal:** 2026-03-07  
**Status:** Ready untuk Implementation  
**Prioritas:** P1 (Highest)

---

## 📖 Apa itu Sprint 2?

Sprint 2 adalah fase pengembangan kedua dari platform Maguru yang berfokus pada **struktur konten pembelajaran**. Tujuan utamanya adalah memungkinkan creator membuat materi pembelajaran yang terstruktur dan siswa dapat belajar dengan sistematis.

### Analogi Sederhana

Bayangkan Anda membuat sebuah buku:
- **Course** = Buku
- **Section** = Bab dalam buku
- **Lesson** = Halaman-halaman dalam setiap bab
- **Content** = Isi teks di setiap halaman

Sprint 2 membangun sistem agar creator bisa menulis "buku digital" dan siswa bisa membacanya dengan mudah.

---

## 🎯 Masalah yang Diselesaikan

### Sebelum Sprint 2
- Course hanya memiliki informasi dasar (judul, deskripsi, thumbnail)
- Tidak ada struktur pembelajaran yang jelas
- Siswa tidak tahu harus belajar apa dulu
- Creator tidak bisa mengorganisir materi dengan baik
- Progress belajar tidak tercatat

### Setelah Sprint 2
- Course memiliki struktur hierarki yang jelas (Course → Section → Lesson)
- Creator bisa membuat bab-bab dan materi pembelajaran
- Siswa bisa belajar secara terstruktur dari awal sampai akhir
- Progress belajar tercatat dan tersimpan
- Siswa tahu sudah sampai mana kemajuan mereka

---

## 🏗️ Struktur Pembelajaran yang Dibangun

### 1. Course (Kursus)
**Apa itu?** Wadah utama untuk semua materi pembelajaran.

**Contoh:** "Belajar HTML untuk Pemula"

**Informasi yang ada:**
- Judul course
- Deskripsi singkat
- Kategori (Web Development, Data Science, dll)
- Tingkat kesulitan (Beginner, Intermediate, Advanced)
- Estimasi durasi belajar

---

### 2. Section (Bab/Chapter)
**Apa itu?** Pengelompokan materi berdasarkan topik atau tema.

**Contoh dalam course "Belajar HTML untuk Pemula":**
- Section 1: Pengenalan HTML
- Section 2: Tag-tag Dasar HTML
- Section 3: Membuat Form HTML
- Section 4: HTML Semantic

**Fungsi:**
- Memecah materi besar menjadi bagian-bagian kecil
- Memudahkan siswa fokus pada satu topik
- Membuat pembelajaran lebih terstruktur

---

### 3. Lesson (Materi/Pelajaran)
**Apa itu?** Unit pembelajaran terkecil yang berisi konten spesifik.

**Contoh dalam Section "Pengenalan HTML":**
- Lesson 1: Apa itu HTML?
- Lesson 2: Struktur Dasar Dokumen HTML
- Lesson 3: Cara Kerja HTML di Browser
- Lesson 4: Tools untuk Belajar HTML

**Fungsi:**
- Menyampaikan satu konsep atau skill spesifik
- Berisi konten pembelajaran (teks, penjelasan, contoh)
- Bisa diselesaikan dalam satu sesi belajar (5-15 menit)

---

### 4. Content (Konten)
**Apa itu?** Isi dari setiap lesson dalam format markdown.

**Contoh konten Lesson "Apa itu HTML?":**
```
# Apa itu HTML?

HTML adalah singkatan dari HyperText Markup Language. 
HTML adalah bahasa markup yang digunakan untuk membuat 
struktur halaman web.

## Fungsi HTML
- Membuat struktur konten web
- Menampilkan teks, gambar, dan link
- Dasar dari semua website

## Contoh Kode HTML
<html>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

**Format:**
- Markdown (teks dengan formatting sederhana)
- Mendukung heading, bold, italic, list, code blocks
- Mudah ditulis dan dibaca

---

## 👥 Siapa yang Menggunakan Fitur Ini?

### 1. Creator (Pembuat Konten)
**Apa yang bisa dilakukan?**
- Membuat section baru dalam course mereka
- Menambah lesson ke dalam section
- Menulis konten pembelajaran dengan editor markdown
- Mengatur urutan section dan lesson
- Mengedit dan menghapus section/lesson

**Workflow Creator:**
1. Buka dashboard creator
2. Pilih course yang ingin diedit
3. Buat section baru (contoh: "Pengenalan HTML")
4. Tambah lesson ke section (contoh: "Apa itu HTML?")
5. Tulis konten lesson menggunakan editor
6. Simpan dan publish

---

### 2. Student (Siswa)
**Apa yang bisa dilakukan?**
- Melihat daftar section dalam course
- Membaca lesson satu per satu
- Menandai lesson sebagai selesai
- Melihat progress belajar mereka
- Melanjutkan dari lesson terakhir

**Workflow Student:**
1. Enroll ke course
2. Buka halaman belajar
3. Lihat daftar section dan lesson
4. Klik lesson untuk membaca konten
5. Klik "Mark as Complete" setelah selesai
6. Lanjut ke lesson berikutnya
7. Lihat progress bar (contoh: 30% selesai)

---

### 3. Admin
**Apa yang bisa dilakukan?**
- Melihat semua course dari semua creator
- Mengedit section dan lesson di course manapun
- Menghapus konten yang tidak sesuai
- Membantu creator yang kesulitan

---

## 🎨 Pengalaman Pengguna (User Experience)

### Creator Dashboard
**Tampilan:**
- List course yang sudah dibuat
- Tombol "Edit Course" untuk masuk ke editor
- Stats: jumlah section, jumlah lesson, jumlah siswa

**Editor Course:**
- Panel kiri: Daftar section dan lesson (struktur)
- Panel tengah: Editor markdown untuk menulis konten
- Panel kanan: Preview konten (seperti yang dilihat siswa)

**Interaksi:**
- Klik "Add Section" untuk buat section baru
- Klik "Add Lesson" untuk buat lesson baru
- Klik lesson untuk edit kontennya
- Tombol up/down untuk ubah urutan
- Auto-save setiap beberapa detik

---

### Student Learn Page
**Tampilan:**
- Sidebar kiri: Daftar section dan lesson
- Area utama: Konten lesson yang sedang dibaca
- Progress bar di atas: Persentase penyelesaian
- Tombol "Mark as Complete" di bawah konten

**Interaksi:**
- Klik section untuk expand/collapse lesson list
- Klik lesson untuk membaca konten
- Scroll untuk membaca konten
- Klik "Mark as Complete" setelah selesai
- Lesson yang sudah selesai diberi tanda ✓
- Progress bar otomatis update

---

## 📊 Progress Tracking (Pelacakan Kemajuan)

### Apa yang Dilacak?

**1. Lesson Progress (Per Lesson)**
- Apakah lesson sudah dibaca?
- Kapan lesson diselesaikan?
- Status: Not Started, In Progress, Completed

**2. Course Completion (Per Course)**
- Berapa persen course sudah selesai?
- Berapa lesson yang sudah diselesaikan?
- Berapa total lesson dalam course?
- Apakah course sudah 100% selesai?

### Cara Kerja Progress

**Scenario 1: Siswa Baru**
- Enroll ke course "Belajar HTML"
- Progress: 0% (0/20 lessons completed)
- Semua lesson berstatus "Not Started"

**Scenario 2: Siswa Belajar**
- Baca Lesson 1: "Apa itu HTML?"
- Klik "Mark as Complete"
- Progress: 5% (1/20 lessons completed)
- Lesson 1 berstatus "Completed" ✓

**Scenario 3: Siswa Lanjut Belajar**
- Selesaikan 10 lessons
- Progress: 50% (10/20 lessons completed)
- 10 lessons berstatus "Completed" ✓
- 10 lessons berstatus "Not Started"

**Scenario 4: Siswa Selesai Course**
- Selesaikan semua 20 lessons
- Progress: 100% (20/20 lessons completed)
- Semua lessons berstatus "Completed" ✓
- Dapat badge/certificate (future feature)

### Persistensi Progress

**Masalah yang diselesaikan:**
- Progress tidak hilang saat logout
- Progress tidak hilang saat ganti browser
- Progress tidak hilang saat ganti device

**Solusi:**
- Progress disimpan di database
- Terhubung dengan user account (Clerk)
- Bisa diakses dari mana saja

---

## 🔄 Workflow End-to-End

### Workflow Creator: Membuat Course Lengkap

**Step 1: Persiapan**
- Login sebagai creator
- Buka creator dashboard
- Pilih course yang ingin diisi konten

**Step 2: Membuat Struktur**
- Buat Section 1: "Pengenalan HTML"
- Buat Section 2: "Tag-tag Dasar"
- Buat Section 3: "Membuat Form"

**Step 3: Mengisi Konten**
- Masuk ke Section 1
- Buat Lesson 1: "Apa itu HTML?"
- Tulis konten menggunakan editor markdown
- Preview konten di panel kanan
- Simpan lesson

**Step 4: Lanjutkan**
- Buat Lesson 2, 3, 4, dst
- Isi semua section dengan lesson
- Review keseluruhan struktur
- Publish course

---

### Workflow Student: Belajar Course

**Step 1: Mulai Belajar**
- Browse course catalog
- Pilih course "Belajar HTML"
- Klik "Enroll" atau "Start Learning"
- Masuk ke learn page

**Step 2: Navigasi**
- Lihat daftar section di sidebar
- Klik Section 1: "Pengenalan HTML"
- Lihat daftar lesson dalam section
- Klik Lesson 1: "Apa itu HTML?"

**Step 3: Belajar**
- Baca konten lesson
- Pahami materi
- Coba contoh kode (jika ada)
- Klik "Mark as Complete"

**Step 4: Lanjut**
- Otomatis pindah ke Lesson 2
- Atau klik lesson berikutnya di sidebar
- Ulangi proses belajar
- Lihat progress bar bertambah

**Step 5: Selesai**
- Selesaikan semua lesson
- Progress mencapai 100%
- Dapat notifikasi "Course Completed!"
- Bisa review materi kapan saja

---

## 🎯 Keputusan Penting dari Brainstorming

### 1. Konten Disimpan di Database (Bukan File)

**Keputusan:** Semua konten lesson disimpan di database.

**Alasan:**
- Lebih mudah diakses dan dikelola
- Tidak perlu setup GitHub untuk creator
- Lebih cepat untuk load konten
- Mudah untuk backup dan restore

**Implikasi:**
- Creator menulis langsung di web editor
- Konten tersimpan otomatis
- Tidak perlu sync dengan GitHub (untuk sekarang)

---

### 2. Editor Markdown Modern (Tiptap)

**Keputusan:** Gunakan Tiptap editor dengan fitur minimal.

**Alasan:**
- User experience lebih baik dari textarea biasa
- Toolbar untuk formatting (bold, italic, heading)
- Preview real-time
- Modern dan sesuai tahun 2026

**Fitur yang Ada:**
- Bold, Italic, Code inline
- Heading 1, 2, 3
- Ordered list dan Unordered list
- Insert link
- Code blocks

**Fitur yang Belum (Sprint 3+):**
- Upload image
- Insert table
- Advanced syntax highlighting

---

### 3. Progress Manual (Bukan Otomatis)

**Keputusan:** Siswa harus klik "Mark as Complete" untuk menandai lesson selesai.

**Alasan:**
- Lebih reliable dan jelas
- Siswa punya kontrol penuh
- Tidak ada false positive (lesson dianggap selesai padahal belum)
- Lebih sederhana untuk implementasi

**Alternatif yang Ditolak:**
- Auto-mark saat scroll ke bawah (tidak reliable)
- Auto-mark berdasarkan waktu (tidak akurat)
- Auto-mark saat pindah lesson (bisa skip)

---

### 4. Urutan dengan Integer (Bukan Drag-Drop)

**Keputusan:** Gunakan tombol up/down untuk ubah urutan section/lesson.

**Alasan:**
- Lebih sederhana untuk Sprint 2
- Tidak perlu library drag-drop
- Tetap bisa reorder dengan mudah
- Drag-drop bisa ditambah nanti

**Cara Kerja:**
- Section 1, 2, 3, 4, ...
- Klik "Move Up" untuk tukar dengan section di atasnya
- Klik "Move Down" untuk tukar dengan section di bawahnya

---

### 5. Quiz dan Video Ditunda

**Keputusan:** Sprint 2 fokus pada markdown content saja.

**Alasan:**
- Mengurangi kompleksitas
- Fokus pada core structure dulu
- Quiz dan video adalah fitur besar (butuh sprint sendiri)
- Markdown sudah cukup untuk MVP

**Kapan Quiz dan Video?**
- Quiz: Sprint 3 (sudah direncanakan)
- Video: Sprint 3+ (setelah quiz)

---

## 📈 Manfaat Sprint 2

### Untuk Creator
✅ Bisa membuat course dengan struktur yang jelas  
✅ Bisa mengorganisir materi pembelajaran dengan baik  
✅ Bisa menulis konten dengan editor yang nyaman  
✅ Bisa melihat preview konten sebelum publish  
✅ Bisa mengatur urutan materi dengan mudah  

### Untuk Student
✅ Bisa belajar dengan struktur yang jelas  
✅ Tahu harus belajar apa dulu  
✅ Bisa track progress belajar  
✅ Tidak kehilangan progress saat logout  
✅ Bisa lanjut belajar dari lesson terakhir  

### Untuk Platform
✅ Memiliki sistem content management yang solid  
✅ Foundation untuk fitur-fitur berikutnya (quiz, video)  
✅ Data terstruktur dan mudah dikelola  
✅ Scalable untuk ribuan course dan lesson  

---

## 🚀 Apa Selanjutnya Setelah Sprint 2?

### Sprint 3: Quiz & Assessment
- Membuat quiz untuk setiap lesson
- Scoring system
- Feedback AI untuk jawaban siswa
- Review flow untuk materi yang belum dikuasai

### Sprint 3+: Video Content
- Upload video untuk lesson
- Video player dengan controls
- Video progress tracking
- Subtitle support

### Future: Advanced Features
- Collaborative editing (multiple creator)
- Version control untuk konten
- Content analytics (lesson mana yang paling sulit)
- Personalized learning path

---

## 📝 Ringkasan

Sprint 2 membangun **fondasi sistem pembelajaran** di Maguru dengan:

1. **Struktur Hierarki:** Course → Section → Lesson → Content
2. **Creator Tools:** Dashboard dan editor untuk membuat konten
3. **Student Experience:** Learn page dengan navigation dan progress tracking
4. **Progress System:** Pelacakan kemajuan belajar yang persisten

Fokus Sprint 2 adalah **simplicity dan reliability** - membangun core features yang solid sebelum menambah fitur advanced.

---

**Dokumentasi dibuat:** 2026-03-07  
**Versi:** 1.0  
**Target Audience:** Non-technical stakeholders, Product team, QA team
