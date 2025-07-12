import { BookOpen, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

export default function Footers() {
  return (
    <footer className="bg-ancient-fantasy border-t border-beige-300 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"></div>
      <div className="absolute top-10 right-10 text-4xl opacity-10 whimsical-bounce">🌸</div>
      <div className="absolute bottom-10 left-10 text-3xl opacity-10 whimsical-bounce animation-delay-1000">
        🏛️
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-neu">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-beige-900 font-serif">Maguru</span>
            </div>
            <p className="text-beige-700 leading-relaxed">
              Platform pembelajaran digital yang mengubah setiap pelajaran menjadi petualangan yang
              tak terlupakan. Bergabunglah dengan ribuan siswa dalam perjalanan menuju pengetahuan.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-beige-200 hover:bg-primary-500 text-beige-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover-lift"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-beige-200 hover:bg-primary-500 text-beige-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover-lift"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-beige-200 hover:bg-primary-500 text-beige-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover-lift"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-beige-200 hover:bg-primary-500 text-beige-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover-lift"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-beige-900 mb-6">Navigasi Cepat</h3>
            <ul className="space-y-3">
              {[
                { label: 'Beranda', href: '#home' },
                { label: 'Kursus', href: '#courses' },
                { label: 'Tentang Kami', href: '#about' },
                { label: 'Blog', href: '#blog' },
                { label: 'Kontak', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-beige-700 hover:text-gradient-primary transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold text-beige-900 mb-6">Kategori Kursus</h3>
            <ul className="space-y-3">
              {[
                { label: '📊 Matematika', href: '#math' },
                { label: '📚 Bahasa Indonesia', href: '#language' },
                { label: '🔬 Sains', href: '#science' },
                { label: '🏛️ Sejarah', href: '#history' },
                { label: '🎨 Seni & Budaya', href: '#arts' },
                { label: '💻 Teknologi', href: '#tech' },
              ].map((category) => (
                <li key={category.label}>
                  <a
                    href={category.href}
                    className="text-beige-700 hover:text-gradient-primary transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-beige-900 mb-6">Hubungi Kami</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 text-secondary-600" />
                </div>
                <div>
                  <p className="text-beige-700 text-sm">
                    Jl. Pendidikan No. 123
                    <br />
                    Jakarta Selatan, 12345
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-secondary-600" />
                </div>
                <p className="text-beige-700 text-sm">+62 21 1234 5678</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-secondary-600" />
                </div>
                <p className="text-beige-700 text-sm">info@maguru.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-beige-300">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-beige-700 text-sm mb-4 md:mb-0">
              © 2024 Maguru. Semua hak dilindungi. Dibuat dengan ❤️ untuk pendidikan Indonesia.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-beige-700 hover:text-gradient-primary transition-colors duration-200 text-sm"
              >
                Kebijakan Privasi
              </a>
              <a
                href="#"
                className="text-beige-700 hover:text-gradient-primary transition-colors duration-200 text-sm"
              >
                Syarat & Ketentuan
              </a>
              <a
                href="#"
                className="text-beige-700 hover:text-gradient-primary transition-colors duration-200 text-sm"
              >
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
