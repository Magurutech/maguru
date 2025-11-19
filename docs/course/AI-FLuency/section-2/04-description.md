Baik, kita masuk ke topik "Description – A Closer Look at Description" dari Anthropic AI Fluency.

Inti Materi
Description dalam konteks AI Fluency adalah keterampilan memberikan instruksi yang cukup jelas, detail, dan terarah sehingga AI bisa menghasilkan output yang relevan dengan tujuan kita.
Kalau Delegation itu "siapa mengerjakan apa", maka Description itu "bagaimana cara kita menyampaikan apa yang harus dikerjakan".

Prinsip Penting Description
Spesifik dan kontekstual

Jelaskan siapa audiensnya, apa tujuan output, dan gaya yang diinginkan.

Contoh: Alih-alih menulis "Buat cerita", tulis "Buat cerita fiksi 500 kata bergenre petualangan untuk anak SD, dengan tokoh utama seekor kucing penjelajah".

Gunakan parameter yang jelas

Panjang teks, format (list, narasi, tabel), gaya bahasa (formal, santai, humoris), dan perspektif (orang pertama, ketiga).

Berikan contoh referensi

AI akan bekerja lebih tepat jika diberi contoh hasil yang mirip dengan yang diinginkan.

Iterasi dan refine

Awalnya beri instruksi umum → tinjau hasil → perbaiki instruksi.

Proses ini seperti “mengasah” prompt agar AI lebih tepat sasaran.

Tips Praktis
Gunakan role prompting: Minta AI berperan sebagai editor, guru, penulis, dll.

Sertakan constraints: batas kata, gaya, atau topik yang dilarang.

Pisahkan instruksi menjadi poin-poin agar lebih jelas dibaca AI.

Kalau hasil tidak sesuai, identifikasi bagian mana dari deskripsi yang perlu diperjelas, bukan hanya mengulang prompt yang sama.

Kalau mau, aku bisa buatkan quiz singkat untuk menguji pemahamanmu tentang Description seperti yang kita lakukan di topik sebelumnya.
Apakah mau langsung kita buatkan quiz-nya sekarang?

iya, dan sebaiknya tambahakn latihan atau quiz singkat di setiap sesi chat agar melatih pemahaman saya tentang topik ini. saya ingin bertanya,

Bagaimaan Descripsi ini bekerja pada tahap planning DevOps ?

apakah lebih baik menggunakan descripsi? atau melakukan iterasi atau percakapan agar AI dan human dapat memiliki pemahaman yang sama ?

Oke, kita jawab satu per satu.

1. Bagaimana Description bekerja pada tahap planning DevOps?
   Dalam DevOps Planning, Description berperan besar di tahap mendefinisikan kebutuhan (requirements definition) dan task detailing.

Saat kita menugaskan AI untuk membantu membuat user story, backlog, atau rancangan pipeline, deskripsi yang jelas memastikan AI:

Mengerti scope proyek (apa yang masuk dan tidak masuk).

Mengetahui konteks bisnis dan technical constraints.

Dapat menghasilkan draft plan yang sesuai standar tim.

Contoh:

Prompt kurang jelas:

Buat rencana CI/CD.

Prompt jelas dan deskriptif:

Buat rencana CI/CD untuk aplikasi web React + Node.js, dengan deploy ke AWS Elastic Beanstalk, integrasi testing menggunakan Jest, dan langkah-langkah rollback jika gagal build. Sertakan diagram pipeline.

Hasil dari deskripsi ini akan jauh lebih mendekati yang dibutuhkan tim DevOps, sehingga mengurangi revisi.

2. Apakah lebih baik menggunakan description, atau melakukan iterasi/percakapan?
   Jawabannya kombinasi.

Description yang kuat di awal → menghemat waktu dan memberi AI arah yang tepat.

Iterasi & percakapan → untuk menyempurnakan, menyesuaikan, dan mengklarifikasi detail yang belum terpikir di awal.

