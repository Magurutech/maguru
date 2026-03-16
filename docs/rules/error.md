
  Let me analyze the questions in error.md and provide definitive answers:

  ---
  Question 1: Slug di Course Model

  Answer: ✅ TIDAK PERLU tambah slug via migration

  Reasoning:
  // Schema saat ini sudah punya:
  model courses {
    id        String   @id @default(uuid())
    // ... other fields
    status    CourseStatus @default(DRAFT)
    category  String
    // ...
  }

  // Kita bisa generate slug dari title di runtime:
  slug: {
    create: {
      slug: {
        raw: {
          generate: "lower(title.replaceAll(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))"
        },
        onUpdate: true
      }
    }
  }

  Simpler Approach (without schema change):
  // Generate slug di Frontend saat create course:
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  // Use slug di semua endpoints:
  // GET /api/courses/[slug]  ← Generate on-the-fly
  // POST /api/creator/courses  ← Create course first, generate slug, then PUT

  Decision:
  - ✅ Generate slug di frontend
  - ✅ Store slug di database (simpler for queries)
  - ✅ OR generate on-the-fly (simpler for now)

  Recommendation:
  model Course {
    // ... existing fields
    slug String @unique  // ✅ Add this field via migration
  }

  ---
  Question 2: Difficulty Field

  Answer: ✅ TIDAK PERLU tambah difficulty

  Reasoning:
  model courses {
    // ... existing fields
    category String  // ✅ Field ini sudah ada
    // difficulty tidak perlu
  }

  // Difficulty bisa ditambahkan lewat UI:
  enum Difficulty {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  // Atau simpel validation string:
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'

  Current Schema is Sufficient:
  - Category = "Programming" (bisa grouping difficulty)
  - Difficulty = UI selection (bisa hardcode values)

  Decision:
  - ✅ Skip difficulty field
  - ✅ Use category for filtering
  - ✅ UI can show difficulty as badge if needed

  ---
  Question 3: creatorId di Course

  Answer: ✅ Clerk handle user authentication, database punya creatorId

  Reasoning:
  model courses {
    creatorId String  // ✅ Sudah ada
    // Relasi ke User model atau Clerk?
  }

  // Option A: Relasi ke User model (jika ada)
  model courses {
    creatorId String
    creator    User?    @relation(fields: [creatorId], references: [id])
  }

  // Option B: Tidak ada relasi (Clerk handle users)
  // creatorId = Clerk user ID
  // Username/Name diambil dari Clerk API

  Decision:
  - ✅ Schema tidak perlu relasi ke User model
  - ✅ creatorId = Clerk user ID
  - ✅ Username/Name fetched dari Clerk API (tidak dari database)

  Verification:
  // At login, Clerk provides user data:
  const { user } = useUser()
  // user.id = creatorId di course records
  // user.fullName = "Creator Name"

  ---
  Question 4: Enrollment completed Field

  Answer: ✅ TIDAK PERLU tambah completed/completedAt

  Reasoning:
  model enrollments {
    id        String @id
    userId    String
    courseId  String
    enrolledAt DateTime @default(now())
    completed Boolean @default(false)  // ✅ Ini sudah ada!
    completedAt DateTime?             // ✅ Ini juga sudah ada!
  }

  // Or just use CourseCompletion model:
  model CourseCompletion {
    userId    String
    courseId  String
    completed Boolean @default(false)
    completedAt DateTime?  // ✅ Track course-level completion
    @@unique([userId, courseId])
  }

  Decision:
  - ✅ Schema sudah complete
  - ✅ No migration needed
  - ✅ completed field berfungsi untuk tracking enrollment completion

  ---
  Question 5: Naming Convention

  Answer: ✅ Mengikuti existing pattern (snake_case)

  Reasoning:
  existing pattern:
  - course_completions (snake_case)
  - lesson_progress (snake_case)
  - enrollments (camelCase - EXCEPTION)

  Let's standardize to snake_case for consistency:
  - enrollments → enrollment (snake_case)

  Decision:
  - ✅ Rename enrollments → enrollment
  - ✅ Use snake_case for consistency
  - ✅ Update all migrations and queries

  ---
  ✅ Final Answers Summary

  ┌───────────────────────┬────────────────────────────────────┬────────────────────────────────────────┐    
  │      Pertanyaan       │              Jawaban               │            Action Required             │    
  ├───────────────────────┼────────────────────────────────────┼────────────────────────────────────────┤    
  │ 1. Slug               │ ✅ Generate on-the-fly OR tambah   │ Optional: tambah field slug            │    
  │                       │ field                              │                                        │    
  ├───────────────────────┼────────────────────────────────────┼────────────────────────────────────────┤    
  │ 2. Difficulty         │ ✅ Skip - pakai category           │ No action                              │    
  ├───────────────────────┼────────────────────────────────────┼────────────────────────────────────────┤    
  │ 3. creatorId          │ ✅ Clerk handle - no relasi        │ No action                              │    
  ├───────────────────────┼────────────────────────────────────┼────────────────────────────────────────┤    
  │ 4. Enrollment         │ ✅ Sudah ada di schema             │ No action                              │    
  │ completed             │                                    │                                        │    
  ├───────────────────────┼────────────────────────────────────┼────────────────────────────────────────┤    
  │ 5. Naming convention  │ ✅ Gunakan snake_case              │ Migration: rename enrollments →        │    
  │                       │                                    │ enrollment                             │    
  └───────────────────────┴────────────────────────────────────┴────────────────────────────────────────┘    

  ---
  📋 Clarification: Apa yang PENDING?

  ✅ Schema Complete (No Migration Needed)

  model courses {
    id        String   @id @default(uuid())
    title     String
    description String?
    slug      String   @unique          // ✅ Saya rekomendasikan tambah
    status    CourseStatus @default(DRAFT)
    category  String
    // difficulty = SKIP
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }

  model enrollments {
    id         String   @id @default(uuid())
    userId     String
    courseId   String
    enrolledAt DateTime @default(now())
    completed  Boolean  @default(false)
    completedAt DateTime?
    @@unique([userId, courseId])
  }

  enum CourseStatus {
    DRAFT
    PUBLISHED
  }

  ⚠️ Optional Additions

  1. slug field - Rekomendasikan untuk query performance
  2. no relasi ke User model - Clerk handle authentication
  3. difficulty field - Bisa skip, use category

  🗑️ No Action Needed

  - completed field di enrollments → sudah ada
  - enrollment tracking → sudah complete

  ---
  🎯 Apakah Spec Bisa Dibuat Sekarang?

  Answer: ✅ YES, spec bisa dibuat sekarang

  Detail:
  - ✅ Schema sudah complete (no migration needed for core)
  - ✅ Field slug → Add optional (rekomendasi saya)
  - ✅ enrollment completed → Sudah ada
  - ✅ No critical blockers

  Recommendation:
  1. Add optional slug field via migration (minimal)
  2. Buat spec plan dengan naming convention snake_case
  3. Implementasi bisa dimulai segera setelah spec final

  ---
  💡 Insight Tambahan

  Simplifikasi Scope

  Karena schema sudah complete, kita bisa simplifikasi:

  TIDAK PERLU Migration:
  ❌ enrollment completed field
  ❌ difficulty field
  ❌ relasi ke User model

  PERLU Migration:
  ✅ slug field (optional, rekomendasikan)
  ✅ Rename enrollments → enrollment (consistency)

  BISA Langsung Implementasi:
  ✅ Course catalog
  ✅ Course enrollment
  ✅ Creator dashboard
  ✅ Course creation