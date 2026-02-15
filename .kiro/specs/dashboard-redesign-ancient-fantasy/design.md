# Design Document

## Overview

This design document specifies the architecture and implementation details for redesigning the User Dashboard (`/dashboard`) to align with the Ancient Fantasy Asia design system. The redesign transforms the current blue/indigo/purple themed dashboard into a cohesive, role-aware interface using the project's themed color palette (beige, kuning, hijau, merah) with glass-panel effects.

### Design Goals

1. **Visual Consistency**: Apply Ancient Fantasy Asia design system throughout the dashboard
2. **Component Reusability**: Create modular, reusable components that can be adapted for Creator and Admin dashboards
3. **API-Ready Architecture**: Structure data fetching to easily swap from mock data to real API calls
4. **Performance**: Use CSS-only animations and optimized rendering patterns
5. **Accessibility**: Ensure WCAG AA compliance with keyboard navigation and screen reader support

### Scope

**In Scope:**
- User/Learner dashboard redesign with themed styling
- Reusable component architecture in `features/dashboard/`
- Mock data with API-ready patterns
- Role-based content differentiation (user, creator, admin)
- Glass-panel effects and themed animations
- Responsive layout (mobile, tablet, desktop)

**Out of Scope:**
- Real API integration (Phase 2)
- Creator and Admin dashboard redesigns (separate tasks)
- Advanced analytics and charting
- Real-time data updates
- User preferences and customization

## Architecture

### Component Hierarchy

```
app/dashboard/page.tsx (Main Page)
├── DashboardLayout (Wrapper with glass-panel styling)
│   ├── DashboardHeader (Role-specific greeting)
│   ├── StatsGrid (Statistics display)
│   │   └── StatsCard (Reused from features/creator)
│   ├── RecentCourses (Course list with progress)
│   │   └── Progress (Reused from components/ui)
│   ├── QuickActions (Role-specific actions)
│   │   └── ActionButton (Reused from features/creator)
│   └── Recommendations (Course suggestions)
```

### Directory Structure

```
features/dashboard/
├── components/
│   ├── DashboardLayout.tsx       # Main layout wrapper
│   ├── DashboardHeader.tsx       # Role-specific header
│   ├── StatsGrid.tsx             # Stats grid container
│   ├── RecentCourses.tsx         # Recent courses section
│   ├── QuickActions.tsx          # Quick actions section
│   ├── Recommendations.tsx        # Recommendations section
│   └── index.ts                 # Component exports
├── types.ts                     # TypeScript interfaces
├── api.ts                      # API client functions
└── utils.ts                    # Helper functions
```

### Data Flow

```
1. Page Load
   ↓
2. useUserRole() → Get current user role
   ↓
3. getDashboardData(role) → Fetch dashboard data
   ↓
4. Try: fetch('/api/dashboard/{role}')
   ↓
5. Catch: getMockDashboardData(role)
   ↓
6. Render components with data
```

## Components and Interfaces

### 1. DashboardLayout Component

**Purpose**: Wrapper component providing consistent layout structure and glass-panel styling.

**Props**:
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'user' | 'creator' | 'admin'
}
```

**Responsibilities**:
- Apply `bg-ancient-fantasy` background gradient
- Provide max-width container (max-w-7xl)
- Apply consistent padding (p-6)
- Manage single-column scroll layout

**Styling**:
- Background: `bg-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50`
- Container: `max-w-7xl mx-auto`
- Spacing: `space-y-8` for vertical rhythm

### 2. DashboardHeader Component

**Purpose**: Display role-specific greeting and user information.

**Props**:
```typescript
interface DashboardHeaderProps {
  userName: string
  role: 'user' | 'creator' | 'admin'
}
```

**Responsibilities**:
- Display role-appropriate title ("Dashboard Learner", "Dashboard Creator", "Dashboard Admin")
- Show personalized greeting with user's first name
- Display role badge with themed color
- Apply glass-panel-light styling

**Styling**:
- Card: `.glass-panel-light` with `rounded-lg` and `p-6`
- Icon container: Role-specific color (user: kuning, creator: merah, admin: hijau)
- Typography: `text-3xl font-bold` for title, `text-beige-600` for subtitle

### 3. StatsGrid Component

**Purpose**: Display dashboard statistics in a responsive grid.

**Props**:
```typescript
interface StatsGridProps {
  stats: StatCard[]
}

