'use client'

import { Check, BookOpen, AlertCircle, ArrowRight } from 'lucide-react'

interface AssessmentResultPageProps {
  score: number
  topicScores: Record<string, number>
  skippedLessonIds: string[]
  unlockedNextSection?: boolean
  isPreTest?: boolean
  sectionsOutline?: Array<{
    id: string
    title: string
    lessons?: Array<{
      id: string
      title: string
    }>
  }>
  onContinueAction: () => void
}

export function AssessmentResultPage({
  score,
  topicScores,
  skippedLessonIds,
  unlockedNextSection = false,
  isPreTest = true,
  sectionsOutline = [],
  onContinueAction,
}: AssessmentResultPageProps) {
  const isPassed = score >= 70

  // Map skippedLessonIds to their readable titles using the sectionsOutline lookup
  const skippedLessons = sectionsOutline
    .flatMap((s) => s.lessons || [])
    .filter((l) => skippedLessonIds.includes(l.id))

  // Determine stroke dashoffset for circular progress ring (radius=50, circumference=314)
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-transparent select-none animate-fade-in">
      <div className="bg-bg-surface border border-border/10 rounded-[3rem] p-6 md:p-10 shadow-lg paper-texture flex flex-col items-center">
        
        {/* Top Radial/Circular Score Display */}
        <div className="relative flex items-center justify-center h-40 w-40 mt-4">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-bg-bone/80 fill-transparent"
              strokeWidth="8"
            />
            {/* Animated progress ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-accent-coral fill-transparent transition-all duration-1000 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          {/* Big score number */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-serif font-black text-accent-coral">
              {Math.round(score)}%
            </span>
            <span className="text-[9px] font-manrope font-extrabold text-text-muted uppercase tracking-widest mt-0.5">
              SKOR TOTAL
            </span>
          </div>
        </div>

        {/* Dynamic Pass/Fail badge */}
        <div className="mt-6 flex flex-col items-center text-center space-y-2">
          <span className={`
            px-4 py-1.5 rounded-full font-bold text-xs shadow-sm border
            ${isPassed
              ? 'bg-success/15 border-success text-success'
              : 'bg-accent-mustard/15 border-accent-mustard text-text-primary'
            }
          `}>
            {isPassed ? '✅ Kamu Lulus!' : '📚 Teruslah Belajar'}
          </span>
          
          <h2 className="text-2xl font-serif font-bold text-text-primary">
            {isPreTest ? 'Hasil Initial Assessment Anda' : 'Hasil Kuis Akhir Bab'}
          </h2>
          
          <p className="text-xs text-text-muted max-w-md leading-relaxed">
            {isPassed
              ? isPreTest
                ? 'Selamat! Anda menguasai sebagian besar materi dasar dan berhasil melompati pelajaran yang sudah dipahami.'
                : 'Luar biasa! Pemahaman Anda sangat baik. Bab berikutnya kini telah terbuka untuk Anda.'
              : isPreTest
                ? 'Hasil evaluasi menunjukkan Anda perlu mempelajari modul dasar terlebih dahulu. Jangan khawatir, mari kita mulai belajar!'
                : 'Skor kelulusan kuis ini adalah 70%. Silakan pelajari materi bab ini kembali dan ulangi kuis saat sudah siap.'}
          </p>
        </div>

        {/* Grid: Topic Breakdown vs Unlocked Lessons */}
        <div className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border/10">
          
          {/* LEFT: Topic Breakdown */}
          <div className="flex flex-col bg-bg-bone/45 border border-border/10 rounded-[2rem] p-6 shadow-inner paper-texture">
            <span className="text-[10px] font-manrope font-extrabold uppercase tracking-widest text-text-faint">TOPIC MASTERY</span>
            <h3 className="text-sm font-serif font-bold text-text-primary mt-1">Pemetaan Sub-Materi</h3>
            
            <div className="mt-6 space-y-4">
              {Object.keys(topicScores).length === 0 ? (
                <p className="text-xs text-text-muted py-6 text-center">Tidak ada pemetaan sub-materi.</p>
              ) : (
                Object.entries(topicScores).map(([topic, pct]) => {
                  // Dynamic progress bar colors
                  const barColorClass = pct >= 70 
                    ? 'bg-accent-coral' 
                    : pct >= 40 
                      ? 'bg-accent-mustard' 
                      : 'bg-accent-olive'

                  return (
                    <div key={topic} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-text-secondary capitalize">{topic}</span>
                        <span className="font-bold text-text-primary">{Math.round(pct)}%</span>
                      </div>
                      <div className="h-2 w-full bg-bg-bone rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${barColorClass} transition-all duration-700 ease-out`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* RIGHT: Unlocked/Skipped Material Panel */}
          <div className="flex flex-col bg-bg-bone/45 border border-border/10 rounded-[2rem] p-6 shadow-inner paper-texture">
            <span className="text-[10px] font-manrope font-extrabold uppercase tracking-widest text-text-faint">PLACEMENT PROGRESS</span>
            <h3 className="text-sm font-serif font-bold text-text-primary mt-1">
              {isPreTest ? 'Pelajaran yang Dapat Dilewati' : 'Status Pembukaan Akses'}
            </h3>

            {isPreTest ? (
              <div className="mt-5 flex-1 overflow-y-auto max-h-[220px] pr-1 space-y-2">
                {skippedLessons.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 bg-bg-surface border border-border/5 rounded-2xl">
                    <AlertCircle className="h-4 w-4 text-text-faint shrink-0" />
                    <p className="text-[11px] font-semibold text-text-muted leading-normal">
                      Tidak ada materi yang dilewati. Anda akan memulai dari pelajaran pertama.
                    </p>
                  </div>
                ) : (
                  skippedLessons.map((lesson) => (
                    <div 
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 bg-bg-surface border border-border/5 rounded-2xl shadow-sm"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white shrink-0 shadow-sm">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-text-primary truncate">
                          {lesson.title}
                        </p>
                        <span className="text-[9px] font-manrope font-extrabold uppercase tracking-wider text-success">
                          SKIPPED
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="mt-5 flex-1 flex flex-col justify-center items-center text-center p-4">
                {isPassed ? (
                  <div className="space-y-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success mx-auto shadow-sm">
                      <Check className="h-6 w-6" />
                    </span>
                    <p className="text-xs font-semibold text-text-secondary leading-relaxed">
                      Akses untuk materi pelajaran di bab selanjutnya telah sukses dibuka secara otomatis.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-mustard/15 text-text-primary mx-auto shadow-sm">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <p className="text-xs font-semibold text-text-secondary leading-relaxed">
                      Silakan pelajari kembali konten di bab ini dan penuhi syarat kelulusan kuis untuk melanjutkan.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Continuation CTAs */}
        <div className="mt-10 flex gap-4 w-full justify-center">
          <button
            onClick={onContinueAction}
            className="flex items-center gap-1.5 px-8 py-3 bg-accent-coral hover:bg-accent-coral/95 text-white rounded-2xl font-bold text-xs shadow-md shadow-glow active:scale-95 transition-all cursor-pointer"
          >
            {isPreTest ? 'Mulai Belajar' : isPassed ? 'Lanjut Belajar' : 'Kembali Ke Bab'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
