# Design System Handbook: Maguru
# Atelier Zero — "Artisan Print" Visual Language

**Prepared by**: Manus Design System Architect  
**Version**: 2.0.0  
**Date**: 16 Juli 2026  
**Status**: Active — Artisan Print Direction

---

## 1. Introduction & Philosophy

### Design Vision
**Intelligent Simplicity + Empowering Mastery.**

Maguru dirancang untuk terasa cerdas (AI-Native) namun tetap hangat, personal, dan memberdayakan. Gaya visual yang digunakan harus memancarkan rasa **kepercayaan** dan **keakraban** layaknya buku cetak berkualitas — bukan tampilan digital yang dingin dan generik.

### "Artisan Print" Design Language
Mulai versi 2.0, Maguru mengadopsi estetika **Artisan Print** — sebuah pendekatan visual yang terinspirasi dari editorial cetak premium dan kertas buatan tangan (*handcrafted paper*).

> **Inspirasi Visual Utama**: Lihat `docs/design/design.jpg` (atau `public/page/design.jpg`) sebagai referensi tone dan estetika yang ingin dicapai — background bertekstur linen/kanvas, tipografi editorial serif besar, dan kedalaman visual didapat dari kontras ukuran & whitespace, bukan dari efek layar digital.

**Tiga Pilar Artisan Print:**

| Pilar                | Deskripsi                                                                                                    | Implementasi                                                                 |
| ----------------------| --------------------------------------------------------------------------------------------------------------| ------------------------------------------------------------------------------|
| **Texture-First**    | Tekstur halus grain kertas *adalah* karakter visual halaman — bukan sekadar overlay dekoratif tipis          | `feTurbulence` SVG, opacity 6–8%, mix-blend multiply                         |
| **Print-Flat Depth** | Kedalaman visual didapat dari hierarki tipografi & whitespace — bukan shadow tebal atau glassmorphism        | Shadow tipis 1-layer `0 1px 3px`, hapus `backdrop-filter` dari komponen umum |
| **Deckle Edge**      | Tepi komponen utama (button CTA, badge) menggunakan `clip-path` organik bergelombang layaknya sobekan kertas | `SVG clip-path` dengan polygon irreguler pada elemen tertentu                |

### Core Values
*   **Do**: Gunakan *whitespace* yang longgar — mengurangi beban kognitif saat belajar.
*   **Do**: Pastikan AI Co-Teacher mudah diakses namun tidak menghalangi konten utama.
*   **Do**: Berikan *feedback* visual instan untuk setiap interaksi pengguna.
*   **Do**: Gunakan tipografi editorial (Manrope ExtraBold) untuk heading hero — terasa cetak premium.
*   **Don't**: Gunakan `backdrop-filter: blur()` glassmorphic pada komponen reguler — terlalu "digital".
*   **Don't**: Gunakan multi-layer 3D emboss shadow pada komponen aktif — ditinggalkan di v2.0.
*   **Don't**: Gunakan emoji sebagai ikon — selalu gunakan SVG Lucide yang konsisten.
*   **Don't**: Campur efek digital dan efek cetak secara acak di halaman yang sama.

### Brand Personality
**Artisan, Intelligent, Warm, Editorial, Trustworthy, Handcrafted.**

---

## 2. Design Tokens

### Color Palette — Warm Parchment & Warm Charcoal
Palet warna Atelier Zero dipertahankan penuh dari v1.0 — kompatibel sempurna dengan estetika Artisan Print.

| Token Name | Light Mode | Usage | Dark Mode |
|:-----------|:-----------|:------|:----------|
| `color-bg-canvas` | `#efe7d2` | Warm Parchment — latar utama | `#19181d` |
| `color-bg-surface` | `#ece4cf` | Alternate Warm Paper — section/card | `#232127` |
| `color-bg-surface-accent` | `#ddd2b6` | Darker Paper — hover, active | `#37353e` |
| `color-bg-bone` | `#f7f1de` | Bone — code block, translucent fill | `#2d2a33` |
| `color-text-primary` | `#15140f` | Ink — judul, teks utama | `#efe7d2` |
| `color-text-secondary` | `#2a2620` | Ink Soft — paragraf deskripsi | `#ddd2b6` |
| `color-text-muted` | `#5a5448` | Ink Mute — detail kecil | `#aba595` |
| `color-text-faint` | `#8b8676` | Ink Faint — metadata, borders | `#777367` |
| `color-accent-coral` | `#ed6f5c` | Coral — CTA utama, aksen primer | `#f08e7c` |
| `color-accent-mustard` | `#e9b94a` | Mustard — dekoratif, status khusus | `#f4cf74` |
| `color-accent-olive` | `#6e7448` | Olive — aksen natural | `#8a915e` |
| `color-ai-blue` | `#4a90e2` | AI Blue — AI Co-Teacher, aksi sekunder | `#5da9ff` |
| `color-success` | `#10B981` | Emerald — validasi penguasaan | `#34d399` |
| `color-error` | `#EF4444` | Red — alert/kesalahan | `#F87171` |

