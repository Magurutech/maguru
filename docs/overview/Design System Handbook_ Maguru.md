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

## 2. Design Tokens

### Color Palette
| Token Name | Hex Code | Usage | Dark Mode Value |
| :--- | :--- | :--- | :--- |
| `color-primary` | `#1A2B4C` | Deep Navy - Brand/Trust | `#E0E6F0` |
| `color-secondary` | `#4A90E2` | Bright Blue - AI/Action | `#5DA9FF` |
| `color-accent` | `#7B61FF` | Purple - Innovation/Intelligence | `#9A85FF` |
| `color-bg-canvas` | `#F8FAFC` | Light Gray - App Background | `#0F172A` |
| `color-bg-surface` | `#FFFFFF` | White - Card/Surface | `#1E293B` |
| `color-text-primary` | `#0F172A` | Slate 900 - Main Text | `#F8FAFC` |
| `color-text-secondary` | `#475569` | Slate 600 - Secondary Text | `#94A3B8` |
| `color-success` | `#10B981` | Emerald - Mastery/Success | `#34D399` |
| `color-error` | `#EF4444` | Red - Error/Alert | `#F87171` |
| `color-warning` | `#F59E0B` | Amber - Warning | `#FBBF24` |

### Typography Scale
**Font Family**: Inter (UI), Manrope (Headings).

| Role | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Display L** | 48px | Bold | 1.2 | -0.02em |
| **Heading 1** | 32px | Semibold | 1.3 | -0.01em |
| **Heading 2** | 24px | Semibold | 1.4 | -0.01em |
| **Body Large** | 18px | Regular | 1.6 | 0 |
| **Body Medium** | 16px | Regular | 1.5 | 0 |
| **Caption** | 12px | Medium | 1.4 | 0.02em |
| **Code Snippet** | 14px | Regular | 1.5 | 0 |

### Spacing & Layout
*   **Base Unit**: 8px (Modular scale: 4, 8, 12, 16, 24, 32, 48, 64).
*   **Grid System**: 12-column (Desktop), 4-column (Mobile). Gutter: 24px.
*   **Border Radius**:
    *   `radius-sm`: 4px (Checkboxes, small inputs)
    *   `radius-md`: 8px (Buttons, small cards)
    *   `radius-lg`: 16px (Main cards, modals)
    *   `radius-full`: 999px (Pill buttons, avatars)

---

## 3. Foundation / Visual Language

### Iconography Style
*   **Style**: Outline / Line icons dengan sudut membulat (*rounded corners*).
*   **Stroke Weight**: 1.5px atau 2px untuk konsistensi.
*   **Size**: 24x24px (standard), 16x16px (small).
*   **Library Recommendation**: Lucide Icons atau Feather Icons.

### Imagery & Illustrations
*   **Illustration Style**: Minimalist, flat, dengan aksen warna brand. Hindari ilustrasi yang terlalu ramai.
*   **Imagery**: Gunakan foto berkualitas tinggi yang menunjukkan orang (pembelajar) dalam lingkungan yang modern dan fokus.

### Elevation & Shadows
*   `shadow-sm`: `0 1px 2px rgba(0,0,0,0.05)` (Subtle borders)
*   `shadow-md`: `0 4px 6px rgba(0,0,0,0.1)` (Standard cards)
*   `shadow-lg`: `0 10px 15px rgba(0,0,0,0.1)` (Modals, popovers)

---

## 4. Component Library Guidelines

### Buttons
*   **Variants**: Primary (Solid), Secondary (Outline), Ghost (Text only).
*   **States**: Default, Hover (subtle darken), Active (press effect), Disabled (opacity 50%), Loading (spinner).
*   **Rules**: Gunakan `color-secondary` untuk aksi utama terkait AI. Gunakan `color-primary` untuk aksi bisnis utama (misal: Beli Kursus).

### Input Fields
*   **Elements**: Label (di atas), Placeholder (deskriptif), Helper Text (opsional), Error Message (di bawah, warna merah).
*   **Focus State**: Ring 2px dengan warna `color-secondary`.

### AI Chat Components
*   **AI Bubble**: Background `color-bg-canvas`, teks `color-text-primary`. Ikon AI di sebelah kiri.
*   **User Bubble**: Background `color-secondary`, teks putih. Avatar user di sebelah kanan.
*   **Input Bar**: Sticky di bagian bawah, ikon "Ask AI" yang menonjol.
*   **Typing Indicator**: Animasi 3 titik halus saat AI sedang memproses.

### Product-Specific Components
*   **Course Card**: Menampilkan gambar kursus, judul, progres bar (`color-success`), dan tombol "Lanjutkan".
*   **Mastery Badge**: Ikon medali kecil dengan label kompetensi yang telah dikuasai.
*   **Adaptive Path Node**: Visualisasi langkah belajar dalam bentuk titik-titik yang terhubung.

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
