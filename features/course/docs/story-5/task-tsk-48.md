# Task TSK-48: Integrasi dengan Clerk untuk Otorisasi Role-Based Access

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Batasan dan Penyederhanaan](#batasan-dan-penyederhanaan)
3. [Spesifikasi Teknis](#spesifikasi-teknis)
4. [Implementasi Teknis](#implementasi-teknis)
5. [Test Plan](#test-plan)
6. [Pertanyaan untuk Diklarifikasi](#pertanyaan-untuk-diklarifikasi)

## Pendahuluan

Task ini berfokus pada implementasi middleware autentikasi dan otorisasi menggunakan Clerk untuk memastikan hanya user dengan role "creator" atau "admin" yang dapat mengakses dan mengelola kursus. Integrasi ini akan diterapkan pada semua endpoint CRUD kursus yang telah dibuat di TSK-47.

**Nilai Bisnis**: Sistem otorisasi yang tepat memastikan keamanan data dan mencegah akses tidak sah ke fitur manajemen kursus, menjaga integritas platform dan melindungi konten creator.

**Konteks dalam Sprint**: Task ini bergantung pada implementasi backend CRUD (TSK-47) dan menjadi prasyarat untuk testing yang komprehensif (TSK-49, TSK-66).

## Batasan dan Penyederhanaan

1. **Role Management**:
   - Hanya 2 role yang didukung: "creator" dan "admin"
   - Tidak ada role hierarchy atau permission granular
   - Admin memiliki akses penuh ke semua kursus

2. **Session Management**:
   - Menggunakan session management default dari Clerk
   - Tidak ada custom session handling
   - Token refresh otomatis menggunakan Clerk SDK

3. **Error Handling**:
   - Standard HTTP status codes untuk auth errors
   - Tidak ada custom auth error types
   - Simple error messages untuk debugging

4. **Middleware Scope**:
   - Hanya untuk API routes `/api/courses/*`
   - Tidak mencakup frontend route protection (dilakukan terpisah)
   - Tidak ada rate limiting berdasarkan user

## Spesifikasi Teknis

### Role-Based Access Matrix

| Endpoint                   | User | Creator       | Admin    | Catatan          |
| -------------------------- | ---- | ------------- | -------- | ---------------- |
| `POST /api/courses`        | ❌   | ✅            | ✅       | Buat kursus baru |
| `GET /api/courses`         | ❌   | ✅ (own only) | ✅ (all) | List kursus      |
| `GET /api/courses/[id]`    | ❌   | ✅ (own only) | ✅ (all) | Detail kursus    |
| `PUT /api/courses/[id]`    | ❌   | ✅ (own only) | ✅ (all) | Update kursus    |
| `DELETE /api/courses/[id]` | ❌   | ✅ (own only) | ✅ (all) | Hapus kursus     |

### Clerk Integration Flow

#### Autentikasi Flow:

```
1. Client request dengan session token
2. Middleware extract token dari request
3. Verify token dengan Clerk API
4. Extract user data dan custom claims (role)
5. Validate role requirements
6. Allow/Deny request berdasarkan role
```

#### Error Flow:

```
1. No token → 401 Unauthorized
2. Invalid/expired token → 401 Unauthorized
3. Valid token, insufficient role → 403 Forbidden
4. Valid token, not owner of resource → 403 Forbidden
```

### Custom Claims Structure

```typescript
interface ClerkCustomClaims {
  role: 'user' | 'creator' | 'admin'
  createdAt: string
  // Future: additional permissions
}

interface AuthenticatedUser {
  id: string
  email: string
  role: 'user' | 'creator' | 'admin'
  clerkId: string
}
```

## Implementasi Teknis

### Authentication Middleware

```typescript
// middleware/auth.ts
import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function requireAuth(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      )
    }

    // Get user with custom claims
    const user = await clerkClient.users.getUser(userId)
    const role = user.publicMetadata.role as string

    return {
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        role: role || 'user',
        clerkId: userId,
      },
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid authentication token' },
      { status: 401 },
    )
  }
}

export function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest, user: AuthenticatedUser) => {
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        },
        { status: 403 },
      )
    }
    return null // Success
  }
}
```

### Resource Ownership Validation

```typescript
// middleware/ownership.ts
import { prisma } from '@/lib/prisma'

export async function validateCourseOwnership(courseId: string, userId: string, userRole: string) {
  // Admin can access all courses
  if (userRole === 'admin') {
    return true
  }

  // Creator can only access their own courses
  if (userRole === 'creator') {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        creatorId: userId,
      },
    })

    return !!course
  }

  return false
}
```

### Protected API Routes Implementation

#### Example: POST /api/courses/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireRole } from '@/middleware/auth'
import { CourseService } from '@/services/courseService'

export async function POST(request: NextRequest) {
  // Authentication check
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response
  }

  // Role authorization check
  const roleCheck = await requireRole(['creator', 'admin'])(request, authResult.user)
  if (roleCheck) {
    return roleCheck // Return error response
  }

  try {
    const body = await request.json()
    const courseService = new CourseService()

    const course = await courseService.createCourse(body, authResult.user.id)

    return NextResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create course',
      },
      { status: 500 },
    )
  }
}
```

#### Example: GET /api/courses/[id]/route.ts

```typescript
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const roleCheck = await requireRole(['creator', 'admin'])(request, authResult.user)
  if (roleCheck) return roleCheck

  // Ownership validation
  const hasAccess = await validateCourseOwnership(
    params.id,
    authResult.user.id,
    authResult.user.role,
  )

  if (!hasAccess) {
    return NextResponse.json(
      {
        success: false,
        error: 'Access denied. You can only access your own courses.',
      },
      { status: 403 },
    )
  }

  // Proceed with business logic...
}
```

### Frontend Route Protection

```typescript
// app/creator/course-manage/layout.tsx
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Check role in user metadata
  // If not creator/admin, redirect to unauthorized

  return <>{children}</>;
}
```

### Error Response Format

```typescript
interface AuthErrorResponse {
  success: false
  error: string
  code?: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'FORBIDDEN'
  details?: {
    requiredRole?: string[]
    currentRole?: string
    resource?: string
  }
}
```

## Test Plan

### Unit Tests

**Authentication Middleware Tests**:

- Valid token scenarios
- Invalid/expired token scenarios
- Missing token scenarios
- Role validation scenarios

**Authorization Tests**:

- Creator accessing own resources
- Creator accessing other's resources (should fail)
- Admin accessing any resources
- User accessing protected resources (should fail)

**Tools**: Jest + Mock Clerk SDK

### Integration Tests

**Full Auth Flow Tests**:

- Complete request flow with valid authentication
- Error propagation from auth middleware
- Database operations with authenticated user context

**Role-Based Access Tests**:

- Cross-role access patterns
- Ownership validation with real database
- Edge cases (deleted users, changed roles)

**Tools**: Jest + Test Database + Clerk Test Mode

### Security Tests

**Penetration Testing Scenarios**:

- Token manipulation attempts
- Role elevation attempts
- Resource access bypassing
- Session hijacking protection

**Performance Tests**:

- Auth middleware latency impact
- Concurrent authentication requests
- Database query optimization for ownership checks

## Pertanyaan untuk Diklarifikasi

1. **Role Assignment**: Bagaimana proses assignment role "creator" ke user? Apakah otomatis saat registrasi atau manual approval?

2. **Admin Scope**: Apakah admin dapat mengedit/delete kursus creator lain atau hanya view-only access?

3. **Role Migration**: Bagaimana menangani perubahan role user yang sudah memiliki kursus?

4. **Session Timeout**: Apakah perlu custom session timeout atau menggunakan default Clerk settings?

5. **Error Logging**: Apakah auth failures perlu di-log untuk security monitoring?

6. **Rate Limiting**: Apakah perlu rate limiting per user/role untuk prevent abuse?

7. **Multi-tenancy**: Apakah ada rencana untuk organization/workspace yang mempengaruhi access control?

8. **Public APIs**: Apakah ada endpoint yang perlu public access (seperti course catalog untuk students)?

## Referensi

- [Clerk Authentication Documentation](https://clerk.com/docs)
- [Next.js Middleware Documentation](https://nextjs.org/docs/advanced-features/middleware)
- Existing auth patterns di codebase Maguru (features/auth)
- Role-based access control best practices
