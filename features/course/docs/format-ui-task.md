# Format UI Task Documentation

## Tujuan Panduan

Dokumen ini berisi panduan standar format dokumentasi UI/UX task dalam project Maguru yang mengikuti design system Ancient Fantasy Asia. Panduan ini memastikan konsistensi visual, accessibility, dan user experience yang optimal sesuai dengan brand Maguru.

## Format Standar UI Task

# UI Task [ID]: [Judul Task]

## Daftar Isi

1. [Pendahuluan](mdc:#pendahuluan)
2. [Design System & Theme](mdc:#design-system--theme)
3. [Pages yang Akan Dibuat](mdc:#pages-yang-akan-dibuat)
4. [User Flow & Interaction](mdc:#user-flow--interaction)
5. [Responsive Design](mdc:#responsive-design)
6. [Accessibility & Performance](mdc:#accessibility--performance)
7. [Acceptance Criteria](mdc:#acceptance-criteria)

## Pendahuluan

[Deskripsi singkat task UI/UX (1-2 paragraf) mencakup tujuan, konteks dalam design system, dan nilai user experience yang dihasilkan]

## Design System & Theme

### Color Palette (Mengikuti theme-instruksi.mdc)

**Primary Colors:**

- **Merah Aksi 500** (#FF4D4D) - Tombol aksi utama dan CTA buttons
- **Kuning-Orange 400** (#FFB148) - Highlight dan elemen dekoratif
- **Hijau Alam 400** (#70CE98) - Status positif dan success states

**Background Colors:**

- **Beige 50** (#F5EDE0) - Background utama halaman
- **Beige 100** (#F2EADC) - Card background dan section backgrounds
- **Beige 200** (#E8D9C6) - Secondary backgrounds dan dividers

**Text Colors:**

- **Beige 900** (#7B5B2C) - Text utama dan headings
- **Beige 700** (#8A6D42) - Text sekunder dan descriptions

### Typography

- **Font Family**: Inter (sans-serif) untuk keterbacaan optimal
- **Heading**: Font weight 600-700 untuk hierarchy yang jelas
- **Body Text**: Font weight 400-500 untuk konten utama
- **Button Text**: Font weight 500-600 untuk emphasis

### Visual Elements

- **Glass Panel Effect**: Subtle backdrop-blur dengan border transparan
- **Ancient Fantasy Motifs**: Border dekoratif dengan elemen budaya Indonesia
- **Whimsical Icons**: Custom icons dengan tema cartoonish
- **Smooth Transitions**: CSS transitions untuk state changes

## Pages yang Akan Dibuat

### 1. **[Nama Page]** (`app/[path]/page.tsx`)

**Deskripsi:**
[Deskripsi singkat tentang halaman dan tujuannya]

**Layout Structure:**

```
┌─────────────────────────────────────┐
│ Header Section                      │
│ ┌─────────────────────────────────┐ │
│ │ [Component 1] [Component 2]     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Main Content Area                   │
│ ┌─────────┐ ┌─────────────────────┐ │
│ │ Sidebar │ │ Primary Content     │ │
│ │         │ │                     │ │
│ └─────────┘ └─────────────────────┘ │
├─────────────────────────────────────┤
│ Footer Section                      │
└─────────────────────────────────────┘
```

**Key Features:**

- [Feature 1]
- [Feature 2]
- [Feature 3]

**Components yang Akan Dibuat:**

#### 1.1 **[ComponentName]** (`features/[feature]/components/[path]/ComponentName.tsx`)

**Props:**

```typescript
interface ComponentNameProps {
  // Define props here
}
```

**Design Elements:**

- [Design element 1]
- [Design element 2]
- [Design element 3]

**States:**

- **Default**: [Description]
- **Hover**: [Description]
- **Active**: [Description]
- **Disabled**: [Description]

#### 1.2 **[ComponentName2]** (`features/[feature]/components/[path]/ComponentName2.tsx`)

**Props:**

```typescript
interface ComponentName2Props {
  // Define props here
}
```

**Design Elements:**

- [Design element 1]
- [Design element 2]
- [Design element 3]

**Features:**

- [Feature 1]
- [Feature 2]
- [Feature 3]

### 2. **[Nama Page 2]** (`app/[path2]/page.tsx`)

**Deskripsi:**
[Deskripsi singkat tentang halaman dan tujuannya]

**Layout Structure:**

```
┌─────────────────────────────────────┐
│ [Layout structure diagram]          │
└─────────────────────────────────────┘
```

**Key Features:**

- [Feature 1]
- [Feature 2]
- [Feature 3]

**Components yang Akan Dibuat:**

#### 2.1 **[ComponentName]** (`features/[feature]/components/[path]/ComponentName.tsx`)

**Props:**

```typescript
interface ComponentNameProps {
  // Define props here
}
```

**Design Elements:**

- [Design element 1]
- [Design element 2]
- [Design element 3]

## User Flow & Interaction

### 1. **[Flow Name]**

```
User action 1
    ↓
System response 1
    ↓
User action 2
    ↓
System response 2
```

### 2. **[Flow Name 2]**

```
User action 1
    ↓
System response 1
    ↓
User action 2
    ↓
System response 2
```

## Responsive Design

### Mobile (320px - 768px)

- **Layout**: [Description]
- **Components**: [Description]
- **Navigation**: [Description]
- **Touch Targets**: Minimum 44px height

### Tablet (768px - 1024px)

- **Layout**: [Description]
- **Components**: [Description]
- **Navigation**: [Description]

### Desktop (1024px+)

- **Layout**: [Description]
- **Components**: [Description]
- **Navigation**: [Description]

## Accessibility & Performance

### Accessibility Features

- **ARIA Labels**: Proper labeling untuk semua interactive elements
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators dan logical tab order
- **Screen Reader**: Semantic HTML dan descriptive text
- **Color Contrast**: WCAG 2.1 AA compliance

### Performance Optimizations

- **Image Optimization**: Next.js Image component dengan lazy loading
- **Code Splitting**: Dynamic imports untuk heavy components
- **Memoization**: React.memo untuk expensive components
- **Debouncing**: Input debouncing untuk performance
- **Skeleton Loading**: Perceived performance improvement

## Acceptance Criteria

### Visual Design

- [ ] Components menggunakan glass panel effect dengan tema Ancient Fantasy Asia
- [ ] Color palette mengikuti theme-instruksi.mdc
- [ ] Typography konsisten dengan Inter font family
- [ ] Hover effects dan transitions smooth dan responsif
- [ ] Loading states dan skeleton screens diimplementasikan

### Component Functionality

- [ ] [Component 1] berfungsi sesuai spesifikasi
- [ ] [Component 2] berfungsi sesuai spesifikasi
- [ ] [Component 3] berfungsi sesuai spesifikasi

### User Experience

- [ ] User flow intuitif dengan clear feedback
- [ ] Responsive design bekerja optimal di semua device sizes
- [ ] Loading states memberikan feedback yang jelas
- [ ] Error states ditangani dengan graceful fallbacks

### Technical Requirements

- [ ] Components menggunakan Shadcn/ui sebagai foundation
- [ ] Custom styling mengikuti design system Maguru
- [ ] Accessibility requirements terpenuhi (WCAG 2.1 AA)
- [ ] Performance optimizations diimplementasikan
- [ ] Cross-browser compatibility validated

## Estimasi Effort

**Total: [X] jam**

- Design system implementation: [X] jam
- Page components development: [X] jam
- Responsive design: [X] jam
- Testing dan refinement: [X] jam

## Dependencies

- [Dependency 1]
- [Dependency 2]
- [Dependency 3]

## Panduan Penggunaan

### Penamaan File

- Format: `ui-task-[ID].md` (contoh: `ui-task-50.md`)
- Simpan di direktori `features/[feature-name]/docs/task-docs/`

### Panduan Penulisan

1. **Design System First**: Selalu mengacu pada color palette dan typography yang sudah didefinisikan
2. **Shadcn/ui Foundation**: Gunakan komponen Shadcn/ui sebagai base, custom styling hanya jika diperlukan
3. **Accessibility Priority**: Pastikan semua komponen accessible dari awal
4. **Mobile-First**: Design untuk mobile terlebih dahulu, kemudian scale up
5. **Performance Conscious**: Pertimbangkan performance dalam setiap design decision
6. **Component Organization**: Kelompokkan components berdasarkan page implementation

### Visual Guidelines

#### Color Usage

- **Primary Actions**: Merah Aksi 500 (#FF4D4D)
- **Secondary Actions**: Kuning-Orange 400 (#FFB148)
- **Success States**: Hijau Alam 400 (#70CE98)
- **Backgrounds**: Beige 50-200 range
- **Text**: Beige 700-900 range

#### Component Styling

- **Cards**: Glass panel effect dengan backdrop-blur
- **Buttons**: Rounded corners dengan hover effects
- **Inputs**: Subtle borders dengan focus states
- **Modals**: Backdrop blur dengan glass panel

#### Animation Guidelines

- **Duration**: 150-300ms untuk micro-interactions
- **Easing**: ease-out untuk natural feel
- **Scale**: 1.02-1.05 untuk hover effects
- **Opacity**: 0.8-0.9 untuk disabled states

### Integration dengan Existing System

#### Shadcn/ui Components

```typescript
// Gunakan Shadcn/ui sebagai foundation
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Custom styling dengan Tailwind
<Card className="backdrop-blur-sm bg-beige-100/80 border-beige-200">
  <Button className="bg-red-500 hover:bg-red-600 text-white">
    Primary Action
  </Button>
</Card>
```

#### Tailwind Configuration

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#F5EDE0',
          100: '#F2EADC',
          200: '#E8D9C6',
          700: '#8A6D42',
          900: '#7B5B2C',
        },
        'red-action': {
          500: '#FF4D4D',
          600: '#E62E2E',
        },
        'yellow-orange': {
          400: '#FFB148',
        },
        'green-nature': {
          400: '#70CE98',
        },
      },
    },
  },
}
```

### Component Documentation Structure

#### Untuk Setiap Component:

1. **Props Interface**: TypeScript interface untuk props
2. **Design Elements**: Visual styling dan layout details
3. **States**: Default, hover, active, disabled states
4. **Features**: Functional capabilities
5. **Layout**: Visual structure (jika diperlukan)

#### Layout Structure Guidelines:

```
┌─────────────────────────────────────┐
│ [Component Layout]                  │
│ ┌─────────────────────────────────┐ │
│ │ [Element 1] [Element 2]         │ │
│ │ [Element 3]                     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Quality Assurance Checklist

#### Design Review

- [ ] Color palette konsisten dengan theme
- [ ] Typography hierarchy jelas
- [ ] Visual elements sesuai dengan brand
- [ ] Spacing dan alignment konsisten
- [ ] Components terorganisir berdasarkan page

#### Accessibility Review

- [ ] ARIA labels lengkap
- [ ] Keyboard navigation berfungsi
- [ ] Color contrast memenuhi WCAG 2.1 AA
- [ ] Screen reader friendly

#### Performance Review

- [ ] Images optimized
- [ ] Components lazy loaded jika perlu
- [ ] Bundle size reasonable
- [ ] Loading states implemented

#### Cross-browser Review

- [ ] Chrome/Chromium compatibility
- [ ] Firefox compatibility
- [ ] Safari compatibility
- [ ] Mobile browsers compatibility

### Best Practices

#### Component Organization

- **Page-Based Structure**: Kelompokkan components berdasarkan page implementation
- **Reusability**: Identifikasi components yang bisa di-reuse
- **Naming Convention**: Gunakan nama yang deskriptif dan konsisten
- **File Structure**: Ikuti struktur folder yang sudah ditetapkan

#### Documentation Standards

- **Clear Descriptions**: Jelaskan tujuan dan fungsi setiap component
- **Visual Examples**: Sertakan layout diagrams untuk clarity
- **State Documentation**: Dokumentasikan semua possible states
- **Props Documentation**: Jelaskan setiap prop dengan detail

#### Implementation Guidelines

- **Shadcn/ui First**: Gunakan Shadcn/ui components sebagai foundation
- **Custom Styling**: Hanya custom styling jika diperlukan
- **Responsive Design**: Implementasikan mobile-first approach
- **Accessibility**: Pastikan accessible dari awal development
