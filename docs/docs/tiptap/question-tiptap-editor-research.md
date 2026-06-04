# Tiptap Editor: Comprehensive Research Report

**Author:** Manus AI
**Date:** 2026-05-01

Laporan ini menyajikan hasil riset mendalam mengenai 21 pertanyaan terkait Tiptap editor, yang dikelompokkan ke dalam 9 kategori. Setiap jawaban didukung oleh referensi dari dokumentasi resmi Tiptap atau sumber kredibel lainnya.

## 1. Editor Lifecycle & Performance

### 1. Bagaimana cara optimal mengimplementasi `useEditorState` untuk toolbar buttons?

`useEditorState` adalah hook dari `@tiptap/react` yang dirancang untuk mengoptimalkan *re-render* komponen React yang bergantung pada state editor. Daripada menggunakan `useEditor` yang akan memicu *re-render* pada setiap perubahan transaksi editor, `useEditorState` memungkinkan komponen untuk hanya berlangganan pada bagian spesifik dari state editor yang relevan [1].

-   **Setiap button perlu selector sendiri?** Ya, setiap tombol toolbar yang perlu bereaksi terhadap state editor (misalnya, apakah teks tebal sedang aktif) harus menggunakan `useEditorState` dengan fungsi `selector`-nya sendiri. Ini memastikan bahwa tombol hanya di-render ulang ketika bagian state yang relevan dengannya berubah, bukan seluruh state editor [1].
-   **Bagaimana pattern untuk multiple active states (bold + italic)?** Anda dapat menggabungkan beberapa pemeriksaan `isActive` dalam satu `selector` untuk mengelola beberapa state aktif. Contohnya:
    ```typescript
    const { isBoldActive, isItalicActive } = useEditorState({
      editor,
      selector: (ctx) => ({
        isBoldActive: ctx.editor.isActive("bold"),
        isItalicActive: ctx.editor.isActive("italic"),
      }),
    });
    ```
-   **Contoh implementasi dari dokumentasi resmi?** Dokumentasi Tiptap menyarankan penggunaan `useEditorState` untuk komponen toolbar yang hanya perlu mengetahui status `isActive` dari suatu mark atau node, sehingga menghindari *re-render* yang tidak perlu pada komponen induk [1].

### 2. Kapan sebaiknya menggunakan `shouldRerenderOnTransaction` option?

Opsi `shouldRerenderOnTransaction` adalah fitur performa lanjutan di Tiptap yang memungkinkan kontrol lebih granular atas kapan editor harus di-render ulang. Secara default, Tiptap akan melakukan *re-render* pada setiap transaksi ProseMirror. Dengan menyetel `shouldRerenderOnTransaction: false`, Anda dapat menonaktifkan perilaku ini dan mengelola *re-render* secara manual [2].

-   **Apa trade-off antara performance vs reactivity?**
    -   **Performance:** Mengatur `shouldRerenderOnTransaction: false` dapat secara signifikan meningkatkan performa, terutama untuk editor dengan konten besar atau banyak transaksi, karena mengurangi jumlah *re-render* yang tidak perlu. Ini sangat berguna jika Anda memiliki *Node Views* kustom yang kompleks [2].
    -   **Reactivity:** Trade-off-nya adalah Anda kehilangan reaktivitas otomatis. Jika Anda menonaktifkan ini, Anda harus secara manual memicu *re-render* atau memperbarui UI Anda ketika ada perubahan state editor yang perlu direfleksikan. Ini membutuhkan manajemen state yang lebih hati-hati dan mungkin perlu menggunakan `editor.forceUpdate()` atau `editor.view.update()` secara selektif [2].
-   **Bagaimana mengukur impact re-render di Tiptap?** Anda dapat menggunakan *React DevTools Profiler* untuk mengidentifikasi komponen mana yang sering di-render ulang dan berapa lama waktu yang dibutuhkan. Ini akan membantu Anda menentukan apakah `shouldRerenderOnTransaction` perlu dioptimalkan [1].

### 3. Bagaimana best practice untuk editor cleanup/destroy?

Manajemen siklus hidup editor sangat penting untuk mencegah *memory leaks*, terutama dalam aplikasi *single-page* (SPA) atau Next.js di mana komponen sering di-mount dan unmount [3].

