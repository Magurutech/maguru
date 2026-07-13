'use client'

import { useState, useEffect } from 'react'
import {
  Check,
  BookOpen,
  AlertCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  X,
  FileText,
  Clock,
  Calendar,
  Lightbulb,
  Code,
  GitFork,
  RefreshCw,
  Braces,
  HelpCircle,
} from 'lucide-react'
// import Image from 'next/image'

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
  onRetryAction?: () => void
  onExitAction?: () => void
}

export function AssessmentResultPage({
  score,
  topicScores,
  skippedLessonIds,
  unlockedNextSection = false,
  isPreTest = true,
  sectionsOutline = [],
  onContinueAction,
  onRetryAction,
  onExitAction,
}: AssessmentResultPageProps) {
  const isPassed = score >= 70
  const [currentDate, setCurrentDate] = useState('')

  // Set formatted current date on mount (client-side only to prevent hydration mismatch)
  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    setCurrentDate(new Date().toLocaleDateString('id-ID', options))
  }, [])

  // Map skippedLessonIds to their readable titles and outline structure
  const skippedLessons = sectionsOutline
    .flatMap((s) =>
      (s.lessons || []).map((l, index) => ({
        id: l.id,
        title: l.title,
        indexStr: `${s.id.slice(0, 3).replace(/\D/g, '') || '1'}.${index + 1}`,
      })),
    )
    .filter((l) => skippedLessonIds.includes(l.id))

  // Determine stroke dashoffset for circular progress ring
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  // Calculate simulated question summary stats
  const totalQuestions = Object.keys(topicScores).length * 5 || 20
  const correctCount = Math.round((score / 100) * totalQuestions)
  const wrongCount = totalQuestions - correctCount

  // Helper to map topic names to suitable icons
  const getTopicIcon = (topic: string) => {
    const name = topic.toLowerCase()
    if (name.includes('variabel') || name.includes('data') || name.includes('tipe')) {
      return <Code className="h-4 w-4 text-accent-coral shrink-0" />
    }
    if (name.includes('operator') || name.includes('aritmatika') || name.includes('hitung')) {
      return <Braces className="h-4 w-4 text-accent-mustard shrink-0" />
    }
    if (name.includes('percabangan') || name.includes('if') || name.includes('kondisi')) {
      return <GitFork className="h-4 w-4 text-accent-coral shrink-0" />
    }
    if (name.includes('looping') || name.includes('perulangan') || name.includes('loop')) {
      return <RefreshCw className="h-4 w-4 text-accent-olive shrink-0" />
    }
    return <BookOpen className="h-4 w-4 text-text-muted shrink-0" />
  }

  // Qualitative score feedback
  const getQualitativeFeedback = () => {
    if (score >= 90) return 'Sangat Baik!'
    if (score >= 70) return 'Baik'
    if (score >= 50) return 'Cukup'
    return 'Perlu Belajar Lagi'
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-0 md:p-2 bg-transparent select-none animate-fade-in relative z-10">
      {/* Top Header Section */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-border/10 mb-8 gap-4">
        <div className="max-w-2xl">
          <span className="text-[10px] font-manrope font-extrabold uppercase tracking-widest text-accent-coral">
            ASSESSMENT RESULT
          </span>
          <h1 className="text-3xl font-serif font-black text-text-primary mt-1 leading-tight">
            Kamu Sudah Menyelesaikan Assessment!
          </h1>
          <p className="text-xs text-text-muted mt-1.5 font-semibold">
            Berikut adalah hasil dan rekomendasi belajarmu.
          </p>
        </div>

        {/* Right Corner Exit button */}
        {onExitAction && (
          <button
            onClick={onExitAction}
            className="flex items-center gap-1.5 px-4 py-2 border border-border/10 rounded-xl bg-bg-bone/45 text-text-primary font-bold text-[10px] uppercase tracking-wider hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm z-20"
          >
            <X className="h-3.5 w-3.5" /> Exit
          </button>
        )}

        {/* Engraving Hermes Statue Background graphic */}
        {/* <div className="absolute right-0 -top-4 opacity-15 pointer-events-none select-none hidden lg:block">
          <Image
            src="/images/hermes-statue.jpg"
            alt="Hermes Statue Illustration"
            width={220}
            height={220}
            className="object-contain mix-blend-multiply dark:invert"
            priority
          />
        </div> */}
      </div>

      {/* Main Grid: Left Area (Results & Lists) vs Right Area (Sidebar details) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT COLUMN: ~65% width */}
        <div className="flex-1 flex flex-col gap-8 w-full">
          {/* Card 1: Circular Score Display Card */}
          <div className="paper-skeuo rounded-[2.5rem] p-8 flex flex-col items-center relative overflow-hidden border border-[#b89a57]/10">
            <span className="text-[9px] font-manrope font-extrabold uppercase tracking-widest text-text-faint">
              SKOR TOTAL
            </span>

            {/* Radial score gauge */}
            <div className="relative flex items-center justify-center h-44 w-44 mt-6">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background ring */}
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  className="stroke-bg-bone/80 dark:stroke-bg-surface-accent fill-transparent"
                  strokeWidth="8"
                />
                {/* Animated progress ring */}
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  className="stroke-accent-coral fill-transparent transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner score card with Trophy and Qualitative feedback */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <Trophy className="h-5 w-5 text-accent-mustard fill-accent-mustard/15 mb-0.5" />
                <span className="text-4xl font-serif font-black text-text-primary leading-none">
                  {Math.round(score)}%
                </span>
                <span className="text-[9px] font-manrope font-extrabold text-accent-coral uppercase tracking-wider mt-1">
                  {getQualitativeFeedback()}
                </span>
              </div>
            </div>

            {/* Score Message Description */}
            <div className="mt-6 text-center max-w-lg">
              <h3 className="text-sm font-serif font-bold text-text-primary">
                {isPassed ? 'Selamat! Kamu lulus assessment ini.' : 'Semangat! Teruslah Belajar.'}
              </h3>
              <p className="text-xs text-text-muted mt-2 leading-relaxed font-semibold">
                {isPassed
                  ? 'Kamu telah menguasai sebagian besar topik dasar. Lanjutkan ke materi berikutnya untuk memperdalam pemahamanmu.'
                  : 'Hasil evaluasi menunjukkan kamu masih perlu melatih beberapa materi dasar. Mari belajar kembali untuk memperkuat fondasimu.'}
              </p>
            </div>

            {/* Lulus / Kelulusan Status Pill */}
            <div
              className={`
              mt-6 inline-flex items-center gap-2 px-4 py-2 border rounded-2xl shadow-inner-soft
              ${
                isPassed
                  ? 'bg-success/10 border-success/20 text-success'
                  : 'bg-accent-mustard/10 border-accent-mustard/20 text-text-primary'
              }
            `}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${isPassed ? 'bg-success' : 'bg-accent-mustard'}`}
              >
                {isPassed ? (
                  <Check className="h-2.5 w-2.5" />
                ) : (
                  <HelpCircle className="h-2.5 w-2.5 text-text-primary" />
                )}
              </span>
              <span className="text-[10px] font-manrope font-extrabold uppercase tracking-widest leading-none">
                Status: {isPassed ? 'LULUS' : 'BELUM LULUS'} | Skor minimal kelulusan: 70%
              </span>
            </div>
          </div>

          {/* Card 2: Breakdown Skor Per Topik */}
          <div className="paper-skeuo rounded-[2.5rem] p-8 flex flex-col border border-[#b89a57]/10">
            <span className="text-[9px] font-manrope font-extrabold uppercase tracking-widest text-text-faint">
              BREAKDOWN SKOR PER TOPIK
            </span>
            <h2 className="text-base font-serif font-bold text-text-primary mt-1.5">
              Pemetaan Sub-Materi
            </h2>

            <div className="mt-6 space-y-5">
              {Object.keys(topicScores).length === 0 ? (
                <p className="text-xs text-text-muted py-6 text-center font-semibold">
                  Tidak ada pemetaan sub-materi.
                </p>
              ) : (
                Object.entries(topicScores).map(([topic, pct]) => {
                  const barColorClass =
                    pct >= 70
                      ? 'bg-accent-coral'
                      : pct >= 40
                        ? 'bg-accent-mustard'
                        : 'bg-accent-olive'

                  const topicQuestions = 5
                  const topicCorrect = Math.round((pct / 100) * topicQuestions)

                  return (
                    <div key={topic} className="flex items-center gap-4">
                      {/* Topic Icon circle */}
                      <div className="h-8 w-8 rounded-xl bg-bg-bone/80 dark:bg-bg-surface-accent border border-border/5 flex items-center justify-center shadow-sm shrink-0">
                        {getTopicIcon(topic)}
                      </div>

                      {/* Progress & details */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-text-primary capitalize block truncate">
                              {topic}
                            </span>
                            <span className="text-[9px] font-bold text-text-muted leading-none block">
                              {topicCorrect} dari {topicQuestions} soal benar
                            </span>
                          </div>
                          <span className="font-serif font-black text-text-primary shrink-0 ml-2">
                            {Math.round(pct)}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-bg-bone dark:bg-[#19181d] rounded-full overflow-hidden border border-[#b89a57]/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                          <div
                            className={`h-full ${barColorClass} transition-all duration-700 ease-out rounded-full`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Card 3: Pelajaran yang dapat dilewati */}
          <div className="paper-skeuo rounded-[2.5rem] p-8 flex flex-col border border-[#b89a57]/10">
            <span className="text-[9px] font-manrope font-extrabold uppercase tracking-widest text-text-faint">
              LESSON YANG DAPAT DILEWATI
            </span>
            <h2 className="text-base font-serif font-bold text-text-primary mt-1.5">
              {isPreTest ? 'Pelajaran yang Dapat Dilewati' : 'Status Pembukaan Akses'}
            </h2>
            <p className="text-xs text-text-muted mt-1 leading-relaxed font-semibold">
              Berdasarkan hasil assessment, kamu dapat melewati beberapa materi berikut karena sudah
              dikuasai.
            </p>

            {isPreTest ? (
              <div className="mt-6 flex-1 space-y-2">
                {skippedLessons.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 bg-bg-bone/40 border border-border/10 rounded-2xl">
                    <AlertCircle className="h-4 w-4 text-text-faint shrink-0" />
                    <p className="text-[11px] font-bold text-text-muted leading-normal">
                      Tidak ada materi yang dapat dilewati. Kamu akan memulai petualangan belajarmu
                      dari pelajaran pertama!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden border border-[#b89a57]/10 rounded-2xl bg-bg-bone/15">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#b89a57]/10 bg-bg-bone/35 text-[9px] font-manrope font-extrabold text-text-faint uppercase tracking-wider">
                          <th className="px-4 py-3 w-16">No</th>
                          <th className="px-4 py-3">Materi Pelajaran</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#b89a57]/5">
                        {skippedLessons.map((lesson) => (
                          <tr key={lesson.id} className="text-[11px] font-bold text-text-primary">
                            <td className="px-4 py-3.5 text-text-muted font-manrope">
                              {lesson.indexStr}
                            </td>
                            <td className="px-4 py-3.5 truncate max-w-[200px]">{lesson.title}</td>
                            <td className="px-4 py-3.5 text-success">Topik dikuasai</td>
                            <td className="px-4 py-3.5 text-right">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] bg-success/15 border border-success/20 text-success uppercase tracking-wider font-extrabold shadow-sm">
                                Lewati
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Footnote text */}
                <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-text-faint pl-1">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Kamu tetap bisa mempelajari materi ini nanti di menu My Learning.</span>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col justify-center items-center text-center p-6 bg-bg-bone/20 border border-border/10 rounded-2xl">
                {isPassed ? (
                  <div className="space-y-3 max-w-sm">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success mx-auto shadow-sm">
                      <Check className="h-6 w-6" />
                    </span>
                    <p className="text-xs font-semibold text-text-secondary leading-relaxed">
                      Selamat! Akses untuk materi pelajaran di bab selanjutnya telah sukses dibuka
                      secara otomatis.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-sm">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-mustard/15 text-text-primary mx-auto shadow-sm">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <p className="text-xs font-semibold text-text-secondary leading-relaxed">
                      Silakan pelajari kembali konten di bab ini dan penuhi syarat kelulusan kuis
                      untuk melanjutkan ke bab selanjutnya.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ~35% width (Sidebar cards) */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          {/* Card 1: AI Co-Teacher (Guru) chat bubble */}
          <div className="paper-skeuo rounded-[2.5rem] p-6 shadow-md border border-[#b89a57]/10">
            <div className="flex items-center justify-between pb-4 border-b border-[#b89a57]/10">
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

            {/* AI Avatar circle & chat bubble message */}
            <div className="mt-5 flex flex-col items-center">
              {/* Cute 3D styled Robot avatar */}
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#efe7d2] to-[#ddd2b6] dark:from-[#232127] dark:to-[#37353e] border border-[#b89a57]/20 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),_0_2px_4px_rgba(0,0,0,0.05)] relative select-none scale-105">
                <span className="text-2xl">🤖</span>
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-success rounded-full border-2 border-[#ece4cf] dark:border-[#232127] shadow-sm" />
              </div>

              {/* Speech bubble */}
              <div className="mt-5 p-4 bg-bg-bone/45 border border-border/10 rounded-2xl relative shadow-inner-soft">
                <p className="text-[11px] font-bold text-text-primary leading-relaxed text-center">
                  {isPassed
                    ? 'Kerja bagus! Kamu telah memahami konsep-konsep dasar dengan baik. Yuk, lanjut ke materi berikutnya! Aku akan terus mendampingimu. 💪'
                    : 'Jangan berkecil hati ya! Belajar adalah proses bertahap. Mari kita ulas kembali materi di bab ini bersama-sama agar fondasimu makin kokoh! 😊'}
                </p>
              </div>

              {/* Carousel dots indicator */}
              <div className="flex justify-center items-center gap-1.5 mt-4">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-coral" />
                <span className="h-1 w-1 rounded-full bg-text-faint/30" />
                <span className="h-1 w-1 rounded-full bg-text-faint/30" />
              </div>
            </div>
          </div>

          {/* Card 2: Summary details (Ringkasan) */}
          <div className="paper-skeuo rounded-[2.5rem] p-6 shadow-md border border-[#b89a57]/10">
            <span className="text-[9px] font-manrope font-extrabold uppercase tracking-widest text-text-faint block mb-4">
              RINGKASAN
            </span>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-accent-coral shrink-0" />
                <div>
                  <span className="text-[9px] font-manrope font-extrabold uppercase tracking-wider text-text-faint block">
                    Tanggal Pengerjaan
                  </span>
                  <span className="text-[11px] font-bold text-text-primary">
                    {currentDate || 'Memuat...'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-accent-coral shrink-0" />
                <div>
                  <span className="text-[9px] font-manrope font-extrabold uppercase tracking-wider text-text-faint block">
                    Durasi Pengerjaan
                  </span>
                  <span className="text-[11px] font-bold text-text-primary">18 menit 42 detik</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-accent-coral shrink-0" />
                <div>
                  <span className="text-[9px] font-manrope font-extrabold uppercase tracking-wider text-text-faint block">
                    Jumlah Soal
                  </span>
                  <span className="text-[11px] font-bold text-text-primary">
                    {totalQuestions} soal
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <span className="text-[9px] font-manrope font-extrabold uppercase tracking-wider text-text-faint block">
                    Benar
                  </span>
                  <span className="text-[11px] font-bold text-success">{correctCount} soal</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-error/15 text-error flex items-center justify-center shrink-0">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <span className="text-[9px] font-manrope font-extrabold uppercase tracking-wider text-text-faint block">
                    Salah
                  </span>
                  <span className="text-[11px] font-bold text-error">{wrongCount} soal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Tips Belajar card */}
          <div className="paper-skeuo rounded-[2.5rem] p-6 shadow-md border border-[#b89a57]/10 relative overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
            <div className="flex items-center gap-2 pb-3 border-b border-[#b89a57]/10">
              <Lightbulb className="h-4 w-4 text-accent-mustard fill-accent-mustard/15 shrink-0" />
              <span className="text-[9px] font-manrope font-extrabold uppercase tracking-widest text-text-primary">
                TIPS BELAJAR
              </span>
            </div>

            <p className="text-[11px] font-bold text-text-secondary leading-relaxed mt-4 relative z-10">
              {isPassed
                ? 'Fokuslah pada materi bab berikutnya dan tantang dirimu dengan latihan proyek coding langsung untuk memperkuat pemahaman konsepmu.'
                : 'Fokuslah pada topik yang skornya masih rendah. Ulangi latihan dan pahami konsepnya sebelum melanjutkan ke materi berikutnya.'}
            </p>

            {/* Subtle Blueprint Grid SVG decoration in the bottom right corner */}
            <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none select-none text-[#b89a57]">
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
              >
                <circle cx="50" cy="50" r="40" />
                <circle cx="50" cy="50" r="25" />
                <line x1="10" y1="50" x2="90" y2="50" />
                <line x1="50" y1="10" x2="50" y2="90" />
                <line x1="20" y1="20" x2="80" y2="80" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTIONS BAR */}
      <div className="mt-12 flex gap-4 w-full justify-center pb-6">
        {onRetryAction && (
          <button
            onClick={onRetryAction}
            className="flex items-center gap-2 px-8 py-3.5 border border-[#b89a57]/20 hover:border-[#b89a57]/35 rounded-2xl bg-bg-bone/45 hover:scale-[1.02] active:scale-95 text-text-primary font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm shadow-inner-soft"
          >
            <RotateCcw className="h-4 w-4" /> Coba Lagi
          </button>
        )}

        <button
          onClick={onContinueAction}
          className="flex items-center gap-2 px-8 py-3.5 bg-accent-coral hover:bg-accent-coral/95 hover:scale-[1.02] text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-md shadow-glow active:scale-95 transition-all cursor-pointer border border-white/10"
        >
          {isPreTest ? 'Mulai Belajar' : isPassed ? 'Lanjut Belajar' : 'Kembali Ke Bab'}{' '}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
