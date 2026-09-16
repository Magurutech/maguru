# 🚀 Pull Request Documentation: Maguru Frontend

**Target Branch**: `develop`  
**Source Branch**: `feature/troubleshoot`  
**Title**: `feat(cms-editor): Modernisasi Visual Lesson Editor Tiptap, Auto-Ingestion RAG PGVector, dan AI Quiz Assessment Generator`

---

## 📝 Ringkasan Perubahan (Executive Summary)

Pull Request ini menghadirkan modernisasi besar pada **Ruang Kerja Penulisan Kreator (CMS Authoring Workspace)**, mencakup:
1. **Modernisasi Visual & Ergonomi Lesson Editor Tiptap (MoSCoW Framework)**: Transformasi tampilan editor menjadi *Document Sheet Metaphor* berstandar Notion/Craft, fitur *Zen Writing Mode* (1-click collapse sidebar), blok kode pemrograman dengan tombol salin, *Notion-style Callout*, *Floating Bubble Menu*, *Pratinjau Siswa*, *AI Assistant*, dan *Export Markdown*.
2. **Auto-Ingestion & Knowledge Sync ke Vector Store (Milestone 3)**: Sinkronisasi otomatis materi pelajaran ke Supabase PGVector saat `POST` (buat), `PUT` (edit dengan deduplikasi), dan `DELETE` (cascade deletion), serta fitur *One-Click Bulk Sync* dan badge real-time `🧠 N Chunks AI` di header kursus.
3. **Automated AI Quiz Generator Integration (Milestone 2)**: Integrasi penuh CMS dengan FastAPI backend (`/api/v1/generate-quiz`) untuk pembuatan bank soal terarah berbasis konteks materi RAG.
4. **Hardening & Quality Assurance**: Migrasi browser Supabase client menjadi *Singleton Pattern* untuk mematikan peringatan duplikasi `GoTrueClient`, perbaikan linter React 19 hooks, dan kelulusan 100% pada `yarn type-check`.

---

## 🎨 Detail Fitur Baru (MoSCoW Breakdown)

### 🔴 1. Must-Have (Visual & Ergonomi Inti)
* **[M-1] Document Sheet Container**: Kanvas tulis kini dibungkus dalam lembaran kartu kertas solid berbayangan lembut (`rounded-3xl`, `bg-card`, `paper-texture`), menghasilkan kontras membaca maksimal (**WCAG AAA**) terpisah dari pola latar bergaris.
* **[M-2] Toggle Collapse Sidebar (Zen Writing Mode)**: Tombol di sudut kiri toolbar (`PanelLeftClose`/`PanelLeftOpen`) yang terhubung langsung ke `ManageContext` dan tersimpan persisten di `localStorage` untuk melipat sidebar kurikulum secara instan.
* **[M-3] Syntax-Highlighted Code Block**: NodeView kustom (`CodeBlockComponent.tsx`) dengan header bar gelap ala IDE, dropdown pilihan bahasa pemrograman (Python, JS, TS, HTML, CSS, SQL, Bash, JSON), dan tombol **"Salin Kode"** dengan animasi feedback centang hijau.
* **[M-4] Disable Browser Spellcheck**: Menghapus seluruh garis merah bergerigi browser yang mengotori kata-kata teknis coding dan bahasa Indonesia pada input judul dan editor body (`spellCheck={false}`).

### 🟡 2. Should-Have (Efisiensi & Interaktivitas)
* **[S-1] Student Live Preview Modal ("Pratinjau Siswa")**: Modal layar penuh yang menampilkan materi dalam format *reader view* bersih persis seperti yang dilihat siswa di aplikasi.
* **[S-2] Notion-Style Callout Blocks**: Blok penekanan informasi dengan 4 varian warna dan ikon (ℹ️ `/info`, 💡 `/tip`, ⚠️ `/warn`, ✅ Catatan Kunci) yang terintegrasi ke Slash Command (`/`).
* **[S-3] Floating Bubble Selection Menu**: Toolbar melayang gelap (*dark glassmorphism*) yang muncul seketika saat teks diseleksi untuk aksi cepat: **Bold**, *Italic*, ~~Strike~~, `Inline Code`, **Highlight**, dan Link tautan.
* **[S-4] Keyboard Shortcut**: Tombol Simpan dilengkapi tooltip informatif `Simpan Materi (Ctrl+S)` dan listener keyboard `Ctrl + S` langsung memicu auto-save.

