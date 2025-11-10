---
title: "Praktik: Membuat Halaman Web Pertama Anda"
description: "Waktu praktik! Buat halaman web personal portfolio menggunakan semua HTML concepts yang telah dipelajari."
contentType: "markdown"
duration: "30 menit"
order: 3
---

# Praktik: Membuat Halaman Web Pertama Anda

Selamat! Anda sudah mempelajari dasar-dasar HTML. Sekarang waktunya untuk **praktik nyata** dengan membuat halaman web portfolio personal yang professional!

## 🎯 **Apa yang Akan Anda Buat**

Kita akan membuat **halaman portfolio personal** dengan:
- Header dengan navigation
- Hero section dengan informasi tentang Anda
- Skills section dengan progress bars
- Projects gallery
- Contact form
- Footer dengan social media links

## 🏗️ **Project Structure**

```
portfolio.html
├── Header (Navigation)
├── Hero Section
├── About Section
├── Skills Section
├── Projects Section
├── Contact Section
└── Footer
```

## 🎨 **Step-by-Step Implementation**

### **Step 1: Basic HTML Structure**

Mari mulai dengan struktur fundamental:

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - John Doe</title>
    <meta name="description" content="Portfolio web developer John Doe">

    <!-- SEO Meta Tags -->
    <meta name="keywords" content="web developer, portfolio, html, css, javascript">
    <meta name="author" content="John Doe">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Portfolio - John Doe">
    <meta property="og:description" content="Personal portfolio web developer">
    <meta property="og:type" content="website">
</head>
<body>
    <!-- Content akan ditambahkan di sini -->
</body>
</html>
```

### **Step 2: Header dengan Navigation**

```html
<header>
    <nav class="navbar">
        <div class="nav-brand">
            <h1>John Doe</h1>
        </div>

        <ul class="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>
</header>
```

### **Step 3: Hero Section**

```html
<section id="home" class="hero">
    <div class="hero-content">
        <h2 class="hero-title">
            Halo, Saya <span class="highlight">John Doe</span>
        </h2>

        <p class="hero-subtitle">
            Web Developer | UI/UX Enthusiast | Problem Solver
        </p>

        <p class="hero-description">
            Saya passionate tentang membuat website yang tidak hanya cantik,
            tapi juga user-friendly dan performant.
            Mari bekerja sama untuk mewujudkan ide Anda!
        </p>

        <div class="hero-buttons">
            <a href="#projects" class="btn btn-primary">
                Lihat Portfolio
            </a>
            <a href="#contact" class="btn btn-secondary">
                Hubungi Saya
            </a>
        </div>

        <!-- Social Links -->
        <div class="social-links">
            <a href="https://github.com" aria-label="GitHub">
                <img src="github-icon.svg" alt="GitHub">
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
                <img src="linkedin-icon.svg" alt="LinkedIn">
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
                <img src="twitter-icon.svg" alt="Twitter">
            </a>
        </div>
    </div>

    <!-- Hero Image/Illustration -->
    <div class="hero-image">
        <img
            src="profile-photo.jpg"
            alt="John Doe - Web Developer"
            width="400"
            height="400">
    </div>
</section>
```

### **Step 4: About Section**

```html
<section id="about" class="about">
    <div class="container">
        <h2 class="section-title">Tentang Saya</h2>

        <div class="about-content">
            <div class="about-text">
                <h3>Story Saya</h3>
                <p>
                    Perjalanan saya sebagai web developer dimulai 3 tahun yang lalu
                    ketika saya tertarik dengan bagaimana website bekerja.
                    Dari HTML sederhana, saya terus belajar dan berkembang
                    hingga bisa membuat aplikasi web yang kompleks.
                </p>

                <h3>Passion Saya</h3>
                <p>
                    Saya passionate tentang:
                </p>
                <ul>
                    <li><strong>Clean Code</strong> - Code yang mudah dibaca dan maintain</li>
                    <li><strong>User Experience</strong> - Website yang intuitive dan enjoyable</li>
                    <li><strong>Performance</strong> - Fast loading dan smooth interactions</li>
                    <li><strong>Continuous Learning</strong> - Selalu update dengan teknologi terbaru</li>
                </ul>
            </div>

            <div class="about-stats">
                <div class="stat-item">
                    <h3 class="stat-number">50+</h3>
                    <p class="stat-label">Projects Completed</p>
                </div>

                <div class="stat-item">
                    <h3 class="stat-number">3</h3>
                    <p class="stat-label">Years Experience</p>
                </div>

                <div class="stat-item">
                    <h3 class="stat-number">100%</h3>
                    <p class="stat-label">Client Satisfaction</p>
                </div>
            </div>
        </div>
    </div>
