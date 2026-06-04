# Manual Testing Guide: Tiptap Editor Improvement

**Feature:** localStorage Auto-Draft (Feature 4)  
**Status:** Ready for Testing  
**Tester:** _[Nama Tester]_  
**Date:** _[Tanggal Testing]_

---

## Test 4: localStorage Auto-Draft

### Prerequisites

- Login sebagai user dengan akses creator
- Buka halaman `/creator/courses/[slug]/manage`
- Pastikan ada course dengan minimal 1 section

---

### Test 4.1: Auto-Save Draft (MUST) ✅

**Priority:** MUST  
**Requirements:** 4.1, 4.2, 4.3, 4.5

**Steps:**

1. Klik "Edit" pada lesson yang sudah ada
2. Ubah title lesson → ketik "Draft Title Test"
3. Ubah content editor → ketik beberapa paragraf baru
4. **Tunggu 5 detik** tanpa melakukan perubahan lain
5. Perhatikan area di sebelah kanan tombol Save/Cancel

**Expected Result:**

- ✅ Setelah 5 detik, muncul **toast notification** di kanan bawah layar
- ✅ Toast message: 💾 "Draft tersimpan pada HH:MM:SS"
- ✅ Toast hilang otomatis setelah beberapa detik
- ✅ **TIDAK ADA** indicator permanen di header

**Actual Result:**

- [ ] Pass / [ ] Fail

**Notes:**

```
[Catatan jika ada issue atau observasi penting]
```

---

### Test 4.2: Draft Auto-Restore on Browser Reopen (MUST) ✅

**Priority:** MUST  
**Requirements:** 4.6, 4.7, 4.8, 4.9

**Steps:**

1. Lanjutkan dari Test 4.1 (draft sudah tersimpan)
2. **JANGAN KLIK SAVE** - biarkan draft tersimpan di localStorage
3. **Close tab browser** atau **Close entire browser**
4. Buka browser kembali
5. Login kembali (jika perlu)
6. Navigasi ke halaman manage course yang sama
7. Klik "Edit" pada lesson yang tadi diubah

**Expected Result:**

- ✅ Editor langsung load konten draft (bukan konten server)
- ✅ Title = "Draft Title Test" (sesuai draft)
- ✅ Content = paragraf yang tadi diketik (sesuai draft)
- ✅ **TIDAK ADA** toast atau indicator saat restore (silent restore)
- ✅ Draft indicator 💾 muncul dengan timestamp lama
- ✅ **TIDAK ADA dialog konfirmasi** - langsung auto-restore

**Actual Result:**

- [ ] Pass / [ ] Fail

**Notes:**

```
[Catatan: Apakah draft berhasil di-restore tanpa dialog?]
```

---

### Test 4.3: Draft Cleared After Manual Save (MUST) ✅

**Priority:** MUST  
**Requirements:** 4.11

**Steps:**

1. Lanjutkan dari Test 4.2 (draft sudah di-restore)
2. Edit lagi konten (optional - untuk trigger isDirty)
3. Klik tombol **Save**
4. Wait for save success
5. Perhatikan apakah ada toast notification lagi

**Expected Result:**

- ✅ Setelah save sukses, draft cleared dari localStorage
- ✅ **TIDAK ADA** toast "Draft tersimpan" lagi setelah save
- ✅ Dot indicator (•) di tombol Save hilang (isDirty = false)

**Actual Result:**

- [ ] Pass / [ ] Fail

**Notes:**

```
[Catatan: Apakah draft berhasil di-clear dari localStorage?]
```

---

### Test 4.4: Draft Auto-Restore on F5 Refresh (SHOULD) ✅

**Priority:** SHOULD  
**Requirements:** 4.6, 4.7, 4.8

**Steps:**

1. Edit lesson yang sudah ada
2. Ubah title dan content
3. Tunggu 5 detik (draft tersimpan)
4. **JANGAN KLIK SAVE**
5. Press **F5** (Refresh page)
6. Jika muncul browser warning "Leave site?" → Klik **Leave**

**Expected Result:**

