# Tiptap Editor Research Report

**Author:** Manus AI
**Date:** 2026-04-26

This report provides a structured overview of the Tiptap rich text editor, covering its core concepts, main features, best practices for implementation, and an evaluation checklist based on the provided implementation details.

## 1. Ringkasan Fitur Utama Tiptap

### Core Concepts

Tiptap is a headless rich text editor framework built on top of ProseMirror, offering a flexible and powerful API for building custom editors [1]. Its modular architecture is centered around several key concepts:

- **Editor:** The central instance that manages the editor state, extensions, and interactions. It's the main entry point for controlling the editor programmatically.
  - **Penjelasan Singkat:** Objek utama yang mengelola seluruh fungsionalitas editor, termasuk state, ekstensi, dan interaksi pengguna.
  - **Contoh Penggunaan:**
    ```javascript
    import { Editor } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'

    const editor = new Editor({
      element: document.querySelector('.element'),
      extensions: [
        StarterKit,
      ],
      content: `<p>Hello Tiptap!</p>`,
    })
    ```
  - **Link Docs Resmi:** [Editor Instance API](https://tiptap.dev/docs/editor/api/editor)

- **Extensions:** Building blocks that add new capabilities or modify the editor's behavior. They can introduce new content types (nodes and marks), add attributes, commands, event listeners, and keyboard shortcuts [2].
  - **Penjelasan Singkat:** Modul-modul yang memperluas fungsionalitas editor, seperti menambahkan format teks, struktur dokumen, atau fitur kustom.
  - **Contoh Penggunaan:** Menambahkan `StarterKit` yang berisi ekstensi umum seperti bold, italic, heading, dll.
    ```javascript
    import { Editor } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'

    const editor = new Editor({
      extensions: [
        StarterKit,
      ],
    })
    ```
  - **Link Docs Resmi:** [Extensions Overview](https://tiptap.dev/docs/editor/core-concepts/extensions)

- **Nodes:** Represent distinct blocks of content within the editor's document structure, such as paragraphs, headings, images, or custom components. Nodes define the structure and hierarchy of the content [3].
  - **Penjelasan Singkat:** Elemen-elemen struktural dalam dokumen editor, seperti paragraf, judul, daftar, atau blok kode. Node membentuk hierarki konten.
  - **Contoh Penggunaan:** `Paragraph`, `Heading`, `Image` adalah contoh Node.
    ```javascript
    // Contoh Node: Heading
    import { Heading } from '@tiptap/extension-heading'
    // ... digunakan dalam array extensions
    ```
  - **Link Docs Resmi:** [Nodes and Marks](https://tiptap.dev/docs/editor/core-concepts/nodes-and-marks)

- **Marks:** Apply styling or annotations to specific parts of the text within a node, without changing the document's structure. Examples include bold, italic, underline, or links [3].
  - **Penjelasan Singkat:** Atribut yang diterapkan pada bagian teks tertentu untuk memberikan gaya atau anotasi, seperti teks tebal, miring, atau tautan.
  - **Contoh Penggunaan:** `Bold`, `Italic`, `Link` adalah contoh Mark.
    ```javascript
    // Contoh Mark: Bold
    import { Bold } from '@tiptap/extension-bold'
    // ... digunakan dalam array extensions
    ```
  - **Link Docs Resmi:** [Nodes and Marks](https://tiptap.dev/docs/editor/core-concepts/nodes-and-marks)

### List Fitur Utama

Tiptap menyediakan berbagai fitur yang dapat diimplementasikan melalui ekstensinya, mulai dari pemformatan teks dasar hingga fungsionalitas lanjutan.

- **Text Formatting (High-level → Detail):**
  - **Bold, Italic, Strike, Code:** Fitur dasar untuk mengubah gaya teks. Disediakan oleh `StarterKit` atau ekstensi individual seperti `@tiptap/extension-bold`.
    - **Penjelasan Singkat:** Mengubah tampilan teks menjadi tebal, miring, dicoret, atau sebagai kode inline.
    - **Contoh Penggunaan:**
      ```javascript
      editor.chain().focus().toggleBold().run()
      editor.chain().focus().toggleItalic().run()
      ```
    - **Link Docs Resmi:** Bagian dari [StarterKit](https://tiptap.dev/docs/editor/api/extensions/starter-kit)
  - **Highlight:** Memberikan warna latar belakang pada teks.
    - **Penjelasan Singkat:** Menyorot teks dengan warna tertentu.
    - **Contoh Penggunaan:** Menggunakan `@tiptap/extension-highlight`.
      ```javascript
      editor.chain().focus().toggleHighlight({ color: '#ffc078' }).run()
      ```
    - **Link Docs Resmi:** [Highlight Extension](https://tiptap.dev/docs/editor/api/extensions/highlight)
  - **Text Align:** Mengatur perataan teks (kiri, tengah, kanan, justify).
    - **Penjelasan Singkat:** Mengatur posisi horizontal teks dalam paragraf.
    - **Contoh Penggunaan:** Menggunakan `@tiptap/extension-text-align`.
      ```javascript
      editor.chain().focus().setTextAlign('center').run()
      ```
    - **Link Docs Resmi:** [TextAlign Extension](https://tiptap.dev/docs/editor/api/extensions/text-align)
  - **Superscript/Subscript:** Teks di atas atau di bawah garis dasar.
    - **Penjelasan Singkat:** Mengubah teks menjadi format superscript (pangkat) atau subscript (indeks).
    - **Contoh Penggunaan:** Menggunakan `@tiptap/extension-superscript` dan `@tiptap/extension-subscript`.
      ```javascript
      editor.chain().focus().toggleSuperscript().run()
      ```
    - **Link Docs Resmi:** [Superscript Extension](https://tiptap.dev/docs/editor/api/extensions/superscript), [Subscript Extension](https://tiptap.dev/docs/editor/api/extensions/subscript)

- **Document Structure (High-level → Detail):**
  - **Heading, Paragraph, List, Blockquote, CodeBlock:** Elemen dasar untuk menyusun dokumen.
    - **Penjelasan Singkat:** Menyediakan struktur dasar dokumen seperti judul, paragraf, daftar berpoin/bernomor, kutipan, dan blok kode.
    - **Contoh Penggunaan:**
      ```javascript
      editor.chain().focus().toggleHeading({ level: 1 }).run()
      editor.chain().focus().toggleBulletList().run()
      ```
    - **Link Docs Resmi:** Bagian dari [StarterKit](https://tiptap.dev/docs/editor/api/extensions/starter-kit)
  - **Image:** Menyisipkan gambar ke dalam dokumen.
    - **Penjelasan Singkat:** Memungkinkan pengguna untuk menambahkan gambar ke dalam konten editor.
    - **Contoh Penggunaan:** Menggunakan `@tiptap/extension-image`.
      ```javascript
      editor.chain().focus().setImage({ src: 'https://example.com/image.jpg' }).run()
      ```
    - **Link Docs Resmi:** [Image Extension](https://tiptap.dev/docs/editor/api/extensions/image)

- **Advanced Features:**
  - **Collaboration:** Mendukung pengeditan dokumen secara real-time oleh banyak pengguna.
    - **Penjelasan Singkat:** Memungkinkan beberapa pengguna untuk mengedit dokumen yang sama secara bersamaan, dengan sinkronisasi perubahan secara instan.
    - **Contoh Penggunaan:** Integrasi dengan layanan seperti Hocuspocus atau Liveblocks.
    - **Link Docs Resmi:** [Collaboration Guide](https://tiptap.dev/docs/guides/collaboration/introduction)
  - **History:** Fitur undo/redo untuk melacak perubahan dokumen.
    - **Penjelasan Singkat:** Memungkinkan pengguna untuk membatalkan atau mengulang tindakan yang telah dilakukan di editor.
    - **Contoh Penggunaan:** Disediakan oleh `@tiptap/extension-history`.
      ```javascript
      editor.chain().focus().undo().run()
      editor.chain().focus().redo().run()
      ```
    - **Link Docs Resmi:** [History Extension](https://tiptap.dev/docs/editor/api/extensions/history)
  - **Placeholder:** Menampilkan teks placeholder saat editor kosong.
    - **Penjelasan Singkat:** Menampilkan teks petunjuk di editor saat tidak ada konten.
    - **Contoh Penggunaan:** Menggunakan `@tiptap/extension-placeholder`.
      ```javascript
      Placeholder.configure({
        placeholder: 'Write something amazing…',
      })
      ```
    - **Link Docs Resmi:** [Placeholder Extension](https://tiptap.dev/docs/editor/api/extensions/placeholder)
  - **Character Count:** Menghitung jumlah karakter atau kata dalam dokumen.
    - **Penjelasan Singkat:** Memberikan informasi tentang panjang konten editor.
    - **Contoh Penggunaan:** Menggunakan `@tiptap/extension-character-count`.
    - **Link Docs Resmi:** [CharacterCount Extension](https://tiptap.dev/docs/editor/api/extensions/character-count)

## 2. Best Practice Implementation

Implementasi Tiptap yang efektif memerlukan perhatian pada struktur, modularitas, kinerja, pemeliharaan, dan pengalaman pengguna. Berikut adalah beberapa praktik terbaik:

-   **Struktur Extension:**
    -   **Gunakan `StarterKit` sebagai dasar:** `StarterKit` menyediakan ekstensi inti yang paling umum digunakan, mengurangi boilerplate dan memastikan fungsionalitas dasar yang konsisten [1].
    -   **Ekstensi kustom untuk fungsionalitas unik:** Buat ekstensi kustom untuk fitur yang spesifik untuk aplikasi Anda, seperti `HeadingShortcuts` atau `SaveShortcut` yang Anda miliki. Ini menjaga kode tetap terorganisir dan dapat digunakan kembali.
    -   **Konfigurasi ekstensi secara terpusat:** Kelola konfigurasi semua ekstensi di satu tempat untuk memudahkan pemeliharaan dan perubahan global.

-   **Modularisasi Editor:**
    -   **Isolasi komponen editor:** Tempatkan editor Tiptap dalam komponen React (atau framework lain) yang terisolasi. Hindari merender editor di komponen yang sama dengan komponen lain yang tidak terkait untuk mencegah re-render yang tidak perlu [4].
    -   **Pisahkan UI toolbar dari logika editor:** Toolbar harus menjadi komponen terpisah yang berinteraksi dengan instance editor melalui perintah, bukan mengelola state editor secara langsung. Ini meningkatkan fleksibilitas dan pemisahan kekhawatiran.

-   **Performance (Lazy Loading, Minimal Extension):**
    -   **Hanya gunakan ekstensi yang dibutuhkan:** Setiap ekstensi menambah ukuran bundle dan kompleksitas. Audit ekstensi yang digunakan dan hapus yang tidak perlu [1].
    -   **Lazy loading ekstensi (jika memungkinkan):** Untuk ekstensi yang jarang digunakan atau berat, pertimbangkan untuk memuatnya secara dinamis saat dibutuhkan. Ini dapat mengurangi waktu muat awal editor.
    -   **Optimasi `useEditor` hook (untuk React):** Jika menggunakan React, pastikan `useEditor` hook diisolasi dengan benar. Gunakan `useEditorState` untuk berlangganan hanya pada perubahan state editor yang relevan, mencegah re-render komponen yang tidak perlu [4].
    -   **Hindari re-render yang tidak perlu:** Gunakan React DevTools Profiler untuk mengidentifikasi komponen yang sering di-render ulang dan optimalkan sesuai kebutuhan. Pertimbangkan `immediatelyRender` dan `shouldRerenderOnTransaction` untuk kontrol rendering yang lebih baik [4].

-   **Maintainability (Scalable Config):**
    -   **Konfigurasi ekstensi yang terstruktur:** Gunakan objek konfigurasi yang jelas untuk setiap ekstensi, memungkinkan penyesuaian yang mudah dan pembacaan kode yang lebih baik.
    -   **Gunakan TypeScript:** Memanfaatkan TypeScript untuk mendefinisikan tipe ekstensi dan konfigurasi akan meningkatkan maintainability dan mengurangi kesalahan.
    -   **Dokumentasi internal:** Untuk ekstensi kustom atau konfigurasi yang kompleks, sertakan komentar atau dokumentasi internal yang jelas.

-   **UX (Toolbar, Keyboard Shortcut):**
    -   **Toolbar yang intuitif:** Desain toolbar yang mudah digunakan dan sesuai dengan kebutuhan pengguna. Kelompokkan fitur-fitur terkait secara logis.
    -   **Feedback visual untuk keyboard shortcut:** Jika ada keyboard shortcut kustom, berikan indikasi visual di UI (misalnya, tooltip pada tombol toolbar) agar pengguna mengetahuinya.
    -   **Penanganan link yang jelas:** Pastikan perilaku link (misalnya, `openOnClick: false`) dikomunikasikan dengan jelas kepada pengguna, mungkin melalui perubahan kursor atau tooltip.
    -   **Peringatan perubahan yang belum disimpan:** Implementasikan mekanisme untuk memperingatkan pengguna tentang perubahan yang belum disimpan sebelum mereka menavigasi keluar dari editor.

## 3. Checklist Evaluasi Implementasi

Berdasarkan implementasi Anda (`report.md`) dan praktik terbaik Tiptap, berikut adalah checklist evaluasi:

| Aspek | Pertanyaan Evaluasi | Status Implementasi Anda | Rekomendasi / Catatan |
|---|---|---|---|
| **Ekstensi** | Apakah hanya ekstensi yang dibutuhkan yang digunakan? | `StarterKit`, `TextAlign`, `Highlight`, `Typography`, `Superscript`, `Subscript`, `Selection`, `HeadingShortcuts` (custom), `SaveShortcut` (custom) | Sebagian besar terlihat relevan. Pastikan `Selection` dan `Typography` benar-benar memberikan nilai tambah yang signifikan untuk menghindari overhead yang tidak perlu. |
| | Apakah ada ekstensi berlebihan yang dapat dihapus? | Potensi `Selection` dan `Typography` perlu ditinjau ulang. | Lakukan audit penggunaan `Selection` dan `Typography`. Jika tidak ada fitur spesifik yang memanfaatkannya, pertimbangkan untuk menghapusnya. |
| | Apakah ekstensi kustom (`HeadingShortcuts`, `SaveShortcut`) terstruktur dengan baik? | Ya, ada ekstensi kustom. | Pastikan ekstensi kustom mengikuti pola Tiptap dan mudah dipelihara. |
| **Modularisasi** | Apakah config editor modular? | Ya, ekstensi terdaftar secara terpisah. | Sudah baik. Pertimbangkan untuk mengelompokkan konfigurasi ekstensi ke dalam file terpisah jika jumlahnya bertambah. |
| | Apakah UI toolbar terpisah dari logika editor? | Ya, `EditorToolbar.tsx` terpisah. | Sudah baik. |
| **Performance** | Apakah editor diisolasi dalam komponen terpisah (untuk React)? | Ya, `LessonEditorPanel` mengelola editor. | Sudah baik. Pastikan tidak ada re-render yang tidak perlu dari komponen induk. |
| | Apakah ada penggunaan `useEditorState` untuk optimasi re-render? | Tidak disebutkan secara eksplisit. | Pertimbangkan untuk menggunakan `useEditorState` jika ada komponen yang berlangganan state editor dan mengalami re-render berlebihan. |
| | Apakah ada lazy loading untuk ekstensi yang berat? | Tidak disebutkan. | Jika ada ekstensi yang sangat besar atau jarang digunakan, pertimbangkan lazy loading. |
| **Maintainability** | Apakah konfigurasi ekstensi terpusat dan mudah dikelola? | Ya, terdaftar di satu tempat. | Sudah baik. |
| | Apakah TypeScript digunakan secara efektif untuk ekstensi dan konfigurasi? | Tidak disebutkan secara eksplisit, namun asumsi menggunakan TypeScript karena project React. | Pastikan tipe yang kuat digunakan untuk konfigurasi ekstensi dan objek editor. |
| **UX** | Apakah toolbar intuitif dan mudah digunakan? | Toolbar lengkap tersedia. | Perlu validasi pengguna. Pastikan item-item di toolbar memiliki ikon dan tooltip yang jelas. |
| | Apakah keyboard shortcut terdokumentasi atau ada hint di UI? | Hanya Cmd+Enter yang ada, Mod+Shift+1/2/3 tidak ada hint. | **Prioritas:** Tambahkan hint UI untuk `HeadingShortcuts` agar pengguna tahu. |
| | Apakah ada peringatan untuk perubahan yang belum disimpan? | Tidak ada. | **Prioritas:** Implementasikan `unsaved changes warning` sebelum navigasi. |
| | Apakah perilaku link (`openOnClick: false`) dikomunikasikan dengan jelas? | Tidak ada hint di UI. | Tambahkan hint UI atau perubahan kursor saat hover pada link di mode edit. |
| **Fungsionalitas** | Apakah image upload aktif? | Tidak aktif. | **Prioritas:** Aktifkan `ImageUploadNode` dan tambahkan `ImageUploadButton` ke toolbar. |
| | Apakah versioning konten berfungsi dengan benar? | `version` selalu `1`. | **Prioritas:** Perbaiki logika increment `version` saat save. |
| | Apakah ada auto-save? | Tidak ada. | **Prioritas:** Implementasikan auto-save ke `localStorage` atau backend. |
| | Apakah ada sistem Draft/Publish? | Belum ada. | **Prioritas:** Tambahkan `draftContent` / `publishedContent` di schema Prisma. |
| | Apakah `contentPreview` akurat? | Hanya 200 char plain text. | Tingkatkan akurasi `contentPreview` agar lebih mencerminkan struktur konten. |

## 4. Output

### Ringkasan Fitur Utama Tiptap

Tiptap adalah framework editor teks kaya *headless* yang dibangun di atas ProseMirror, memungkinkan kustomisasi tinggi melalui sistem **Extensions**. Ekstensi ini dapat berupa **Nodes** (elemen struktural seperti paragraf, judul, gambar) atau **Marks** (pemformatan teks seperti tebal, miring, tautan). Fitur-fitur utama mencakup pemformatan teks dasar (bold, italic, highlight, text align, superscript/subscript), struktur dokumen (heading, list, blockquote, code block, image), dan fitur lanjutan seperti kolaborasi real-time, riwayat undo/redo, placeholder, dan penghitung karakter.

### Best Practice

Praktik terbaik untuk implementasi Tiptap meliputi:

-   **Struktur Extension:** Menggunakan `StarterKit` sebagai dasar, membuat ekstensi kustom untuk fungsionalitas unik, dan mengelola konfigurasi secara terpusat.
-   **Modularisasi Editor:** Mengisolasi komponen editor dan memisahkan UI toolbar dari logika editor untuk meningkatkan fleksibilitas dan pemeliharaan.
-   **Performance:** Hanya menggunakan ekstensi yang dibutuhkan, mempertimbangkan *lazy loading* untuk ekstensi berat, dan mengoptimalkan re-render komponen (terutama di React dengan `useEditorState`).
-   **Maintainability:** Menggunakan konfigurasi ekstensi yang terstruktur, memanfaatkan TypeScript, dan menyediakan dokumentasi internal yang jelas.
-   **UX:** Merancang toolbar yang intuitif, memberikan feedback visual untuk keyboard shortcut kustom, penanganan link yang jelas, dan memperingatkan pengguna tentang perubahan yang belum disimpan.

### Checklist Evaluasi Implementasi

Lihat tabel di bagian **3. Checklist Evaluasi Implementasi** di atas untuk detail evaluasi implementasi Anda berdasarkan praktik terbaik.

## References

1.  [Tiptap Docs: Introduction](https://tiptap.dev/docs/editor/introduction)
2.  [Tiptap Docs: Extensions](https://tiptap.dev/docs/editor/core-concepts/extensions)
3.  [Tiptap Docs: Nodes and Marks](https://tiptap.dev/docs/editor/core-concepts/nodes-and-marks)
4.  [Tiptap Docs: Integration performance](https://tiptap.dev/docs/guides/performance)
