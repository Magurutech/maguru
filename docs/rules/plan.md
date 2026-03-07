# Sprint Plan: Course Feature & Dashboard Integration

**Status**: Draft | **Priority**: High | **Effort**: Medium

---

## 🎬 Apa yang Akan Kita Bangun?

### Cerita Pengguna (User Story)

```
Bayangkan Budi, seorang user yang baru login ke Maguru:

🔴 SAAT INI (Masalah):
1. Budi buka dashboard → ERROR 404! 😱
2. Budi klik course "Belajar React" → konten mock saja
3. Budi selesai lesson 1 → progress hilang jika ganti browser
4. Budi tidak punya riwayat course yang pernah diikuti

🟢 NANTI (Setelah Sprint):
1. Budi buka dashboard → Tampil statistik belajar ✨
   ├─ "5 Kursus Diikuti"
   ├─ "24 Jam Belajar"
   └─ "2 Kursus Selesai"

2. Budi klik course "Belajar React" → Langsung bisa belajar 📚
   ├─ Otomatis terdaftar (enrollment)
   ├─ Materi terstruktur (Bab 1, Bab 2, Bab 3)
   └─ Setiap bab punya beberapa lessons

3. Budi selesai lesson → Progress tersimpan di database 💾
   └─ Bisa buka di device lain, progress tetap ada

4. Budi kembali dashboard → Course muncul di "Lanjutkan Belajar"
   └─ Progress bar: "75% selesai"
```

### Problem vs Solution

| Problem | Solution | User Benefit |
|---------|----------|--------------|
| Dashboard error 404 | Buat API route | Dashboard bisa diakses |
| Course cuma mock | Simpan di database | Course riil dengan materi lengkap |
| Progress hilang | Simpan di database | Progress aman & sinkron di semua device |
| Tidak ada riwayat | Enrollment system | User punya daftar course yang diikuti |

### Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│  USER JOURNEY                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Login → Dashboard                                       │
│     └─ "Halo, Budi! 👋"                                     │
│     └─ Stats: 5 course, 24 jam, 2 sertifikat               │
│                                                             │
│  2. Browse Courses → Klik "Belajar React"                  │
│     └─ Auto-enroll ✅                                       │
│                                                             │
│  3. Learn Page                                              │
│     ├─ Bab 1: Pengenalan                                   │
│     │   ├─ Lesson 1: Apa itu React? ✅ (done)              │
│     │   ├─ Lesson 2: Setup Environment 📖 (current)        │
│     │   └─ Lesson 3: Components ⏳ (locked)                │
│     ├─ Bab 2: State Management                             │
│     └─ Bab 3: Hooks                                        │
│                                                             │
│  4. Mark Complete → Progress tersimpan                     │
│     └─ Bisa lanjut di HP/laptop lain                       │
│                                                             │
│  5. Selesai 100% → Dapat Sertifikat 🏆                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Requirements Summary

| Decision | Value |
|----------|-------|
| Content Structure | Option A: Course → Sections → Lessons → Content |
| Progress Tracking | Minimal (completion, last accessed, percentage) |
| Enrollment Flow | Flow A: Direct access with auto-enrollment |
| Dashboard Priority | Priority 1 + 2 (User Stats + Course Progress) |
| Effort Level | Medium |

---

## 🎯 Sprint Goals

1. **Fix Dashboard 404 Error** - Create API route with mock data fallback
2. **Database Schema** - Add course content structure & progress tracking
3. **Course System** - Connect courses to users with enrollment & progress
4. **Learn Page** - Connect to real database data

---

## 📊 Schema Changes (Penjelasan Database)

### Apa itu Database Schema?

**Schema** = Struktur penyimpanan data di database. Bayangkan seperti lemari arsip:

```
🗄️ Database Maguru
├── 📁 Courses (Data kursus)
├── 📁 Sections (Bab dalam kursus)
├── 📁 Lessons (Materi dalam bab)
├── 📁 Enrollments (Siapa ikut kursus apa)
├── 📁 Progress (Sampai mana user belajar)
└── 📁 CourseCompletions (Sertifikat/selesai)
```

### New Models to Add (Penjelasan)

#### 1. **Section** = Bab dalam Course

```
Contoh Course: "Belajar React untuk Pemula"
├── Section 1: "Pengenalan React"        ← Ini Section
├── Section 2: "Components & Props"
└── Section 3: "State Management"

Di Database:
Section {
  title: "Pengenalan React"
  order: 1  ← Urutan tampil
  courseId: "react-course-id"
}
```

#### 2. **Lesson** = Materi dalam Section

