# 🧪 Panduan Pengujian Manual (Manual Testing Guide)
## Evaluasi & Verifikasi: Modernisasi Visual & Side-Features Lesson Editor Tiptap (MoSCoW)

Dokumen ini memuat panduan langkah demi langkah (*step-by-step testing script*) untuk melakukan pengujian fungsional dan estetika terhadap fitur baru pada **Lesson Editor Tiptap & Workspace Creator Maguru**.

---

## 📋 Prasyarat Pengujian (Pre-requisites)

1. **Frontend Maguru**: Berjalan normal di `http://localhost:3000` (atau port dev yang aktif).
2. **Akun Creator**: Sudah login dan membuka halaman kelola kursus di:
   `http://localhost:3000/creator/courses/[slug]/manage`
3. **Pelajaran Uji**: Pilih salah satu pelajaran yang sudah ada (misal: *Pengenalan Python*) atau klik `+ Tambah Pelajaran`.

---

## 🎯 DAFTAR SKENARIO PENGUJIAN

| ID Skenario | Kategori | Fitur yang Diuji | Target Hasil |
| :--- | :--- | :--- | :--- |
| **TC-ED-01** | **Must-Have** | Document Sheet Container (M-1) | Teks berada di lembaran dokumen rapi, kontras tinggi & nyaman dibaca |
| **TC-ED-02** | **Must-Have** | Zen Writing Mode / Toggle Sidebar (M-2) | 1-klik melipat sidebar kurikulum, editor melebar 100% penuh |
| **TC-ED-03** | **Must-Have** | IDE Code Block & 1-Click Copy (M-3) | Blok kode dengan dropdown bahasa & tombol salin kode instan |
| **TC-ED-04** | **Must-Have** | Spellcheck Disabled / Bebas Garis Merah (M-4) | Tidak ada lagi garis merah bergerigi browser pada teks & judul |
| **TC-ED-05** | **Should-Have** | Floating Bubble Selection Menu (S-3) | Toolbar melayang otomatis saat teks diblok untuk styling cepat |
| **TC-ED-06** | **Should-Have** | Notion-Style Callout Blocks (S-2) | Kotak informasi (Info, Tips, Warning) via slash command |
| **TC-ED-07** | **Should-Have** | Student Live Preview Modal (S-1) | Pratinjau reader mode bersih persis seperti tampilan siswa |
| **TC-ED-08** | **Should-Have** | Keyboard Shortcut & Tooltip Indication (S-4) | Tooltip `Ctrl+S` aktif & shortcut keyboard memicu penyimpanan |
| **TC-ED-09** | **Could-Have** | AI Content Writing Assistant (C-1) | Modal AI Assistant untuk menyisipkan rangkuman & kode contoh |
| **TC-ED-10** | **Could-Have** | Export Markdown (.md) & Copy Markdown (C-2) | Download berkas `.md` materi & salin markdown ke clipboard |

---

## 🚀 SKENARIO PENGUJIAN DETAIL

### 1. TC-ED-01: Document Sheet Container Metaphor (Must-Have M-1)
* **Tujuan**: Memastikan teks materi disajikan dalam format lembaran dokumen solid di tengah layar, terpisah dari pola background bergaris.
* **Langkah Pengujian**:
  1. Buka salah satu materi pelajaran di CMS.
  2. Perhatikan area tulis utama.
* **Kriteria Keberhasilan**:
  * [ ] Area tulis berbentuk lembaran dokumen putih/ivory bersih berbingkai melengkung (`rounded-3xl`) dengan bayangan halus.
  * [ ] Terdapat label kecil `"MATERI PEMBELAJARAN"` berwarna oranye/coral di atas judul.
  * [ ] Teks paragraf memiliki kontras tajam dan sangat nyaman dibaca.

---

### 2. TC-ED-02: Zen Writing Mode / Toggle Sidebar Collapse (Must-Have M-2)
* **Tujuan**: Memastikan kreator dapat melipat sidebar kurikulum untuk mendapatkan ruang menulis 100% penuh tanpa distraksi.
* **Langkah Pengujian**:
  1. Perhatikan sudut kiri toolbar (di sebelah tombol Batal).
  2. Klik tombol ikon panel (`PanelLeftClose`).
  3. Perhatikan transisi sidebar kiri.
  4. Klik kembali tombol panel (`PanelLeftOpen`).
  5. Muat ulang halaman browser (`F5`).
