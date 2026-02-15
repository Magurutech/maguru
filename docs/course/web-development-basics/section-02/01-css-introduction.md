---
title: "Pengenalan CSS: Dasar-dasar Styling dan Selektor"
description: "Memahami konsep dasar CSS, cara kerja selektor, properti dasar, dan integrasi CSS dengan HTML."
contentType: "markdown"
duration: "25 menit"
order: 1
---

# Pengenalan CSS: Dasar-dasar Styling dan Selektor

Selamat datang di dunia visual design! Jika HTML adalah kerangka bangunan, maka CSS adalah **paint, furniture, dan dekorasi** yang membuat ruangan itu hidup dan menarik.

## 🎨 **Apa itu CSS?**

**CSS (Cascading Style Sheets)** adalah stylesheet language yang digunakan untuk mendeskripsikan presentasi dari document yang ditulis dalam HTML atau XML.

### **Apa yang Bisa Dilakukan CSS?**
- Mengubah warna, font, dan ukuran text
- Mengatur layout dan positioning
- Menambahkan animasi dan transitions
- Membuat responsive design untuk berbagai devices
- Membuat hover effects dan interactive states
- Menambahkan background images dan gradients

## 🔗 **Cara Menghubungkan CSS dengan HTML**

### **1. External Stylesheet (Recommended)**

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="id">
<head>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>

<!-- styles.css -->
h1 {
    color: blue;
    font-size: 24px;
}
```

**Benefits:**
- ✅ Separation of concerns
- ✅ Cacheable oleh browser
- ✅ Reusable across multiple pages
- ✅ Easier maintenance

### **2. Internal Stylesheet**

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <style>
        h1 {
            color: blue;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```

**Use Cases:**
- Single page applications
- Page-specific styles
- Email templates
- Quick prototyping

### **3. Inline Styles**

```html
<h1 style="color: blue; font-size: 24px;">Hello World</h1>
```

**Use Cases:**
- Dynamic styles (JavaScript)
- Email templates
- Quick overrides
- HTML emails

## 🎯 **CSS Syntax Structure**

```css
/* CSS Rule Structure */
selector {
    property: value;
    property: value;
}

/* Example */
h1 {
    color: #333333;
    font-size: 2rem;
    font-weight: bold;
}
```

### **Anatomy of CSS Rule:**

1. **Selector**: Target element yang akan di-style
2. **Property**: Aspek styling yang akan diubah
3. **Value**: Nilai dari property
4. **Declaration Block**: Semua property-value pairs dalam kurung kurawal

## 🔍 **CSS Selectors: Dasar hingga Advanced**

### **1. Basic Selectors**

```css
/* Element Selector */
h1 {
    color: blue;
}

/* Class Selector */
.highlight {
    background-color: yellow;
}

/* ID Selector */
#header {
    background-color: #333;
}

/* Universal Selector */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

### **2. Combination Selectors**

```css
/* Descendant Selector */
article p {
    line-height: 1.6;
}

/* Child Selector */
ul > li {
    list-style-type: none;
}

/* Adjacent Sibling Selector */
h1 + p {
    font-weight: bold;
}

/* General Sibling Selector */
h1 ~ p {
    color: #666;
}
```

### **3. Attribute Selectors**

```css
/* Exact match */
[type="text"] {
    border: 1px solid #ccc;
}

/* Starts with */
[class^="btn-"] {
    padding: 10px 20px;
}

/* Ends with */
[href$=".pdf"] {
    background: url(pdf-icon.png) no-repeat;
}

/* Contains */
[class*="col-"] {
    float: left;
}

/* Word */
[lang~="en"] {
    font-style: italic;
}
```

### **4. Pseudo-classes**

```css
/* Link States */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { color: red; }
a:active { color: orange; }

/* Focus States */
input:focus {
    border: 2px solid #0066cc;
}

/* First Child */
li:first-child {
    font-weight: bold;
}

/* Last Child */
li:last-child {
    margin-bottom: 0;
}

