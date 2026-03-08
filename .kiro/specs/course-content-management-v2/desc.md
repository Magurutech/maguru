# Sprint 2: Content First - Deskripsi & Hasil Brainstorming

**Tanggal:** 2026-03-07  
**Status:** Ready untuk Implementation  
**Prioritas:** P1 (Highest)

---

## 📖 Apa itu Sprint 2?

Sprint 2 adalah fase pengembangan kedua dari platform Maguru yang berfokus pada **struktur konten pembelajaran**. Tujuan utamanya adalah memungkinkan creator membuat materi pembelajaran yang terstruktur dan siswa dapat belajar dengan sistematis.

### Analogi Sederhana

Bayangkan Anda membuat sebuah buku:
- **Course** = Buku
- **Section** = Bab dalam buku
- **Lesson** = Halaman-halaman dalam setiap bab
- **Content** = Isi teks di setiap halaman

Sprint 2 membangun sistem agar creator bisa menulis "buku digital" dan siswa bisa membacanya dengan mudah.

---

## 🎯 Masalah yang Diselesaikan

### Sebelum Sprint 2
- Course hanya memiliki informasi dasar (judul, deskripsi, thumbnail)
- Tidak ada struktur pembelajaran yang jelas
- Siswa tidak tahu harus belajar apa dulu
- Creator tidak bisa mengorganisir materi dengan baik
- Progress belajar tidak tercatat

### Setelah Sprint 2
- Course memiliki struktur hierarki yang jelas (Course → Section → Lesson)
- Creator bisa membuat bab-bab dan materi pembelajaran
- Siswa bisa belajar secara terstruktur dari awal sampai akhir
- Progress belajar tercatat dan tersimpan
- Siswa tahu sudah sampai mana kemajuan mereka

---

## 🏗️ Struktur Pembelajaran yang Dibangun

### 1. Course (Kursus)
**Apa itu?** Wadah utama untuk semua materi pembelajaran.

**Contoh:** "Belajar HTML untuk Pemula"

**Informasi yang ada:**
- Judul course
- Deskripsi singkat
- Kategori (Web Development, Data Science, dll)
- Tingkat kesulitan (Beginner, Intermediate, Advanced)
- Estimasi durasi belajar

---

### 2. Section (Bab/Chapter)
**Apa itu?** Pengelompokan materi berdasarkan topik atau tema.

**Contoh dalam course "Belajar HTML untuk Pemula":**
- Section 1: Pengenalan HTML
- Section 2: Tag-tag Dasar HTML
- Section 3: Membuat Form HTML
- Section 4: HTML Semantic

**Fungsi:**
- Memecah materi besar menjadi bagian-bagian kecil
- Memudahkan siswa fokus pada satu topik
- Membuat pembelajaran lebih terstruktur

---

### 3. Lesson (Materi/Pelajaran)
**Apa itu?** Unit pembelajaran terkecil yang berisi konten spesifik.

**Contoh dalam Section "Pengenalan HTML":**
- Lesson 1: Apa itu HTML?
- Lesson 2: Struktur Dasar Dokumen HTML
- Lesson 3: Cara Kerja HTML di Browser
- Lesson 4: Tools untuk Belajar HTML

**Fungsi:**
- Menyampaikan satu konsep atau skill spesifik
- Berisi konten pembelajaran (teks, penjelasan, contoh)
- Bisa diselesaikan dalam satu sesi belajar (5-15 menit)

---

### 4. Content (Konten)
**Apa itu?** Isi dari setiap lesson dalam format Tiptap JSON.

**Format:** Tiptap JSON (native editor format)

Untuk detail lengkap tentang structure, lihat section **"💾 Format Penyimpanan & Storage Strategy"** di bawah.

**Ringkasan Format:**
- Tiptap JSON (native editor format)
- Mendukung heading, bold, italic, list, code blocks, links
- Lebih future-proof dan sesuai dengan best practice Tiptap
- Mudah di-render oleh Tiptap editor tanpa konversi
- Type-safe dengan TypeScript interfaces

**Contoh Sederhana:**
```json
{
  "content": {
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 1 },
        "content": [{ "type": "text", "text": "Apa itu HTML?" }]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "HTML adalah..." }
        ]
      }
    ]
  },
  "version": 1,
  "lastEdit": "2026-03-07T14:30:00Z"
}
```

