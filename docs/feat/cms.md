# Course Management System (CMS)

Dokumentasi fitur untuk sistem manajemen konten kursus Maguru.

**Status:** In Development  
**Current Sprint:** Sprint 2 - Content First  
**Last Updated:** 2026-03-07

---

## 📋 Ringkasan

CMS memungkinkan creator membuat, mengedit, dan mempublikasikan kursus dengan struktur pembelajaran yang terorganisir.

### Arsitektur Saat Ini (Sprint 2)
- **Database (Prisma + Supabase)** → Semua data (metadata + content)
- **Content Storage** → Tiptap JSON format di database dengan versioning metadata
- **Editor** → Tiptap rich text editor (native JSON format)

### Arsitektur Future (Sprint 3+)
- **GitHub Repository** → Optional backup dan version control
- **Supabase** → Primary storage untuk performance
- **Hybrid Approach** → Best of both worlds

---

## 🏗️ Arsitektur Sistem

### Sprint 2 Architecture (Current)

```
┌─────────────────────────────────────────────────┐
│    Course Management Architecture (Sprint 2)  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌────────────┐         ┌──────────────┐      │
│  │  Frontend  │────────▶│  API Routes  │      │
│  │  (Next.js) │         │  (Next.js)   │      │
│  └────────────┘         └──────────────┘      │
│       │                        │               │
│       │                        ▼               │
│       │              ┌──────────────────┐     │
│       │              │  Prisma Client   │     │
│       │              └──────────────────┘     │
│       │                        │               │
│       ▼                        ▼               │
│  ┌─────────────────────────────────────┐      │
│  │     Database (Supabase/PostgreSQL)  │      │
│  │  ┌─────────────────────────────┐    │      │
│  │  │ Course, Section, Lesson     │    │      │
│  │  │ LessonProgress, Completion  │    │      │
│  │  │ Content (JSON with metadata)│    │      │
│  │  └─────────────────────────────┘    │      │
│  └─────────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
```

### Future Architecture (Sprint 3+)

```
┌─────────────────────────────────────────────────┐
│    Course Management Architecture (Future)    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌────────────┐         ┌──────────────┐      │
│  │  Frontend  │────────▶│  API Routes  │      │
│  │  (Next.js) │         │  (Next.js)   │      │
│  └────────────┘         └──────────────┘      │
│                                │               │
│                    ┌───────────┴───────────┐   │
│                    ▼                       ▼   │
│         ┌──────────────────┐    ┌──────────────┐
│         │  Prisma Client   │    │ GitHub API   │
│         └──────────────────┘    └──────────────┘
│                    │                       │   │
│                    ▼                       ▼   │
│         ┌──────────────────┐    ┌──────────────┐
│         │    Supabase      │    │ GitHub Repo  │
│         │  (Primary Store) │    │  (Backup &   │
│         │                  │    │   Versioning)│
│         └──────────────────┘    └──────────────┘
└─────────────────────────────────────────────────┘
```

---

## 🎯 Gambaran Besar Fitur

### ✅ Sprint 2: Content First (Current Implementation)

#### 1. Course Structure Management
**Status:** ✅ In Development (Sprint 2)

**Deskripsi:** Creator dapat membuat struktur hierarki course dengan sections dan lessons.

**Komponen yang Dibangun:**
- Section CRUD (Create, Read, Update, Delete)
- Lesson CRUD dengan markdown content
- Integer-based ordering (up/down buttons)
- Database schema: Course → Section → Lesson

**Fitur:**
- Create section dengan title dan description
- Create lesson dengan title dan markdown content
- Reorder sections dan lessons (up/down)
- Delete sections dan lessons
- View section/lesson list

---

#### 2. Tiptap Rich Text Editor dengan Preview
**Status:** ✅ In Development (Sprint 2)

**Deskripsi:** Rich text editor untuk menulis materi pembelajaran dengan Tiptap JSON format.

**Komponen yang Dibangun:**
- Tiptap editor integration (native JSON format)
- Minimal toolbar (Bold, Italic, Headings, Lists, Links, Code)
- Real-time preview panel
- Tiptap JSON content storage dengan metadata

**Fitur:**
- Rich text editing dengan toolbar
- Markdown shortcuts support (Tiptap built-in)
- Live preview rendering (native Tiptap)
- Auto-save (future)
- Version metadata tracking
- Native JSON structure (no conversion needed)

---

#### 3. Student Learn Page
**Status:** ✅ In Development (Sprint 2)

**Deskripsi:** Interface untuk siswa membaca konten dan track progress.

**Komponen yang Dibangun:**
- Section navigation sidebar
- Lesson content viewer (Tiptap renderer)
- Progress tracking UI
- "Mark as Complete" button

**Fitur:**
- Browse sections dan lessons
- Read rich text content dengan syntax highlighting (Tiptap renderer)
- Mark lesson as complete (manual)
- View course completion percentage
- Resume from last lesson

---

