# Standard Operating Procedure (SOP) UI/UX & Design System Maguru
**Versi:** 2.0 (Ancient Fantasy Asia Course & AI Platform)  
**Status:** Dokumen Resmi Tunggal (*Single Source of Truth*)  
**Pembaruan:** September 2026 — Transisi Desain Pembelajaran Teks Terstruktur dengan Sentuhan Whimsical & AI Agent Tools

---

## Pendahuluan

Dokumen SOP ini mengatur tata kelola perancangan antarmuka pengguna (UI) dan pengalaman pengguna (UX) untuk seluruh platform **Maguru**. Maguru adalah **platform kursus daring interaktif berbasis teks (text-based learning mirip Dicoding)** yang dilengkapi dengan **implementasi AI Agent Tools**.

SOP ini dibuat untuk menghentikan inkonsistensi visual, mencegah penggunaan kode warna liar (*hex drift*), serta memastikan antarmuka tetap **sangat nyaman dibaca untuk belajar berjam-jam (reading-first ergonomics)** sembari mempertahankan nuansa petualangan edukatif bertema **"Whimsical Ancient Fantasy Asia"**.

---

## Bab 1: Prinsip Emas UI/UX Maguru (The 5 Golden Commandments)

Setiap halaman modul, komponen interaktif, dan dialog di Maguru wajib mematuhi 5 prinsip dasar berikut:

### 1. The 80/20 Tactile Rule (Fokus Membaca Tanpa Distraksi)
* **80% Antarmuka adalah Flat-Clean**: Seluruh area modul teks materi pelajaran, blok kode pemrograman (*code snippets*), tabel dokumentasi, dan indeks silabus harus datar, bersih, kontras tinggi, dan bebas polusi visual (*zero visual clutter*).
* **20% Antarmuka adalah Aksen Taktil (Subtle 3D Embossed & Gamified)**: Sentuhan kedalaman taktil hanya diperbolehkan pada elemen aksi utama (*Primary CTA Button* "Selesaikan Modul / Submit Tugas"), floating trigger asisten AI Agent, progres bar kelulusan materi, dan kartu lencana XP/pencapaian.
* **Haram Hukumnya**: Menggunakan *heavy neumorphism* atau bayangan ganda tebal yang membuat teks materi terasa kabur dan melelahkan mata siswa.

### 2. Mobile Thumb-Zone First (Ergonomi Belajar Satu Tangan)
* Seluruh navigasi kritis belajar (tombol "Modul Berikutnya", "Tanya AI Guru", "Daftar Silabus Bab") wajib berada di zona jangkauan jempol (bagian bawah layar HP).
* Indeks silabus bab dan panel chat konsultasi AI Agent pada perangkat mobile **wajib** menggunakan **Bottom Sheet Drawer** (muncul dari bawah layar), bukan pop-up mengambang yang menutupi teks materi.
* Ukuran area sentuh (*touch target*) minimal adalah **44×44px** (ideal 48×48px), agar mudah ditekan saat membaca di smartphone.

### 3. Reading Ergonomics & Negative Space (Kenyamanan Membaca Panjang)
* Area pembaca teks materi dibatasi maksimal `max-w-3xl` (sekitar 65–75 karakter per baris) dengan `leading-relaxed` (1.65 – 1.75).
* Jarak antar-paragraf dan blok kode wajib memiliki ruang bernapas yang cukup (`my-5` hingga `my-6`).

### 4. Zero Layout Shift & Tabular Numbers (Stabilitas Visual)
* Seluruh angka dinamis (durasi perkiraan baca "5 menit", persentase progres materi "78%", waktu hitung mundur kuis, dan perolehan XP) **wajib** menggunakan font angka berjarak tetap (`tabular-nums`) agar tidak menyebabkan pergeseran layout (*layout shift*) saat nilai berganti.
* Blok kode wajib memiliki kontainer dengan tinggi minimum atau skeleton loader sebelum sintaks diwarnai (*syntax highlighting*) oleh renderer.

### 5. Intentional Interaction Feedback (Respon Instan 100ms & AI Streaming)
* Setiap interaksi klik tombol wajib memberikan umpan balik taktil langsung (skala 98% saat ditekan dan transisi 150–200ms).
* Respons AI Agent wajib memiliki indikator status yang jelas (*Thinking State* dengan animasi denyut halus dan *Streaming Cursor* saat teks jawaban sedang diketik).

---

## Bab 2: Kamus Token Warna & Surface (Larangan Hex Liar)

Dilarang keras menuliskan kode HEX baru secara sembarangan di dalam komponen. Gunakan hanya palet token resmi berikut:

### 1. Matriks Warna Inti (Core Palette)

