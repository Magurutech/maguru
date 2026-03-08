# Design Document: Course Content Management V2

**Feature Name:** Course Content Management  
**Sprint:** Sprint 2 - Content First  
**Created:** 2026-03-08  
**Status:** Design Phase  
**Version:** 2.0

---

## Overview

This design document specifies the technical architecture and implementation details for the Course Content Management feature. The system enables creators to build structured learning content using Tiptap rich-text editor with native JSON storage, and allows students to learn systematically with progress tracking.

### Key Design Principles

1. **Tiptap JSON Native Format** - Store content in Tiptap's native JSON structure without conversion
2. **WYSIWYG Consistency** - Use same Tiptap rendering engine for creator and student views
3. **Type Safety** - Leverage TypeScript interfaces for all data structures
4. **Performance First** - Optimize for fast content loading and rendering
5. **Future-Proof** - Design for extensibility (tables, embeds, custom nodes in future sprints)

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │  Creator Editor  │         │  Student Viewer  │        │
│  │  (Tiptap Editor) │         │  (Tiptap Reader) │        │
│  └────────┬─────────┘         └────────┬─────────┘        │
│           │                            │                   │
│           │ editor.getJSON()           │ useEditor()       │
│           │                            │ editable:false    │
└───────────┼────────────────────────────┼───────────────────┘
            │                            │
            ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  /api/courses/[slug]/sections                              │
│  /api/courses/[slug]/sections/[sectionId]/lessons          │
│  /api/progress/lesson/[lessonId]/complete                  │
│  /api/progress/course/[slug]                               │
│                                                             │
└───────────┬─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  - Authorization (Clerk)                                    │
│  - Validation (Zod schemas)                                 │
│  - Progress calculation                                     │
│  - Tiptap JSON validation                                   │
│                                                             │
└───────────┬─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Data Access Layer (Prisma)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  - Section CRUD operations                                  │
│  - Lesson CRUD operations                                   │
│  - Progress tracking operations                             │
│  - Transaction management                                   │
│                                                             │
└───────────┬─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│              Database (Supabase PostgreSQL)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tables: Course, Section, Lesson, LessonProgress,          │
│          CourseCompletion                                   │
│                                                             │
│  Content Storage: Lesson.content (Json field)              │
│  Structure: { content: TiptapJSON, version, lastEdit }     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Models

### TypeScript Interfaces

#### LessonContent (Storage Wrapper)

```typescript
/**
 * Wrapper object for lesson content stored in database
 * Includes Tiptap JSON document, version tracking, and edit timestamp
 */
interface LessonContent {
  content: TiptapDocument    // Native Tiptap JSON structure
  version: number            // Incremental version (1, 2, 3, ...)
  lastEdit: string           // ISO 8601 timestamp
}
```

#### Tiptap Document Structure

```typescript
/**
 * Root Tiptap document structure
 * All content must have type 'doc' at root level
 */
interface TiptapDocument {
  type: 'doc'
  content: TiptapNode[]
}

/**
 * Union type of all supported node types in Sprint 2
 */
type TiptapNode = 
  | ParagraphNode 
  | HeadingNode 
  | BulletListNode 
  | OrderedListNode
  | ListItemNode
  | CodeBlockNode
  | TextNode

/**
 * Paragraph node - basic text container
 */
interface ParagraphNode {
  type: 'paragraph'
  content?: TiptapInlineContent[]
}

/**
 * Heading node - supports levels 1-3
 */
interface HeadingNode {
  type: 'heading'
  attrs: { level: 1 | 2 | 3 }
  content?: TiptapInlineContent[]
}

/**
 * Bullet list node - unordered list
 */
interface BulletListNode {
  type: 'bulletList'
  content: ListItemNode[]
}

/**
 * Ordered list node - numbered list
 */
interface OrderedListNode {
  type: 'orderedList'
  attrs?: { start?: number }
  content: ListItemNode[]
}

/**
 * List item node - container for list content
 */
interface ListItemNode {
  type: 'listItem'
  content: TiptapNode[]
}

/**
 * Code block node - for code snippets
 */
interface CodeBlockNode {
  type: 'codeBlock'
  attrs?: { language?: string }
  content?: TextNode[]
}

/**
 * Text node - inline text with optional marks
 */
interface TextNode {
  type: 'text'
  text: string
  marks?: Mark[]
}

/**
 * Union type of all supported marks (inline formatting)
 */
type Mark = BoldMark | ItalicMark | CodeMark | LinkMark

interface BoldMark {
  type: 'bold'
}

interface ItalicMark {
  type: 'italic'
}

interface CodeMark {
  type: 'code'
}

interface LinkMark {
  type: 'link'
  attrs: {
    href: string
    target?: string
  }
}

/**
 * Helper type for inline content
 */
type TiptapInlineContent = TextNode
```

