Saya akan scan semua file frontend CMS untuk analisis menyeluruh.

Analisis lengkap sudah selesai. Ini temuan utamanya berdasarkan 6 rules dari brainstorm.md:

---

**Yang sudah bagus ✅**
- Hooks terpisah dari components — separation of concerns sudah ada
- Context API dipakai untuk avoid prop drilling di level atas
- `React.memo` sudah ditambahkan di ProgressBar, CourseNavigation, LessonNavigation (task 17.3)
- Lesson cache di `useLessonLearn` sudah ada

---

**Yang perlu diperbaiki, diurutkan prioritas:**

**High Priority — DRY violations:**
- Difficulty color mapping duplikat di 3 file (`CourseCard`, `CourseOverviewHero`, `CourseListItem`) → extract ke 1 utility
- Error toast pattern `err instanceof Error ? err.message : 'Gagal...'` muncul 15+ kali → extract ke helper

**High Priority — Prop drilling:**
- `SortableSectionItem` di `ManageSidebar.tsx` menerima **20+ props** — ini yang paling parah. Seharusnya pakai context atau setidaknya grouping props

**High Priority — God component:**
- `ManageContent.tsx` ~400 baris dengan 4 sub-komponen nested di 1 file → perlu dipecah

**Medium Priority — Missing memoization:**
- `SortableSectionItem` dan `SortableLessonItem` tidak di-memo — dengan DnD ini akan re-render berat
- `CourseCard` tidak di-memo — re-render di list

**Medium Priority — KISS:**
- `ManageContext.tsx` mengelola 15+ state dan 20+ handler — terlalu besar, bisa dipecah

---

Mau mulai dari mana? Rekomendasi saya: mulai dari yang **impact tinggi, effort rendah** — yaitu extract utility DRY (difficulty colors + error toast helper), lalu memoize `SortableSectionItem`. Atau kalau mau refactor besar, mulai dari pecah `ManageContent.tsx`.