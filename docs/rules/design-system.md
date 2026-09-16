# Maguru UI/UX Design System Direction: Whimsical Ancient Fantasy Learning

**Versi:** 2.0 (Text-Based Course & AI Agent Platform)  
**Status:** Dokumen Pedoman Desain Resmi  
**Target Platform:** Web App (Mobile-First Responsive)

---

## 1. Pendahuluan & Visi Produk

Dokumen ini berfungsi sebagai panduan strategis dan filosofis bagi tim desain dan pengembang Maguru dalam membangun antarmuka pengguna (UI) dan pengalaman pengguna (UX). 

### 1.1. Hakikat Produk Maguru
**Maguru** adalah **platform kursus daring interaktif berbasis teks (text-based learning mirip Dicoding)** yang diperkaya dengan **implementasi AI Agent Tools terintegrasi**. Pengguna mempelajari materi terstruktur langkah demi langkah (step-by-step), membaca dokumentasi teknis, memecahkan tantangan koding/studi kasus, dan berinteraksi langsung dengan AI Agent sebagai mentor cerdas untuk konsultasi kode, evaluasi kuis, dan simulasi pemrograman.

### 1.2. Tema & Brand Feeling
* **Tema Utama:** *Ancient Fantasy Asia with Whimsical & Cartoonish Playful Vibes*.
* **Sensasi Brand:** *"Belajar teknologi dan koding di dalam akademi sihir/fantasi Asia kuno, ditemani asisten AI bijak layaknya guru petualang."*
* **Karakter Visual:**
  * **High Readability (80% Flat-Clean):** Materi teks bacaan panjang, blok kode, dan tabel penjelasan harus sangat bersih, memiliki kontras tinggi, dan nyaman di mata untuk belajar berjam-jam tanpa distraksi visual.
  * **Whimsical & Gameful (20% Tactile & Gamified):** Elemen progres belajar, achievement badge, token XP, dan tombol asisten AI memiliki sentuhan taktil (subtle 3D embossed/skeuomorphic halus) bernuansa gulungan perkamen fantasi Asia.
  * **Modern, Cepat, & Responsif:** Komponen ringan berbasis Tailwind CSS dan Shadcn UI yang teroptimasi untuk perangkat mobile dan desktop.

### 1.3. Kata Kunci Identitas Visual (Visual Keywords)
* `Focused Readability` (Fokus belajar teks tanpa silau)
* `Ancient Fantasy Asia` (Nuansa perkamen, alam, dan akademi bijak)
* `Whimsical & Playful` (Sentuhan kartun ramah, tidak kaku)
* `Intelligent & Tech-Forward` (Integrasi AI Agent modern yang presisi)
* `Gamified & Rewarding` (Progres bab, status quest, XP bar)

---

## 2. Palet Warna Resmi (Ancient Fantasy Asia Palette)

Maguru memiliki 4 pilar warna utama yang telah dikalibrasi untuk keterbacaan materi teks dan kenyamanan visual:

### 2.1. Matriks Warna Inti (Core Palette)

| Kategori Token | Nama Warna | Range Hex / Shades | Penggunaan Wajib |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | Ancient Beige Canvas | `#F5EDE0` (50) s/d `#7B5B2C` (900)<br>• Canvas Dasar: `#FAF5ED`<br>• Card White: `#FFFDF9` | Latar belakang modul bacaan teks, kartu artikel, kanvas workspace koding. |
| **Primary Action** | Merah Aksi (Action Red) | `#FFCCCB` (50) s/d `#B22424` (900)<br>• Default CTA: `#FF4D4D`<br>• Hover: `#FF3333`<br>• Active: `#E62E2E` | Tombol aksi utama (Mulai Belajar, Selesaikan Modul, Submit Kuis/Tugas). |
| **Secondary & Accent** | Kuning-Orange (Solar Warm) | `#FFE8C4` (50) s/d `#B96500` (900)<br>• Default: `#FFB148` | Poin XP, lencana pencapaian (achievement), highlight teks penting, ornamen. |
| **Nature & Progress** | Hijau Alam (Emerald Nature) | `#C8E6D0` (50) s/d `#02B052` (900)<br>• Default: `#5AC88A` (500) | Progress bar kelulusan materi, status soal berhasil, indikator online AI. |
| **AI Agent Accent** | Magic Indigo (Agent Spark) | `#8C4FFF` (500)<br>• Soft Bg: `#F3EBFF` | Pemicu AI Agent Tools, bubble rekomendasi AI, dan panel asisten belajar. |

### 2.2. Hirarki Teks & Kontras Keterbacaan (Text Hierarchy)
* **Primary Text:** `#2D2319` / `text-beige-950` (Hitam arang kayu hangat, sangat kontras untuk membaca ribuan kata).
* **Secondary Text:** `#6E5D4B` / `text-beige-700` (Penjelasan ringkas, metadata waktu baca, deskripsi pengantar).
* **Muted Caption:** `#9E8C77` / `text-beige-500` (Breadcrumbs bab, nomor langkah, timestamp riwayat kuis).
* **Code Editor Base:** Latar belakang blok kode bernuansa dark parchment / dark slate (`#1E1E24`) dengan syntax highlighting bertema alam dan api fantasi.