Lihat **complete example** dengan semua fitur (bold, italic, lists, code blocks, links) di section "💾 Format Penyimpanan & Storage Strategy" → "Complete Example: Real Lesson Content".

---

## 👥 Siapa yang Menggunakan Fitur Ini?

### 1. Creator (Pembuat Konten)
**Apa yang bisa dilakukan?**
- Membuat section baru dalam course mereka
- Menambah lesson ke dalam section
- Menulis konten pembelajaran dengan editor markdown
- Mengatur urutan section dan lesson
- Mengedit dan menghapus section/lesson

**Workflow Creator:**
1. Buka dashboard creator
2. Pilih course yang ingin diedit
3. Buat section baru (contoh: "Pengenalan HTML")
4. Tambah lesson ke section (contoh: "Apa itu HTML?")
5. Tulis konten lesson menggunakan editor
6. Simpan dan publish

---

### 2. Student (Siswa)
**Apa yang bisa dilakukan?**
- Melihat daftar section dalam course
- Membaca lesson satu per satu
- Menandai lesson sebagai selesai
- Melihat progress belajar mereka
- Melanjutkan dari lesson terakhir

**Workflow Student:**
1. Enroll ke course
2. Buka halaman belajar
3. Lihat daftar section dan lesson
4. Klik lesson untuk membaca konten
5. Klik "Mark as Complete" setelah selesai
6. Lanjut ke lesson berikutnya
7. Lihat progress bar (contoh: 30% selesai)

---

### 3. Admin
**Apa yang bisa dilakukan?**
- Melihat semua course dari semua creator
- Mengedit section dan lesson di course manapun
- Menghapus konten yang tidak sesuai
- Membantu creator yang kesulitan

---

## 🎨 Pengalaman Pengguna (User Experience)

### Creator Dashboard
**Tampilan:**
- List course yang sudah dibuat
- Tombol "Edit Course" untuk masuk ke editor
- Stats: jumlah section, jumlah lesson, jumlah siswa

**Editor Course:**
- Panel kiri: Daftar section dan lesson (struktur)
- Panel tengah: Tiptap editor untuk menulis konten
- Panel kanan: Preview konten (seperti yang dilihat siswa)

**Interaksi:**
- Klik "Add Section" untuk buat section baru
- Klik "Add Lesson" untuk buat lesson baru
- Klik lesson untuk edit kontennya
- Tombol up/down untuk ubah urutan
- Auto-save setiap beberapa detik

---

### Student Learn Page
**Tampilan:**
- Sidebar kiri: Daftar section dan lesson
- Area utama: Konten lesson yang sedang dibaca
- Progress bar di atas: Persentase penyelesaian
- Tombol "Mark as Complete" di bawah konten

**Interaksi:**
- Klik section untuk expand/collapse lesson list
- Klik lesson untuk membaca konten
- Scroll untuk membaca konten
- Klik "Mark as Complete" setelah selesai
- Lesson yang sudah selesai diberi tanda ✓
- Progress bar otomatis update

---

## 📊 Progress Tracking (Pelacakan Kemajuan)

### Apa yang Dilacak?

**1. Lesson Progress (Per Lesson)**
- Apakah lesson sudah dibaca?
- Kapan lesson diselesaikan?
- Status: Not Started, In Progress, Completed

**2. Course Completion (Per Course)**
- Berapa persen course sudah selesai?
- Berapa lesson yang sudah diselesaikan?
- Berapa total lesson dalam course?
- Apakah course sudah 100% selesai?

### Cara Kerja Progress

**Scenario 1: Siswa Baru**
- Enroll ke course "Belajar HTML"
- Progress: 0% (0/20 lessons completed)
- Semua lesson berstatus "Not Started"

**Scenario 2: Siswa Belajar**
- Baca Lesson 1: "Apa itu HTML?"
- Klik "Mark as Complete"
- Progress: 5% (1/20 lessons completed)
- Lesson 1 berstatus "Completed" ✓

**Scenario 3: Siswa Lanjut Belajar**
- Selesaikan 10 lessons
- Progress: 50% (10/20 lessons completed)
- 10 lessons berstatus "Completed" ✓
- 10 lessons berstatus "Not Started"

**Scenario 4: Siswa Selesai Course**
- Selesaikan semua 20 lessons
- Progress: 100% (20/20 lessons completed)
- Semua lessons berstatus "Completed" ✓
- Dapat badge/certificate (future feature)

