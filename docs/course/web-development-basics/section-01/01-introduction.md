---
title: 'Pengenalan HTML dan Dasar-dasar Web Development'
description: 'Memahami konsep dasar HTML, struktur halaman web, dan role HTML dalam web development ecosystem.'
contentType: 'markdown'
duration: '20 menit'
order: 1
---

# Pengenalan HTML dan Dasar-dasar Web Development

Selamat datang di course pertama Anda! Dalam modul ini, kita akan mempelajari fondasi dari semua website modern: HTML (HyperText Markup Language).

## 🎯 **Apa yang Akan Anda Pelajari**

- Apa itu HTML dan mengapa itu penting
- Struktur dasar halaman web
- Elemen-elemen HTML yang paling umum
- Cara membuat halaman HTML pertama Anda

## 🔍 **Apa itu HTML?**

HTML adalah **bahasa markup** yang digunakan untuk membuat struktur halaman web. HTML bukanlah bahasa pemrograman, melainkan **bahasa yang mendeskripsikan konten**.

### **Analogi Sederhana:**

Bayangkan Anda sedang membangun rumah:

- **HTML** = Kerangka bangunan (dinding, pintu, jendela, atap)
- **CSS** = Cat, wallpaper, dekorasi interior
- **JavaScript** = Listrik, sistem pendingin, peralatan elektronik

## 🏗️ **Struktur Dasar HTML**

Setiap halaman HTML memiliki struktur fundamental yang sama:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Halaman Web Pertama Saya</title>
  </head>
  <body>
    <h1>Selamat Datang!</h1>
    <p>Ini adalah paragraf pertama saya.</p>
  </body>
</html>
```

### **Penjelasan Setiap Bagian:**

1. **<!DOCTYPE html>**: Memberitahu browser ini adalah dokumen HTML5
2. **<html lang="id">**: Root element dengan bahasa Indonesia
3. **<head>**: Meta-informasi (tidak terlihat di halaman)
4. **<body>**: Konten yang terlihat oleh pengguna

## 📦 **Elemen-elemen HTML Penting**

### **Headings (Judul)**

HTML menyediakan 6 level headings:

```html
<h1>Judul Utama (Paling Penting)</h1>
<h2>Judul Subbagian</h2>
<h3>Judul Sub-subbagian</h3>
<h4>Judul Level 4</h4>
<h5>Judul Level 5</h5>
<h6>Judul Level 6 (Paling Kecil)</h6>
```

**Best Practice**: Gunakan headings hierarkis dan jangan lewatkan level!

### **Paragraf dan Text Formatting**

```html
<p>Ini adalah paragraf normal.</p>
<p>Ini paragraf dengan <strong>text tebal</strong> dan <em>text miring</em>.</p>
<p>Ini <mark>text yang di-highlight</mark> dan ini <small>text kecil</small>.</p>
<p>Ini <code>inline code</code> untuk menunjukkan kode.</p>
```

### **Lists (Daftar)**

**Unordered List (Bullet Points):**

```html
<ul>
  <li>Item pertama</li>
  <li>Item kedua</li>
  <li>Item ketiga</li>
</ul>
```

**Ordered List (Numbered):**

```html
<ol>
  <li>Langkah pertama</li>
  <li>Langkah kedua</li>
  <li>Langkah ketiga</li>
</ol>
```

**Description List:**

```html
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
</dl>
```

### **Links (Tautan)**

```html
<!-- External Link -->
<a href="https://www.google.com">Kunjungi Google</a>

<!-- Internal Link -->
<a href="#section-1">Pergi ke Section 1</a>

<!-- Email Link -->
<a href="mailto:contact@example.com">Kirim Email</a>
```

### **Images (Gambar)**

```html
<img
  src="https://via.placeholder.com/300x200"
  alt="Placeholder image 300x200"
  width="300"
  height="200"
/>
```

**Penting!** Selalu gunakan `alt` attribute untuk accessibility.

## 🎨 **Semantic HTML5**

HTML5 memperkenalkan elemen-elemen semantic yang lebih deskriptif:

```html
<header>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Judul Artikel</h1>
    <p>Isi artikel...</p>
  </article>

  <aside>
    <h2>Related Links</h2>
    <ul>
      <li><a href="#">Link 1</a></li>
    </ul>
  </aside>
</main>

<footer>
  <p>&copy; 2024 Website Saya</p>
</footer>
```

### **Manfaat Semantic HTML:**

- ✅ **Better SEO**: Search engines memahami struktur konten
- ✅ **Accessibility**: Screen readers bisa navigasi dengan mudah
- ✅ **Maintainability**: Code lebih mudah dibaca dan maintain

## 🛠️ **Atribut HTML**

Atribut memberikan informasi tambahan tentang elemen:

```html
<div id="main-content" class="container">
  <p class="highlight" data-category="important">Text penting di sini</p>
</div>

<button type="submit" disabled aria-label="Submit form">Submit</button>
```

**Atribut umum:**

- id: Unique identifier
- class: Untuk styling dengan CSS
- data-\*: Custom data attributes
- aria-\*: Accessibility attributes

## ✍️ **Praktik: Buat Halaman Pertama Anda!**

Sekarang coba buat halaman HTML sederhana:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Profil Saya</title>
  </head>
  <body>
    <header>
      <h1>Profil Pribadi</h1>
    </header>

    <main>
      <section>
        <h2>Tentang Saya</h2>
        <p>Saya seorang <strong>web developer pemula</strong> yang sedang belajar HTML.</p>
      </section>

      <section>
        <h2>Keterampilan</h2>
        <ul>
          <li>HTML (sedang belajar)</li>
          <li>CSS (akan dipelajari)</li>
          <li>JavaScript (target berikutnya)</li>
        </ul>
      </section>

      <section>
        <h2>Kontak</h2>
        <p>Email: <a href="mailto:saya@example.com">saya@example.com</a></p>
      </section>
    </main>
  </body>
</html>
```

## 🎯 **Checkpoint: Knowledge Check**

### **Pertanyaan Review:**

1. Apa perbedaan antara HTML, CSS, dan JavaScript?
2. Mengapa semantic HTML penting?
3. Apa fungsi dari `alt` attribute pada gambar?
4. Kapan Anda menggunakan `<ul>` vs `<ol>`?

### **Mini Challenge:**

Buat halaman "hobi" dengan struktur berikut:

- Header dengan nama Anda
- Section "Hobi Saya" dengan 3 hobi dalam list
- Section "Target Belajar" dengan 3 goals
- Footer dengan copyright tahun ini

---

## 🚀 **Selanjutnya:**

Di modul berikutnya, kita akan mempelajari **HTML elements yang lebih advanced** seperti forms, tables, dan media elements.

**Ready untuk lanjut?** Klik "Next" untuk melanjutkan ke HTML Elements!
