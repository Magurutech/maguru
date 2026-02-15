---
title: "HTML Elements Advanced: Forms, Tables, dan Media"
description: "Mempelajari HTML elements yang lebih complex seperti forms untuk input user, tables untuk data, dan media elements."
contentType: "markdown"
duration: "25 menit"
order: 2
---

# HTML Elements Advanced: Forms, Tables, dan Media

Setelah mempelajari dasar-dasar HTML, sekarang kita akan eksplorasi elements yang lebih powerful dan interaktif!

## 🎯 **Apa yang Akan Anda Pelajari**

- Forms untuk user input dan validation
- Tables untuk menampilkan data terstruktur
- Media elements (audio, video)
- Semantic HTML5 elements lanjutan
- HTML validation best practices

## 📝 **HTML Forms - Interaksi dengan User**

Forms adalah cara utama untuk收集 user input di web. Forms digunakan untuk:
- Login/registration
- Search functionality
- Contact forms
- Surveys dan polls
- Shopping carts

### **Basic Form Structure**

```html
<form action="/submit" method="POST">
    <fieldset>
        <legend>Informasi Pribadi</legend>

        <label for="name">Nama:</label>
        <input type="text" id="name" name="name" required>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>

        <button type="submit">Kirim</button>
    </fieldset>
</form>
```

### **Input Types yang Penting**

```html
<!-- Text Inputs -->
<input type="text" placeholder="Nama lengkap">
<input type="password" placeholder="Password">
<input type="email" placeholder="email@example.com">
<input type="tel" placeholder="0812-3456-7890">
<input type="url" placeholder="https://example.com">

<!-- Number Inputs -->
<input type="number" min="1" max="100" step="1">
<input type="range" min="0" max="100" value="50">

<!-- Date Inputs -->
<input type="date">
<input type="time">
<input type="datetime-local">
<input type="month">
<input type="week">

<!-- Selection Inputs -->
<input type="checkbox" id="agree">
<label for="agree">Saya setuju dengan syarat dan ketentuan</label>

<input type="radio" name="gender" value="male" id="male">
<label for="male">Pria</label>

<input type="radio" name="gender" value="female" id="female">
<label for="female">Wanita</label>

<!-- File Input -->
<input type="file" accept=".jpg,.png,.pdf">
```

### **Dropdown dan Select Elements**

```html
<select name="country" id="country">
    <option value="">Pilih Negara</option>
    <option value="id">Indonesia</option>
    <option value="my">Malaysia</option>
    <option value="sg">Singapore</option>
</select>

<!-- Multi-select -->
<select name="skills" id="skills" multiple size="4">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="js">JavaScript</option>
    <option value="python">Python</option>
</select>
```

### **Textareas untuk Long Text**

```html
<label for="message">Pesan Anda:</label>
<textarea
    id="message"
    name="message"
    rows="4"
    cols="50"
    placeholder="Tulis pesan Anda di sini..."
    maxlength="500"
    required></textarea>
```

### **Form Validation dengan HTML5**

```html
<form>
    <!-- Required fields -->
    <input type="text" required placeholder="Nama (wajib)">

    <!-- Pattern matching -->
    <input
        type="text"
        pattern="[A-Za-z]{3,}"
        placeholder="Minimal 3 huruf"
        title="Gunakan minimal 3 huruf alfabet">

    <!-- Min/Max length -->
    <input
        type="text"
        minlength="8"
        maxlength="20"
        placeholder="8-20 karakter">

    <!-- Custom validation -->
    <input
        type="email"
        placeholder="Email valid"
        title="Format email harus valid">
</form>
```

## 📊 **HTML Tables - Menampilkan Data Terstruktur**

Tables digunakan untuk menampilkan data dalam format grid yang terstruktur.

### **Basic Table Structure**

```html
<table>
    <thead>
        <tr>
            <th>Nama</th>
            <th>Usia</th>
            <th>Kota</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Ahmad</td>
            <td>25</td>
            <td>Jakarta</td>
        </tr>
        <tr>
            <td>Siti</td>
            <td>28</td>
            <td>Bandung</td>
        </tr>
    </tbody>
</table>
```

### **Advanced Table Features**