/* Nth Child */
tr:nth-child(even) {
    background-color: #f5f5f5;
}

tr:nth-child(odd) {
    background-color: white;
}

/* Nth of Type */
p:nth-of-type(2) {
    color: red;
}
```

### **5. Pseudo-elements**

```css
/* First Letter */
p::first-letter {
    font-size: 2em;
    float: left;
}

/* First Line */
p::first-line {
    font-weight: bold;
}

/* Before and After */
.quote::before {
    content: '"';
    font-size: 2em;
    color: #ccc;
}

.quote::after {
    content: '"';
    font-size: 2em;
    color: #ccc;
}

/* Selection */
::selection {
    background-color: #ffeb3b;
    color: #000;
}
```

## 🎨 **CSS Properties: Dasar-dasar Styling**

### **1. Text Properties**

```css
.text-styling {
    /* Font Properties */
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    font-weight: normal; /* normal, bold, 100-900 */
    font-style: normal; /* normal, italic, oblique */
    font-variant: normal;
    line-height: 1.5;

    /* Text Properties */
    color: #333333;
    text-align: left; /* left, center, right, justify */
    text-decoration: none; /* none, underline, overline, line-through */
    text-transform: none; /* none, uppercase, lowercase, capitalize */
    text-indent: 0;
    letter-spacing: normal;
    word-spacing: normal;
    white-space: normal; /* normal, nowrap, pre, pre-wrap, pre-line */
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}
```

### **2. Color Properties**

```css
.color-examples {
    /* Color Formats */
    color: red; /* Color name */
    color: #ff0000; /* Hex */
    color: #f00; /* Short hex */
    color: rgb(255, 0, 0); /* RGB */
    color: rgba(255, 0, 0, 0.5); /* RGBA with alpha */
    color: hsl(0, 100%, 50%); /* HSL */
    color: hsla(0, 100%, 50%, 0.5); /* HSLA with alpha */

    /* Background Properties */
    background-color: #ffffff;
    background-image: url('pattern.png');
    background-repeat: no-repeat; /* repeat, repeat-x, repeat-y, no-repeat */
    background-position: center center;
    background-size: cover; /* auto, cover, contain */
    background-attachment: scroll; /* scroll, fixed, local */

    /* Shorthand */
    background: #ffffff url('pattern.png') no-repeat center center/cover;
}
```

### **3. Box Model Properties**

```css
.box-model {
    /* Dimensions */
    width: 300px;
    height: 200px;
    max-width: 100%;
    min-height: 100px;

    /* Margins (outside) */
    margin: 20px;
    margin-top: 10px;
    margin-right: 15px;
    margin-bottom: 10px;
    margin-left: 15px;
    margin: 10px 15px; /* top/bottom left/right */
    margin: 10px 15px 20px; /* top left/right bottom */
    margin: 10px 15px 20px 25px; /* top right bottom left */

    /* Padding (inside) */
    padding: 20px;
    padding-top: 10px;
    padding-right: 15px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding: 10px 15px;

    /* Border */
    border: 2px solid #333;
    border-width: 2px;
    border-style: solid; /* solid, dashed, dotted, double, groove, ridge, inset, outset */
    border-color: #333;
    border-radius: 5px;

    /* Outline (outside border) */
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}
```

### **4. Box Sizing**

```css
/* Important: Include this in all projects */
*,
*::before,
*::after {
    box-sizing: border-box;
}

/* Box sizing comparison */
.content-box {
    width: 300px;
    padding: 20px;
    border: 2px solid #333;
    /* Total width = 300 + 40 + 4 = 344px */
}

.border-box {
    width: 300px;
    padding: 20px;
    border: 2px solid #333;
    box-sizing: border-box;
    /* Total width = 300px (padding dan border termasuk) */
}
```

## 🔧 **Specificity dan Cascade**

### **Specificity Rules (Most to Least Specific):**
1. Inline styles (`style="..."`)
2. ID selectors (`#header`)
3. Class selectors (`.highlight`)
4. Attribute selectors (`[type="text"]`)
5. Pseudo-classes (`:hover`)
6. Element selectors (`h1`)
7. Universal selector (`*`)

