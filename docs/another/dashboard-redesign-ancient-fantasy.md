# Dashboard Redesign - Ancient Fantasy Asia Theme

## Context
The current `app/dashboard/page.tsx` uses default Tailwind colors (blue, indigo, purple) that don't match the project's Ancient Fantasy Asia design system defined in `styles/globals.css`. The dashboard needs a complete redesign to:
- Apply the themed color palette (beige, kuning, hijau, merah)
- Use glass-panel effects with light transparency (80% opacity)
- Provide fully differentiated content for user, creator, and admin roles
- Follow single-column scroll layout structure
- Be API-pattern ready from the start

## Files to Create/Modify

### New Files to Create:
```
features/dashboard/
├── components/
│   ├── DashboardLayout.tsx       # Main layout wrapper with glass-panel style
│   ├── DashboardHeader.tsx       # Role-specific header with greeting
│   ├── StatsGrid.tsx             # Reusable stats grid component
│   ├── RecentCourses.tsx         # Recent courses with progress
│   ├── QuickActions.tsx          # Role-specific quick actions
│   ├── Recommendations.tsx        # AI/course recommendations
│   └── index.ts                 # Component exports
├── types.ts                     # TypeScript interfaces for dashboard data
└── api.ts                      # API client functions (pattern ready)
```

### Files to Modify:
- `app/dashboard/page.tsx` - Complete rewrite using new components

## Design System Integration

### Color Usage (from `styles/globals.css`):
```css
/* Background */
bg-beige-50, bg-ancient-fantasy

/* Glass Panel (Custom for 80% opacity) */
background-color: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(var(--backdrop-blur-sm));

/* Action Colors */
merah-500 (primary CTAs)
kuning-400 (highlights/accent)
hijau-400 (progress/success)

/* Text */
text-beige-900 (foreground)
text-muted-foreground (secondary text)
```

### Effects to Apply:
```css
/* Glass Panel Custom Class */
.glass-panel-light {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  border: 1px solid rgba(185, 179, 132, 0.3);
  box-shadow: 0 6px 32px 0 rgba(123, 91, 44, 0.08);
}

/* Hover Effects (Subtle) */
.hover-lift      → transform: translateY(-4px)
.hover-glow      → var(--shadow-glow)
```

### Animations:
- `animate-fade-in` - For sections loading
- `animate-slide-up` - For staggered content entry
- No continuous animations (bounce, float) - keep it subtle

## Component Architecture

### 1. DashboardLayout.tsx
**Purpose**: Wrapper component with glass-panel styling and structure
**Props**: `children`, `role`
**Features**:
- Single column scroll container
- Glass panel background
- Consistent padding and spacing
- Max-width container

### 2. DashboardHeader.tsx
**Purpose**: Role-specific greeting and user info
**Props**: `userName`, `role`
**Features**:
- Role-based greeting text
- Role badge display
- Ancient Fantasy themed avatar placeholder

### 3. StatsGrid.tsx
**Purpose**: Display dashboard statistics with consistent styling
**Props**: `stats: StatCard[]`
**Features**:
- Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
- Uses StatsCard component from `features/creator/components/dashboard/StatsCard.tsx`
- Staggered animations on load

### 4. RecentCourses.tsx
**Purpose**: Display recent/ongoing courses with progress
**Props**: `courses: RecentCourse[]`, `onContinue`, `onViewAll`
**Features**:
- Glass panel card for each course
- Progress bar with hijau accent color
- "Continue" / "Review" action buttons
- Uses Progress component from `components/ui/progress.tsx`

### 5. QuickActions.tsx
**Purpose**: Role-specific quick action buttons
**Props**: `actions: QuickAction[]`
**Features**:
- Uses ActionButton component from `features/creator/components/dashboard/ActionButton.tsx`
- Color scheme based on action type
- Hover glow effects

### 6. Recommendations.tsx
**Purpose**: Display course recommendations
**Props**: `recommendations: Recommendation[]`
**Features**:
- Glass panel cards
- Subtle hover lift effect
- "Enroll" action buttons

## Role Differentiation

### User Dashboard (Learner Focus)
**Stats**:
- Courses Enrolled (kuning accent)
- Courses Completed (hijau accent)
- Learning Hours (merah accent)
- Certificates Earned (beige accent)

**Quick Actions**:
- Explore Courses
- Continue Learning
- View Certificates
- Edit Profile

**Recent Courses**:
- Progress tracking
- Last accessed date
- Continue button

**Recommendations**:
- Based on learning history
- Similar courses
- Difficulty progression

### Creator Dashboard (Content Focus)
**Stats**:
- Total Courses (hijau accent)
- Published Courses (kuning accent)
- Total Students (merah accent)
- Monthly Earnings (beige accent)

**Quick Actions**:
- Create New Course
- View Analytics
- Manage Students
- Course Settings

**Recent Courses**:
- Status badges (Published, Draft, Review)
- Student count
- Revenue display

**Recommendations**:
- Content performance tips
- Trending topics
- Student feedback patterns

### Admin Dashboard (System Focus)
**Stats**:
- System Health (hijau accent)
- Active Users (kuning accent)
- Total Revenue (merah accent)
- Platform Issues (beige accent)

**Quick Actions**:
- User Management
- Content Moderation
- System Settings
- View Analytics

**Recent Courses**:
- Course quality metrics
- Flagged content
- Recent submissions

**Recommendations**:
- System optimization alerts
- Security warnings
- Feature adoption insights