-   **Apakah cukup mengandalkan React cleanup otomatis?** Tidak. Meskipun React memiliki mekanisme *garbage collection*, instansi Tiptap editor (yang dibangun di atas ProseMirror) mengelola *event listeners* dan *DOM nodes* di luar siklus hidup React secara langsung. Oleh karena itu, *cleanup* eksplisit diperlukan [3].
-   **Kapan harus explicit call `editor.destroy()`?** Anda **harus** memanggil `editor.destroy()` ketika komponen React yang menampung editor di-unmount. Dalam React, ini dilakukan di dalam fungsi *cleanup* dari `useEffect` hook [3].
    ```typescript
    import { useEffect } from 'react';
    import { useEditor } from '@tiptap/react';

    const MyEditorComponent = () => {
      const editor = useEditor({ /* ... */ });

      useEffect(() => {
        return () => {
          editor?.destroy(); // Pastikan editor ada sebelum memanggil destroy
        };
      }, [editor]); // Dependensi pada instansi editor

      // ... rest of your component
    };
    ```
-   **Apa yang terjadi jika tidak di-destroy?** Jika `editor.destroy()` tidak dipanggil, instansi editor akan tetap berada di memori, terus mendengarkan *event DOM* meskipun elemen HTML-nya sudah dihapus dari DOM. Ini akan menyebabkan *memory leaks*, performa aplikasi menurun, dan potensi perilaku yang tidak terduga [3].

## 2. Extensions & Configuration

### 4. Apa fungsi spesifik dari `Selection` extension?

`Selection` extension di Tiptap (atau lebih tepatnya, konsep seleksi di ProseMirror yang diekspos oleh Tiptap) mengacu pada cara pengguna memilih konten di editor. Tiptap secara inheren menangani manajemen seleksi sebagai bagian dari fungsionalitas intinya melalui ProseMirror. Tidak ada ekstensi terpisah bernama `Selection` yang perlu diinstal secara eksplisit dari `@tiptap/extensions` [4].

-   **Apakah benar-benar dibutuhkan untuk use case kita?** Jika Anda menemukan ekstensi bernama `Selection` yang Anda instal, kemungkinan itu adalah ekstensi kustom atau ekstensi pihak ketiga. Fungsionalitas dasar manajemen seleksi sudah ada di Tiptap secara default. Jika tidak ada fitur spesifik yang secara eksplisit menggunakan API seleksi yang lebih canggih (misalnya, untuk membuat *custom selection tools*), maka ekstensi `Selection` yang terpisah mungkin tidak diperlukan.
-   **Apa overhead performance-nya?** Jika itu adalah ekstensi kustom atau pihak ketiga, overhead-nya akan tergantung pada implementasinya. Ekstensi yang tidak melakukan banyak pekerjaan atau tidak memiliki *event listeners* yang kompleks mungkin memiliki overhead minimal. Namun, setiap ekstensi menambah ukuran bundle dan kompleksitas, jadi audit selalu disarankan.
-   **Alternatif jika dihapus?** Fungsionalitas seleksi dasar akan tetap ada. Jika Anda membutuhkan kontrol lebih lanjut atas seleksi, Tiptap menyediakan API `editor.commands.setTextSelection()` atau `editor.state.selection` untuk berinteraksi dengan seleksi secara programatik [1].

### 5. Apa fungsi spesifik dari `Typography` extension?

`Typography` extension (`@tiptap/extension-typography`) menyediakan fitur *smart typography* yang secara otomatis mengubah karakter tertentu menjadi bentuk tipografi yang lebih estetis saat pengguna mengetik. Ini meningkatkan kualitas visual teks di editor [5].

-   **Fitur apa saja yang diaktifkan?** `Typography` extension secara default mengaktifkan transformasi untuk:
    -   *Smart quotes* (misalnya, `"teks"` menjadi `“teks”`)
    -   *Smart dashes* (misalnya, `--` menjadi `—`)
    -   *Ellipses* (misalnya, `...` menjadi `…`)
    -   *Fractions* (misalnya, `1/2` menjadi `½`)
    -   Dan beberapa transformasi tipografi lainnya [5].
-   **Apakah user aware dengan smart typography?** Seringkali pengguna tidak secara eksplisit menyadari fitur ini, tetapi mereka akan melihat teks yang lebih rapi. Penting untuk mempertimbangkan apakah perilaku otomatis ini sesuai dengan ekspektasi pengguna atau jika mereka membutuhkan kontrol lebih.
-   **Bagaimana disable fitur tertentu (e.g., smart quotes)?** `Typography` extension tidak menyediakan opsi konfigurasi untuk menonaktifkan fitur tertentu secara individual. Jika Anda hanya ingin sebagian dari fitur *smart typography* atau ingin mengontrolnya lebih lanjut, Anda mungkin perlu membuat ekstensi kustom yang hanya mengimplementasikan aturan tipografi yang Anda inginkan, atau menggunakan *input rules* secara manual [5].