### Typography Scale
**Font System**: Inter (UI body), Manrope (Headings — editorial), Playfair Display (Serif hero accent), Cinzel (Roman decor), Fira Code (Monospace).

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|:-----|:-----|:-----|:-------|:------------|:---------------|
| **Display Hero** | Playfair Display | 56px | Bold | 1.1 | -0.03em |
| **Display L** | Manrope | 48px | ExtraBold (800) | 1.2 | -0.03em |
| **Heading 1** | Manrope | 32px | Semibold (600) | 1.3 | -0.02em |
| **Heading 2** | Manrope | 24px | Semibold (600) | 1.4 | -0.01em |
| **Body Large** | Inter | 18px | Regular (400) | 1.6 | 0 |
| **Body Medium** | Inter | 16px | Regular (400) | 1.5 | 0 |
| **Caption** | Inter | 12px | Medium (500) | 1.4 | 0.02em |
| **Roman Numeral** | Cinzel | 14px | Bold (700) | 1.3 | 0.1em |
| **Code Snippet** | Fira Code | 14px | Regular (400) | 1.5 | 0 |

> **v2.0 Update**: Display Hero menggunakan Playfair Display untuk tampilan editorial yang dramatis. Letter-spacing heading diperketat ke `-0.03em` (dari `-0.02em`) untuk kesan cetak majalah premium.

### Spacing & Layout
*   **Base Unit**: 8px (Skala: 4, 8, 12, 16, 24, 32, 48, 64)
*   **Grid**: 12-kolom Desktop, 4-kolom Mobile. Gutter: 24px.
*   **Border Radius**:

| Token | Value | Penggunaan |
|:------|:------|:-----------|
| `radius-sm` | 4px | Checkbox, tag, input kecil |
| `radius-md` | 8px | Button standard, input field |
| `radius-lg` | 16px | Card utama, modal |
| `radius-full` | 999px | Pill button, avatar |

---

## 3. Visual Language Foundation

### 3.1 Paper Grain Texture (Texture-First)
Tekstur halus grain kertas diterapkan secara global sebagai **karakter visual utama halaman**, bukan sekadar efek dekoratif.

```css
/* v2.0: Opacity ditingkatkan, baseFrequency diperhalus */
body::before {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.65'...");
  opacity: 0.07; /* Naik dari 0.04 */
  mix-blend-mode: multiply; /* Light mode */
  pointer-events: none;
  z-index: 9999;
}
.dark body::before {
  mix-blend-mode: overlay;
  opacity: 0.06;
}
```

### 3.2 Print-Flat Depth System
**Menggantikan glassmorphism dan 3D emboss** sebagai sistem elevasi komponen.

| Level Elevasi | CSS | Penggunaan |
|:-------------|:----|:-----------|
| **Flat** (0) | Tidak ada shadow | Body text, label |
| **Raised** (1) | `0 1px 3px rgba(21,20,15, 0.12)` | Card default |
| **Lifted** (2) | `0 2px 8px rgba(21,20,15, 0.15)` | Card hover, dropdown |
| **Overlay** (3) | `0 4px 16px rgba(21,20,15, 0.18)` | Modal, popover |

**Yang dihapus dari komponen aktif:**
*   ❌ `backdrop-filter: blur()` — hapus dari card, navbar reguler
*   ❌ Multi-layer 3D inset shadow — pertahankan di `skeuo-effects.css` tapi tidak dipakai
*   ❌ `shadow-glow` coral pada state diam — hanya boleh pada state `focus/active`

### 3.3 Deckle Edge — Torn Paper Borders
Komponen CTA utama menggunakan tepi bergelombang organik layaknya kertas disobek.

**Komponen yang menggunakan Deckle Edge:**
- ✅ Button Primary (CTA utama)
- ✅ Badge / Tag status
- ✅ Card section header (bottom edge)

