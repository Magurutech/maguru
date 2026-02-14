---
title: "Generative AI Fundamentals: How AI Systems Work"
description: "Memahami dasar-dasar cara kerja Generative AI, Large Language Models, dan implikasinya untuk kolaborasi manusia-AI"
contentType: "markdown"
duration: "30 menit"
order: 3
---

# 📘 Deep Dive 1: What is Generative AI? (Part 1)

**Fokus utama**: Dasar-dasar Generative AI — bagaimana cara kerjanya dan kenapa kita bisa “berkolaborasi” dengannya.

## 🧠 Ringkasan Materi "Generative AI Fundamentals"

**Tujuan bagian ini**:  
Membekali kamu dengan pemahaman dasar tentang bagaimana model bahasa besar (Large Language Models / LLM) seperti Claude dan ChatGPT bisa menghasilkan teks (dan hal lain) yang tampak masuk akal, logis, bahkan kreatif — tapi sebenarnya dibangun dari proses statistik.

### 🔍 Apa itu Generative AI?
Generative AI = AI yang bisa menghasilkan konten baru (teks, gambar, kode, dsb.) berdasarkan pola-pola yang ia pelajari dari data.

**Ciri khas**:
- Tidak hanya memilih jawaban benar/salah
- Melainkan menciptakan respons baru

**Respons bisa berupa**:
- Teks (chat, esai, puisi)
- Kode
- Gambar
- Musik
- dll

### 🧠 Bagaimana Cara Kerjanya?
Model seperti Claude & ChatGPT dilatih melalui dua tahap utama:

1. **Pre-training**  
   Diberi data dalam jumlah sangat besar → belajar memprediksi kata selanjutnya.  
   Contoh: “Saya sedang belajar ___” → AI belajar melengkapi dengan kemungkinan tinggi seperti "programming", "matematika", dll.

2. **Reinforcement Learning + Fine-tuning**  
   Setelah menguasai pola bahasa, AI diajari:  
   - Memberikan jawaban yang masuk akal dan membantu  
  vento Mematuhi etika, keamanan, serta instruksi manusia

**🧪 Inti yang harus diingat**:  
AI bukan “paham” seperti manusia, tapi **“Menebak kata/token berikutnya dengan sangat canggih berdasarkan konteks dan data latih.”**

### ⚠️ Kenapa Ini Penting untuk Kamu?
Pemahaman ini akan langsung membentuk cara kamu:

| Aspek            | Dampak Pemahaman Ini                                                                 |
|------------------|---------------------------------------------------------------------------------------|
| Description      | Prompt harus jelas dan terarah (karena AI hanya mengikuti pola probabilitas)           |
| Discernment      | AI bisa sangat meyakinkan, tapi belum tentu benar atau faktual                        |
| Diligence        | AI bisa mengandung bias, kesalahan, atau terlalu percaya diri (hallucination)         |

### 📌 Cek Pemahaman Ringan

1. Apa perbedaan utama antara Generative AI dengan AI tradisional (klasik)?  
2. Kenapa kamu tidak boleh langsung percaya 100% pada jawaban Claude/ChatGPT?  
3. Apa menurut kamu contoh penggunaan Generative AI paling powerful dalam coding/web development?

### Jawaban Peserta & Feedback

**Jawaban Peserta**:
- AI traditional lebih berfokus pada Machine Learning atau task yang biasanya bersifat klasifikasi/iterative, contohnya mengecek email spam, rekomendasi film/feature. Sedangkan Generative AI dapat memberikan atau membuat content baru dari hasil latihannya.  
- Karena generative AI tidak memiliki pemahaman seperti manusia, pada prompt in AI hanya mengisi kekosongan prompt yang ada, bukan memahami tujuan dari promptnya.  
- Penggunaan pada membuat deskripsi task atau PRD yang ingin dibuat.

**Feedback & Penajaman**  
Jawaban kamu sudah solid dan tepat mengena inti materinya 👍

**Penajaman tambahan**:

| Topik                              | Penjelasan Tambahan                                                                                             |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| AI Tradisional vs Generative AI    | ✅ AI tradisional fokus ke prediksi/klasifikasi (spam filter, rekomendasi, deteksi fraud).<br>🔄 Generative AI menciptakan konten baru yang belum pernah persis ada di data latih, tapi konsisten dengan pola yang dipelajari. |
| Kenapa tidak percaya 100%          | ✅ Karena AI hanya memprediksi token berikutnya berdasarkan probabilitas, bukan berdasarkan “pemahaman makna” atau logika sejati → perlu Discernment kuat. |
| Use case powerful di coding/web dev| ✅ Membuat deskripsi task/PRD sangat bagus.<br>💡 Bisa diperluas: generate boilerplate code, mock API response, saran user flow, unit test otomatis, dokumentasi kode, dll. |

*(Catatan: Pemahaman dasar Generative AI sudah solid. Kita siap melanjut ke Part 2 atau langsung ke modul Delegation yang lebih praktikal sesuai alur course.)*