### 6. Bagaimana cara optimal mengorganisir extension configuration untuk multiple editor instances?

Untuk aplikasi dengan banyak instansi editor atau editor dengan konfigurasi yang berbeda (misalnya, editor penuh vs. viewer read-only), mengorganisir konfigurasi ekstensi sangat penting untuk *maintainability* dan menghindari duplikasi [2].

-   **Pattern untuk shared vs unique extensions?**
    -   **Shared Extensions:** Buat array ekstensi terpisah untuk ekstensi yang digunakan di semua instansi editor. Ini bisa menjadi file `extensions.ts` atau `commonExtensions.ts`.
    -   **Unique Extensions:** Untuk ekstensi yang hanya digunakan di instansi tertentu, tambahkan secara langsung ke array ekstensi instansi tersebut, atau buat array ekstensi terpisah untuk setiap jenis editor (misalnya, `fullEditorExtensions.ts`, `readOnlyExtensions.ts`).
    -   **Contoh Struktur:**
        ```typescript
        // lib/tiptap/commonExtensions.ts
        import StarterKit from '@tiptap/starter-kit';
        import Highlight from '@tiptap/extension-highlight';

        export const commonExtensions = [
          StarterKit.configure({ /* ... */ }),
          Highlight.configure({ /* ... */ }),
          // ... ekstensi umum lainnya
        ];

        // lib/tiptap/editorExtensions.ts
        import TextAlign from '@tiptap/extension-text-align';
        import Image from '@tiptap/extension-image';
        import { commonExtensions } from './commonExtensions';

        export const editorExtensions = [
          ...commonExtensions,
          TextAlign.configure({ /* ... */ }),
          Image.configure({ /* ... */ }),
          // ... ekstensi khusus editor
        ];

        // lib/tiptap/viewerExtensions.ts
        import { commonExtensions } from './commonExtensions';

        export const viewerExtensions = [
          ...commonExtensions,
          // Viewer mungkin tidak memerlukan semua ekstensi editor
          // Misalnya, Image mungkin hanya perlu dirender, tidak diupload
        ];
        ```
-   **Bagaimana handle conditional extensions (e.g., Image hanya di editor, tidak di viewer)?** Anda dapat membuat set ekstensi yang berbeda untuk editor dan viewer, seperti contoh di atas. Untuk viewer, Anda mungkin hanya perlu mengaktifkan ekstensi `Image` tanpa fungsionalitas upload, atau bahkan menghilangkannya jika tidak ada kebutuhan untuk merender gambar di viewer. Pastikan ekstensi yang digunakan di viewer hanya untuk *rendering* dan tidak mengaktifkan *input rules* atau *commands* yang tidak relevan [2].

## 3. Image Upload & Media Handling

### 7. Bagaimana cara mengimplementasi Image upload dengan Tiptap?

Implementasi *image upload* di Tiptap melibatkan beberapa langkah untuk menangani proses dari pemilihan gambar hingga penyimpanannya [6].

-   **Apakah menggunakan `@tiptap/extension-image` atau custom node?**
    -   **`@tiptap/extension-image`:** Ini adalah titik awal yang baik. Ekstensi ini menyediakan node `Image` dasar yang dapat menampilkan gambar dari URL. Anda dapat mengkonfigurasinya untuk menerima atribut `src` [6].
    -   **Custom Node:** Untuk fungsionalitas yang lebih canggih (misalnya, menampilkan *progress bar* saat upload, *placeholder* gambar, atau *error states*), Anda mungkin perlu membuat *custom Image Node* atau *Node View*. Ini memungkinkan Anda untuk memiliki kontrol penuh atas rendering dan perilaku gambar selama proses upload [6].
-   **Bagaimana handle upload progress?** Jika menggunakan *custom Node View*, Anda dapat mengelola state upload (misalnya, `uploading`, `uploaded`, `error`) di dalam komponen React untuk *Node View* tersebut. Saat gambar diupload, Anda dapat memperbarui atribut node dengan URL sementara atau *base64* dan kemudian menggantinya dengan URL final setelah upload selesai. *Progress bar* dapat ditampilkan berdasarkan state upload [6].
-   **Bagaimana handle image resize/crop di editor?** Tiptap tidak menyediakan fungsionalitas *resize/crop* secara *built-in*. Anda perlu mengintegrasikan pustaka pihak ketiga untuk *image manipulation*. Ini biasanya melibatkan:
    1.  Mendeteksi klik pada gambar di editor.
    2.  Membuka modal atau *popover* dengan alat *resize/crop*.
    3.  Setelah pengguna selesai, upload gambar yang diubah ke server dan perbarui atribut `src` node `Image` di editor.
