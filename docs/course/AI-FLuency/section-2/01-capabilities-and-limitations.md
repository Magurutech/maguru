---
title: "AI Capabilities & Limitations: Understanding What AI Can and Cannot Do"
description: "Menganalisis kekuatan dan batasan Generative AI serta strategi untuk mengatasi keterbatasan tersebut"
contentType: "markdown"
duration: "25 menit"
order: 1
---

# 📘 Deep Dive 1: Capabilities & Limitations Generative AI (Part 2)

## Capabilities (Kekuatan) Generative AI
- Membuat teks, kode, gambar, audio, video dari nol atau memodifikasi konten yang ada.  
  Contoh: membuat PRD, menulis boilerplate code, generate dokumentasi.
- Bisa meniru gaya bahasa, menyesuaikan format dokumen, bahkan menulis ulang sesuai audiens.
- Mengerti konteks percakapan (walau tidak memahami seperti manusia) dan memanfaatkan pengetahuan yang dilatih.
- Bisa brainstorming, merangkum, membuat instruksi, atau memecah masalah menjadi langkah-langkah.
- Asisten multi-task lintas domain.

## Limitations (Batasan) Generative AI
- Tidak benar-benar mengerti → hanya memprediksi output paling mungkin → bisa menghasilkan jawaban yang tampak benar tapi salah (hallucination).
- Data latih terbatas waktu → tidak selalu punya informasi terbaru kecuali dihubungkan dengan real-time search.
- Sangat sensitif pada prompt → output sangat bergantung pada bagaimana pertanyaannya disusun.
- Bisa mewarisi bias & kualitas data latih.
- Tidak punya penilaian moral atau tujuan → keputusan “baik” atau “buruk” datang dari manusia, bukan AI.

### Tabel Capabilities vs Limitations

| Capabilities (Kekuatan)                                      | Limitations (Batasan)                                              |
|--------------------------------------------------------------|--------------------------------------------------------------------|
| Membuat teks, kode, gambar, audio, video baru                | Bisa menghasilkan jawaban salah walau terdengar meyakinkan (hallucination) |
| Menyesuaikan gaya, format, atau bahasa sesuai audiens        | Pengetahuan terbatas sampai tanggal data latih                     |
| Memahami konteks percakapan secara statistical              | Sangat tergantung pada kualitas dan kejelasan prompt               |
| Memecah masalah jadi langkah-langkah, brainstorming ide     | Bisa mewarisi bias dari data latih                                 |
| Menyediakan bantuan multi-task lintas domain                 | Tidak punya pemahaman atau penilaian moral seperti manusia        |

### Cara Improve Limitations – Versi Detail

#### 1. Hallucination
Masalah: Model menciptakan fakta yang tidak benar, tetapi disajikan seolah benar.  
Kenapa terjadi: Model hanya memprediksi kata berikutnya berdasarkan pola, bukan memverifikasi kebenaran.

Cara mengatasi:  
- Retrieval-Augmented Generation (RAG): Hubungkan AI ke knowledge base atau API pencarian agar ia menarik fakta dari sumber nyata.  
- Cross-check: Perintahkan AI memeriksa jawabannya dengan sumber eksternal atau mengakui jika tidak yakin.  
- Prompting khusus: “Jika Anda tidak yakin, katakan ‘tidak yakin’ dan beri saran sumber yang dapat dicek.”  
- Human review: Semua informasi penting diverifikasi manusia.

#### 2. Pengetahuan Tidak Terbaru
Masalah: Model tidak tahu kejadian setelah cut-off date pelatihan.  
Kenapa terjadi: Data latih statis; model tidak belajar secara real-time.

Cara mengatasi:  
- Integrasi real-time search/API: Seperti plugin browsing atau koneksi ke database dinamis.  
- Fine-tuning berkala: Melatih ulang dengan data terbaru.  
- Hybrid system: Kombinasi AI + retrieval pipeline.

#### 3. Prompt Sensitivity
Masalah: Output sangat bergantung pada cara prompt ditulis; prompt kurang jelas → hasil buruk.  
Kenapa terjadi: Model mengandalkan konteks yang diberikan pengguna.

Cara mengatasi:  
- Prompt engineering: Sertakan peran, tujuan, dan format output.  
- Chain-of-thought prompting: Suruh AI menjelaskan proses berpikir langkah demi langkah.  
- Prompt template: Standarisasi prompt untuk kebutuhan tertentu.  
- Iterasi: Uji beberapa variasi prompt, lihat mana paling efektif.

#### 4. Bias dari Data Latih
Masalah: AI bisa memunculkan stereotip atau diskriminasi.  
Kenapa terjadi: Data latih mengandung bias sosial, budaya, atau politik.

Cara mengatasi:  
- Bias detection tools: Gunakan alat analisis bias pada output.  
- Dataset kurasi: Gunakan data pelatihan yang seimbang dan bebas bias.  
- Fine-tuning anti-bias: Latih model dengan data yang dirancang untuk menetralkan bias.  
- Human-in-the-loop: Libatkan manusia untuk menyaring output.

#### 5. Tidak Punya Moral/Judgement
Masalah: AI tidak mengerti etika, hukum, atau konteks sosial secara manusiawi.  
Kenapa terjadi: Model hanya memproses pola teks, bukan nilai moral.

Cara mengatasi:  
- Governance layer: Tambahkan filter dan kebijakan sebelum output keluar.  
- Rule-based control: Tetapkan aturan jelas (misalnya dilarang memberikan saran medis tanpa sumber).  
- Human oversight: Keputusan akhir selalu di tangan manusia.  
- Context injection: Beri panduan etis di prompt.

### Mini Quiz – Uji Pemahaman
1. Kalau AI menghasilkan jawaban meyakinkan tapi ternyata salah, itu disebut apa, dan cara paling efektif mengatasinya apa?  
2. Apa strategi yang bisa dipakai agar AI tetap tahu informasi terbaru tanpa melatih ulang model dari nol?  
3. Sebutkan satu cara untuk mengurangi bias dalam output AI selain fine-tuning.

*(Materi Capabilities & Limitations sudah lengkap dengan penjelasan detail dan strategi mitigasi. Siap dilanjutkan ke modul berikutnya setelah quiz dijawab atau sesuai alur course.)*