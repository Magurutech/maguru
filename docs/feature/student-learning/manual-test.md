# 🧪 Rencana & Panduan Uji Manual (Manual Testing Checklist)
## Fitur: Sistem Pembelajaran Siswa (Student Learning Experience & Course Reader)

Dokumen ini merupakan panduan skenario pengujian manual langkah-demi-langkah (*step-by-step manual test plan*) untuk memvalidasi seluruh fungsionalitas inti, fitur *Must Have*, dan fitur *Should Have* yang diimplementasikan pada **Sistem Pembelajaran Siswa**.

---

## 1. Prasyarat & Lingkungan Uji (Test Pre-conditions)

1. **Perangkat & Peramban**: Desktop atau Tablet dengan resolusi $\ge 768\text{px}$ (Chrome / Firefox / Edge / Safari).
2. **Kondisi Pengguna**:
   - Akun siswa terdaftar dan memiliki sesi login aktif.
   - Skenario pengujian sesi kedaluwarsa memerlukan kemampuan menghapus cookie sesi di DevTools Application.
3. **Data Uji Kursus**:
   - Satu kursus dengan status `PUBLISHED` (misal slug: `python-dasar`).
   - Kursus memiliki minimal 2 Seksi:
     - **Seksi 1**: Berisi minimal 3 pelajaran teks + kuis seksi.
     - **Seksi 2**: Berisi minimal 2 pelajaran (status terkunci secara default).

---

## 2. Matriks Kasus Uji Manual (Manual Test Cases)

### TC-01: Auto-Resume & Sinkronisasi LocalStorage [x]

| ID Kasus Uji | TC-01 |
| :--- | :--- |
| **Deskripsi** | Memvalidasi bahwa siswa secara cerdas diarahkan ke materi terakhir yang pernah dibuka atau materi belum tuntas pertama kali. |
| **Prasyarat** | Kursus telah memiliki beberapa pelajaran yang terselesaikan. |

**Langkah-Langkah Pengujian:**
1. Masuk ke halaman `/course/python-dasar/learn` tanpa parameter query `?lesson=`.
2. Amati pelajaran mana yang otomatis terbuka dan aktif di sidebar:
   - *Ekspektasi 1 (Belum ada riwayat localStorage)*: Sistem secara otomatis memilih pelajaran pertama yang **belum selesai** di seksi yang terbuka.
3. Klik pelajaran di Seksi 1 Bab 3 (misal ID: `lesson-103`).
4. Buka tab baru di browser atau lakukan *hard refresh* (`Ctrl + F5`) pada URL `/course/python-dasar/learn` (hapus parameter `?lesson=` dari address bar).
5. Amati pelajaran yang dimuat saat halaman selesai dimuat:
   - *Ekspektasi 2 (Ada riwayat localStorage)*: Halaman langsung melakukan auto-resume ke `lesson-103` dan URL otomatis tersinkronisasi menjadi `?lesson=lesson-103`.
6. Buka DevTools (`F12`) ➔ *Application* ➔ *Local Storage*:
   - Pastikan terdapat kunci `maguru_last_lesson_python-dasar` bernilai `lesson-103`.

---

### TC-02: True Optimistic Update & Snapshot Rollback [x]

| ID Kasus Uji | TC-02 |
| :--- | :--- |
| **Deskripsi** | Menguji kecepatan pembaruan UI secara instan (optimistis) dan ketahanan *rollback* saat terjadi kegagalan jaringan. |
| **Prasyarat** | Berada pada pelajaran aktif yang belum bertanda centang selesai. |

**Skenario A: Penyelesaian Berhasil (Happy Path)**
1. Klik tombol **"Tandai Selesai"** di bagian navigasi bawah.
2. Amati perubahan visual seketika:
   - *Ekspektasi*:
     - Ikon pada tombol seketika berganti menjadi centang hijau `✓ Selesai Dipelajari`.
     - Persentase pada `ProgressBar` langsung bertambah tanpa menunggu jeda jaringan.
     - Lingkaran status di sidebar `CourseNavigation` seketika menyala hijau.
     - Notifikasi toast mengambang Sonner muncul: `"Pelajaran berhasil diselesaikan!"`.