interface StatCard {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string | number
  subtitle?: string
  iconColor: 'hijau' | 'kuning' | 'merah' | 'beige'
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
}
```

**Responsibilities**:
- Render stats in responsive grid (1/2/4 columns)
- Apply staggered animations (0ms, 100ms, 200ms, 300ms delays)
- Reuse existing `StatsCard` component from `features/creator/components/dashboard/StatsCard.tsx`

**Styling**:
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Animation: `animate-slide-up` with staggered delays via inline styles

### 4. RecentCourses Component

**Purpose**: Display recent courses with progress tracking.

**Props**:
```typescript
interface RecentCoursesProps {
  courses: RecentCourse[]
  onContinue: (courseId: string) => void
  onViewAll: () => void
}

interface RecentCourse {
  id: string
  title: string
  progress: number
  lastAccessed: string
  thumbnail?: string
  instructor?: string
  status?: 'completed' | 'in-progress' | 'not-started'
  rating?: number
  students?: number
}
```

**Responsibilities**:
- Display course list with glass-panel cards
- Show progress bars using `Progress` component from `components/ui/progress.tsx`
- Display "Continue" button for incomplete courses, "Review" for completed
- Apply hover-lift effect on cards

**Styling**:
- Container: `.glass-panel-light rounded-lg`
- Progress bar: `bg-hijau-400` for indicator
- Hover: `hover:bg-beige-50 transition-colors duration-200`

### 5. QuickActions Component

**Purpose**: Display role-specific quick action buttons.

**Props**:
```typescript
interface QuickActionsProps {
  actions: QuickAction[]
}

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  colorScheme?: 'merah' | 'kuning' | 'hijau' | 'beige'
}
```

**Responsibilities**:
- Render action buttons using `ActionButton` component from `features/creator/components/dashboard/ActionButton.tsx`
- Apply role-specific actions (user: explore courses, creator: creator studio, admin: admin panel)
- Apply hover-glow effect

**Styling**:
- Container: `.glass-panel-light rounded-lg p-6`
- Grid: `space-y-3` for vertical stacking
- Buttons: Full width with `justify-start` alignment

### 6. Recommendations Component

**Purpose**: Display course recommendations based on learning history.

**Props**:
```typescript
interface RecommendationsProps {
  recommendations: Recommendation[]
}

interface Recommendation {
  id: string
  title: string
  description: string
  reason: string
  thumbnail?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
}
```

**Responsibilities**:
- Display recommendation cards with glass-panel styling
- Show reasoning text (e.g., "Berdasarkan progress React Anda")
- Apply hover-lift effect (translateY(-4px))

**Styling**:
- Card: `.glass-panel-light rounded-lg p-4`
- Hover: `hover-lift` class with `transition-transform duration-200`
- Colors: Role-specific background tints (user: kuning-50, creator: hijau-50, admin: merah-50)

## Data Models

### Dashboard Data Structure

```typescript
// Main dashboard data interface
export interface DashboardData {
  stats: StatCard[]
  recentCourses: RecentCourse[]
  quickActions: QuickAction[]
  recommendations: Recommendation[]
}

// Role-specific stats interfaces
export interface UserDashboardStats {
  coursesEnrolled: number
  coursesCompleted: number
  totalLearningHours: number
  certificatesEarned: number
}

export interface CreatorDashboardStats {
  totalCourses: number
  publishedCourses: number
  totalStudents: number
  monthlyEarnings: number
}