- ✅ Setelah page reload, editor langsung load draft
- ✅ Title dan content sesuai draft (bukan server content)
- ✅ **TIDAK ADA** toast notification saat restore (silent)

**Actual Result:**

- [ ] Pass / [ ] Fail

**Notes:**

```
[Catatan: Apakah draft persist setelah F5?]
```

---

### Test 4.5: Draft NOT Saved if Content Unchanged (SHOULD) ✅

**Priority:** SHOULD  
**Requirements:** 4.12

**Steps:**

1. Edit lesson yang sudah ada (content original dari server)
2. **JANGAN ubah apapun** - biarkan title dan content tetap sama
3. Tunggu 5 detik
4. Perhatikan draft indicator

**Expected Result:**

- ✅ **TIDAK ADA** toast notification setelah 5 detik
- ✅ Karena content tidak berubah, draft tidak perlu disimpan

**Actual Result:**

- [ ] Pass / [ ] Fail

**Notes:**

```
[Catatan: Apakah draft hanya tersimpan saat ada perubahan?]
```

---

### Test 4.6: Draft NOT Saved if isDirty = false (SHOULD) ✅

**Priority:** SHOULD  
**Requirements:** 4.4

**Steps:**

1. Buat lesson baru (klik "New Lesson")
2. Isi title dan content
3. Klik **Save** (lesson tersimpan ke server)
4. **JANGAN ubah apapun** setelah save
5. Tunggu 10 detik
6. Perhatikan draft indicator

**Expected Result:**

- ✅ Setelah save sukses, isDirty = false
- ✅ **TIDAK ADA** toast notification setelah tunggu 10 detik
- ✅ Karena tidak ada perubahan (isDirty = false), draft tidak tersimpan

**Actual Result:**

- [ ] Pass / [ ] Fail

**Notes:**

```
[Catatan: Apakah auto-save hanya trigger saat isDirty = true?]
```

---

### Test 4.7: Multiple Edits - Debounce Reset (SHOULD) ✅

**Priority:** SHOULD  
**Requirements:** 4.2

**Steps:**

1. Edit lesson yang sudah ada
2. Ketik beberapa karakter
3. **Tunggu 3 detik** (belum sampai 5 detik)
4. Ketik beberapa karakter lagi (reset debounce timer)
5. **Tunggu 5 detik penuh** tanpa mengetik lagi
6. Perhatikan draft indicator

**Expected Result:**

- ✅ Toast notification **HANYA muncul** setelah 5 detik tanpa aktivitas
- ✅ Setiap kali user mengetik, timer di-reset ulang
- ✅ Draft tersimpan dengan content terakhir

**Actual Result:**

- [ ] Pass / [ ] Fail

**Notes:**

```
[Catatan: Apakah debounce timer reset dengan benar?]
```

---

## Test Summary

### Feature 4: localStorage Auto-Draft

| Test                               | Priority | Status | Notes         |
| ---------------------------------- | -------- | ------ | ------------- |
| 4.1 Auto-Save Draft                | MUST     | ⬜     | _[Pass/Fail]_ |
| 4.2 Auto-Restore on Browser Reopen | MUST     | ⬜     | _[Pass/Fail]_ |
| 4.3 Draft Cleared After Save       | MUST     | ⬜     | _[Pass/Fail]_ |
| 4.4 Auto-Restore on F5 Refresh     | SHOULD   | ⬜     | _[Pass/Fail]_ |
| 4.5 NOT Saved if Unchanged         | SHOULD   | ⬜     | _[Pass/Fail]_ |
| 4.6 NOT Saved if isDirty=false     | SHOULD   | ⬜     | _[Pass/Fail]_ |
| 4.7 Debounce Reset                 | SHOULD   | ⬜     | _[Pass/Fail]_ |

**Overall Result:** ⬜ PASS / ⬜ FAIL

---

## Known Issues

_[List any known issues or bugs found during testing]_

1.
2.
3.

---

## Testing Notes

_[General observations or feedback about the feature]_

---

## Sign-off

**Tester:** _[Nama]_  
**Date:** _[Tanggal]_  
**Approval:** ⬜ Approved / ⬜ Rejected  
**Reason (if rejected):** _[Alasan jika ditolak]_