#### 4. Progress Tracking System
**Status:** ✅ In Development (Sprint 2)

**Deskripsi:** Sistem pelacakan kemajuan belajar siswa.

**Komponen yang Dibangun:**
- LessonProgress model (per lesson per user)
- CourseCompletion model (per course per user)
- Progress calculation logic
- Persistent storage di database

**Fitur:**
- Track lesson completion status
- Calculate course completion percentage
- Persist progress across sessions
- Resume learning from last position

---

### 🔄 Sprint 3+: Advanced Features (Planned)

#### 5. Quiz Builder & Assessment
**Status:** 🔜 Planned (Sprint 3)

**Deskripsi:** Interface untuk membuat dan mengelola quiz.

**Komponen yang Akan Dibangun:**
- Multiple choice question builder
- Quiz scoring engine
- AI feedback integration (LangServe)
- Quiz progress tracking

**Fitur:**
- Create quiz dengan multiple questions
- Set passing threshold (default 70%)
- Automatic scoring
- AI-powered feedback
- Review flow untuk failed quizzes

---

#### 6. Video Content Support
**Status:** 🔜 Planned (Sprint 3+)

**Deskripsi:** Support untuk video content dalam lessons.

**Komponen yang Akan Dibangun:**
- Video upload interface
- Video player dengan controls
- Video progress tracking
- Subtitle support

**Fitur:**
- Upload video files
- Embed video URLs (YouTube, Vimeo)
- Track video watch progress
- Video playback controls
- Subtitle/caption support

---

#### 7. GitHub Integration
**Status:** 🔜 Planned (Sprint 4+)

**Deskripsi:** Integrasi dengan GitHub untuk version control dan backup.

**Komponen yang Akan Dibangun:**
- GitHub API integration
- Auto-commit on save
- Pull request workflow
- Webhook handlers

**Fitur:**
- Auto-sync content to GitHub
- Version control untuk content
- Backup dan restore
- Collaborative editing support

---

#### 8. Publish & Review Workflow
**Status:** 🔜 Planned (Sprint 4+)

**Deskripsi:** Workflow publikasi dengan review dan approval.

**Komponen yang Akan Dibangun:**
- Submit for review interface
- Admin review dashboard
- Approval/rejection workflow
- Status tracking

**Fitur:**
- Submit course for review
- Admin can review and approve
- Status: Draft, Pending Review, Published
- Notification system

---

## 📊 Implementation Status

### Sprint 2 Progress

| Feature | Status | Progress |
|---------|--------|----------|
| Database Schema | 🔄 In Progress | 0% |
| API Routes | ⏳ Not Started | 0% |
| Creator Dashboard Update | ⏳ Not Started | 0% |
| Student Learn Page | ⏳ Not Started | 0% |
| Tiptap Editor | ⏳ Not Started | 0% |
| Progress Tracking | ⏳ Not Started | 0% |

### Future Sprints

| Feature | Sprint | Status |
|---------|--------|--------|
| Quiz System | Sprint 3 | 🔜 Planned |
| Video Content | Sprint 3+ | 🔜 Planned |
| GitHub Integration | Sprint 4+ | 🔜 Planned |
| Publish Workflow | Sprint 4+ | 🔜 Planned |
| Drag-drop Reordering | Sprint 4+ | 🔜 Planned |
| Image Upload | Sprint 4+ | 🔜 Planned |

---

## 🎨 UI/UX Guidelines

### Dashboard Layout
```
- Card-based course list dengan filter (difficulty, status)
- Quick actions: Create course, View details
- Stats summary: Total courses, Published, Drafts
- Responsive: Stack cards pada mobile
```

### Editor Layout
```
- 3-column layout: Structure | Editor | Preview
- Structure panel: Drag-drop sections/items
- Editor panel: Full-screen markdown editor
- Preview panel: Sticky right panel
- Split-view untuk wide screen
```

### Keyboard Shortcuts
```
- Ctrl+S: Save & sync ke GitHub
- Ctrl+P: Preview toggle
- Ctrl+/: Command palette
- Ctrl+K: Insert link
- Ctrl+I: Insert image
```

---

## 🚀 API Endpoints

### Sprint 2: Implemented Endpoints

#### Course Structure Management
```
GET    /api/courses/[slug]/sections
       - List semua sections dalam course
       - Response: Array of sections dengan order

POST   /api/courses/[slug]/sections
       - Create section baru
       - Body: { title, description, order }
       - Response: Created section object

PUT    /api/courses/[slug]/sections/[sectionId]
       - Update section (title, description, order)
       - Body: { title?, description?, order? }
       - Response: Updated section object

DELETE /api/courses/[slug]/sections/[sectionId]
       - Hapus section dan semua lessons di dalamnya
       - Response: Success message
```

