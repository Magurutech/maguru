# Course Feature

Comprehensive course management system with tab interface and learning mode functionality for the Maguru e-learning platform.

## Overview

The Course feature implements a complete learning management system with:
- Course listing with search, filtering, and sorting
- Tab-based course detail pages (Overview + Timeline)
- Dedicated learning mode with timeline navigation
- Progress tracking with local storage persistence
- Mobile-responsive design with Ancient Fantasy Asia theme

## Architecture

Follows simplified feature-first modular monolith architecture:

```
features/course/
├── components/          # UI Components (Presentation Layer)
├── hooks/              # Business Logic (Logic Layer)
├── lib/                # Utilities & Data Loading
├── types/              # TypeScript Definitions
└── api.ts              # API Client Functions
```

## Key Components

### 📋 Course Listing (`app/course/page.tsx`)
- Displays all available courses in responsive grid layout
- Search, level filtering, and sorting capabilities
- Progress indicators for each course
- Navigation to course detail pages

### 📚 Course Detail (`app/course/[slug]/page.tsx`)
- Tab interface with Overview and Timeline sections
- Course header with metadata and action buttons
- Overview content rendered from course.md files
- Timeline preview with section navigation

### 🎓 Learning Mode (`app/course/[slug]/learn/page.tsx`)
- Full-screen learning experience
- Timeline navigation sidebar
- Progress tracking and navigation controls
- Rich markdown content rendering

## Core Components

### CourseHeader
Enhanced course header component supporting multiple modes:
- **Overview Mode**: Shows course metadata with start button
- **Learning Mode**: Shows back button and progress

```tsx
<CourseHeader
  course={course}
  progress={progress}
  mode="overview" // 'overview' | 'learning'
  showStartButton={true}
  showBackButton={false}
/>
```

### CourseTabs
Tab navigation component for course detail pages:
- **Overview Tab**: Renders course overview content from markdown
- **Timeline Tab**: Shows course structure with navigation

```tsx
<CourseTabs
  course={course}
  progress={progress}
/>
```

### OverviewRenderer
Enhanced markdown renderer for course overview content:
- Parses and renders markdown with custom styling
- Course stats and metadata display
- Responsive typography

```tsx
<OverviewRenderer
  course={course}
  content={overviewContent}
  showStats={true}
/>
```

### TimelinePreview
Course structure preview component:
- Expandable sections with progress indicators
- Navigation buttons to learning mode
- Progress visualization

```tsx
<TimelinePreview
  course={course}
  progress={progress}
  showProgress={true}
/>
```

### ContentRenderer
Universal content renderer supporting multiple content types:
- **Markdown**: Enhanced parsing with syntax highlighting
- **Video**: Video content placeholder
- **Quiz**: Interactive quiz placeholder
- **Exercise**: Exercise placeholder

```tsx
<ContentRenderer
  content={content}
  contentType="markdown"
  className="custom-styling"
/>
```

## Data Management

### Course Types (`types/course.types.ts`)
```typescript
interface Course {
  slug: string
  metadata: CourseMetadata
  sections: CourseSection[]
  totalItems: number
  estimatedDuration: string
  overviewContent?: string
}

interface CourseProgress {
  courseId: string
  completedItems: string[]
  currentSectionId: string
  currentItemId: string
  lastAccessedAt: string
  completionPercentage: number
  isCompleted: boolean
}
```

### API Functions (`api.ts`)
```typescript
// Course listing and details
getCourses(): Promise<CourseListResponse>
getCourse(slug: string): Promise<CourseDetailResponse | null>
getCourseContent(slug: string, contentPath: string): Promise<string>

// Progress tracking
getCourseProgress(courseId: string): CourseProgress | undefined
saveCourseProgress(progress: CourseProgress): void
markItemCompleted(courseId: string, sectionId: string, itemId: string): CourseProgress
```

## State Management

### Custom Hooks (`hooks/useCourse.ts`)
```typescript
const {
  course,
  progress,
  loading,
  error,
  currentSectionId,
  currentItemId,
  navigateToItem,
  markCurrentItemCompleted,
  navigateToNextItem,
  navigateToPreviousItem
} = useCourse(slug, { autoSave: true })
```