---

### Database Schema (Prisma)

```prisma
model Section {
  id          String   @id @default(uuid())
  courseId    String
  order       Int
  title       String   @db.VarChar(200)
  description String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons     Lesson[]
  
  @@unique([courseId, order])
  @@index([courseId])
}

model Lesson {
  id          String   @id @default(uuid())
  sectionId   String
  order       Int
  title       String   @db.VarChar(200)
  content     Json     // Stores LessonContent: { content: TiptapJSON, version, lastEdit }
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  section     Section   @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  progress    LessonProgress[]
  
  @@unique([sectionId, order])
  @@index([sectionId])
}

model LessonProgress {
  id          String   @id @default(uuid())
  lessonId    String
  userId      String
  completed   Boolean  @default(false)
  completedAt DateTime?
  createdAt   DateTime @default(now())
  
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  @@unique([lessonId, userId])
  @@index([userId])
  @@index([lessonId])
}

model CourseCompletion {
  id           String   @id @default(uuid())
  courseId     String
  userId       String
  percentage   Float    @default(0)
  completed    Boolean  @default(false)
  completedAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@unique([courseId, userId])
  @@index([userId])
  @@index([courseId])
}
```

---

## API Design

### Section Management Endpoints

#### POST /api/courses/[slug]/sections

Create a new section within a course.

**Authorization:** Creator (owns course) or Admin

**Request Body:**
```typescript
{
  title: string          // Max 200 chars, required
  description?: string   // Optional
  order: number          // Positive integer, unique within course
}
```

**Response (201 Created):**
```typescript
{
  id: string
  courseId: string
  order: number
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
}
```

**Error Responses:**
- 400: Validation error (title empty, order invalid, duplicate order)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (not course owner or admin)
- 404: Course not found

---

#### GET /api/courses/[slug]/sections

List all sections in a course, ordered by order field.

**Authorization:** Public (for published courses), Creator/Admin (for drafts)

**Response (200 OK):**
```typescript
{
  sections: Array<{
    id: string
    courseId: string
    order: number
    title: string
    description: string | null
    lessonCount: number  // Computed field
    createdAt: string
    updatedAt: string
  }>
}
```

---

#### PUT /api/courses/[slug]/sections/[sectionId]

Update an existing section.

**Authorization:** Creator (owns course) or Admin

**Request Body:**
```typescript
{
  title?: string          // Max 200 chars
  description?: string
  order?: number          // Positive integer, unique within course
}
```

**Response (200 OK):**
```typescript
{
  id: string
  courseId: string
  order: number
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
}
```

**Error Responses:**
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Section not found

---

#### DELETE /api/courses/[slug]/sections/[sectionId]

Delete a section and all its lessons (cascade).

**Authorization:** Creator (owns course) or Admin

**Response (200 OK):**
```typescript
{
  message: "Section deleted successfully"
  deletedLessons: number  // Count of cascade-deleted lessons
}
```

**Error Responses:**
- 401: Unauthorized
- 403: Forbidden
- 404: Section not found

---

### Lesson Management Endpoints

#### POST /api/courses/[slug]/sections/[sectionId]/lessons

Create a new lesson within a section.

**Authorization:** Creator (owns course) or Admin

**Request Body:**
```typescript
{
  title: string          // Max 200 chars, required
  content: LessonContent // Tiptap JSON with metadata
  order: number          // Positive integer, unique within section
}

// LessonContent structure:
{
  content: {
    type: 'doc',
    content: TiptapNode[]
  },
  version: number,       // Start with 1
  lastEdit: string       // ISO 8601 timestamp
}
```

**Response (201 Created):**
```typescript
{
  id: string
  sectionId: string
  order: number
  title: string
  content: LessonContent
  createdAt: string
  updatedAt: string
}
```

**Error Responses:**
- 400: Validation error (invalid Tiptap JSON structure)
- 401: Unauthorized
- 403: Forbidden
- 404: Section not found

---

#### GET /api/courses/[slug]/sections/[sectionId]/lessons