---

## 3. Tipografi & Skala Pembacaan (Reading-First Typography)

Platform kursus berbasis teks menuntut tipografi yang tajam dan tidak membuat mata lelah:

### 3.1. Pemilihan Font Family
1. **Font UI & Paragraf Utama: Poppins (Sans-Serif)**
   * Digunakan untuk 90% antarmuka: judul modul, paragraf narasi materi pelajaran, formulir kuis, tombol, dan navigasi.
   * Bersih, modern, dan memiliki keterbacaan tinggi di layar kecil smartphone.
2. **Font Kode & Angka Data: Fira Code (Monospace)**
   * Digunakan untuk seluruh blok kodingan (*code snippet*), inline code (`const agent = ...`), data terminal, skor kuis, dan waktu hitung mundur ujian.
   * Dilengkapi fitur ligatur pemrograman dan angka tabular (`tabular-nums`).
3. **Font Aksen Display: Playfair Display (Serif Opsional)**
   * Hanya digunakan secara selektif pada sertifikat kelulusan kursus, judul besar onboarding, dan kutipan motivasi belajar dari instruktur.

### 3.2. Skala Heading & Kenyamanan Baca (Line-Height & Width)
* **Aturan Lebar Paragraf Materi:** Maksimal `max-w-3xl` atau `65–75 karakter per baris` (`prose-beige`). Paragraf yang terlalu lebar ke samping akan membuat pembaca kehilangan fokus saat memindai materi teks.
* **Line Height Paragraf:** Selalu gunakan `leading-relaxed` (1.65 – 1.75) dengan jarak antar paragraf yang lega (`space-y-5`).

---

## 4. Gaya Desain: Modern Flat-Clean dengan 20% Whimsical Tactile Accents

Mengacu pada arsitektur modern Maguru, platform meninggalkan *heavy skeuomorphism / dirty neumorphism* dan menerapkan standar proporsi:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ARSITEKTUR ESTETIKA MAGURU                           │
│                                                                        │
│   [80% Flat-Clean Surface]         [20% Whimsical Tactile Accents]     │
│   • Area membaca materi bersih      • Tombol CTA Utama (Merah Aksi)     │
│   • Container blok kode monokrom    • Floating Trigger AI Agent Mentor  │
│   • Border tunggal halus 1px        • Badge Level XP & Quest Reward     │
│   • Negative space lapang           • Progress Bar Modul Belajar        │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1. Reading Canvas & Code Snippet
* Kartu materi menggunakan warna dasar `bg-[#FFFDF9]` dengan border tunggal `border-[#E8D9C6]`.
* Blok kode memiliki header yang memuat nama bahasa pemrograman (misal: `python`, `typescript`), tombol "Salin Kode", dan tombol "Tanya AI Agent tentang Kode Ini".

### 4.2. Elemen Interaksi AI Agent Tools
* Asisten AI diwujudkan sebagai panel mengambang yang mudah dipanggil (Dock / Bottom Sheet).
* Tampilan visual asisten menggunakan aksen warna *Magic Indigo* (`#8C4FFF`) berpadu dengan *Merah Aksi* (`#FF4D4D`).
* Streaming teks AI dilengkapi animasi blinking cursor halus dan opsi "Jelaskan Bagian Ini".

---

## 5. Arsitektur Komponen (Shadcn UI + Shadcn Studio)

Mengacu pada aturan teknis arsitektur Maguru:
1. **`components/ui/` (Atomic Shadcn UI):**
   * Komponen dasar standar: `button.tsx`, `input.tsx`, `dialog.tsx`, `tabs.tsx`, `badge.tsx`, `sheet.tsx`, `scroll-area.tsx`.
2. **`components/shadcn-studio/` (Reusable Tactile/Skeuo Elements):**
   * Komponen visual khusus seperti kartu silabus modul interaktif (`card-course-module.tsx`), progress track bergaya fantasy bar (`progress-ancient.tsx`), dan switcher tema.
3. **`features/[fitur]/components/` (Feature Modules):**
   * Contoh: `features/course-reader/`, `features/ai-agent/`, `features/quiz-engine/`. Mengimpor komponen dari UI dasar tanpa menduplikasi markup styling mentah.

---

## 6. Ergonomi Mobile-First untuk Pembaca Teks

* **Sistem Navigasi Silabus:** Di layar mobile (< 768px), daftar modul dan silabus bab disajikan melalui *Bottom Sheet Drawer* atau tombol floating indeks bab, sehingga layar penuh fokus pada teks materi.
* **Target Sentuh Jempol:** Seluruh tombol navigasi bab ("Kembali", "Bab Selanjutnya", "Tanya AI") berada di zona bawah layar (*Thumb Zone*) dengan tinggi minimal 44px (`h-11`).
* **Sticky Learning Action Bar:** Bar di bawah layar yang menampilkan persentase progres bab saat ini dan tombol aksi berikutnya.
