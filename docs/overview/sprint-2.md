# Maguru: Sprint 2 Backlog & Execution Plan

**Disusun oleh:** Senior Scrum Master, Technical Project Manager**Tanggal:** 25 Juni 2026**Durasi Sprint:** 2 Minggu (Minggu 5-6 dari total 10 minggu MVP V1)

## 1. Executive Summary

Dokumen ini merinci rencana eksekusi untuk Sprint 2 pengembangan MVP V1 Maguru. Sprint ini adalah fase krusial di mana kita mulai membangun "otak" dari Maguru: **infrastruktur AI berbasis RAG** dan **mesin penilaian awal**. Tujuannya adalah agar sistem *assessment* awal dapat berfungsi dan *backend* RAG siap untuk menelan dokumen kursus, serta antarmuka *chat* AI muncul di layar. Sprint ini akan meletakkan fondasi teknis untuk fitur AI Co-Teacher yang menjadi *Unique Value Proposition* utama Maguru.

## 2. Sprint Goal

**Membangun mesin *****assessment***** awal yang berfungsi dan menyiapkan *****backend***** RAG untuk menelan dokumen kursus, serta menampilkan antarmuka *****chat***** AI di layar.**

## 3. Sprint Backlog & Task Breakdown

Berikut adalah User Stories yang akan dikerjakan di Sprint 2, beserta rincian tugas teknis (Frontend, Backend, AI/Data Engineer) dan estimasi *story points* (SP). Asumsi tim: 2 Fullstack/Backend, 1 Frontend, 1 AI/Data Engineer.

### User Story 3.1: Initial Assessment Engine

**Deskripsi:** Sebagai pengguna, saya ingin dapat menyelesaikan kuis penilaian awal dan melihat skor saya agar platform dapat merekomendasikan jalur belajar yang sesuai.**Prioritas:** Must Have (P1)**Alasan Penempatan:** Penting untuk personalisasi jalur belajar dan validasi *competency-based learning*.**Estimasi Effort:** 5 SP

#### Tasks:

- **Backend (Assessment Service)**:
  - Implementasi endpoint `/assessments` (POST untuk submit jawaban, GET untuk hasil).
  - Logic untuk menghitung skor berdasarkan jawaban kuis.
  - Integrasi dengan database untuk menyimpan hasil *assessment* per user.
  - Unit & Integration Tests untuk Assessment Service.

- **Frontend (Assessment UI)**:
  - Desain dan implementasi halaman `Initial Assessment` (UI kuis dengan pilihan ganda/isian singkat).
  - Integrasi dengan Assessment Service API untuk mengirim jawaban dan menampilkan skor.
  - Implementasi navigasi antar pertanyaan kuis.

- **Database (Assessment Schema)**:
  - Buat tabel `assessments` dengan kolom: `id (PK)`, `user_id (FK)`, `course_id (FK)`, `score`, `completed_at`.
  - Buat tabel `assessment_questions` dengan kolom: `id (PK)`, `course_id (FK)`, `question_text`, `options (JSONB)`, `correct_answer`.

#### Acceptance Criteria:

- Pengguna dapat memulai dan menyelesaikan kuis penilaian awal.

- Sistem dapat menghitung skor kuis dengan benar.

- Skor kuis tersimpan di database dan dapat dilihat oleh pengguna.

- UI kuis mudah digunakan dan responsif.

### User Story 4.1: RAG Infrastructure Setup

**Deskripsi:** Sebagai AI Engineer, saya ingin menyiapkan infrastruktur *Retrieval-Augmented Generation (RAG)* agar dokumen kursus dapat di-*embed* dan disimpan untuk digunakan oleh AI Co-Teacher.**Prioritas:** Must Have (P1)**Alasan Penempatan:** Fondasi teknis untuk AI Co-Teacher, mitigasi risiko AI sedini mungkin.**Estimasi Effort:** 8 SP

#### Tasks:

- **AI/Data Engineer**:
  - Pilih dan setup *Vector Database* (misal: Pinecone, Weaviate, ChromaDB, atau Qdrant) di lingkungan *development*.
  - Pilih dan integrasikan *Embedding Model* (misal: OpenAI `text-embedding-3-small`, Sentence Transformers) untuk mengubah teks menjadi vektor.
  - Buat *script* dasar untuk koneksi ke Vector DB dan Embedding Model.
  - Setup *environment variables* dan konfigurasi yang diperlukan.

- **Backend (RAG Service)**:
  - Buat `RAG Service` terpisah atau integrasikan ke `Course Service`.
  - Implementasi API untuk menerima teks/dokumen dan mengirimkannya ke Embedding Model & Vector DB.

#### Acceptance Criteria:

- Vector Database berhasil di-*deploy* dan dapat diakses.

- Embedding Model terintegrasi dan dapat menghasilkan vektor dari teks.

- Script koneksi ke Vector DB dan Embedding Model berfungsi dengan baik.

- API untuk mengirim teks ke Vector DB berfungsi.

### User Story 4.2: Knowledge Base Ingestion

**Deskripsi:** Sebagai admin, saya ingin dapat mengunggah dokumen kursus (PDF/Markdown) dan memprosesnya ke dalam *Knowledge Base* RAG agar AI Co-Teacher memiliki konteks yang relevan.**Prioritas:** Must Have (P1)**Alasan Penempatan:** Membangun *knowledge base* adalah inti dari AI Co-Teacher yang anti-halusinasi.**Estimasi Effort:** 8 SP

#### Tasks:

