# Task: Course Page Feature Implementation

## Overview
Membuat halaman kursus untuk menampilkan konten pembelajaran dengan tab interface menggunakan markdown files. Target user adalah students untuk viewing content dengan progress tracking.

## Enhanced Design Decision
**Tab Interface Implementation**: Course detail page menggunakan 2-tab interface untuk memisahkan overview dan kurikulum, memberikan user experience yang lebih terstruktur dan user-friendly.

## Scope Definition

###  **In Scope:**
- Frontend static course pages (listing & detail)
- Markdown content rendering dari `docs/course/`
- Hierarchical structure: Course � Sections � Learning Items
- Progress tracking untuk students
- Responsive design (mobile viewing)
- Integration dengan existing design system

### L **Out of Scope:**
- Content editing features
- Creator/admin dashboard integration
- User authentication untuk course access
- Payment/subscription system
- Interactive quizzes atau assignments
- Backend API development

## User Stories

### Primary User Stories
1. **Sebagai Student**, saya ingin melihat semua available courses di halaman listing
2. **Sebagai Student**, saya ingin mengakses course detail dengan timeline materi
3. **Sebagai Student**, saya bisa melihat progress pembelajaran saya
4. **Sebagai Student**, saya bisa navigasi antar sections dan learning items

### Secondary User Stories
5. **Sebagai Student**, saya ingin melihat overview information (duration, level, instructor)
6. **Sebagai Student**, saya ingin mobile-friendly viewing experience

## Task Breakdown

### Epic 1: Course Structure Setup
**Goal**: Membuat struktur data dan routing untuk course pages

#### Task 1.1: Data Structure Definition
- Buat struktur folder di `docs/course/`
- Define metadata schema untuk course.md
- Buat sample content untuk testing

#### Task 1.2: Routing Setup
- Buat `/course` route untuk listing
- Buat `/course/[slug]` route untuk detail
- Setup layout dan navigation

### Epic 2: Course Listing Page
**Goal**: Menampilkan semua available courses

#### Task 2.1: Course Data Loading
- Buat function untuk scan `docs/course/` folders
- Parse course metadata dari course.md files
- Handle course data structuring

#### Task 2.2: UI Implementation
- Design course grid layout
- Implement course cards dengan metadata
- Add filtering/search capability (basic)

#### Task 2.3: Navigation & Routing
- Implement course card click to detail page
- Add breadcrumbs navigation
- Handle loading states

### Epic 3: Enhanced Course Detail Page dengan Tab Interface
**Goal**: Menampilkan course overview dan timeline dengan tab interface yang intuitive

#### Task 3.1: Enhanced Course Header
- Course information display dengan existing pattern
- Progress indicator integration
- Enhanced navigation breadcrumbs
- Tab navigation integration point

#### Task 3.2: Tab Interface Implementation
- **NEW MAJOR**: Implement Tab navigation menggunakan shadcn/ui Tabs
- Tab state management (active tab, navigation logic)
- Smooth transitions antar Overview dan Timeline tabs
- Mobile-responsive tab design

#### Task 3.3: Overview Content Renderer
- **NEW**: Parse overview content dari course.md bagian bawah (setelah frontmatter)
- Markdown rendering dengan design system styling
- Responsive typography untuk readability
- Progress integration dengan subtle indicators

#### Task 3.4: Timeline Preview Component
- **NEW**: Section headers dari setiap section folder
- Course structure visualization dengan collapsible sections
- Section item listing dengan progress indicators
- Click handlers untuk section navigation (untuk learning mode)

#### Task 3.5: Enhanced Data Loading & Progress Tracking
- **ENHANCED**: loadCourse() function untuk extract overview content
- Parse section headers untuk timeline preview
- Enhanced data structure dengan overviewContent field
- Existing progress tracking functionality

### Epic 4: Learning Mode Implementation & Enhanced Navigation
**Goal**: Implementasi learning mode dan enhanced navigation dengan mobile optimization

#### Task 4.1: Learning Mode Page Implementation
- **NEW**: Create `/course/[slug]/learn/page.tsx` untuk full learning experience
- Existing timeline navigation functionality pindah ke learning mode
- Content rendering untuk section items dengan enhanced UI
- Progress tracking dan navigation controls (Previous/Next/Mark Complete)
- Mobile-optimized sidebar timeline navigation