### Persistensi Progress

**Masalah yang diselesaikan:**
- Progress tidak hilang saat logout
- Progress tidak hilang saat ganti browser
- Progress tidak hilang saat ganti device

**Solusi:**
- Progress disimpan di database
- Terhubung dengan user account (Clerk)
- Bisa diakses dari mana saja

---

## 🔄 Workflow End-to-End

### Workflow Creator: Membuat Course Lengkap

**Step 1: Persiapan**
- Login sebagai creator
- Buka creator dashboard
- Pilih course yang ingin diisi konten

**Step 2: Membuat Struktur**
- Buat Section 1: "Pengenalan HTML"
- Buat Section 2: "Tag-tag Dasar"
- Buat Section 3: "Membuat Form"

**Step 3: Mengisi Konten**
- Masuk ke Section 1
- Buat Lesson 1: "Apa itu HTML?"
- Tulis konten menggunakan Tiptap editor
- Preview konten di panel kanan
- Simpan lesson (disimpan sebagai Tiptap JSON)

**Step 4: Lanjutkan**
- Buat Lesson 2, 3, 4, dst
- Isi semua section dengan lesson
- Review keseluruhan struktur
- Publish course

---

### Workflow Student: Belajar Course

**Step 1: Mulai Belajar**
- Browse course catalog
- Pilih course "Belajar HTML"
- Klik "Enroll" atau "Start Learning"
- Masuk ke learn page

**Step 2: Navigasi**
- Lihat daftar section di sidebar
- Klik Section 1: "Pengenalan HTML"
- Lihat daftar lesson dalam section
- Klik Lesson 1: "Apa itu HTML?"

**Step 3: Belajar**
- Baca konten lesson
- Pahami materi
- Coba contoh kode (jika ada)
- Klik "Mark as Complete"

**Step 4: Lanjut**
- Otomatis pindah ke Lesson 2
- Atau klik lesson berikutnya di sidebar
- Ulangi proses belajar
- Lihat progress bar bertambah

**Step 5: Selesai**
- Selesaikan semua lesson
- Progress mencapai 100%
- Dapat notifikasi "Course Completed!"
- Bisa review materi kapan saja

---

## 💾 Format Penyimpanan & Storage Strategy

### Keputusan: Tiptap JSON Native Format

**Primary Storage Format: Tiptap JSON**

Semua lesson content disimpan dalam format Tiptap JSON native di database. Ini adalah keputusan final untuk Sprint 2 dan seterusnya.

**Format yang Digunakan:**
```json
{
  "content": {
    "type": "doc",
    "content": [
      { "type": "heading", "attrs": { "level": 1 }, "content": [...] },
      { "type": "paragraph", "content": [...] }
    ]
  },
  "version": 1,
  "lastEdit": "2026-03-07T14:30:00Z"
}
```

### TypeScript Interface Definitions

**Complete Type Definitions:**
```typescript
// ============================================
// Main Content Wrapper
// ============================================
interface LessonContent {
  content: TiptapDocument    // PRIMARY: Native Tiptap JSON structure
  version: number            // Incremental version (1, 2, 3, ...)
  lastEdit: string           // ISO 8601 timestamp
}

// ============================================
// Tiptap Document Structure
// ============================================
interface TiptapDocument {
  type: 'doc'
  content: TiptapNode[]
}

// ============================================
// Node Types (Sprint 2 Support)
// ============================================
type TiptapNode = 
  | ParagraphNode 
  | HeadingNode 
  | BulletListNode 
  | OrderedListNode
  | ListItemNode
  | CodeBlockNode
  | TextNode

// Paragraph
interface ParagraphNode {
  type: 'paragraph'
  content?: TiptapInlineContent[]
}

// Heading (levels 1-3)
interface HeadingNode {
  type: 'heading'
  attrs: { level: 1 | 2 | 3 }
  content?: TiptapInlineContent[]
}

// Bullet List
interface BulletListNode {
  type: 'bulletList'
  content: ListItemNode[]
}

// Ordered List
interface OrderedListNode {
  type: 'orderedList'
  attrs?: { start?: number }
  content: ListItemNode[]
}

// List Item
interface ListItemNode {
  type: 'listItem'
  content: TiptapNode[]
}

// Code Block
interface CodeBlockNode {
  type: 'codeBlock'
  attrs?: { language?: string }
  content?: TextNode[]
}

// Text (inline content)
interface TextNode {
  type: 'text'
  text: string
  marks?: Mark[]
}

// ============================================
// Marks (Inline Formatting)
// ============================================
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

// ============================================
// Helper Types
// ============================================
type TiptapInlineContent = TextNode
```

