# Requirements Document

## Introduction

This document specifies the requirements for redesigning the User Dashboard (`/dashboard`) to align with the Ancient Fantasy Asia design system. The current dashboard uses default Tailwind colors (blue, indigo, purple) that don't match the project's themed color palette. This redesign will apply the themed colors (beige, kuning, hijau, merah), implement glass-panel effects with 80% opacity, and provide role-differentiated content for user, creator, and admin roles.

The redesign focuses on the User/Learner role dashboard as the primary implementation, with the architecture designed to be reusable for Creator and Admin roles in future iterations.

## Glossary

- **Dashboard**: The main authenticated user landing page at `/dashboard` route
- **Glass_Panel**: A UI component with 80% opacity background, backdrop blur effect, and subtle border
- **Ancient_Fantasy_Theme**: The project's design system using beige, kuning (yellow-orange), hijau (green), and merah (red) color palette
- **User_Role**: The learner/student role with focus on course consumption and learning progress
- **Creator_Role**: The content creator role with focus on course creation and student management
- **Admin_Role**: The system administrator role with focus on platform management
- **Stats_Card**: A reusable component displaying a metric with icon, title, value, and optional subtitle
- **Quick_Action**: A button that navigates to a specific feature or page
- **Recent_Course**: A course the user has recently accessed or is currently enrolled in
- **Recommendation**: A suggested course based on user's learning history or patterns
- **Mock_Data**: Hardcoded data used during development before API integration
- **API_Pattern_Ready**: Code structure that can easily swap from mock data to real API calls

## Requirements

### Requirement 1: Design System Integration

**User Story:** As a developer, I want the dashboard to use the Ancient Fantasy Asia design system, so that it matches the visual identity of the rest of the application.

#### Acceptance Criteria

1. THE Dashboard SHALL use only themed colors from the design system (beige, kuning, hijau, merah)
2. THE Dashboard SHALL NOT use default Tailwind colors (blue, indigo, purple, gray-based backgrounds)
3. WHEN displaying the dashboard background, THE Dashboard SHALL use `bg-ancient-fantasy` gradient or `bg-beige-50`
4. WHEN displaying text, THE Dashboard SHALL use `text-beige-900` for primary text and `text-muted-foreground` for secondary text
5. THE Dashboard SHALL use themed color variables defined in `styles/globals.css`

### Requirement 2: Glass Panel Effects

**User Story:** As a user, I want dashboard cards to have a modern glass-panel aesthetic, so that the interface feels premium and visually appealing.

#### Acceptance Criteria

1. THE Dashboard SHALL implement a custom `.glass-panel-light` CSS class with 80% opacity
2. WHEN rendering cards, THE Dashboard SHALL apply `background-color: rgba(255, 255, 255, 0.8)`
3. WHEN rendering cards, THE Dashboard SHALL apply `backdrop-filter: blur(7px)` for glass effect
4. WHEN rendering cards, THE Dashboard SHALL apply border with `rgba(185, 179, 132, 0.3)` color
5. WHEN rendering cards, THE Dashboard SHALL apply shadow `0 6px 32px 0 rgba(123, 91, 44, 0.08)`

### Requirement 3: Role-Based Content Display

**User Story:** As a user with a specific role, I want to see dashboard content relevant to my role, so that I can quickly access the features I need.

#### Acceptance Criteria

1. WHEN a user with 'user' role accesses the dashboard, THE Dashboard SHALL display learner-focused stats (Courses Enrolled, Courses Completed, Learning Hours, Certificates Earned)
2. WHEN a user with 'creator' role accesses the dashboard, THE Dashboard SHALL display creator-focused stats (Total Courses, Published Courses, Total Students, Monthly Earnings)
3. WHEN a user with 'admin' role accesses the dashboard, THE Dashboard SHALL display admin-focused stats (System Health, Active Users, Total Revenue, Platform Issues)
4. WHEN displaying stats, THE Dashboard SHALL use role-appropriate icon colors (kuning, hijau, merah, beige)
5. THE Dashboard SHALL use the existing `useUserRole()` hook to detect the current user's role