#### Lesson Management
```
GET    /api/courses/[slug]/sections/[sectionId]/lessons
       - List semua lessons dalam section
       - Response: Array of lessons dengan order

POST   /api/courses/[slug]/sections/[sectionId]/lessons
       - Create lesson baru
       - Body: { title, content: { content: TiptapJSON, version, lastEdit }, order }
       - Response: Created lesson object

GET    /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
       - Get lesson detail dengan content
       - Response: Lesson object dengan full content

PUT    /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
       - Update lesson (title, content, order)
       - Body: { title?, content?, order? }
       - Response: Updated lesson object

DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
       - Hapus lesson
       - Response: Success message
```

#### Progress Tracking
```
POST   /api/progress/lesson/[lessonId]/complete
       - Mark lesson sebagai complete
       - Body: { userId } (dari auth)
       - Response: Updated progress object

GET    /api/progress/course/[slug]
       - Get course completion untuk user
       - Response: { percentage, completedLessons, totalLessons, completed }

GET    /api/progress/lesson/[lessonId]
       - Get lesson progress status untuk user
       - Response: { completed, completedAt }
```

### Sprint 3+: Planned Endpoints

#### Quiz Management (Sprint 3)
```
POST   /api/courses/[slug]/lessons/[lessonId]/quiz
       - Create quiz untuk lesson
       - Body: { title, threshold, questions[] }

GET    /api/quizzes/[quizId]
       - Get quiz dengan questions

POST   /api/quizzes/[quizId]/submit
       - Submit quiz answers
       - Body: { answers[] }
       - Response: { score, passed, feedback }
```

#### GitHub Integration (Sprint 4+)
```
POST   /api/cms/github/sync
       - Manual sync ke GitHub
       - Body: { courseId }

POST   /api/cms/github/webhook
       - GitHub webhook handler
       - Body: GitHub webhook payload

GET    /api/cms/github/status
       - Cek status GitHub connection
       - Response: { connected, lastSync, repo }
```

---

## 🔗 Data Storage

### Sprint 2: Database-First Approach

#### Content Storage Structure (Tiptap JSON Format)
```json
{
  "content": {
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 1 },
        "content": [{ "type": "text", "text": "Heading" }]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Content here with " },
          { "type": "text", "marks": [{ "type": "bold" }], "text": "bold" },
          { "type": "text", "text": " and " },
          { "type": "text", "marks": [{ "type": "italic" }], "text": "italic" },
          { "type": "text", "text": "..." }
        ]
      }
    ]
  },
  "version": 1,
  "lastEdit": "2026-03-07T10:00:00Z"
}
```

**Keuntungan:**
- Fast access (no external API calls)
- Native Tiptap format (no conversion needed)
- Future-proof for advanced features (tables, embeds)
- Type-safe structure validation
- Built-in versioning metadata
- Easy to extend with custom nodes

**Database Schema (Prisma):**
```prisma
model Section {
  id          String   @id @default(uuid())
  courseId    String
  order       Int
  title       String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  course      Course   @relation(fields: [courseId], references: [id])
  lessons     Lesson[]
}

model Lesson {
  id          String   @id @default(uuid())
  sectionId   String
  order       Int
  title       String
  content     Json     // Tiptap JSON structure with metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  section     Section   @relation(fields: [sectionId], references: [id])
  progress    LessonProgress[]
}

model LessonProgress {
  id          String   @id @default(uuid())
  lessonId    String
  userId      String
  completed   Boolean  @default(false)
  completedAt DateTime?
  createdAt   DateTime @default(now())
  
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  
  @@unique([lessonId, userId])
}

model CourseCompletion {
  id           String   @id @default(uuid())
  courseId     String
  userId       String
  percentage   Float    @default(0)
  completed    Boolean  @default(false)
  completedAt  DateTime?
  createdAt    DateTime @default(now())
  
  @@unique([courseId, userId])
}
```

#### Tiptap JSON Structure Detail

**TypeScript Interfaces:**
```typescript
// Main content wrapper
interface LessonContent {
  content: TiptapDocument    // Native Tiptap JSON structure
  version: number            // Incremental version (1, 2, 3, ...)
  lastEdit: string           // ISO 8601 timestamp
}

// Tiptap document structure
interface TiptapDocument {
  type: 'doc'
  content: TiptapNode[]
}

// Node types supported in Sprint 2
type TiptapNode = 
  | ParagraphNode 
  | HeadingNode 
  | BulletListNode 
  | OrderedListNode
  | CodeBlockNode
  | TextNode

interface ParagraphNode {
  type: 'paragraph'
  content?: TiptapInlineNode[]
}

interface HeadingNode {
  type: 'heading'
  attrs: { level: 1 | 2 | 3 }
  content?: TiptapInlineNode[]
}

interface BulletListNode {
  type: 'bulletList'
  content: ListItemNode[]
}

interface OrderedListNode {
  type: 'orderedList'
  content: ListItemNode[]
}

interface ListItemNode {
  type: 'listItem'
  content: TiptapNode[]
}

interface CodeBlockNode {
  type: 'codeBlock'
  attrs?: { language?: string }
  content?: TextNode[]
}

interface TextNode {
  type: 'text'
  text: string
  marks?: Mark[]
}

interface Mark {
  type: 'bold' | 'italic' | 'code' | 'link'
  attrs?: { href?: string }  // For links
}
```

