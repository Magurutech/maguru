Course Discovery & Enrollment — File Architecture
All 17 tasks are complete. Here's the full file map:

Database Layer
prisma/schema.prisma                                    ← courses.difficulty, enrollments.completed/completedAt, indexes
prisma/migrations/20260315172957_add_course_discovery_fields/
API Routes
app/api/courses/route.ts                                ← GET /api/courses (public catalog, paginated, filtered)
app/api/courses/[slug]/enroll/route.ts                  ← POST enroll (auth, 401/403/404/409 guards)
app/api/courses/my-courses/route.ts                     ← GET my-courses (auth required, returns progress)
app/api/creator/courses/route.ts                        ← GET (with stats) + POST create course
app/api/creator/courses/[slug]/publish/route.ts         ← PUT toggle DRAFT↔PUBLISHED (ownership check)
Services (business logic layer)
features/cms/services/enrollment.service.ts             ← getMyEnrollments() with progress calc
features/cms/services/creator-course.service.ts         ← createCourse(), togglePublishStatus()
Components — Student
features/cms/components/student/CourseCard.tsx          ← shared card (catalog, my-courses, creator views)
features/cms/components/student/learn/CourseFilters.tsx ← debounced search + category/difficulty dropdowns
features/cms/components/student/learn/CoursePagination.tsx ← prev/next + page numbers
features/cms/components/student/learn/EnrollButton.tsx  ← enrollment handler with toast + redirect
Components — Creator
features/cms/components/creator/CourseCreationForm.tsx  ← Quick Start form with validation
features/cms/components/creator/dashboard/DashboardStats.tsx    ← totalCourses/published/draft stats
features/cms/components/creator/dashboard/CourseList.tsx        ← course list with empty state
features/cms/components/creator/dashboard/CourseListItem.tsx    ← individual course row (status badge, enrollment count)
features/cms/components/creator/dashboard/QuickActionsPanel.tsx ← "Buat Kursus Baru" + other actions
features/cms/components/creator/dashboard/DashboardHeader.tsx
features/cms/components/creator/dashboard/PendingTasksPanel.tsx
Pages
app/course/page.tsx                                     ← Catalog page (server, reads searchParams)
app/course/[slug]/page.tsx                              ← Course detail (existing)
app/student/courses/page.tsx                            ← My Courses (server, auth-protected)
app/creator/courses/create/page.tsx                     ← Course creation (client, role-guarded)
app/creator/page.tsx                                    ← Creator dashboard (real data + stats)
Testing
docs/api/student-course/student-course.postman_collection.json  ← catalog, enroll, my-courses tests
docs/api/creator-course/creator-course.postman_collection.json  ← creator CRUD + publish toggle tests
__tests__/playwright/course/student/catalog.spec.ts             ← browse, filter, unauthenticated enroll
__tests__/playwright/course/student/my-courses.spec.ts          ← auth redirect, enrolled courses display
__tests__/playwright/course/creator/dashboard.spec.ts           ← stats, course list, empty state
__tests__/playwright/course/creator/create-course.spec.ts       ← form validation, role guard, redirect
One open item: task 16.3 (filter by category/difficulty updates URL + re-renders) is the only subtask not checked off in tasks.md. Everything else is done. The test for it exists in catalog.spec.ts but the task checkbox is still unchecked.