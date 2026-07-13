import React from 'react'
import { SkeuoCard } from '@/components/skeuo-card'
import { 
  Bot, 
  Send, 
  Award, 
  GraduationCap, 
  Star, 
  BookOpen, 
  Search, 
  AlertCircle,
  Sparkles
} from 'lucide-react'

export default function UIElementsShowcase() {
  return (
    <div className="space-y-12">
      {/* Introduction Header */}
      <section className="text-center md:text-left">
        <h2 className="text-h2 font-manrope font-semibold text-text-primary mb-2">
          Katalog Elemen UI (Visual Showcase)
        </h2>
        <p className="text-body-md text-text-secondary max-w-2xl">
          Komponen antarmuka Maguru dirancang menggunakan teknik skeuomorphism artisan 3D taktil. 
          Semua elemen memiliki bayangan, bevel, dan efek kedalaman yang dinamis.
        </p>
      </section>

      {/* Grid Layout of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ========================================================================= */}
        {/* SMALL ELEMENTS (1 COLUMN SPAN)                                            */}
        {/* ========================================================================= */}

        <SkeuoCard 
          variant="paper" 
          size="small" 
          titleText="Tombol Primer & Sekunder" 
          descriptionText="Tombol fisis dengan arah cahaya 45°"
        >
          <div className="flex flex-col gap-4 mt-2">
            <button className="px-6 py-3 rounded-xl font-semibold btn-interactive coral-skeuo text-center w-full">
              Tombol Coral (Primer)
            </button>
            <button className="px-6 py-3 rounded-xl font-semibold btn-interactive ai-blue-skeuo text-center w-full flex items-center justify-center gap-2">
              <Bot className="w-5 h-5 text-white" />
              Tombol AI Blue
            </button>
            <button className="px-6 py-3 rounded-xl font-semibold btn-interactive btn-secondary text-center w-full">
              Tombol Outline Ink
            </button>
          </div>
        </SkeuoCard>

        <SkeuoCard 
          variant="paper" 
          size="small" 
          titleText="Status Badges" 
          descriptionText="Badge taktil untuk status penanda"
        >
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold font-cinzel tracking-widest gold-skeuo flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#3E5237]/20" />
              ARTISAN VERIFIED
            </span>
            
            <span className="px-3 py-1.5 rounded-full text-xs font-bold font-cinzel tracking-widest success-skeuo flex items-center gap-1">
              <Award className="w-3.5 h-3.5 fill-white/20" />
              COMPETENCY III
            </span>

            <span className="px-3 py-1.5 rounded-full text-xs font-bold font-mono debossed-skeuo flex items-center gap-1">
              STATUS: STABLE
            </span>
            
            <span className="px-3 py-1.5 rounded-full text-xs font-bold coral-skeuo text-white">
              NEW CONTENT
            </span>
          </div>
        </SkeuoCard>

        <SkeuoCard 
          variant="paper" 
          size="small" 
          titleText="Mikro-Interaksi Tombol" 
          descriptionText="Simulasi hover & active fisis"
        >
          <div className="space-y-3 mt-2">
            <div className="text-caption text-text-muted">Gunakan tombol di bawah untuk merasakan efek magnetis ditekan:</div>
            <button className="px-6 py-3 rounded-xl font-semibold btn-interactive peach-skeuo text-center w-full">
              Tekan Saya (Skeuo Peach)
            </button>
            <div className="text-caption text-text-faint text-center">
              Hover: scale-102 & translateY(-1px) <br />
              Active: scale-98 & translateY(1px)
            </div>
          </div>
        </SkeuoCard>

        {/* ========================================================================= */}
        {/* MEDIUM ELEMENTS (2 COLUMNS SPAN)                                          */}
        {/* ========================================================================= */}

        <SkeuoCard 
          variant="paper" 
          size="medium" 
          titleText="Input Fields (.neu-input)" 
          descriptionText="Input text bergaya debossed/tenggelam taktil"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <label className="text-caption font-semibold text-text-primary">Input Default</label>
              <input 
                type="text" 
                placeholder="Masukkan teks di sini..." 
                className="w-full px-4 py-3 rounded-xl text-body-md neu-input"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-caption font-semibold text-text-primary flex items-center gap-1">
                Input Active / Focus
                <span className="text-accent-coral text-[10px]">• Focus State</span>
              </label>
              <input 
                type="text" 
                defaultValue="Fokus interaktif" 
                className="w-full px-4 py-3 rounded-xl text-body-md neu-input shadow-neu ring-2 ring-accent-coral outline-none"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-caption font-semibold text-text-primary flex items-center gap-1">
                Input Error / Gagal
                <span className="text-error text-[10px] flex items-center gap-0.5"><AlertCircle className="w-3 h-3" /> Wajib diisi</span>
              </label>
              <input 
                type="text" 
                placeholder="Terjadi kesalahan input" 
                className="w-full px-4 py-3 rounded-xl text-body-md neu-input border-error ring-1 ring-error/30 outline-none"
              />
            </div>
          </div>
        </SkeuoCard>

        <SkeuoCard 
          variant="paper" 
          size="medium" 
          titleText="AI Chat Bubbles & Dialog" 
          descriptionText="Balon percakapan taktil asimetris"
        >
          <div className="space-y-4 mt-2">
            {/* AI Assistant Bubble */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl coral-skeuo flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="chat-bubble-ai p-4 text-body-md shadow-sm border border-text-faint/10 max-w-[85%]">
                <div className="font-semibold text-accent-coral text-caption mb-1 flex items-center gap-1">
                  AI CO-TEACHER <Sparkles className="w-3 h-3 fill-accent-coral/20" />
                </div>
                Halo! Saya siap membantu Anda menganalisis materi belajar hari ini. Konsep bagian mana yang ingin Anda diskusikan terlebih dahulu?
              </div>
            </div>

            {/* User Bubble */}
            <div className="flex items-start gap-3 justify-end">
              <div className="chat-bubble-user p-4 text-body-md shadow-sm border border-text-faint/10 max-w-[85%] text-right">
                <div className="font-semibold text-text-muted text-caption mb-1">
                  ANDA (STUDENT)
                </div>
                Tolong jelaskan tentang aturan datang cahaya 45 derajat pada prinsip skeuomorphism.
              </div>
              <div className="w-10 h-10 rounded-xl bg-bg-surface-accent flex items-center justify-center shrink-0 border border-text-faint/15 shadow-sm font-cinzel font-bold text-text-primary text-sm">
                S
              </div>
            </div>
          </div>
        </SkeuoCard>

        <SkeuoCard 
          variant="paper" 
          size="medium" 
          titleText="Lencana Kompetensi (Mastery Medal & Badge)" 
          descriptionText="Sertifikasi pencapaian kompetensi bertema material fisik"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4 p-4 rounded-xl debossed-skeuo bg-bg-canvas/50">
            {/* Medal Visual */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center rounded-full gold-skeuo shadow-md border-t-2 border-t-white/80">
              <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#3E5237]/30 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-[#3E5237]" />
              </div>
            </div>

            {/* Badge Content */}
            <div className="text-center sm:text-left space-y-1">
              <div className="text-roman font-cinzel text-accent-coral tracking-widest">CHAPTER II • WEB DEV</div>
              <h4 className="text-body-lg font-manrope font-bold text-text-primary">Master of UI/UX Engineering</h4>
              <p className="text-caption text-text-muted">
                Diberikan atas penguasaan penuh prinsip-prinsip visual taktil Atelier Zero dan integrasi fungsionalitas UI modern.
              </p>
            </div>
          </div>
        </SkeuoCard>

        {/* ========================================================================= */}
        {/* LARGE ELEMENTS (3 COLUMNS SPAN)                                           */}
        {/* ========================================================================= */}

        <SkeuoCard 
          variant="ancient" 
          size="large" 
          titleText="3D Tilt Course Card (.depth-card)" 
          descriptionText="Kartu interaktif dengan perspective dan efek translasi sumbu Z"
          isTilt={true}
          className="hover:shadow-glow"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 items-center">
            {/* Card Thumbnail */}
            <div className="rounded-xl h-40 bg-nature-blend flex flex-col justify-between p-4 relative overflow-hidden border border-text-faint/15">
              <div className="absolute inset-0 pointer-events-none paper-texture opacity-30" />
              <div className="px-2 py-1 rounded bg-[#566B4D] text-white text-xs font-cinzel max-w-max font-bold tracking-widest shadow-sm">
                SKEUO - C2
              </div>
              <div className="text-white relative z-10">
                <div className="text-caption font-cinzel tracking-widest opacity-85">COURSE MODULE</div>
                <div className="font-bold text-body-lg font-manrope">Visual Skeuomorphism</div>
              </div>
            </div>

            {/* Card Content & Progress */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1">
                <span className="text-caption font-bold text-accent-coral font-cinzel tracking-wider">LEVEL DESIGN EXPERT</span>
                <h4 className="text-h2 font-manrope font-semibold text-text-primary leading-tight">
                  Skeuomorphic Artistry: The Physics of Lighting in Web UI
                </h4>
                <p className="text-caption text-text-secondary">
                  Pelajari rahasia beveling, simulasi drop shadows, tekstur kertas SVG, dan arah sorot cahaya 45° kiri-atas secara detail.
                </p>
              </div>

              {/* Progress Bar Success */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-caption font-semibold">
                  <span className="text-text-muted flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> 8 dari 10 Sub-Modul</span>
                  <span className="text-success font-mono">80% Mastered</span>
                </div>
                <div className="h-3 w-full bg-bg-surface-accent rounded-full overflow-hidden p-0.5 border border-text-faint/5 shadow-inner">
                  <div className="h-full rounded-full success-skeuo" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>
        </SkeuoCard>

        <SkeuoCard 
          variant="paper" 
          size="large" 
          titleText="Wadah Halaman Kosong (Empty State Container)" 
          descriptionText="Antarmuka fallback ketika data belum tersedia"
        >
          <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            {/* Empy Icon Frame */}
            <div className="w-16 h-16 rounded-2xl debossed-skeuo bg-bg-canvas flex items-center justify-center text-text-faint shadow-inner">
              <Search className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-body-lg font-manrope font-semibold text-text-primary">
                Belum Ada Kelas yang Diikuti
              </h4>
              <p className="text-caption text-text-muted">
                Daftar kelas atau kursus Anda masih kosong. Mulailah petualangan belajar Anda dengan menjelajahi katalog kursus kami sekarang.
              </p>
            </div>

            <button className="px-6 py-2.5 rounded-xl font-semibold btn-interactive coral-skeuo text-center flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white" />
              Jelajahi Kelas Baru
            </button>
          </div>
        </SkeuoCard>

        <SkeuoCard 
          variant="paper" 
          size="large" 
          titleText="AI Chat Input Bar (Floating Interface)" 
          descriptionText="Struktur input mengambang taktil glassmorphic di bagian bawah layar"
        >
          <div className="p-4 rounded-2xl glass-panel relative border border-text-faint/15 shadow-md">
            <div className="absolute inset-0 pointer-events-none paper-texture opacity-30 rounded-2xl" />
            
            <div className="flex items-center gap-3 relative z-10">
              {/* Bot Icon Indicator */}
              <div className="w-10 h-10 rounded-xl bg-bg-surface-accent flex items-center justify-center border border-text-faint/10 text-accent-coral shrink-0">
                <Bot className="w-5 h-5" />
              </div>

              {/* Chat Input Text */}
              <input 
                type="text" 
                placeholder="Tanyakan materi, kuis, atau evaluasi kompetensi..."
                className="flex-1 bg-transparent border-none outline-none text-body-md text-text-primary placeholder:text-text-muted px-2"
              />

              {/* Send Button */}
              <button className="w-10 h-10 rounded-xl coral-skeuo btn-interactive flex items-center justify-center shrink-0 shadow-sm">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </SkeuoCard>

      </div>
    </div>
  )
}