```html
<table>
    <caption>Data Karyawan Departemen IT</caption>

    <colgroup>
        <col style="width: 30%;">
        <col style="width: 20%;">
        <col style="width: 50%;">
    </colgroup>

    <thead>
        <tr>
            <th>Nama Lengkap</th>
            <th>Usia</th>
            <th>Informasi Kontak</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>Budi Santoso</td>
            <td>32</td>
            <td>
                Email: budi@company.com<br>
                Phone: 0812-3456-7890
            </td>
        </tr>
        <tr>
            <td rowspan="2">Dewi Lestari</td>
            <td>28</td>
            <td>dewi@company.com</td>
        </tr>
        <tr>
            <td colspan="2">Departemen: Frontend Development</td>
        </tr>
    </tbody>

    <tfoot>
        <tr>
            <th>Total</th>
            <th>2</th>
            <th>Active</th>
        </tr>
    </tfoot>
</table>
```

### **Table Styling Tips**

```css
/* Basic table styling */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
}

th {
    background-color: #f5f5f5;
    font-weight: bold;
}

tr:nth-child(even) {
    background-color: #f9f9f9;
}

tr:hover {
    background-color: #f0f0f0;
}
```

## 🎵 **Media Elements - Audio dan Video**

HTML5 memudahkan embedding media tanpa plugins eksternal.

### **Video Element**

```html
<video
    width="640"
    height="360"
    controls
    poster="poster-image.jpg"
    preload="metadata">

    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">

    <!-- Fallback text -->
    Browser Anda tidak support video tag.
</video>
```

**Video Attributes:**
- `controls`: Tampilkan playback controls
- `autoplay`: Play otomatis (biasanya disabled)
- `loop`: Loop video
- `muted`: Start muted
- `poster`: Image sebelum video dimuat
- `preload`: Kapan video dimuat (none, metadata, auto)

### **Audio Element**

```html
<audio controls preload="metadata">
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">

    <!-- Fallback text -->
    Browser Anda tidak support audio element.
</audio>
```

### **Embedded Content**

```html
<!-- YouTube embed -->
<iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/VIDEO_ID"
    frameborder="0"
    allowfullscreen>
</iframe>

<!-- Google Maps -->
<iframe
    src="https://www.google.com/maps/embed?pb=..."
    width="600"
    height="450"
    style="border:0;"
    allowfullscreen=""
    loading="lazy">
</iframe>
```

## 🏗️ **Advanced Semantic Elements**

### **Article dan Section**

```html
<article>
    <header>
        <h1>Judul Artikel Utama</h1>
        <time datetime="2024-01-15">15 Januari 2024</time>
        <address>By John Doe</address>
    </header>

    <section>
        <h2>Pendahuluan</h2>
        <p>Isi pendahuluan artikel...</p>
    </section>

    <section>
        <h2>Isi Utama</h2>
        <p>Isi utama artikel...</p>
    </section>

    <footer>
        <p>Tags: <mark>HTML</mark>, <mark>Web Development</mark></p>
    </footer>
</article>
```

### **Figure dan Figcaption**

```html
<figure>
    <img
        src="web-development-process.jpg"
        alt="Diagram web development process">
    <figcaption>
        Gambar 1: Proses Web Development dari konsep hingga deployment
    </figcaption>
</figure>
```

### **Details dan Summary**

```html
<details>
    <summary>Klik untuk melihat detail teknis</summary>

    <dl>
        <dt>Framework</dt>
        <dd>React 18.2.0</dd>

        <dt>Build Tool</dt>
        <dd>Vite 4.0.0</dd>

        <dt>Language</dt>
        <dd>TypeScript 4.9.0</dd>
    </dl>
</details>
```

## 🛠️ **Best Practices dan Tips**

### **1. Accessibility First**

```html
<!-- Good: Semantic dan accessible -->
<form>
    <fieldset>
        <legend>Informasi Kontak</legend>

        <label for="name">Nama Lengkap:</label>
        <input
            type="text"
            id="name"
            name="name"
            aria-describedby="name-help"
            required>

        <small id="name-help">
            Gunakan nama lengkap sesuai KTP
        </small>
    </fieldset>
</form>

<!-- Bad: Tanpa labels dan semantic structure -->
<div>
    <input type="text" placeholder="Name">
</div>
```