* **Kriteria Keberhasilan**:
  * [ ] Saat tombol diklik, sidebar modul melipat secara mulus ke kiri dan lembaran editor otomatis melebar mengisi ruang kosong.
  * [ ] Ikon tombol berganti secara adaptif antara buka dan tutup panel.
  * [ ] Status posisi sidebar tersimpan di browser (`localStorage`), sehingga saat refresh halaman status tidak reset sendiri.

---

### 3. TC-ED-03: Syntax-Highlighted Code Block & One-Click Copy (Must-Have M-3)
* **Tujuan**: Memastikan materi pemrograman memiliki blok kode bergaya IDE profesional dengan pemilih bahasa dan tombol salin.
* **Langkah Pengujian**:
  1. Pada baris baru di editor, ketik:
     ```
     ```
     lalu tekan tombol `Spasi` (atau ketik `/code` lalu tekan `Enter`).
  2. Ketikkan beberapa baris kode Python:
     ```python
     def sapa(nama):
         return f"Halo, {nama}!"
     ```
  3. Perhatikan header bar gelap di atas blok kode.
  4. Coba ubah bahasa pemrograman melalui dropdown (misal: ganti ke `JAVASCRIPT`).
  5. Klik tombol **"Salin"** di pojok kanan atas blok kode.
  6. Buka Notepad atau terminal, lalu tekan `Ctrl + V`.
* **Kriteria Keberhasilan**:
  * [ ] Blok kode memiliki kontras latar gelap bergaya IDE dengan font monospaced yang rapi.
  * [ ] Dropdown bahasa berfungsi mengganti penanda bahasa secara interaktif.
  * [ ] Saat tombol "Salin" diklik, tombol berubah menjadi centang hijau dan bertuliskan *"Tersalin"*.
  * [ ] Teks kode berhasil di-paste secara sempurna di aplikasi lain.

---

### 4. TC-ED-04: Bebas Garis Merah Browser / Spellcheck Disabled (Must-Have M-4)
* **Tujuan**: Memastikan tidak ada garis bergelombang merah (*spellcheck error*) yang mengotori kata-kata bahasa Indonesia atau istilah teknis coding.
* **Langkah Pengujian**:
  1. Periksa kolom judul pelajaran dan paragraf teks materi yang mengandung istilah teknis (misal: *variabel, integer, looping, string, syntax, indentation*).
* **Kriteria Keberhasilan**:
  * [ ] Tidak ada garis merah bergelombang di bawah kata-kata tersebut.
  * [ ] Tampilan dokumen terlihat bersih dan rapi.

---

### 5. TC-ED-05: Floating Bubble Selection Menu (Should-Have S-3)
* **Tujuan**: Memungkinkan kreator memformat teks secara cepat tepat di atas teks yang sedang dipilih tanpa perlu mengarahkan mouse ke toolbar atas.
* **Langkah Pengujian**:
  1. Sorot (blok) beberapa kata di dalam paragraf.
  2. Amati toolbar melayang yang muncul tepat di atas kata yang diblok.
  3. Klik ikon **B** (Bold) $\rightarrow$ kata menjadi tebal.
  4. Klik ikon **Code (`< >`)** $\rightarrow$ kata berubah menjadi inline code.
  5. Klik ikon **Highlighter** $\rightarrow$ kata ter-highlight warna.
* **Kriteria Keberhasilan**:
  * [ ] Bubble menu melayang (*floating dark glassmorphism*) muncul seketika saat teks diseleksi dan menghilang saat seleksi dilepas.
  * [ ] Seluruh tombol formatting bekerja akurat dan status tombol aktif (berwarna coral) saat kursor berada di teks terformat.

---

### 6. TC-ED-06: Notion-Style Callout / Alert Blocks (Should-Have S-2)
* **Tujuan**: Menyediakan blok penekanan informasi khusus (Tips, Peringatan, Catatan) untuk modul pembelajaran.
* **Langkah Pengujian**:
  1. Pada baris baru kosong di editor, ketik:
     `/tip` lalu tekan `Enter`.
  2. Ketikkan kalimat tips di dalamnya (misal: *"Gunakan virtual environment untuk mengisolasi dependensi"*).
  3. Pada baris baru berikutnya, ketik:
     `/warn` lalu tekan `Enter`.
  4. Pada baris baru berikutnya, ketik:
     `/info` lalu tekan `Enter`.