```
Section: "Pengenalan React"
├── Lesson 1: "Apa itu React?"           ← Ini Lesson
├── Lesson 2: "Kenapa pakai React?"
└── Lesson 3: "Setup Environment"

Di Database:
Lesson {
  title: "Apa itu React?"
  contentType: "video"  ← bisa: video, markdown, quiz
  contentPath: "/courses/react/lesson1.md"
  duration: "15 menit"
  isOptional: false  ← wajib atau tidak
}
```

#### 3. **Progress** = Riwayat Belajar User

```
User: Budi sedang belajar React
├── Lesson 1: ✅ Selesai (kemarin)
├── Lesson 2: 📖 Sedang dibaca (sekarang)
└── Lesson 3: ⏳ Belum mulai

Di Database:
Progress {
  userId: "budi-clerk-id"
  lessonId: "lesson-2-id"
  completed: false  ← belum selesai
  lastAccessed: "2025-01-16 10:30"  ← terakhir dibuka
}
```

#### 4. **CourseCompletion** = Sertifikat Kelulusan

```
Budi selesai kursus React:
Di Database:
CourseCompletion {
  userId: "budi-clerk-id"
  courseId: "react-course-id"
  completedAt: "2025-01-20"
  percentage: 100  ← lengkap 100%
}

→ Budi dapat sertifikat! 🏆
```

### Schema Code (Technical Implementation)

```prisma
// Course Content Structure
model Section {
  id        String   @id @default(uuid())
  courseId  String
  title     String   @db.VarChar(200)
  order     Int
  createdAt DateTime @default(now())

  // Relations
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons   Lesson[]

  @@map("sections")
}

model Lesson {
  id          String   @id @default(uuid())
  sectionId   String
  title       String   @db.VarChar(200)
  description String?  @db.Text
  contentType String   @db.VarChar(50) // markdown, video, quiz
  contentPath String   @db.VarChar(500) // path to content file
  duration    String?  @db.VarChar(50)
  order       Int
  isOptional  Boolean  @default(false)
  createdAt   DateTime @default(now())

  // Relations
  section     Section  @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  progress    Progress[]

  @@map("lessons")
}

// Progress Tracking
model Progress {
  id           String   @id @default(uuid())
  userId       String   @db.VarChar(255) // Clerk User ID
  lessonId     String
  completed    Boolean  @default(false)
  completedAt  DateTime?
  lastAccessed DateTime?

  // Relations
  lesson       Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
  @@map("progress")
}

// Course Completion (for certificates)
model CourseCompletion {
  id           String   @id @default(uuid())
  userId       String   @db.VarChar(255) // Clerk User ID
  courseId     String
  completedAt  DateTime @default(now())
  percentage   Int

  @@unique([userId, courseId])
  @@map("course_completions")
}

// Update existing Course model
model Course {
  // ... existing fields
  slug        String   @unique @db.VarChar(100) // NEW: for URL routing

  // Relations
  sections    Section[]
  completions CourseCompletion[]
}
```

---

## 🔄 Implementation Flow (Penjelasan Tahapan)

### Apa itu API Route?

**API Route** = Jembatan antara Frontend (React) dan Backend (Database)

```
Frontend (React)          API Route              Database (PostgreSQL)
     ┌────┐                   ┌────┐                      ┌────┐
     │User├── klik "Dashboard"│API │── query data ────→    │Data│
     └────┘                   └────┘                      └────┘
                                   │                          │
     ┌────┐                      └────←── return data ────────┘
     │User│←─ tampil dashboard
     └────┘
```

### Phase 1: Database Schema (Day 1-2)

```
1. Update Prisma schema
   ├── Add Section model
   ├── Add Lesson model
   ├── Add Progress model
   ├── Add CourseCompletion model
   └── Add slug field to Course

2. Create migration
   └── npx prisma migrate dev --name add_course_structure

3. Seed sample data
   ├── 1 course with 3 sections
   ├── 2-3 lessons per section
   └── Mixed content types (markdown, video)
```

**Deliverable**: Working database with course structure

---

### Phase 2: API Routes (Day 2-3)

**Apa yang dibuat?** API Routes = Backend yang melayani request dari frontend

