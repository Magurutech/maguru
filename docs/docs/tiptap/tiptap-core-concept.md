# Tiptap Editor: Detailed Core Concepts

**Author:** Manus AI
**Date:** 2026-04-26

Dokumen ini menyajikan penjelasan mendalam mengenai konsep inti Tiptap editor, yaitu Editor, Extensions, Nodes, dan Marks, sesuai dengan permintaan Anda. Penjelasan difokuskan pada fungsionalitas utama dan relevansinya dalam konteks pengembangan dengan Next.js/React, tanpa terlalu masuk ke detail implementasi ProseMirror yang sangat teknis.

## 1. Editor

**Editor** adalah instansi pusat Tiptap yang mengelola seluruh siklus hidup dan fungsionalitas editor. Ini adalah objek utama yang berinteraksi dengan DOM, mengelola state editor, dan menyediakan API untuk memanipulasi konten. Dalam konteks React/Next.js, instansi editor biasanya dibuat menggunakan `useEditor` hook dari `@tiptap/react` [1].

### Fitur Utama Editor Instance:

-   **Pengelolaan State:** Editor menyimpan dan mengelola state dokumen, termasuk konten, posisi kursor, dan seleksi.
-   **Interaksi DOM:** Editor bertanggung jawab untuk merender konten ke elemen HTML yang ditentukan dan menangani interaksi pengguna seperti input keyboard dan mouse.
-   **API Programatik:** Menyediakan berbagai metode untuk berinteraksi dengan editor secara programatik, seperti mendapatkan konten, menjalankan perintah, atau mengubah konfigurasi.
-   **Manajemen Ekstensi:** Editor adalah wadah di mana semua ekstensi Tiptap didaftarkan dan diaktifkan.

### Detail Konfigurasi (Settings) [1]:

| Setting            | Deskripsi Singkat                                                                                                       |
| --------------------| -------------------------------------------------------------------------------------------------------------------------|
| `element`          | Elemen HTML tempat editor akan diikat. Bisa diinisialisasi sebelum mounting dan di-mount nanti dengan `editor.mount()`. |
| `extensions`       | Array ekstensi yang akan diaktifkan di editor. Ini adalah cara utama untuk menambahkan fungsionalitas.                  |
| `content`          | Konten awal editor, bisa dalam format HTML atau JSON.                                                                   |
| `editable`         | Boolean yang menentukan apakah editor dapat diedit oleh pengguna.                                                       |
| `autofocus`        | Mengontrol fokus kursor saat inisialisasi (misalnya, `'start'`, `'end'`, `'all'`, atau posisi spesifik).                |
| `enableInputRules` | Mengontrol apakah *input rules* (misalnya, `## ` untuk H2) diaktifkan.                                                  |
| `enablePasteRules` | Mengontrol apakah *paste rules* (misalnya, mengonversi URL menjadi link) diaktifkan.                                    |
| `editorProps`      | Konfigurasi lanjutan untuk ProseMirror, termasuk atribut DOM dan *event handlers*.                                      |

### Metode Penting (Methods) [1]:

| Metode | Deskripsi Singkat |
|---|---|
| `getHTML()` | Mengembalikan konten editor saat ini dalam format HTML. |
| `getJSON()` | Mengembalikan konten editor saat ini dalam format JSON (representasi ProseMirror). |
| `getText()` | Mengembalikan konten editor saat ini sebagai teks biasa. |
| `chain()` | Membuat rantai perintah untuk menjalankan beberapa perintah editor secara berurutan. |
| `isActive(name, attributes)` | Memeriksa apakah node atau mark tertentu aktif pada seleksi saat ini. |
| `destroy()` | Menghentikan editor dan melepaskan semua event listener. |
| `focus(position)` | Mengatur fokus ke editor pada posisi tertentu. |
| `commands` | Objek yang berisi semua perintah yang tersedia dari ekstensi yang terdaftar. |

## 2. Extensions

**Extensions** adalah tulang punggung modularitas Tiptap. Mereka adalah blok bangunan yang menambahkan kemampuan baru atau memodifikasi perilaku editor. Hampir semua fungsionalitas di Tiptap, mulai dari pemformatan teks sederhana hingga fitur kolaborasi kompleks, diimplementasikan sebagai ekstensi [2].

### Fitur Utama Extensions:

-   **Modularitas:** Memungkinkan Anda untuk hanya menyertakan fungsionalitas yang Anda butuhkan, menjaga ukuran bundle tetap kecil dan skema tetap terkontrol.
-   **Kustomisasi:** Ekstensi dapat dikustomisasi dengan opsi konfigurasi, memungkinkan Anda menyesuaikan perilakunya.
-   **Jenis Ekstensi:** Ada tiga jenis utama ekstensi:
    -   **Node Extensions:** Menambahkan jenis konten struktural baru (misalnya, `Paragraph`, `Image`, `Table`).
    -   **Mark Extensions:** Menambahkan pemformatan atau anotasi ke teks (misalnya, `Bold`, `Italic`, `Link`).
    -   **Extension (General):** Menambahkan fungsionalitas umum yang tidak terkait langsung dengan struktur atau gaya konten, seperti `History` (undo/redo), `Placeholder`, atau `Keymap`.

### Kemampuan Kunci Ekstensi [2]:

