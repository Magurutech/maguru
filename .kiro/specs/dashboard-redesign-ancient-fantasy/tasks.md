# Implementation Plan: Dashboard Redesign - Ancient Fantasy Asia

## Overview

This implementation plan breaks down the dashboard redesign into discrete, incremental tasks. Each task builds on previous work and includes validation through code execution. The focus is on creating reusable components with the Ancient Fantasy Asia design system, starting with the User/Learner dashboard.

## Tasks

- [x] 1. Setup project structure and type definitions
  - Create `features/dashboard/` directory structure
  - Create `features/dashboard/types.ts` with all TypeScript interfaces (StatCard, RecentCourse, QuickAction, Recommendation, DashboardData, role-specific stats interfaces)
  - Create `features/dashboard/utils.ts` for helper functions
  - _Requirements: 11.1, 11.3, 12.6_

- [x] 2. Add glass-panel-light CSS utility
  - Add `.glass-panel-light` class to `styles/globals.css` with 80% opacity, backdrop-filter blur(7px), themed border and shadow
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. Implement API client with mock data
  - [x] 3.1 Create `features/dashboard/api.ts` with `getDashboardData()` function
    - Implement fetch to `/api/dashboard/{role}` with error handling
    - Implement fallback to `getMockDashboardData()` on error
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 3.2 Implement `getMockDashboardData()` with role-specific data
    - Create `getUserMockData()` with learner-focused stats (Courses Enrolled, Courses Completed, Learning Hours, Certificates)
    - Create `getCreatorMockData()` with content-focused stats (Total Courses, Published Courses, Total Students, Monthly Earnings)
    - Create `getAdminMockData()` with system-focused stats (System Health, Active Users, Total Revenue, Platform Issues)
    - _Requirements: 12.4, 12.5, 3.1, 3.2, 3.3_

  - [x] 3.3 Implement `generateRecommendations()` rule-based logic
    - Rule 1: If user took React course, recommend Advanced React Patterns
    - Rule 2: If user completed frontend courses, recommend Node.js Backend
    - Rule 3: Default recommendations for new users
    - _Requirements: 7.3, 7.4_

  - [x]* 3.4 Write property test for mock data structure consistency
    - **Property 11: Mock Data Structure Consistency**
    - **Validates: Requirements 12.5**

- [x] 4. Create DashboardLayout component
  - [x] 4.1 Create `features/dashboard/components/DashboardLayout.tsx`
    - Accept `children` and `role` props
    - Apply `bg-ancient-fantasy` gradient background
    - Use `max-w-7xl mx-auto` container with `p-6` padding
    - Apply `space-y-8` for vertical rhythm
    - _Requirements: 1.3, 9.1, 9.5, 9.6_

  - [x]* 4.2 Write unit tests for DashboardLayout
    - Test background gradient is applied
    - Test max-width container is present
    - Test padding is consistent
    - _Requirements: 1.3, 9.5, 9.6_

- [] 5. Create DashboardHeader component
  - [] 5.1 Create `features/dashboard/components/DashboardHeader.tsx`
    - Accept `userName` and `role` props
    - Display role-appropriate title (Dashboard Learner/Creator/Admin)
    - Show personalized greeting with user's first name
    - Display role badge with themed color
    - Apply `.glass-panel-light` styling
    - _Requirements: 3.1, 3.2, 3.3, 2.1_

  - []* 5.2 Write property test for role-based title display
    - **Property 1: Role-Based Stats Display** (partial - header titles)
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 6. Create StatsGrid component
  - [x] 6.1 Create `features/dashboard/components/StatsGrid.tsx`
    - Accept `stats` array prop
    - Render responsive grid (1/2/4 columns)
    - Reuse `StatsCard` from `features/creator/components/dashboard/StatsCard.tsx`
    - Apply staggered animation delays (0ms, 100ms, 200ms, 300ms)
    - _Requirements: 4.1, 4.2, 9.2, 9.3, 9.4, 4.7_

  - [x]* 6.2 Write property test for responsive grid layout
    - **Property 8: Responsive Grid Layout**
    - **Validates: Requirements 4.1, 9.2, 9.3, 9.4**

  - [x]* 6.3 Write property test for staggered animation delays
    - **Property 10: Staggered Animation Delays**
    - **Validates: Requirements 10.4**