### **2. Mobile-Friendly Forms**

```html
<form>
    <!-- Use appropriate input types -->
    <input type="tel" placeholder="Phone Number">
    <input type="email" placeholder="Email Address">

    <!-- Add autocomplete -->
    <input
        type="text"
        name="address"
        autocomplete="street-address">

    <!-- Use proper input modes -->
    <input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*">
</form>
```

### **3. Performance Optimization**

```html
<!-- Lazy load images -->
<img
    src="placeholder.jpg"
    data-src="actual-image.jpg"
    loading="lazy"
    alt="Deskripsi gambar">

<!-- Defer non-critical resources -->
<script defer src="analytics.js"></script>

<!-- Preload important resources -->
<link rel="preload" href="critical.css" as="style">
```

## ✍️ **Praktik: Form Registrasi Lengkap**

Mari buat form registrasi yang komprehensif:

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Registrasi Course</title>
</head>
<body>
    <main>
        <h1>Registrasi Course Web Development</h1>

        <form action="/register" method="POST">
            <!-- Personal Information -->
            <fieldset>
                <legend>Informasi Pribadi</legend>

                <label for="fullName">Nama Lengkap:</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    minlength="3"
                    placeholder="John Doe">

                <label for="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="john@example.com">

                <label for="phone">Nomor HP:</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    pattern="[0-9]{10,13}"
                    placeholder="08123456789">

                <label for="birthdate">Tanggal Lahir:</label>
                <input type="date" id="birthdate" name="birthdate">
            </fieldset>

            <!-- Course Selection -->
            <fieldset>
                <legend>Pilihan Course</legend>

                <label for="course">Course yang Diinginkan:</label>
                <select id="course" name="course" required>
                    <option value="">Pilih Course</option>
                    <option value="html-basics">HTML Basics</option>
                    <option value="css-mastery">CSS Mastery</option>
                    <option value="javascript-fundamentals">JavaScript Fundamentals</option>
                </select>

                <fieldset>
                    <legend>Format Belajar:</legend>

                    <input type="radio" id="online" name="format" value="online" required>
                    <label for="online">Online</label>

                    <input type="radio" id="offline" name="format" value="offline">
                    <label for="offline">Offline (Jakarta)</label>
                </fieldset>
            </fieldset>

            <!-- Additional Information -->
            <fieldset>
                <legend>Informasi Tambahan</legend>

                <label for="experience">Pengalaman Programming:</label>
                <select id="experience" name="experience">
                    <option value="beginner">Pemula (Belum pernah coding)</option>
                    <option value="some">Beberapa pengalaman</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>

                <label for="goals">Tujuan Belajar:</label>
                <textarea
                    id="goals"
                    name="goals"
                    rows="4"
                    placeholder="Apa yang ingin Anda capai setelah course ini?"></textarea>

                <input type="checkbox" id="newsletter" name="newsletter">
                <label for="newsletter">Saya ingin menerima newsletter dan tips</label>
            </fieldset>

            <!-- Terms and Submit -->
            <fieldset>
                <input type="checkbox" id="terms" name="terms" required>
                <label for="terms">
                    Saya setuju dengan <a href="/terms">syarat dan ketentuan</a>
                </label>

                <button type="submit">Daftar Sekarang</button>
                <button type="reset">Reset Form</button>
            </fieldset>
        </form>
    </main>
</body>
</html>
```

## 🎯 **Checkpoint: Knowledge Check**

### **Pertanyaan Review:**
1. Kapan Anda menggunakan `<fieldset>` vs `<div>`?
2. Apa perbedaan antara `name` dan `id` attributes?
3. Mengapa `label` element penting untuk accessibility?
4. Kapan Anda menggunakan `<table>` vs `<div>` dengan CSS grid?

### **Mini Challenge:**
Buat form "contact us" dengan:
- Input fields untuk name, email, subject
- Textarea untuk message
- Dropdown untuk inquiry type
- Checkbox untuk subscribe newsletter
- Proper validation dan labels

---

## 🚀 **Selanjutnya:**

Di modul berikutnya, kita akan mempelajari **CSS Basics** untuk membuat website kita menjadi menarik dan responsive!

**Ready untuk styling?** Klik "Next" untuk masuk ke dunia CSS!