- **AI/Data Engineer**:
  - Implementasi *document loader* untuk format PDF dan Markdown (misal: LangChain `PyPDFLoader`, `UnstructuredMarkdownLoader`).
  - Implementasi *text chunking strategy* (misal: `RecursiveCharacterTextSplitter`) untuk memecah dokumen menjadi bagian-bagian kecil yang optimal untuk *embedding*.
  - Buat *pipeline* ingestion: Load -> Chunk -> Embed -> Store (ke Vector DB).
  - Buat *script* CLI atau API endpoint sederhana untuk memicu proses ingestion.

- **Backend (Admin API)**:
  - Implementasi endpoint `/admin/knowledge-base/upload` untuk menerima file PDF/Markdown.
  - Panggil *pipeline* ingestion dari *backend* setelah file diunggah.

#### Acceptance Criteria:

- Admin dapat mengunggah file PDF atau Markdown melalui UI/API.

- File yang diunggah berhasil di-*chunk* dan di-*embed*.

- Vektor-vektor dari dokumen berhasil tersimpan di Vector Database.

- Proses ingestion berjalan tanpa error dan log menunjukkan keberhasilan.

### User Story 4.3: AI Chat Interface (UI Frontend statis)

**Deskripsi:** Sebagai pengguna, saya ingin melihat antarmuka *chat* AI Co-Teacher di halaman kursus agar saya tahu bahwa saya bisa berinteraksi dengannya.**Prioritas:** Should Have (P2)**Alasan Penempatan:** Memberikan indikasi visual keberadaan AI Co-Teacher, meskipun belum fungsional penuh.**Estimasi Effort:** 5 SP

#### Tasks:

- **Frontend (AI Chat UI)**:
  - Desain dan implementasi komponen `AI Chat Bubble` (sesuai Design System Handbook).
  - Desain dan implementasi komponen `Chat Input Bar` (dengan tombol send dan ikon).
  - Integrasikan komponen ini ke halaman `Course Detail` atau `Micro-Learning Content Viewer`.
  - Pastikan UI responsif dan mengikuti *design tokens* Maguru.
  - *Mock* respons AI statis (misal: "Halo! Saya AI Co-Teacher Anda. Bagaimana saya bisa membantu?") untuk tampilan awal.

#### Acceptance Criteria:

- Antarmuka *chat* AI Co-Teacher terlihat di halaman kursus.

- Komponen *chat bubble* dan *input bar* sesuai dengan *design system*.

- Antarmuka *chat* dapat di-*toggle* (buka/tutup) jika diperlukan.

- Teks *mock* respons AI muncul saat *chat* dibuka.

## 4. Technical Considerations & Notes

- **RAG Architecture**: Pertimbangkan arsitektur mikro-servis untuk RAG jika kompleksitas meningkat, atau integrasikan ke *backend service* yang ada untuk MVP.

- **Embedding Model Choice**: Pilih model *embedding* yang seimbang antara akurasi, kecepatan, dan biaya. Untuk MVP, model yang lebih kecil dan cepat mungkin lebih baik.

- **Chunking Strategy**: Eksperimen dengan ukuran *chunk* dan *overlap* yang berbeda untuk menemukan konfigurasi optimal yang menjaga konteks tanpa terlalu besar. Mulai dengan *recursive character splitting*.

- **API Contract**: Tim Frontend dan Backend/AI harus menyepakati *API Contract* untuk endpoint *assessment* dan *RAG ingestion*.

- **Error Handling**: Pastikan *error handling* yang robust untuk proses ingestion dokumen (misal: file corrupt, format tidak didukung).

- **Security**: Pertimbangkan otorisasi untuk endpoint admin ingestion.

## 5. Definition of Done (DoD) for Sprint 2

Sebuah User Story dianggap selesai (Done) di Sprint 2 jika:

- Semua *tasks* terkait telah diselesaikan.

- Semua *Acceptance Criteria* terpenuhi.

- Kode telah di-*review* oleh setidaknya satu rekan tim (Peer Review).

- Unit dan Integration Tests telah ditulis dan lolos (terutama untuk logic *assessment* dan *RAG ingestion*).

- Fitur telah di-*deploy* ke lingkungan *staging*.

- Tidak ada *bug* kritis yang ditemukan selama pengujian internal.

- Dokumentasi teknis (API, RAG pipeline) telah diperbarui.

## 6. Potential Risks & Mitigation for Sprint 2

- **Risiko**: Kualitas *embedding* dan *retrieval* dari RAG tidak optimal, menyebabkan AI Co-Teacher memberikan jawaban yang kurang relevan.
  - **Mitigasi**: Alokasikan waktu untuk *fine-tuning* *chunking strategy* dan pemilihan *embedding model*. Lakukan pengujian manual dengan berbagai jenis dokumen kursus.

- **Risiko**: Kompleksitas setup Vector DB dan Embedding Model lebih tinggi dari perkiraan.
  - **Mitigasi**: Mulai dengan solusi *managed service* (misal: Pinecone, Qdrant Cloud) untuk mempercepat *setup*. Jika *self-hosted*, pastikan *resource* AI Engineer cukup.

- **Risiko**: Integrasi UI Chat dengan *backend* RAG tertunda karena perbedaan *API contract*.
  - **Mitigasi**: Lakukan sesi *API Contract Alignment* di awal sprint. Gunakan *mock API* di Frontend jika *backend* RAG belum siap sepenuhnya.

## 7. Deliverables for Sprint 2

- Fungsionalitas kuis penilaian awal (API & UI).

- Infrastruktur RAG yang siap (Vector DB, Embedding Model).

- *Pipeline* ingestion dokumen (PDF/Markdown) ke *knowledge base* RAG.

- Antarmuka *chat* AI Co-Teacher (UI Frontend statis).

- Database schema untuk *assessment*.

- Kode yang teruji dan terdokumentasi.

- Fitur ter-deploy di lingkungan *staging*.