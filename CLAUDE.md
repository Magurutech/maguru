# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Maguru is a Next.js-based e-learning platform built with TypeScript, using a feature-first modular monolith architecture. The project combines educational content management with course creation tools and AI-powered learning assistance.

## Plan & Review

- Always in Plan mode to make a plan
- after get the plan, make sure you write the plan to `.claude/tasks/TASK_NAME.md`
- after task completed, make sure you write report to `.claude/reports/TASK_NAME.md`
- The plan should be a detailed implementation plan and reasoning behind them, as well as tasks broken down
- if task require external knowledge or certain package, also research to get latest knowledge (use Task tool for research)
- Don't over plan it, always think MVP.
- Once you write the plan, firstly ask me to review it. Do not continue until i approve the plan

### While Implementing

- You should update the plan as you work
- after you complete tasks in the plan, you should update and append detailed description of the changes you made, so following tasks can be easily hand over to other engineers.

## Key Commands

### Development

```bash
# Start development server (dev environment with Turbopack)
yarn app

# Start development server (production environment)
yarn app:prod

# Build the application
yarn build

# Bundle analysis
yarn build:analyze

# Start production server
yarn start
```

### Code Quality

```bash
# Run ESLint with zero warnings tolerance
yarn lint

# Auto-fix ESLint issues
yarn lint:fix

# TypeScript type checking
yarn type-check

# Environment validation
yarn env:validate
```

### Testing

#### Unit & Integration Tests

```bash
# Run specific test file (replace with actual path)
yarn test features/course/components/CourseCard.test.tsx

# Run all unit tests in features directory
yarn test:unit:all

# Run all integration tests
yarn test:integration:all

# Run tests with coverage
yarn test:coverage

# Watch mode for development
yarn test:watch
```

#### E2E Tests (Playwright)

```bash
# Run specific E2E test with debug
yarn test:e2e

# Run all E2E tests
yarn test:e2e:all

# Run E2E with UI
yarn test:e2e:ui

# Debug specific test
yarn test:e2e:debug

# View test reports
yarn test:e2e:report
```

### Database

```bash
# Test database connection
yarn test:db
```

## Architecture Overview

### High-Level Structure

The project follows a **Simplified Feature-First Modular Monolith** optimized for small teams:

- **Presentation Layer**: React components, simple local state
- **Logic Layer**: Custom hooks, API routes
- **Data Layer**: Prisma ORM, database operations
- **Services Layer**: Shared utilities (logging, external integrations)

**Key Principle**: Prefer simplicity over enterprise patterns. Avoid over-engineering for current team size (2 developers).

### Directory Structure

```
/
├── app/                # Next.js App Router (routes, layouts, API endpoints)
│   ├── api/           # API routes for backend logic
│   ├── admin/         # Admin dashboard routes
│   ├── creator/       # Creator dashboard routes
│   └── ...            # Other app routes
├── features/           # Feature modules (auth, homepage, course, langserve)
│   └── [feature]/
│       ├── components/ # UI components (Presentation Layer)
│       ├── hooks/      # Business logic hooks (Logic Layer)
│       ├── types/      # TypeScript definitions
│       ├── lib/        # Feature-specific utilities
│       └── api.ts      # API client functions
├── lib/                # Shared utilities and global state
├── services/           # Shared services (logger, external integrations)
├── prisma/             # Database schema and migrations
├── __tests__/          # Testing infrastructure
│   ├── integration/    # Integration tests
│   └── playwright/     # E2E tests
└── components/         # Shared UI components (shadcn/ui)
```

### Current Features (Implemented)

- **auth**: Authentication using Clerk (3 roles: admin, creator, user)
- **homepage**: Landing page and marketing content
- **course**: Course management and creation
- **dashboard**: Dashboard components
- **creator**: Creator dashboard functionality
- **langserve**: AI chatbot assistant with LangServe backend integration

### LangServe Integration

The `langserve` feature provides AI-powered learning assistance through LangServe backend:

**Key Components:**

- **SSE Streaming**: Server-Sent Events for real-time AI responses
- **AI Chains**: Multiple specialized chains (chatbot, explain-code, hint, quiz-feedback, greeting)
- **Error Handling**: Comprehensive timeout and error management
- **Logging**: Integrated with the logger service

**Available Chains:**

- `streamChatbot`: Personal AI tutor for course questions
- `streamExplainCode`: Code explanation for students
- `streamHint`: Progressive hints for exercises
- `streamQuizFeedback`: Feedback on quiz answers
- `streamGreeting`: Personalized student greetings

**Configuration:**

- LangServe URL: `NEXT_PUBLIC_LANGSERVE_URL` (default: `http://localhost:8000`)
- Default timeout: 30 seconds
- Health check endpoint: `/health`

