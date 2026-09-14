# 🔑 Panduan Mendapatkan User Auth Token untuk Testing Postman

Panduan ringkas ini menjelaskan cara mendapatkan **JWT Access Token User** yang valid untuk otentikasi endpoint API Maguru (seperti `/api/creator/*`) di Postman.

---

## ⚠️ Poin Kritis: Penyebab Error `401 Unauthorized`

| Token | Deskripsi | Bisa untuk API User? |
| :--- | :--- | :---: |
| ❌ **Service Role Key** | Kunci admin backend. Tidak memiliki `sub` (User ID). | **Gagal (401)** |
| ❌ **Anon Key** | Kunci publik client Supabase. | **Gagal (401)** |
| ✅ **User JWT Access Token** | Token sesi user login (berisi User ID, email, & role). | **Berhasil (200)** |

> [!IMPORTANT]
> Endpoint `/api/creator/*` membaca sesi pengguna via `supabase.auth.getUser()`. Endpoint membutuhkan token user yang login, **bukan** service role key.

---

## Cara 1: Ambil dari Browser Console (Paling Cepat - 10 Detik)

Gunakan cara ini jika Anda sudah login ke aplikasi Maguru di browser:

1. Buka aplikasi Maguru (`http://localhost:3001` atau domain terkait) dan pastikan **sudah login**.
2. Buka **Chrome DevTools** (`F12` atau `Ctrl + Shift + I`) $\rightarrow$ pilih tab **Console**.
3. Jalankan script berikut:

```javascript
copy(JSON.parse(atob(document.cookie.split('; ').filter(c => c.includes('-auth-token')).sort().map(c => c.split('=')[1].replace('base64-', '')).join(''))).access_token)
```

4. Di console akan muncul output `undefined` (**ini normal**, karena fungsi `copy()` tidak menghasilkan return value).
5. Token JWT sekarang sudah tersalin di **Clipboard OS** Anda. Langsung paste (`Ctrl + V`) ke Postman!

### Alternatif Manual via Tab Application:
Jika cookie menggunakan format berbeda atau terpotong:
- Buka tab **Application** $\rightarrow$ **Storage** $\rightarrow$ **Cookies** $\rightarrow$ pilih URL web.
- Cari cookie dengan awalan `sb-...-auth-token`.
- Salin string JSON, decode base64 jika diperlukan, dan ambil nilai properti `"access_token"`.

---

## Cara 2: Otomatis via Request Login di Postman (Permanen & Recommended)

Agar tidak perlu copy-paste token manual setiap kali token expired, buat satu request login di Postman Collection:

### 1. Buat Request Baru di Postman
- **Method**: `POST`
- **URL**: `https://<PROJECT-REF>.supabase.co/auth/v1/token?grant_type=password`
  *(Atau gunakan variable `{{supabaseUrl}}/auth/v1/token?grant_type=password`)*

### 2. Konfigurasi Headers
| Key | Value |
| :--- | :--- |
| `apikey` | `{{supabaseAnonKey}}` *(atau anon key project Anda)* |
| `Content-Type` | `application/json` |

### 3. Konfigurasi Body (raw JSON)
```json
{
  "email": "creator@email.com",
  "password": "passwordAkunAnda"
}
```

### 4. Tambahkan Script Simpan Otomatis
Buka tab **Scripts** $\rightarrow$ **Post-response** (atau tab **Tests**), masukkan kode ini:

```javascript
const res = pm.response.json();

if (res.access_token) {
    pm.collectionVariables.set("authToken", res.access_token);
    console.log("✅ Token berhasil disimpan ke variable authToken!");
} else {
    console.error("❌ Gagal mendapatkan access_token:", res);
}
```

> [!TIP]
> Setiap kali ingin testing API, cukup klik **Send** pada request login ini satu kali. Seluruh request lain di collection akan otomatis ter-update dengan token aktif terbaru.

---

## 🚀 Cara Pasang Token di Postman Collection

1. Klik nama Collection (misalnya `creator-course`).
2. Masuk ke tab **Authorization**:
   - **Type**: `Bearer Token`
   - **Token**: `{{authToken}}`
3. Pada masing-masing folder/endpoint (misal `GET /api/creator/courses`):
   - Pastikan tab **Authorization** disetel ke **Inherit auth from parent**.
4. Klik **Send** $\rightarrow$ Response `200 OK` berhasil didapatkan!