**Example: Complete Lesson Content**
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
          { "type": "text", "text": ". It is the standard markup language for web pages." }
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
        "type": "codeBlock",
        "attrs": { "language": "html" },
        "content": [
          { 
            "type": "text", 
            "text": "<html>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>" 
          }
        ]
      }
    ]
  },
  "version": 1,
  "lastEdit": "2026-03-07T14:30:00Z"
}
```

**Validation Rules:**
1. Root must be `{ type: 'doc', content: [...] }`
2. Version must be positive integer
3. LastEdit must be valid ISO 8601 timestamp
4. All nodes must have valid `type` field
5. Heading level must be 1, 2, or 3
6. Text nodes with marks must have valid mark types

### Sprint 4+: Hybrid Approach (Planned)

#### Markdown to Tiptap JSON Conversion (For Seed Script)

**Conversion Strategy:**

Untuk Task 1.6 (seed script), kita perlu convert markdown files yang ada di `docs/course/AI-Fluency/` ke format Tiptap JSON.

**Tools & Libraries:**
```typescript
// Recommended approach: Use @tiptap/core with markdown extension
import { generateJSON } from '@tiptap/html'
import { marked } from 'marked'

// Or use unified/remark ecosystem
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkToTiptap from 'remark-tiptap'  // Custom transformer
```

**Conversion Flow:**
```
Markdown File → Parse → AST → Transform → Tiptap JSON → Wrap with Metadata → Database
```

**Example Conversion Function:**
```typescript
import { generateJSON } from '@tiptap/html'
import { marked } from 'marked'
import StarterKit from '@tiptap/starter-kit'

async function convertMarkdownToTiptap(markdown: string): Promise<LessonContent> {
  // Step 1: Convert markdown to HTML
  const html = marked(markdown)
  
  // Step 2: Convert HTML to Tiptap JSON using Tiptap's parser
  const tiptapJSON = generateJSON(html, [StarterKit])
  
  // Step 3: Wrap with metadata
  return {
    content: tiptapJSON,
    version: 1,
    lastEdit: new Date().toISOString()
  }
}

// Usage in seed script
const markdownContent = await fs.readFile('docs/course/AI-Fluency/section-1/01-lesson.md', 'utf-8')
const lessonContent = await convertMarkdownToTiptap(markdownContent)

await prisma.lesson.create({
  data: {
    title: 'Lesson Title',
    content: lessonContent,  // Stored as JSON
    order: 1,
    sectionId: section.id
  }
})
```

**Supported Markdown Syntax (Sprint 2):**
```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`inline code`

- Bullet list item 1
- Bullet list item 2

1. Ordered list item 1
2. Ordered list item 2