List all lessons in a section, ordered by order field.

**Authorization:** Public (for published courses), Creator/Admin (for drafts)

**Response (200 OK):**
```typescript
{
  lessons: Array<{
    id: string
    sectionId: string
    order: number
    title: string
    contentPreview: string  // First 200 chars of plain text
    createdAt: string
    updatedAt: string
  }>
}
```

---

#### GET /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]

Get full lesson details including complete content.

**Authorization:** Public (for published courses), Creator/Admin (for drafts)

**Response (200 OK):**
```typescript
{
  id: string
  sectionId: string
  order: number
  title: string
  content: LessonContent  // Full Tiptap JSON structure
  createdAt: string
  updatedAt: string
  section: {
    id: string
    title: string
    courseId: string
  }
}
```

---

#### PUT /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]

Update an existing lesson.

**Authorization:** Creator (owns course) or Admin

**Request Body:**
```typescript
{
  title?: string
  content?: LessonContent  // Must increment version number
  order?: number
}
```

**Response (200 OK):**
```typescript
{
  id: string
  sectionId: string
  order: number
  title: string
  content: LessonContent
  createdAt: string
  updatedAt: string
}
```

**Validation Rules:**
- If content is updated, version must be incremented
- lastEdit timestamp must be updated
- Tiptap JSON structure must be valid

---

#### DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]

Delete a lesson and all its progress records (cascade).

**Authorization:** Creator (owns course) or Admin

**Response (200 OK):**
```typescript
{
  message: "Lesson deleted successfully"
  deletedProgressRecords: number  // Count of cascade-deleted progress
}
```

---

### Progress Tracking Endpoints

#### POST /api/progress/lesson/[lessonId]/complete

Mark a lesson as complete for the authenticated user.

**Authorization:** Authenticated user (Student role)

**Request Body:**
```typescript
{
  // userId extracted from Clerk auth
}
```

**Response (200 OK):**
```typescript
{
  id: string
  lessonId: string
  userId: string
  completed: true
  completedAt: string  // ISO 8601 timestamp
  createdAt: string
}
```

**Side Effects:**
- Creates or updates LessonProgress record
- Triggers CourseCompletion recalculation
- Updates course completion percentage

---

#### GET /api/progress/course/[slug]

Get course completion status for authenticated user.

**Authorization:** Authenticated user

**Response (200 OK):**
```typescript
{
  courseId: string
  userId: string
  percentage: number        // 0-100, rounded to 2 decimals
  completedLessons: number
  totalLessons: number
  completed: boolean        // true if 100%
  completedAt: string | null
}
```

---

#### GET /api/progress/lesson/[lessonId]

Get lesson progress status for authenticated user.

**Authorization:** Authenticated user

**Response (200 OK):**
```typescript
{
  lessonId: string
  userId: string
  completed: boolean
  completedAt: string | null
}
```

**Response (404 Not Found):**
```typescript
{
  lessonId: string
  userId: string
  completed: false
  completedAt: null
}
```

---

## Frontend Components

### Creator Editor Components

#### LessonEditor Component

**Location:** `components/creator/LessonEditor.tsx`

**Purpose:** Rich text editor for creating and editing lesson content

**Props:**
```typescript
interface LessonEditorProps {
  initialContent?: TiptapDocument
  onSave: (content: LessonContent) => Promise<void>
  onCancel?: () => void
}
```

**Implementation:**
```typescript
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

export function LessonEditor({ initialContent, onSave, onCancel }: LessonEditorProps) {
  const [version, setVersion] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: true,
  })

  const handleSave = async () => {
    if (!editor) return
    
    setIsSaving(true)
    try {
      const content: LessonContent = {
        content: editor.getJSON(),
        version: version + 1,
        lastEdit: new Date().toISOString()
      }
      
      await onSave(content)
      setVersion(v => v + 1)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="lesson-editor">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="editor-content" />
      <div className="editor-actions">
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Lesson'}
        </button>
        {onCancel && (
          <button onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
```

---

#### EditorToolbar Component

**Location:** `components/creator/EditorToolbar.tsx`

**Purpose:** Toolbar with formatting buttons for Tiptap editor

**Props:**
```typescript
interface EditorToolbarProps {
  editor: Editor | null
}
```

**Buttons:**
- Bold (Ctrl+B)
- Italic (Ctrl+I)
- Inline Code (Ctrl+E)
- Heading 1, 2, 3
- Bullet List
- Ordered List
- Link (Ctrl+K)
- Code Block