**Komponen yang menggunakan border biasa (accessibility):**
- Input field, checkbox, select — tetap border `radius-md` standar
- Card reguler, sidebar — border tipis `1px solid rgba(21,20,15,0.15)`

```css
/* Contoh implementasi clip-path deckle edge */
.btn-deckle {
  clip-path: polygon(
    0% 5%, 2% 0%, 5% 3%, 8% 0%, 11% 4%, 14% 1%,
    /* ... 20–30 titik irregular ... */
    100% 95%, 98% 100%, 95% 97%, 92% 100%
  );
}
```

### 3.4 Border Style — "Ink Print"
*   **Default border**: `1px solid rgba(21, 20, 15, 0.15)` — ink tipis
*   **Hover border**: `1px solid rgba(237, 111, 92, 0.55)` — coral halus
*   **Focus border**: `2px solid var(--color-accent-coral)` — coral tegas (accessibility)
*   **Dark mode**: `1px solid rgba(239, 231, 210, 0.12)` — parchment tipis

---

## 4. Component Guidelines (v2.0)

### Buttons
| Variant | Bg | Border | Shadow | Edge |
|:--------|:---|:-------|:-------|:-----|
| **Primary** | `color-accent-coral` | Deckle clip-path | Flat raised (1) | Deckle |
| **Secondary** | Transparent | `1px ink solid` | None | Standard radius-md |
| **Ghost** | Transparent | None | None | Standard |
| **AI** | `color-ai-blue` | None | Flat raised (1) | Standard |

**Hover & Transition**: `translateY(-2px)` + `brightness(1.05)`, durasi 200ms ease-out.

### Input Fields
*   Background: `color-bg-canvas` (lebih terang dari surface)
*   Border default: `1px solid rgba(21,20,15, 0.2)` — ink tipis
*   Focus: border `color-accent-coral`, `box-shadow: 0 0 0 3px rgba(237,111,92, 0.15)`
*   Height minimum: 44px (touch target WCAG)

### Cards
*   **v2.0**: Hapus `backdrop-filter: blur()`. Pakai `background: var(--color-bg-surface)` solid.
*   Border: `1px solid rgba(21,20,15, 0.12)` tipis.
*   Shadow: Print-flat level 1 default, level 2 pada hover.
*   Hover: `translateY(-2px)` + shadow level 2, durasi 250ms ease-out.

### AI Chat Components
*   **AI Bubble**: `color-bg-surface`, border transparan, ikon AI warna `color-accent-coral`
*   **User Bubble**: `color-bg-surface-accent`, teks `color-text-primary`
*   **Input Bar**: Sticky bottom, background `color-bg-bone` solid (hapus glassmorphic blur)

### Product-Specific
*   **Course Card**: Surface solid + progress bar `color-success`. Hapus glassmorphic.
*   **Mastery Badge**: Stamp/seal style dengan Cinzel Roman numeral
*   **Adaptive Path**: Garis 1px `color-accent-coral`, node dot

---

## 5. Legacy: Atelier Zero 3D Emboss Utilities
Kelas-kelas 3D embossed/debossed dari v1.0 (`.paper-skeuo`, `.coral-skeuo`, `.gold-skeuo`, dll.) **masih tersimpan di `styles/skeuo-effects.css`** dan tidak dihapus. Kelas-kelas tersebut mungkin digunakan untuk komponen dekoratif atau eksperimental di masa mendatang, tetapi **tidak digunakan pada halaman produk** di v2.0.

---

## 6. Figma File Structure

### Organization
*   🎨 **Foundations** — Tokens, Typography, Colors, Grain Texture
*   🧩 **Components** — Buttons (incl. deckle), Cards, Inputs, Chat
*   🖼️ **Editorial Patterns** — Hero layouts, editorial grids
*   📱 **Mobile Screens**
*   💻 **Desktop Screens**
*   ⚙️ **Prototypes**
*   🗑️ **Archive** — v1.0 3D Emboss Components

---

## 7. Accessibility & Standards

*   **Target**: WCAG 2.1 Level AA.
*   Kontras teks minimal 4.5:1 (normal), 3:1 (large text).
*   Ukuran touch target: minimal 44×44px.
*   Focus ring: `2px solid coral`, selalu terlihat, tidak pernah dihapus.
*   Animasi: `prefers-reduced-motion` wajib direspek — matikan semua transisi.
*   Deckle edge `clip-path` tidak boleh memotong area fokus atau konten teks.

---

*Prepared by: Manus Design System Architect — Version 2.0.0 — 16 Juli 2026*