-   **Best practice untuk image storage (base64 vs URL)?**
    -   **Base64:** Tidak direkomendasikan untuk gambar besar karena akan membuat ukuran dokumen JSON/HTML sangat besar, memperlambat editor, dan meningkatkan konsumsi memori. Cocok untuk ikon kecil atau gambar yang sangat kecil.
    -   **URL:** Ini adalah praktik terbaik. Upload gambar ke *storage service* (misalnya, S3, Cloudinary) dan simpan URL gambar di atribut `src` node `Image`. Ini menjaga dokumen editor tetap ringan dan memungkinkan *caching* browser [6].

### 8. Bagaimana cara mengimplementasi drag-and-drop image upload?

*Drag-and-drop image upload* dapat diimplementasikan dengan menggabungkan `Image` extension dengan *input rules* atau *paste rules* kustom, atau dengan menggunakan *Node View* kustom [6].

-   **Apakah perlu custom extension?** Ya, Anda kemungkinan besar akan memerlukan ekstensi kustom yang menangani *drop event*. Ekstensi ini akan mendengarkan event `handleDrop` atau `handlePaste` dari ProseMirror. Ketika file gambar di-drop atau di-paste, ekstensi akan mencegat event tersebut, memulai proses upload, dan menyisipkan *placeholder* atau node gambar dengan URL sementara [6].
-   **Bagaimana integrate dengan existing upload service?** Di dalam *custom extension* atau *Node View* Anda, Anda akan memanggil fungsi *upload service* Anda. Fungsi ini akan menerima file gambar, menguploadnya ke *backend*, dan mengembalikan URL gambar yang di-host. Setelah URL diterima, Anda akan memperbarui atribut `src` dari node gambar di editor [6].

## 4. Content Versioning & History

### 9. Bagaimana cara mengimplementasi proper content versioning?

*Content versioning* adalah fitur penting untuk melacak perubahan dokumen dan memungkinkan pengguna untuk melihat atau mengembalikan ke versi sebelumnya [7].

-   **Apakah version increment di client atau server?** Sebaiknya *version increment* dilakukan di **server**. Server adalah sumber kebenaran untuk data Anda. Jika *increment* dilakukan di *client*, ada risiko *race conditions* atau inkonsistensi jika beberapa *client* mencoba menyimpan secara bersamaan [7].
-   **Bagaimana handle concurrent edits?** Untuk *concurrent edits*, Tiptap (melalui ProseMirror) sangat cocok dengan solusi kolaborasi seperti Hocuspocus atau Liveblocks. Solusi ini menggunakan *Operational Transformation (OT)* atau *Conflict-free Replicated Data Types (CRDTs)* untuk menggabungkan perubahan dari beberapa pengguna secara *real-time* dan menyelesaikan konflik secara otomatis. Jika tanpa kolaborasi *real-time*, Anda perlu menerapkan logika *optimistic locking* atau *last-write-wins* di *backend* Anda [7].
-   **Bagaimana store version history (full snapshot vs diff)?**
    -   **Full Snapshot:** Menyimpan seluruh konten dokumen setiap kali ada perubahan. Mudah diimplementasikan tetapi bisa sangat boros penyimpanan untuk dokumen besar atau sering berubah.
    -   **Diff (Perubahan Inkremental):** Menyimpan hanya perbedaan (delta) antara versi saat ini dan versi sebelumnya. Lebih efisien dalam penyimpanan tetapi membutuhkan logika yang lebih kompleks untuk merekonstruksi versi sebelumnya. ProseMirror memiliki konsep *transactions* dan *steps* yang dapat digunakan untuk merekam perubahan inkremental [7].

### 10. Bagaimana cara mengimplementasi undo/redo history yang persistent?

`History` extension Tiptap menyediakan fungsionalitas *undo/redo* di sisi *client*. Namun, ini tidak *persistent* setelah *page reload* atau penutupan browser [8].