</section>
```

### **Step 5: Skills Section**

```html
<section id="skills" class="skills">
    <div class="container">
        <h2 class="section-title">Keahlian Saya</h2>

        <div class="skills-grid">
            <!-- Frontend Skills -->
            <div class="skill-category">
                <h3>Frontend Development</h3>

                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">HTML5 & Semantic HTML</span>
                        <span class="skill-level">90%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: 90%"></div>
                    </div>
                </div>

                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">CSS3 & Responsive Design</span>
                        <span class="skill-level">85%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: 85%"></div>
                    </div>
                </div>

                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">JavaScript ES6+</span>
                        <span class="skill-level">80%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: 80%"></div>
                    </div>
                </div>

                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">React.js</span>
                        <span class="skill-level">75%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: 75%"></div>
                    </div>
                </div>
            </div>

            <!-- Tools & Other Skills -->
            <div class="skill-category">
                <h3>Tools & Technologies</h3>

                <div class="skill-tags">
                    <span class="skill-tag">Git & GitHub</span>
                    <span class="skill-tag">VS Code</span>
                    <span class="skill-tag">Chrome DevTools</span>
                    <span class="skill-tag">Figma</span>
                    <span class="skill-tag">Firebase</span>
                    <span class="skill-tag">Netlify</span>
                    <span class="skill-tag">REST APIs</span>
                    <span class="skill-tag">Responsive Design</span>
                </div>
            </div>

            <!-- Soft Skills -->
            <div class="skill-category">
                <h3>Soft Skills</h3>

                <ul class="soft-skills">
                    <li>🤝 Team Collaboration</li>
                    <li>💡 Problem Solving</li>
                    <li>📊 Project Management</li>
                    <li>🎯 Attention to Detail</li>
                    <li>🗣️ Communication</li>
                    <li>⏰ Time Management</li>
                </ul>
            </div>
        </div>
    </div>
</section>
```

### **Step 6: Projects Section**

```html
<section id="projects" class="projects">
    <div class="container">
        <h2 class="section-title">Projects Saya</h2>

        <div class="projects-grid">
            <!-- Project 1 -->
            <article class="project-card">
                <div class="project-image">
                    <img
                        src="project-1-thumbnail.jpg"
                        alt="E-commerce Website Project"
                        width="400"
                        height="250">
                    <div class="project-overlay">
                        <a href="https://project-demo-1.com" class="btn btn-white">
                            Live Demo
                        </a>
                        <a href="https://github.com/project-1" class="btn btn-outline">
                            View Code
                        </a>
                    </div>
                </div>

                <div class="project-content">
                    <h3 class="project-title">E-commerce Platform</h3>
                    <p class="project-description">
                        E-commerce website dengan shopping cart, payment integration,
                        dan admin panel untuk inventory management.
                    </p>

                    <div class="project-tech">
                        <span class="tech-tag">React</span>
                        <span class="tech-tag">Node.js</span>
                        <span class="tech-tag">MongoDB</span>
                        <span class="tech-tag">Stripe API</span>
                    </div>

                    <div class="project-stats">
                        <span>⭐ 4.8/5</span>
                        <span>👥 1.2k users</span>
                        <span>📅 2024</span>
                    </div>
                </div>
            </article>

            <!-- Project 2 -->
            <article class="project-card">
                <div class="project-image">
                    <img
                        src="project-2-thumbnail.jpg"
                        alt="Task Management App Project"
                        width="400"
                        height="250">
                    <div class="project-overlay">
                        <a href="https://project-demo-2.com" class="btn btn-white">
                            Live Demo
                        </a>
                        <a href="https://github.com/project-2" class="btn btn-outline">
                            View Code
                        </a>
                    </div>
                </div>

                <div class="project-content">
                    <h3 class="project-title">Task Management App</h3>
                    <p class="project-description">
                        Productivity app untuk task management dengan drag-and-drop,
                        real-time collaboration, dan team dashboard.
                    </p>

                    <div class="project-tech">
                        <span class="tech-tag">Vue.js</span>
                        <span class="tech-tag">Firebase</span>
                        <span class="tech-tag">Vuex</span>
                        <span class="tech-tag">Vuetify</span>
                    </div>

                    <div class="project-stats">
                        <span>⭐ 4.6/5</span>
                        <span>👥 800+ users</span>
                        <span>📅 2023</span>
                    </div>
                </div>
            </article>

            <!-- Project 3 -->
            <article class="project-card">
                <div class="project-image">
                    <img
                        src="project-3-thumbnail.jpg"
                        alt="Weather Dashboard Project"
                        width="400"
                        height="250">
                    <div class="project-overlay">
                        <a href="https://project-demo-3.com" class="btn btn-white">
                            Live Demo
                        </a>
                        <a href="https://github.com/project-3" class="btn btn-outline">
                            View Code
                        </a>
                    </div>
                </div>

                <div class="project-content">
                    <h3 class="project-title">Weather Dashboard</h3>
                    <p class="project-description">
                        Real-time weather dashboard dengan location-based forecasts,
                        interactive maps, dan weather alerts.
                    </p>

                    <div class="project-tech">
                        <span class="tech-tag">JavaScript</span>
                        <span class="tech-tag">Weather API</span>
                        <span class="tech-tag">Chart.js</span>
                        <span class="tech-tag">Leaflet</span>
                    </div>

                    <div class="project-stats">
                        <span>⭐ 4.7/5</span>
                        <span>👥 500+ users</span>
                        <span>📅 2023</span>
                    </div>
                </div>
            </article>
        </div>

        <!-- View All Projects Button -->
        <div class="text-center">
            <a href="https://github.com/johndoe" class="btn btn-primary">
                Lihat Semua Projects di GitHub
            </a>
        </div>
    </div>
