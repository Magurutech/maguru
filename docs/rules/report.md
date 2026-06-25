Apa Itu Storage Egress dan Shared Pooler Egress?

Storage Egress:
Data yang dikirim keluar ketika pengguna/client mengunduh file dari Supabase Storage (gambar, video, dokumen, dll). Ini termasuk semua traffic saat mengakses aset melalui SDK atau URL langsung.
Shared Pooler Egress:
Data yang dikirim ke client ketika Anda menggunakan Shared Connection Pooler (Supavisor) untuk mengakses database.
Supabase menggunakan pooler ini untuk mengelola koneksi database secara efisien. Semua hasil query database yang melewati shared pooler dihitung sebagai Shared Pooler Egress (bukan Database Egress biasa, agar tidak double counting).

Mengapa Shared Pooler Egress Bisa Sangat Tinggi (1 GB dalam Sehari) Padahal Hanya Mengakses Web Beberapa Kali?
Ini adalah keluhan umum pengguna Supabase Free Plan. Penyebab utama biasanya:

Query yang mengembalikan data dalam jumlah besar (misalnya .select('*') pada tabel yang sudah punya banyak baris).
Looping atau polling berulang di kode aplikasi (contoh: fetch data setiap detik, refresh otomatis, atau infinite scroll tanpa batas).
Connection leak atau terlalu banyak koneksi yang tidak ditutup dengan benar.
Tools pihak ketiga, background job, atau script yang berjalan tanpa disadari dan terus mengambil data besar.
Pada shared pooler, bahkan query sederhana yang sering dijalankan bisa menghasilkan egress tinggi jika hasil datanya besar.


Analisis Penyebab Tingginya Shared Pooler Egress
Terima kasih telah membagikan file Query Performance.csv. Saya telah menganalisisnya secara mendalam. Berikut penjelasan yang jelas dan terstruktur.
Penyebab Utama Shared Pooler Egress Tinggi
Shared Pooler Egress mencatat semua data yang dikirim kembali ke aplikasi/client Anda melalui Supavisor (Shared Connection Pooler). Semakin banyak baris data (rows_read) yang dikembalikan oleh query, semakin besar egress-nya.
Dari data yang Anda berikan, berikut masalah utamanya:

Query yang Mengembalikan Jumlah Baris Sangat Besar
Query pada tabel transaksi:
Satu query mengembalikan 2.002.888 rows (total).
Query lain mengembalikan 3.176.112 rows (total).

Ini sangat signifikan. Meskipun setiap query menggunakan OFFSET + LIMIT, jika aplikasi memanggilnya berkali-kali (misalnya saat pagination, refresh halaman, atau search), total data yang dikirim keluar menjadi sangat besar.

Query yang Terlalu Sering Dijalankan:
Beberapa query dipanggil ribuan kali (contoh: 8.685 kali, 13.144 kali, 10.450 kali).
Query pada transaksi_item, product_sizes, Product, dan kasir juga berkontribusi.

Select Kolom Terlalu Banyak:
Beberapa query menggunakan SELECT * atau mencantumkan hampir semua kolom (termasuk description, catatan, data JSON, dll). Ini membuat setiap baris menjadi lebih "berat" (lebih banyak byte).

Kemungkinan Lain:
Looping atau polling di sisi aplikasi (frontend/backend) yang memanggil query berulang kali.
Tidak ada caching yang efektif di aplikasi.
Background process atau tool pihak ketiga yang terus mengambil data.


Meskipun Anda merasa hanya mengakses web beberapa kali, satu query yang mengembalikan data besar dan dipanggil sering sudah cukup menyebabkan egress mencapai 1 GB dalam sehari.



Cara Pencegahan dan Optimalisasi
Berikut langkah konkret yang harus dilakukan:
1. Perbaiki Query yang Bermasalah (Prioritas Tinggi)

Hindari SELECT * → Pilih hanya kolom yang benar-benar dibutuhkan.
Tambahkan Pagination yang Ketat (LIMIT + OFFSET yang benar).
Gunakan Filter yang Lebih Spesifik (WHERE clause yang ketat).
Tambahkan Index pada kolom yang sering difilter atau diurutkan (tglMulai, createdAt, status, produkId, dll).

Contoh perbaikan untuk query transaksi:
SQL-- Sebelum (buruk)
SELECT * FROM transaksi WHERE ... OFFSET ... 

-- Sesudah (baik)
SELECT id, kode, status, tglMulai, totalHarga, sisaBayar 
FROM transaksi 
WHERE status = 'aktif' 
ORDER BY createdAt DESC 
LIMIT 20 OFFSET 0;
2. Optimasi di Sisi Aplikasi

Implementasikan caching (React Query, SWR, Redis, atau Supabase Edge Functions dengan cache).
Gunakan Infinite Scroll atau Server-Side Pagination yang efisien.
Hindari fetch data besar saat halaman dimuat (gunakan lazy loading).
Batasi refresh otomatis / polling.

3. Monitoring dan Diagnosis Lanjutan

Di Supabase Dashboard:
Buka Query Performance → Urutkan berdasarkan rows_read atau total_time.
Cek Logs Explorer → Lihat "Top Paths" dan request yang paling sering.
Periksa API Routes yang paling banyak mengonsumsi egress.

Aktifkan Index Advisor jika belum.