- [x] 7. Create RecentCourses component
  - [x] 7.1 Create `features/dashboard/components/RecentCourses.tsx`
    - Accept `courses`, `onContinue`, `onViewAll` props
    - Display course list with `.glass-panel-light` cards
    - Show course title, instructor, progress, last accessed date
    - Use `Progress` component from `components/ui/progress.tsx` with hijau color
    - Display "Continue" button for incomplete courses, "Review" for completed
    - Apply `hover:bg-beige-50` transition
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x]* 7.2 Write property test for course information completeness
    - **Property 3: Course Information Completeness**
    - **Validates: Requirements 5.2**

  - [x]* 7.3 Write property test for course completion button text
    - **Property 5: Course Completion Button Text**
    - **Validates: Requirements 5.5, 5.6**

  - [x]* 7.4 Write property test for progress bar styling
    - **Property 4: Progress Bar Styling**
    - **Validates: Requirements 5.4**

- [x] 8. Create QuickActions component
  - [x] 8.1 Create `features/dashboard/components/QuickActions.tsx`
    - Accept `actions` array prop
    - Reuse `ActionButton` from `features/creator/components/dashboard/ActionButton.tsx`
    - Apply `.glass-panel-light` container styling
    - Use `space-y-3` for vertical stacking
    - Apply `hover-glow` effect to buttons
    - _Requirements: 6.1, 6.5, 6.6_

  - [x]* 8.2 Write unit tests for role-specific quick actions
    - Test user role shows "Explore Courses", "Continue Learning", "View Certificates", "Edit Profile"
    - Test creator role shows "Creator Studio" as first action
    - Test admin role shows "Admin Panel" as first action
    - _Requirements: 6.2, 6.3, 6.4_

- [x] 9. Create Recommendations component
  - [x] 9.1 Create `features/dashboard/components/Recommendations.tsx`
    - Accept `recommendations` array prop
    - Display recommendation cards with `.glass-panel-light` styling
    - Show title, description, and reasoning text
    - Apply `hover-lift` effect (translateY(-4px))
    - Use role-specific background tints
    - _Requirements: 7.1, 7.2, 7.5, 7.6_

  - [x]* 9.2 Write property test for recommendation content completeness
    - **Property 6: Recommendation Content Completeness**
    - **Validates: Requirements 7.2**

  - [x]* 9.3 Write property test for React-based recommendations
    - **Property 7: React-Based Recommendations**
    - **Validates: Requirements 7.3, 7.4**

- [x] 10. Create component exports
  - Create `features/dashboard/components/index.ts` to export all components
  - _Requirements: 11.5_

- [x] 11. Checkpoint - Ensure all components render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Rewrite app/dashboard/page.tsx
  - [x] 12.1 Import and use new dashboard components
    - Import `DashboardLayout`, `DashboardHeader`, `StatsGrid`, `RecentCourses`, `QuickActions`, `Recommendations`
    - Import `getDashboardData` from `features/dashboard/api`
    - Import auth hooks: `useUserRole`, `useRoleGuard`, `useRoleLoadingState`
    - _Requirements: 11.2_

  - [x] 12.2 Implement loading state with themed skeleton
    - Use `bg-ancient-fantasy` background
    - Display animated skeleton elements with beige colors
    - Use `useRoleLoadingState()` hook
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 12.3 Implement error state for unauthenticated users
    - Display access denied message with `.glass-panel-light` styling
    - Show login button with `bg-merah-500` color
    - Use `canAccessUser()` from `useRoleGuard`
    - _Requirements: 8.5_

  - [x] 12.4 Implement main dashboard rendering
    - Fetch dashboard data using `getDashboardData(role)`
    - Render `DashboardLayout` with role prop
    - Render `DashboardHeader` with userName and role
    - Render `StatsGrid` with stats data
    - Render `RecentCourses` with courses data
    - Render `QuickActions` with actions data
    - Render `Recommendations` with recommendations data
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 5.1, 6.1, 7.1_

  - [x]* 12.5 Write property test for role-based stats display
    - **Property 1: Role-Based Stats Display**
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [x]* 12.6 Write property test for themed color usage
    - **Property 2: Themed Color Usage**
    - **Validates: Requirements 1.1, 1.2, 3.4**

