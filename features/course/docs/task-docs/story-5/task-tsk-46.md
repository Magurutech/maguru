# Task TSK-46: Desain UI untuk Pembuatan Kursus

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Batasan dan Penyederhanaan](#batasan-dan-penyederhanaan)
3. [Spesifikasi Teknis](#spesifikasi-teknis)
4. [Implementasi Teknis](#implementasi-teknis)
5. [Peningkatan UX](#peningkatan-ux)
6. [Test Plan](#test-plan)
7. [Pertanyaan untuk Diklarifikasi](#pertanyaan-untuk-diklarifikasi)

## Pendahuluan

Task ini berfokus pada pembuatan wireframe dan mockup untuk halaman pengelolaan kursus creator di route `app/creator/course-manage` dengan tema **Ancient Fantasy Asia yang whimsical dan cartoonish**. Desain harus mencakup form pembuatan kursus, daftar kursus, dan aksi edit/hapus dengan mengikuti design system Maguru yang playful namun professional.

**Nilai Bisnis**: Desain UI yang intuitif dengan theme game-like akan meningkatkan engagement creator, membuat experience pengelolaan kursus terasa seperti bermain game sambil mengelola konten pendidikan mereka.

**Konteks dalam Sprint**: Task ini menjadi foundation untuk implementasi frontend dengan theme consistency yang harus selesai sebelum development dimulai, memastikan seluruh platform memiliki visual identity yang kohesif.

## Batasan dan Penyederhanaan

1. **Scope Desain**:
   - Fokus pada 3 halaman utama: Dashboard Kursus, Form Buat Kursus, Form Edit Kursus
   - Tidak termasuk halaman detail kursus atau preview konten
   - Tidak termasuk advanced features seperti bulk actions

2. **Komponen UI**:
   - Menggunakan komponen existing dari Shadcn/ui sebagai base
   - Customization untuk theme Ancient Fantasy Asia (rounded corners, subtle animations)
   - Tidak membuat custom components yang kompleks, fokus pada theming existing components
   - Fokus pada layout, user flow, dan visual identity yang consistent

3. **Responsive Design**:
   - Prioritas desktop-first dengan adaptasi mobile
   - Breakpoint standard: mobile (< 768px), tablet (768px-1024px), desktop (> 1024px)

4. **Interactive Elements**:
   - Wireframe static, tidak perlu prototype interaktif
   - Focus pada struktur informasi dan user flow

## Spesifikasi Teknis

### Struktur Halaman

#### 1. Dashboard Kursus (`/creator/course-manage`)

**Layout Utama** (Ancient Fantasy Theme):

- Header dengan title "Kelola Kursus" (Playfair Display font) + tombol "Buat Kursus Baru" (merah aksi dengan subtle glow)
- Background beige 50 (#F5EDE0) dengan subtle texture
- Filter/search bar (optional untuk v1) dengan rounded-lg dan kuning-orange focus
- Grid/list view kursus dengan spacing yang generous dan cards yang elevated

**Card Kursus** (Ancient Fantasy Theme):

- Thumbnail placeholder dengan border rounded-lg dan subtle shadow-glass
- Judul kursus (Poppins font, beige-900 color untuk kontras)
- Deskripsi (excerpt) dengan warna beige-700
- Badge jumlah modul/pelajaran (hijau alam untuk progress indicator)
- Status indicator dengan color coding (kuning-orange untuk draft)
- Aksi buttons: Edit (kuning-orange), Hapus (merah aksi), View (hijau alam)
- Created/Updated timestamp (smaller text, beige-600)
- Subtle hand-drawn border elements (opsional)

#### 2. Form Pembuatan Kursus (`/creator/course-manage/create`)

**Form Fields** (Ancient Fantasy Styling):

- Judul Kursus (required, max 100 char) - Input dengan border kuning-orange saat focus
- Deskripsi Kursus (required, textarea, max 500 char) - Larger textarea dengan beige background
- Struktur Kursus dengan whimsical design:
  - Dynamic input untuk modul (dengan icon plus yang playful)
  - Nested input untuk pelajaran per modul (indented dengan subtle border)
  - Add/Remove buttons dengan rounded-full style dan subtle animations

**Form Actions** (Color-coded buttons):

- Simpan Draft (hijau alam dengan shadow-neu effect)
- Publikasikan (future) - merah aksi untuk primary action
- Batalkan/Kembali (beige-600 untuk secondary action)

#### 3. Form Edit Kursus (`/creator/course-manage/edit/[id]`)

**Identical dengan Form Pembuatan** namun:

- Pre-filled dengan data existing
- Additional action: Hapus Kursus
- Breadcrumb navigation

### Flow Pengguna

#### Membuat Kursus Baru:

1. Creator di dashboard → klik "Buat Kursus Baru"
2. Redirect ke form pembuatan
3. Isi metadata → klik "Simpan"
4. Success feedback → redirect ke dashboard

#### Mengedit Kursus:

1. Creator di dashboard → klik "Edit" pada card kursus
2. Redirect ke form edit dengan data ter-load
3. Modify data → klik "Update"
4. Success feedback → redirect ke dashboard

#### Menghapus Kursus:

1. Creator klik "Hapus" pada card/form edit
2. Modal konfirmasi muncul
3. Konfirmasi → kursus terhapus → feedback → refresh dashboard

## Implementasi Teknis

### Design Tools dan Deliverables

**Tools**: Figma (recommended) atau wireframe tools lainnya

**Deliverables**:

1. **Wireframe** (low-fidelity): Struktur layout dan user flow
2. **Mockup** (high-fidelity): Visual design dengan Ancient Fantasy theme, specific color usage, Poppins typography, dan organic spacing
3. **Component Inventory**: Daftar komponen Shadcn/ui dengan theme customizations (colors, rounded corners, shadows)
4. **Responsive Breakdowns**: Desktop, tablet, mobile views
5. **User Flow Diagram**: Visual representation dari user journey

### Design System Compliance - Ancient Fantasy Asia Theme

**Colors** (Maguru Palette):

- **Primary**: Merah aksi (#FF4D4D) untuk tombol utama dan call-to-action
- **Secondary**: Kuning-orange (#FFB148) untuk highlight dan secondary actions
- **Background**: Beige 50-200 (#F5EDE0 - #E8D9C6) untuk latar belakang utama
- **Accent**: Hijau alam (#86D4A6 - #5AC88A) untuk indikator progress dan success states
- **Text**: Beige 900 (#7B5B2C) untuk text primary, Beige 700 untuk text secondary

**Typography**:

- **Primary Font**: Poppins (headings, body text) untuk readability
- **Accent Font**: Playfair Display (untuk headings khusus atau quotes)
- **Monospace**: Fira Code (untuk technical content atau data)

**Spacing**: Scale 4px (space-4, space-8, gap-4, p-4, dll) mengikuti Tailwind

**Components**: Shadcn/ui dengan customization theme:

- Button dengan rounded-lg dan shadow-neu effects
- Card dengan shadow-glass dan subtle borders
- Input dengan focus states kuning-orange
- Dialog dengan beige background dan rounded corners

### Accessibility Considerations

- Color contrast ratio minimal 4.5:1 (beige 900 pada beige 50 background)
- Focus states dengan kuning-orange outline (#FFB148) untuk visibility
- Screen reader friendly labels dengan descriptive aria-labels
- Logical tab order yang mengikuti visual hierarchy
- Alternative text untuk decorative elements (hand-drawn borders)
- Reduced motion preferences untuk users dengan motion sensitivity

## Peningkatan UX - Ancient Fantasy Experience

### Visual Hierarchy dengan Theme

- Clear distinction antara primary (merah aksi) dan secondary actions (kuning-orange)
- Consistent card design dengan shadow-glass untuk depth perception
- Progressive disclosure untuk form yang kompleks dengan whimsical animations
- Hand-drawn style borders dan icons untuk authentic fantasy feel

### Feedback Mechanisms dengan Personality

- Loading states dengan subtle animations (spinning elements dengan organic feel)
- Success notifications dengan hijau alam color dan gentle bounce effect
- Error notifications dengan merah aksi dan shake animation
- Validation feedback immediate dengan inline colors (kuning-orange untuk warnings)

### Mobile Experience - Touch-Friendly Fantasy

- Touch-friendly button sizes (min 44px) dengan rounded-full untuk organic feel
- Simplified navigation dengan bottom sheet patterns
- Condensed card information dengan clear visual hierarchy
- Thumb-friendly action buttons pada bottom of cards

### Game-Like Efficiency Features

- Micro-interactions untuk user engagement (hover effects, gentle transitions)
- Visual progress indicators menggunakan hijau alam
- Success celebrations dengan subtle confetti atau glow effects
- Intuitive drag handles dengan visual feedback (future untuk reordering)

## Test Plan

### Design Review Checklist

- [ ] Wireframe approved oleh Product Owner
- [ ] Mockup sesuai dengan Maguru Ancient Fantasy theme (color palette, typography, organic elements)
- [ ] Responsive design tested pada multiple screen sizes dengan theme consistency
- [ ] User flow dapat diikuti dengan logical progression dan visual hierarchy
- [ ] Accessibility guidelines terpenuhi dengan proper contrast ratios dan focus states
- [ ] Component inventory documented dengan theme customizations
- [ ] Color usage consistent dengan Maguru palette (beige, kuning-orange, hijau alam, merah aksi)
- [ ] Typography menggunakan Poppins untuk readability dan Playfair Display untuk headings
- [ ] Whimsical elements tidak mengganggu usability dan functionality

### User Testing (Optional)

- [ ] Usability testing dengan 3-5 creator
- [ ] Task completion rate untuk create/edit/delete flow
- [ ] User feedback tentang clarity dan ease of use

### Technical Validation

- [ ] Semua required components tersedia di Shadcn/ui
- [ ] Design feasible untuk implementasi dalam timeline
- [ ] No custom components yang memerlukan development time besar

## Pertanyaan untuk Diklarifikasi

1. **Theme Implementation**: Seberapa strong Ancient Fantasy elements yang diinginkan? Apakah perlu hand-drawn illustrations atau cukup dengan color palette dan typography?

2. **Thumbnail Kursus**: Untuk v1, apakah menggunakan placeholder image dengan fantasy frame atau simple geometric placeholder dengan theme colors?

3. **Struktur Modul/Pelajaran**: Bagaimana UX untuk menambah/mengurangi modul dan pelajaran? Simple buttons dengan whimsical icons atau future drag & drop dengan organic animations?

4. **Validation Feedback**: Seberapa real-time validation feedback yang diinginkan? Inline dengan kuning-orange colors atau toast notifications dengan theme styling?

5. **Empty States**: Bagaimana tampilan dashboard ketika creator belum memiliki kursus? Illustration dengan fantasy theme atau simple text dengan call-to-action?

6. **Confirmation Patterns**: Apakah ada standard pattern untuk confirmation dialog? Modal dengan beige background dan theme colors atau custom overlay?

7. **Navigation**: Bagaimana pattern navigation dari form kembali ke dashboard? Breadcrumb dengan theme styling, back button, atau both?

8. **Data Loading**: Bagaimana menampilkan loading state? Spinner dengan organic feel atau skeleton loading dengan theme colors?

9. **Micro-interactions**: Seberapa detailed animations yang diinginkan untuk hover states, button clicks, dan transitions?

10. **Decorative Elements**: Apakah perlu subtle hand-drawn borders atau ornaments pada cards dan containers?

## Referensi

- [Shadcn/ui Components](https://ui.shadcn.com/docs/components) - Base components untuk customization
- Maguru UI/UX Consistency Rules - Theme guidelines dan color palette
- Maguru Theme Instructions - Ancient Fantasy Asia specifications
- [Tailwind CSS](https://tailwindcss.com/docs) - Spacing scale dan utility classes
- [Heroicons](https://heroicons.com/) - Icon system untuk consistency
- Competitor analysis untuk course management UI (Udemy, Skillshare untuk UX patterns)
- Game UI inspiration untuk whimsical elements dan micro-interactions
