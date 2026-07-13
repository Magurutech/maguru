# Laporan Evaluasi Backend AI: Custom Open-Source vs Gemini Enterprise Agent Platform (GEAP)

Laporan riset mendalam (*Deep Research*) mengenai perbandingan antara tetap menggunakan framework open-source (**FastAPI + LangGraph + Supabase pgvector**) vs bermigrasi ke **Gemini Enterprise Agent Platform (GEAP) / Vertex AI Agent Builder** untuk backend AI Maguru.

---

## 1. Questions Answered (Pertanyaan yang Dijawab)

*   Apakah sebaiknya Maguru MVP V1 menggunakan tumpukan open-source yang ada (`maguru-model`) atau migrasi ke platform terkelola GEAP / Vertex AI?
*   Bagaimana perbandingan kompleksitas deployment, pemeliharaan (*maintenance*), dan skalabilitas jangka panjang?
*   Apakah free-tier/trial credit dari GEAP cukup dan hemat biaya untuk rilis awal Maguru MVP V1?

---

## 2. Findings (Temuan & Perbandingan)

### A. Gemini Enterprise Agent Platform (GEAP) / Vertex AI Agent Builder

*   **Arsitektur & Fitur**: GEAP adalah evolusi dan penamaan baru dari Vertex AI (diumumkan April 2026). Platform ini bersifat *managed* (terkelola sepenuhnya) dengan fitur unggulan seperti **Agent Engine** (runtime terkelola), **Memory Bank** (manajemen memori stateful otomatis), **Model Armor** (keamanan data/PII filter), dan sistem RAG terintegrasi (Vertex AI Search).
*   **Kompleksitas Deployment**: **Sangat Rendah**. Anda tidak perlu melakukan Dockerization, konfigurasi koneksi pool database vektor, atau mengelola CORS dan streaming SSE secara manual. Google Cloud mengelola penskalaan dan ketersediaan API secara otomatis.
*   **Struktur Biaya (Pricing)**: **Aditif dan Kompleks**. Biaya dihitung per komponen penggunaan:
    *   *Vertex AI Search (RAG)*: ~$1.50 s.d. ~$4.00 per 1,000 kueri.
    *   *Agent Engine Compute*: ~$0.0864 per vCPU-hour + ~$0.0090 per GB-hour untuk runtime agen yang aktif/idle.
    *   *Session Management & Token LLM*: Biaya tambahan terpisah berdasarkan token model Gemini yang digunakan.
    *   *Risiko Finansial*: Tidak ada batas biaya otomatis (*hard spending cap*). Endpoint yang dibiarkan menyala secara idle atau kueri RAG yang melonjak dapat mengakibatkan tagihan tidak terduga yang tinggi.

### B. Custom Open-Source (FastAPI + LangGraph + Supabase pgvector)

*   **Arsitektur & Fitur**: Menggunakan kode Python modular di mana LangGraph merutekan alur chatbot secara eksplisit dan Supabase pgvector bertindak sebagai penyimpan index materi pelajaran.
*   **Kompleksitas Deployment**: **Tinggi**. Anda harus menangani kontainerisasi (Docker), mengamankan endpoint, merutekan memori percakapan (checkpointers) di database, dan menulis kode streaming SSE (`astream_events` LangChain) secara manual.
*   **Struktur Biaya (Pricing)**: **Sangat Transparan dan Murah ($0 s.d. $10/bulan untuk MVP)**.
    *   *Supabase*: Free tier gratis mencakup pgvector untuk ribuan dokumen pelajaran.
    *   *Model API*: Bayar sesuai token riil via OpenRouter (misalnya, `gemini-2.0-flash` hanya berbiaya ~$0.075 per 1 juta input token).
    *   *Hosting*: Jika dideploy di Google Cloud Run dengan setelan *scale-to-zero* (aktif hanya saat ada request), biaya hosting bulanan untuk trafik rendah akan mendekati $0. Anda juga bisa menggunakan VPS murah seharga $5/bulan (DigitalOcean/Railway).

---

## 3. Perbandingan Ringkas untuk Maguru MVP V1