#### Task 4.2: Enhanced Navigation Logic
- **ENHANCED**: CourseHeader button logic untuk tab navigation
- "Mulai Belajar" button navigates ke `/course/[slug]/learn`
- Enhanced tab navigation state management
- Deep linking support untuk specific learning content
- Breadcrumb navigation enhancement

#### Task 4.3: Mobile Optimization for Tab Interface
- **ENHANCED**: Mobile-responsive tab design
- Touch-friendly tab switching
- Swipe gestures untuk tab navigation (optional enhancement)
- Optimized mobile timeline preview
- Performance optimization untuk mobile rendering

#### Task 4.4: Final Polish & Performance Optimization
- Lazy loading untuk overview dan timeline content
- Optimized markdown rendering performance
- Smooth transitions dan micro-interactions
- Error handling dan edge cases
- Cross-browser compatibility testing

### Epic 5: Advanced Content Rendering Implementation
**Goal**: Implementasi enhanced content rendering dengan react-markdown ecosystem dan interactive learning features

#### Task 5.1: React-Markdown Integration with Plugin Ecosystem
- **NEW**: Replace custom ContentRenderer.tsx dengan react-markdown implementation
- **NEW**: Integrate remark-gfm untuk GitHub Flavored Markdown support (tables, task lists, strikethrough)
- **NEW**: Implement rehype-katex dan remark-math untuk mathematical expressions
- **NEW**: Setup rehype-raw untuk controlled HTML rendering
- **NEW**: Custom component mapping untuk existing design system integration

#### Task 5.2: Advanced Syntax Highlighting & Code Features
- **NEW**: Implement react-syntax-highlighter dengan 300+ language support
- **NEW**: Add interactive code blocks dengan copy-to-clipboard functionality
- **NEW**: Implement line numbers dan code highlighting features
- **NEW**: Create custom syntax theme yang sesuai dengan Ancient Fantasy Asia design system
- **NEW**: Add code block title bars dengan language indicators

#### Task 5.3: Interactive Learning Components Framework
- **NEW**: Develop QuizComponent framework untuk embedded assessments
- **NEW**: Create ExerciseComponent untuk interactive practice problems
- **NEW**: Implement VideoEmbed component untuk multimedia integration
- **NEW**: Add ProgressTracker component untuk inline progress indication
- **NEW**: Create InteractiveNote component untuk student annotations

#### Task 5.4: Performance Optimization & Accessibility
- **NEW**: Implement lazy loading untuk syntax highlighting on demand
- **NEW**: Add progressive enhancement untuk better mobile performance
- **NEW**: Ensure WCAG 2.1 AA compliance untuk semua content components
- **NEW**: Implement keyboard navigation dan screen reader support
- **NEW**: Add ARIA labels dan semantic HTML structure
- **NEW**: Create fallback rendering untuk unsupported features

## Technical Requirements

### Dependencies
- **UPDATED**: React markdown rendering library (react-markdown ecosystem)
- Existing UI components (shadcn/ui)
- **NEW**: shadcn/ui Tabs component (@radix-ui/react-tabs)
- **NEW**: Advanced syntax highlighting (react-syntax-highlighter)
- **NEW**: Mathematical expressions support (rehype-katex)
- Design system tokens
- Local storage untuk progress tracking

## UI/UX Style Guidelines

### Theme Integration
**Ancient Fantasy Asia Theme** dengan Whimsical & Cartoonish aesthetic:
- **Visual Style**: Hand-drawn, playful namun detail, dengan elemen alam (tanaman, bunga, lanskap hijau)
- **Core Principle**: Shadcn UI first, custom hanya jika tidak tersedia
- **Design Tokens**: Semua warna, radius, shadow, font didefinisikan di Tailwind config

### Color Palette & Usage
```
🎨 **Beige (Background)**: #F5EDE0 (50) → #7B5B2C (900)
🧡 **Yellow-Orange (Accent)**: #FFE8C4 (50) → #B96500 (900)
🌿 **Green (Nature/Progress)**: #C8E6D0 (50) → #02B052 (900)
🔴 **Red (Action/CTA)**: #FFCCCB (50) → #B22424 (900)
```

**Usage Guidelines untuk Course Pages:**
- **Primary Actions**: Merah aksi 500 (`#FF4D4D`) untuk tombol navigasi & CTA
- **Secondary/Highlights**: Kuning-orange 400 (`#FFB148`) untuk accents & decorative elements
- **Backgrounds**: Beige 50-200 (`#F5EDE0` - `#E8D9C6`) untuk main backgrounds
- **Progress/Success**: Hijau alam 300-500 (`#86D4A6` - `#5AC88A`) untuk progress indicators