- [x] 13. Implement hover and animation effects
  - [x] 13.1 Apply hover effects to interactive elements
    - Add `hover-lift` class to course cards and recommendation cards
    - Add `hover-glow` class to action buttons
    - Ensure CSS transitions are applied
    - _Requirements: 10.1, 10.2, 7.6_

  - [x] 13.2 Apply slide-up animations to sections
    - Add `animate-slide-up` class to dashboard sections
    - Ensure animations respect `prefers-reduced-motion`
    - _Requirements: 10.3, 10.6_

  - [x]* 13.3 Write property test for hover effects
    - **Property 9: Hover Effects on Interactive Elements**
    - **Validates: Requirements 10.1, 10.2**

- [x] 14. Implement accessibility features
  - [x] 14.1 Add ARIA labels to icon-only buttons
    - Identify all icon-only buttons
    - Add descriptive `aria-label` attributes
    - _Requirements: 13.1_

  - [x] 14.2 Ensure semantic HTML structure
    - Use `<header>`, `<main>`, `<section>`, `<nav>` elements appropriately
    - _Requirements: 13.3_

  - [x] 14.3 Verify focus indicators
    - Ensure all interactive elements show focus indicators
    - Use existing `focus-visible` styles from `styles/globals.css`
    - _Requirements: 13.2, 13.6_

  - [x]* 14.4 Write property test for icon-only button accessibility
    - **Property 12: Icon-Only Button Accessibility**
    - **Validates: Requirements 13.1**

  - [x]* 14.5 Write property test for keyboard navigation focus indicators
    - **Property 13: Keyboard Navigation Focus Indicators**
    - **Validates: Requirements 13.2**

  - [x]* 14.6 Write property test for color contrast compliance
    - **Property 14: Color Contrast Compliance**
    - **Validates: Requirements 13.4**

  - [x]* 14.7 Write property test for keyboard accessibility
    - **Property 15: Keyboard Accessibility**
    - **Validates: Requirements 13.5**

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Manual testing and verification
  - [ ] 16.1 Test dashboard as user role
    - Verify learner-focused stats display
    - Verify recent courses with progress bars
    - Verify user-specific quick actions
    - Verify recommendations based on learning history
    - _Requirements: 3.1, 5.1, 6.2, 7.1_

  - [ ] 16.2 Test dashboard as creator role
    - Verify creator-focused stats display
    - Verify "Creator Studio" quick action is first
    - _Requirements: 3.2, 6.3_

  - [ ] 16.3 Test dashboard as admin role
    - Verify admin-focused stats display
    - Verify "Admin Panel" quick action is first
    - _Requirements: 3.3, 6.4_

  - [ ] 16.4 Test responsive layout
    - Test mobile view (1 column stats)
    - Test tablet view (2 column stats)
    - Test desktop view (4 column stats)
    - _Requirements: 9.2, 9.3, 9.4_

  - [ ] 16.5 Test hover effects and animations
    - Verify hover-lift on cards
    - Verify hover-glow on buttons
    - Verify slide-up animations on load
    - Verify staggered animation delays
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 16.6 Test loading and error states
    - Verify skeleton loader displays correctly
    - Verify access denied message for unauthenticated users
    - _Requirements: 8.1, 8.5_

  - [ ] 16.7 Test accessibility
    - Test keyboard navigation (Tab through all elements)
    - Verify focus indicators are visible
    - Test with screen reader (optional but recommended)
    - _Requirements: 13.1, 13.2, 13.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Manual testing verifies end-to-end user experience
- All components reuse existing `StatsCard` and `ActionButton` from `features/creator`
- Mock data is used initially with API-ready structure for easy swap to real API later