**Implementation:**
```typescript
export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  return (
    <div className="editor-toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        Code
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        H1
      </button>
      {/* Additional buttons... */}
    </div>
  )
}
```

---

#### LessonPreview Component

**Location:** `components/creator/LessonPreview.tsx`

**Purpose:** Read-only preview of lesson content (student view simulation)

**Props:**
```typescript
interface LessonPreviewProps {
  content: TiptapDocument
}
```

**Implementation:**
```typescript
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export function LessonPreview({ content }: LessonPreviewProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,  // Read-only mode
  })

  return (
    <div className="lesson-preview">
      <h3>Preview (Student View)</h3>
      <EditorContent editor={editor} className="preview-content" />
    </div>
  )
}
```

---

### Student Viewer Components

#### LessonViewer Component

**Location:** `components/student/LessonViewer.tsx`

**Purpose:** Display lesson content to students with Tiptap renderer

**Props:**
```typescript
interface LessonViewerProps {
  lesson: {
    id: string
    title: string
    content: LessonContent
  }
  onMarkComplete?: () => Promise<void>
  isCompleted: boolean
}
```

**Implementation:**
```typescript
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export function LessonViewer({ lesson, onMarkComplete, isCompleted }: LessonViewerProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content.content,  // Tiptap JSON from database
    editable: false,                  // Read-only for students
  })

  if (!editor) return <div>Loading...</div>

  return (
    <div className="lesson-viewer">
      <h1>{lesson.title}</h1>
      <EditorContent editor={editor} className="lesson-content" />
      <div className="lesson-meta">
        <span>Version: {lesson.content.version}</span>
        <span>Last updated: {new Date(lesson.content.lastEdit).toLocaleDateString()}</span>
      </div>
      {!isCompleted && onMarkComplete && (
        <button onClick={onMarkComplete} className="mark-complete-btn">
          Mark as Complete
        </button>
      )}
      {isCompleted && (
        <div className="completed-badge">
          ✓ Completed
        </div>
      )}
    </div>
  )
}
```

---

#### CourseNavigation Component

**Location:** `components/student/CourseNavigation.tsx`

**Purpose:** Sidebar navigation showing sections and lessons with progress indicators

**Props:**
```typescript
interface CourseNavigationProps {
  sections: Array<{
    id: string
    title: string
    lessons: Array<{
      id: string
      title: string
      completed: boolean
    }>
  }>
  currentLessonId: string
  onLessonClick: (lessonId: string) => void
}
```

**Implementation:**
```typescript
export function CourseNavigation({ sections, currentLessonId, onLessonClick }: CourseNavigationProps) {
  return (
    <nav className="course-navigation">
      {sections.map(section => (
        <div key={section.id} className="section-group">
          <h3>{section.title}</h3>
          <ul className="lesson-list">
            {section.lessons.map(lesson => (
              <li
                key={lesson.id}
                className={currentLessonId === lesson.id ? 'active' : ''}
              >
                <button onClick={() => onLessonClick(lesson.id)}>
                  {lesson.completed && <span className="check-icon">✓</span>}
                  {lesson.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
```

---

#### ProgressBar Component

**Location:** `components/student/ProgressBar.tsx`

**Purpose:** Visual progress indicator for course completion

**Props:**
```typescript
interface ProgressBarProps {
  percentage: number        // 0-100
  completedLessons: number
  totalLessons: number
}
```

**Implementation:**
```typescript
export function ProgressBar({ percentage, completedLessons, totalLessons }: ProgressBarProps) {
  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span>{completedLessons} / {totalLessons} lessons completed</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
```

---

## Business Logic

### Content Validation

#### validateLessonContent Function

**Purpose:** Validate Tiptap JSON structure before saving to database

**Location:** `lib/validation/tiptap.ts`

