# Standard Operating Procedure (SOP): Tata Kelola Komponen UI Shadcn Studio Maguru
**Versi:** 2.0  
**Tanggal:** 20 September 2026  
**Status:** Dokumen Resmi Tunggal (*Single Source of Truth* untuk Komponen Studio Reusable)  
**Target Platform:** Maguru (Platform Kursus Daring Berbasis Teks & AI Agent Tools Terintegrasi)  
**Dokumen Pendukung:** [`architecture.md`](../../.agents/rules/architecture.md), [`design-system.md`](../../.agents/rules/design-system.md), dan [`sop-page-refactoring.md`](./sop-page-refactoring.md)

---

## 1. Tujuan & Filosofi Tata Kelola

Direktori `@/components/shadcn-studio/` adalah repositori terpusat untuk seluruh elemen antarmuka tingkat lanjut (*enhanced, composite & tactile presentation components*) platform **Maguru**.

Tujuan utama SOP ini adalah:
1. **Mencegah Redundansi Kode (Zero Redundant UI Markup)**: Menghentikan kebiasaan membuat ulang elemen antarmuka (kartu silabus, frame blok kode, progress bar, tombol pemicu AI, drawer navigasi) secara inline dari nol di setiap modul halaman.
2. **Menjamin Konsistensi Brand "Whimsical Ancient Fantasy Asia"**: Seluruh komponen mematuhi aturan proporsi 80% Flat-Clean Surface (`#FAF5ED` / `#FFFDF9`), border 1px halus (`#D8C4A7/35`), tipografi Poppins & Fira Code yang disiplin, serta 20% aksen taktil terukur (*subtle 3D embossed*).
3. **Pemberian Efek Skalabel Terpusat (The Centralized Wave Effect)**: Jika ada 1 perbaikan visual, performa, atau aksesibilitas pada komponen di Studio, **seluruh modul kursus dan fitur yang mengonsumsinya otomatis ikut ter-update** tanpa perlu mengubah kode fitur tersebut.
4. **Dokumentasi Mandiri (Self-Documenting via README)**: Setiap subfolder di `components/shadcn-studio/[kategori]/` wajib memiliki file `README.md` yang menjelaskan tujuan penggunaan, variasi yang tersedia, dan contoh pemanggilan props.

---

## 2. Kriteria Baku Komponen Shadcn Studio Maguru

Sebelum suatu komponen ditempatkan di `components/shadcn-studio/`, komponen tersebut wajib memenuhi 5 kriteria dasar berikut:

```
┌────────────────────────────────────────────────────────────────────────┐
│             5 KRITERIA EMAS KOMPONEN SHADCN STUDIO MAGURU              │
│                                                                        │
│  [1] Pure Presentational (Bebas dari routing & fetch API langsung)     │
│  [2] Strict 5-State Matrix (Default, Hover, Active, Focus, Disabled)   │
│  [3] Maguru Ancient Fantasy Tokens (Haram memakai kode HEX liar)       │
│  [4] WCAG 2.2 AA Accessible (Touch target ≥ 44px, semantic ARIA)       │
│  [5] Single Registry Entry (Wajib terdaftar di /design-system)         │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Pure Presentation (Tanggung Jawab Murni Tampilan)**:
   - Komponen studio **tidak boleh** melakukan query database Prisma langsung, pemanggilan `fetch()` endpoint langsung, atau manipulasi URL `useSearchParams()`.
   - Seluruh data materi, status kuis, dan aksi wajib diterima melalui standar React `props` (`title`, `progress`, `xpReward`, `onSelect`, `onAction`, dll.).
2. **Kepatuhan Token Visual Maguru**:
   - Dilarang keras memakai gaya *heavy neumorphism* dengan border 3px kotor atau cekungan gelap.
   - Wajib menggunakan palet token resmi: Ancient Beige Canvas (`#FAF5ED`), Pure Parchment White (`#FFFDF9`), Action Red (`#FF4D4D`), Solar Orange XP (`#FFB148`), Emerald Nature (`#5AC88A`), Magic Indigo AI (`#8C4FFF`), Deep Charcoal Wood (`#2D2319`), dan Golden Sand Border (`#D8C4A7`).
3. **Aksesibilitas & Ergonomi Mobile**:
   - Area sentuh minimal **44×44px** untuk elemen interaktif (tombol bab, opsi kuis, toggle silabus).
   - Seluruh tombol hanya-ikon wajib menyertakan `aria-label` (misal: "Salin kode materi").
   - Angka durasi baca, perolehan XP, dan persentase wajib menggunakan angka tabular (`tabular-nums`).
4. **Respon Interaksi & Status AI**:
   - Komponen aksi utama harus memberikan feedback taktil seketika (`active:scale-[0.98]`).
   - Komponen terkait AI Agent wajib memiliki visual status berpikir (*thinking pulse*) dan pengetikan teks (*streaming indicator*).