export interface AdminDashboardStats {
  systemHealth: number
  activeUsers: number
  totalRevenue: number
  platformIssues: number
}
```

### API Client Pattern

```typescript
// API client function (features/dashboard/api.ts)
export async function getDashboardData(
  role: 'user' | 'creator' | 'admin'
): Promise<DashboardData> {
  try {
    const response = await fetch(`/api/dashboard/${role}`)
    if (!response.ok) throw new Error('Failed to fetch dashboard data')
    return await response.json()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return getMockDashboardData(role) // Fallback to mock
  }
}

// Mock data function
export function getMockDashboardData(
  role: 'user' | 'creator' | 'admin'
): DashboardData {
  switch (role) {
    case 'user':
      return getUserMockData()
    case 'creator':
      return getCreatorMockData()
    case 'admin':
      return getAdminMockData()
    default:
      return getUserMockData()
  }
}
```

### Mock Data Examples

**User Role Mock Data**:
```typescript
function getUserMockData(): DashboardData {
  return {
    stats: [
      {
        icon: BookOpen,
        title: 'Kursus Diikuti',
        value: 5,
        iconColor: 'kuning'
      },
      {
        icon: Award,
        title: 'Kursus Selesai',
        value: 2,
        iconColor: 'hijau'
      },
      {
        icon: Clock,
        title: 'Jam Belajar',
        value: 24,
        iconColor: 'merah'
      },
      {
        icon: Star,
        title: 'Sertifikat',
        value: 1,
        iconColor: 'beige'
      }
    ],
    recentCourses: [
      {
        id: '1',
        title: 'Introduction to React',
        progress: 75,
        lastAccessed: '2024-01-15',
        instructor: 'John Doe',
        status: 'in-progress'
      }
    ],
    quickActions: [
      {
        icon: BookOpen,
        label: 'Jelajahi Kursus Baru',
        href: '/course',
        colorScheme: 'merah'
      },
      {
        icon: User,
        label: 'Edit Profile',
        href: '/profile',
        colorScheme: 'kuning'
      }
    ],
    recommendations: [
      {
        id: '1',
        title: 'Advanced React Patterns',
        description: 'Master advanced React concepts',
        reason: 'Berdasarkan progress React Anda',
        difficulty: 'intermediate'
      }
    ]
  }
}
```

### Rule-Based Recommendation Logic

```typescript
// Simple rule-based recommendation engine
export function generateRecommendations(
  recentCourses: RecentCourse[]
): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  // Rule 1: If user took React, recommend Advanced React
  if (recentCourses.some(c => c.title.toLowerCase().includes('react'))) {
    recommendations.push({
      id: 'rec-1',
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts and patterns',
      reason: 'Berdasarkan progress React Anda',
      difficulty: 'intermediate'
    })
  }
  
  // Rule 2: If user completed frontend, recommend backend
  if (recentCourses.some(c => c.status === 'completed' && 
      (c.title.toLowerCase().includes('javascript') || 
       c.title.toLowerCase().includes('css')))) {
    recommendations.push({
      id: 'rec-2',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications',
      reason: 'Melengkapi skill frontend Anda',
      difficulty: 'intermediate'
    })
  }
  
  // Rule 3: Default recommendations if no matches
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-default',
      title: 'JavaScript Fundamentals',
      description: 'Master the basics of JavaScript',
      reason: 'Rekomendasi populer untuk pemula',
      difficulty: 'beginner'
    })
  }
  
  return recommendations
}
```

## Styling System

### Glass Panel Effect

```css
/* Add to styles/globals.css */
.glass-panel-light {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  border: 1px solid rgba(185, 179, 132, 0.3);
  box-shadow: 0 6px 32px 0 rgba(123, 91, 44, 0.08);
}
```

### Animation Utilities

**Staggered Animations**:
```typescript
// Apply staggered delays to stats cards
const staggerDelays = ['0ms', '100ms', '200ms', '300ms']