### Typography System
- **Primary**: Poppins (headings, body text)
- **Accent**: Playfair Display (optional, quotes/special headings)
- **Code**: Fira Code (technical content dalam markdown)

### Interactive States
**Hover Effects:**
- Scale transforms (`scale-105`) untuk subtle feedback
- Color shifts dengan shadow enhancements
- Consistent 200-300ms transitions menggunakan `cubic-bezier(0.4, 0, 0.2, 1)`

**Focus Management:**
- 2px red outline dengan 2px offset untuk accessibility
- Input-specific focus states dengan border dan shadow changes
- ARIA labels dan screen reader support

### Component Design Patterns
**Course Cards (Listing Page):**
- Glass panel effect dengan `shadow-glass` (0 4px 20px rgba(0,0,0,0.1))
- Hover: `translateY(-2px)` + `shadow-xl` + `border-2 border-kuning-orange-300`
- Progress indicators menggunakan hijau alam gradient
- Minimum touch targets: 44px x 44px untuk mobile

**Timeline Navigation (Detail Page):**
- Active state dengan background kuning-orange 100
- Completed items dengan hijau alam 500 checkmarks
- Smooth transitions untuk state changes
- Collapsible sections untuk mobile optimization

### Responsive Design Guidelines
**Breakpoints:**
- **Mobile** (< 768px): Stack layout, larger touch targets
- **Tablet** (768px - 1024px): Side-by-side layout
- **Desktop** (> 1024px): Full layout dengan hover states

**Mobile-First Considerations:**
- Touch-friendly navigation (44px minimum)
- Swipe gestures untuk timeline navigation
- Haptic feedback untuk interactions
- Performance optimization untuk mobile networks

### File Structure
```
docs/course/
   web-development-basics/
      course.md          # metadata & overview
      section-1/
         intro-html.md
         css-basics.md
      section-2/
          javascript-intro.md
   react-fundamentals/
       course.md
       ...
```

### Component Structure
```
app/course/
   page.tsx              # course listing
   [slug]/
      page.tsx          # course detail


features/course
      components/
         CourseHeader.tsx
         TimelineNav.tsx
         ContentRenderer.tsx
      lib/
          courseUtils.ts
          markdownUtils.ts
    |-- Hooks/
        |-- useCourse.ts 


```

### Architecture Principles

#### **Simplified Feature-First Pattern**
Berdasarkan existing patterns di `features/auth` dan `features/homepage`:

1. **Feature Structure**: Mengikuti `features/[feature]/` pattern yang sudah ada
2. **Layer Separation**:
   - **Presentation Layer**: React components di `components/`
   - **Logic Layer**: Custom hooks di `hooks/` untuk business logic
   - **Data Layer**: API functions di `api.ts` dan utilities di `lib/`

#### **State Management Hierarchy**
1. **Feature State** → Custom hooks (`useCourse`, `useCourseProgress`) - **Preferred approach**
2. **Component State** → useState/useReducer untuk local UI state
3. **Global State** → Context API hanya jika truly needed (avoid over-engineering)

#### **Naming Conventions**
- **Files/Directories**: `kebab-case` (e.g., `course-card.tsx`)
- **Components**: `PascalCase` (e.g., `CourseCard.tsx`)
- **Hooks**: `use` prefix + `camelCase` (e.g., `useCourse.ts`)
- **API Files**: `api.ts` (consistent across all features)
- **Types**: `[feature].types.ts` dalam `types/` folder

#### **Integration dengan Existing Patterns**
- **Import Path**: `@/features/course/components/CourseCard`
- **Shared Components**: Gunakan existing shadcn/ui components dari `@/components/ui/`
- **Utilities**: Reuse existing utilities dari `@/lib/` jika available
- **Design System**: Ikuti Ancient Fantasy Asia theme dari existing docs

## Assumptions & Dependencies

### Assumptions
- Markdown files akan ditulis manual di `docs/course/`
- Course metadata akan di-update manual
- Progress tracking menggunakan local storage browser
- Tidak perlu authentication untuk course access

### Dependencies
- Existing design system dan UI components
- Next.js App Router capabilities
- Markdown parsing library integration

### Detailed Technical Requirements

