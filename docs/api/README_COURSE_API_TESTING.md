# 📚 Panduan Testing API Course Maguru di Postman

## 🎯 **TUJUAN DOKUMENTASI**

Dokumen ini menjelaskan cara setup dan menjalankan testing untuk API Course di Maguru menggunakan Postman, **fokus pada success cases** dengan Clerk Authentication.

---

## 🎯 Keunggulan Menggunakan Cookies

- **Lebih Praktis**: Tidak perlu copy-paste token manual
- **Otomatis**: Cookie akan dikirim otomatis dengan setiap request
- **Real-world**: Meniru cara kerja aplikasi browser yang sebenarnya
- **Maintenance**: Tidak perlu update token secara manual

## 📋 **DAFTAR ISI**

1. [Prerequisites](mdc:#prerequisites)
2. [Setup Environment](mdc:#setup-environment)
3. [Import Collection](mdc:#import-collection)
4. [Cara Mendapatkan Clerk Token](mdc:#cara-mendapatkan-clerk-token)
5. [Setup Token di Postman](mdc:#setup-token-di-postman)
6. [Jalankan Testing](mdc:#jalankan-testing)
7. [Interpretasi Hasil](mdc:#interpretasi-hasil)
8. [Troubleshooting](mdc:#troubleshooting)

---

## 🔧 **PREREQUISITES**

### **Software yang Diperlukan:**

- ✅ **Postman** (versi terbaru)
- ✅ **Node.js** (v18+)
- ✅ **Yarn** atau **npm**

### **Environment yang Harus Running:**

- ✅ **Next.js App** (`yarn dev` pada port 3000)
- ✅ **Database** (PostgreSQL dengan Prisma)
- ✅ **Clerk Authentication** (configured)
- ✅ **Supabase Storage** (configured)

### **Data yang Harus Tersedia:**

- ✅ **User dengan role creator/admin** di Clerk
- ✅ **JWT Token** dari browser session
- ✅ **Sample course data** di database

---

## ⚙️ **SETUP ENVIRONMENT**

### **1. Start Development Server**

```bash
# Di terminal, jalankan:
cd /path/to/maguru
yarn dev
```

**Verifikasi:**

- Server berjalan di `http://localhost:3000`
- Tidak ada error di console
- Database connection berhasil

### **2. Setup Database**

```bash
# Jalankan migration jika belum
yarn prisma migrate dev

# Generate Prisma client
yarn prisma generate

# Seed data jika diperlukan
yarn prisma db seed
```

### **3. Verifikasi Environment Variables**

Pastikan file `.env.local` berisi:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL="postgresql://..."

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 📥 **IMPORT COLLECTION**

### **1. Download Collection**

File collection sudah tersedia di: `docs/api/api_course.json`

### **2. Import ke Postman**

1. **Buka Postman**
2. **Klik "Import"** (tombol di kiri atas)
3. **Drag & drop** file `api_course.json` atau **Browse** untuk memilih file
4. **Klik "Import"**

### **3. Verifikasi Import**

Setelah import berhasil, Anda akan melihat:

- Collection: **"Maguru Course API - Success Cases"**
- 6 request yang terorganisir (fokus success cases)
- Variables yang sudah terdefinisi

---

## 🔐 **CARA MENDAPATKAN CLERK TOKEN**

### **Method 1: Dari Browser Session (Recommended)**

1. **Buka aplikasi Maguru** di browser: `http://localhost:3000`
2. **Login** dengan user yang memiliki role creator/admin
3. **Buka Developer Tools** (F12)
4. **Pergi ke Application tab** (Chrome) atau **Storage tab** (Firefox)
5. **Cari Clerk session**:
   - **Chrome**: Application → Local Storage → `http://localhost:3000` → `__session`
   - **Firefox**: Storage → Local Storage → `http://localhost:3000` → `__session`
6. **Copy nilai dari `__session`** (ini adalah JWT token)

### **Method 2: Dari Console Browser**

1. **Login** ke aplikasi Maguru
2. **Buka Developer Tools** (F12)
3. **Pergi ke Console tab**
4. **Jalankan script**:
   ```javascript
   // Copy token dari localStorage
   console.log(localStorage.getItem('__session'))
   ```
5. **Copy output** (JWT token)

### **Method 3: Via Clerk Dashboard (Alternative)**

1. **Buka Clerk Dashboard**
2. **Pergi ke Users**
3. **Pilih user** yang ingin digunakan untuk testing
4. **Generate JWT token** untuk user tersebut

---

## ⚙️ **SETUP TOKEN DI POSTMAN**

### **1. Update Collection Variables**

1. **Buka Collection "Maguru Course API - Success Cases"**
2. **Klik tab "Variables"**
3. **Update variable `clerkToken`:**
   ```
   Key: clerkToken
   Value: [paste_jwt_token_disini]
   ```
4. **Klik "Save"**

### **2. Verifikasi Token Setup**

1. **Buka request "2. POST Create Course - Success"**
2. **Periksa header Authorization**: `Bearer {{clerkToken}}`
3. **Pastikan token tidak kosong**

### **3. Test Authentication**

1. **Jalankan request "2. POST Create Course - Success"**
2. **Pastikan response status 201** (bukan 401)
3. **Jika masih 401**, periksa:
   - Token format benar
   - Token tidak expired
   - User punya role creator/admin

---

## 📊 **VARIABEL YANG DIPERLUKAN**

### **Collection Variables**

| Variable     | Value                      | Deskripsi                                 |
| ------------ | -------------------------- | ----------------------------------------- |
| `baseUrl`    | `http://localhost:3000`    | Base URL aplikasi                         |
| `clerkToken` | `[jwt_token_dari_browser]` | JWT token dari \_\_session cookie         |
| `courseId`   | `[auto_filled]`            | ID course (diisi otomatis setelah create) |

### **Auto-Fill Feature**

Collection ini memiliki fitur **auto-fill courseId**:

- Setelah POST create course berhasil (status 201)
- Course ID akan otomatis disimpan ke variable `courseId`
- Request selanjutnya (GET, PUT, PATCH, DELETE) akan menggunakan ID ini

---

## 🚀 **JALANKAN TESTING**

### **Urutan Testing yang Direkomendasikan**

#### **Phase 1: Public Access**

1. **"1. GET Courses - Public Access"** ✅
   - Test: Mengambil daftar kursus tanpa auth
   - Expected: Status 200, data courses + pagination

#### **Phase 2: Create Course**

2. **"2. POST Create Course - Success"** ✅
   - Test: Membuat kursus baru dengan auth
   - Expected: Status 201, course data
   - **Auto-save**: Course ID akan disimpan otomatis

#### **Phase 3: Read Course**

3. **"3. GET Course Detail - Success"** ✅
   - Test: Mengambil detail kursus yang baru dibuat
   - Expected: Status 200, detail course lengkap

#### **Phase 4: Update Course**

4. **"4. PUT Update Course - Success"** ✅
   - Test: Update metadata kursus
   - Expected: Status 200, updated course data

5. **"5. PATCH Update Course Status - Success"** ✅
   - Test: Update status kursus ke PUBLISHED
   - Expected: Status 200, course dengan status baru

#### **Phase 5: Delete Course**

6. **"6. DELETE Course - Success"** ✅
   - Test: Hapus kursus secara permanen
   - Expected: Status 200, success message

### **Cara Menjalankan Test**

#### **Method 1: Manual Testing (Recommended)**

1. **Pilih request** dari collection sesuai urutan
2. **Klik "Send"**
3. **Periksa response** dan status code
4. **Lanjut ke request berikutnya**

#### **Method 2: Automated Testing**

1. **Klik kanan pada collection**
2. **Pilih "Run collection"**
3. **Konfigurasi delay** (2-3 detik antar request)
4. **Klik "Run Maguru Course API - Success Cases"**

---

## 📈 **INTERPRETASI HASIL**

### **Expected Status Codes**

| Endpoint                   | Method | Expected Status | Notes                     |
| -------------------------- | ------ | --------------- | ------------------------- |
| `/api/courses`             | GET    | 200             | Public access             |
| `/api/courses`             | POST   | 201             | Auth required             |
| `/api/courses/[id]`        | GET    | 200             | Public access             |
| `/api/courses/[id]`        | PUT    | 200             | Auth + ownership required |
| `/api/courses/[id]/status` | PATCH  | 200             | Auth + ownership required |
| `/api/courses/[id]`        | DELETE | 200             | Auth + ownership required |

### **Response Format Validation**

#### **Success Response**

```json
{
  "success": true,
  "data": {
    // course data
  }
}
```

#### **Error Response**

```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "title",
      "message": "Judul kursus harus diisi"
    }
  ]
}
```

### **Test Results Interpretation**

#### **✅ PASSED Tests**

- Status code sesuai expected (200, 201, 204)
- Response format valid
- Response time < 2000ms
- Success property = true

#### **❌ FAILED Tests**

- Status code tidak sesuai
- Response format invalid
- Response time > 2000ms
- Success property = false

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **1. Authentication Error (401)**

**Problem:** Request return 401 Unauthorized

**Solutions:**

```bash
# 1. Periksa JWT token
- Token expired? Login ulang dan ambil token baru
- Token format salah? Pastikan format Bearer token
- User role tidak sesuai? Pastikan user punya role creator/admin

# 2. Periksa token source
- Ambil token dari __session cookie browser
- Jangan gunakan token dari Clerk dashboard (bisa expired)

# 3. Periksa auth middleware
- File lib/auth-middleware.ts ada?
- Import path benar?
```

#### **2. Course ID Not Found (404)**

**Problem:** GET/PUT/PATCH/DELETE return 404

**Solutions:**

```bash
# 1. Periksa auto-fill feature
- POST create course berhasil? (status 201)
- Course ID tersimpan di variable courseId?
- Periksa console log: "Course ID saved: ..."

# 2. Manual setup courseId
- Jika auto-fill gagal, set manual di collection variables
- Gunakan ID course yang valid dari database
```

#### **3. File Upload Error (500)**

**Problem:** Upload thumbnail gagal

**Solutions:**

```bash
# 1. Periksa Supabase configuration
NEXT_PUBLIC_SUPABASE_URL valid?
NEXT_PUBLIC_SUPABASE_ANON_KEY valid?
SUPABASE_SERVICE_ROLE_KEY valid?

# 2. Periksa storage bucket
- Bucket 'course-thumbnails' ada?
- Permissions set correctly?

# 3. Periksa file
- File < 5MB?
- Format image valid? (jpg, png, webp)
```

### **Debug Steps**

#### **1. Enable Console Logging**

```javascript
// Di Postman Console, periksa:
console.log('Token:', pm.collectionVariables.get('clerkToken'))
console.log('Course ID:', pm.collectionVariables.get('courseId'))
console.log('Response:', pm.response.json())
```

#### **2. Check Browser Session**

```javascript
// Di browser console, periksa:
console.log('Session token:', localStorage.getItem('__session'))
console.log('User role:' /* check user role */)
```

#### **3. Check Server Logs**

```bash
# Di terminal development server
# Periksa console output untuk error messages
```

---

## 📝 **NOTES & BEST PRACTICES**

### **Testing Best Practices**

1. **Token Management**: Ambil token fresh dari browser setiap kali testing
2. **Auto-Fill**: Manfaatkan fitur auto-fill courseId untuk workflow yang smooth
3. **File Upload**: Siapkan sample image files untuk testing upload
4. **Cleanup**: Data test akan otomatis terhapus saat DELETE request

### **Security Considerations**

1. **Token Security**: Jangan share JWT token di public repository
2. **Environment Variables**: Gunakan .env.local untuk sensitive data
3. **Role Testing**: Pastikan user punya role creator/admin
4. **Ownership Testing**: User hanya bisa akses data miliknya

### **Performance Testing**

1. **Response Time**: Monitor response time untuk setiap request
2. **File Upload Size**: Test dengan berbagai ukuran file
3. **Database Load**: Monitor database performance saat testing

---

## 🎯 **CONCLUSION**

Dengan mengikuti panduan ini, Anda dapat:

- ✅ **Setup environment** untuk testing API Course
- ✅ **Import dan konfigurasi** Postman collection yang simplified
- ✅ **Setup authentication** dengan token dari browser
- ✅ **Jalankan success cases testing** untuk semua endpoints
- ✅ **Manfaatkan auto-fill feature** untuk workflow yang smooth
- ✅ **Troubleshoot issues** yang mungkin muncul

**Happy Testing! 🚀**