stats.map((stat, index) => (
  <div
    key={index}
    className="animate-slide-up"
    style={{ animationDelay: staggerDelays[index] }}
  >
    <StatsCard {...stat} />
  </div>
))
```

**Hover Effects**:
- `.hover-lift`: `transform: translateY(-4px)` on hover
- `.hover-glow`: Apply `var(--shadow-glow)` on hover
- Transition: `transition-all duration-200 ease-in-out`

### Color Mapping

**Role-Based Colors**:
```typescript
const roleColors = {
  user: {
    primary: 'kuning',
    accent: 'hijau',
    highlight: 'merah'
  },
  creator: {
    primary: 'merah',
    accent: 'kuning',
    highlight: 'hijau'
  },
  admin: {
    primary: 'hijau',
    accent: 'merah',
    highlight: 'kuning'
  }
}
```

**Stats Icon Colors** (User Role):
- Courses Enrolled: `kuning` (highlight/attention)
- Courses Completed: `hijau` (success/progress)
- Learning Hours: `merah` (primary action)
- Certificates Earned: `beige` (neutral/achievement)

## Loading and Error States

### Loading State

```typescript
if (!isLoaded || roleLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ancient-fantasy">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-12 w-3/4 bg-beige-200" />
        <Skeleton className="h-8 w-1/2 bg-beige-200" />
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Skeleton className="h-24 bg-beige-200" />
          <Skeleton className="h-24 bg-beige-200" />
          <Skeleton className="h-24 bg-beige-200" />
          <Skeleton className="h-24 bg-beige-200" />
        </div>
      </div>
    </div>
  )
}
```

### Error State

```typescript
if (!canAccessUser()) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ancient-fantasy">
      <div className="text-center glass-panel-light rounded-lg p-8 max-w-md">
        <div className="text-merah-500 text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-beige-900 mb-2">Akses Ditolak</h1>
        <p className="text-beige-600 mb-4">
          Anda perlu login untuk mengakses dashboard.
        </p>
        <Link href="/sign-in">
          <Button className="bg-merah-500 hover:bg-merah-600">
            Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