-   **Apakah History extension sudah cukup?** Untuk *undo/redo* sesi saat ini, ya. Untuk *history* yang *persistent*, tidak. `History` extension hanya menyimpan riwayat transaksi di memori browser [8].
-   **Bagaimana save history ke backend?** Untuk *history* yang *persistent*, Anda perlu menyimpan setiap transaksi atau *snapshot* dokumen ke *backend*. Ini bisa dilakukan dengan:
    1.  **Menyimpan setiap transaksi ProseMirror:** Setiap kali ada perubahan, kirim *transaction* (atau *steps* yang terkandung di dalamnya) ke *backend*. Ini adalah pendekatan yang paling efisien untuk penyimpanan tetapi membutuhkan *backend* yang dapat merekonstruksi dokumen dari urutan *steps*.
    2.  **Menyimpan *snapshot* dokumen secara berkala:** Simpan seluruh konten JSON dokumen ke *backend* pada interval tertentu atau setelah setiap *significant change*. Ini lebih mudah diimplementasikan tetapi lebih boros penyimpanan [7].
-   **Bagaimana restore history setelah page reload?** Jika Anda menyimpan *snapshots* dokumen, Anda dapat memuat versi dokumen yang diinginkan dari *backend*. Jika Anda menyimpan *transactions/steps*, Anda perlu memuat *base document* dan kemudian menerapkan semua *steps* yang relevan secara berurutan untuk merekonstruksi versi yang diinginkan [7].

## 5. Auto-save & Dirty State

### 11. Bagaimana cara mengimplementasi auto-save yang optimal?

*Auto-save* adalah fitur penting untuk mencegah kehilangan data. Implementasi yang optimal menyeimbangkan antara frekuensi penyimpanan dan performa [9].

-   **Debounce interval yang ideal?** Interval *debounce* yang umum adalah antara **2 hingga 5 detik**. Ini cukup sering untuk mencegah kehilangan data yang signifikan tetapi tidak terlalu sering sehingga membebani *backend* atau mengganggu pengalaman pengguna dengan *loading indicators* yang konstan. Anda dapat menggunakan fungsi *debounce* dari pustaka utilitas seperti Lodash [9].
-   **Apakah save ke localStorage atau backend?**
    -   **`localStorage`:** Ideal untuk *draft* sementara atau sebagai *fallback* jika koneksi *offline*. Cepat dan tidak membebani *server*. Namun, data terbatas pada browser pengguna dan tidak dapat diakses dari perangkat lain atau setelah *browser cache* dihapus.
    -   **Backend:** Ini adalah metode penyimpanan utama untuk data *persistent*. Memastikan data aman, dapat diakses dari mana saja, dan mendukung kolaborasi. Kombinasi keduanya (auto-save ke `localStorage` sebagai *backup* dan ke *backend* untuk *persistence*) adalah praktik terbaik [9].
-   **Bagaimana handle conflict antara auto-save dan manual save?** Jika Anda memiliki *auto-save* dan *manual save*, pastikan *manual save* selalu memicu penyimpanan segera dan mungkin mereset *timer debounce* *auto-save*. Jika ada potensi *concurrent edits* (misalnya, pengguna mengedit di dua tab berbeda), Anda perlu strategi resolusi konflik di *backend* (misalnya, *last-write-wins* atau *merge conflicts* jika menggunakan OT/CRDT) [7].

### 12. Bagaimana cara track dirty state (unsaved changes)?

Melacak *dirty state* (perubahan yang belum disimpan) penting untuk memberikan peringatan kepada pengguna sebelum mereka kehilangan pekerjaan [9].

-   **Apakah menggunakan `editor.on("update")` event?** Ya, ini adalah cara utama. Anda dapat mendengarkan event `update` dari instansi editor. Setiap kali konten berubah, Anda dapat menandai editor sebagai 
*dirty* (misalnya, `setDirty(true)`).
-   **Bagaimana compare initial content vs current content?** Ini adalah cara yang lebih kuat untuk melacak *dirty state*. Anda dapat menyimpan *snapshot* konten awal saat editor dimuat. Kemudian, pada setiap event `update`, Anda membandingkan konten saat ini (misalnya, menggunakan `editor.getJSON()`) dengan *snapshot* awal. Jika berbeda, editor *dirty*. Ini lebih akurat daripada hanya mendengarkan event `update` karena pengguna mungkin melakukan *undo* kembali ke konten awal, yang seharusnya mereset *dirty state* [9].
-   **Bagaimana handle `beforeunload` event di Next.js App Router?** Di Next.js App Router, Anda dapat menggunakan hook `useBeforeUnload` (atau mengimplementasikannya sendiri) untuk menampilkan dialog konfirmasi browser standar jika ada perubahan yang belum disimpan.
    ```typescript
    import { useEffect } from 'react';

    const useUnsavedChangesWarning = (isDirty: boolean) => {
      useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
          if (isDirty) {
            e.preventDefault();
            e.returnValue = ''; // Diperlukan untuk Chrome
          }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
      }, [isDirty]);
    };
    ```