### Mengapa Tiptap JSON (Bukan Markdown)?

**Keuntungan Tiptap JSON:**
1. **Native Format** - Tidak perlu konversi saat render di editor
2. **Future-Proof** - Mudah extend untuk fitur advanced (tables, embeds, custom nodes)
3. **Type Safety** - Structure yang jelas dan dapat divalidasi
4. **Best Practice** - Sesuai rekomendasi official Tiptap documentation
5. **Performance** - Instant rendering tanpa parsing markdown
6. **Export Flexibility** - Bisa export ke HTML, Markdown, atau format lain

**Perbandingan Format:**

| Aspek | Markdown String | Tiptap JSON |
|-------|----------------|-------------|
| Editor Rendering | Perlu convert MD→JSON | ✅ Langsung render |
| Storage Size | Lebih kecil (~30% smaller) | Sedikit lebih besar |
| Extensibility | Terbatas | ✅ Sangat flexible |
| Type Safety | ❌ Plain string | ✅ Structured object |
| Future Features | Sulit (tables, embeds) | ✅ Mudah extend |
| Human Readable | ✅ Sangat mudah | Perlu formatter |
| Export Options | ❌ Hanya markdown | ✅ HTML, MD, Text |

### Storage Structure Detail

**Database Field:**
```prisma
model Lesson {
  content  Json  // Stores complete Tiptap JSON structure
}
```

**Storage Strategy:**
- **Primary**: Tiptap JSON (always stored)
- **Backup**: Markdown string (OPTIONAL, future feature)
- **Export**: HTML via `editor.getHTML()` (on-demand, not stored)

**Why No Markdown Backup in Sprint 2?**
- Mengurangi kompleksitas
- Tiptap JSON sudah cukup untuk semua use case
- Bisa export ke markdown on-demand jika diperlukan
- Markdown backup bisa ditambahkan di Sprint 3+ jika ada kebutuhan

### Export Capabilities

**Tiptap Editor Export Methods:**
```typescript
// Get as Tiptap JSON (native)
const json = editor.getJSON()

// Get as HTML (for rendering)
const html = editor.getHTML()

// Get as plain text (for search/preview)
const text = editor.getText()

// Get as markdown (requires extension)
import Markdown from 'tiptap-markdown'
const markdown = editor.storage.markdown.getMarkdown()
```

**Use Cases:**
- **JSON** → Primary storage, editor loading
- **HTML** → Email notifications, RSS feeds, external display
- **Text** → Search indexing, preview snippets
- **Markdown** → Export feature, GitHub sync (future)

### Frontend Rendering Strategy

**IMPORTANT: How to Display Tiptap JSON in Frontend**

Ada dua cara untuk render Tiptap JSON di frontend:

#### Option 1: EditorContent Component (Read-Only Mode) ✅ RECOMMENDED

**For Student Learn Page (Recommended):**
```typescript
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function LessonViewer({ lesson }: { lesson: LessonContent }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content,  // Tiptap JSON from database
    editable: false,          // Read-only mode
  })

  return <EditorContent editor={editor} />
}
```

**Why This Approach?**
- ✅ Native Tiptap rendering (same as editor preview)
- ✅ WYSIWYG consistency (creator sees = student sees)
- ✅ Automatic handling of all node types
- ✅ Built-in styling and formatting
- ✅ No manual HTML parsing needed

#### Option 2: generateHTML() for Static Rendering

**For Server-Side Rendering or Static Export:**
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
- Static site generation

### Complete Rendering Flow

**Creator Workflow (Editor):**
```
1. Load existing content:
   <TiptapEditor content={existingJSON} editable={true} />

2. User edits content in editor

3. On save:
   const json = editor.getJSON()
   await saveToDatabase(json)
```

**Student Workflow (Viewer):**
```
1. Fetch from API:
   const lesson = await fetchLesson(lessonId)
   // Returns: { content: TiptapJSON, version, lastEdit }

2. Display with EditorContent:
   <EditorContent 
     editor={useEditor({
       content: lesson.content,
       editable: false
     })} 
   />

3. Tiptap automatically renders JSON → HTML
```