### 🟢 3. Could-Have (C-1 & C-2)
* **[C-1] AI Content Assistant**: Tombol **"AI Tulis"** di toolbar strip untuk menyisipkan otomatis *Rangkuman Kunci Materi*, *Contoh Kode Python*, atau *Tantangan Latihan Mandiri*.
* **[C-2] Export Markdown (.md)**: Dropdown aksi simpan menyediakan fitur unduh berkas `.md` materi serta salin seluruh isi materi dalam format Markdown ke clipboard.

---

## 🧠 Integrasi Backend AI & Auto-Ingestion (US 4.2)

* **Auto-Ingestion saat Tambah Materi (`POST`)**: Menyinkronkan materi baru ke endpoint `/api/v1/ingest` di latar belakang secara *non-blocking* tanpa mengganggu UX kreator.
* **Deduplikasi saat Edit Materi (`PUT`)**: Menghapus chunk lama di PGVector dan menyuntikkan chunk baru untuk mencegah data usang (*stale vector chunks*).
* **Cascade Deletion (`DELETE`)**: Vektor materi otomatis terhapus dari tabel database vektor saat materi dihapus di CMS.
* **One-Click Bulk Sync**: Tombol `🔄 Sync AI` di header kursus menyinkronkan seluruh bab dan materi pelajaran sekaligus dengan feedback toast dan status badge real-time.

---

## 📁 Daftar Berkas yang Dimodifikasi & Ditambahkan

```text
features/cms/
├── Context/creator/ManageContext.tsx                 # Penambahan state isSidebarCollapsed & toggle
├── components/creator/manage/
│   ├── ManageHeader.tsx                              # Auth indicator chip & Bulk Sync AI button
│   ├── ManageSidebar.tsx                             # Terintegrasi dengan Zen Mode collapse
│   ├── editor/
│   │   ├── components/
│   │   │   ├── CodeBlockComponent.tsx                # [NEW] IDE-style code block with Copy button
│   │   │   ├── EditorBubbleMenu.tsx                  # [NEW] Floating text selection bubble menu
│   │   │   ├── StudentPreviewModal.tsx               # [NEW] Student live reader preview modal
│   │   │   ├── AIWritingAssistantModal.tsx           # [NEW] AI content helper modal
│   │   │   └── suggestion.ts                         # Slash commands (/tip, /warn, /info, /code)
│   │   ├── extensions/
│   │   │   ├── Callout.ts                            # [NEW] Notion-style callout extension
│   │   │   └── CustomCodeBlock.ts                    # [NEW] Code block React nodeview extension
│   │   └── lib/markdown-helpers.ts                   # [NEW] Export & download markdown utilities
│   └── panels/
│       ├── LessonEditorPanel.tsx                     # Document Sheet layout, toolbar & modals
│       ├── LessonViewerPanel.tsx                     # Dukungan render Callout & CodeBlock
│       └── QuizEditorPanel.tsx                       # Integrasi AI Quiz Generator modal
lib/
├── ai/ingest-client.ts                               # Client RAG ingestion FastAPI
├── ai/quiz-generator.ts                              # Client Quiz Generator fetcher
└── supabase/client.ts                                # Browser client Singleton pattern
components/tiptap-node/callout-node/callout-node.scss # [NEW] Styling CSS Callout blocks
```

---

## 🧪 Rencana & Hasil Pengujian (Verification)

1. **TypeScript Type Check**:
   ```bash
   yarn type-check
   # Output: Done in 5.61s (0 errors)
   ```
2. **ESLint Code Quality**:
   ```bash
   npx eslint "features/cms/components/creator/manage"
   # Output: 0 errors
   ```
3. **Manual Testing**:
   - Panduan pengujian manual 10 skenario lengkap terdokumentasi pada [`docs/dev/test.md`](file:///d:/.maguru/maguru/docs/dev/test.md).
   - Seluruh skenario (M-1 s.d. M-4, S-1 s.d. S-4, C-1 & C-2) telah diverifikasi berjalan normal.

---

## 📋 Checklist Penggabungan (Merge Checklist)

- [x] Kode bersih dari *syntax error* dan lulus `yarn type-check`.
- [x] Linter bersih dari *hooks order violation* (0 errors).
- [x] Non-blocking fault tolerance teruji saat AI backend offline.
- [x] Tidak ada file rahasia/kredensial yang di-*commit*.
- [x] Dokumentasi pengujian manual tersedia di `docs/dev/test.md`.