```

## Responsive Design

### Breakpoints

- **Mobile** (< 768px): 1 column layout
- **Tablet** (768px - 1024px): 2 column layout for stats
- **Desktop** (> 1024px): 4 column layout for stats

### Grid Configurations

```typescript
// Stats Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Quick Actions & Recommendations
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// Recent Courses (Full Width)
<div className="w-full">
```

### Mobile Optimizations

- Reduce padding on mobile: `p-4` instead of `p-6`
- Stack action buttons vertically
- Simplify course cards (hide secondary info)
- Reduce animation complexity on mobile


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Role-Based Stats Display

*For any* user accessing the dashboard, the displayed statistics should match their role: users see learner stats (Courses Enrolled, Courses Completed, Learning Hours, Certificates), creators see content stats (Total Courses, Published Courses, Total Students, Earnings), and admins see system stats (System Health, Active Users, Total Revenue, Platform Issues).

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 2: Themed Color Usage

*For any* dashboard element (stats, cards, buttons, text), only themed colors from the Ancient Fantasy Asia palette (beige, kuning, hijau, merah) should be used, with no default Tailwind colors (blue, indigo, purple).

**Validates: Requirements 1.1, 1.2, 3.4**

### Property 3: Course Information Completeness

*For any* course displayed in the Recent Courses section, all required fields (title, instructor name, progress percentage, last accessed date) should be present and visible.

**Validates: Requirements 5.2**

### Property 4: Progress Bar Styling

*For any* progress bar displayed in the dashboard, the progress indicator should use hijau (green) color to maintain design consistency.

**Validates: Requirements 5.4**

### Property 5: Course Completion Button Text

*For any* course in the Recent Courses section, if progress is 100%, the button text should be "Review"; otherwise, it should be "Continue".

**Validates: Requirements 5.5, 5.6**

### Property 6: Recommendation Content Completeness

*For any* recommendation displayed, all required fields (title, description, reasoning) should be present and visible to the user.

**Validates: Requirements 7.2**

### Property 7: React-Based Recommendations

*For any* user who has taken a course with "React" in the title, the recommendations should include "Advanced React Patterns" with reasoning text mentioning their React progress.

**Validates: Requirements 7.3, 7.4**

### Property 8: Responsive Grid Layout

*For any* viewport size, the stats grid should display the correct number of columns: 1 column on mobile (< 768px), 2 columns on tablet (768px-1024px), and 4 columns on desktop (> 1024px).

**Validates: Requirements 4.1, 9.2, 9.3, 9.4**

### Property 9: Hover Effects on Interactive Elements

*For any* interactive card or button, hovering should apply the appropriate effect: cards get `hover-lift` (translateY(-4px)), and action buttons get `hover-glow` effect.

**Validates: Requirements 10.1, 10.2**

### Property 10: Staggered Animation Delays

*For any* set of 4 stats cards, the animation delays should follow the pattern: 0ms, 100ms, 200ms, 300ms in order.

**Validates: Requirements 10.4**

### Property 11: Mock Data Structure Consistency

*For any* role (user, creator, admin), the mock data returned by `getMockDashboardData()` should have the same structure as the expected API response (stats array, recentCourses array, quickActions array, recommendations array).

**Validates: Requirements 12.5**

### Property 12: Icon-Only Button Accessibility

*For any* button that contains only an icon (no visible text), an aria-label attribute should be present to provide accessible text for screen readers.

**Validates: Requirements 13.1**

### Property 13: Keyboard Navigation Focus Indicators

*For any* interactive element (button, link, input), when it receives keyboard focus, a visible focus indicator should be displayed.

**Validates: Requirements 13.2**

### Property 14: Color Contrast Compliance

*For any* text element on the dashboard, the color contrast ratio between text and background should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 13.4**

### Property 15: Keyboard Accessibility

*For any* interactive element (button, link, action), it should be reachable and activatable using only keyboard navigation (Tab, Enter, Space keys).

**Validates: Requirements 13.5**

## Error Handling

### API Fetch Errors

**Strategy**: Graceful degradation with fallback to mock data

```typescript
export async function getDashboardData(
  role: 'user' | 'creator' | 'admin'
): Promise<DashboardData> {
  try {
    const response = await fetch(`/api/dashboard/${role}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Dashboard data fetch failed:', error)
    
    // Fallback to mock data
    return getMockDashboardData(role)
  }
}
```

**Error Scenarios**:
1. Network failure → Use mock data
2. API returns 404 → Use mock data
3. API returns 500 → Use mock data
4. Invalid JSON response → Use mock data
5. Timeout → Use mock data (with timeout configuration)

### Authentication Errors

**Strategy**: Redirect to login with return URL

```typescript
if (!canAccessUser()) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ancient-fantasy">
      <div className="text-center glass-panel-light rounded-lg p-8 max-w-md">
        <div className="text-merah-500 text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-beige-900 mb-2">Akses Ditolak</h1>
        <p className="text-beige-600 mb-4">
          Anda perlu login untuk mengakses dashboard.
        </p>
        <Link href={`/sign-in?redirect=${encodeURIComponent('/dashboard')}`}>
          <Button className="bg-merah-500 hover:bg-merah-600">
            Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
```

### Role Loading Errors

**Strategy**: Show loading state until role is determined

```typescript
const { shouldShowLoader } = useRoleLoadingState()

if (shouldShowLoader) {
  return <DashboardSkeleton />
}
```

### Data Validation Errors

**Strategy**: Validate data structure and provide defaults

```typescript
function validateDashboardData(data: any): DashboardData {
  return {
    stats: Array.isArray(data.stats) ? data.stats : [],
    recentCourses: Array.isArray(data.recentCourses) ? data.recentCourses : [],
    quickActions: Array.isArray(data.quickActions) ? data.quickActions : [],
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : []
  }
}
```

## Testing Strategy

### Dual Testing Approach

This feature will use both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both types of tests are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across many inputs.

### Unit Testing

**Focus Areas**:
1. Component rendering with specific props
2. Role-based content switching
3. Loading and error states
4. User interactions (button clicks, navigation)
5. Edge cases (empty data, missing fields)

**Example Unit Tests**:
```typescript
describe('DashboardHeader', () => {
  it('displays correct title for user role', () => {
    render(<DashboardHeader userName="John" role="user" />)
    expect(screen.getByText('Dashboard Learner')).toBeInTheDocument()
  })
  
  it('displays correct title for creator role', () => {
    render(<DashboardHeader userName="Jane" role="creator" />)
    expect(screen.getByText('Dashboard Creator')).toBeInTheDocument()
  })
  
  it('displays correct title for admin role', () => {
    render(<DashboardHeader userName="Admin" role="admin" />)
    expect(screen.getByText('Dashboard Admin')).toBeInTheDocument()
  })
})

describe('RecentCourses', () => {
  it('shows Continue button for incomplete courses', () => {
    const courses = [{ id: '1', title: 'React', progress: 50, lastAccessed: '2024-01-15', instructor: 'John' }]
    render(<RecentCourses courses={courses} onContinue={jest.fn()} onViewAll={jest.fn()} />)
    expect(screen.getByText('Continue')).toBeInTheDocument()
  })
  
  it('shows Review button for completed courses', () => {
    const courses = [{ id: '1', title: 'React', progress: 100, lastAccessed: '2024-01-15', instructor: 'John' }]
    render(<RecentCourses courses={courses} onContinue={jest.fn()} onViewAll={jest.fn()} />)
    expect(screen.getByText('Review')).toBeInTheDocument()
  })
})
```

### Property-Based Testing

**Testing Library**: fast-check (for TypeScript/JavaScript)

**Configuration**: Minimum 100 iterations per property test

**Property Test Examples**:

```typescript
import fc from 'fast-check'

describe('Dashboard Property Tests', () => {
  /**
   * Feature: dashboard-redesign-ancient-fantasy, Property 1: Role-Based Stats Display
   * For any user accessing the dashboard, the displayed statistics should match their role
   */
  it('displays role-appropriate stats for any role', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('user', 'creator', 'admin'),
        fc.string(),
        (role, userName) => {
          const { container } = render(<DashboardPage mockRole={role} mockUserName={userName} />)
          
          if (role === 'user') {
            expect(container.textContent).toContain('Kursus Diikuti')
            expect(container.textContent).toContain('Kursus Selesai')
            expect(container.textContent).toContain('Jam Belajar')
            expect(container.textContent).toContain('Sertifikat')
          } else if (role === 'creator') {
            expect(container.textContent).toContain('Total Kursus')
            expect(container.textContent).toContain('Published Courses')
            expect(container.textContent).toContain('Total Students')
            expect(container.textContent).toContain('Monthly Earnings')
          } else if (role === 'admin') {
            expect(container.textContent).toContain('System Health')
            expect(container.textContent).toContain('Active Users')
            expect(container.textContent).toContain('Total Revenue')
            expect(container.textContent).toContain('Platform Issues')
          }
        }
      ),
      { numRuns: 100 }
    )
  })
  
  /**
   * Feature: dashboard-redesign-ancient-fantasy, Property 5: Course Completion Button Text
   * For any course, if progress is 100%, button text should be "Review"; otherwise "Continue"
   */
  it('displays correct button text based on course progress', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            title: fc.string(),
            progress: fc.integer({ min: 0, max: 100 }),
            lastAccessed: fc.date().map(d => d.toISOString()),
            instructor: fc.string()
          })
        ),
        (courses) => {
          const { container } = render(
            <RecentCourses 
              courses={courses} 
              onContinue={jest.fn()} 
              onViewAll={jest.fn()} 
            />
          )
          
          courses.forEach(course => {
            const expectedText = course.progress === 100 ? 'Review' : 'Continue'
            // Verify button text matches expected based on progress
            const buttons = container.querySelectorAll('button')
            const hasCorrectButton = Array.from(buttons).some(btn => 
              btn.textContent?.includes(expectedText)
            )
            expect(hasCorrectButton).toBe(true)
          })
        }
      ),
      { numRuns: 100 }
    )
  })
  
  /**
   * Feature: dashboard-redesign-ancient-fantasy, Property 12: Icon-Only Button Accessibility
   * For any button with only an icon, aria-label should be present
   */
  it('provides aria-label for all icon-only buttons', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('user', 'creator', 'admin'),
        (role) => {
          const { container } = render(<DashboardPage mockRole={role} />)
          
          // Find all buttons with icons but no text
          const buttons = container.querySelectorAll('button')
          buttons.forEach(button => {
            const hasIcon = button.querySelector('svg') !== null
            const hasText = button.textContent && button.textContent.trim().length > 0
            
            if (hasIcon && !hasText) {
              // Icon-only button must have aria-label
              expect(button.getAttribute('aria-label')).toBeTruthy()
            }
          })
        }
      ),
      { numRuns: 100 }
    )
  })
  
  /**
   * Feature: dashboard-redesign-ancient-fantasy, Property 11: Mock Data Structure Consistency
   * For any role, mock data should have consistent structure
   */
  it('returns consistent data structure for any role', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('user', 'creator', 'admin'),
        (role) => {
          const data = getMockDashboardData(role)
          
          // Verify structure
          expect(Array.isArray(data.stats)).toBe(true)
          expect(Array.isArray(data.recentCourses)).toBe(true)
          expect(Array.isArray(data.quickActions)).toBe(true)
          expect(Array.isArray(data.recommendations)).toBe(true)
          
          // Verify each stat has required fields
          data.stats.forEach(stat => {
            expect(stat).toHaveProperty('icon')
            expect(stat).toHaveProperty('title')
            expect(stat).toHaveProperty('value')
            expect(stat).toHaveProperty('iconColor')
          })
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### Integration Testing

**Focus**: End-to-end user flows

**Test Scenarios**:
1. User logs in → Dashboard loads → Stats display correctly
2. User clicks "Continue" on course → Navigates to course page
3. User clicks "View All" → Navigates to course list
4. User clicks quick action → Navigates to target page
5. Dashboard loads with network error → Falls back to mock data

### Visual Regression Testing

**Tool**: Playwright (already in project)

**Test Scenarios**:
1. Dashboard appearance for each role (user, creator, admin)
2. Loading state appearance
3. Error state appearance
4. Responsive layouts (mobile, tablet, desktop)
5. Hover states on interactive elements

### Accessibility Testing

**Tools**: 
- axe-core (automated accessibility testing)
- Manual keyboard navigation testing
- Screen reader testing (NVDA/JAWS)

**Test Scenarios**:
1. All interactive elements are keyboard accessible
2. Focus indicators are visible
3. ARIA labels are present and correct
4. Color contrast meets WCAG AA
5. Semantic HTML structure is correct

### Test Coverage Goals

- **Unit Tests**: 80% code coverage
- **Property Tests**: All correctness properties implemented
- **Integration Tests**: All critical user flows covered
- **Accessibility Tests**: WCAG AA compliance verified

### Testing Commands

```bash
# Run all tests
yarn test

# Run unit tests only
yarn test:unit

# Run property tests only
yarn test:property

# Run with coverage
yarn test:coverage

# Run accessibility tests
yarn test:a11y

# Run visual regression tests
yarn test:visual
```