### Services Layer

The `services/` folder contains shared utilities used across the application:

**logger.ts**: Centralized logging utility compatible with Next.js (server and client)

- **Log levels**: error, warn, info, http, verbose, debug
- **Context-aware**: Separate logs by service/module
- **Performance tracking**: Built-in timer and memory usage tracking
- **File logging**: Server-side logs written to `services/logger-detailed/`
- **Environment-based**: Debug level in development, info level in production

**Usage pattern:**

```typescript
import { logger } from '@/services/logger'

logger.info('ContextName', 'functionName', 'Message', { optionalData })
logger.error('ContextName', 'functionName', 'Error message', errorObject)
```

### Planned Features

- **user_manage**: User management functionality

**Note**: The auth feature currently has complex context management (856 lines) that should be simplified to basic hooks for better maintainability.

## Technology Stack

### Core Technologies

- **Next.js 15.5.3** with App Router
- **React 19** with TypeScript (strict mode enabled)
- **Prisma 6.16.1** + **Supabase** for database operations
- **Clerk 6.32.0** for authentication
- **TailwindCSS 4.1.13** + **shadcn/ui** for styling
- **LangServe** for AI backend integration (chatbot assistant)
- **Design System**: Ancient Fantasy Asia theme with comprehensive UI/UX guidelines

### State Management

**Simplified Approach for Small Teams:**

- **Custom Hooks** for feature-specific business logic (preferred)
- **TanStack Query** for server state caching and API calls
- **useState/useReducer** for local component state
- **Context API** only when truly global state is needed (avoid over-engineering)

### Testing & Quality

- **Jest** + **React Testing Library** for unit/integration tests
- **Playwright** for E2E testing with Clerk integration
- **ESLint** + **Prettier** for code quality
- **MSW** for API mocking

## Development Guidelines

### Architecture Principles for Small Teams

**Priority Order:**

1. **Simplicity over Enterprise Patterns** - Avoid over-engineering for 2-developer team
2. **Eliminate Duplicate Code** - Create shared utilities and hooks instead of copying
3. **Easy Onboarding** - New developers should understand architecture quickly
4. **Maintainable Growth** - Structure should support adding features without complexity explosion

### State Management Hierarchy (Simplified)

1. **Feature State** → Use Custom Hooks (business logic, data fetching) - **Preferred approach**
2. **Component State** → Use useState/useReducer (local UI state, forms)
3. **Global State** → Use Context API only when absolutely necessary (theme, truly global auth state)

**Anti-pattern**: Avoid complex Context with reducers, error boundaries, cross-tab sync unless actually needed.

### Naming Conventions

- **Files/Directories**: `kebab-case` (e.g., `manage-course`, `user-settings`)
- **Components**: `PascalCase` (e.g., `CourseCard.tsx`, `UserProfile`)
- **Hooks**: `use` prefix + `camelCase` (e.g., `useCourse`, `useAuth`)
- **API Files**: `api.ts` (consistent across all features)
- **Types**: `[feature].types.ts` or `types.ts` within feature folders

### Feature Development Pattern (Simplified)

**For New Features, Create:**

1. **UI Components** in `features/[feature]/components/`
2. **Business Logic** in `features/[feature]/hooks/` (custom hooks for state + logic)
3. **API Client** in `features/[feature]/api.ts`
4. **Types** in `features/[feature]/types/`
5. **Utilities** in `features/[feature]/lib/` if needed

**Example Feature Structure:**

```
features/course/
├── components/
│   ├── CourseCard.tsx
│   └── CourseForm.tsx
├── hooks/
│   └── useCourse.ts      # Contains all course-related business logic
├── api.ts                # API calls (getCourses, createCourse, etc.)
├── types.ts              # Course-related TypeScript types
└── lib/
    └── courseUtils.ts    # Course-specific utilities
```

**Avoid:** Creating `services/`, `adapters/`, or `context/` folders within features unless absolutely necessary.

### Current Architectural Debt & Migration Plan

**Issue**: The `features/auth/` folder contains over-engineered complexity (856 lines):

- `context/UserRoleContext.tsx` (456 lines) with cross-tab sync, caching, error boundaries
- `hooks/useUserRole.ts` (400+ lines) with multiple specialized hooks
- Features like cross-tab synchronization and TTL caching that are likely unused

**Recommended Migration:**

1. **Replace auth context** with simple `useAuth()` hook (reduce from 856 to ~50 lines)
2. **Eliminate duplicate code** by creating shared utilities in `lib/`
3. **Focus on MVP functionality** for the 3 roles: admin, creator, user

**Before new feature development**, consider simplifying the auth system to reduce onboarding complexity.

