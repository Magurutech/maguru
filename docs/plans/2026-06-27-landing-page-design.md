# Design Plan: Maguru Landing Page Improvement

**Date:** 2026-06-27  
**Arah Desain:** Editorial-First "Craft-Tech" (Atelier Zero Style)  
**Status:** Approved (Pending Implementation)

---

## 1. Architectural Structure

Sesuai dengan `docs/rules/architecture.md`, komponen landing page baru akan ditempatkan secara modular di dalam `features/homepage/components/` (plural) dan dikonsumsi oleh `app/page.tsx`.

### File-File Baru yang Akan Dibuat:
1. **`features/homepage/components/NavbarGlass.tsx`**:
   - Menu navigasi melayang transparan glassmorphic.
   - Logo Maguru menggunakan `public/page/icon.png`.
   - Toggle theme switch (Terang/Gelap) menggunakan `next-themes`.
2. **`features/homepage/components/AIChatbotSimulator.tsx`**:
   - Komponen visual Chatbot di sisi kanan dengan mockup chat interaktif.
   - 3 Tombol pertanyaan cepat ("Perbaiki bug kode", "Jelaskan Rekursi", "Cara submit proyek").
   - Efek pengetikan teks (typing effect) dan indikator loading AI 3 titik memantul.
   - Mini Assessment Kuis 1 soal pilihan ganda di dalam chatbot.
3. **`features/homepage/components/LandingPageNew.tsx`**:
   - Tata letak utama halaman (Hero section, Parallax container, Tiga Pilar Grid).
   - Memutar video background `public/page/motion.mp4` dengan rasio parallax `0.45x`.
   - Penanganan event mouse 3D Tilt secara inline untuk 3 kartu pilar utama.
4. **`app/page.tsx`**:
   - File entri utama yang mengimpor dan memuat `<LandingPageNew />`.

---

## 2. Visual & Interaction Details

### A. Background Video Parallax
* Video `public/page/motion.mp4` dirender secara absolut di belakang konten Hero.
* Translate scroll dihitung secara native:
  ```javascript
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  ```
* Video digeser menggunakan inline style: `transform: translateY(${scrollY * 0.45}px)`.
* Opacity diatur halus (`opacity: 0.14` di Light mode, `opacity: 0.10` di Dark mode) untuk menjamin kontras teks memenuhi standar WCAG AA (4.5:1).

### B. 3D Tilt Cards (Three Pillars)
* Grid berisi 3 kartu fitur utama menggunakan `.depth-card-container` and `.depth-card` yang telah didefinisikan di `globals.css`.
* Logika perhitungan posisi mouse inline untuk kemiringan 3D (maksimal 12 derajat) diikat langsung pada elemen card:
  ```typescript
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotateX = -12 * (y / (box.height / 2));
    const rotateY = 12 * (x / (box.width / 2));
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
  };
  ```

### C. Chatbot Simulator & Micro-Assessment
* **Chatbot UI**: Tampilan mockup chat modern, tombol aksi cepat di bagian bawah.
* **Typing Animation**: Logika state array untuk pesan chat yang diaktifkan berurutan dengan jeda ketikan.
* **Micro-Assessment**: Kuis 1 soal di dalam chat flow. Apabila user memilih opsi yang benar, status chat berganti menjadi sukses dan tombol CTA Coral utama *"Mulai Asesmen Kompetensi (Gratis)"* meluncur naik (fade-in & slide-up).

---

## 3. Implementation Checklist

- [ ] Buat file `NavbarGlass.tsx`.
- [ ] Buat file `AIChatbotSimulator.tsx` (termasuk visual simulator chatbot & kuis).
- [ ] Buat file `LandingPageNew.tsx` (termasuk parallax background video & 3D tilt cards).
- [ ] Perbarui `app/page.tsx` untuk menggunakan komponen baru.
- [ ] Bersihkan/hapus folder lama `features/homepage/component`.
- [ ] Jalankan type checking (`npm run type-check`) untuk verifikasi keberhasilan integrasi.
