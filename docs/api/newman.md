# Newman CLI — API Testing Guide

**Feature:** Course Discovery & Enrollment  
**Collections:** Student Course API + Creator Course API

---

## Apa itu Newman?

Newman adalah CLI runner untuk Postman Collection. Kamu bisa jalankan semua API test tanpa buka aplikasi Postman — cukup dari terminal.

---

## Setup (Sekali Saja)

Newman sudah ada di `devDependencies`, jadi cukup:

```bash
yarn install
```

Verifikasi Newman terinstall:

```bash
npx newman --version
```

---

## Konfigurasi: Isi Environment Variables

Sebelum menjalankan test, isi nilai di file `docs/api/newman-env.json`:

```json
{
  "values": [
    { "key": "baseUrl",        "value": "http://localhost:3000" },
    { "key": "authToken",      "value": "ISI_DI_SINI" },
    { "key": "otherUserToken", "value": "ISI_DI_SINI" },
    { "key": "courseId",       "value": "ISI_DI_SINI" },
    { "key": "draftCourseId",  "value": "ISI_DI_SINI" }
  ]
}
```

### Cara Mendapatkan Nilai

**`authToken` dan `otherUserToken`** — Clerk session cookie:
1. Buka `http://localhost:3000` di browser
2. Login sebagai user yang diinginkan
3. Buka DevTools (`F12`) → tab **Application**
4. Sidebar kiri → **Cookies** → `http://localhost:3000`
5. Cari cookie bernama `__session` → copy nilainya

> Untuk `otherUserToken`: login sebagai user **berbeda** (bukan owner course), copy cookie-nya.

**`courseId`** — ID course PUBLISHED:
```sql
SELECT id, title, status FROM courses WHERE status = 'PUBLISHED' LIMIT 1;
```

**`draftCourseId`** — ID course DRAFT:
```sql
SELECT id, title, status FROM courses WHERE status = 'DRAFT' LIMIT 1;
```

> **Penting:** `newman-env.json` ada di `.gitignore` — nilai token tidak akan ter-commit ke Git.

---

## Menjalankan Test

Pastikan development server sudah berjalan:

```bash
yarn app
```

### Test Student Course API

```bash
yarn test:api:student
```

### Test Creator Course API

```bash
yarn test:api:creator
```

### Test Semua Sekaligus

```bash
yarn test:api
```

---

## Contoh Output

```
→ Get Creator Courses - Unauthenticated (401)
  POST http://localhost:3000/api/creator/courses [401 Unauthorized, 312B, 45ms]
  ✓ Status code is 401
  ✓ Response has error message

→ Create Course - Success (201)
  POST http://localhost:3000/api/creator/courses [201 Created, 512B, 120ms]
  ✓ Status code is 201
  ✓ Response has created course data
  ✓ Course status defaults to DRAFT

┌─────────────────────────┬──────────┬──────────┐
│                         │ executed │   failed │
├─────────────────────────┼──────────┼──────────┤
│              iterations │        1 │        0 │
│                requests │        9 │        0 │
│            test-scripts │       18 │        0 │
│              assertions │       24 │        0 │
└─────────────────────────┴──────────┴──────────┘
```

Jika ada test yang fail, Newman akan menampilkan detail assertion mana yang gagal beserta actual vs expected value.

---

## Troubleshooting

| Error                            | Penyebab                        | Solusi                                     |                                     |
| ----------------------------------| ---------------------------------| --------------------------------------------| -------------------------------------|
| -------                          | ECONNREFUSED`                   | Server tidak running                       | Jalankan `yarn app` terlebih dahulu |
| S ----request return 401         | `authToken` kosong atau expired | Copy ulang cookie `__session` dari browser |                                     |
| `c------      ak ditemukan (404) | `courseId` di env salah         | Update `courseId` di `newman-env.json`     |                                     |
| command not found`               | Newman belum terinstall         | Jalankan `yarn install`                    |                                     |

                         | --------                        |                                            |                                     |Catatan Penting

- **Token expire** — Clerk session token berlaku ~1 jam. Jika test tiba-tiba 401, copy ulang cookie dari browser.
- **Urutan test** — Beberapa test bergantung pada urutan (misal: enroll success → enroll 409). Newman menjalankan request sesuai urutan di collection.
- **`newman-env.json` jangan di-commit** — File ini berisi token sensitif.

---

## References

- **Student Collection:** `docs/api/student-course/student-course.postman_collection.json`
- **Creator Collection:** `docs/api/creator-course/creator-course.postman_collection.json`
- **Environment File:** `docs/api/newman-env.json`
- **Student Guide:** `docs/api/student-course/README.md`
- **Creator Guide:** `docs/api/creator-course/README.md`