### Progress Persistence
- Local storage based persistence
- Cross-tab synchronization
- TTL (time-to-live) support
- Automatic progress calculation

## Content Structure

### Course Directory Structure
```
docs/course/
├── web-development-basics/
│   ├── course.md              # Metadata + overview content
│   ├── section-01/
│   │   ├── 01-introduction.md  # Learning content
│   │   ├── 02-html-basics.md
│   │   └── ...
│   ├── section-02/
│   │   └── ...
│   └── ...
└── react-fundamentals/
    ├── course.md
    └── ...
```

### Course Metadata (course.md frontmatter)
```yaml
---
title: Web Development Basics
description: Belajar fundamental web development
instructor: Tim Pengajar Maguru
level: beginner
duration: 6 jam
tags: [HTML, CSS, JavaScript, Frontend]
lastUpdated: 2025-01-10
---

# Course overview content here
This markdown content appears in the Overview tab...
```

## UI/UX Design

### Ancient Fantasy Asia Theme
- **Color Palette**: Beige (background), Yellow-Orange (accent), Green (progress), Red (CTA)
- **Typography**: Poppins (primary), Playfair Display (accent)
- **Design Elements**: Glass panels, whimsical animations, nature motifs
- **Interactive States**: Hover effects, smooth transitions, micro-interactions

### Responsive Design
- **Mobile** (< 768px): Single column, touch targets 44px+, collapsible navigation
- **Tablet** (768px - 1024px): Two-column layout, optimized reading width
- **Desktop** (> 1024px): Full layout with hover states and enhanced interactions

## Performance Optimizations

### Loading Strategy
- Skeleton loading states for better UX
- Progressive content loading
- Error boundaries for graceful degradation
- Optimized markdown parsing

### Caching Strategy
- Client-side markdown content caching
- Local storage for progress data with TTL
- Image optimization with Next.js Image component

## Testing

### Component Testing
```bash
# Unit tests
yarn test features/course/components/

# Integration tests
yarn test:unit:all

# E2E tests
yarn test:e2e features/course/
```

### Manual Testing Checklist
- [ ] Course listing loads correctly
- [ ] Search and filtering work
- [ ] Course detail tabs switch properly
- [ ] Learning mode navigation works
- [ ] Progress tracking functions
- [ ] Mobile responsive design
- [ ] Accessibility compliance

## Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint with zero warnings tolerance
- Component documentation with JSDoc
- Consistent naming conventions (kebab-case, PascalCase)

### Performance Standards
- Maximum 3s load time for course listing
- Smooth 60fps animations
- < 100KB bundle size per component
- Optimized images and assets

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels and roles

## Integration Examples

### Adding New Course
1. Create course directory in `docs/course/`
2. Add `course.md` with metadata and overview
3. Create section folders with content files
4. Test course loading and navigation

### Custom Content Type
1. Add new type to `contentType` enum
2. Extend `ContentRenderer` with new case
3. Update TypeScript types
4. Add corresponding styling

### Custom Progress Metric
1. Modify `CourseProgress` interface
2. Update `markItemCompleted` logic
3. Modify progress calculation in `useCourse`
4. Update UI components accordingly

## Future Enhancements

### Phase 2 Features (Planned)
- Interactive quizzes and assessments
- Video content integration
- Discussion forums
- Assignment submissions
- Certificate generation

### Technical Improvements
- Real-time progress sync
- Offline content support
- Advanced search with autocomplete
- Course recommendations
- Analytics and reporting

## Dependencies

### Core Dependencies
- Next.js 15.5.3 (App Router)
- React 19 (Strict Mode)
- TypeScript (Strict Mode)
- TailwindCSS 4.1.13
- shadcn/ui components

### External Libraries
- lucide-react (icons)
- clsx (conditional styling)
- tailwind-merge (class merging)

## Support

For questions, issues, or feature requests:
1. Check existing documentation
2. Review component examples
3. Consult team development guidelines
4. Create issue with detailed description