**Skenario B: Kegagalan Jaringan & Rollback Snapshot**
1. Buka DevTools (`F12`) ➔ tab *Network* ➔ pilih status **Offline**.
2. Klik tombol **"Tandai Selesai"** pada pelajaran lain yang belum selesai.
3. Amati respons antarmuka:
   - *Ekspektasi*:
     - State awalnya bertambah secara optimis, namun dalam hitungan detik sistem mendeteksi kegagalan fetch.
     - State UI otomatis di-*rollback* kembali ke kondisi belum selesai (centang hijau dibatalkan dan persentase progress kembali ke angka semula).
     - Muncul notifikasi toast merah dari Sonner: `"Gagal menyelesaikan pelajaran"`.
     - Halaman tidak mengalami *crash* atau *blank screen*.

---

### TC-03: Penanganan Sesi Login Kedaluwarsa (HTTP 401 Unauthorized) [x]

| ID Kasus Uji | TC-03 |
| :--- | :--- |
| **Deskripsi** | Memvalidasi bahwa aplikasi memberikan pesan terarah saat token auth kedaluwarsa saat siswa sedang belajar. |
| **Prasyarat** | Berada di halaman materi pelajaran. |

**Langkah-Langkah Pengujian:**
1. Buka DevTools (`F12`) ➔ *Application* ➔ *Cookies*.
2. Hapus cookie auth Supabase (`sb-access-token` / `sb-refresh-token`).
3. Klik tombol **"Tandai Selesai"** pada materi aktif.
4. Amati respons antarmuka:
   - *Ekspektasi*:
     - State optimis langsung dibatalkan secara bersih (*rollback*).
     - Muncul notifikasi toast merah dari Sonner dengan pesan jelas:
       `"Sesi login telah berakhir. Silakan login kembali untuk menyimpan kemajuan."`

---

### TC-04: Tombol Dedikasi "Tandai Selesai" & Kontrol Navigasi [x]

| ID Kasus Uji | TC-04 |
| :--- | :--- |
| **Deskripsi** | Menguji fungsionalitas dan ergonomi bar navigasi bawah `LessonNavigation`. |

**Langkah-Langkah Pengujian:**
1. Periksa baris navigasi di bawah materi:
   - Sisi kiri: Tombol **"Sebelumnya: [Judul Bab]"** (disabled jika di materi terawal).
   - Bagian tengah: Tombol dedikasi **"Tandai Selesai"**.
   - Sisi kanan: Tombol **"Selanjutnya: [Judul Bab]"** atau **"Ambil Kuis Seksi"**.
2. Klik tombol "Tandai Selesai":
   - Tombol berganti status menjadi berlatar hijau muda dengan border emerald bertuliskan `"Selesai Dipelajari"`.
3. Klik tombol "Selanjutnya" pada pelajaran yang belum berstatus selesai:
   - Sistem secara otomatis menandai pelajaran saat ini sebagai selesai sebelum berpindah ke pelajaran berikutnya.

---

### TC-05: Estimasi Waktu Membaca & Penghitung Kata [x]

| ID Kasus Uji | TC-05 |
| :--- | :--- |
| **Deskripsi** | Memvalidasi kalkulasi otomatis estimasi durasi bacaan pada `LessonViewer`. |

**Langkah-Langkah Pengujian:**
1. Buka pelajaran dengan teks ringkas (~60 kata):
   - Amati badge di bawah judul materi:
   - *Ekspektasi*: Menampilkan badge `⏱️ 1 min baca` dan `60 kata`.
2. Buka pelajaran dengan materi tutorial panjang (~600 kata):
   - Amati badge di bawah judul materi:
   - *Ekspektasi*: Menampilkan badge `⏱️ 3 min baca` dan `600 kata`.
3. Pastikan badge memiliki kontras teks yang jelas baik pada mode terang (*parchment*) maupun mode gelap (*dark mode*).

---

### TC-06: Pintasan Navigasi Keyboard (Ergonomi Tablet & Desktop) [x]

| ID Kasus Uji | TC-06 |
| :--- | :--- |
| **Deskripsi** | Menguji kendali navigasi cepat menggunakan keyboard tanpa mouse. |

**Langkah-Langkah Pengujian:**
1. Klik pada area baca materi (fokus umum window).
2. Tekan kombinasi tombol `Alt + Panah Kanan`:
   - *Ekspektasi*: Viewport berpindah ke pelajaran selanjutnya secara instan.
3. Tekan kombinasi tombol `Alt + Panah Kiri`:
   - *Ekspektasi*: Viewport kembali ke pelajaran sebelumnya.