**Architecture Diagram:**
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
│  │   Save to DB     │                          │
│  │  (Tiptap JSON)   │                          │
│  └──────────────────┘                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│           Student Workflow                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐                          │
│  │   Fetch JSON     │                          │
│  │   from Database  │                          │
│  └────────┬─────────┘                          │
│           │                                     │
│           │ Pass to EditorContent               │
│           ▼                                     │
│  ┌──────────────────┐                          │
│  │  EditorContent   │                          │
│  │ (editable:false) │                          │
│  │                  │                          │
│  │ Renders JSON →   │                          │
│  │ HTML (automatic) │                          │
│  └──────────────────┘                          │
└─────────────────────────────────────────────────┘
```

### Package Installation

**Required Packages:**
```bash
# Core Tiptap packages
yarn add @tiptap/react @tiptap/starter-kit @tiptap/pm

# For HTML generation (optional, for static rendering)
yarn add @tiptap/html

# For markdown export (optional, future feature)
yarn add tiptap-markdown
```

### Component Examples

**Creator Editor Component:**
```typescript
// components/LessonEditor.tsx
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
    <div>
      <EditorContent editor={editor} />
      <button onClick={handleSave}>Save Lesson</button>
    </div>
  )
}
```

**Student Viewer Component:**
```typescript
// components/LessonViewer.tsx
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

  return (
    <div className="lesson-content">
      <EditorContent editor={editor} />
      <div className="lesson-meta">
        <span>Version: {lesson.version}</span>
        <span>Last updated: {new Date(lesson.lastEdit).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
```

### Styling Tiptap Content

**CSS for Tiptap Content:**
```css
/* styles/tiptap.css */
.tiptap {
  /* Base styles */
  padding: 1rem;
  line-height: 1.6;
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

.tiptap code {
  background-color: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
}

.tiptap pre {
  background-color: #282c34;
  color: #abb2bf;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.tiptap a {
  color: #3b82f6;
  text-decoration: underline;
}
```

### Summary: Rendering Strategy

| Scenario | Method | Component | Editable |
|----------|--------|-----------|----------|
| Creator Editor | useEditor() | EditorContent | ✅ true |
| Student Viewer | useEditor() | EditorContent | ❌ false |
| Email/RSS | generateHTML() | dangerouslySetInnerHTML | N/A |
| Search Index | editor.getText() | N/A | N/A |

**Key Takeaway:**
- ✅ **DO**: Use `EditorContent` with `editable: false` for student view
- ❌ **DON'T**: Manually parse JSON to HTML
- ❌ **DON'T**: Use markdown conversion for display
- ✅ **DO**: Use same Tiptap engine for creator and student (WYSIWYG)

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

### Workflow: Markdown Files → Tiptap JSON

**Untuk Seed Script (Task 1.6):**
1. Baca markdown files dari `docs/course/AI-Fluency/`
2. Parse markdown menggunakan library (marked + Tiptap parser)
3. Convert ke Tiptap JSON structure
4. Wrap dengan metadata (version, lastEdit)
5. Simpan ke database

**Contoh Conversion:**
```typescript
import { generateJSON } from '@tiptap/html'
import { marked } from 'marked'
import StarterKit from '@tiptap/starter-kit'

// Input: Markdown file
const markdown = `# Heading\n\nParagraph with **bold** text.`

// Step 1: Convert markdown to HTML
const html = marked(markdown)

// Step 2: Convert HTML to Tiptap JSON
const tiptapDoc = generateJSON(html, [StarterKit])

// Step 3: Wrap with metadata
const lessonContent: LessonContent = {
  content: tiptapDoc,
  version: 1,
  lastEdit: new Date().toISOString()
}

// Output: Tiptap JSON
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
          { "type": "text", "text": "Paragraph with " },
          { "type": "text", "marks": [{ "type": "bold" }], "text": "bold" },
          { "type": "text", "text": " text." }
        ]
      }
    ]
  },
  "version": 1,
  "lastEdit": "2026-03-07T14:30:00Z"
}
```

### Validation Strategy

**Application Layer Validation:**
```typescript
function validateLessonContent(content: unknown): content is LessonContent {
  // Check structure
  if (!content || typeof content !== 'object') return false
  
  const c = content as any
  
  // Check required fields
  if (!c.content || !c.version || !c.lastEdit) return false
  
  // Check Tiptap structure
  if (c.content.type !== 'doc') return false
  if (!Array.isArray(c.content.content)) return false
  
  // Check version is positive integer
  if (!Number.isInteger(c.version) || c.version < 1) return false
  
  // Check lastEdit is valid ISO 8601
  if (isNaN(Date.parse(c.lastEdit))) return false
  
  return true
}