**Implementation:**
```typescript
import { z } from 'zod'

// Zod schema for Tiptap JSON validation
const TiptapNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal('doc'),
      content: z.array(TiptapNodeSchema)
    }),
    z.object({
      type: z.literal('paragraph'),
      content: z.array(TiptapNodeSchema).optional()
    }),
    z.object({
      type: z.literal('heading'),
      attrs: z.object({ level: z.union([z.literal(1), z.literal(2), z.literal(3)]) }),
      content: z.array(TiptapNodeSchema).optional()
    }),
    z.object({
      type: z.literal('bulletList'),
      content: z.array(TiptapNodeSchema)
    }),
    z.object({
      type: z.literal('orderedList'),
      attrs: z.object({ start: z.number().optional() }).optional(),
      content: z.array(TiptapNodeSchema)
    }),
    z.object({
      type: z.literal('listItem'),
      content: z.array(TiptapNodeSchema)
    }),
    z.object({
      type: z.literal('codeBlock'),
      attrs: z.object({ language: z.string().optional() }).optional(),
      content: z.array(TiptapNodeSchema).optional()
    }),
    z.object({
      type: z.literal('text'),
      text: z.string(),
      marks: z.array(z.object({
        type: z.enum(['bold', 'italic', 'code', 'link']),
        attrs: z.object({ href: z.string(), target: z.string().optional() }).optional()
      })).optional()
    })
  ])
)

const LessonContentSchema = z.object({
  content: z.object({
    type: z.literal('doc'),
    content: z.array(TiptapNodeSchema)
  }),
  version: z.number().int().positive(),
  lastEdit: z.string().datetime()
})

export function validateLessonContent(content: unknown): LessonContent {
  return LessonContentSchema.parse(content)
}
```

---

### Progress Calculation

#### calculateCourseCompletion Function

**Purpose:** Calculate course completion percentage based on completed lessons

**Location:** `lib/progress/calculation.ts`

**Implementation:**
```typescript
interface CourseProgressData {
  totalLessons: number
  completedLessons: number
}

export function calculateCourseCompletion(data: CourseProgressData): {
  percentage: number
  completed: boolean
} {
  const { totalLessons, completedLessons } = data
  
  if (totalLessons === 0) {
    return { percentage: 0, completed: false }
  }
  
  const percentage = (completedLessons / totalLessons) * 100
  const roundedPercentage = Math.round(percentage * 100) / 100  // Round to 2 decimals
  
  return {
    percentage: roundedPercentage,
    completed: roundedPercentage === 100
  }
}
```

---

#### updateCourseCompletion Function

**Purpose:** Update CourseCompletion record when lesson is marked complete

**Location:** `lib/progress/update.ts`

**Implementation:**
```typescript
import { prisma } from '@/lib/prisma'
import { calculateCourseCompletion } from './calculation'

export async function updateCourseCompletion(userId: string, courseId: string) {
  // Get total lessons in course
  const totalLessons = await prisma.lesson.count({
    where: {
      section: {
        courseId: courseId
      }
    }
  })
  
  // Get completed lessons for user
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId: userId,
      completed: true,
      lesson: {
        section: {
          courseId: courseId
        }
      }
    }
  })
  
  // Calculate completion
  const { percentage, completed } = calculateCourseCompletion({
    totalLessons,
    completedLessons
  })
  
  // Update or create CourseCompletion record
  await prisma.courseCompletion.upsert({
    where: {
      courseId_userId: {
        courseId: courseId,
        userId: userId
      }
    },
    update: {
      percentage: percentage,
      completed: completed,
      completedAt: completed ? new Date() : null
    },
    create: {
      courseId: courseId,
      userId: userId,
      percentage: percentage,
      completed: completed,
      completedAt: completed ? new Date() : null
    }
  })
}
```

---

### Authorization Logic

#### checkCourseOwnership Function

**Purpose:** Verify if user owns a course or is admin

**Location:** `lib/auth/authorization.ts`

**Implementation:**
```typescript
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

export async function checkCourseOwnership(courseId: string): Promise<boolean> {
  const { userId } = auth()
  
  if (!userId) {
    return false
  }
  
  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true }
  })
  
  if (user?.role === 'ADMIN') {
    return true
  }
  
  // Check if user owns the course
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      creatorId: userId
    }
  })
  
  return !!course
}
```

---

#### requireCourseOwnership Function

**Purpose:** Throw error if user doesn't own course (middleware helper)

**Implementation:**
```typescript
export async function requireCourseOwnership(courseId: string): Promise<void> {
  const hasOwnership = await checkCourseOwnership(courseId)
  
  if (!hasOwnership) {
    throw new Error('Forbidden: You do not have permission to modify this course')
  }
}
```

---

## Rendering Strategy

### CRITICAL: Frontend Rendering Approach

**Primary Method: EditorContent Component (Read-Only)**

For 99% of use cases in Sprint 2, use Tiptap's `EditorContent` component with `editable: false` for student view.