```
/app/api/
├── dashboard/[role]/route.ts          ← FIX 404 ERROR
│   │
│   └── FUNGSI: Mengambil data dashboard user
│       ├─ Input: role (user/creator/admin)
│       ├─ Output: { stats, recentCourses, recommendations }
│       └─ Contoh: GET /api/dashboard/user
│           → { "stats": [{"title": "Kursus Diikuti", "value": 5}] }
│
├── courses/route.ts                    ← List all courses
│   │
│   └── FUNGSI: Menampilkan semua course yang tersedia
│       ├─ Input: -
│       ├─ Output: { courses: [{ id, title, slug, thumbnail }] }
│       └─ Contoh: GET /api/courses
│           → [{ "title": "Belajar React", "slug": "react-basic" }]
│
├── courses/[slug]/route.ts             ← Single course detail
│   │
│   └── FUNGSI: Detail satu course + sections + lessons
│       ├─ Input: slug (dari URL)
│       ├─ Output: { course, sections[], lessons[] }
│       └─ Contoh: GET /api/courses/react-basic
│           → { "title": "Belajar React", "sections": [...] }
│
├── courses/[slug]/enroll/route.ts      ← Auto-enrollment
│   │
│   └── FUNGSI: Mendaftarkan user ke course (otomatis)
│       ├─ Input: userId (dari Clerk), courseId
│       ├─ Output: { success: true, enrolledAt: "..." }
│       └─ Contoh: POST /api/courses/react-basic/enroll
│           → User otomatis terdaftar, bisa langsung belajar
│
└── courses/[slug]/progress/route.ts    ← Progress tracking
    │
    └── FUNGSI: Simpan & ambil progress belajar
        ├─ GET: Ambil progress user di course ini
        │   → Output: { completedItems: ["l1", "l2"], percentage: 75 }
        │
        └── POST: Simpan lesson yang baru diselesaikan
            → Input: { lessonId, completed: true }
            → Output: { success: true }
```

**Deliverable**: All API routes working with database

---

### Phase 3: Frontend Integration (Day 3-4)

**Apa yang berubah?** Frontend yang tadinya pakai mock/data palsu → sekarang pakai data asli

```
Dashboard (app/dashboard/page.tsx):
├── Connect to real API data
│   └─ SEBELUM: Tampilkan mock data (data palsu)
│   └─ SESUDAH: Panggil GET /api/dashboard/user
│       → Data dari database
│
├── Show enrolled courses
│   └─ SEBELUM: List course hardcode
│   └─ SESUDAH: "Lanjutkan Belajar" muncul course yang sedang dipelajari
│       → Dengan progress bar: "75% selesai"
│
├── Show progress stats
│   └─ SEBELUM: Angka statis "5 kursus"
│   └─ SESUDAH: Hitung real dari database
│       → "5 kursus diikuti" (dari tabel Enrollments)
│       → "24 jam belajar" (dari perhitungan)
│
└── Remove mock dependency
    └─ Hapus pemanggilan getMockDashboardData()

Learn Page (app/course/[slug]/learn/page.tsx):
├── Fetch course structure from DB
│   └─ SEBELUM: Course structure dari mock JSON
│   └─ SESUDAH: GET /api/courses/react-basic
│       → Sections & lessons dari database
│
├── Load lesson content from DB
│   └─ SEBELUM: Konten dari file markdown hardcode
│   └─ SESUDAH: Ambil contentPath, load file yang sesuai
│
├── Save progress to DB (not localStorage)
│   └─ SEBELUM: localStorage.setItem("progress", ...)
│   └─ SESUDAH: POST /api/courses/react-basic/progress
│       → Simpan ke tabel Progress
│       → Bisa akses dari device manapun!
│
└── Auto-enroll on first access
    └─ User buka course → otomatis POST /api/courses/xxx/enroll
        → Enrollment dibuat, user resmi "terdaftar"
```

**Deliverable**: Full course system working end-to-end

---

### Phase 4: Polish & Testing (Day 4)

**Apa yang dilakukan?** Memastikan semuanya berjalan dengan baik

```
Testing (User Flow):
├── 1. User login → Dashboard muncul tanpa error
│   └─ Cek: Stats tampil, course list muncul
│
├── 2. User klik course → Otomatis ter-enroll
│   └─ Cek: Enrollment dibuat di database
│
├── 3. User pelajari lesson → Mark as complete
│   └─ Cek: Progress tersimpan di database
│
├── 4. User refresh halaman → Progress tetap ada
│   └─ Cek: Data tidak hilang
│
├── 5. User selesai 100% → Course completion tercatat
│   └─ Cek: Tabel CourseCompletion terisi
│
└── 6. Error handling → Course tidak ada/user tidak login
    └─ Cek: Pesan error friendly, bukan crash

Data Migration (Satu Kali Saja):
└── Pindahkan progress lama dari localStorage → Database
    ├── Ambil data localStorage
    ├── Loop setiap user
    ├── Insert ke tabel Progress
    └── Hapus localStorage (opsional, bisa backup dulu)
```

**Deliverable**: Production-ready course system

---

## 📁 Task Breakdown (Penjelasan Detail)

### High Priority (Critical Path - Harus Selesai Dulu)