| Kategori Token | Nama Warna | Kode Hex | Penggunaan Wajib |
|---|---|---|---|
| **Canvas Background** | Ancient Beige Canvas | `#FAF5ED` | Latar belakang seluruh halaman modul materi dan workspace belajar. |
| **Surface Card (Primary)** | Pure Parchment White | `#FFFDF9` | Latar belakang kartu artikel pelajaran, panel kuis, dan formulir. |
| **Surface Card (Soft)** | Warm Cream Sheet | `#F5EDE0` | Latar belakang silabus daftar bab, container info tips, dan drawer. |
| **Primary Action (CTA)** | Merah Aksi (Action Red) | `#FF4D4D` | Tombol CTA utama ("Mulai Belajar", "Submit Jawaban", "Selesai"). |
| **Primary Action Hover** | Deep Action Red | `#FF3333` | Status hover tombol aksi utama. |
| **Primary Action Active** | Crimson Ember | `#E62E2E` | Status tekan tombol aksi utama. |
| **Secondary Brand / XP** | Solar Orange-Gold | `#FFB148` | Poin reward XP, lencana kursus, status quest aktif, dan highlight kata kunci. |
| **Nature / Progress** | Emerald Nature | `#5AC88A` | Progress bar kelulusan bab, indikator soal benar, centang checklist silabus. |
| **AI Agent Accent** | Magic Indigo Spark | `#8C4FFF` | Tombol pemicu AI Agent Mentor, bubble pesan bot pintar, dan ikon asisten. |
| **AI Agent Soft Bg** | Mist Indigo | `#F3EBFF` | Kotak saran AI, highlight penjelasan kode dari asisten. |
| **Text Primary (Read)** | Deep Charcoal Wood | `#2D2319` | Warna utama seluruh paragraf materi ajar dan heading penting (kontras tinggi). |
| **Text Secondary** | Aged Bark | `#6E5D4B` | Keterangan modul, waktu estimasi baca, dan petunjuk form. |
| **Border Line (Primary)** | Golden Sand | `#D8C4A7` | Garis tepi tunggal 1px kartu modul, divider bab, dan border formulir. |

### 2. Standar Opacity Baku Garis Tepi (Border Rules)

Untuk menjaga ketertiban visual antar halaman materi:

```css
/* 1. Border Kartu Materi & Kontainer Konten (Default) */
border border-[#D8C4A7]/35   /* Halus, menyatu dengan kertas kanvas */

/* 2. Border Form Input, Pilihan Jawaban Kuis, & Code Frame */
border border-[#D8C4A7]/70   /* Tegas agar batas interaksi terlihat jelas */

/* 3. Border Aktif / Modul Sedang Dipelajari / Pilihan Terpilih */
border border-[#FF4D4D]      /* Solid Merah Aksi atau Kuning Emas */
```

### 3. Standar Bayangan Permukaan (Elevation & Shadows)

* **Surface Datar (Default Card Materi)**:
  `shadow-[0_2px_8px_rgba(45,35,25,0.04)]`
* **Surface Terangkat (Hover Card / Dropdown Menu)**:
  `shadow-[0_6px_16px_rgba(45,35,25,0.08)]`
* **Tombol Aksi Utama & AI Trigger (Subtle 3D Embossed)**:
  `shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_6px_rgba(255,77,77,0.3)]`

---

## Bab 3: Aturan Skala Tipografi Pembelajaran

Platform kursus berbasis teks menuntut disiplin tipografi tinggi:
* **Font UI, Heading & Paragraf**: **Poppins** (Modern, bersahabat, sangat nyaman dibaca).
* **Font Blok Kode & Data Tabular**: **Fira Code** (Monospace jelas dengan ligatur sintaks).
* **Font Klasik Khusus**: **Playfair Display** (Hanya untuk Sertifikat Kelulusan Resmi & Kutipan Bijak Instruktur).

### 1. Matriks Skala Tipografi Materi

| Tingkat | Font Family | Kelas Tailwind | Ukuran / Line-Height | Penggunaan |
|---|---|---|---|---|
| **H1 Title Modul** | Poppins | `font-sans text-2xl sm:text-3xl font-bold text-[#2D2319]` | 28–34px / 1.25 | Judul bab kursus (misal: "Pengenalan AI Agent Tools") |
| **H2 Sub-Bab** | Poppins | `font-sans text-xl sm:text-2xl font-semibold text-[#2D2319]` | 22–26px / 1.3 | Judul sub-materi pelajaran |
| **H3 Section** | Poppins | `font-sans text-lg font-medium text-[#2D2319]` | 18–20px / 1.35 | Judul langkah koding atau instruksi tugas |
| **Paragraf Materi**| Poppins | `font-sans text-base text-[#2D2319] leading-relaxed` | 16px / 1.7 | Isi teks utama modul ajar (standar kenyamanan baca) |
| **Code Block** | Fira Code | `font-mono text-sm leading-relaxed text-[#E2E8F0]` | 13–14px / 1.6 | Potongan kode pemrograman & contoh sintaks |
| **Inline Code** | Fira Code | `font-mono text-xs px-1.5 py-0.5 rounded bg-[#F5EDE0] text-[#FF4D4D]` | 12px | Referensi variabel/fungsi di dalam paragraf |
| **Label / Button** | Poppins | `font-sans text-xs sm:text-sm font-semibold tracking-wide` | 12–14px / 1.2 | Teks tombol aksi, label formulir kuis |
| **Meta / Caption** | Poppins | `font-sans text-xs text-[#6E5D4B] tabular-nums` | 11–12px | Estimasi menit baca ("⏱ 7 Menit"), poin XP |

