## **Instruksi Rules UI/UX Theme & Consistency Maguru**

### **A. Prinsip Umum**

- **Theme:** Soft Glass-Neu (blur-glass untuk panel/card, neumorphism untuk tombol/form, flat untuk data).
- **Komponen:** Gunakan Shadcn UI terlebih dahulu, custom hanya jika tidak tersedia.
- **Token:** Semua warna, radius, shadow, font didefinisikan di Tailwind config.

### **B. Warna Branding**

- **Primary:** `#8C4FFF` (Maguru Purple)
- **Secondary:** `#4D90FE` (Soft Blue)
- **Accent:** `#2DD897` (Mint Green), `#FF9F1C` (Warm Orange)
- **Status:** Success, Warning, Error, Info sesuai tabel di dokumen.
- **Surface:** Gunakan rgba/opacity untuk efek glass.
- **Text:** Putih untuk dark surface, soft grey untuk secondary.

### **C. Font Family**

- **Sans-serif:** Poppins (utama, heading, body)
- **Serif:** Playfair Display (opsional, heading/quotes)
- **Monospace:** Fira Code (code/data)

### **D. Border Radius & Shadow**

- **Radius:** Default Tailwind, gunakan `rounded-lg` untuk card/panel, `rounded-full` untuk elemen bulat.
- **Shadow:**
  - `shadow-glass` untuk panel utama (0 4px 20px rgba(0,0,0,0.1))
  - `shadow-neu` untuk tombol/form (dual shadow neumorphic)
  - `shadow-sm`/`shadow-none` untuk data card

### **E. Spacing & Layout**

- **Gunakan scale 4px:** `space-4`, `space-8`, dst.
- **Padding/gap:** Ikuti skala Tailwind, gunakan `p-4`, `gap-4`, dst.

### **F. Animasi & Transisi**

- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Durasi:** 150ms (micro), 300ms (modal/panel)
- **Properti:** `opacity`, `transform` (hindari width/height)

### **G. State & Aksesibilitas**

- **Hover:** Lighten gradient/naikkan shadow.
- **Focus:** Outline 2px solid `#8C4FFF`, offset 2px.
- **Input focus:** Border `#8C4FFF`, inner glow lembut.
- **Kontras:** Minimal 4.5:1, gunakan aria-label, skip links.

### **H. Ikon**

- **Heroicons:** Install via `@heroicons/react`, gunakan sebagai React component.

---

## **Contoh Implementasi di `app/page.tsx`**

- Gunakan `<Button className="shadow-neu bg-primary text-white ...">...</Button>`
- Card dengan `shadow-glass`, background glass (`bg-[rgba(255,255,255,0.15)]` + `backdrop-blur`)
- Input dengan border dan focus sesuai aturan
- Spacing antar elemen dengan `gap-4`, `p-4`, dsb.

---

## **Kesimpulan**

Dengan aturan di atas, seluruh tim Maguru dapat:

- Mengimplementasikan UI yang konsisten, modern, dan mudah di-scale.
- Menggunakan token yang sudah didefinisikan di Tailwind config.
- Mengikuti prinsip “Shadcn UI first”, dan hanya custom jika perlu.