## 6. Keyboard Shortcuts & Accessibility

### 13. Bagaimana cara menampilkan keyboard shortcut hints di UI?

Menampilkan *keyboard shortcut hints* meningkatkan *discoverability* fitur editor bagi pengguna *power users* [10].

-   **Pattern untuk tooltip dengan shortcut info?** Pola yang umum adalah menambahkan *tooltip* pada tombol toolbar yang relevan. *Tooltip* ini akan menampilkan nama aksi dan *shortcut*-nya (misalnya, "Bold (Cmd+B)").
-   **Bagaimana detect OS (Mac vs Windows) untuk Mod key?** Anda dapat menggunakan utilitas sederhana untuk mendeteksi OS pengguna dan menampilkan `Cmd` untuk Mac dan `Ctrl` untuk Windows/Linux.
    ```javascript
    const isMac = typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false;
    const modKey = isMac ? 'Cmd' : 'Ctrl';
    ```
-   **Contoh implementasi dari aplikasi lain (Notion, Google Docs)?** Aplikasi seperti Notion dan Google Docs sering kali memiliki menu bantuan atau modal khusus yang mencantumkan semua *shortcuts* yang tersedia, dikelompokkan berdasarkan kategori (misalnya, Pemformatan Teks, Navigasi, dll.).

### 14. Bagaimana cara membuat keyboard shortcut legend/help modal?

Modal bantuan *shortcut* adalah cara yang bagus untuk memberikan referensi lengkap kepada pengguna [10].

-   **Apakah perlu extract shortcuts dari extensions?** Ya, Anda dapat mengekstrak *shortcuts* yang didefinisikan dalam ekstensi Tiptap Anda. Tiptap tidak menyediakan API langsung untuk mendapatkan semua *shortcuts* yang terdaftar, jadi Anda mungkin perlu memelihara daftar *shortcuts* secara manual di konfigurasi aplikasi Anda atau mengekstraknya dari definisi ekstensi jika memungkinkan.
-   **Bagaimana organize shortcuts by category?** Kelompokkan *shortcuts* secara logis (misalnya, "Basic Formatting", "Block Elements", "Navigation") dalam modal bantuan Anda untuk memudahkan pencarian.

### 15. Bagaimana cara mengimplementasi accessibility yang baik untuk Tiptap editor?

Aksesibilitas (a11y) memastikan bahwa editor dapat digunakan oleh semua orang, termasuk mereka yang menggunakan *screen readers* atau navigasi keyboard [11].

-   **ARIA attributes apa saja yang perlu ditambahkan?**
    -   `aria-label` atau `aria-labelledby` pada elemen editor utama untuk memberikan konteks kepada *screen readers*.
    -   `aria-pressed` atau `aria-expanded` pada tombol toolbar untuk menunjukkan status aktif (misalnya, tombol Bold ditekan).
    -   `role="toolbar"` pada kontainer toolbar dan `role="button"` pada item toolbar [11].
-   **Bagaimana handle screen reader untuk rich text content?** ProseMirror (dan dengan ekstensi Tiptap) secara umum menangani rendering konten *rich text* dengan elemen HTML semantik (misalnya, `<strong>`, `<em>`, `<h1>`), yang dapat dibaca dengan baik oleh *screen readers*. Pastikan Anda menggunakan ekstensi yang menghasilkan HTML semantik yang benar [11].
-   **Bagaimana handle keyboard navigation untuk toolbar?** Pengguna harus dapat menavigasi toolbar menggunakan tombol Tab dan panah. Anda mungkin perlu mengimplementasikan logika navigasi keyboard kustom (misalnya, menggunakan pola *roving tabindex*) jika Anda membangun toolbar kustom yang kompleks [11].

## 7. Link Handling

### 16. Bagaimana cara mengimplementasi "Ctrl+Click to open link" di editor mode?

Secara default, Tiptap's `Link` extension mungkin membuka tautan saat diklik, yang bisa mengganggu saat mengedit. Mengubah perilaku ini menjadi "Ctrl+Click" (atau Cmd+Click di Mac) adalah praktik UX yang umum [12].

-   **Apakah perlu custom extension?** Anda dapat mengkonfigurasi ekstensi `Link` bawaan. Setel `openOnClick: false` dalam konfigurasi ekstensi.
-   **Bagaimana detect Ctrl+Click vs regular click?** Anda perlu menambahkan *event listener* kustom ke editor (misalnya, menggunakan `editorProps.handleDOMEvents`) untuk mendeteksi klik pada elemen tautan (`<a>`). Periksa apakah `event.ctrlKey` atau `event.metaKey` ditekan saat klik terjadi. Jika ya, buka tautan; jika tidak, biarkan Tiptap menangani klik (misalnya, untuk menempatkan kursor) [12].
-   **Bagaimana show tooltip hint?** Anda dapat menggunakan CSS kustom atau komponen *tooltip* React untuk menampilkan pesan "Ctrl+Click to open" saat pengguna mengarahkan kursor ke tautan di editor.