[Link text](https://example.com)

```javascript
// Code block
const x = 10
```
```

**Conversion Mapping:**

| Markdown | Tiptap JSON Node |
|----------|------------------|
| `# Heading` | `{ type: 'heading', attrs: { level: 1 } }` |
| `**bold**` | `{ type: 'text', marks: [{ type: 'bold' }] }` |
| `*italic*` | `{ type: 'text', marks: [{ type: 'italic' }] }` |
| `` `code` `` | `{ type: 'text', marks: [{ type: 'code' }] }` |
| `- item` | `{ type: 'bulletList', content: [...] }` |
| `1. item` | `{ type: 'orderedList', content: [...] }` |
| `[text](url)` | `{ type: 'text', marks: [{ type: 'link', attrs: { href: 'url' } }] }` |
| ` ```code``` ` | `{ type: 'codeBlock', content: [...] }` |

---

## 🎨 Frontend Rendering Strategy

### How to Display Tiptap JSON in Frontend

**CRITICAL: This section clarifies how stored Tiptap JSON is rendered in the frontend.**

### Option 1: EditorContent Component (Read-Only) ✅ RECOMMENDED

**For Student Learn Page:**
```typescript
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function LessonViewer({ lesson }: { lesson: LessonContent }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content,  // Tiptap JSON from database
    editable: false,          // Read-only mode for students
  })

  return <EditorContent editor={editor} />
}
```

**Why This Approach?**
- ✅ Native Tiptap rendering (same engine as editor)
- ✅ WYSIWYG consistency (creator preview = student view)
- ✅ Automatic handling of all node types
- ✅ Built-in styling and formatting
- ✅ No manual HTML parsing needed
- ✅ Same extensions as editor (StarterKit)

### Option 2: generateHTML() for Static Rendering

**For Server-Side Rendering or Email:**
```typescript
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'

function LessonStaticView({ lesson }: { lesson: LessonContent }) {
  const html = generateHTML(lesson.content, [StarterKit])
  
  return (
    <div 
      className="tiptap-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

**When to Use:**
- Email notifications (no React components)
- RSS feeds
- PDF export
- Static site generation (SSG)

### Complete Rendering Flow

**Creator Workflow:**
```
1. Open Editor:
   <TiptapEditor content={existingJSON} editable={true} />

2. Edit content in Tiptap editor

3. Save:
   const json = editor.getJSON()
   POST /api/lessons → Save to database
```

**Student Workflow:**
```
1. Fetch Lesson:
   GET /api/lessons/[id]
   Response: { content: TiptapJSON, version, lastEdit }

2. Display:
   <EditorContent 
     editor={useEditor({
       content: lesson.content,
       editable: false  // Read-only
     })} 
   />

3. Tiptap automatically renders JSON → HTML
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│           Creator Workflow                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐                          │
│  │  Tiptap Editor   │                          │
│  │  (editable:true) │                          │
│  └────────┬─────────┘                          │
│           │                                     │
│           │ editor.getJSON()                    │
│           ▼                                     │
│  ┌──────────────────┐                          │
│  │   API POST       │                          │
│  │   Save to DB     │                          │
│  │  (Tiptap JSON)   │                          │
│  └──────────────────┘                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│           Student Workflow                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐                          │
│  │   API GET        │                          │
│  │   Fetch JSON     │                          │
│  └────────┬─────────┘                          │
│           │                                     │
│           │ lesson.content (Tiptap JSON)        │
│           ▼                                     │
│  ┌──────────────────┐                          │
│  │  EditorContent   │                          │
│  │ (editable:false) │                          │
│  │                  │                          │
│  │ Tiptap Engine    │                          │
│  │ Renders JSON →   │                          │
│  │ HTML (automatic) │                          │
│  └──────────────────┘                          │
└─────────────────────────────────────────────────┘
```

### Package Installation

**Required Packages for Sprint 2:**
```bash
# Core Tiptap packages
yarn add @tiptap/react @tiptap/starter-kit @tiptap/pm

# For HTML generation (optional, for email/RSS)
yarn add @tiptap/html

# For markdown export (optional, future feature)
yarn add tiptap-markdown
```

### Component Implementation Examples

**Creator Editor Component:**
```typescript
// app/creator/components/LessonEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

interface LessonEditorProps {
  initialContent?: TiptapDocument
  onSave: (content: LessonContent) => Promise<void>
}

export function LessonEditor({ initialContent, onSave }: LessonEditorProps) {
  const [version, setVersion] = useState(1)
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: true,
  })

  const handleSave = async () => {
    if (!editor) return
    
    const content: LessonContent = {
      content: editor.getJSON(),
      version: version + 1,
      lastEdit: new Date().toISOString()
    }
    
    await onSave(content)
    setVersion(v => v + 1)
  }

  return (
    <div className="lesson-editor">
      <div className="editor-toolbar">
        {/* Toolbar buttons */}
      </div>
      <EditorContent editor={editor} className="editor-content" />
      <button onClick={handleSave} className="save-button">
        Save Lesson
      </button>
    </div>
  )
}
```

**Student Viewer Component:**
```typescript
// app/learn/components/LessonViewer.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface LessonViewerProps {
  lesson: LessonContent
}

