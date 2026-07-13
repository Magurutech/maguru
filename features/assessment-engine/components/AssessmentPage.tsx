'use client'

import { useState } from 'react'
import { useAssessment } from '../hooks/useAssessment'
import { Check, ChevronLeft, ChevronRight, Bookmark, Lock } from 'lucide-react'
import { toast } from 'sonner'

interface AssessmentPageProps {
  courseId: string
  sectionId?: string | null
  courseTitle?: string
  sectionTitle?: string
  onCompleteAction: (result: {
    overallScore: number
    topicScores: Record<string, number>
    skippedLessonIds: string[]
    unlockedNextSection?: boolean
  }) => void
  onExitAction?: () => void
}

export function AssessmentPage({
  courseId,
  sectionId = null,
  courseTitle = 'JavaScript Fundamentals',
  sectionTitle = '',
  onCompleteAction,
  onExitAction,
}: AssessmentPageProps) {
  const { questions, loading, error, submitting, submitError, submit } = useAssessment(
    courseId,
    sectionId,
  )

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  // Track start time to calculate durationSeconds on submit
  const [startTime] = useState(() => Date.now())

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-coral mx-auto mb-4" />
        <p className="text-text-muted text-sm font-semibold">Memuat soal kuis...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center max-w-md mx-auto space-y-4">
        <div className="p-4 bg-error/10 border border-error/20 rounded-full text-error">
          <Lock className="h-8 w-8" />
        </div>
        <p className="text-error text-sm font-bold">{error}</p>
        {onExitAction && (
          <button
            onClick={onExitAction}
            className="px-6 py-2 bg-accent-coral hover:bg-accent-coral/95 text-white rounded-full font-bold text-xs shadow-glow transition-all"
          >
            Kembali ke Kursus
          </button>
        )}
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center max-w-md mx-auto space-y-4">
        <p className="text-text-muted text-sm">Tidak ada pertanyaan untuk kuis ini.</p>
        {onExitAction && (
          <button
            onClick={onExitAction}
            className="px-6 py-2 bg-accent-coral hover:bg-accent-coral/95 text-white rounded-full font-bold text-xs shadow-glow transition-all"
          >
            Kembali
          </button>
        )}
      </div>
    )
  }

  const currentQuestion = questions[currentIdx]
  const options = currentQuestion.options as Record<string, string>
  const totalQuestions = questions.length
  const progressPercent = (Object.keys(answers).length / totalQuestions) * 100

  const handleSelectOption = (optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionKey,
    }))
  }

  const handleSubmit = async () => {
    // Only submit if all questions answered
    if (Object.keys(answers).length < totalQuestions) return

    const durationSeconds = Math.round((Date.now() - startTime) / 1000)
    try {
      const result = await submit(answers, durationSeconds)
      onCompleteAction(result)
    } catch (err) {
      console.error('Error submitting quiz:', err)
      toast.error(err instanceof Error ? err.message : 'Gagal mengirimkan jawaban kuis')
    }
  }

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-4 md:p-6 bg-transparent select-none">
      {/* LEFT COLUMN: Main Quiz Card Area */}
      <div className="flex-1 flex flex-col space-y-6">
        <div className="flex-1 flex flex-col paper-skeuo rounded-[2.5rem] relative overflow-hidden">
          {/* Card Header Section (Debossed / Sunken) */}
          <div className="flex justify-between items-center header-skeuo-debossed rounded-t-[2.5rem] p-6 md:p-8">
            <div>
              <span className="text-[10px] font-manrope font-extrabold uppercase tracking-widest text-accent-coral">
                {sectionId ? 'SECTION QUIZ' : 'INITIAL ASSESSMENT'}
              </span>
              <h1 className="text-2xl font-serif font-bold text-text-primary mt-1">
                {sectionId ? sectionTitle || 'Kuis Akhir Bab' : 'Initial Assessment'}
              </h1>
              <p className="text-xs text-text-muted mt-1 max-w-xs md:max-w-md">
                {sectionId 
                  ? 'Uji pemahaman Anda terhadap bab ini untuk membuka bab berikutnya.' 
                  : 'Mari cari tahu materi apa saja yang sudah Anda kuasai agar bisa langsung dilewati.'}
              </p>
            </div>
            
            {/* Question Counter Card (Debossed) */}
            <div className="w-20 h-24 border-t border-l border-[#b89a57]/20 border-b border-r border-white/60 bg-[#efe7d2] dark:bg-[#19181d] rounded-2xl flex flex-col items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] shrink-0 select-none">
              <span className="text-[10px] font-manrope font-bold text-text-muted uppercase tracking-wider">
                QUESTION
              </span>
              <span className="text-3xl font-serif font-black text-text-primary mt-1">
                {String(currentIdx + 1).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-manrope font-semibold text-text-faint mt-1 uppercase">
                OF {totalQuestions}
              </span>
            </div>
          </div>

          {/* Card Content Section */}
          <div className="flex-1 flex flex-col p-6 md:p-8">
            <span className="text-[10px] font-manrope font-extrabold uppercase tracking-widest text-accent-coral">
              PERTANYAAN
            </span>
            <h2 className="text-base md:text-lg font-serif font-bold text-text-primary leading-relaxed mt-2">
              {currentQuestion.question}
            </h2>

            {/* Answer Options list */}
            <div className="mt-8 space-y-3.5">
              {Object.entries(options).map(([key, text]) => {
                const isSelected = answers[currentQuestion.id] === key
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectOption(key)}
                    className={`
                      w-full flex items-center justify-between text-left p-4 rounded-2xl cursor-pointer transition-all duration-200
                      ${
                        isSelected
                          ? 'peach-skeuo shadow-md'
                          : 'paper-skeuo btn-interactive hover:bg-bg-surface-accent/40'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Letter badge */}
                      <span
                        className={`
                        flex h-9 w-9 items-center justify-center rounded-full font-bold text-xs border transition-all duration-200 shrink-0
                        ${
                          isSelected
                            ? 'bg-accent-coral text-white border-accent-coral/10 shadow-sm'
                            : 'bg-[#efe7d2] dark:bg-[#19181d] text-text-secondary border-[#b89a57]/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]'
                        }
                      `}
                      >
                        {key.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold text-text-primary leading-normal pr-4">
                        {text}
                      </span>
                    </div>

                    {/* Selection status indicator */}
                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-coral text-white border border-white/20 shrink-0 shadow-md">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Navigation Action Buttons */}
            <div className="mt-12 flex justify-between items-center pt-6 border-t border-border/10">
              <button
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                className={`
                  flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs shrink-0
                  ${
                    currentIdx === 0
                      ? 'opacity-40 cursor-not-allowed text-text-faint bg-bg-bone/20 border border-border/5'
                      : 'paper-skeuo btn-interactive text-text-primary'
                  }
                `}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              <div className="flex items-center gap-3">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full paper-skeuo btn-interactive text-text-muted"
                  title="Simpan Soal"
                >
                  <Bookmark className="h-4 w-4" />
                </button>

                {currentIdx === totalQuestions - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || Object.keys(answers).length < totalQuestions}
                    className={`
                      px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer
                      ${
                        submitting || Object.keys(answers).length < totalQuestions
                          ? 'bg-text-faint/30 cursor-not-allowed shadow-none text-text-faint'
                          : 'coral-skeuo btn-interactive text-white'
                      }
                    `}
                  >
                    {submitting ? 'Submitting...' : 'Submit Assessment'}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1))}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs coral-skeuo btn-interactive text-white"
                  >
                    Next Question <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AI Co-Teacher & Progress Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        {/* Guru AI Chat Panel */}
        <div className="paper-skeuo rounded-[2.5rem] p-6 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-border/10">
            <div>
              <span className="text-[9px] font-manrope font-extrabold uppercase tracking-widest text-text-faint">
                AI CO-TEACHER
              </span>
              <h3 className="text-sm font-serif font-bold text-text-primary mt-0.5">Guru</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-semibold text-success">Online</span>
            </div>
          </div>

          <div className="mt-4 space-y-3.5">
            <div className="p-3.5 bg-bg-bone/45 border border-border/10 rounded-2xl">
              <p className="text-[11px] font-semibold text-text-primary leading-normal">
                Hi! Aku Guru. Aku di sini untuk membantumu memahami materi belajar dengan lebih baik
                selama kuis berlangsung!
              </p>
            </div>
            <div className="p-3.5 bg-bg-bone/45 border border-border/10 rounded-2xl">
              <p className="text-[11px] font-semibold text-text-primary leading-normal">
                Ingat, kuis ini dirancang untuk memetakan pemahamanmu. Jawablah dengan
                sejujur-jujurnya agar kita tahu pelajaran apa saja yang bisa langsung dilewati! 💪
              </p>
            </div>
          </div>
        </div>

        {/* Quiz Progress Button Grid */}
        <div className="paper-skeuo rounded-[2.5rem] p-6 shadow-md">
          <div className="pb-3 border-b border-border/10">
            <span className="text-[9px] font-manrope font-extrabold uppercase tracking-widest text-text-faint">
              QUIZ PROGRESS
            </span>
            <div className="flex justify-between items-center mt-1">
              <h3 className="text-xs font-bold text-text-primary">
                {Object.keys(answers).length} dari {totalQuestions} Soal Terisi
              </h3>
              <span className="text-[10px] font-bold text-accent-coral">
                {Math.round(progressPercent)}%
              </span>
            </div>
          </div>

          {/* 10-Item Dot/Circle Grid */}
          <div className="mt-5 grid grid-cols-5 gap-2.5">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIdx
              const isAnswered = answers[q.id] !== undefined

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`
                    aspect-square rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 shrink-0
                    ${
                      isCurrent
                        ? 'coral-skeuo btn-interactive text-white'
                        : isAnswered
                          ? 'success-skeuo btn-interactive text-white'
                          : 'paper-skeuo btn-interactive text-text-muted hover:bg-bg-surface-accent/60'
                    }
                  `}
                >
                  {isAnswered && !isCurrent ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tip Box Card */}
        <div className="gold-skeuo rounded-3xl p-5 shadow-sm">
          <div className="flex items-start gap-2.5 text-text-primary">
            <span className="text-base" role="img" aria-label="lightbulb">
              💡
            </span>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-primary">
                Tips Belajar
              </h4>
              <p className="text-[11px] font-medium text-text-secondary leading-normal mt-1">
                Jangan terburu-buru. Bacalah soal dan setiap pilihan jawaban dengan teliti. Kamu
                pasti bisa!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Quiz Confirmation Dialog Backdrop */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-border/10 rounded-[2rem] p-6 max-w-sm w-full shadow-lg paper-texture space-y-4 animate-scale-in">
            <h3 className="text-lg font-serif font-bold text-text-primary">Keluar dari Kuis?</h3>
            <p className="text-xs text-text-secondary leading-normal">
              Progres jawaban kuis saat ini akan hilang dan tidak disimpan. Apakah Anda yakin ingin
              keluar?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 border border-border/10 hover:bg-bg-bone/80 text-text-primary font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false)
                  if (onExitAction) onExitAction()
                }}
                className="flex-1 py-2.5 bg-error hover:bg-error/95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