</section>
```

### **Step 7: Contact Section**

```html
<section id="contact" class="contact">
    <div class="container">
        <h2 class="section-title">Hubungi Saya</h2>

        <div class="contact-content">
            <div class="contact-info">
                <h3>Mari Berkolaborasi!</h3>
                <p>
                    Saya selalu terbuka untuk diskusi tentang project baru,
                    creative ideas, atau kesempatan untuk menjadi bagian dari visi Anda.
                </p>

                <div class="contact-methods">
                    <div class="contact-item">
                        <div class="contact-icon">📧</div>
                        <div class="contact-details">
                            <h4>Email</h4>
                            <a href="mailto:john.doe@example.com">john.doe@example.com</a>
                        </div>
                    </div>

                    <div class="contact-item">
                        <div class="contact-icon">📱</div>
                        <div class="contact-details">
                            <h4>Phone</h4>
                            <a href="tel:+628123456789">+62 812-3456-789</a>
                        </div>
                    </div>

                    <div class="contact-item">
                        <div class="contact-icon">📍</div>
                        <div class="contact-details">
                            <h4>Location</h4>
                            <p>Jakarta, Indonesia</p>
                        </div>
                    </div>
                </div>

                <!-- Social Media Links -->
                <div class="social-section">
                    <h4>Connect dengan Saya</h4>
                    <div class="social-links-large">
                        <a href="https://github.com/johndoe" aria-label="GitHub">
                            <img src="github-large.svg" alt="GitHub">
                        </a>
                        <a href="https://linkedin.com/in/johndoe" aria-label="LinkedIn">
                            <img src="linkedin-large.svg" alt="LinkedIn">
                        </a>
                        <a href="https://twitter.com/johndoe" aria-label="Twitter">
                            <img src="twitter-large.svg" alt="Twitter">
                        </a>
                        <a href="https://instagram.com/johndoe" aria-label="Instagram">
                            <img src="instagram-large.svg" alt="Instagram">
                        </a>
                    </div>
                </div>
            </div>

            <div class="contact-form">
                <form action="/send-message" method="POST">
                    <h3>Kirim Pesan</h3>

                    <div class="form-group">
                        <label for="name">Nama Lengkap *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="John Doe">
                    </div>

                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="john@example.com">
                    </div>

                    <div class="form-group">
                        <label for="subject">Subject *</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            required
                            placeholder="Project Collaboration">
                    </div>

                    <div class="form-group">
                        <label for="message">Pesan *</label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows="5"
                            placeholder="Halo John, saya tertarik untuk berdiskusi tentang..."></textarea>
                    </div>

                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="newsletter" name="newsletter">
                        <label for="newsletter">
                            Saya ingin menerima update tentang projects dan artikel terbaru
                        </label>
                    </div>

                    <button type="submit" class="btn btn-primary btn-full">
                        Kirim Pesan
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>
```

### **Step 8: Footer**

```html
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-brand">
                <h3>John Doe</h3>
                <p>Web Developer & UI/UX Enthusiast</p>
                <p>Membuat website yang cantik, functional, dan user-friendly.</p>
            </div>

            <div class="footer-links">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>

            <div class="footer-links">
                <h4>Resources</h4>
                <ul>
                    <li><a href="https://github.com/johndoe">GitHub</a></li>
                    <li><a href="https://linkedin.com/in/johndoe">LinkedIn</a></li>
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/resume">Resume</a></li>
                </ul>
            </div>

            <div class="footer-newsletter">
                <h4>Newsletter</h4>
                <p>Dapatkan tips dan update terbaru langsung di inbox Anda!</p>

                <form action="/subscribe" method="POST" class="newsletter-form">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; 2024 John Doe. All rights reserved.</p>
            <p>
                Made with <span class="heart">❤️</span> using HTML, CSS, and JavaScript
            </p>
        </div>
    </div>