* **Kriteria Keberhasilan**:
  * [ ] Blok Callout Tips muncul dengan latar hijau lembut, ikon 💡, dan label *"💡 Tips Praktis"*.
  * [ ] Blok Callout Warning muncul dengan latar kuning-oranye lembut, ikon ⚠️, dan label *"⚠️ Perhatian Penting"*.
  * [ ] Blok Callout Info muncul dengan latar biru lembut, ikon ℹ️, dan label *"ℹ️ Informasi"*.

---

### 7. TC-ED-07: Student Live Preview Modal / Reader Mode (Should-Have S-1)
* **Tujuan**: Memverifikasi tampilan materi siswa sebelum materi dipublikasikan.
* **Langkah Pengujian**:
  1. Pada toolbar atas editor, klik tombol **"Pratinjau"** (ikon mata).
  2. Amati jendela modal yang muncul.
  3. Periksa tampilan judul, badge *Live Preview*, metrik jumlah kata, dan format konten.
  4. Klik tombol **X** di pojok kanan atas atau klik area luar modal untuk menutup.
* **Kriteria Keberhasilan**:
  * [ ] Modal pratinjau menampilkan materi dalam format *reader view* bersih tanpa toolbar dan tanpa form input.
  * [ ] Blok kode, callout, list, dan tabel tampil presisi seperti yang akan dilihat siswa di aplikasi.
  * [ ] Modal dapat ditutup dengan lancar tanpa lag.

---

### 8. TC-ED-08: Keyboard Shortcut & Tooltip Indication (Should-Have S-4)
* **Tujuan**: Memastikan pintasan keyboard ergonomis untuk mempercepat proses pembuatan konten.
* **Langkah Pengujian**:
  1. Arahkan kursor mouse (*hover*) di atas tombol **"Simpan"** di toolbar kanan $\rightarrow$ amati tooltip yang muncul.
  2. Lakukan perubahan kecil pada teks materi (misal tambah satu spasi).
  3. Tekan kombinasi tombol keyboard: `Ctrl + S` (atau `Cmd + S` di Mac).
* **Kriteria Keberhasilan**:
  * [ ] Muncul tooltip bertuliskan *"Simpan Materi (Ctrl+S)"*.
  * [ ] Menekan `Ctrl + S` langsung memicu penyimpanan materi (badge berubah menjadi `Menyimpan...` lalu `Tersimpan`).

---

### 9. TC-ED-09: AI Content Writing Assistant (Could-Have C-1)
* **Tujuan**: Membantu kreator merancang ringkasan atau latihan mandiri materi secara cepat.
* **Langkah Pengujian**:
  1. Pada toolbar atas editor, klik tombol **"AI Tulis"** (ikon bintang/Sparkles).
  2. Pada modal yang terbuka, klik opsi:
     **"Sisipkan Blok Contoh Kode"** (atau *"Sisipkan Rangkuman Kunci"*).
  3. Amati perubahan di editor teks.
* **Kriteria Keberhasilan**:
  * [ ] Modal AI Writing Assistant terbuka dengan 3 pilihan template cerdas.
  * [ ] Muncul animasi loader singkat, lalu blok konten terformat rapi otomatis tersisip ke dalam editor.
  * [ ] Muncul toast notifikasi sukses: *"Blok kode & tips berhasil disisipkan!"*.

---

### 10. TC-ED-10: Export Markdown (.md) & Copy Markdown (Could-Have C-2)
* **Tujuan**: Memungkinkan portabilitas materi ke format Markdown standar untuk arsip atau dibuka di editor luar (Obsidian/VS Code).
* **Langkah Pengujian**:
  1. Klik tombol tanda panah ke bawah (`ChevronDown`) di samping tombol Simpan.
  2. Klik opsi **"Download Markdown (.md)"**.
  3. Klik kembali dropdown tersebut dan pilih **"Salin sebagai Markdown"**.
  4. Buka Notepad, lalu tekan `Ctrl + V`.
* **Kriteria Keberhasilan**:
  * [ ] Browser otomatis mengunduh file `.md` dengan nama sesuai judul materi (misal: `pengenalan-python.md`).
  * [ ] Isi file markdown dan teks yang disalin ke clipboard terstruktur rapi dengan format `# Heading` dan paragraf lengkap.

---

## ✅ KESIMPULAN PENILAIAN
Jika seluruh poin di atas telah dicoba dan bertanda centang `[x]`, maka pembaruan **Visual & Ergonomi Lesson Editor Maguru** dinyatakan **LULUS & SIAP PRODUKSI**.