function validateTiptapNode(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false
  
  const n = node as any
  
  // Check type field exists
  if (!n.type || typeof n.type !== 'string') return false
  
  // Validate based on node type
  switch (n.type) {
    case 'doc':
      return Array.isArray(n.content)
    
    case 'paragraph':
    case 'heading':
      return !n.content || Array.isArray(n.content)
    
    case 'bulletList':
    case 'orderedList':
      return Array.isArray(n.content)
    
    case 'listItem':
      return Array.isArray(n.content)
    
    case 'codeBlock':
      return !n.content || Array.isArray(n.content)
    
    case 'text':
      return typeof n.text === 'string'
    
    default:
      return false
  }
}
```

### Complete Example: Real Lesson Content

**Example: "Apa itu HTML?" Lesson**
```json
{
  "content": {
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 1 },
        "content": [
          { "type": "text", "text": "Apa itu HTML?" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "HTML adalah singkatan dari " },
          { 
            "type": "text", 
            "marks": [{ "type": "bold" }], 
            "text": "HyperText Markup Language" 
          },
          { "type": "text", "text": ". HTML adalah bahasa markup yang digunakan untuk membuat struktur halaman web." }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "Fungsi HTML" }
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
                  { "type": "text", "text": "Membuat struktur konten web" }
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
                  { "type": "text", "text": "Menampilkan teks, gambar, dan link" }
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
                  { "type": "text", "text": "Dasar dari semua website" }
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
          { "type": "text", "text": "Contoh Kode HTML" }
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
          { "type": "text", "text": "Untuk mempelajari lebih lanjut, kunjungi " },
          {
            "type": "text",
            "marks": [
              {
                "type": "link",
                "attrs": {
                  "href": "https://developer.mozilla.org/en-US/docs/Web/HTML",
                  "target": "_blank"
                }
              }
            ],
            "text": "MDN Web Docs"
          },
          { "type": "text", "text": "." }
        ]
      }
    ]
  },
  "version": 1,
  "lastEdit": "2026-03-07T14:30:00Z"
}
```

### API Request/Response Format

**Create Lesson Request:**
```typescript
POST /api/courses/[slug]/sections/[sectionId]/lessons

{
  "title": "Apa itu HTML?",
  "content": {
    "content": {
      "type": "doc",
      "content": [...]  // Tiptap JSON structure
    },
    "version": 1,
    "lastEdit": "2026-03-07T14:30:00Z"
  },
  "order": 1
}
```

**Get Lesson Response:**
```typescript
GET /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]

