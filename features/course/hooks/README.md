# Course Hooks

Custom React hooks for course-related business logic and state management following simplified feature-first architecture.

## Overview

The course hooks implement the **Logic Layer** of the course feature, providing centralized business logic for course navigation, progress tracking, and content management.

## Core Hooks

### useCourse
Primary hook for course management with comprehensive functionality.

**Signature:**
```typescript
function useCourse(slug: string, options: UseCourseOptions = {})
```

**Options:**
```typescript
interface UseCourseOptions {
  autoSave?: boolean  // Default: true
}
```

**Returns:**
```typescript
{
  // Course Data
  course: Course | null
  loading: boolean
  error: string | null

  // Current State
  currentSectionId: string
  currentItemId: string

  // Navigation Functions
  navigateToItem: (sectionId: string, itemId: string) => void
  markCurrentItemCompleted: () => CourseProgress

  // Navigation Helpers
  navigateToNextItem: () => boolean
  navigateToPreviousItem: () => boolean
  getCurrentContentPath: () => string | null
  getNavigationInfo: () => {
    hasNext: boolean
    hasPrevious: boolean
    nextItem: { section: CourseSection; item: CourseItem } | null
    previousItem: { section: CourseSection; item: CourseItem } | null
  }

  // Progress State
  isCompleted: boolean
}
```

**Usage Example:**
```tsx
// In course detail page
function CourseDetailPage({ slug }: { slug: string }) {
  const {
    course,
    loading,
    error,
    currentSectionId,
    navigateToItem
  } = useCourse(slug, { autoSave: true })

  if (loading) return <LoadingSpinner />
  if (error || !course) return <ErrorDisplay error={error} />

  return (
    <div>
      <CourseHeader course={course} />
      <CourseTabs course={course} />
    </div>
  )
}

// In learning mode page
function LearningModePage({ slug }: { slug: string }) {
  const {
    course,
    loading,
    error,
    currentSectionId,
    currentItemId,
    navigateToItem,
    markCurrentItemCompleted,
    navigateToNextItem,
    navigateToPreviousItem,
    getNavigationInfo,
    isCompleted
  } = useCourse(slug)

  const { hasNext, hasPrevious } = getNavigationInfo()

  return (
    <LearningLayout>
      <CourseHeader course={course} showBackButton />
      <TimelineNavigation
        course={course}
        currentSectionId={currentSectionId}
        currentItemId={currentItemId}
        onItemClick={navigateToItem}
      />
      <ContentRenderer content={currentContent} />
      <NavigationControls
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onNext={navigateToNextItem}
        onPrevious={navigateToPreviousItem}
        onComplete={markCurrentItemCompleted}
        isCompleted={isCompleted}
      />
    </LearningLayout>
  )
}
```

## Utility Hooks

### useCourseProgress
Lightweight hook for course progress data management.

**Signature:**
```typescript
function useCourseProgress(courseId: string): CourseProgress | undefined
```

**Usage Example:**
```tsx
function CourseCard({ course }: { course: Course }) {
  const progress = useCourseProgress(course.slug)
  const completionPercentage = progress?.completionPercentage || 0

  return (
    <Card>
      <h3>{course.metadata.title}</h3>
      <Progress value={completionPercentage} />
      <span>{completionPercentage}% Complete</span>
    </Card>
  )
}
```

### useCourseList
Hook for managing course listing data with filtering and sorting.

**Signature:**
```typescript
function useCourseList(): {
  courses: CourseListItem[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}
```

**Usage Example:**
```tsx
function CourseListingPage() {
  const { courses, loading, error } = useCourseList()

  if (loading) return <CourseGridSkeleton />
  if (error) return <ErrorDisplay error={error} />

  return (
    <div className="course-grid">
      {courses.map(course => (
        <CourseCard key={course.slug} course={course} />
      ))}
    </div>
  )
}
```

## State Management Architecture

### Data Flow
1. **API Layer**: Fetch data from API endpoints
2. **Hook Layer**: Manage state and business logic
3. **Component Layer**: Consume hooks for UI rendering

### Persistence Strategy
- **Local Storage**: Progress data persisted locally
- **TTL Support**: Automatic cleanup of old data
- **Cross-Tab Sync**: Real-time progress synchronization
- **Error Recovery**: Graceful handling of storage failures

### Performance Optimizations
- **Memoization**: Expensive calculations cached
- **Selective Updates**: Only re-render when necessary
- **Lazy Loading**: Course data loaded on-demand
- **Debounced Saving**: Prevent excessive storage writes

## Error Handling

### Hook Error Patterns
```typescript
// Network errors
if (error instanceof Error) {
  if (error.message.includes('404')) {
    return null // Course not found
  }
  throw error // Re-throw other errors
}

// Storage errors
try {
  saveCourseProgress(progress)
} catch (storageError) {
  console.warn('Failed to save progress:', storageError)
  // Continue without failing the UI
}
```

### Graceful Degradation
- **Network Failures**: Show cached data with offline indicator
- **Storage Issues**: Continue without persistence
- **Data Corruption**: Reset to safe defaults
- **Browser Support**: Fallback for older browsers

## Development Guidelines

### Custom Hook Creation
```typescript
function useCustomHook(params: CustomParams) {
  // 1. State initialization
  const [state, setState] = useState<CustomState>(initialState)

  // 2. Effect for side effects
  useEffect(() => {
    // Side effect logic
    return () => {
      // Cleanup logic
    }
  }, [params])

  // 3. Memoized values
  const computedValue = useMemo(() => {
    // Expensive calculation
    return calculateSomething(state)
  }, [state])

  // 4. Event handlers
  const handleAction = useCallback((data: ActionData) => {
    setState(prev => updateState(prev, data))
  }, [])

  return {
    state,
    computedValue,
    handleAction
  }
}
```

### Testing Hooks
```typescript
// Testing with React Testing Library
import { renderHook, act } from '@testing-library/react'
import { useCourse } from '../useCourse'

test('should navigate to next item', async () => {
  const { result } = renderHook(() => useCourse('test-course'))

  await act(async () => {
    result.current.navigateToItem('section-1', 'item-1')
  })

  await act(async () => {
    const success = result.current.navigateToNextItem()
    expect(success).toBe(true)
  })

  expect(result.current.currentItemId).toBe('section-1-item-2')
})
```

## Migration Guide

### From Context API to Hooks
```typescript
// Before (Context API)
const CourseContext = createContext<CourseContextValue>()
const useCourseContext = () => useContext(CourseContext)

// After (Custom Hook)
const useCourse = (slug: string) => {
  // Direct hook implementation
  return {
    course: getCourseFromCache(slug),
    // ... other functionality
  }
}
```

## Performance Monitoring

### Hook Performance Metrics
- **Render Frequency**: Track unnecessary re-renders
- **Memory Usage**: Monitor memory leaks in closures
- **Bundle Impact**: Measure hook contribution to bundle size
- **Runtime Performance**: Profile hook execution time

### Optimization Techniques
```typescript
// Good: Memoized expensive operations
const expensiveCalculation = useMemo(() => {
  return complexCalculation(course, progress)
}, [course.id, progress.completedItems.length])

// Good: Debounced operations
const debouncedSave = useCallback(
  debounce((progress: CourseProgress) => {
    saveCourseProgress(progress)
  }, 1000),
  []
)

// Good: Selective updates
const [currentItem, setCurrentItem] = useState<string | null>(null)
// Only re-render components that need current item
```