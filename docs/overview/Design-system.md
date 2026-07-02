# Design System Handbook: Maguru

**Prepared by**: Manus Design System Architect
**Version**: 1.0.0
**Date**: 25 Juni 2026

---

## 1. Introduction & Principles

### Design Philosophy
**Intelligent Simplicity + Empowering Mastery.**
Maguru dirancang untuk terasa cerdas (AI-Native) namun tetap sederhana dan mudah dipahami. Desain harus memberdayakan pengguna untuk mencapai penguasaan kompetensi melalui bimbingan yang personal dan proaktif.

### Core Values (Do's & Don'ts)
*   **Do**: Gunakan *whitespace* yang cukup untuk mengurangi beban kognitif.
*   **Do**: Pastikan AI Co-Teacher selalu mudah diakses namun tidak mengganggu.
*   **Do**: Berikan *feedback* visual instan untuk setiap interaksi pengguna.
*   **Don't**: Gunakan warna yang terlalu kontras atau mengganggu konsentrasi belajar.
*   **Don't**: Gunakan istilah teknis yang membingungkan tanpa penjelasan (terutama untuk pemula).
*   **Don't**: Biarkan AI memberikan respons tanpa konteks yang jelas dari *knowledge base*.

### Brand Personality & Tone
**Innovative, Intelligent, Empowering, Trustworthy, Modern, Supportive.**
Bahasa visual Maguru harus mencerminkan kecanggihan teknologi AI namun tetap terasa hangat, mendukung, dan dapat dipercaya sebagai partner belajar.

---

### 2. Design Tokens

### Color Palette (Warm Parchment & Warm Charcoal)
Sistem warna Maguru berpindah ke estetika *Atelier Zero* yang menggabungkan kehangatan material cetak fisik (*paper/ink*) dengan aksen digital yang tegas.

| Token Name                | Hex Code (Light) | Usage                                       | Dark Mode Value (Warm Charcoal)               |
| :--------------------------| :-----------------| :--------------------------------------------| :----------------------------------------------|
| `color-bg-canvas`         | `#efe7d2`        | Warm Parchment - Latar belakang utama       | `#19181d` (Deep Charcoal Black)               |
| `color-bg-surface`        | `#ece4cf`        | Alternate Warm Paper - Section/Card default | `#232127` (Secondary Warm Dark)               |
| `color-bg-surface-accent` | `#ddd2b6`        | Darker Paper - Hover, emphasis              | `#37353E` (User Dark - Highlight card/active) |
| `color-bg-bone`           | `#f7f1de`        | Bone - Translucent glass fill / code block  | `#2d2a33` (Deep surface box)                  |
| `color-text-primary`      | `#15140f`        | Ink - Judul, teks utama, tombol primer      | `#efe7d2` (Parchment white)                   |
| `color-text-secondary`    | `#2a2620`        | Ink Soft - Paragraf deskripsi               | `#ddd2b6` (Parchment soft)                    |
| `color-text-muted`        | `#5a5448`        | Ink Mute - Detail kecil, info pendukung     | `#aba595`                                     |
| `color-text-faint`        | `#8b8676`        | Ink Faint - Keterangan, metadata, nomer bab | `#777367`                                     |
| `color-accent-coral`      | `#ed6f5c`        | Coral - Aksen, tautan, label, bullet poin   | `#f08e7c` (Muted coral)                       |
| `color-accent-mustard`    | `#e9b94a`        | Mustard - Elemen dekoratif, status khusus   | `#f4cf74`                                     |
| `color-accent-olive`      | `#6e7448`        | Olive - Aksen natural, info minor           | `#8a915e`                                     |
| `color-success`           | `#10B981`        | Emerald - Validasi penguasaan (Mastery)     | `#34D399`                                     |
| `color-error`             | `#EF4444`        | Red - Alert/Kesalahan                       | `#F87171`                                     |

### Typography Scale
**Font Family**: Inter (UI), Manrope (Headings), Playfair Display (Serif accent), Cinzel (Roman/Header decor).

| Role | Font Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display L** | Manrope | 48px | Bold | 1.2 | -0.02em |
| **Heading 1** | Manrope | 32px | Semibold | 1.3 | -0.01em |
| **Heading 2** | Manrope | 24px | Semibold | 1.4 | -0.01em |
| **Body Large** | Inter | 18px | Regular | 1.6 | 0 |
| **Body Medium** | Inter | 16px | Regular | 1.5 | 0 |
| **Caption / Metadata**| Inter | 12px | Medium | 1.4 | 0.02em |
| **Roman Number** | Cinzel | 14px | Bold | 1.3 | 0.1em |
| **Code Snippet** | Monospace | 14px | Regular | 1.5 | 0 |

### Spacing & Layout
*   **Base Unit**: 8px (Skala modular: 4, 8, 12, 16, 24, 32, 48, 64).
*   **Grid System**: 12-kolom (Desktop), 4-kolom (Mobile). Gutter: 24px.
*   **Border Radius**:
    *   `radius-sm`: 4px (Checkbox, input kecil)
    *   `radius-md`: 8px (Tombol, kartu kecil)
    *   `radius-lg`: 16px (Kartu utama, modal)
    *   `radius-full`: 999px (Tombol pil, avatar)

---

## 3. Foundation / Visual Language