export function LessonViewer({ lesson }: LessonViewerProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content,
    editable: false,  // Read-only mode
  })

  if (!editor) return <div>Loading...</div>

  return (
    <div className="lesson-viewer">
      <EditorContent editor={editor} className="lesson-content" />
      <div className="lesson-meta">
        <span>Version: {lesson.version}</span>
        <span>Last updated: {new Date(lesson.lastEdit).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
```

### Styling Tiptap Content

**CSS for Consistent Rendering:**
```css
/* styles/tiptap.css */
.tiptap {
  padding: 1rem;
  line-height: 1.6;
  color: #333;
}

.tiptap h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.tiptap h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.tiptap h3 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.tiptap p {
  margin-bottom: 1rem;
}

.tiptap ul,
.tiptap ol {
  padding-left: 2rem;
  margin-bottom: 1rem;
}

.tiptap li {
  margin-bottom: 0.5rem;
}

.tiptap code {
  background-color: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.tiptap pre {
  background-color: #282c34;
  color: #abb2bf;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.tiptap pre code {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.tiptap a {
  color: #3b82f6;
  text-decoration: underline;
}

.tiptap a:hover {
  color: #2563eb;
}

.tiptap strong {
  font-weight: bold;
}

.tiptap em {
  font-style: italic;
}
```

### Rendering Strategy Summary

| Scenario | Method | Component | Editable | Use Case |
|----------|--------|-----------|----------|----------|
| Creator Editor | useEditor() | EditorContent | ✅ true | Edit lessons |
| Student Viewer | useEditor() | EditorContent | ❌ false | Read lessons |
| Email/RSS | generateHTML() | dangerouslySetInnerHTML | N/A | Static export |
| Search Index | editor.getText() | N/A | N/A | Full-text search |
| Preview | useEditor() | EditorContent | ❌ false | Creator preview |

### Best Practices

**✅ DO:**
- Use `EditorContent` with `editable: false` for student view
- Use same extensions (StarterKit) for creator and student
- Apply consistent CSS styling to `.tiptap` class
- Store Tiptap JSON in database (not HTML or markdown)

**❌ DON'T:**
- Manually parse JSON to HTML (use Tiptap engine)
- Convert to markdown for display (use native JSON)
- Use different extensions for creator vs student
- Store HTML in database (store JSON instead)

### Export Methods Reference

```typescript
// Get as Tiptap JSON (for storage)
const json = editor.getJSON()

// Get as HTML (for email/RSS)
const html = editor.getHTML()

// Get as plain text (for search)
const text = editor.getText()

// Get as markdown (requires extension, future)
import Markdown from 'tiptap-markdown'
const markdown = editor.storage.markdown.getMarkdown()
```

### Clear Use Case Separation

**CRITICAL: When to Use Which Approach**

This section provides explicit guidance for developers implementing the frontend rendering.

#### Decision Tree

```
Need to display Tiptap JSON content?
│
├─ Is it for a React component? (Student Learn Page, Creator Preview)
│  └─ ✅ USE: EditorContent with editable: false
│     - Same rendering engine as editor
│     - WYSIWYG consistency guaranteed
│     - Automatic node type handling
│
├─ Is it for static export? (Email, RSS, PDF)
│  └─ ✅ USE: generateHTML()
│     - Converts JSON → HTML string
│     - No React components needed
│     - Use with dangerouslySetInnerHTML
│
└─ Is it for search indexing or preview text?
   └─ ✅ USE: editor.getText()
      - Extracts plain text only
      - No formatting, just content
```

#### Specific Implementation Scenarios

**Scenario 1: Student Learn Page (PRIMARY USE CASE)**
```typescript
// ✅ CORRECT APPROACH
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function StudentLessonView({ lesson }: { lesson: LessonContent }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content,  // Tiptap JSON from database
    editable: false,          // Read-only for students
  })

  return (
    <div className="student-lesson">
      <h1>{lesson.title}</h1>
      <EditorContent editor={editor} />
      <button onClick={handleMarkComplete}>Mark as Complete</button>
    </div>
  )
}

// ❌ WRONG APPROACH - Don't do this
function StudentLessonViewWrong({ lesson }: { lesson: LessonContent }) {
  const html = generateHTML(lesson.content, [StarterKit])
  return <div dangerouslySetInnerHTML={{ __html: html }} />
  // Why wrong? Loses Tiptap's native rendering benefits
}
```

**Scenario 2: Creator Editor Page**
```typescript
// ✅ CORRECT APPROACH
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function CreatorLessonEditor({ lesson }: { lesson: LessonContent }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content,
    editable: true,  // Editable for creators
  })

  const handleSave = async () => {
    const json = editor.getJSON()  // Get native Tiptap JSON
    await saveLessonToDatabase(json)
  }

  return (
    <div className="creator-editor">
      <EditorContent editor={editor} />
      <button onClick={handleSave}>Save</button>
    </div>
  )
}
```

**Scenario 3: Creator Preview Panel (Side-by-Side)**
```typescript
// ✅ CORRECT APPROACH - Same as student view
function CreatorPreviewPanel({ content }: { content: TiptapDocument }) {
  const previewEditor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,  // Read-only preview
  })

  return (
    <div className="preview-panel">
      <h3>Preview (Student View)</h3>
      <EditorContent editor={previewEditor} />
    </div>
  )
}
```

**Scenario 4: Email Notification (Static Export)**
```typescript
// ✅ CORRECT APPROACH
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'

async function sendLessonUpdateEmail(lesson: LessonContent, userEmail: string) {
  // Convert Tiptap JSON to HTML string
  const htmlContent = generateHTML(lesson.content, [StarterKit])
  
  await sendEmail({
    to: userEmail,
    subject: `New Lesson: ${lesson.title}`,
    html: `
      <div style="font-family: sans-serif;">
        <h1>${lesson.title}</h1>
        ${htmlContent}
      </div>
    `
  })
}
```

**Scenario 5: Search Indexing**
```typescript
// ✅ CORRECT APPROACH
import { generateText } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

