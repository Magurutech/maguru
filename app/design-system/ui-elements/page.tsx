import React from 'react'
import { SkeuoCard } from '@/components/shadcn-studio/card/skeucard'
import { CourseCard3D } from '@/components/shadcn-studio/card/course-card-3d'
import { SkeuButton, ButtonSpecDrawer } from '@/components/shadcn-studio/button/skeu-button'
import { SkeuBadge } from '@/components/shadcn-studio/badge/skeu-badge'
import { MasteryBadge } from '@/components/shadcn-studio/badge/mastery-badge'
import { SkeuInput } from '@/components/shadcn-studio/input/skeu-input'
import { ChatInputBar } from '@/components/shadcn-studio/input/chat-input-bar'
import { ChatBubble } from '@/components/shadcn-studio/chat/chat-bubble'
import { EmptyState } from '@/components/shadcn-studio/feedback/empty-state'
import { Button } from '@/components/ui/button'
import { 
  Bot, 
  Star, 
  Award,
  BookOpen,
  Info
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
          titleText="Tombol Primer, Sekunder & Ghost" 
          descriptionText="Implementasi v2.1: Coral deckle, Putih border, dan Walnut solid"
        >
          <div className="flex flex-col gap-4 mt-2 text-left">
            <div className="space-y-1">
              <span className="text-[10px] text-text-muted font-mono block">PRIMARY (ACCENT CORAL)</span>
              <Button variant="default" className="w-full">
                Tombol Coral
              </Button>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-text-muted font-mono block">SECONDARY (PUTIH BORDER WALNUT)</span>
              <Button variant="secondary" className="w-full">
                Tombol Putih
              </Button>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-text-muted font-mono block">GHOST (SOLID WALNUT INK)</span>
              <Button variant="ghost" className="w-full">
                Tombol Walnut (Ghost)
              </Button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-text-muted font-mono block">ICON BUTTONS (DEFAULT SIZE)</span>
              <div className="flex gap-3 items-center">
                <Button variant="default" size="icon" aria-label="Bot help">
                  <Bot className="w-5 h-5 text-[#efe7d2]" />
                </Button>
                <Button variant="secondary" size="icon" className="aspect-square" aria-label="Star verified">
                  <Star className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="aspect-square" aria-label="Award badge">
                  <Award className="w-5 h-5 text-[#efe7d2]" />
                </Button>
              </div>
            </div>

            {/* Spec Drawer Integration */}
            <div className="mt-3 pt-3 border-t border-text-faint/10">
              <ButtonSpecDrawer />
            </div>
          </div>
        </SkeuoCard>

        <SkeuoCard 
          variant="paper" 
          size="small" 
          titleText="Status Badges" 
          descriptionText="Badge taktil untuk status penanda"
        >
          <div className="flex flex-wrap gap-3 mt-4">
            <SkeuBadge variant="gold">
              <Star className="w-3.5 h-3.5 fill-[#3E5237]/20" />
              ARTISAN VERIFIED
            </SkeuBadge>
            
            <SkeuBadge variant="success">
              <Award className="w-3.5 h-3.5 fill-white/20" />
              COMPETENCY III
            </SkeuBadge>
 
            <SkeuBadge variant="stable">
              STATUS: STABLE
            </SkeuBadge>
            
            <SkeuBadge variant="coral">
              NEW CONTENT
            </SkeuBadge>
          </div>
        </SkeuoCard>

        <SkeuoCard 
          variant="paper" 
          size="small" 
          titleText="Mikro-Interaksi Tombol" 
          descriptionText="Simulasi hover & active fisis"
        >
          <div className="space-y-3 mt-2 text-left">
            <div className="text-caption text-text-muted">Gunakan tombol di bawah untuk merasakan efek magnetis ditekan:</div>
            <SkeuButton variant="peach">
              Tekan Saya (Skeuo Peach)
            </SkeuButton>
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
            <SkeuInput 
              state="default" 
              label="Input Default" 
              placeholder="Masukkan teks di sini..." 
            />
            
            <SkeuInput 
              state="active" 
              label="Input Active / Focus" 
              defaultValue="Fokus interaktif" 
              helperText="• Focus State"
            />

            <div className="sm:col-span-2">
              <SkeuInput 
                state="error" 
                label="Input Error / Gagal" 
                placeholder="Terjadi kesalahan input" 
                helperText="Wajib diisi"
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
            <ChatBubble sender="ai" senderName="AI CO-TEACHER">
              Halo! Saya siap membantu Anda menganalisis materi belajar hari ini. Konsep bagian mana yang ingin Anda diskusikan terlebih dahulu?
            </ChatBubble>

            <ChatBubble sender="user" senderName="ANDA (STUDENT)">
              Tolong jelaskan tentang aturan datang cahaya 45 derajat pada prinsip skeuomorphism.
            </ChatBubble>
          </div>
        </SkeuoCard>

        <SkeuoCard 
          variant="paper" 
          size="medium" 
          titleText="Lencana Kompetensi (Mastery Medal & Badge)" 
          descriptionText="Sertifikasi pencapaian kompetensi bertema material fisik"
        >
          <div className="mt-4">
            <MasteryBadge 
              chapter="CHAPTER II • WEB DEV"
              title="Master of UI/UX Engineering"
              description="Diberikan atas penguasaan penuh prinsip-prinsip visual taktil Atelier Zero dan integrasi fungsionalitas UI modern."
            />
          </div>
        </SkeuoCard>

        {/* ========================================================================= */}
        {/* LARGE ELEMENTS (3 COLUMNS SPAN)                                           */}
        {/* ========================================================================= */}

        <CourseCard3D 
          moduleCode="SKEUO - C2"
          moduleTitle="Visual Skeuomorphism"
          levelLabel="LEVEL DESIGN EXPERT"
          title="Skeuomorphic Artistry: The Physics of Lighting in Web UI"
          description="Pelajari rahasia beveling, simulasi drop shadows, tekstur kertas SVG, dan arah sorot cahaya 45° kiri-atas secara detail."
          progressItems={8}
          totalItems={10}
        />

        <SkeuoCard 
          variant="paper" 
          size="large" 
          titleText="Wadah Halaman Kosong (Empty State Container)" 
          descriptionText="Antarmuka fallback ketika data belum tersedia"
        >
          <EmptyState 
            title="Belum Ada Kelas yang Diikuti"
            description="Daftar kelas atau kursus Anda masih kosong. Mulailah petualangan belajar Anda dengan menjelajahi katalog kursus kami sekarang."
            actionLabel="Jelajahi Kelas Baru"
          />
        </SkeuoCard>

        <SkeuoCard 
          variant="paper" 
          size="large" 
          titleText="AI Chat Input Bar (Floating Interface)" 
          descriptionText="Struktur input mengambang taktil paper-texture di bagian bawah layar"
        >
          <ChatInputBar 
            placeholder="Tanyakan materi, kuis, atau evaluasi kompetensi..."
          />
        </SkeuoCard>

      </div>
    </div>
  )
}