{
  "id": "uuid",
  "title": "Apa itu HTML?",
  "content": {
    "content": {
      "type": "doc",
      "content": [...]  // Tiptap JSON structure
    },
    "version": 1,
    "lastEdit": "2026-03-07T14:30:00Z"
  },
  "order": 1,
  "sectionId": "uuid",
  "createdAt": "2026-03-07T10:00:00Z",
  "updatedAt": "2026-03-07T14:30:00Z"
}
```

---

## 🎯 Keputusan Penting dari Brainstorming

### 1. Konten Disimpan di Database dalam Format Tiptap JSON

**Keputusan:** Semua konten lesson disimpan di database dalam format Tiptap JSON (native format).

**Alasan:**
- Lebih mudah diakses dan dikelola
- Tidak perlu setup GitHub untuk creator
- Lebih cepat untuk load konten
- Mudah untuk backup dan restore
- Tiptap JSON adalah format native editor (best practice)
- Tidak perlu konversi markdown ↔ Tiptap saat render
- Lebih future-proof untuk fitur advanced (tables, embeds, dll)

**Implikasi:**
- Creator menulis langsung di Tiptap web editor
- Konten tersimpan sebagai Tiptap JSON otomatis
- Tidak perlu sync dengan GitHub (untuk sekarang)
- Seed script akan convert markdown files → Tiptap JSON

---

### 2. Editor Modern (Tiptap)

**Keputusan:** Gunakan Tiptap editor dengan fitur minimal.

**Alasan:**
- User experience lebih baik dari textarea biasa
- Toolbar untuk formatting (bold, italic, heading)
- Preview real-time
- Modern dan sesuai tahun 2026

**Fitur yang Ada:**
- Bold, Italic, Code inline
- Heading 1, 2, 3
- Ordered list dan Unordered list
- Insert link
- Code blocks

**Fitur yang Belum (Sprint 3+):**
- Upload image
- Insert table
- Advanced syntax highlighting

---

### 3. Progress Manual (Bukan Otomatis)

**Keputusan:** Siswa harus klik "Mark as Complete" untuk menandai lesson selesai.

**Alasan:**
- Lebih reliable dan jelas
- Siswa punya kontrol penuh
- Tidak ada false positive (lesson dianggap selesai padahal belum)
- Lebih sederhana untuk implementasi

**Alternatif yang Ditolak:**
- Auto-mark saat scroll ke bawah (tidak reliable)
- Auto-mark berdasarkan waktu (tidak akurat)
- Auto-mark saat pindah lesson (bisa skip)

---

### 4. Urutan dengan Integer (Bukan Drag-Drop)

**Keputusan:** Gunakan tombol up/down untuk ubah urutan section/lesson.

**Alasan:**
- Lebih sederhana untuk Sprint 2
- Tidak perlu library drag-drop
- Tetap bisa reorder dengan mudah
- Drag-drop bisa ditambah nanti

**Cara Kerja:**
- Section 1, 2, 3, 4, ...
- Klik "Move Up" untuk tukar dengan section di atasnya
- Klik "Move Down" untuk tukar dengan section di bawahnya

---

### 5. Quiz dan Video Ditunda

**Keputusan:** Sprint 2 fokus pada rich text content (Tiptap) saja.

**Alasan:**
- Mengurangi kompleksitas
- Fokus pada core structure dulu
- Quiz dan video adalah fitur besar (butuh sprint sendiri)
- Tiptap rich text editor sudah cukup untuk MVP

**Kapan Quiz dan Video?**
- Quiz: Sprint 3 (sudah direncanakan)
- Video: Sprint 3+ (setelah quiz)

---

## 📈 Manfaat Sprint 2

### Untuk Creator
✅ Bisa membuat course dengan struktur yang jelas  
✅ Bisa mengorganisir materi pembelajaran dengan baik  
✅ Bisa menulis konten dengan editor yang nyaman  
✅ Bisa melihat preview konten sebelum publish  
✅ Bisa mengatur urutan materi dengan mudah  

### Untuk Student
✅ Bisa belajar dengan struktur yang jelas  
✅ Tahu harus belajar apa dulu  
✅ Bisa track progress belajar  
✅ Tidak kehilangan progress saat logout  
✅ Bisa lanjut belajar dari lesson terakhir  

### Untuk Platform
✅ Memiliki sistem content management yang solid  
✅ Foundation untuk fitur-fitur berikutnya (quiz, video)  
✅ Data terstruktur dan mudah dikelola  
✅ Scalable untuk ribuan course dan lesson  

---

## 🚀 Apa Selanjutnya Setelah Sprint 2?

### Sprint 3: Quiz & Assessment
- Membuat quiz untuk setiap lesson
- Scoring system
- Feedback AI untuk jawaban siswa
- Review flow untuk materi yang belum dikuasai

### Sprint 3+: Video Content
- Upload video untuk lesson
- Video player dengan controls
- Video progress tracking
- Subtitle support

### Future: Advanced Features
- Collaborative editing (multiple creator)
- Version control untuk konten
- Content analytics (lesson mana yang paling sulit)
- Personalized learning path

---

## 📝 Ringkasan

Sprint 2 membangun **fondasi sistem pembelajaran** di Maguru dengan:

1. **Struktur Hierarki:** Course → Section → Lesson → Content
2. **Creator Tools:** Dashboard dan editor untuk membuat konten
3. **Student Experience:** Learn page dengan navigation dan progress tracking
4. **Progress System:** Pelacakan kemajuan belajar yang persisten

Fokus Sprint 2 adalah **simplicity dan reliability** - membangun core features yang solid sebelum menambah fitur advanced.

---

**Dokumentasi dibuat:** 2026-03-07  
**Versi:** 1.0  
**Target Audience:** Non-technical stakeholders, Product team, QA team