-   **Menambahkan Atribut:** Ekstensi dapat menambahkan atribut kustom ke node dan mark untuk menyimpan data tambahan (misalnya, atribut `src` pada node `Image`).
-   **Menerapkan Atribut Global:** Menerapkan atribut ke beberapa ekstensi sekaligus (misalnya, perataan teks).
-   **Menambahkan Perintah (Commands):** Mendefinisikan perintah kustom yang dapat dipanggil untuk memicu perilaku editor (misalnya, `toggleBold()`).
-   **Mendengarkan Event:** Ekstensi dapat bereaksi terhadap event editor seperti `focus`, `blur`, `update`, dll.
-   **Menambahkan Keyboard Shortcuts:** Mendefinisikan pintasan keyboard untuk akses cepat ke fitur.

### StarterKit [2]:

`@tiptap/starter-kit` adalah kumpulan ekstensi inti yang paling umum digunakan. Ini sangat direkomendasikan sebagai titik awal karena menyediakan fungsionalitas dasar yang esensial seperti paragraf, heading, bold, italic, dll., tanpa perlu mendaftarkan setiap ekstensi secara individual.

## 3. Nodes

**Nodes** adalah blok bangunan struktural dari dokumen Tiptap. Jika Anda membayangkan dokumen sebagai pohon, maka node adalah jenis konten dalam pohon tersebut. Setiap node memiliki peran spesifik dalam mendefinisikan struktur dan hierarki konten [3].

### Fitur Utama Nodes:

-   **Struktur Dokumen:** Nodes menentukan bagaimana konten diatur dalam dokumen (misalnya, sebuah `Paragraph` berisi teks, sebuah `Heading` adalah judul).
-   **Blok atau Inline:** Nodes bisa berupa blok (misalnya, `Paragraph`, `CodeBlock`) yang menempati baris sendiri, atau inline (misalnya, `@mention`) yang berada di dalam teks.
-   **Skema Dokumen:** Setiap node memiliki definisi skema yang menentukan aturan untuk kontennya (misalnya, `Heading` dapat memiliki atribut `level`).
-   **Node Views:** Untuk rendering yang lebih kompleks atau interaktif, node dapat memiliki *Node Views* kustom (terutama relevan di React/Next.js untuk merender komponen React sebagai node) [4].

### Contoh Node Extensions [5]:

| Node Extension | Deskripsi Singkat |
|---|---|
| `Document` | Node root dari setiap dokumen Tiptap. Wajib ada. |
| `Paragraph` | Node dasar untuk blok teks. Wajib ada. |
| `Text` | Node untuk teks biasa. Wajib ada. |
| `Heading` | Node untuk judul dengan level yang berbeda (H1-H6). |
| `BulletList` | Node untuk daftar tidak berurutan. |
| `OrderedList` | Node untuk daftar berurutan. |
| `ListItem` | Node untuk item dalam daftar. |
| `Blockquote` | Node untuk kutipan blok. |
| `CodeBlock` | Node untuk blok kode. |
| `Image` | Node untuk menyisipkan gambar. |
| `HardBreak` | Node untuk jeda baris paksa (`<br>`). |
| `HorizontalRule` | Node untuk garis horizontal (`<hr>`). |
| `Table`, `TableRow`, `TableCell`, `TableHeader` | Node-node untuk membuat tabel. |
| `TaskItem`, `TaskList` | Node-node untuk daftar tugas interaktif. |

## 4. Marks

**Marks** adalah cara untuk menerapkan gaya atau anotasi pada bagian teks tertentu dalam sebuah node, tanpa mengubah struktur dokumen. Mereka 
berbeda dari node karena mereka dapat diterapkan pada rentang teks arbitrer dan tidak memiliki struktur blok sendiri [3].

### Fitur Utama Marks:

-   **Pemformatan Inline:** Marks digunakan untuk pemformatan teks inline seperti tebal, miring, garis bawah, atau warna.
-   **Anotasi:** Dapat digunakan untuk menambahkan anotasi non-struktural pada teks, seperti tautan atau highlight.
-   **Tidak Mengubah Struktur:** Marks tidak mengubah hierarki dokumen; mereka hanya menambahkan metadata atau gaya pada teks yang sudah ada.
-   **Dapat Bertumpuk:** Beberapa marks dapat diterapkan pada rentang teks yang sama (misalnya, teks bisa tebal dan miring sekaligus).

### Contoh Mark Extensions [6]:

| Mark Extension | Deskripsi Singkat |
|---|---|
| `Bold` | Menerapkan gaya tebal pada teks. |
| `Italic` | Menerapkan gaya miring pada teks. |
| `Strike` | Menerapkan gaya coret pada teks. |
| `Underline` | Menerapkan gaya garis bawah pada teks. |
| `Code` | Menerapkan gaya kode inline pada teks. |
| `Link` | Mengubah teks menjadi tautan. |
| `Highlight` | Menerapkan warna highlight pada teks. |
| `Subscript` | Menerapkan gaya subscript pada teks. |
| `Superscript` | Menerapkan gaya superscript pada teks. |
| `TextStyle` | Ekstensi dasar untuk menambahkan gaya teks kustom (misalnya, warna font). |

## References

1.  [Tiptap Docs: Editor Instance API](https://tiptap.dev/docs/editor/api/editor)
2.  [Tiptap Docs: Extensions Overview](https://tiptap.dev/docs/editor/core-concepts/extensions)
3.  [Tiptap Docs: Nodes and Marks](https://tiptap.dev/docs/editor/core-concepts/nodes-and-marks)
4.  [Tiptap Docs: React node views performance](https://tiptap.dev/docs/editor/guides/performance#react-node-views-performance)
5.  [Tiptap Docs: Nodes extensions](https://tiptap.dev/docs/editor/extensions/nodes)
6.  [Tiptap Docs: Mark extensions](https://tiptap.dev/docs/editor/extensions/marks)