### 17. Bagaimana cara mengimplementasi link preview/edit popover?

*Popover* yang muncul saat tautan diklik atau di-hover memungkinkan pengguna untuk mengedit atau menghapus tautan dengan mudah [12].

-   **Pattern untuk in-editor popover?** Anda dapat menggunakan pustaka seperti `tippy.js` (yang sering digunakan dengan Tiptap) atau komponen *popover* dari pustaka UI Anda (misalnya, Radix UI, Material-UI). *Popover* ini harus diposisikan relatif terhadap elemen tautan yang aktif.
-   **Bagaimana handle external vs internal links?** *Popover* Anda dapat memiliki logika untuk membedakan antara tautan internal (misalnya, rute dalam aplikasi Anda) dan tautan eksternal. Anda mungkin ingin merender tautan internal menggunakan komponen `Link` dari framework Anda (misalnya, `next/link`) untuk navigasi sisi klien yang lebih cepat, sementara tautan eksternal menggunakan tag `<a>` standar dengan `target="_blank"`.

## 8. Content Preview Generation

### 18. Bagaimana cara generate accurate content preview dari Tiptap JSON?

Menghasilkan pratinjau teks biasa dari konten *rich text* berguna untuk daftar artikel atau ringkasan [13].

-   **Apakah menggunakan `getText()` atau custom parser?**
    -   `editor.getText()`: Ini adalah cara termudah untuk mendapatkan teks biasa dari editor yang sedang berjalan. Namun, ini mengharuskan editor diinisialisasi, yang mungkin tidak ideal untuk menghasilkan pratinjau di sisi server atau dalam daftar yang panjang.
    -   **Custom Parser:** Untuk performa terbaik, terutama di sisi server, Anda dapat menulis fungsi utilitas sederhana yang melintasi struktur JSON Tiptap secara rekursif dan mengekstrak teks dari node `text`, mengabaikan pemformatan dan struktur blok [13].
-   **Bagaimana preserve structure (headings, lists) di preview?** Jika Anda ingin mempertahankan beberapa struktur (misalnya, menambahkan spasi antara paragraf atau mengubah item daftar menjadi teks dengan *bullet*), *custom parser* Anda perlu menangani jenis node tertentu secara berbeda (misalnya, menambahkan `\n` setelah node `paragraph` atau `heading`) [13].
-   **Bagaimana handle truncation dengan ellipsis?** Setelah Anda mengekstrak teks biasa, Anda dapat memotongnya ke panjang yang diinginkan (misalnya, 200 karakter) dan menambahkan elipsis (`...`) jika teks aslinya lebih panjang.

## 9. Advanced Features (Future)

### 19. Bagaimana cara mengimplementasi Table extension?

Tabel adalah fitur kompleks dalam editor *rich text* [14].

-   **Apakah menggunakan `@tiptap/extension-table`?** Ya, Tiptap menyediakan serangkaian ekstensi untuk tabel (`Table`, `TableRow`, `TableCell`, `TableHeader`). Ini adalah cara yang disarankan untuk mengimplementasikan tabel.
-   **Bagaimana handle table resize/merge cells?** Ekstensi tabel Tiptap mendukung pengubahan ukuran kolom (dengan ekstensi tambahan) dan penggabungan sel. Namun, UI untuk interaksi ini (misalnya, *drag handles* untuk mengubah ukuran, menu konteks untuk menggabungkan) sering kali perlu dibangun secara kustom atau menggunakan pustaka UI pihak ketiga yang terintegrasi dengan Tiptap [14].
-   **Performance impact untuk large tables?** Tabel besar dapat berdampak signifikan pada performa rendering, terutama jika Anda memiliki banyak *Node Views* kustom di dalam sel tabel. Optimasi seperti `shouldRerenderOnTransaction: false` (lihat Pertanyaan 2) dan meminimalkan kompleksitas komponen di dalam sel sangat penting [2].

### 20. Bagaimana cara mengimplementasi Collaboration (real-time editing)?

Kolaborasi *real-time* memungkinkan beberapa pengguna mengedit dokumen yang sama secara bersamaan [15].