function indexLessonForSearch(lesson: LessonContent) {
  // Extract plain text for search indexing
  const plainText = generateText(lesson.content, [StarterKit])
  
  return {
    id: lesson.id,
    title: lesson.title,
    content: plainText,  // Plain text only, no formatting
    searchableText: `${lesson.title} ${plainText}`
  }
}
```

#### Implementation Checklist

**For Student Learn Page Developer:**
- [ ] Import `useEditor` and `EditorContent` from `@tiptap/react`
- [ ] Import `StarterKit` from `@tiptap/starter-kit`
- [ ] Fetch lesson content from API (returns Tiptap JSON)
- [ ] Create editor with `editable: false`
- [ ] Pass `lesson.content` to editor
- [ ] Render with `<EditorContent editor={editor} />`
- [ ] Apply `.tiptap` CSS class for styling
- [ ] Test that formatting matches creator preview

**For Creator Editor Developer:**
- [ ] Import `useEditor` and `EditorContent` from `@tiptap/react`
- [ ] Import `StarterKit` from `@tiptap/starter-kit`
- [ ] Create editor with `editable: true`
- [ ] Load existing content with `content: lesson.content`
- [ ] On save, use `editor.getJSON()` to get Tiptap JSON
- [ ] Send JSON to API endpoint
- [ ] Implement preview panel with separate editor instance (`editable: false`)

**For Email/Static Export Developer:**
- [ ] Import `generateHTML` from `@tiptap/html`
- [ ] Import `StarterKit` from `@tiptap/starter-kit`
- [ ] Call `generateHTML(lesson.content, [StarterKit])`
- [ ] Use resulting HTML string in email template
- [ ] Apply inline CSS styles for email compatibility

#### Common Mistakes to Avoid

**❌ Mistake 1: Using generateHTML() for Student View**
```typescript
// ❌ DON'T DO THIS
function StudentView({ lesson }) {
  const html = generateHTML(lesson.content, [StarterKit])
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

// ✅ DO THIS INSTEAD
function StudentView({ lesson }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content,
    editable: false
  })
  return <EditorContent editor={editor} />
}
```

**❌ Mistake 2: Converting to Markdown for Display**
```typescript
// ❌ DON'T DO THIS
function StudentView({ lesson }) {
  const markdown = convertTiptapToMarkdown(lesson.content)
  return <ReactMarkdown>{markdown}</ReactMarkdown>
}

