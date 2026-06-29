# 🚀 Rencana Peningkatan Tiptap Editor & View Panel (Ponytail-Approved)

Dokumen ini berisi rencana taktis peningkatan editor Tiptap di Maguru yang disederhanakan berdasarkan prinsip **YAGNI (You Aren't Gonna Need It)**. Fokus kita adalah membangun fitur fungsional dengan dependensi minimal dan tanpa kode boilerplate yang tidak perlu.

---

## 🛠️ Ringkasan Fitur yang Dipertahankan & Disederhanakan

### 1. Slash ( / ) Command Notion-Style (Komponen Kustom Sederhana)
* **Penyederhanaan**: Kita **tidak akan menggunakan** pustaka eksternal `tippy.js` atau package UI komersial Tiptap.
* **Solusi Minimal**: 
  * Rancang custom extension menggunakan `@tiptap/suggestion`.
  * Merender dropdown dropdown menu React sederhana menggunakan `ReactRenderer` dari `@tiptap/react` dan memposisikannya secara absolut di `body` menggunakan koordinat `clientRect` yang disediakan Tiptap secara native.
  * Hanya dukung blok utama yang sering digunakan: Heading 1, Heading 2, Bullet List, dan Task List.

### 2. Penambahan Ekstensi Toolbar Standar (Tanpa Boilerplate)
Menambahkan ekstensi bawaan Tiptap langsung ke konfigurasi editor untuk menambah fitur esensial tanpa menulis komponen kustom baru:
* **Task List & Task Item**: Untuk checkbox list materi.
* **Horizontal Rule**: Tombol `<hr>` pemisah konten.
* **Image Resize**: Konfigurasikan `@tiptap/extension-image` agar mendukung pengubahan ukuran menggunakan handle native jika tersedia di package.

### 3. Tooltip Shortcut & Navigasi List
* **Penyederhanaan**: Tidak membuat utilitas deteksi OS rumit atau Modal Shortcut baru.
* **Solusi Minimal**:
  * Tulis shortcut statis dalam tooltip tombol toolbar masing-masing (misalnya: `Ctrl/⌘ + B` untuk tebal).
  * Aktifkan navigasi native `Tab` dan `Shift+Tab` untuk indentasi bullet list.

---

## 🚫 Fitur yang Dibatalkan (YAGNI / Over-engineering)

* **❌ Bubble Menu & Floating Menu**: Batalkan. Kita sudah memiliki **Sticky Toolbar** di atas layar ([EditorToolbar.tsx](file:///D:/.maguru/maguru/features/cms/components/creator/EditorToolbar.tsx)) yang selalu terlihat. Menambahkan menu melayang lainnya hanya akan membingungkan penulis dan memperumit manajemen state DOM.
* **❌ Refaktor Toolbar `useEditorState`**: Batalkan. Selama tombol toolbar kustom saat ini ([mark-button.tsx](file:///D:/.maguru/maguru/components/tiptap-ui/mark-button/mark-button.tsx)) tidak menunjukkan perlambatan performa (*lag*) saat mengetik, optimasi ini ditunda.
* **❌ Modal Shortcut Legend**: Batalkan. Cukup andalkan tooltip pada tombol toolbar masing-masing.

---

## 📋 Alur Komponen Slash Command Minimalis

### 1. Struktur Folder
```
📁 features/cms/components/creator/manage/editor/
├── extensions/
│   └── SlashCommand.ts   (Extension suggestion berbasis /)
└── components/
    ├── SlashList.tsx     (Daftar aksi React sederhana dengan navigasi keyboard)
    └── suggestion.ts     (Konfigurasi rendering portal absolute)
```

### 2. Kode Render Sederhana (`suggestion.ts`)
```typescript
// ponytail: Menggunakan absolute positioning native React element tanpa tippy.js
import { ReactRenderer } from '@tiptap/react'
import { SlashList } from './SlashList'

export const suggestionOptions = {
  items: ({ query }) => {
    return [
      {
        title: 'Heading 1',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
        },
      },
      {
        title: 'Daftar Tugas',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run()
        },
      },
    ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
  },
  render: () => {
    let component: any

    return {
      onStart: props => {
        component = new ReactRenderer(SlashList, {
          props,
          editor: props.editor,
        })
        
        // ponytail: Tempatkan dropdown div secara absolut di koordinat clientRect
        const { x, y, height } = props.clientRect()
        const popupEl = component.element
        popupEl.style.position = 'absolute'
        popupEl.style.left = `${x}px`
        popupEl.style.top = `${y + height}px`
        popupEl.style.zIndex = '1000'
        document.body.appendChild(popupEl)
      },
      onUpdate(props) {
        component.updateProps(props)
        const { x, y, height } = props.clientRect()
        const popupEl = component.element
        popupEl.style.left = `${x}px`
        popupEl.style.top = `${y + height}px`
      },
      onKeyDown(props) {
        return component.ref?.onKeyDown(props)
      },
      onExit() {
        component.element.remove()
        component.destroy()
      },
    }
  },
}
```