-   **Apakah menggunakan Hocuspocus atau Liveblocks?**
    -   **Hocuspocus:** Ini adalah *backend* kolaborasi resmi dari pembuat Tiptap, dibangun di atas Yjs. Ini sangat terintegrasi dengan Tiptap dan menawarkan kontrol penuh jika Anda *self-host*.
    -   **Liveblocks:** Ini adalah layanan kolaborasi yang dikelola sepenuhnya yang juga terintegrasi dengan baik dengan Tiptap (melalui Yjs). Ini lebih mudah diatur karena Anda tidak perlu mengelola infrastruktur *backend* sendiri, tetapi ini adalah layanan berbayar [15].
-   **Bagaimana handle conflict resolution?** Baik Hocuspocus maupun Liveblocks menggunakan Yjs di bawah tenda, yang merupakan implementasi CRDT (*Conflict-free Replicated Data Type*). CRDT secara otomatis menangani resolusi konflik tanpa memerlukan server pusat untuk menengahi, memastikan bahwa semua klien pada akhirnya mencapai status dokumen yang sama [15].
-   **Infrastructure requirements?** Jika menggunakan Hocuspocus, Anda perlu menjalankan server Node.js (atau *backend* lain yang didukung) yang dapat menangani koneksi WebSocket yang persisten. Jika menggunakan Liveblocks, infrastruktur dikelola oleh mereka [15].

### 21. Bagaimana cara mengimplementasi Comments/Annotations?

Komentar memungkinkan pengguna untuk berdiskusi tentang bagian spesifik dari dokumen [16].

-   **Apakah menggunakan custom marks?** Ya, komentar biasanya diimplementasikan sebagai *custom Mark* di Tiptap. Mark ini akan membungkus teks yang dikomentari dan menyimpan ID unik untuk komentar tersebut sebagai atribut [16].
-   **Bagaimana store comment data?** Data komentar yang sebenarnya (teks komentar, penulis, waktu, balasan) biasanya tidak disimpan di dalam dokumen Tiptap itu sendiri. Sebaliknya, dokumen hanya menyimpan ID komentar (melalui *custom Mark*), dan data komentar disimpan secara terpisah di *database* Anda. Ini menjaga dokumen tetap bersih dan memungkinkan Anda untuk memuat dan mengelola komentar secara independen [16].
-   **UI pattern untuk comment threads?** Pola UI yang umum adalah menampilkan sorotan visual pada teks yang dikomentari di editor. Saat pengguna mengklik teks yang disorot, *sidebar* atau *popover* muncul menampilkan utas komentar yang terkait dengan ID tersebut, memungkinkan mereka untuk membaca, membalas, atau menyelesaikan komentar [16].

## References

1.  [Tiptap Docs: React Performance](https://tiptap.dev/docs/examples/advanced/react-performance)
2.  [Tiptap Docs: Integration Performance](https://tiptap.dev/docs/editor/guides/performance)
3.  [Tiptap GitHub Issue: Memory leak when discarding used editors](https://github.com/ueberdosis/tiptap/issues/5654)
4.  [Tiptap Docs: Commands (Selection)](https://tiptap.dev/docs/editor/api/commands)
5.  [Tiptap Docs: Typography Extension](https://tiptap.dev/docs/editor/api/extensions/typography)
6.  [Tiptap Docs: Image Extension](https://tiptap.dev/docs/editor/extensions/nodes/image)
7.  [Tiptap Docs: Collaboration Overview](https://tiptap.dev/docs/collaboration/getting-started/overview)
8.  [Tiptap Docs: History Extension](https://tiptap.dev/docs/editor/api/extensions/history)
9.  [Tiptap Docs: Export to JSON and HTML](https://tiptap.dev/docs/guides/output-json-html)
10. [Tiptap Docs: Keyboard Shortcuts](https://tiptap.dev/docs/editor/core-concepts/keyboard-shortcuts)
11. [Tiptap Docs: Accessibility](https://tiptap.dev/docs/guides/accessibility)
12. [Tiptap Docs: Link Extension](https://tiptap.dev/docs/editor/api/extensions/link)
13. [Tiptap Docs: Custom Markdown Serializing](https://tiptap.dev/docs/editor/markdown/advanced-usage/custom-serializing)
14. [Tiptap Docs: Table Extension](https://tiptap.dev/docs/editor/api/extensions/table)
15. [Hocuspocus Docs: Collaborative Editing](https://tiptap.dev/docs/hocuspocus/guides/collaborative-editing)
16. [Tiptap Docs: Comments](https://tiptap.dev/docs/comments/getting-started/overview)
