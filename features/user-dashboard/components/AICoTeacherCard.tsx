'use client'

/**
 * AICoTeacherCard Component
 *
 * Kartu Bento Grid interaktif untuk berinteraksi dengan AI Co-Teacher (Mago).
 * Menyediakan simulasi dialog, pertanyaan kuis, penjelasan konsep, dan status pengetikan.
 */

import React, { useState } from 'react'
import { Brain, X, RotateCcw } from 'lucide-react'
import { TiltCard } from './TiltCard'

export function AICoTeacherCard() {
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
      className="md:col-span-7 card-ancient p-6 flex flex-col justify-between min-h-75 relative overflow-hidden cursor-default"
    >
      <div className="space-y-4 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent-coral" />
            <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
              AI Co-Teacher
            </h3>
          </div>
          <span className="text-[9px] font-mono text-text-muted uppercase">Sesi Aktif</span>
        </div>

        {/* AI Response Display */}
        <div className="bg-bg-bone/85 border border-border/10 rounded-xl p-4 min-h-30 flex flex-col justify-between gap-3">
          {aiState === 'idle' && (
            <div className="flex items-start gap-3">
              {/* Mascot "Mago" Orb */}
              <div className="w-10 h-10 rounded-full border border-accent-coral bg-accent-coral/5 flex items-center justify-center shrink-0 relative animate-float">
                <span className="font-serif italic font-semibold text-accent-coral text-sm">M</span>
                <span className="absolute -inset-1 rounded-full border border-dashed border-accent-coral/30 animate-spin" style={{ animationDuration: '8s' }}></span>
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-semibold text-accent-coral uppercase tracking-wider">Mago (Co-Teacher)</span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Halo! Kemarin kamu belajar <code>useReducer</code>. Ingat, hook ini disukai saat state logikanya kompleks. Ada yang membingungkan tentang ini?
                </p>
              </div>
            </div>
          )}

          {aiState === 'typing' && (
            <div className="flex items-center gap-3 py-4">
              <div className="w-10 h-10 rounded-full border border-accent-coral bg-accent-coral/5 flex items-center justify-center shrink-0 relative animate-float">
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
                  aria-label="Tutup jawaban"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Tanya: &quot{aiQuestion}&quot</p>
                <div className="text-xs text-text-secondary leading-relaxed bg-card p-3 rounded-lg border border-border/5 font-mono overflow-x-auto">
                  <p dangerouslySetInnerHTML={{ __html: aiAnswer }}></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Chips */}
      {aiState === 'idle' && (
        <div className="pt-4 border-t border-border/10">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">Tanya Mago:</span>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => askAI(
                'Jelaskan useReducer',
                `useReducer(reducer, initialState) menerima fungsi <strong>reducer</strong> dan state awal. Reducer bertugas menerima action dan mengembalikan state baru.<br/><br/>Contoh:<br/><code>const [state, dispatch] = useReducer(reducer, { count: 0 });<br/>dispatch({ type: 'INCREMENT' });</code>`
              )}
              className="px-3.5 py-1.5 rounded-full border border-border/15 bg-card hover:border-accent-coral hover:bg-bg-surface-accent text-xs font-semibold text-text-secondary cursor-pointer transition-all duration-180"
            >
              💡 Jelaskan useReducer
            </button>
            <button 
              onClick={() => askAI(
                'Bantu Debug Code',
                `Jika Anda mendapatkan error <strong>"Cannot update a component while rendering a different component"</strong>, pastikan dispatch reducer tidak ditaruh langsung di body render component. Pindahkan ke dalam callback atau <code>useEffect</code>.`
              )}
              className="px-3.5 py-1.5 rounded-full border border-border/15 bg-card hover:border-accent-coral hover:bg-bg-surface-accent text-xs font-semibold text-text-secondary cursor-pointer transition-all duration-180"
            >
              🐛 Bantu Debug Code
            </button>
            <button 
              onClick={() => askAI(
                'Berikan Soal Latihan',
                `Tantangan: Buat fungsi reducer untuk keranjang belanja (cart) dengan aksi:<br/>1. <code>ADD_ITEM</code> (tambah barang)<br/>2. <code>REMOVE_ITEM</code> (hapus barang)<br/>3. <code>CLEAR_CART</code> (kosongkan).<br/>Tulis kodenya dan coba diskusikan ke saya.`
              )}
              className="px-3.5 py-1.5 rounded-full border border-border/15 bg-card hover:border-accent-coral hover:bg-bg-surface-accent text-xs font-semibold text-text-secondary cursor-pointer transition-all duration-180"
            >
              📝 Soal Latihan
            </button>
            <button 
              onClick={() => askAI(
                'Tips Belajar',
                `Untuk menguasai React State, mulailah dengan visualisasi data-flow. Data di React mengalir satu arah (top-down). Gunakan useState untuk state sederhana & independen, useReducer untuk state kompleks & interdependen.`
              )}
              className="px-3.5 py-1.5 rounded-full border border-border/15 bg-card hover:border-accent-coral hover:bg-bg-surface-accent text-xs font-semibold text-text-secondary cursor-pointer transition-all duration-180"
            >
              ⚡ Tips Belajar State
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
