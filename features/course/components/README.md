# Course Components

Reusable UI components for the course management system following the Ancient Fantasy Asia design theme.

## Components Overview

### CourseHeader
Enhanced header component for course pages with multiple display modes and navigation options.

**Props:**
```typescript
interface CourseHeaderProps {
  course: Course
  progress?: CourseProgress
  mode?: 'overview' | 'learning'
  showStartButton?: boolean
  showBackButton?: boolean
  startButtonHref?: string
}
```

**Usage Examples:**
```tsx
// Overview mode with start button
<CourseHeader
  course={course}
  progress={progress}
  mode="overview"
  showStartButton={true}
  startButtonHref={`/course/${course.slug}/learn`}
/>

// Learning mode with back button
<CourseHeader
  course={course}
  progress={progress}
  mode="learning"
  showBackButton={true}
/>
```

### CourseTabs
Tab navigation component for course detail pages implementing Overview and Timeline tabs.

**Props:**
```typescript
interface CourseTabsProps {
  course: Course
  progress?: CourseProgress
  className?: string
}
```

**Usage Example:**
```tsx
<CourseTabs
  course={course}
  progress={progress}
  className="custom-tabs"
/>
```

### OverviewRenderer
Enhanced markdown renderer for course overview content with course statistics display.

**Props:**
```typescript
interface OverviewRendererProps {
  course: Course
  content: string
  showStats?: boolean
  className?: string
}
```

**Usage Example:**
```tsx
<OverviewRenderer
  course={course}
  content={overviewContent}
  showStats={true}
  className="overview-content"
/>
```

### TimelinePreview
Course structure preview component with expandable sections and navigation links.

**Props:**
```typescript
interface TimelinePreviewProps {
  course: Course
  progress?: CourseProgress
  showProgress?: boolean
  className?: string
}
```

**Usage Example:**
```tsx
<TimelinePreview
  course={course}
  progress={progress}
  showProgress={true}
  className="timeline-preview"
/>
```

### ContentRenderer
Universal content renderer supporting multiple content types with enhanced markdown parsing.

**Props:**
```typescript
interface ContentRendererProps {
  content: string
  contentType?: 'markdown' | 'video' | 'quiz' | 'exercise'
  className?: string
}
```

**Usage Examples:**
```tsx
// Markdown content
<ContentRenderer
  content={markdownContent}
  contentType="markdown"
  className="lesson-content"
/>

// Video content (placeholder)
<ContentRenderer
  content={videoContent}
  contentType="video"
/>

// Quiz content (placeholder)
<ContentRenderer
  content={quizContent}
  contentType="quiz"
/>
```

## Design System Integration

### Color Usage
- **Primary Actions**: Red 500 (`#FF4D4D`) for buttons and CTAs
- **Secondary/Highlights**: Yellow-Orange 400 (`#FFB148`) for accents
- **Backgrounds**: Beige 50-200 (`#F5EDE0` - `#E8D9C6`) for main areas
- **Progress/Success**: Green 300-500 (`#86D4A6` - `#5AC88A`) for progress

### Typography
- **Headings**: Poppins font family with proper hierarchy
- **Body Text**: Poppins with optimized line height
- **Code**: Fira Code for technical content
- **Emphasis**: Playfair Display for special headings

### Interactive States
- **Hover Effects**: Scale transforms (`scale-105`) with shadow enhancement
- **Focus Management**: 2px red outline with 2px offset for accessibility
- **Transitions**: Consistent 200-300ms transitions with `cubic-bezier(0.4, 0, 0.2, 1)`
- **Loading States**: Skeleton loaders with smooth animations

## Responsive Design

### Mobile (< 768px)
- Stack layouts with full-width elements
- Touch targets minimum 44px
- Collapsible navigation for timeline
- Optimized typography for smaller screens

### Tablet (768px - 1024px)
- Two-column layouts where appropriate
- Optimized reading width (65-75 characters)
- Enhanced touch interactions
- Adaptive component sizing

### Desktop (> 1024px)
- Full multi-column layouts
- Enhanced hover states and micro-interactions
- Sticky navigation elements
- Advanced visual effects

## Performance Considerations

### Rendering Optimization
- Lazy loading for large content sections
- Efficient markdown parsing with caching
- Optimized re-renders with React.memo
- Minimal bundle impact per component

### Accessibility Compliance
- WCAG 2.1 AA standards adherence
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management and visual indicators

## Development Guidelines

### Code Quality
- TypeScript strict mode with proper typing
- Comprehensive prop validation
- Consistent error boundaries
- Performance monitoring with React Profiler

### Testing Standards
- Unit tests for core functionality
- Integration tests for component interactions
- E2E tests for complete user flows
- Accessibility testing with screen readers

### Maintenance
- Clear documentation with usage examples
- Version compatibility tracking
- Regular dependency updates
- Performance regression testing