### **Specificity Examples:**

```css
/* Low specificity */
p {
    color: black;
}

/* Higher specificity */
.content p {
    color: blue;
}

/* Even higher specificity */
#main .content p {
    color: red;
}

/* Highest specificity */
#main .content p.highlight {
    color: green;
}

/* Inline style beats all */
<p style="color: purple;">Text</p>
```

### **!important (Use Sparingly)**

```css
/* Avoid using !important when possible */
p {
    color: blue !important; /* Overrides other styles */
}

/* Better approach: Use more specific selector */
#main .content p {
    color: blue;
}
```

## 🎯 **CSS Comments dan Organization**

### **Comment Styles:**

```css
/* ===========================================
   SECTION: Main Layout Styles
   =========================================== */

/* Header Styles */
.header {
    background: #333;
    color: white;
}

/* Navigation */
.nav {
    /* Flex container for navigation items */
    display: flex;
    justify-content: space-between;
}

/* Individual navigation items */
.nav-item {
    padding: 10px 15px;
}

/*
  Complex styles explanation:
  This creates a card component with:
  - Border radius for rounded corners
  - Box shadow for depth
  - Transition for smooth hover effects
*/
.card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}
```

## ✍️ **Praktik: Styling HTML Portfolio**

Mari styling portfolio HTML yang kita buat sebelumnya:

```css
/* styles.css */

/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333333;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header Styles */
header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand h1 {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: #ffd700;
}

/* Hero Section */
.hero {
    margin-top: 80px;
    padding: 4rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.highlight {
    color: #ffd700;
}

.hero-buttons {
    margin: 2rem 0;
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn {
    padding: 12px 24px;
    text-decoration: none;
    border-radius: 5px;
    transition: all 0.3s ease;
    display: inline-block;
}

.btn-primary {
    background: #ffd700;
    color: #333;
}

.btn-primary:hover {
    background: #ffed4e;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #333;
}

/* Section Styles */
section {
    padding: 4rem 0;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #333;
}

/* About Section */
.about {
    background: #f8f9fa;
}

.about-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    align-items: center;
}

.about-stats {
    display: grid;
    gap: 2rem;
}

.stat-item {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #667eea;
}

.stat-label {
    color: #666;
    margin-top: 0.5rem;
}

/* Skills Section */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.skill-category {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.skill-category h3 {
    color: #333;
    margin-bottom: 1.5rem;
}

.skill-item {
    margin-bottom: 1.5rem;
}

.skill-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.skill-bar {
    background: #e9ecef;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
}

.skill-progress {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tech-tag {
    background: #e9ecef;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }

    .hero-title {
        font-size: 2rem;
    }

    .about-content {
        grid-template-columns: 1fr;
    }

    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
}
```

## 🎯 **Checkpoint: Knowledge Check**

### **CSS Selector Quiz:**
```css
/* Apa elemen yang akan di-style oleh selector berikut? */

/* 1 */
.container .item.highlight {
    color: red;
}

/* 2 */
nav ul li:first-child {
    font-weight: bold;
}

/* 3 */
input[type="email"]:focus {
    border-color: blue;
}

/* 4 */
article > p:nth-child(2)::first-line {
    font-style: italic;
}
```

### **Practical Questions:**
1. Apa perbedaan antara `margin` dan `padding`?
2. Kapan Anda menggunakan `box-sizing: border-box`?
3. Apa itu CSS specificity dan bagaimana cara kerjanya?
4. Kenapa `!important` sebaiknya dihindari?

---

## 🚀 **Selanjutnya:**

Di modul berikutnya, kita akan mempelajari **Layout & Positioning** untuk mengatur elemen dengan tepat di halaman web!

**Ready untuk layout mastery?** Klik "Next" untuk belajar positioning dan layout techniques!