# 📋 Task Plan Format Guide

## Overview

Format task.md mengikuti **Feature-Layer Model** untuk clarity dan organization. Setiap feature dibagi per layer dengan struktur yang konsisten.

---

## Task ID Naming Convention

```
Task [Feature].[Side].[Layer].[Sequence]

Sides:
- B = Backend
- F = Frontend

Backend Layers:
- D = Data (Prisma)
- S = Service (Business Logic + TDD)
- A = API (Endpoints)
- Q = Quality (Performance, Testing)
- E = Error Handling (Backend)

Frontend Layers:
- A = API Client
- H = Hooks
- C = Context (jika diperlukan)
- CP = Components
- E = Error Handling (Frontend)
- T = Testing (Manual)

Examples:
- Task 1.B.D.1 = Feature 1, Backend, Data layer, Task 1
- Task 1.B.S.1 = Feature 1, Backend, Service layer, Task 1 (with TDD)
- Task 1.F.H.1 = Feature 1, Frontend, Hooks layer, Task 1
- Task 1.B.E.1 = Feature 1, Backend, Error Handling (sub-task)
- Task 1.F.E.1 = Feature 1, Frontend, Error Handling (sub-task)
```

---

## Backend Structure

### Layer 1: Data (Prisma)

```markdown
#### Layer 1: Data (Prisma)

- [ ] **Task X.B.D.1** — Setup Prisma schema for [Feature]
  - **File**: prisma/schema.prisma
  - **What**: Define models, relations, and constraints
  - **Acceptance Criteria**:
    - Schema compiles without errors
    - Migrations generated successfully
```

### Layer 2: Service (Business Logic + TDD)

```markdown
#### Layer 2: Service (Business Logic)

- [ ] **Task X.B.S.1** — Create [Feature] service with unit tests (TDD)
  - **File**: src/services/[feature]Service.ts
  - **What**: Service functions with TDD approach
  - **Skill**: Test-Driven Development
  - **Sub-tasks**:
    - [ ] Write unit tests for [function]()
    - [ ] Implement [function]() logic
    - [ ] All unit tests pass

- [ ] **Task X.B.S.2** — Integration test for [Feature] service
  - **File**: src/services/**tests**/[feature].integration.test.ts
  - **What**: Test service with mocked data layer
```

### Layer 3: API

```markdown
#### Layer 3: API

- [ ] **Task X.B.A.1** — Create [Feature] API endpoints
  - **File**: src/api/routes/[feature].ts
  - **What**: GET /[feature], POST /[feature], etc.
  - **Acceptance Criteria**:
    - All endpoints return correct status codes
    - Request/response payloads validated
  - **Sub-tasks (Error Handling)**:
    - [ ] Add error handling for validation failures
    - [ ] Add error handling for service failures
    - [ ] Return consistent error response format
```

### Layer 4: Quality & Testing

```markdown
#### Layer 4: Quality (Performance & Testing)

- [ ] **Task X.B.Q.1** — Performance testing & optimization
  - **What**: Query optimization, caching strategy
  - **Acceptance Criteria**: [List metrics or benchmarks]

- [ ] **Task X.B.Q.2** — Manual API testing with Postman
  - **File**: postman/[feature]-collection.json
  - **What**: Test must-have & should-have endpoints only
  - **Test Cases**: [List of scenarios]
```

---

## Frontend Structure

### Layer 1: API Client

```markdown
#### Layer 1: API Client

- [ ] **Task X.F.A.1** — Create [Feature] API client functions
  - **File**: src/services/api/[feature].ts
  - **What**: Fetch wrapper functions (get, create, update, delete)
  - **Acceptance Criteria**: Functions return correct data types
```

### Layer 2: Hooks

```markdown
#### Layer 2: Hooks

- [ ] **Task X.F.H.1** — Create [Feature] custom hooks
  - **File**: src/hooks/use[Feature].ts
  - **What**: Custom hooks (use[Feature](), use[Feature]List())
  - **Dependencies**: Layer 1 (API Client)
```

### Layer 3: Context (Conditional)

```markdown
#### Layer 3: Context (jika ada kebutuhan)

- [ ] **Task X.F.C.1** — Create [Feature] context provider
  - **File**: src/context/[Feature]Context.tsx
  - **What**: Manage global state untuk [Feature]
  - **Note**: Only jika props drilling problematic
  - **Dependencies**: Layer 2 (Hooks)
```

### Layer 4: Components

```markdown
#### Layer 4: Components

- [ ] **Task X.F.CP.1** — Build [Feature] components
  - **File**: src/components/[feature]/
  - **Components Needed**:
    - [Component1].tsx
    - [Component2].tsx
    - [Component3].tsx
  - **Dependencies**: Layer 2 (Hooks), Layer 3 (Context jika ada)
  - **Acceptance Criteria**: All components render without errors
```

### Layer 5: Error Handling

```markdown
#### Layer 5: Error Handling

- [ ] **Task X.F.E.1** — Add error handling to [Feature] frontend
  - **Sub-tasks**:
    - [ ] Add error boundaries for components
    - [ ] Handle API errors gracefully (show user-friendly messages)
    - [ ] Implement loading & error states in hooks
```

### Layer 6: Manual Testing

```markdown
#### Layer 6: Manual Testing

- [ ] **Task X.F.T.1** — Manual test [Feature] user flows
  - **What**: Test user interactions, UI/UX, edge cases
  - **Test Scenarios**:
    - [ ] [Scenario 1]
    - [ ] [Scenario 2]
    - [ ] [Scenario 3]
```

---

## Multiple Features (Same Spec)

Ketika spec memiliki multiple features, pisahkan per feature dengan struktur yang sama:

```markdown
## Feature 1: [Nama Feature 1]

### Backend Implementation

#### Layer 1: Data (Prisma)

- [ ] **Task 1.B.D.1** — ...

#### Layer 2: Service (Business Logic)

- [ ] **Task 1.B.S.1** — ...

[continues...]

---

## Feature 2: [Nama Feature 2]

### Backend Implementation

#### Layer 1: Data (Prisma)

- [ ] **Task 2.B.D.1** — ...

#### Layer 2: Service (Business Logic)

- [ ] **Task 2.B.S.1** — ...

[continues...]
```

---

## Key Points

✅ **Task ID naming** adalah `[Feature].[Side].[Layer].[Sequence]`
✅ **Backend layers**: Data → Service (TDD) → API → Quality
✅ **Frontend layers**: API Client → Hooks → Context (optional) → Components → Error Handling → Manual Testing
✅ **Error Handling** adalah sub-tasks di Layer 3 (API) untuk backend dan Layer 5 untuk frontend
✅ **Multiple features** tetap dalam 1 file, dipisahkan per feature section
✅ **TDD diintegrasikan** di Service layer dengan sub-tasks yang jelas
✅ **Component list** harus explicit di Layer 4 (Components)
✅ **Acceptance Criteria** wajib untuk clarity

## Cara Penggunaan 

Ketika membuat tasks.md baru untuk spec, tinggal:

1. Copy struktur dari guide ini
2. Ganti [Feature], [file paths], dan deskripsi dengan data real
3. Pastikan error handling ada sebagai sub-tasks di API layer (backend) dan Component layer (frontend)
4. Multiple features? Duplikat seluruh feature section dan ubah task ID-nya