---

## Bab 4: Panduan Komponen & 5-State Matrix

Setiap elemen interaktif wajib mengimplementasikan **5 State** secara lengkap:

### 1. Tombol Aksi Utama (Primary CTA Button — Merah Aksi)
* **Default**:
  `bg-[#FF4D4D] text-white rounded-xl h-11 px-6 font-sans text-sm font-semibold tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_6px_rgba(255,77,77,0.3)] transition-all duration-150`
* **Hover**:
  `hover:bg-[#FF3333] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(255,77,77,0.4)] hover:-translate-y-0.5`
* **Active (Ditekan)**:
  `active:scale-[0.98] active:translate-y-0 active:bg-[#E62E2E]`
* **Focus-Visible (Keyboard)**:
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D4D] focus-visible:ring-offset-2`
* **Disabled**:
  `disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none`

### 2. Tombol Pemicu AI Agent (Floating AI Mentor Button)
* **Default**:
  `bg-[#8C4FFF] text-white rounded-full h-12 px-5 font-sans text-sm font-medium shadow-[0_4px_14px_rgba(140,79,255,0.35)] flex items-center gap-2`
* **Hover**:
  `hover:bg-[#7A3CE8] hover:shadow-[0_6px_20px_rgba(140,79,255,0.45)] hover:scale-105 transition-all`
* **Active**:
  `active:scale-95`
* **Thinking/Loading**:
  `animate-pulse bg-[#8C4FFF]/80`

### 3. Pilihan Kuis / Opsi Ganda (Quiz Option Card)
* **Unselected (Default)**:
  `bg-[#FFFDF9] border border-[#D8C4A7]/60 text-[#2D2319] rounded-xl p-4 transition-all hover:border-[#FFB148] hover:bg-[#FAF5ED]`
* **Selected (Pilihan Siswa)**:
  `bg-[#FAF5ED] border-2 border-[#FF4D4D] text-[#2D2319] font-medium shadow-xs`
* **Correct (Jawaban Benar)**:
  `bg-[#C8E6D0]/30 border-2 border-[#5AC88A] text-[#136637]`
* **Incorrect (Jawaban Salah)**:
  `bg-[#FFCCCB]/30 border-2 border-[#FF4D4D] text-[#991B1B]`

### 4. Input Teks Pertanyaan ke AI / Kolom Form
* **Default**:
  `bg-[#FFFDF9] border border-[#D8C4A7]/70 rounded-xl h-11 px-4 text-sm text-[#2D2319] placeholder:text-[#6E5D4B]/50 transition-all`
* **Focus**:
  `focus:border-[#8C4FFF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8C4FFF]/25 shadow-xs`
* **Disabled**:
  `bg-[#FAF5ED]/80 text-[#6E5D4B]/40 cursor-not-allowed`

---

## Bab 5: Checklist Quality Control (QC) Sebelum Kode Di-Merge

Setiap PR atau penambahan fitur materi/komponen baru **wajib lolos 8 poin inspeksi QC**:

- [ ] **1. Bebas Heavy Neumorphism**: Tidak ada border tebal 3px atau lubang input cekung kotor. Desain modul materi bersih, flat, dan berfokus pada teks.
- [ ] **2. Kepatuhan Token Warna**: Seluruh warna mengacu pada palet resmi (Beige `#FAF5ED`, Merah Aksi `#FF4D4D`, Kuning-Orange `#FFB148`, Hijau Alam `#5AC88A`, Magic Indigo `#8C4FFF`). Tidak ada hex acak.
- [ ] **3. Kepatuhan Tipografi & Keterbacaan**: Materi teks menggunakan Poppins `leading-relaxed` dengan batas lebar baris `max-w-3xl`. Blok kodingan menggunakan Fira Code.
- [ ] **4. Tabular Numbers**: Waktu baca, persentase progress belajar (`75%`), dan skor XP telah menggunakan `tabular-nums`.
- [ ] **5. Ergonomi Mobile**: Navigasi bab dan tombol "Tanya AI" mudah diakses di zona jempol bawah. Drawer silabus responsive di mobile. Target sentuh minimal 44px.
- [ ] **6. Kelengkapan 5-State**: Elemen interaktif memiliki status `default`, `hover`, `active`, `focus-visible`, dan `disabled`.
- [ ] **7. Feedback AI Agent yang Jelas**: Setiap interaksi dengan AI Agent memiliki indikator loading/streaming yang transparan dan informatif.
- [ ] **8. Validasi Build & Linting**: Lulus pemeriksaan linting dan type-checking TypeScript tanpa error.

---

## Ringkasan Eksekutif bagi Developer

> *"Di Maguru, membaca materi adalah pengalaman inti. Buatlah teks pelajaran setenang dan sebersih mungkin, lalu beri energi petualangan melalui aksen reward, tombol aksi tegas, dan kecerdasan asisten AI yang selalu siap membantu."*
