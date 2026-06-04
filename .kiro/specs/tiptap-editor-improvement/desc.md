Baik, berikut list task/feature yang perlu dikerjakan di spec **Tiptap Editor Improvement**:

---

## 📋 **Phase 1: Critical Fixes (P0)** - 4 Features

### **Feature 1: Version Tracking Fix**
Fix bug version lesson yang hardcoded `version: 1`. Server sudah benar increment version, tinggal hapus hardcode di client.

### **Feature 2: Unsaved Changes Warning**
Buat warning sebelum user kehilangan perubahan yang belum disimpan (browser warning + custom dialog).

### **Feature 3: Image Upload**
Implementasi upload gambar ke Supabase Storage dengan validasi (max 5MB, format JPG/PNG/GIF/WebP).

### **Feature 4: Auto-save to localStorage**
Auto-save draft setiap 10 detik ke localStorage dengan restore prompt saat buka editor lagi.

---

## 🚀 **Phase 2: Performance & UX (P1)** - 3 Features

### **Feature 5: Component Memoization**
Wrap komponen dengan `React.memo` untuk prevent unnecessary re-renders (DnD lebih smooth).

### **Feature 6: Keyboard Shortcut Hints**
Tambahkan tooltips di toolbar buttons yang menampilkan keyboard shortcuts (Ctrl+B, Ctrl+I, dll).

### **Feature 7: Link Behavior Enhancement**
Implementasi Ctrl+Click untuk buka link di tab baru + tooltip "Ctrl+Click untuk membuka".

---

## 🧹 **Phase 3: Code Quality (P2)** - 5 Features

### **Feature 8: Extension Centralization**
Sentralisasi semua Tiptap extensions ke satu file `lib/tiptap/extensions.ts`.

### **Feature 9: DRY Utilities**
Extract duplicate code ke utility functions (`getDifficultyColor`, `getErrorMessage`).

### **Feature 10: ManageContent Split**
Pecah god component ManageContent.tsx (~400 lines) menjadi komponen-komponen kecil (<100 lines).

### **Feature 11: Content Preview Generation**
Buat utility untuk generate preview text dari Tiptap JSON (untuk lesson list).

### **Feature 12: Prop Drilling Reduction**
Kurangi props SortableSectionItem dari 20+ menjadi ≤10 dengan grouping ke objects.

---

## 📊 **Summary**

| Phase | Features | Priority | Focus |
|-------|----------|----------|-------|
| **Phase 1** | 4 features | P0 (Critical) | Bug fixes & core features |
| **Phase 2** | 3 features | P1 (High) | Performance & UX |
| **Phase 3** | 5 features | P2 (Medium) | Code quality & refactoring |
| **Total** | **12 features** | | |

---

## 🎯 **Testing per Feature**

Setiap feature akan melalui:
1. ✅ **Research** - Baca dokumentasi dulu
2. ✅ **Implementation** - Coding
3. ✅ **Unit Test** - Test logic
4. ✅ **API Test** (jika ada backend) - Test endpoint
5. ✅ **E2E Test** - Test user flow
6. ✅ **Verification** - Manual check

---

**Estimasi:** Phase 1 paling penting (critical bugs), Phase 2 improve UX, Phase 3 clean up code. Total ~12 features dengan comprehensive testing! 🚀