5. **Wajib Didaftarkan ke Katalog Design System**:
   - Setiap komponen di `components/shadcn-studio/` wajib memiliki pasangan demo di `features/design-system/components/demos/` dan terdaftar pada array `componentRegistry` di:  
     `features/design-system/lib/design-system-registry.tsx`.

---

## 3. Struktur Direktori & Standar Dokumentasi `README.md`

Struktur folder dikelompokkan secara semantik berdasarkan kategori komponen pembelajaran dan utilitas visual:

```
components/shadcn-studio/
├── accordion/        # Silabus bab kursus & modul FAQ materi
├── alert/            # Banner info tips modul & peringatan kuis
├── avatar/           # Avatar profil siswa & instruktur/AI Guru
├── badge/            # Badge level XP, kesulitan modul (Beginner/Expert), status quest
├── button/           # Tombol Merah Aksi taktil & tombol floating AI mentor
├── card/             # Kartu modul silabus, kartu opsi kuis, kartu tantangan koding
├── code/             # Frame snippet kode, header bahasa, tombol salin & tanya AI
├── drawer/           # Bottom sheet drawer untuk silabus & chat AI di mobile
├── form/             # Input pertanyaan ke AI & form evaluasi tugas
├── progress/         # Bar progres materi bertema fantasi perkamen & progress XP
├── switch/           # Sakelar toggle tampilan kode/pratinjau
└── ...
```

### Format Baku `README.md` Per Subfolder Kategori

Setiap subfolder kategori **wajib** memiliki `README.md` dengan template struktur berikut:

```markdown
# [Nama Kategori Komponen]

Deskripsi peran kategori komponen dalam antarmuka platform pembelajaran Maguru.

## 📦 Daftar Varian Komponen

| File | Nama Komponen | Status | Viewport | Penggunaan Utama |
|---|---|---|---|---|
| `nama-komponen.tsx` | `NamaKomponen` | ✅ Active / 🟡 Legacy | Mobile & Desktop | Tempat penggunaan di aplikasi Maguru |

## 🛠️ Contoh Pemanggilan (Code Example)

\`\`\`tsx
import { NamaKomponen } from "@/components/shadcn-studio/[kategori]/[nama-komponen]";

<NamaKomponen
  title="Pengenalan AI Agent Tools"
  progress={75}
  xpReward={50}
  onAction={() => handleStartLesson()}
/>
\`\`\`

## 🎨 Token Warna & Aksesibilitas
- Surface: `#FFFDF9` (Parchment White)
- Border: `#D8C4A7/35` (Golden Sand)
- Action Accent: `#FF4D4D` (Merah Aksi)
- Touch Target: Minimal 44×44px
- Focus Visible: `focus-visible:ring-2 focus-visible:ring-[#FF4D4D]`
```

---

## 4. Kebijakan Deprecating & Pembersihan Komponen (Anti-Bloat)

Untuk menjaga performa dan kebersihan repositori (*anti-bloat & ponytail optimization*):
1. **Komponen yang Dilarang**:
   - Komponen demo sisa template yang tidak memiliki keterkaitan dengan pembelajaran teks teknis, kuis, atau AI mentor (contoh: *carousel 3D berat yang menguras CPU smartphone*, *widget e-commerce kartu belanja*).
   - Komponen dengan styling skeuomorphic ekstrem (border ganda 3px, bayangan kotor) yang bertentangan dengan prinsip 80% Flat-Clean Reading.
   - Komponen berstatus `"draft"` yang hanya merender placeholder kosong tanpa kegunaan fungsional.
2. **Prosedur Pembersihan**:
   - Hapus berkas komponen dari `components/shadcn-studio/`.
   - Hapus demo terkait di `features/design-system/components/demos/`.
   - Hapus entri komponen dari `design-system-registry.tsx`.
   - Jalankan `yarn lint`, `yarn type-check`, dan `yarn build` untuk memverifikasi tidak ada pemanggil yang putus.

---

## 5. Ringkasan Siklus Kerja Developer

```
Kebutuhan Elemen Antarmuka Baru
           │
           ▼
1. Buka katalog `/design-system` atau periksa `components/shadcn-studio/`
   ├─ Sudah ada?  ──► Import langsung ke `features/[fitur]/components/`
   └─ Belum ada?  ──► 
         │
         ├─ A. Bangun elemen murni presentasional di `components/shadcn-studio/[kategori]/`
         ├─ B. Buat demo showcase di `features/design-system/components/demos/`
         ├─ C. Daftarkan di `design-system-registry.tsx`
         ├─ D. Tulis/Update `README.md` pada folder kategori
         └─ E. Konsumsi di halaman modul/fitur bersangkutan
```