Alurnya seperti ini:

Mulai dengan deskripsi yang jelas → agar AI punya starting point yang akurat.

Review hasil AI → identifikasi bagian yang kurang tepat.

Iterasi → tambah detail, koreksi asumsi, atau ubah gaya output.

Pendekatan ini mirip agile sprint: mulai dengan rencana jelas, lalu perbaiki lewat feedback loop.

📌 Mini Quiz – A Closer Look at Description
Pilih True / False:

Description yang baik hanya perlu fokus pada format output, tidak perlu menjelaskan konteks.

Dalam DevOps, description yang detail dapat membantu AI membuat backlog atau pipeline yang lebih akurat.

Iterasi tidak diperlukan jika kita sudah membuat deskripsi yang sangat detail.

Menggunakan contoh referensi dapat meningkatkan akurasi hasil AI.

Description dan iterasi sebaiknya digunakan bersama dalam proses kerja dengan AI.

Kalau mau, setelah kamu jawab quiz ini, aku bisa buatkan latihan praktis Description untuk simulasi di konteks DevOps Planning.
Mau aku siapkan juga?

Jawab

false

true

false

true

true

question = apakah semakian panjang descripsi yang di berikan akan semakin baik atau malah semakin ambigu?

Jawaban quiz kamu benar semua ✅

Menjawab pertanyaan:
Apakah semakin panjang deskripsi yang diberikan akan semakin baik atau malah semakin ambigu?

Jawaban:
Tidak selalu semakin panjang = semakin baik.

Yang penting adalah relevansi dan kejelasan.

Deskripsi yang panjang tapi penuh detail tidak relevan atau berulang justru bisa membuat AI bingung atau salah fokus.

Sebaliknya, deskripsi ringkas tapi tepat sasaran dan mencakup konteks, tujuan, batasan, serta format output → akan menghasilkan hasil yang optimal.

Tips praktis:

Gunakan struktur Konteks → Tujuan → Batasan → Format Output.

Sertakan contoh jika ada standar atau gaya yang harus diikuti.

Contoh:
❌ Panjang tapi membingungkan

Tolong buat skrip yang bagus untuk deployment aplikasi saya. Oh ya aplikasinya pakai React dan Node.js, tapi mungkin nanti bisa berubah ke Vue.js. Bisa tolong kasih banyak opsi? Pokoknya jangan terlalu rumit tapi harus lengkap, walau mungkin ada fitur yang belum jelas.

✅ Ringkas & jelas

Buat rencana deployment untuk aplikasi React + Node.js ke AWS Elastic Beanstalk, sertakan langkah build, test menggunakan Jest, dan rollback jika build gagal. Output dalam bentuk daftar langkah berurutan.

Kalau mau, aku bisa buatkan latihan singkat untuk melatih kamu membedakan deskripsi yang efektif vs. deskripsi yang ambigu, biar makin paham cara menulis prompt deskriptif.
Kita lanjut ke latihan itu?

3 compoentn utama Deskripsi – Deskripsi produk, Deskripsi process, Deskripsi performance

Benar, kita belum membahas 3 komponen utama Deskripsi di materi AI-Fluency.
Kalau merujuk ke topik "Description — A Closer Look at Description", kerangka ini membagi deskripsi menjadi tiga jenis utama:

1. Product Description (Deskripsi Produk)
   Fokus: Menjelaskan hasil akhir yang diinginkan.

Pertanyaan kunci: “Apa yang harus AI hasilkan?”

Contoh:

“Buat artikel 800 kata tentang energi surya untuk siswa SMA, dengan bahasa mudah dimengerti dan dilengkapi ilustrasi grafik.”

Tujuan: Memberikan gambaran jelas bentuk dan format output.

2. Process Description (Deskripsi Proses)
   Fokus: Menjelaskan langkah-langkah atau metode untuk mencapai hasil.