| Parameter | Custom Open-Source (FastAPI + LangGraph) | GEAP / Vertex AI Agent Builder |
| :--- | :--- | :--- |
| **Kebutuhan Setup** | Harus menulis kode infra, Docker, CORS, SSE | Tinggal konfigurasi di Console / ADK SDK |
| **Biaya Trafik Rendah (MVP)** | **Hampir $0** (Supabase Free + Cloud Run + OpenRouter) | Bisa mahal (biaya sewa vCPU/memory hour + search query) |
| **Vendor Lock-in** | Tidak ada. Kode bisa dipindah ke server mana saja | Sangat bergantung pada Google Cloud Platform (GCP) |
| **Observabilitas & Tracing**| Harus pasang LangSmith / Phoenix secara manual | Terbuka otomatis via GCP Cloud Logging & Monitoring |
| **Skalabilitas Produksi** | Butuh keahlian DevOps tambahan | Skalabilitas otomatis tingkat enterprise bawaan GCP |

---

## 4. Confidence (Tingkat Keyakinan)

*   **Tingkat Keyakinan**: **High (Tinggi)**. Informasi mengenai peluncuran GEAP (April 2026) dan rincian harga Vertex AI Search ($1.50 - $4.00 per 1k kueri) dikonfirmasi langsung dari dokumentasi resmi Google Cloud dan analisis biaya arsitektur RAG produksi.

---

## 5. Sources (Sumber Referensi)

1.  Google Cloud Official Announcement (April 2026) - Gemini Enterprise Agent Platform product release & lifecycle management.
2.  Google Cloud Vertex AI Search & Agent Builder Pricing Docs - Detail pricing per 1,000 queries and vCPU compute rates.
3.  LangChain / LangGraph Official Production Deployment Guidelines - Best practices for stateful agent replication and checkpointers.

---

## 6. Caveats (Batasan)

*   Meskipun Google Cloud memberikan trial credit sebesar $300 untuk akun baru, kredit ini akan kedaluwarsa dalam 90 hari. Setelah periode tersebut, Anda akan langsung dikenai tagihan konsumsi penuh.
*   Estimasi biaya GEAP sangat bergantung pada cara konfigurasi agent engine (apakah dideploy menggunakan runtime serverless penuh atau dialokasikan dengan instance komputasi tetap).

---

## 7. Rekomendasi Senior Developer (Ponytail/YAGNI)

Berdasarkan sasaran Maguru MVP V1 yang tertuang di `docs/overview/PRD.md`:

> 💡 **Keputusan Ponytail: Tetap Gunakan Custom FastAPI + LangGraph di `/maguru-model`**

### Alasan Utama (YAGNI & Efisiensi Biaya):
1.  **YAGNI (You Aren't Gonna Need It)**: Fitur keamanan tingkat enterprise (Model Armor, kepatuhan HIPAA/SOC2) dan multi-agent orchestration dari GEAP belum dibutuhkan oleh Maguru di fase MVP. Sistem kita hanyalah chatbot RAG satu arah untuk menjawab pertanyaan modul belajar.
2.  **Hindari Tagihan Tak Terduga**: Platform enterprise seperti GEAP tidak ramah bagi kantong bootstrapped startup/indie hacker di awal rilis karena skema tagihan aditifnya. Dengan custom FastAPI + Cloud Run (scale-to-zero) + Supabase Free, kita bisa membiarkan sistem Maguru online selama setahun penuh secara gratis jika trafik sedang sepi.
3.  **Kendali Penuh & Portabilitas**: Menjaga logika agen tetap di Python open-source membuat kita bebas memindahkan host dari GCP ke penyedia VPS murah mana pun tanpa perlu menulis ulang infrastruktur chat.

### Strategi Mengatasi Kompleksitas:
*   Untuk mempermudah deployment backend AI kita tanpa pusing memikirkan Kubernetes/Docker manual, gunakan layanan seperti **Railway.app** atau **Google Cloud Run** langsung dari repositori Git. Keduanya mendukung deployment container sekali klik dengan konfigurasi CORS dan SSL otomatis.