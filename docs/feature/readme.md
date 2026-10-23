# 📚 Indeks Dokumentasi Sistem Fitur Maguru (Feature Systems Directory)

Dokumentasi resmi mengenai 6 sistem fitur utama yang diimplementasikan di workspace frontend Maguru, memetakan keterkaitan antara rute antarmuka di **`/app`** dengan modul bisnis di **`/features`**.

---

## 🗂️ Direktori Sistem Fitur

| No | Sistem Fitur | Direktori Dokumentasi | Fokus & Tanggung Jawab Utama | Rute Terkait (`/app`) |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Pembelajaran Siswa** | [`student-learning/`](./student-learning/readme.md) <br> • [Alur Sistem](./student-learning/system-flow.md) <br> • [Kontrak API](./student-learning/api-contracts.md) | Antarmuka membaca teks teknis, navigasi silabus bab terstruktur, in-memory cache, dan eksekusi kode in-browser. | `/course/[slug]/learn`, `/course` |
| **2** | **CMS & Editor Kreator** | [`creator-cms/readme.md`](./creator-cms/readme.md) | Studio kurasi kurikulum, penyusunan bab via drag-and-drop, dan Tiptap block editor berfitur slash command (`/`). | `/creator/courses`, `/creator/courses/[slug]/manage` |
| **3** | **AI Co-Teacher Mentor** | [`ai-co-teacher/readme.md`](./ai-co-teacher/readme.md) | Asisten belajar real-time berbasis SSE streaming dengan 5 rantai AI spesialis dan multi-turn thread memory. | Terpasang di `/course/[slug]/learn` & homepage |
| **4** | **Asesmen & Kuis** | [`assessment-engine/readme.md`](./assessment-engine/readme.md) | Mesin pengujian teknis, kuis dengan timer, tokenizer soal koding, dan evaluasi diagnostik pre-test. | Terpasang di `/course/[slug]/learn` & `/api/assessment` |
| **5** | **Dasbor & Analitik** | [`dashboard-analytics/readme.md`](./dashboard-analytics/readme.md) | Pusat observabilitas peran: pelacak habit belajar siswa, analitik instruktur, dan metrik platform admin. | `/student`, `/creator`, `/dashboard`, `/admin` |
| **6** | **Auth & Portal Marketing** | [`auth-landing/readme.md`](./auth-landing/readme.md) | Gerbang masuk aplikasi, autentikasi 3 peran (Admin/Creator/User), dev-mode switcher, dan landing page interaktif. | `/page.tsx`, `/sign-in`, `/sign-up`, `/unauthorized` |

---

## 🏗️ Prinsip Desain & Rekayasa Perangkat Lunak

Setiap sistem fitur di atas dibangun dengan mematuhi standar arsitektur Maguru:
* **Pola 3-Tier Layering**: Segregasi ketat antara *Presentation* (`components`), *Logic* (`hooks`), dan *Data* (`api.ts`).
* **Ergonomi Tablet & Desktop (≥ 768px)**: Dilindungi oleh barrier informatif `<MobileDeviceNotice />` untuk perangkat berlayar sempit.
* **Atelier Zero Visual Identity**: 80% Flat-Clean reading surface yang dipadukan dengan 20% aksen taktil skeuomorfik halus.
* **Zero Layout Shift (Zero-CLS)**: Angka dinamis menggunakan `tabular-nums` dan didukung skeleton wireframes saat data dimuat.
