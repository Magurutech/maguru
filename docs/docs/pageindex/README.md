# PageIndex (Vectorless RAG) Overview & Technical Reference

Dokumen ini mendokumentasikan gambaran umum, cara kerja, dan contoh integrasi teknologi **PageIndex** oleh **VectifyAI** sebagai bahan referensi teknis dan pertimbangan peningkatan arsitektur AI Maguru di masa depan.

---

## 1. Apa itu PageIndex?

**PageIndex** adalah sebuah framework pencarian dokumen berbasis AI (*RAG framework*) yang bersifat **Vectorless** (tidak menggunakan database vektor atau embeddings). Rilis pertama kali pada September 2025, PageIndex didesain untuk memecahkan kelemahan terbesar RAG tradisional (seperti pemotongan teks secara kaku atau *chunking loss* dan hilangnya konteks semantik pada data berformat kompleks).

PageIndex beroperasi dengan cara meniru perilaku manusia dalam membaca dan menavigasi sebuah buku atau dokumen tebal untuk menemukan informasi.

---

## 2. Cara Kerja (How It Works)

Berbeda dengan database vektor tradisional yang memotong dokumen menjadi potongan-potongan teks kecil (*chunks*) lalu mencocokkannya secara matematis (similarity search), PageIndex bekerja melalui dua tahapan utama:

```
                  +-----------------------------------+
                  |      Unggah Dokumen (PDF/MD)      |
                  +-----------------------------------+
                                    |
                                    v
                  +-----------------------------------+
                  |   Hierarchical Tree Index (TOC)   |
                  |  (Membuat pohon struktur bab/hal) |
                  +-----------------------------------+
                                    |
                                    v
                       +------------------------+
                       |    Kueri dari User     |
                       +------------------------+
                                    |
                                    v
                  +-----------------------------------+
                  |      LLM Reasoning Search         |
                  | (Menavigasi pohon secara logis)   |
                  +-----------------------------------+
                                    |
                                    v
                  +-----------------------------------+
                  |      Hasil Jawaban + Halaman      |
                  +-----------------------------------+
```

1.  **Hierarchical Tree Indexing**:
    PageIndex memproses dokumen dan menyusunnya menjadi bentuk pohon keputusan hierarkis (*semantic tree structure*), yang mirip dengan *Table of Contents* (Daftar Isi) yang sangat detail. Ini memungkinkan penataan dokumen tetap mempertahankan hubungan antar-bab, sub-bab, tabel, dan halaman secara utuh tanpa ada teks yang terpotong secara paksa.
2.  **Reasoning-Based Retrieval**:
    Ketika kueri diterima, LLM (melalui model agen) melakukan pencarian berbasis logika (*reasoning*) dengan menavigasi cabang-cabang pohon tersebut. LLM akan memutuskan bab mana yang relevan, menelusuri halaman di bawahnya, hingga menemukan bagian yang tepat.

---

## 3. Perbandingan: PageIndex vs Traditional Vector RAG (pgvector)

| Fitur / Parameter | RAG Tradisional (Supabase pgvector) | PageIndex (Vectorless) |
| :--- | :--- | :--- |
| **Metode Pencarian** | Kemiripan Kosinus Semantik (Vektor) | Logika LLM & Navigasi Pohon Struktur |
| **Penyimpanan Data** | Database Vektor (PostgreSQL pgvector) | File Indeks Pohon (Disk/PageIndex Cloud) |
| **Proses Parsing** | *Chunking* teks kaku (misal: per 500 karakter) | Hierarki alami dokumen (bab, halaman, tabel) |
| **Sangat Cocok Untuk** | Konten pendek, modular, banyak dokumen terpisah | Dokumen tunggal yang sangat panjang dan padat (PDF) |
| **Auditabilitas** | Rendah (hanya ada skor kemiripan angka) | Tinggi (bisa melacak alur logika pencarian halaman) |
| **Biaya Operasional** | Murah (hanya biaya embedding sekali di awal) | Mahal (memakan kuota token LLM saat pencarian) |
| **Kecepatan (Latensi)** | Sangat Cepat (milidetik) | Lebih Lambat (karena iterasi LLM di pohon data) |

