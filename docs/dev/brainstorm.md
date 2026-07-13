# Pull Request: Pemutakhiran Pengelolaan Kuis Kreator & Agregasi Pre-test Dinamis

## Deskripsi Singkat
Pull Request ini bertujuan untuk menyederhanakan alur pembuatan kuis bagi Kreator serta memutakhirkan tampilan visual dashboard manajemen kuis agar lebih intuitif, interaktif, dan konsisten dengan sistem desain Maguru.

Kami mengubah sistem Pre-test (Ujian Penempatan Awal) agar tidak lagi memerlukan pembuatan soal secara terpisah. Pre-test kini dirakit secara dinamis oleh sistem dengan mengacak maksimal 40 soal dari kumpulan kuis Bab (Seksi) yang telah dibuat oleh kreator.

---

## Perubahan Utama

### 1. Agregasi Pre-test Dinamis (Tanpa Redudansi Data)
*   Kreator cukup fokus menulis soal di seksi Bab masing-masing.
*   Halaman Pre-test pada ruang kerja kreator diubah menjadi tampilan peninjauan (*read-only*) yang menampilkan seluruh daftar soal kuis se-kelas, lengkap dengan badge asal Bab soal tersebut. Tombol pembuatan soal baru dinonaktifkan di halaman ini untuk menghindari redudansi.
*   Penghitung jumlah soal Pre-test pada sidebar kiri kini secara dinamis menampilkan total akumulasi soal yang aktif se-kelas.

### 2. Peningkatan Visual Dashboard Kuis (Skeuomorphic & Konsisten)
*   **Widget Pengaturan Kuis**: Struktur pengaturan kuis (durasi, acak soal, pembahasan, dan status) diubah dari tampilan datar menjadi baris panel kontrol instrumen fisik (*debossed rows*). Ini memberikan ilusi kedalaman taktil yang estetis dan rapi.
*   **Ringkasan Tipe Soal**: Menggantikan grafik lingkaran SVG statis lama dengan diagram donat interaktif (*Donut Chart with Text*) resmi dari Shadcn Studio (Recharts). Grafik ini kini dilengkapi *hover tooltip* dan menampilkan total jumlah soal di bagian tengah lingkaran dengan gaya tipografi yang elegan.

### 3. Penyelarasan Logika Sistem (Backend)
*   API pencarian soal (`GET`), API penilaian hasil ujian (`POST submit`), dan API riwayat hasil belajar (`GET results`) disesuaikan agar mampu memetakan soal pre-test secara fleksibel langsung dari ID soal bab tanpa mengandalkan filter kolom kosong database (`sectionId: null`).