### Paper Texture Overlay (Tekstur Kertas)
*   **Implementasi**: Semua halaman harus memiliki overlay noise SVG transparan yang diterapkan secara global di atas latar belakang.
*   **CSS Utility**:
    ```css
    .paper-texture {
      background-image: url("data:image/svg+xml,...");
      opacity: 0.04; /* Light mode */
    }
    [data-theme="dark"] .paper-texture {
      opacity: 0.055; /* Dark mode */
    }
    ```

### Scroll Parallax & Background Video
*   **Tujuan**: Memberikan efek visual modern di bagian Hero/Header dengan latar belakang video yang meluncur lebih lambat daripada teks halaman.
*   **Parallax Ratio**: Rasio scroll disetel pada `0.45x`.
*   **Spesifikasi Video**: Video harus memiliki kontras monokromatik rendah, gerakan lambat, dan tidak memiliki teks/suara sendiri agar tidak mengganggu keterbacaan (*readability*).

### Elevation, Shadows & Depth (3D Glassmorphism)
*   `shadow-sm`: `0 1px 2px rgba(0,0,0,0.05)` (Garis pembatas halus)
*   `shadow-md`: `0 10px 30px var(--glass-shadow)` (Dynamic Glass Cards)
*   `depth-3d`: Desain kartu menggunakan `perspective(1000px)` dan efek visual translasi sumbu Z (`translateZ(20px)` hingga `translateZ(35px)`) pada elemen di dalamnya saat kursor mendekat (tilt effect max 12 derajat).

---

## 4. Component Library Guidelines

### Buttons
*   **Variants**: Primary (Solid Coral), Secondary (Outline Ink), Ghost (Text Ink).
*   **Design Rules**:
    *   Tombol Primer: Latar belakang `color-accent-coral`, teks putih.
    *   Tombol Sekunder: Tanpa latar, border `color-text-primary`, warna teks `color-text-primary`.
    *   Hover & Transition: Animasi transisi halus 300ms dengan pergerakan translasi Y ke atas (`translateY(-2px)`).

### Input Fields
*   **Styling**: Latar belakang mengikuti `color-bg-canvas`, dibatasi border `color-text-faint`.
*   **Focus State**: Bingkai berubah menjadi `color-accent-coral` dengan bayangan halus berukuran 3px (`rgba(237, 111, 92, 0.15)`).

### Dynamic Glassmorphic Cards (3D Cards)
*   **Latar Belakang**: Kartu menggunakan `var(--glass-bg)` dengan efek kaca buram `backdrop-filter: blur(16px) saturate(110%)`.
*   **Batas (Borders)**: Border setebal 1px menggunakan `var(--glass-border)`.
*   **Aksen**: Bagian bawah kartu dapat diberikan border aksen setebal 3px dengan warna `color-accent-coral` untuk mempertegas fungsionalitas.

### AI Chat Components
*   **AI Bubble**: Menggunakan `color-bg-surface` dengan border transparan, ikon AI berwarna `color-accent-coral` di sisi kiri.
*   **User Bubble**: Menggunakan warna aksen `color-bg-surface-accent` dengan teks `color-text-primary`, avatar pengguna di sebelah kanan.
*   **Input Bar**: Mengambang (*sticky*) di bagian bawah layar dengan struktur transparan glassmorphic.

### Product-Specific Components
*   **Course Card**: Kartu 3D glassmorphic dengan progress bar menggunakan `color-success`.
*   **Mastery Badge**: Ikon medali minimalis bertekstur kertas dengan label kompetensi Roman numeral (`Cinzel`).
*   **Adaptive Path Node**: Garis penghubung tipis 1px dengan node titik berwarna `color-accent-coral`.

---

## 5. Patterns & Templates

### Common User Flows
*   **Onboarding & Assessment**: Seri layar bersih dengan satu pertanyaan per layar untuk meminimalkan beban kognitif.
*   **Learning Dashboard**: Tata letak 2-kolom. Kiri: Navigasi modul. Kanan: Konten modul + AI Co-Teacher (bisa di-*expand*).

### States
*   **Empty States**: Ilustrasi minimalis + teks instruksi + tombol aksi (misal: "Belum ada kursus. Jelajahi sekarang").
*   **Error States**: Pesan yang jelas tentang apa yang salah dan bagaimana memperbaikinya (misal: "Koneksi terputus. Coba lagi").

---

## 6. Figma File Structure

### Organization
*   **Pages**:
    1.  🎨 **Foundations** (Tokens, Typography, Colors)
    2.  🧩 **Components** (Buttons, Inputs, Cards, etc.)
    3.  📱 **Mobile Screens**
    4.  💻 **Desktop Screens**
    5.  ⚙️ **Prototypes**
    6.  🗑️ **Archive**
*   **Components**: Gunakan **Variants** dan **Boolean Properties** untuk efisiensi. Pastikan semua komponen menggunakan **Auto Layout**.
*   **Documentation**: Gunakan plugin "Figma Tokens" atau sejenisnya untuk sinkronisasi token ke kode.

---

## 7. Accessibility & Contribution

### WCAG Standards
*   Target: **WCAG 2.1 Level AA**.
*   Kontras teks minimal 4.5:1.
*   Ukuran target sentuh minimal 44x44px.

### Contribution Workflow
1.  **Request**: Desainer mengusulkan komponen baru melalui Jira/Slack.
2.  **Review**: Design System Lead meninjau kebutuhan dan konsistensi.
3.  **Design**: Pembuatan komponen di halaman "Draft".
4.  **Publish**: Komponen dipindahkan ke library utama setelah disetujui.

---
**Prepared by**: Manus Design System Architect
**Version**: 1.0.0
**Date**: 25 Juni 2026