#### Why This Approach?

1. **WYSIWYG Consistency** - Creator and student see identical rendering
2. **Native Tiptap Engine** - No conversion or parsing needed
3. **Automatic Node Handling** - All node types rendered correctly
4. **Future-Proof** - Easy to add new node types (tables, embeds)
5. **Performance** - Optimized rendering by Tiptap

#### Decision Tree

```
Need to display Tiptap JSON content?
│
├─ React component? (Student Learn Page, Creator Preview)
│  └─ ✅ USE: EditorContent with editable: false
│
├─ Static export? (Email, RSS, PDF)
│  └─ ✅ USE: generateHTML()
│
└─ Search indexing or preview text?
   └─ ✅ USE: editor.getText()
```

---

### Implementation Examples

#### ✅ 

### Implementation Examples

#### Student Learn Page (CORRECT)

```typescript
// ✅ CORRECT APPROACH
function StudentLessonView({ lesson }: { lesson: LessonContent }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content,
    editable: false
  })
  return <EditorContent editor={editor} />
}
```

#### Email Notification (CORRECT)

```typescript
// ✅ CORRECT APPROACH for static export
import { generateHTML } from '@tiptap/html'

async function sendEmail(lesson: LessonContent) {
  const html = generateHTML(lesson.content, [StarterKit])
  // Use html in email template
}
```

#### Common Mistakes

```typescript
// ❌ WRONG: Using generateHTML() for student view
function StudentView({ lesson }) {
  const html = generateHTML(lesson.content, [StarterKit])
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

// ❌ WRONG: Converting to markdown for display
function StudentView({ lesson }) {
  const markdown = convertToMarkdown(lesson.content)
  return <ReactMarkdown>{markdown}</ReactMarkdown>
}
```

---

## Package Dependencies

### Required Packages

```json
{
  "dependencies": {
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",
    "@tiptap/pm": "^2.1.0",
    "@tiptap/html": "^2.1.0",
    "zod": "^3.22.0"
  }
}
```

### Installation Command

```bash
yarn add @tiptap/react @tiptap/starter-kit @tiptap/pm @tiptap/html
```

---

## Error Handling

### API Error Responses

All API endpoints follow consistent error response format:

```typescript
{
  error: string          // Error message
  code: string           // Error code (VALIDATION_ERROR, UNAUTHORIZED, etc.)
  details?: object       // Additional error details (for validation errors)
}
```

### Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | VALIDATION_ERROR | Request validation failed |
| 401 | UNAUTHORIZED | User not authenticated |
| 403 | FORBIDDEN | User lacks permission |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Duplicate order value |
| 500 | INTERNAL_ERROR | Server error |

---

### Validation Error Example

```typescript
// Request with invalid Tiptap JSON
POST /api/courses/web-dev/sections/sec-1/lessons
{
  "title": "Lesson 1",
  "content": {
    "content": {
      "type": "invalid",  // Invalid type
      "content": []
    },
    "version": 1,
    "lastEdit": "2026-03-08T10:00:00Z"
  },
  "order": 1
}

// Response (400 Bad Request)
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "content.content.type",
    "message": "Expected 'doc', received 'invalid'"
  }
}
```

---

## Performance Considerations

### Database Indexing

```prisma
// Indexes for optimal query performance
model Section {
  @@index([courseId])
  @@unique([courseId, order])
}

model Lesson {
  @@index([sectionId])
  @@unique([sectionId, order])
}

model LessonProgress {
  @@index([userId])
  @@index([lessonId])
  @@unique([lessonId, userId])
}

model CourseCompletion {
  @@index([userId])
  @@index([courseId])
  @@unique([courseId, userId])
}
```

---

### Query Optimization

#### Lesson List Query (with progress)

```typescript
// Optimized query with single database call
const lessonsWithProgress = await prisma.lesson.findMany({
  where: { sectionId: sectionId },
  orderBy: { order: 'asc' },
  include: {
    progress: {
      where: { userId: userId },
      select: { completed: true, completedAt: true }
    }
  }
})
```

#### Course Completion Query

```typescript
// Use aggregation for efficient counting
const [totalLessons, completedLessons] = await Promise.all([
  prisma.lesson.count({
    where: { section: { courseId: courseId } }
  }),
  prisma.lessonProgress.count({
    where: {
      userId: userId,
      completed: true,
      lesson: { section: { courseId: courseId } }
    }
  })
])
```

