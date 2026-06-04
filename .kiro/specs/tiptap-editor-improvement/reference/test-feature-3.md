# Manual Testing: Feature 2 - Unsaved Changes Warning

**Feature:** Unsaved Changes Warning  
**Browser:** Chrome Desktop  
**Bahasa:** Indonesia  
**Status:** ✅ Race Condition Fixed

---

## 🔧 Recent Fixes

### Race Condition Fix (2026-05-18)

- **Problem:** Dot indicator muncul sebelum user mengetik (false positive)
- **Problem:** Dot indicator muncul sebelum user mengetik (false positive)
- **Root Cause:** `initialTitle` dan `initialContent` di-initialize kosong, sedangkan `title` sudah punya cached value
- **Solution:**
  1. Initialize `initialTitle` dan `initialContent` dengan cached values dari `lessonsMap`
  2. Tambahkan `enabled` flag ke `useUnsavedChanges` hook
  3. Pass `enabled={!loadingLesson}` untuk skip dirty check saat loading
- **Tests:** ✅ 18/18 unit tests passing, ✅ 26/26 integration tests passing

### Save Button Disabled Logic (2026-05-18)

- **Improvement:** Save button disabled di edit mode jika tidak ada perubahan
- **Logic:** `disabled={saving || !title.trim() || (isEditMode && !isDirty)}`
- **Benefit:**
  - Mencegah unnecessary API calls
  - UX lebih jelas: button aktif = ada yang perlu disimpan
  - Konsisten dengan aplikasi modern (VS Code, Google Docs)
- **Tests:** ✅ 30/30 integration tests passing

---

## 📋 Setup

- [x] Jalankan `yarn dev`
- [x] Buka halaman manage course
- [x] Buka satu lesson untuk diedit
- [x] Pastikan editor terbuka dengan konten awal

---

## 🧪 Test Case Utama

### Test 0: Dot Indicator TIDAK Muncul Saat Load (Race Condition Fix)

**Langkah:**

1. [x] Buka editor lesson yang sudah ada (edit mode)
2. [x] Tunggu loading selesai
3. [x] **JANGAN ketik apapun**
4. [x] Lihat area tombol Save

**Expected:**

- [x] Dot indicator (•) **TIDAK** muncul
- [x] Tombol Save normal tanpa dot
- [x] Console log menunjukkan: `initialTitle` dan `title` sama

**Status:** [x] ✅ Pass [ ] ❌ Fail

**Notes:** Ini adalah test untuk memverifikasi race condition fix. Sebelumnya dot muncul langsung tanpa user mengetik.

---

### Test 1: Dot Indicator Muncul Saat Ada Perubahan

**Langkah:**

1. [x] Buka editor lesson (edit mode)
2. [x] Tunggu loading selesai
3. [x] **Verify:** Save button disabled (karena isDirty = false)
4. [x] Ketik teks baru di editor
5. [x] Lihat area tombol Save

**Expected:**

- [x] Dot indicator (•) muncul di dekat tombol Save
- [x] Muncul langsung setelah mengetik
- [x] Save button menjadi **enabled** (bisa diklik)

**Status:** [x] ✅ Pass [ ] ❌ Fail

---

### Test 1.1: Save Button Disabled di Edit Mode Tanpa Perubahan (NEW)

**Langkah:**

1. [x] Buka editor lesson yang sudah ada (edit mode)
2. [x] Tunggu loading selesai
3. [x] **JANGAN ketik apapun**
4. [x] Coba klik tombol Save

**Expected:**

- [x] Save button **disabled** (tidak bisa diklik)
- [x] Cursor berubah jadi "not-allowed" saat hover
- [x] Tidak ada dot indicator
- [ ] Tooltip (jika ada) menunjukkan "No changes to save"

**Status:** [x] ✅ Pass [ ] ❌ Fail

**Notes:** Ini mencegah unnecessary save tanpa perubahan.

---