### Testing Strategy

- **Unit Tests**: Test individual components and utilities
- **Integration Tests**: Test feature workflows and API integration
- **E2E Tests**: Test complete user journeys with real browser automation
- **Coverage**: Aim for meaningful coverage, not just high percentages

## Environment Configuration

The project uses multiple environment files:

- `.env` - Base configuration
- `.env.development` - Development overrides
- `.env.local` - Local development (gitignored)
- `.env.test` - Testing environment
- `.env.prod` - Production configuration

Environment validation runs automatically via `lib/env-validation.ts` (skipped in CI/test).

## Performance & Security

### Next.js Optimizations

- **React Strict Mode** enabled
- **Image Optimization** with WebP/AVIF support
- **Bundle Analysis** available via `yarn build:analyze`
- **Standalone Output** for deployment
- **Memory-based Workers** in development

### Security Headers

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- Referrer-Policy: strict-origin-when-cross-origin

## Important Notes

### PowerShell Environment

This project runs in PowerShell environment:

- Use `;` instead of `&&` for command chaining
- Use quotes around paths with spaces: `"features\auth"`
- Use backslashes for Windows paths: `features\auth\components`

### Database Setup

Ensure Prisma schema is properly configured and migrations are up to date before running tests or development server.

### Authentication

The project uses Clerk for authentication. E2E tests include authentication state management via `__tests__/playwright/.clerk/user.json`.

### CI/CD Integration

- Automated testing on GitHub Actions
- ESLint must pass with zero warnings
- TypeScript compilation must succeed
- All tests must pass before deployment

## UI/UX Design System

### Theme & Visual Identity

The project uses an **"Ancient Fantasy Asia"** theme with whimsical, cartoonish, and hand-drawn aesthetic. This creates an engaging, approachable learning environment that differentiates from typical corporate e-learning platforms.

**Core Design Principles:**

- **Shadcn UI First**: Use Shadcn UI components as foundation, custom only when needed
- **Design Tokens**: All colors, radius, shadows, fonts defined in Tailwind config
- **Consistency**: Focus on user experience, responsive design, minimalism, and consistency
- **Accessibility**: WCAG compliance with proper contrast ratios and keyboard navigation

### Color System

The design system uses a 4-palette approach with semantic color mapping:

```
🎨 Beige (Background): #F5EDE0 (50) → #7B5B2C (900)
🧡 Yellow-Orange (Accent): #FFE8C4 (50) → #B96500 (900)
🌿 Green (Nature/Progress): #C8E6D0 (50) → #02B052 (900)
🔴 Red (Action/CTA): #FFCCCB (50) → #B22424 (900)
```

**Usage Guidelines:**

- **Primary Actions**: Red 500 (`#FF4D4D`) for main CTAs and buttons
- **Secondary/Highlights**: Yellow-orange 400 (`#FFB148`) for accents and decorative elements
- **Backgrounds**: Beige 50-200 (`#F5EDE0` - `#E8D9C6`) for main backgrounds
- **Progress/Success**: Green 300-500 (`#86D4A6` - `#5AC88A`) for nature elements and progress indicators

### Typography & Spacing

**Font Stack:**

- **Primary**: Poppins (headings, body text)
- **Accent**: Playfair Display (optional, quotes/special headings)
- **Code**: Fira Code (technical content)

**Spacing**: Use 4px scale (`space-4`, `space-8`, etc.) following Tailwind standards

### Interactive States

**Hover Effects:**

- Scale transforms (`scale-105`) for subtle feedback
- Color shifts with shadow enhancements
- Consistent 200-300ms transitions using `cubic-bezier(0.4, 0, 0.2, 1)`

**Focus Management:**

- 2px red outline with 2px offset for accessibility
- Input-specific focus states with border and shadow changes
- ARIA labels and screen reader support

### Animation Guidelines

**Performance-Optimized:**

- Use `transform` and `opacity` properties (avoid width/height)
- Hardware acceleration with `transform3d`
- Respect `prefers-reduced-motion` setting

**Timing:**

- **Micro-interactions**: 150ms
- **Modal/Panel transitions**: 300ms
- **Complex animations**: 500ms

### Component Guidelines

**When Creating UI Components:**

1. **Check Shadcn UI first** - use existing components when possible
2. **Follow color palette** - use semantic color tokens from design system
3. **Apply consistent spacing** - use 4px scale for padding/margins
4. **Include interactive states** - hover, focus, active, disabled
5. **Consider mobile-first** - ensure 44px minimum touch targets
6. **Test accessibility** - keyboard navigation and screen readers

**Reference Documentation:**
Complete design system guidelines available in `docs/rules/uiux-consistency.md`