---

### Caching Strategy

**Client-Side Caching:**
- Use React Query for API response caching
- Cache lesson content for 5 minutes
- Invalidate cache on content update

**Server-Side Caching:**
- Cache course structure (sections + lessons) for 1 minute
- Invalidate on CRUD operations
- Use Redis for distributed caching (future)

---

## Security Considerations

### Content Sanitization

**Tiptap JSON Validation:**
- Validate all node types against whitelist
- Reject unknown node types
- Validate mark attributes (especially link hrefs)
- Prevent XSS through strict schema validation

**Link Validation:**
```typescript
function validateLinkHref(href: string): boolean {
  // Only allow http, https, mailto protocols
  const allowedProtocols = ['http:', 'https:', 'mailto:']
  try {
    const url = new URL(href)
    return allowedProtocols.includes(url.protocol)
  } catch {
    return false
  }
}
```

---

### Authorization Checks

**Every API endpoint must:**
1. Verify user authentication (Clerk)
2. Check user role (Creator, Student, Admin)
3. Verify resource ownership (for Creator role)
4. Return appropriate error codes (401, 403)

**Example Middleware:**
```typescript
export async function withCourseOwnership(
  handler: (req: Request, context: Context) => Promise<Response>
) {
  return async (req: Request, context: Context) => {
    const { userId } = auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const courseId = context.params.courseId
    const hasOwnership = await checkCourseOwnership(courseId)
    
    if (!hasOwnership) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return handler(req, context)
  }
}
```

---

## Testing Strategy

### Unit Tests

**Content Validation:**
```typescript
describe('validateLessonContent', () => {
  it('should accept valid Tiptap JSON', () => {
    const validContent = {
      content: {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }
        ]
      },
      version: 1,
      lastEdit: '2026-03-08T10:00:00Z'
    }
    expect(() => validateLessonContent(validContent)).not.toThrow()
  })
  
  it('should reject invalid root type', () => {
    const invalidContent = {
      content: { type: 'paragraph', content: [] },
      version: 1,
      lastEdit: '2026-03-08T10:00:00Z'
    }
    expect(() => validateLessonContent(invalidContent)).toThrow()
  })
})
```

**Progress Calculation:**
```typescript
describe('calculateCourseCompletion', () => {
  it('should calculate 50% for half completed', () => {
    const result = calculateCourseCompletion({
      totalLessons: 10,
      completedLessons: 5
    })
    expect(result.percentage).toBe(50)
    expect(result.completed).toBe(false)
  })
  
  it('should mark as completed at 100%', () => {
    const result = calculateCourseCompletion({
      totalLessons: 10,
      completedLessons: 10
    })
    expect(result.percentage).toBe(100)
    expect(result.completed).toBe(true)
  })
})
```

---

### Integration Tests

**API Endpoint Tests:**
```typescript
describe('POST /api/courses/[slug]/sections', () => {
  it('should create section with valid data', async () => {
    const response = await fetch('/api/courses/web-dev/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Introduction',
        description: 'Getting started',
        order: 1
      })
    })
    
    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data.title).toBe('Introduction')
  })
  
  it('should reject duplicate order', async () => {
    // Create first section with order 1
    await createSection({ order: 1 })
    
    // Try to create second section with order 1
    const response = await fetch('/api/courses/web-dev/sections', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', order: 1 })
    })
    
    expect(response.status).toBe(409)
  })
})
```

---

### E2E Tests (Playwright)

**Creator Workflow:**
```typescript
test('creator can create and edit lesson', async ({ page }) => {
  await page.goto('/creator/courses/web-dev/edit')
  
  // Create section
  await page.click('button:has-text("Add Section")')
  await page.fill('input[name="title"]', 'Introduction')
  await page.click('button:has-text("Save")')
  
  // Create lesson
  await page.click('button:has-text("Add Lesson")')
  await page.fill('input[name="title"]', 'What is HTML?')
  
  // Type in Tiptap editor
  await page.click('.tiptap')
  await page.keyboard.type('HTML is a markup language')
  
  // Save lesson
  await page.click('button:has-text("Save Lesson")')
  
  // Verify saved
  await expect(page.locator('text=Lesson saved')).toBeVisible()
})
```