### Requirement 4: Statistics Display

**User Story:** As a user, I want to see my key metrics at a glance, so that I can track my progress and activity.

#### Acceptance Criteria

1. THE Dashboard SHALL display statistics in a responsive grid (1 column mobile, 2 columns tablet, 4 columns desktop)
2. WHEN rendering statistics, THE Dashboard SHALL use the existing `StatsCard` component from `features/creator/components/dashboard/StatsCard.tsx`
3. WHEN displaying user role stats, THE Dashboard SHALL show Courses Enrolled with kuning accent
4. WHEN displaying user role stats, THE Dashboard SHALL show Courses Completed with hijau accent
5. WHEN displaying user role stats, THE Dashboard SHALL show Learning Hours with merah accent
6. WHEN displaying user role stats, THE Dashboard SHALL show Certificates Earned with beige accent
7. THE Dashboard SHALL load stats with staggered animation delays for visual appeal

### Requirement 5: Recent Courses Section

**User Story:** As a user, I want to see my recent courses with progress tracking, so that I can continue learning where I left off.

#### Acceptance Criteria

1. THE Dashboard SHALL display a "Recent Courses" section with glass-panel styling
2. WHEN displaying courses, THE Dashboard SHALL show course title, instructor name, progress percentage, and last accessed date
3. WHEN displaying course progress, THE Dashboard SHALL use the `Progress` component from `components/ui/progress.tsx`
4. WHEN displaying progress bars, THE Dashboard SHALL use hijau color for the progress indicator
5. WHEN a course is 100% complete, THE Dashboard SHALL display a "Review" button instead of "Continue"
6. WHEN a course is incomplete, THE Dashboard SHALL display a "Continue" button
7. THE Dashboard SHALL display a "View All" button to navigate to the full course list

### Requirement 6: Quick Actions Section

**User Story:** As a user, I want quick access to common actions, so that I can navigate efficiently to frequently used features.

#### Acceptance Criteria

1. THE Dashboard SHALL display a "Quick Actions" section with role-specific actions
2. WHEN displaying quick actions for user role, THE Dashboard SHALL include "Explore Courses", "Continue Learning", "View Certificates", and "Edit Profile"
3. WHEN displaying quick actions for creator role, THE Dashboard SHALL include "Creator Studio" as the first action
4. WHEN displaying quick actions for admin role, THE Dashboard SHALL include "Admin Panel" as the first action
5. WHEN rendering action buttons, THE Dashboard SHALL use the existing `ActionButton` component from `features/creator/components/dashboard/ActionButton.tsx`
6. THE Dashboard SHALL apply hover-glow effect to action buttons

### Requirement 7: Course Recommendations

**User Story:** As a user, I want to see course recommendations based on my learning history, so that I can discover relevant content to continue my learning journey.

#### Acceptance Criteria

1. THE Dashboard SHALL display a "Recommendations" section with suggested courses
2. WHEN displaying recommendations, THE Dashboard SHALL show course title, description, and reasoning
3. WHEN generating recommendations, THE Dashboard SHALL use rule-based logic (e.g., "If user took React, recommend Advanced React")
4. THE Dashboard SHALL display reasoning text like "Berdasarkan progress React Anda" or "Melengkapi skill frontend Anda"
5. WHEN rendering recommendation cards, THE Dashboard SHALL apply glass-panel styling
6. WHEN hovering over recommendation cards, THE Dashboard SHALL apply subtle lift effect (translateY(-4px))

### Requirement 8: Loading and Error States

**User Story:** As a user, I want to see appropriate feedback when the dashboard is loading or encounters errors, so that I understand the system state.

#### Acceptance Criteria

1. WHEN the dashboard is loading user data, THE Dashboard SHALL display a themed skeleton loader
2. WHEN the dashboard is loading, THE Dashboard SHALL use `bg-ancient-fantasy` background
3. WHEN the dashboard is loading, THE Dashboard SHALL display animated skeleton elements with beige colors
4. WHEN role data is loading, THE Dashboard SHALL use the `useRoleLoadingState()` hook
5. IF the user is not authenticated, THE Dashboard SHALL display an access denied message with a login button