// ✅ DO THIS INSTEAD
function StudentView({ lesson }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content,
    editable: false
  })
  return <EditorContent editor={editor} />
}
```

**❌ Mistake 3: Manually Parsing JSON to HTML**
```typescript
// ❌ DON'T DO THIS
function StudentView({ lesson }) {
  const html = manuallyParseNodes(lesson.content.content)
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

// ✅ DO THIS INSTEAD
function StudentView({ lesson }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content,
    editable: false
  })
  return <EditorContent editor={editor} />
}
```

#### Why This Matters

**WYSIWYG Consistency:**
- Creator sees content in Tiptap editor
- Student sees content in Tiptap renderer (same engine)
- Result: Perfect visual consistency

**Maintenance:**
- Single source of truth (Tiptap engine)
- No custom parsing logic to maintain
- Automatic support for new node types

**Performance:**
- Tiptap optimized for rendering
- No unnecessary conversions
- Efficient DOM updates

#### Final Recommendation

**For 99% of use cases in Sprint 2:**
- ✅ Use `EditorContent` with `editable: false` for student view
- ✅ Use `EditorContent` with `editable: true` for creator editor
- ✅ Use same `StarterKit` extensions for both

**Only use `generateHTML()` when:**
- Sending emails (no React components)
- Generating RSS feeds
- Creating PDF exports
- Server-side rendering without React

---

### Sprint 4+: Hybrid Approach (Planned)

#### GitHub Repository Structure
```
maguru-course-content/
├── courses/
│   ├── [course-slug]/
│   │   ├── metadata.json
│   │   ├── section-01/
│   │   │   ├── lesson-01.md
│   │   │   ├── lesson-02.md
│   │   │   └── quiz-01.json
│   │   ├── section-02/
│   │   └── assets/
│   │       ├── images/
│   │       └── videos/
│   └── README.md
```

**Workflow:**
1. Creator edits content di web editor
2. Content saved to database (primary)
3. Background job syncs to GitHub (backup)
4. GitHub webhook updates database on external changes

---

## 📝 Error Handling

### GitHub Errors
```
Token Invalid/Expired → Prompt generate new token
Repository Not Found → Redirect ke setup page
Commit Failed → Show error, allow retry
Rate Limit Exceeded → Queue request, retry with backoff
Merge Conflict → Show diff, allow manual resolve
```

### Concurrent Editing
```
Lock table di Supabase (course_locks):
- Acquire lock saat buka editor
- Show: "Sedang diedit oleh {user}" jika locked
- Release lock saat close/simpan
- Auto-release setelah 5 menit inactivity
```

---

## 🎯 Checklist Implementasi

### ✅ Sprint 2: Content First (In Progress)

#### Phase 1: Database Schema
- [ ] Buat Section model di Prisma schema
- [ ] Buat Lesson model di Prisma schema
- [ ] Buat LessonProgress model di Prisma schema
- [ ] Buat CourseCompletion model di Prisma schema
- [ ] Update Course model dengan Section relation
- [ ] Run Prisma migration
- [ ] Create seed script untuk testing data

#### Phase 2: Backend API
- [ ] Section CRUD endpoints
  - [ ] POST /api/courses/[slug]/sections
  - [ ] GET /api/courses/[slug]/sections
  - [ ] PUT /api/courses/[slug]/sections/[sectionId]
  - [ ] DELETE /api/courses/[slug]/sections/[sectionId]
- [ ] Lesson CRUD endpoints
  - [ ] POST /api/courses/[slug]/sections/[sectionId]/lessons
  - [ ] GET /api/courses/[slug]/sections/[sectionId]/lessons
  - [ ] GET /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
  - [ ] PUT /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
  - [ ] DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
- [ ] Progress tracking endpoints
  - [ ] POST /api/progress/lesson/[lessonId]/complete
  - [ ] GET /api/progress/course/[slug]
  - [ ] GET /api/progress/lesson/[lessonId]

#### Phase 3: Frontend Components
- [ ] Creator Dashboard updates
  - [ ] Section list component
  - [ ] Section create/edit form
  - [ ] Lesson list component
  - [ ] Lesson create/edit form
  - [ ] Tiptap editor integration
  - [ ] Preview panel
  - [ ] Reorder up/down buttons
- [ ] Student Learn Page
  - [ ] Section navigation sidebar
  - [ ] Lesson content viewer
  - [ ] Markdown renderer dengan syntax highlighting
  - [ ] "Mark as Complete" button
  - [ ] Progress bar component
  - [ ] Course completion tracker

#### Phase 4: Testing & Polish
- [ ] Unit tests untuk API routes
- [ ] Integration tests untuk CRUD operations
- [ ] E2E tests untuk creator workflow
- [ ] E2E tests untuk student learning flow
- [ ] Performance testing
- [ ] UI/UX polish

---

### 🔜 Sprint 3: Quiz & Assessment (Planned)

#### Phase 1: Quiz System
- [ ] Quiz database schema
- [ ] QuizQuestion dan QuizAnswer models
- [ ] Quiz CRUD endpoints
- [ ] Quiz builder UI
- [ ] Quiz taking interface
- [ ] Scoring engine

#### Phase 2: AI Integration
- [ ] LangServe integration untuk feedback
- [ ] Hint system dengan cooldown
- [ ] Review flow untuk failed quizzes

---

### 🔜 Sprint 4+: Advanced Features (Planned)

#### Video Content
- [ ] Video upload support
- [ ] Video player integration
- [ ] Video progress tracking

#### GitHub Integration
- [ ] GitHub API setup
- [ ] Auto-sync workflow
- [ ] Webhook handlers
- [ ] Version control UI

#### Advanced Editor
- [ ] Image upload
- [ ] Table support
- [ ] Drag-drop reordering
- [ ] Collaborative editing

---

## 📚 Referensi

### Internal Documentation
- Sprint 2 Task List: `docs/task/sprint-2.md`
- Sprint 2 Description: `docs/rules/desc.md`
- Technical Decisions: `docs/rules/task.md`
- Project Requirements: `docs/rules/project.md`
- Architecture Overview: `CLAUDE.md`

### Sprint Planning
- Sprint 3 (Quiz): `docs/task/sprint-3.md`
- Quiz Feature Spec: `docs/feat/quiz.md`

### External Resources
- Prisma Documentation: https://www.prisma.io/docs
- Supabase Documentation: https://supabase.com/docs
- Tiptap Editor: https://tiptap.dev/
- Next.js App Router: https://nextjs.org/docs/app
- Markdown Guide: https://www.markdownguide.org/

---

## 📊 Development Timeline

| Sprint | Focus | Duration | Status |
|--------|-------|----------|--------|
| Sprint 1 | Foundation & Auth | 2 weeks | ✅ Completed |
| Sprint 2 | Content Structure | 3 weeks | 🔄 In Progress |
| Sprint 3 | Quiz & Assessment | 3 weeks | 🔜 Planned |
| Sprint 4 | Video & GitHub | 3 weeks | 🔜 Planned |
| Sprint 5 | Polish & Launch | 2 weeks | 🔜 Planned |

---

## 🎯 Success Metrics

### Sprint 2 Goals

**Creator Metrics:**
- Creator dapat membuat minimal 3 sections per course
- Creator dapat membuat minimal 10 lessons per course
- Editor response time < 100ms
- Content save success rate > 99%

**Student Metrics:**
- Student dapat navigate sections dengan mudah
- Lesson load time < 500ms
- Progress tracking accuracy 100%
- Progress persistence across sessions 100%

**Technical Metrics:**
- API response time < 200ms (p95)
- Database query performance < 50ms
- Zero data loss on content save
- Mobile responsive (100% features work on mobile)

---

## 🔄 Iterasi & Feedback

### Sprint 2 Learnings (To be updated)

**What Went Well:**
- TBD after Sprint 2 completion

**What Can Be Improved:**
- TBD after Sprint 2 completion

**Action Items:**
- TBD after Sprint 2 completion

---

**Dokumentasi dibuat**: 2026-03-06  
**Terakhir diupdate**: 2026-03-07  
**Versi**: 2.0 (Updated for Sprint 2)  
**Status**: In Development - Sprint 2 Active