Pertanyaan kunci: “Bagaimana AI harus mengerjakan tugas ini?”

Contoh:

“Gunakan langkah berikut: 1) Buat outline artikel, 2) Tulis draft berdasarkan outline, 3) Revisi agar mudah dibaca.”

Tujuan: Mengarahkan alur kerja AI agar sesuai ekspektasi.

3. Performance Description (Deskripsi Performa)
   Fokus: Menjelaskan standar kualitas atau tolak ukur keberhasilan.

Pertanyaan kunci: “Seberapa baik hasilnya harus dibuat?”

Contoh:

“Artikel harus mendapatkan skor keterbacaan Flesch 60+ dan lolos pemeriksaan fakta minimal 95% akurat.”

Tujuan: Menetapkan level kualitas atau kriteria evaluasi.

💡 Intinya:

Product = What (hasil)

Process = How (cara)

Performance = How well (kualitas)

Kalau kamu mau, aku bisa bikin latihan cepat: aku akan kasih contoh prompt, dan kamu tentukan apakah itu Product, Process, atau Performance Description.
Kita buat 5 soal supaya konsepnya langsung nempel.

Mau aku buatkan latihannya sekarang?

Baiklah , ronde selanjutnya

saya memiliki prompt seperit ini

kita akan mengerjakan sebuah feature " Module Learning " , Jadi kita akan membuat course bertipe text , Module Learning emmungkinkan Guru untuk menuliskan Materi secaa bertahap dengan navigasi antar halaman yang jelas , ini mirip dengan feature page and blogs pada confluence https://confluence.atlassian.com/doc/pages-and-blogs-320602215.html

user story , sebagai Guru, saya ingin menuiskan sebuah module materi dengan berbagai bab agar mahasiswa dapat mengakses amteri module tersebut "

Oke, ini contoh prompt buruk yang memang perlu dirapikan.
Sekarang kita bedah dulu kekurangannya berdasarkan Deskripsi Produk – Proses – Performa:

Masalah pada prompt asli
Deskripsi Produk

Ada ide fitur (“Module Learning”) tapi belum ada detail output yang diminta dari AI.

Campuran penjelasan konsep + user story, tapi belum jelas apakah ingin spesifikasi teknis, wireframe, atau rancangan UX.

Ada referensi ke Confluence, tapi tidak dijelaskan bagian mana yang mau diadaptasi.

Proses

Tidak ada instruksi langkah demi langkah yang harus AI ikuti.

Tidak ada batasan atau format jawaban.

Performa

Tidak ada ukuran kualitas: level detail, jumlah halaman modul, contoh navigasi, atau gaya penulisan.

Prompt versi revisi
Buat rancangan fitur “Module Learning” untuk platform pembelajaran online. Fitur ini memungkinkan guru menulis materi kursus berbentuk teks, dibagi menjadi beberapa bab atau sub-bab, dengan navigasi antar halaman yang jelas.

Gunakan referensi konsep dari Pages dan Blogs di Confluence (https://confluence.atlassian.com/doc/pages-and-blogs-320602215.html ), khususnya pada struktur halaman, navigasi, dan pengelompokan konten.

Sertakan:

Deskripsi fitur: fungsi utama dan manfaatnya.

User flow dari sisi guru (membuat, mengedit, menerbitkan) dan sisi mahasiswa (mengakses, membaca, menavigasi).

Struktur modul dalam bentuk contoh hierarki bab/sub-bab.

Desain navigasi (tabel atau diagram sederhana).

Contoh UI wireframe dalam bentuk deskripsi teks.

Tulis dengan gaya formal, jelas, dan terstruktur. Target panjang: minimal 800 kata.

Kalau mau, kita bisa langsung coba menjalankan versi revisi ini untuk melihat bedanya hasilnya dibanding kalau kita jalankan prompt mentahmu tadi.
Mau kita uji langsung?
