import { Button } from '@/components/ui/button'

export function Heros() {
  return (
    <section className="relative min-h-screen bg-ancient-fantasy overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-magical-sunset opacity-30"></div>
      <div className="absolute top-20 left-10 text-8xl opacity-10 whimsical-bounce">🌸</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10 whimsical-bounce animation-delay-1000">
        🌿
      </div>
      <div className="absolute top-1/3 right-1/4 text-4xl opacity-20 whimsical-bounce animation-delay-500">
        ✨
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-beige-900 mb-6 font-serif leading-tight">
              Petualangan Belajar
              <span className="text-gradient-primary block mt-2">Dimulai di Sini! 🏛️</span>
            </h1>
            <p className="text-xl md:text-2xl text-beige-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Bergabunglah dalam perjalanan magis menuju pengetahuan dengan
              <span className="font-semibold text-secondary-600"> Maguru</span> - platform
              pembelajaran yang mengubah setiap pelajaran menjadi petualangan yang tak terlupakan
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="btn-primary magical-glow text-lg px-8 py-4 hover-lift">
              🚀 Mulai Petualangan
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-secondary hover-glow text-lg px-8 py-4 border-2"
            >
              🎯 Jelajahi Kursus
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="glass-panel p-6 rounded-2xl border border-beige-300 hover-lift">
              <div className="text-3xl font-bold text-beige-900 mb-2">10K+</div>
              <div className="text-beige-700">Siswa Aktif</div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-beige-300 hover-lift">
              <div className="text-3xl font-bold text-beige-900 mb-2">500+</div>
              <div className="text-beige-700">Kursus Berkualitas</div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-beige-300 hover-lift">
              <div className="text-3xl font-bold text-beige-900 mb-2">98%</div>
              <div className="text-beige-700">Kepuasan Siswa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Element */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-8 border-2 border-beige-600 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-beige-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