### Requirement 9: Responsive Layout

**User Story:** As a user on any device, I want the dashboard to adapt to my screen size, so that I can access it comfortably on mobile, tablet, or desktop.

#### Acceptance Criteria

1. THE Dashboard SHALL use a single-column scroll layout structure
2. WHEN viewed on mobile, THE Dashboard SHALL display stats in 1 column
3. WHEN viewed on tablet, THE Dashboard SHALL display stats in 2 columns
4. WHEN viewed on desktop, THE Dashboard SHALL display stats in 4 columns
5. THE Dashboard SHALL use a max-width container for content (max-w-7xl)
6. THE Dashboard SHALL apply consistent padding using the 4px spacing scale

### Requirement 10: Hover and Animation Effects

**User Story:** As a user, I want subtle visual feedback when interacting with dashboard elements, so that the interface feels responsive and polished.

#### Acceptance Criteria

1. WHEN hovering over interactive cards, THE Dashboard SHALL apply `hover-lift` effect (translateY(-4px))
2. WHEN hovering over action buttons, THE Dashboard SHALL apply `hover-glow` effect
3. WHEN loading dashboard sections, THE Dashboard SHALL use `animate-slide-up` animation
4. THE Dashboard SHALL apply staggered animation delays to stats cards (0ms, 100ms, 200ms, 300ms)
5. THE Dashboard SHALL use CSS transitions only (no JavaScript animation libraries)
6. THE Dashboard SHALL respect `prefers-reduced-motion` for accessibility

### Requirement 11: Component Architecture

**User Story:** As a developer, I want the dashboard to use reusable components, so that the code is maintainable and consistent.

#### Acceptance Criteria

1. THE Dashboard SHALL create a `features/dashboard/` directory structure
2. THE Dashboard SHALL create reusable components: `DashboardLayout`, `DashboardHeader`, `StatsGrid`, `RecentCourses`, `QuickActions`, `Recommendations`
3. THE Dashboard SHALL create a `features/dashboard/types.ts` file with TypeScript interfaces
4. THE Dashboard SHALL create a `features/dashboard/api.ts` file with API client functions
5. THE Dashboard SHALL export all components from `features/dashboard/components/index.ts`
6. THE Dashboard SHALL reuse existing `StatsCard` component from `features/creator/components/dashboard/StatsCard.tsx`
7. THE Dashboard SHALL reuse existing `ActionButton` component from `features/creator/components/dashboard/ActionButton.tsx`

### Requirement 12: Data Management

**User Story:** As a developer, I want the dashboard to use mock data with an API-ready pattern, so that we can easily swap to real API calls later.

#### Acceptance Criteria

1. THE Dashboard SHALL implement a `getDashboardData()` function that accepts role parameter
2. WHEN fetching dashboard data, THE Dashboard SHALL attempt to fetch from `/api/dashboard/{role}` endpoint
3. IF the API call fails, THE Dashboard SHALL fallback to `getMockDashboardData()` function
4. THE Dashboard SHALL implement `getMockDashboardData()` function with role-specific mock data
5. THE Dashboard SHALL structure mock data to match the expected API response format
6. THE Dashboard SHALL use TypeScript interfaces for all data structures

### Requirement 13: Accessibility

**User Story:** As a user with accessibility needs, I want the dashboard to be keyboard navigable and screen reader friendly, so that I can use it effectively.

#### Acceptance Criteria

1. THE Dashboard SHALL provide ARIA labels for icon-only buttons
2. WHEN a user tabs through the dashboard, THE Dashboard SHALL show visible focus indicators
3. THE Dashboard SHALL use semantic HTML elements (header, main, section, nav)
4. THE Dashboard SHALL ensure color contrast meets WCAG AA standards
5. THE Dashboard SHALL support keyboard navigation for all interactive elements
6. THE Dashboard SHALL use the existing focus-visible styles from `styles/globals.css`