#### **Dependencies & Libraries**
```json
{
  "dependencies": {
    "react-markdown": "^9.0.0",           // React markdown rendering (REPLACES markdown-it)
    "remark-gfm": "^4.0.0",              // GitHub Flavored Markdown support
    "react-syntax-highlighter": "^15.5.0", // Advanced syntax highlighting (300+ languages)
    "rehype-katex": "^7.0.0",            // Mathematical expressions (LaTeX)
    "remark-math": "^6.0.0",              // Math parsing for markdown
    "rehype-raw": "^7.0.0",              // Safe HTML rendering
    "@heroicons/react": "^2.0.18",       // Icons (sesuai existing pattern)
    "clsx": "^2.1.1",                    // Conditional styling
    "tailwind-merge": "^2.5.4"           // Tailwind class merging
  }
}
```

#### **Bundle Size & Performance**
- **Expected Bundle Size Increase**: ~120KB (optimized with tree-shaking)
- **Performance Target**: <100ms render time untuk typical content
- **Lazy Loading**: Syntax highlighting on demand untuk large content
- **Lighthouse Score Target**: 95+ performance rating

#### **Design System Integration**
**Component Priority:**
1. **Shadcn UI Components First**: Gunakan existing components dari `@/components/ui/`
   - `Button`, `Card`, `Badge`, `Progress`, `Breadcrumb`, `Skeleton`
   - `ScrollArea` untuk timeline navigation
   - `Separator` untuk visual hierarchy

2. **Custom Components** (jika shadcn tidak tersedia):
   - `CourseCard` dengan glass panel effect
   - `TimelineNav` dengan custom styling
   - `ContentRenderer` dengan react-markdown integration
   - `InteractiveCodeBlock` dengan copy functionality dan syntax highlighting
   - `QuizComponent` untuk interactive learning elements
   - `MathRenderer` untuk mathematical expressions
   - `VideoEmbed` untuk multimedia content

**Styling Implementation:**
```css
/* Custom CSS variables untuk Ancient Fantasy Asia theme */
:root {
  --beige-50: #F5EDE0;
  --beige-900: #7B5B2C;
  --kuning-orange-400: #FFB148;
  --merah-aksi-500: #FF4D4D;
  --hijau-alam-500: #5AC88A;
  --shadow-glass: 0 4px 20px rgba(0,0,0,0.1);
}

/* Custom animations */
.course-card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-item-active {
  background: linear-gradient(90deg, var(--kuning-orange-100) 0%, transparent 100%);
}
```

#### **Performance & Optimization Requirements**
**Loading Strategy:**
- **Lazy Loading**: Implementasi untuk course content dan images
- **Code Splitting**: Separate bundles untuk listing dan detail pages
- **Progressive Enhancement**: Skeleton → Content → Interactive elements

**Caching Strategy:**
- **Markdown Content**: Client-side caching untuk parsed markdown
- **Progress Data**: Local storage dengan TTL (time-to-live)
- **Static Assets**: Next.js Image optimization

#### **Accessibility Requirements**
**WCAG 2.1 AA Compliance:**
- **Keyboard Navigation**: Tab order logical, skip links implemented
- **Screen Reader Support**: Proper ARIA labels, headings hierarchy
- **Focus Management**: Visible focus indicators, focus trap dalam modals
- **Color Contrast**: Minimum 4.5:1 untuk normal text

**Implementation Checklist:**
- [ ] Semantic HTML5 elements (`<main>`, `<nav>`, `<section>`)
- [ ] ARIA labels untuk interactive elements
- [ ] Alt text untuk images dalam markdown content
- [ ] Focus visible states dengan 2px outline
- [ ] Reduced motion support

#### **Responsive Design Specifications**
**Mobile (< 768px):**
- Timeline navigation: Collapsible accordion pattern
- Course cards: Single column layout dengan swipe gestures
- Touch targets: Minimum 44px
- Typography: Scale appropriately for smaller screens

**Tablet (768px - 1024px):**
- Timeline: Fixed sidebar dengan scroll area
- Content area: Optimized reading width (65-75 characters)
- Course grid: 2-column layout

**Desktop (> 1024px):**
- Timeline: Sticky sidebar navigation
- Content: Full-width reading experience
- Course grid: 3-4 column responsive layout
- Hover states untuk enhanced interactivity

#### **Error Handling & Edge Cases**
**Content Loading:**
- Markdown parsing errors dengan fallback UI
- Missing course files dengan helpful error messages
- Network connectivity issues dengan offline indicators

