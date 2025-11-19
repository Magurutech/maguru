# 📘 Description – A Closer Look at Description (Modul 4D Framework)

**Inti Materi**  
Description dalam konteks AI Fluency adalah keterampilan memberikan instruksi yang cukup jelas, detail, dan terarah sehingga AI bisa menghasilkan output yang relevan dengan tujuan kita.  
Kalau Delegation itu “siapa mengerjakan apa”, maka Description itu **“bagaimana cara kita menyampaikan apa yang harus dikerjakan”**.

### Prinsip Penting Description
- Spesifik dan kontekstual  
  Jelaskan siapa audiensnya, apa tujuan output, dan gaya yang diinginkan.  
  Contoh: Alih-alih “Buat cerita”, tulis “Buat cerita fiksi 500 kata bergenre petualangan untuk anak SD, dengan tokoh utama seekor kucing penjelajah”.

- Gunakan parameter yang jelas  
  Panjang teks, format (list, narasi, tabel), gaya bahasa (formal, santai, humoris), dan perspektif (orang pertama, ketiga).

- Berikan contoh referensi  
  AI akan bekerja lebih tepat jika diberi contoh hasil yang mirip dengan yang diinginkan.

- Iterasi dan refine  
  Awalnya beri instruksi umum → tinjau hasil → perbaiki instruksi. Proses ini seperti “mengasah” prompt.

### Tips Praktis
- Gunakan role prompting: Minta AI berperan sebagai editor, guru, penulis, dll.
- Sertakan constraints: batas kata, gaya, atau topik yang dilarang.
- Pisahkan instruksi menjadi poin-poin agar lebih jelas dibaca AI.
- Kalau hasil tidak sesuai, identifikasi bagian mana dari deskripsi yang perlu diperjelas, bukan hanya mengulang prompt yang sama.

### 3 Komponen Utama Description
1. **Product Description** (Deskripsi Produk)  
   Fokus: Apa yang harus AI hasilkan?  
   Pertanyaan kunci: “Apa hasil akhirnya?”

2. **Process Description** (Deskripsi Proses)  
   Fokus: Bagaimana AI harus mengerjakan tugas ini?  
   Pertanyaan kunci: “Langkah-langkahnya apa?”

3. **Performance Description** (Deskripsi Performa)  
   Fokus: Seberapa baik hasilnya harus dibuat?  
   Pertanyaan kunci: “Standar kualitasnya apa?”

### Penerapan Description pada Planning DevOps
Dalam tahap planning DevOps, Description yang jelas membantu AI menghasilkan:  
- User story yang tepat  
- Backlog grooming  
- Rancangan pipeline CI/CD  
- Dokumentasi teknis  

**Alur terbaik**: Kombinasi Description kuat di awal + iterasi/percakapan untuk penyempurnaan.

### Mini Quiz Description (Semua Jawaban Benar ✅)
- Description yang baik hanya perlu fokus pada format output, tidak perlu menjelaskan konteks. → **False**  
- Dalam DevOps, description yang detail dapat membantu AI membuat backlog atau pipeline yang lebih akurat. → **True**  
- Iterasi tidak diperlukan jika kita sudah membuat deskripsi yang sangat detail. → **False**  
- Menggunakan contoh referensi dapat meningkatkan akurasi hasil AI. → **True**  
- Description dan iterasi sebaiknya digunakan bersama dalam proses kerja dengan AI. → **True**

### Pertanyaan Tambahan & Jawaban
**Apakah semakin panjang deskripsi = semakin baik?**  
Tidak selalu. Yang penting adalah **relevansi dan kejelasan**. Deskripsi panjang tapi berulang atau tidak fokus justru bisa membuat AI bingung.  
Gunakan struktur: **Konteks → Tujuan → Batasan → Format Output**.

### Contoh Perbaikan Prompt Nyata (Fitur “Module Learning”)

**Prompt Asli (Kurang Efektif)**  
kita akan mengerjakan sebuah feature " Module Learning " , Jadi kita akan membuat course bertipe text , Module Learning emmungkinkan Guru untuk menuliskan Materi secaa bertahap dengan navigasi antar halaman yang jelas , ini mirip dengan feature page and blogs pada confluence https://confluence.atlassian.com/doc/pages-and-blogs-320602215.html  
user story , sebagai Guru, saya ingin menuiskan sebuah module materi dengan berbagai bab agar mahasiswa dapat mengakses amteri module tersebut

**Prompt Revisi (Efektif – Mengandung Product + Process + Performance)**  
Buat rancangan fitur “Module Learning” untuk platform pembelajaran online. Fitur ini memungkinkan guru menulis materi kursus berbentuk teks, dibagi menjadi beberapa bab atau sub-bab, dengan navigasi antar halaman yang jelas.  

Gunakan referensi konsep dari Pages dan Blogs di Confluence[](https://confluence.atlassian.com/doc/pages-and-blogs-320602215.html), khususnya pada struktur halaman, navigasi, dan pengelompokan konten.  

Sertakan:  
- Deskripsi fitur: fungsi utama dan manfaatnya  
- User flow dari sisi guru (membuat, mengedit, menerbitkan) dan sisi mahasiswa (mengakses, membaca, menavigasi)  
- Struktur modul dalam bentuk contoh hierarki bab/sub-bab  
- Desain navigasi (tabel atau diagram sederhana)  
- Contoh UI wireframe dalam bentuk deskripsi teks  

Tulis dengan gaya formal, jelas, dan terstruktur. Target panjang: minimal 800 kata.

*(Materi Description sudah lengkap dengan prinsip, 3 komponen utama, contoh nyata, dan perbaikan prompt. Siap dilanjutkan ke modul berikutnya: Discernment atau latihan praktis lebih lanjut sesuai alur course.)*