### Test 1.2: Save Button Enabled di Create Mode (NEW)

**Langkah:**

1. [x] Klik "Add Lesson" untuk create lesson baru
2. [x] Ketik judul lesson
3. [x] **JANGAN ketik konten** (biarkan kosong)
4. [x] Lihat tombol Save

**Expected:**

- [x] Save button **enabled** (bisa diklik)
- [x] Bisa save meskipun isDirty = false
- [x] Karena create mode, tidak perlu ada perubahan untuk save

**Status:** [x] ✅ Pass [ ] ❌ Fail

---

### Test 2: Dot Indicator Hilang Setelah Save ( Disabled )

**Deskripsi :** Jadi setup kita saat klik save maka editor mode berubah menajdi viewer mode atau kembali ke mode view sehingga kita tidak dapat melihat apakah tombol save memiliki dot indicator atau tidak , tetapi pada saat kita edit pelajaran lagi maka dot indicator nya tidak ada  

**Langkah:**

1. [ ] Dengan dot indicator terlihat, klik tombol Save
2. [ ] Tunggu save selesai
3. [ ] Lihat area tombol Save

**Expected:**

- [ ] Dot indicator hilang
- [ ] Tombol Save kembali normal

**Status:** [ ] ✅ Pass [ ] ❌ Fail

---

### Test 3: Dot Indicator Hilang Setelah Cancel ( Disabled )

**Deskripsi :** Jadi setup kita saat klik cancel maka editor mode berubah menajdi viewer mode atau kembali ke mode view sehingga kita tidak dapat melihat apakah tombol save memiliki dot indicator atau tidak , tetapi pada saat kita edit pelajaran lagi maka dot indicator nya tidak ada  

**Langkah:**

1. [ ] Dengan dot indicator terlihat, klik tombol Cancel
2. [ ] Lihat area tombol Save

**Expected:**

- [ ] Dot indicator hilang
- [ ] Konten kembali ke state awal

**Status:** [ ] ✅ Pass [ ] ❌ Fail

---

### Test 4: Browser Warning Saat Refresh dengan Perubahan

**Langkah:**

1. [x] Buka editor lesson
2. [x] Ubah konten (pastikan dot indicator muncul)
3. [x] Tekan F5 untuk refresh
4. [x] Lihat dialog browser

**Expected:**

- [x] Browser menampilkan dialog "Leave site?"
- [x] Ada opsi "Leave" dan "Stay"
- [x] Klik "Stay" → halaman tetap, perubahan aman
- [x] Klik "Leave" → halaman refresh, perubahan hilang

**Status:** [x] ✅ Pass [ ] ❌ Fail

---

### Test 5: Browser Warning Saat Close Tab dengan Perubahan

**Langkah:**

1. [x] Buka editor lesson di tab
2. [x] Ubah konten (pastikan dot indicator muncul)
3. [x] Klik X untuk close tab
4. [x] Lihat dialog browser

**Expected:**

- [x] Browser menampilkan dialog "Leave site?"
- [x] Ada opsi "Leave" dan "Stay"

**Status:** [x] ✅ Pass [ ] ❌ Fail


---

### Test 6: Perubahan Title Juga Trigger Dirty State

**Langkah:**

1. [x] Buka editor lesson
2. [x] Ubah title lesson
3. [x] Lihat area tombol Save

**Expected:**

- [x] Dot indicator muncul
- [x] Muncul langsung setelah ubah title

**Status:** [x] ✅ Pass [ ] ❌ Fail

---

### Test 7: Undo Semua Perubahan Hilangkan Dirty State

**Langkah:**

1. [x] Buka editor lesson
2. [x] Ketik teks baru (dot indicator muncul)
3. [x] Tekan Ctrl+Z untuk undo
4. [x] Lihat area tombol Save

**Expected:**

- [x] Dot indicator hilang
- [x] Konten kembali ke awal

**Status:** [x] ✅ Pass [ ] ❌ Fail

---