**Student Workflow:**
```typescript
test('student can view lesson and mark complete', async ({ page }) => {
  await page.goto('/learn/web-dev')
  
  // Click first lesson
  await page.click('text=What is HTML?')
  
  // Verify content displayed
  await expect(page.locator('.lesson-content')).toBeVisible()
  
  // Mark as complete
  await page.click('button:has-text("Mark as Complete")')
  
  // Verify completion
  await expect(page.locator('text=✓ Completed')).toBeVisible()
  
  // Verify progress updated
  await expect(page.locator('.progress-bar')).toContainText('10%')
})
```

---

## Migration Strategy

### Database Migration

**Prisma Migration Steps:**

1. Create migration file:
```bash
npx prisma migrate dev --name add_content_management
```

2. Migration will create:
   - Section table
   - Lesson table
   - LessonProgress table
   - CourseCompletion table
   - All indexes and constraints

3. Verify migration:
```bash
npx prisma migrate status
```

---

### Seed Data

**Create seed script for testing:**

**Location:** `prisma/seeds/content-management.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedContentManagement() {
  // Create test course
  const course = await prisma.course.findFirst({
    where: { slug: 'web-dev-101' }
  })
  
  if (!course) {
    console.log('Course not found, skipping seed')
    return
  }
  
  // Create sections
  const section1 = await prisma.section.create({
    data: {
      courseId: course.id,
      order: 1,
      title: 'Introduction to HTML',
      description: 'Learn the basics of HTML'
    }
  })
  
  // Create lessons with Tiptap JSON content
  await prisma.lesson.create({
    data: {
      sectionId: section1.id,
      order: 1,
      title: 'What is HTML?',
      content: {
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'What is HTML?' }]
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'HTML stands for ' },
                { type: 'text', marks: [{ type: 'bold' }], text: 'HyperText Markup Language' },
                { type: 'text', text: '.' }
              ]
            }
          ]
        },
        version: 1,
        lastEdit: new Date().toISOString()
      }
    }
  })
  
  console.log('Content management seed completed')
}

seedContentManagement()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Run all unit tests (`yarn test`)
- [ ] Run integration tests
- [ ] Run E2E tests (`yarn test:e2e`)
- [ ] Verify Prisma schema is up to date
- [ ] Create database backup
- [ ] Review environment variables

### Deployment Steps

1. **Database Migration:**
```bash
npx prisma migrate deploy
```

2. **Verify Migration:**
```bash
npx prisma migrate status
```

3. **Run Seed Script (if needed):**
```bash
npx prisma db seed
```

4. **Deploy Application:**
```bash
yarn build
yarn deploy
```

5. **Smoke Tests:**
   - Create test section
   - Create test lesson
   - Mark lesson complete
   - Verify progress calculation

### Post-Deployment

- [ ] Monitor error logs
- [ ] Check API response times
- [ ] Verify database query performance
- [ ] Test on production with real users
- [ ] Monitor Tiptap rendering performance

---

## Future Enhancements (Sprint 3+)

### Planned Features

**Sprint 3:**
- Quiz system integration
- Video content support
- Image upload for lessons
- Table support in Tiptap

**Sprint 4:**
- Collaborative editing
- Version history
- Content templates
- Drag-and-drop reordering

**Sprint 5:**
- GitHub integration for backup
- Markdown import/export
- Content search
- Analytics dashboard

---

## Appendix

### Complete Example: Lesson Content

```json
{
  "content": {
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 1 },
        "content": [
          { "type": "text", "text": "Introduction to HTML" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "HTML stands for " },
          { 
            "type": "text", 
            "marks": [{ "type": "bold" }], 
            "text": "HyperText Markup Language" 
          },
          { "type": "text", "text": ". It is the standard markup language for creating web pages." }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "Key Features" }
        ]
      },
      {
        "type": "bulletList",
        "content": [
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Semantic structure" }
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Easy to learn" }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "Example Code" }
        ]
      },
      {
        "type": "codeBlock",
        "attrs": { "language": "html" },
        "content": [
          { 
            "type": "text", 
            "text": "<html>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>" 
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Learn more at " },
          {
            "type": "text",
            "marks": [
              { 
                "type": "link", 
                "attrs": { "href": "https://developer.mozilla.org" } 
              }
            ],
            "text": "MDN Web Docs"
          }
        ]
      }
    ]
  },
  "version": 1,
  "lastEdit": "2026-03-08T10:00:00Z"
}
```

---

**Document Version:** 2.0  
**Last Updated:** 2026-03-08  
**Status:** Ready for Implementation  
**Next Phase:** Create tasks.md

