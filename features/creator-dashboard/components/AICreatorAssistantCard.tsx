'use client'

/**
 * AICreatorAssistantCard Component
 *
 * Kartu Asisten Kreator AI (Mago) yang membantu mentor menganalisis kesulitan belajar,
 * memberikan rekomendasi perbaikan konten, dan menjawab pertanyaan optimasi kursus.
 */

import { useState } from 'react'
import {  X, RotateCcw, Brain } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'

export function AICreatorAssistantCard() {
  const [aiState, setAiState] = useState<'idle' | 'typing' | 'answered'>('idle')
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')

  const askAI = (question: string, answer: string) => {
    if (aiState === 'typing') return
    setAiQuestion(question)
    setAiState('typing')
    
    // Simulate thinking/typing status
    setTimeout(() => {
      setAiAnswer(answer)
      setAiState('answered')
    }, 1200)
  }

  const resetAI = () => {
    setAiState('idle')
    setAiQuestion('')
    setAiAnswer('')
  }

  return (
    <TiltCard 
      className="md:col-span-12 card-ancient p-6 flex flex-col justify-between min-h-75 relative overflow-hidden cursor-default"
    >
      <div className="space-y-4 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent-coral" />
            <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
              AI Creator Assistant
            </h3>
          </div>
          <span className="text-[9px] font-mono text-text-muted uppercase">Mitra Desain Kurikulum</span>
        </div>

        {/* AI Companion Output Box */}
        <div className="bg-bg-bone/85 border border-border/10 rounded-xl p-5 min-h-35 flex flex-col justify-between gap-3">
          {aiState === 'idle' && (
            <div className="flex items-start gap-4">
              {/* Mascot "Mago" Orb */}
              <div className="w-11 h-11 rounded-full border-1.5 border-accent-coral bg-accent-coral/5 flex items-center justify-center shrink-0 relative animate-float">
                <span className="font-serif italic font-semibold text-accent-coral text-base">M</span>
                <span className="absolute -inset-1 rounded-full border border-dashed border-accent-coral/30 animate-spin" style={{ animationDuration: '8s' }}></span>
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-semibold text-accent-coral uppercase tracking-wider">Mago Asisten Kreator</span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Halo Lutfi! Analisis data terbaru menunjukkan **28% siswa mengalami hambatan di Bab 3.2 (Optimasi Server Actions)**. Tingkat kelulusan kuis di bab ini turun sekitar 12%. Ingin saya bantu membuat latihan sandbox interaktif tambahan untuk bab tersebut?
                </p>
              </div>
            </div>
          )}

          {aiState === 'typing' && (
            <div className="flex items-center gap-3 py-6">
              <div className="w-10 h-10 rounded-full border-1.5 border-accent-coral bg-accent-coral/5 flex items-center justify-center shrink-0 relative animate-float">
                <span className="font-serif italic font-semibold text-accent-coral text-sm">M</span>
              </div>
              <div className="chat-typing">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-coral animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-coral animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-coral animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}

          {aiState === 'answered' && (
            <div className="space-y-3">
              <div className="flex justify-between items-start border-b border-border/5 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-accent-coral/30 bg-accent-coral/5 flex items-center justify-center shrink-0 font-serif italic text-[11px] text-accent-coral">
                    M
                  </div>
                  <span className="text-[10px] font-semibold text-accent-coral uppercase tracking-wider">Mago</span>
                </div>
                <button 
                  onClick={resetAI}
                  className="text-text-muted hover:text-text-primary p-0.5 transition-colors cursor-pointer"
                  aria-label="Tutup rekomendasi"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Analisis AI: &quot{aiQuestion} &quot</p>
                <div className="text-xs text-text-secondary leading-relaxed bg-card p-3 rounded-lg border border-border/5 font-mono overflow-x-auto">
                  <p dangerouslySetInnerHTML={{ __html: aiAnswer }}></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action triggers */}
      {aiState === 'idle' && (
        <div className="pt-4 border-t border-border/10">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">Tanya Asisten AI:</span>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => askAI(
                'Identifikasi Bab Tersulit',
                `<strong>Bab 3.2: Optimasi Server Actions</strong><br/>• Tingkat kegagalan Kuis: 34% (sangat tinggi).<br/>• Hambatan utama: Penanganan error boundaries dan optimasi pending states.<br/>• Solusi: Tambahkan latihan coding instan berukuran kecil (micro-exercise) tentang <code>useActionState</code>.`
              )}
              className="px-3.5 py-1.5 rounded-full border border-border/15 bg-card hover:border-accent-coral hover:bg-bg-surface-accent text-xs font-semibold text-text-secondary cursor-pointer transition-all duration-180"
            >
              📊 Bab Tersulit
            </button>
            <button 
              onClick={() => askAI(
                'Mengapa Penyelesaian Turun?',
                `Penurunan 12% penyelesaian disebabkan karena durasi video pada Bab 3.3 terlalu panjang (28 menit). Statistik retensi menunjukkan rata-rata siswa berhenti menonton di menit ke-12. Saya sarankan untuk <strong>memecah video tersebut menjadi 3 video kecil masing-masing 8-10 menit</strong>.`
              )}
              className="px-3.5 py-1.5 rounded-full border border-border/15 bg-card hover:border-accent-coral hover:bg-bg-surface-accent text-xs font-semibold text-text-secondary cursor-pointer transition-all duration-180"
            >
              📉 Turunnya Penyelesaian
            </button>
            <button 
              onClick={() => askAI(
                'Pertanyaan Populer Siswa',
                `Tiga utas diskusi terpopuler membahas:<br/>1. <em>"Bagaimana cara membatalkan fetch request di Server Actions?"</em> (8 siswa)<br/>2. <em>"Perbedaan static routing vs dynamic routing di Next.js 15."</em> (5 siswa).<br/>Saya sarankan untuk mengadakan sesi <strong>Live Q&A berdurasi 30 menit</strong> minggu ini untuk menjawab isu ini secara massal.`
              )}
              className="px-3.5 py-1.5 rounded-full border border-border/15 bg-card hover:border-accent-coral hover:bg-bg-surface-accent text-xs font-semibold text-text-secondary cursor-pointer transition-all duration-180"
            >
              💬 Pertanyaan Populer
            </button>
          </div>
        </div>
      )}

      {aiState === 'answered' && (
        <div className="pt-4 border-t border-border/10 flex justify-end">
          <button 
            onClick={resetAI}
            className="text-xs text-accent-coral font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tanya Hal Lain</span>
          </button>
        </div>
      )}
    </TiltCard>
  )
}