---

## 4. Contoh Implementasi Dasar (Python)

### A. Instalasi Pustaka
```bash
pip install pageindex langchain langgraph
```

### B. Inisialisasi & Querying via SDK
```python
from pageindex import PageIndex
from openai import OpenAI
import os

# 1. Inisialisasi Klien
page_index = PageIndex(api_key=os.getenv("PAGEINDEX_API_KEY"))
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 2. Unggah Dokumen untuk Diindeks (Menghasilkan Tree Structure)
doc_id = page_index.add_document("materi_belajar.pdf")

# 3. Ambil Konteks Berdasarkan Pertanyaan (Menggunakan Tree Retrieval)
query = "Apa saja komponen variabel dalam Python?"
context = page_index.retrieve(doc_id, query)

# 4. Generate Jawaban via LLM dengan Konteks Utuh
prompt = f"""
Gunakan dokumen berikut untuk menjawab pertanyaan siswa.
Dokumen: {context}
Pertanyaan: {query}
"""

response = openai_client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": prompt}]
)

print("Jawaban AI:", response.choices[0].message.content)
```

---

## 5. Kapan Maguru Harus Beralih ke PageIndex?

Meskipun saat ini Maguru MVP V1 menggunakan **Supabase pgvector** karena materi pembelajaran internal berupa berkas Markdown yang pendek dan modular, kita direkomendasikan untuk beralih ke PageIndex apabila:
1. **Mendukung Buku Teks Eksternal**: Platform merilis fitur di mana siswa dapat mengunggah buku panduan (PDF) setebal 200+ halaman mereka sendiri untuk ditanyakan ke AI Co-Teacher.
2. **Akurasi Keuangan/Hukum**: Ketika Maguru merilis kursus tentang Akuntansi atau Regulasi Hukum, di mana akurasi pembacaan tabel keuangan dan pasal-pasal hukum tidak boleh terganggu oleh batasan *chunking* biasa.
3. **Kebutuhan Audit**: Jika sistem membutuhkan rujukan halaman eksak yang dapat diverifikasi secara transparan oleh mentor manusia (misalnya: *"AI menemukan jawaban ini di Bab 3 Halaman 42"*).



=====

bagaimana dengan supabase extension pgvector https://supabase.com/docs/guides/database/extensions/pgvector , apakah dengan isntall extension pgvector nya di supabase maka bisaa di bilang pgvectornya terhosting dnegan bantuan supabsae dan kita bisa gunakan pgvectornya sekarng ?

1. Supabase + pgvector Extension
Ya benar sekali.

Supabase adalah PostgreSQL yang di-hosting (managed service).
Mereka menyediakan pgvector sebagai salah satu extension resmi.
Kalau kamu mengaktifkan extension pgvector di Supabase, maka otomatis kamu sudah pakai pgvector yang ter-hosting di cloud.

Artinya:

Kamu tidak perlu install PostgreSQL dan pgvector sendiri di server/laptop.
Supabase yang mengurus server, backup, scaling, koneksi, dll.
Kamu tinggal enable extension-nya di dashboard Supabase → langsung bisa pakai tabel dengan tipe vector.

Kelebihan pakai Supabase pgvector:

Sangat mudah dan cepat (cocok untuk pemula)
Sudah include autentikasi, storage, edge function, dll dalam satu platform
Bisa langsung dipakai sekarang

Limit Free Tier Supabase (saat ini):

Database size: 500 MB
File storage: 1 GB
Beberapa limit lain (bandwidth, connections, dll)

Jadi ya, dengan menginstall/aktifkan extension pgvector di Supabase, kamu sudah bisa pakai pgvector yang terhosting.