## Data Structures (features/dashboard/types.ts)

```typescript
// Base stats interface
export interface StatCard {
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

// Recent course interface
export interface RecentCourse {
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

// Quick action interface
export interface QuickAction {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  colorScheme?: 'merah' | 'kuning' | 'hijau' | 'beige'
}

// Recommendation interface
export interface Recommendation {
  id: string
  title: string
  description: string
  reason: string
  thumbnail?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
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

// Dashboard data interface
export interface DashboardData {
  stats: StatCard[]
  recentCourses: RecentCourse[]
  quickActions: QuickAction[]
  recommendations: Recommendation[]
}
```

## API Pattern (features/dashboard/api.ts)

```typescript
// API client pattern (ready for real implementation)
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

// Mock data function (for development)
export function getMockDashboardData(
  role: 'user' | 'creator' | 'admin'
): DashboardData {
  // Returns mock data based on role
}
```

## Implementation Tasks

### Phase 1: Setup & Types
- [ ] Create `features/dashboard/types.ts` with all TypeScript interfaces
- [ ] Create `features/dashboard/api.ts` with mock data and API pattern
- [ ] Add custom glass-panel-light CSS utility to `styles/globals.css`

### Phase 2: Component Development
- [ ] Create `DashboardLayout.tsx` - Main layout with glass-panel style
- [ ] Create `DashboardHeader.tsx` - Role-based header
- [ ] Create `StatsGrid.tsx` - Reusable stats grid using existing StatsCard
- [ ] Create `RecentCourses.tsx` - Course list with progress bars
- [ ] Create `QuickActions.tsx` - Role-specific actions
- [ ] Create `Recommendations.tsx` - Course recommendations
- [ ] Create `features/dashboard/components/index.ts` for clean exports

### Phase 3: Role-Specific Data
- [ ] Implement mock data for User Dashboard stats
- [ ] Implement mock data for Creator Dashboard stats
- [ ] Implement mock data for Admin Dashboard stats
- [ ] Create role-based quick actions for each role
- [ ] Create role-specific recent courses/recommendations

### Phase 4: Page Integration
- [ ] Rewrite `app/dashboard/page.tsx` to use new components
- [ ] Implement role-based content switching (user/creator/admin)
- [ ] Add loading state with themed skeleton
- [ ] Add error state handling
- [ ] Apply single-column scroll layout

### Phase 5: Styling & Polish
- [ ] Apply glass-panel-light style to all cards
- [ ] Add hover-glow and hover-lift effects
- [ ] Implement staggered animations (animate-slide-up with delays)
- [ ] Ensure consistent spacing (4px scale)
- [ ] Add responsive breakpoints for mobile

## Existing Patterns to Reuse

### From `features/creator/components/dashboard/`:
- `StatsCard.tsx` - Use for all dashboard stats (supports hijau, kuning, merah, beige colors)
- `ActionButton.tsx` - Use for quick actions

### From `features/course/components/`:
- `CourseCard.tsx` - Reference for progress pattern and course display

### From `components/ui/`:
- `progress.tsx` - For course progress bars
- `badge.tsx` - For status badges
- `skeleton.tsx` - For loading states
- `button.tsx` - For action buttons

### From `features/auth/`:
- `useUserRole()` - For role detection
- `useRoleGuard()` - For permission checks
- `useRoleLoadingState()` - For loading state

## Critical File References

| File | Purpose | Usage |
|------|---------|--------|
| `features/creator/components/dashboard/StatsCard.tsx` | Reusable stats component | Use for all dashboard stats |
| `features/creator/components/dashboard/ActionButton.tsx` | Action button with icon | Use for quick actions |
| `components/ui/progress.tsx` | Progress bar component | Use for course progress |
| `styles/globals.css` | Design system | All colors, effects, shadows |
| `features/course/api.ts` | API pattern reference | Follow same structure |
| `app/creator/page.tsx` | Themed dashboard example | Reference for styling |
| `app/admin/page.tsx` | Themed dashboard example | Reference for styling |

## Verification

### Manual Testing:
1. Navigate to `/dashboard` as each role (user, creator, admin)
2. Verify glass-panel effect is visible (80% opacity with blur)
3. Check hover effects (lift and glow) on all interactive elements
4. Verify role-specific content displays correctly:
   - User: Learner stats and courses
   - Creator: Content stats and actions
   - Admin: System stats and actions
5. Test responsive layout on mobile, tablet, desktop
6. Verify loading state with themed skeleton
7. Check color contrast for accessibility

### Code Quality:
- Run `yarn type-check` - Ensure no TypeScript errors
- Run `yarn lint` - Ensure zero warnings
- Verify no console errors in browser

### Visual Verification:
- All sections display with glass-panel effect
- Hover effects are subtle (not overwhelming)
- Colors match Ancient Fantasy Asia theme (no blue/indigo/purple)
- Single column scroll layout works smoothly
- Staggered animations load correctly

## Notes

1. **Component Reuse**: Maximize reuse of existing StatsCard and ActionButton components
2. **API Pattern Ready**: Structure API functions now to avoid refactoring later
3. **Consistent Theming**: Use only theme colors (beige, kuning, hijau, merah)
4. **Light Glass**: 80% opacity is more transparent than standard - test readability
5. **Subtle Effects**: No continuous animations, only hover-based effects
6. **Single Column**: Simpler than sidebar, focus on content readability