| # | Task | Apa yang Dibuat? | File | Estimasi |
|---|------|-----------------|------|----------|
| 1 | Create dashboard API route | API yang mengembalikan data dashboard | `app/api/dashboard/[role]/route.ts` | 30m |
| 2 | Update Prisma schema | Tambah tabel: Section, Lesson, Progress, CourseCompletion | `prisma/schema.prisma` | 45m |
| 3 | Run migration | Jalankan perubahan schema ke database | `prisma migrate dev` | 15m |
| 4 | Create course list API | API untuk list semua course yang tersedia | `app/api/courses/route.ts` | 45m |
| 5 | Create course detail API | API untuk detail satu course (slug-based) | `app/api/courses/[slug]/route.ts` | 45m |
| 6 | Create enrollment API | API untuk mendaftarkan user ke course | `app/api/courses/[slug]/enroll/route.ts` | 30m |
| 7 | Create progress API | API untuk simpan/ambil progress belajar | `app/api/courses/[slug]/progress/route.ts` | 45m |

### Medium Priority (Setelah API Jadi)

| # | Task | Apa yang Dibuat? | File | Estimasi |
|---|------|-----------------|------|----------|
| 8 | Update course API client | Update fungsi fetch course di frontend | `features/course/api.ts` | 30m |
| 9 | Connect dashboard to real API | Ganti mock data → panggil API sungguhan | `app/dashboard/page.tsx` | 30m |
| 10 | Connect learn page to DB | Learn page ambil data dari database | `app/course/[slug]/learn/page.tsx` | 45m |
| 11 | Migrate localStorage progress | Pindahkan progress lama ke database | `lib/migrate-progress.ts` | 30m |

### Low Priority (Nice to Have - Bisa Nanti)

| # | Task | Apa yang Dibuat? | File | Estimasi |
|---|------|-----------------|------|----------|
| 12 | Seed sample course data | Isi database dengan contoh course untuk testing | `prisma/seed.ts` | 30m |
| 13 | Add error boundaries | Komponen untuk handle error dengan graceful | - | 15m |
| 14 | Write E2E tests | Test otomatis untuk flow enrollment & progress | `__tests__/playwright/` | 60m |

---

## 🎯 Success Criteria (Cara Cek Sudah Selesai)

### Checklist untuk Testing

- [ ] **Dashboard bisa diakses tanpa error 404**
  - Coba: Buka `/dashboard` → Halaman muncul, tidak ada error console

- [ ] **User bisa akses halaman belajar (learn page)**
  - Coba: Klik course → Buka halaman `/course/react-basic/learn`

- [ ] **Progress tersimpan di database**
  - Coba: Selesaikan 1 lesson → Refresh → Progress tetap ada (bukan hilang)

- [ ] **Course yang diikuti muncul di dashboard**
  - Coba: Buka course → Kembali ke dashboard → Course muncul di "Recent Courses"

- [ ] **Course completion ter-tracking**
  - Coba: Selesaikan semua lessons → Cek database: tabel CourseCompletion terisi

- [ ] **Fungsi yang sudah ada tetap berjalan**
  - Coba: Login, browse course, auth → Semua masih berfungsi normal

### Cara Test Manual (Step-by-Step)

```
1. Buka terminal → yarn app
2. Buka browser → http://localhost:3000
3. Login dengan Clerk
4. Buka /dashboard
   └─ Expected: Dashboard muncul dengan stats

5. Klik salah satu course
   └─ Expected: Masuk ke halaman detail course

6. Klik "Mulai Belajar"
   └─ Expected: Masuk ke /course/[slug]/learn

7. Klik "Mark as Complete" di lesson
   └─ Expected: Progress tersimpan

8. Refresh halaman
   └─ Expected: Progress masih ada (tidak reset)

9. Kembali ke dashboard
   └─ Expected: Course muncul di "Recent Courses"

10. Cek database (Prisma Studio)
    └─ Expected: Data di tabel Progress, Enrollment terisi
```

---

## ⚠️ Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Schema migration fails | High | Backup DB before migration |
| API breaking changes | Medium | Version API routes |
| localStorage data loss | Low | Migration script |
| Course content missing | Medium | Seed sample data |

---

## 📝 Notes

- **Current Progress**: Stored in localStorage, needs migration
- **Mock Data**: Dashboard uses mock, will be replaced
- **Clerk Integration**: Already working, reuse userId
- **Content Storage**: File-based for now (contentPath), can move to DB later

---

## 🔗 Related Files

- `app/dashboard/page.tsx` - Dashboard page
- `app/course/[slug]/learn/page.tsx` - Learn page
- `features/dashboard/api.ts` - Dashboard API client
- `features/course/api.ts` - Course API client
- `prisma/schema.prisma` - Database schema
- `features/dashboard/utils.ts` - Mock data generator