**Progress Tracking:**
- Local storage quota exceeded handling
- Progress data corruption dengan recovery mechanism
- Cross-tab synchronization untuk progress updates

## Success Criteria

### Functional Criteria
-  Course listing page menampilkan semua available courses
-  Course detail page menampilkan timeline navigasi
-  Markdown content ter-render dengan benar
-  Progress tracking berfungsi di local storage
-  Mobile responsive design

### Non-Functional Criteria
-  Performance: fast loading time
-  Accessibility: WCAG compliance
-  User Experience: intuitive navigation
-  Code Quality: clean, maintainable code

## Recommendations for Future Development

### Phase 2 Features (Out of Scope for Now)
1. **Content Management System**
   - Admin dashboard untuk course management
   - Rich text editor untuk content creation
   - File upload capability

2. **Interactive Features**
   - Quizzes dan assessments
   - Discussion forums
   - Assignment submissions

3. **User Management**
   - Authentication integration
   - Enrollment system
   - Certificate generation

4. **Advanced Analytics**
   - Progress tracking di backend
   - Learning analytics
   - Engagement metrics

### Technical Improvements
1. **Performance**
   - Content caching strategy
   - CDN integration untuk assets
   - Progressive loading

2. **SEO Optimization**
   - Meta tags untuk courses
   - Structured data
   - Sitemap generation

3. **Content Delivery**
   - Multi-language support
   - Offline capability
   - Content versioning

## Risk Assessment

### Technical Risks
- **Low**: Markdown parsing complexity
- **Low**: Integration dengan existing design system
- **Medium**: Performance dengan large content files

### Mitigation Strategies
- Use established markdown parsing libraries
- Implement lazy loading untuk content
- Follow existing component patterns

## Timeline Estimate

### Epic 1: Foundation Setup (2 days)
- Task 1.1: Data Structure Definition - 1 day
  - Create `docs/course/` structure
  - Define metadata schema
  - Create sample content
- Task 1.2: Routing Setup - 1 day
  - Create `/course` and `/course/[slug]` routes
  - Setup layout configuration
  - Basic navigation integration

### Epic 2: Course Listing Implementation (3 days)
- Task 2.1: Course Data Loading - 1 day
  - Implement markdown file scanning
  - Parse course metadata
  - Handle data structuring
- Task 2.2: UI Implementation - 2 days
  - Implement course grid with Ancient Fantasy Asia styling
  - Create course cards dengan glass panel effects
  - Add hover states dan micro-interactions
  - Integrate shadcn/ui components

### Epic 3: Course Detail Implementation (5 days)
- Task 3.1: Course Header - 1 day
  - Course information display
  - Progress indicator implementation
  - Breadcrumb navigation
- Task 3.2: Timeline Navigation - 2 days
  - Section-based navigation component
  - Active state management
  - Mobile-optimized accordion pattern
  - Scroll spy functionality
- Task 3.3: Content Rendering - 1 day
  - Markdown to HTML conversion
  - Syntax highlighting untuk code blocks
  - Responsive typography
- Task 3.4: Progress Tracking - 1 day
  - Local storage implementation
  - Progress calculation logic
  - Cross-tab synchronization

### Epic 4: Mobile Optimization & Polish (2 days)
- Task 4.1: Mobile Layout - 1 day
  - Responsive course cards
  - Touch-friendly timeline navigation
  - Swipe gestures implementation
- Task 4.2: Performance & Accessibility - 1 day
  - Lazy loading implementation
  - WCAG 2.1 AA compliance fixes
  - Performance optimization
  - Error handling completion

**Total Estimated Time: 15 days** (Updated for Tab Interface Enhancement)

### Parallel Development Opportunities
**Days 1-2**: Can work simultaneously on:
- Data structure definition + basic routing setup
- Sample content creation + initial UI mockups

**Days 8-10**: Can work in parallel on:
- Timeline navigation + content rendering
- Progress tracking backend + mobile optimization

**Critical Path Dependencies:**
1. Course listing → Course detail routing
2. Timeline navigation → Progress tracking integration
3. Mobile optimization → Final testing deployment

---

*Created: 2025-01-10*
*Updated: 2025-01-11*
*Status: Ready for Implementation*
*Priority: High*
*Version: 4.0 (Enhanced Markdown visualize  in React Markdown )*
