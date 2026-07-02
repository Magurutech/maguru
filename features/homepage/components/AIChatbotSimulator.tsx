'use client'

import { useState, useEffect, useRef } from 'react'
import { Code, HelpCircle, Upload } from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'ai'
  text: string
}

interface Prompt {
  id: string
  label: string
  question: string
  answer: string
  icon: React.ReactNode
}

export function AIChatbotSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'ai',
      text: 'Halo! Saya siap membantu. Pilih topik yang ingin kamu eksplorasi, atau ajukan pertanyaan langsung.',
    },
  ])
  const [usedPrompts, setUsedPrompts] = useState<Set<string>>(new Set())
  const [isTyping, setIsTyping] = useState(false)
  const [chatBusy, setChatBusy] = useState(false)
  const chatBodyRef = useRef<HTMLDivElement>(null)

  const prompts: Prompt[] = [
    {
      id: 'bug',
      label: 'Perbaiki bug: NullPointerException',
      question: 'Bagaimana cara debug NullPointerException di Java?',
      answer:
        'Pertanyaan bagus! Pertama, baca pesan error dengan cermat — baris mana yang menyebabkan NPE? Lalu periksa variabel mana yang bernilai null di baris itu. Gunakan System.out.println() atau debugger untuk menelusuri nilai variabel sebelum baris tersebut. Apa konteks error-mu sekarang?',
      icon: <Code className="w-4 h-4 text-accent-coral shrink-0" />,
    },
    {
      id: 'recursion',
      label: 'Jelaskan Rekursi',
      question: 'Jelaskan konsep rekursi dengan cara mudah dipahami.',
      answer:
        'Bayangkan kamu berdiri di depan dua cermin yang saling berhadapan. Setiap cermin memantulkan cermin lainnya — inilah rekursi: fungsi yang memanggil dirinya sendiri. Kuncinya ada dua: base case (kapan berhenti) dan recursive case (kapan terus memanggil). Tanpa base case, rekursi tidak akan pernah berhenti. Mau coba tulis fungsi rekursif pertamamu?',
      icon: <HelpCircle className="w-4 h-4 text-accent-coral shrink-0" />,
    },
    {
      id: 'submit',
      label: 'Cara submit proyek',
      question: 'Cara submit proyek akhir di Maguru?',
      answer:
        'Untuk submit proyek akhir: 1) Pastikan semua requirement di checklist modul sudah terpenuhi. 2) Upload ke repository GitHub-mu dan pastikan README.md lengkap. 3) Tempel URL repository di halaman Submit Proyek. Setelah itu AI akan melakukan review awal dalam 5 menit. Apakah proyekmu sudah siap?',
      icon: <Upload className="w-4 h-4 text-accent-coral shrink-0" />,
    },
  ]

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handlePromptClick = async (prompt: Prompt) => {
    if (chatBusy) return

    setChatBusy(true)
    setUsedPrompts((prev) => new Set([...prev, prompt.id]))

    // 1. Append user message
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text: prompt.question },
    ])

    // 2. Wait 600ms, then show typing indicator
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsTyping(true)

    // 3. Wait 1800ms, remove typing indicator, and append AI response
    await new Promise((resolve) => setTimeout(resolve, 1800))
    setIsTyping(false)

    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), sender: 'ai', text: prompt.answer },
    ])

    setChatBusy(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Kolom Kiri: Deskripsi Section */}
      <div className="lg:col-span-5 space-y-6">
        <span className="font-sans text-[11px] font-semibold tracking-[0.22em] uppercase text-accent-coral inline-flex items-center gap-3 select-none">
          <span className="w-4.5 h-px bg-accent-coral inline-block" />
          Live Demo
          <span className="text-text-faint font-normal lowercase tracking-normal">· Nº 03</span>
        </span>
        <h2 className="font-sans text-3xl sm:text-4xl md:text-[46px] font-extrabold tracking-tight text-text-primary leading-none mt-2">
          Coba langsung, rasakan{' '}
          <em className="font-serif italic font-normal text-accent-coral">bedanya</em>.
        </h2>
        <p className="font-sans text-base text-text-secondary leading-relaxed max-w-[42ch]">
          Klik salah satu pertanyaan dan lihat bagaimana Maguru AI merespons dengan penjelasan
          kontekstual — bukan jawaban copy-paste.
        </p>

        <ul className="space-y-4 pt-2">
          <li className="flex gap-3 items-start">
            <svg
              className="text-accent-coral shrink-0 mt-0.75"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-sans text-[15px] text-text-secondary leading-normal">
              Respons adaptif sesuai level pemahamanmu saat ini
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <svg
              className="text-accent-coral shrink-0 mt-0.75"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-sans text-[15px] text-text-secondary leading-normal">
              Tidak pernah memberi jawaban langsung — selalu membimbing ke pemahaman
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <svg
              className="text-accent-coral shrink-0 mt-0.75"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-sans text-[15px] text-text-secondary leading-normal">
              Tersedia 24/7 selama sesi belajarmu aktif
            </span>
          </li>
        </ul>
      </div>

      {/* Kolom Kanan: Jendela Chat */}
      <div className="lg:col-span-7 w-full">
        <div className="glass-panel border border-glass-border rounded-[18px] overflow-hidden flex flex-col h-120">
          {/* Topbar */}
          <div className="bg-bg-surface-accent/60 dark:bg-bg-surface-accent/20 px-4.5 py-3.25 flex items-center border-b border-glass-border">
            <div className="flex gap-1.5 items-center">
              <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
            </div>
            <span className="font-sans text-xs font-semibold text-text-muted ml-2 tracking-wide">
              Maguru AI Co-Teacher
            </span>
          </div>

          {/* Chat Body */}
          <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai'
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${
                      isAi
                        ? 'bg-accent-coral text-white font-serif italic text-[15px]'
                        : 'bg-bg-surface-accent dark:bg-bg-surface text-text-muted border border-glass-border font-sans text-[11px]'
                    }`}
                  >
                    {isAi ? 'M' : 'U'}
                  </div>
                  <div
                    className={`p-3.5 text-[13.5px] leading-relaxed max-w-[78%] ${
                      isAi
                        ? 'bg-bg-surface/85 dark:bg-bg-surface text-text-secondary border border-glass-border rounded-[12px_12px_12px_4px] border-l-[3px]! border-l-accent-coral!'
                        : 'bg-text-primary text-bg-canvas dark:text-bg-canvas rounded-[12px_12px_4px_12px]'
                    }`}
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                </div>
              )
            })}

            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent-coral text-white flex items-center justify-center shrink-0 font-serif italic text-[15px]">
                  M
                </div>
                <div className="bg-bg-surface/85 dark:bg-bg-surface border border-glass-border p-3.5 rounded-xl flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-text-faint animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-text-faint animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-text-faint animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Footer */}
          <div className="p-[16px_18px] border-t border-glass-border bg-bg-bone/40 dark:bg-bg-surface-accent/10 flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-text-faint mb-0.5">
              Pertanyaan cepat
            </span>
            <div className="flex flex-col gap-2">
              {prompts.map((p) => {
                const isUsed = usedPrompts.has(p.id)
                if (isUsed) return null

                return (
                  <button
                    key={p.id}
                    disabled={chatBusy}
                    onClick={() => handlePromptClick(p)}
                    className="w-full text-left px-4 py-2 bg-bg-surface/90 hover:bg-bg-surface border border-glass-border hover:border-accent-coral rounded-xl text-[13px] font-medium text-text-secondary flex items-center gap-2.5 transition-all duration-300 transform hover:translate-x-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer min-h-11"
                  >
                    <span className="text-accent-coral shrink-0">
                      {p.id === 'bug' && (
                        <svg
                          className="w-4 h-4 stroke-current fill-none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                      )}
                      {p.id === 'recursion' && (
                        <svg
                          className="w-4 h-4 stroke-current fill-none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      )}
                      {p.id === 'submit' && (
                        <svg
                          className="w-4 h-4 stroke-current fill-none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      )}
                    </span>
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