4. Klik kursor ke dalam textarea atau input pencarian (fokus form):
5. Tekan `Alt + Panah Kanan`:
   - *Ekspektasi*: Pintasan tidak memicu perpindahan pelajaran (tidak menginterupsi aktivitas mengetik).

---

### TC-07: Selebrasi Kelulusan Kursus 100% (CourseCompletionModal) [x]

| ID Kasus Uji | TC-07 |
| :--- | :--- |
| **Deskripsi** | Menguji kemunculan dialog perayaan kelulusan saat progres mencapai 100%. |
| **Prasyarat** | Menyelesaikan seluruh materi pelajaran dan kuis hingga progress bar mencapai 100%. |

**Langkah-Langkah Pengujian:**
1. Tandai pelajaran terakhir hingga progres kursus mencapai 100%.
2. Amati respons layar:
   - *Ekspektasi*:
     - Muncul dialog modal selebrasi `CourseCompletionModal` di tengah layar dengan animasi piala memantul (*bouncing trophy*) dan partikel cahaya.
     - Kartu statistik menampilkan: `100% Progres Belajar` dan total materi yang berhasil diselesaikan.
3. Klik tombol **"Kembali ke Katalog Kursus"**:
   - Pengguna diarahkan ke rute `/course`.
4. Buka kembali halaman `/course/python-dasar/learn`:
   - Klik tombol **"Tutup & Tinjau Kembali Materi"**:
   - Modal tertutup dan tidak muncul kembali secara agresif selama sesi belajar aktif berlangsung (*dismiss flag active*).

---

### TC-08: Eksekusi Kode In-Browser (Pyodide & Sandbox) [x]

| ID Kasus Uji | TC-08 |
| :--- | :--- |
| **Deskripsi** | Menguji eksekusi kode interaktif di browser dan proteksi perulangan tak hingga (*infinite loop*). |

**Langkah-Langkah Pengujian:**
1. Temukan blok kode Python di materi bertuliskan:
   ```python
   nama = "Maguru"
   print(f"Selamat belajar, {nama}!")
   ```
2. Klik tombol **"Jalankan"**:
   - Tombol berubah menjadi spinner `Menjalankan...`.
   - Laci terminal bawah terbuka menampilkan teks hijau:
     `Selamat belajar, Maguru!`
     dan badge waktu eksekusi: `Selesai (15ms)`.
3. Klik ikon salin kode di kanan atas blok kode:
   - Ikon berubah menjadi tanda centang hijau `"Tersalin"` selama 2 detik.
4. Pada blok kode JavaScript, ubah atau jalankan kode perulangan tak terbatas:
   ```javascript
   while(true) {}
   ```
5. Klik **"Jalankan"**:
   - *Ekspektasi*: Dalam tepat 5000ms, eksekusi dibatalkan paksa dan terminal menampilkan pesan error:
     `"Waktu eksekusi melebihi batas (Timeout 5000ms)"`.
   - Tab peramban tidak mengalami *freezing / crash*.

---

### TC-09: Adaptive Section Gating & Pre-Test Enforcement [x]

| ID Kasus Uji | TC-09 |
| :--- | :--- |
| **Deskripsi** | Memvalidasi aturan penguncian seksi berdasar evaluasi kuis awal dan kuis seksi. |

**Langkah-Langkah Pengujian:**
1. Buka kursus baru yang belum pernah dikerjakan Pre-Test:
   - Seluruh daftar bab di sidebar terkunci dengan ikon gembok.
   - Layar utama otomatis menampilkan antarmuka kuis diagnostik `AssessmentPage`.
2. Kerjakan dan kirimkan Pre-Test:
   - Layar menampilkan hasil skor evaluasi dan tombol "Lanjut Belajar".
   - Silabus seksi 1 terbuka penuh.
3. Buka pelajaran terakhir di Seksi 1:
   - Tombol di baris navigasi bawah menampilkan tombol oranye: `"Ambil Kuis Seksi: [Judul Seksi 1]"`.
4. Kerjakan kuis seksi dengan skor di bawah 70 (misal: 50):
   - Seksi 2 tetap berstatus **Terkunci** di sidebar dan tombol menawarkan "Ulangi Kuis".
5. Kerjakan kuis seksi dengan skor $\ge 70$ (misal: 80):
   - Kunci Seksi 2 otomatis terbuka (`isLocked = false`) dan materi di Seksi 2 dapat diakses oleh siswa.

---

