# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Maguru is a Next.js-based e-learning platform built with TypeScript, using a feature-first modular monolith architecture. The project combines educational content management with course creation tools.

## Plan & Review

- Always in Plan mode to make a plan
- after get the plan, make sure you write the plan to .claude/tasks/TASK_NAME.md
- after task compleated, make sure you write the report to .claude/reports/TASK_NAME.md
- The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down
- if the task require external knowledge or certain package, also research to get latest knowledge (use Task tool for research)
- Don't over plan it, always think MVP.
- Once you write the plan, foirstly ask me to review it. Do not continue untill i approve the plan

### While Implementing

- You should update the plan as you work
- after you complete tasks in the plan, you should update and append detailed description of the changes you made, so following tasks can be easily hand over to other engineers.

## Key Commands

### Development

```bash
# Start development server (dev environment)
yarn app

# Start development server (production environment)
yarn app:prod

# Build the application
yarn build

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
# Run specific test file
yarn test [file-path]

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

The project follows a **Feature-First Modular Monolith** with **3-Tier Layered Architecture**:

- **Presentation Layer**: React components, UI state management
- **Application/Business Logic Layer**: Custom hooks, API routes, services
- **Data Access Layer**: Prisma ORM, database operations

### Directory Structure

```
/
├── app/                # Next.js App Router (routes, layouts, API endpoints)
├── features/           # Feature modules (course, auth, user_manage, homepage)
│   └── [feature]/
│       ├── components/ # UI components (Presentation Layer)
│       ├── hooks/      # Business logic hooks (Application Layer)
│       ├── services/   # Server-side business logic (Application Layer)
│       ├── adapters/   # API client interfaces (Data Access Layer)
│       ├── types/      # TypeScript definitions
│       └── lib/        # Feature-specific utilities
├── lib/                # Shared utilities and libraries
├── prisma/             # Database schema and migrations
├── __tests__/          # Testing infrastructure
│   ├── integration/    # Integration tests
│   └── playwright/     # E2E tests
└── components/         # Shared UI components (shadcn/ui)
```

### Current Features

- **course**: Course management and creation
- **auth**: Authentication using Clerk
- **user_manage**: User management functionality
- **homepage**: Landing page and marketing content

## Technology Stack

### Core Technologies

- **Next.js 15.3.4** with App Router
- **React 19** with TypeScript (strict mode enabled)
- **Prisma** ORM for database operations
- **Clerk** for authentication
- **TailwindCSS** + **shadcn/ui** for styling

### State Management

- **Context API** for global state (user auth, app settings)
- **Custom Hooks** for feature-specific business logic
- **React Query** for server state caching
- **useState/useReducer** for local component state

### Testing & Quality

- **Jest** + **React Testing Library** for unit/integration tests
- **Playwright** for E2E testing with Clerk integration
- **ESLint** + **Prettier** for code quality
- **MSW** for API mocking

## Development Guidelines

### State Management Hierarchy

1. **Global State** → Use Context API (user auth, theme, app-wide settings)
2. **Feature State** → Use Custom Hooks (business logic, data fetching)
3. **Component State** → Use useState/useReducer (local UI state, forms)

### Naming Conventions

- **Files/Directories**: `kebab-case` (e.g., `manage-course`, `user-settings`)
- **Components**: `PascalCase` (e.g., `CourseCard.tsx`, `UserProfile`)
- **Hooks**: `use` prefix + `camelCase` (e.g., `useCourseData`, `useAuthState`)
- **Services**: Entity + `Service` (e.g., `courseService.ts`)
- **Adapters**: Entity + `Adapter` (e.g., `courseAdapter.ts`)

### Feature Development Pattern

1. **UI Components** in `features/[feature]/components/`
2. **Business Logic** in `features/[feature]/hooks/`
3. **API Integration** in `features/[feature]/adapters/`
4. **Server Logic** in `features/[feature]/services/`
5. **Types** in `features/[feature]/types/`

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

When running bash commands, use `;` instead of `&&` for command chaining since this project runs in PowerShell environment.

### Database Setup

Ensure Prisma schema is properly configured and migrations are up to date before running tests or development server.

### Authentication

The project uses Clerk for authentication. E2E tests include authentication state management via `__tests__/playwright/.clerk/user.json`.

### CI/CD Integration

- Automated testing on GitHub Actions
- ESLint must pass with zero warnings
- TypeScript compilation must succeed
- All tests must pass before deployment
