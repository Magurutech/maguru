# CMS Feature Issues & Future Enhancements

**Last Updated:** 2026-05-19  
**Status:** Active Tracking

---

## 🚀 Future Features (Backlog)

### Feature: Server-Side Draft System

**Priority:** **Should Have**  
**Complexity:** **High**  
**Effort:** 5-7 days  
**Dependencies:** Phase 1 localStorage Auto-Draft (must complete first)

#### Description

Implementasi server-side draft system untuk menyimpan draft lesson di database, memungkinkan sync antar device dan multi-user collaboration. Feature ini melengkapi localStorage auto-draft (Phase 1) dengan persistent storage yang lebih robust.

#### Problem Statement

**Current State (Phase 1 - localStorage):**

- ✅ Draft tersimpan di browser localStorage
- ✅ Protect dari kehilangan data saat refresh/crash
- ❌ Draft hilang jika clear browser data
- ❌ Tidak bisa sync antar device (laptop → HP)
- ❌ Tidak bisa diakses user lain (tim collaboration)

**Target State (Phase 2 - Server-Side):**

- ✅ Draft tersimpan di database (persistent)
- ✅ Sync antar device (edit di laptop, lanjut di HP)
- ✅ Multi-user access (tim bisa lihat draft)
- ✅ Aman dari clear browser data
- ✅ Draft versioning (optional: bisa restore ke draft sebelumnya)

#### Use Cases

1. **Multi-Device Editing**
   - User edit lesson di laptop → save draft
   - User buka HP dengan akun sama → draft muncul
   - User lanjut edit di HP → draft ter-update

2. **Network Failure Recovery**
   - User edit lesson → jaringan hilang
   - User refresh browser → localStorage draft load (Phase 1)
   - Jaringan kembali → draft sync ke server (Phase 2)

3. **Team Collaboration**
   - Creator A mulai edit lesson → save draft
   - Creator B (tim sama) buka lesson → lihat draft A
   - Creator B bisa lanjut edit atau buat draft sendiri

4. **Browser Data Clear**
   - User clear browser cache/data
   - localStorage draft hilang
   - User buka editor → server draft masih ada → restore


#### Related Features

- **Phase 1:** localStorage Auto-Draft (prerequisite)
- **Feature 2:** Unsaved Changes Warning (integration point)
- **Future:** Real-time collaboration (WebSocket-based)

---

## 📊 Priority Legend

- **Must Have:** Critical untuk MVP, blocking other features
- **Should Have:** Important tapi bisa ditunda, workaround available
- **Could Have:** Nice to have, low priority
- **Won't Have:** Out of scope untuk release ini

---