</footer>
```

## 🧪 **Testing Your Portfolio**

### **HTML Validation Checklist:**

✅ **Structure Check:**
- [ ] DOCTYPE declaration benar
- [ ] Language attribute di `<html>`
- [ ] Meta viewport tag ada
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Semantically correct elements

✅ **Accessibility Check:**
- [ ] Semua images ada `alt` attribute
- [ ] Forms punya proper labels
- [ ] Interactive elements keyboard accessible
- [ ] Color contrast sufficient
- [ ] ARIA labels dimana perlu

✅ **SEO Check:**
- [ ] Title tag descriptive
- [ ] Meta description ada
- [ ] Open Graph tags
- [ ] Proper heading structure
- [ ] Internal linking functional

✅ **Performance Check:**
- [ ] Images optimized (lazy loading)
- [ ] Proper alt texts
- [ ] Minimal external dependencies
- [ ] Semantic HTML for better parsing

## 🚀 **Deployment Options**

### **Option 1: GitHub Pages (Free)**
```bash
# 1. Upload ke GitHub repository
# 2. Enable GitHub Pages in repository settings
# 3. Website akan live di: username.github.io/repository-name
```

### **Option 2: Netlify (Free)**
```bash
# 1. Drag and drop folder ke netlify.com
# 2. Atau connect dengan GitHub
# 3. Auto-deploy on push
```

### **Option 3: Vercel (Free)**
```bash
# 1. Import project dari GitHub
# 2. Auto-deployment setup
# 3. Custom domain available
```

## 🎯 **Checkpoint: Project Complete!**

### **Portfolio Features Checklist:**
- [ ] Responsive navigation menu
- [ ] Hero section dengan CTA buttons
- [ ] About section dengan stats
- [ ] Skills section dengan progress bars
- [ ] Projects gallery dengan hover effects
- [ ] Contact form dengan validation
- [ ] Footer dengan social links
- [ ] Smooth scrolling navigation
- [ ] Mobile responsive design

### **Bonus Features untuk Tambahkan:**
- [ ] Dark mode toggle
- [ ] Loading animations
- [ ] Testimonials section
- [ ] Blog section
- [ ] Back to top button
- [ ] Cookie consent banner

## 🎉 **Selamat!**

Anda berhasil membuat **portfolio website yang professional** hanya dengan HTML! Ini adalah achievement yang luar biasa.

### **Next Steps:**
1. **Customize** content dengan informasi pribadi Anda
2. **Add images** dan actual project thumbnails
3. **Test responsiveness** di berbagai devices
4. **Deploy** ke hosting platform
5. **Share** portfolio Anda ke social media!

---

## 🚀 **Selanjutnya:**

Di modul berikutnya, kita akan mempelajari **CSS Basics** untuk **menghias portfolio ini** dengan colors, typography, animations, dan layout yang menarik!

**Ready untuk styling?** Klik "Next" untuk transform portfolio Anda menjadi masterpiece visual!