### TC-10: Pengulangan Kuis Seksi, Batas 2x Percobaan, Cooldown 1 Jam & Preservasi Skor [x]

| ID Kasus Uji | TC-10 |
| :--- | :--- |
| **Deskripsi** | Memvalidasi alur pengulangan kuis (*Retake Quiz*), penegakan batas maksimal 2x percobaan berurutan, proteksi anti-spam jeda 1 jam (*Cooldown*), dan retensi nilai tertinggi (*Best Score Preservation*). |
| **Prasyarat** | Berada di bab terakhir Seksi 1 yang seluruh materinya telah selesai dipelajari. |

**Langkah-Langkah Pengujian:**
1. Klik tombol **"Ambil Kuis Seksi"** pada materi terakhir Seksi 1.
2. Amati header kuis pada kartu soal:
   - *Ekspektasi*: Menampilkan badge `Percobaan 1/2`.
3. Kerjakan kuis dengan skor gagal (misal: 50% / di bawah 70%):
   - Kirimkan jawaban.
   - Amati halaman hasil: Seksi 2 tetap **Terkunci**. Tampil tombol **"Coba Lagi"**.
4. Klik tombol **"Coba Lagi"**:
   - Sistem memuat ulang soal tanpa melempar error `ALREADY_COMPLETED`.
   - Header kuis kini menampilkan badge peringatan oranye: `Percobaan 2/2 (Terakhir)`.
   - Urutan pertanyaan dan pilihan jawaban teracak ulang (*randomized*).
5. Kerjakan kuis kedua dengan skor lebih rendah (misal: 40%):
   - Kirimkan jawaban.
   - Amati data evaluasi:
     - *Best Score Preservation*: Skor tertinggi tetap dipertahankan pada **50%** (tidak turun ke 40%).
     - Sistem mendeteksi batas 2x percobaan tercapai dan memicu **Cooldown 1 Jam**.
6. Coba klik tombol "Ulangi Kuis" atau akses kuis bab ini kembali:
   - *Ekspektasi*:
     - Layar menampilkan antarmuka ramah **"Masa Jeda Belajar Aktif (Cooldown)"** dengan ikon jam berdenyut.
     - Tampil perkiraan sisa waktu: `⏱️ ~60 Menit`.
     - Tampil pesan bimbingan agar siswa membaca kembali materi bab sebelum mencoba kuis berikutnya.
     - Panggilan API mengembalikan status `HTTP 429 Too Many Requests`.
7. Setelah masa jeda 1 jam terlewati (atau diselesaikan dengan skor $\ge 70\%$ pada percobaan ke-2):
   - Status kelulusan tercapai dan Seksi 2 otomatis terbuka penuh (`isLocked = false`).

---

## 3. Lembar Hasil Pengujian (Acceptance Sign-Off)

| Kode Kasus Uji | Fitur yang Diuji | Hasil Pengujian (Pass / Fail) | Catatan / Tester |
| :--- | :--- | :---: | :--- |
| **TC-01** | Auto-Resume & LocalStorage Sync | `[ PASS ]` | Teruji pada integrasi hook `LearnContext` |
| **TC-02** | True Optimistic Update & Rollback | `[ PASS ]` | Teruji pada unit & integrasi `useProgressHandlers` |
| **TC-03** | Deteksi Sesi Login 401 Expired | `[ PASS ]` | Teruji pada penanganan status HTTP 401 |
| **TC-04** | Tombol Dedikasi "Tandai Selesai" | `[ PASS ]` | Teruji pada komponen `LessonNavigation` |
| **TC-05** | Estimasi Waktu Baca & Kata | `[ PASS ]` | Teruji pada komponen `LessonViewer` |
| **TC-06** | Pintasan Navigasi Keyboard | `[ PASS ]` | Teruji pada window listener `LearnPageInner` |
| **TC-07** | Modal Selebrasi Kelulusan 100% | `[ PASS ]` | Teruji pada `CourseCompletionModal` |
| **TC-08** | Eksekusi Kode Pyodide & Sandbox | `[ PASS ]` | Teruji pada WebAssembly runner & timeout guard |
| **TC-09** | Adaptive Section Gating | `[ PASS ]` | Teruji pada aturan kuis $\ge 70\%$ dan Pre-Test |
| **TC-10** | Retake Quiz, 2x Limit & 1h Cooldown | `[ PASS ]` | Teruji pada questions/submit API, AssessmentPage & Best Score |

