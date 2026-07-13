'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  Eye,
  Copy,
  Edit,
  Trash2,
  GripVertical,
  Trophy,
  Settings,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import { useManageContext } from '@/features/cms/Context/creator/ManageContext'
import Image from 'next/image'
import { toast } from 'sonner'
import { Pie, PieChart, Label } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const circ = 100.5

interface QuizEditorPanelProps {
  quizType: 'PRE_TEST' | 'SECTION_QUIZ'
  sectionId?: string
}

export function QuizEditorPanel({ quizType, sectionId }: QuizEditorPanelProps) {
  const { course, sections, questions, setQuestions, fetchQuestions } = useManageContext()

  // Find section title if it's a section quiz
  const activeSection = useMemo(() => {
    if (quizType === 'SECTION_QUIZ' && sectionId) {
      return sections.find((s) => s.id === sectionId)
    }
    return null
  }, [quizType, sectionId, sections])

  // Filter questions for the current active quiz
  const activeQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (quizType === 'PRE_TEST') {
        return q.sectionId !== null
      } else {
        return q.sectionId === sectionId
      }
    })
  }, [questions, quizType, sectionId])

  // UI state for adding/editing questions
  const [modalOpen, setModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)

  // Local Form state
  const [questionText, setQuestionText] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('a')
  const [topicTag, setTopicTag] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [questionType, setQuestionType] = useState<'MC' | 'TF' | 'SA'>('MC') // Multiple Choice, True/False, Short Answer

  // Mock quiz settings (persisted in local storage or simulated)
  const [passingScore, setPassingScore] = useState(70)
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [randomize, setRandomize] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [statusActive, setStatusActive] = useState(true)

  // Determine question categorizations for Donut Chart
  const breakdown = useMemo(() => {
    let mcCount = 0
    let tfCount = 0
    let saCount = 0

    activeQuestions.forEach((q) => {
      const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      if (!opts || Object.keys(opts).length === 0) {
        saCount++
      } else if (
        Object.keys(opts).length === 2 &&
        (opts.a?.toLowerCase() === 'benar' || opts.true !== undefined)
      ) {
        tfCount++
      } else {
        mcCount++
      }
    })

    return { mcCount, tfCount, saCount, total: activeQuestions.length }
  }, [activeQuestions])

  // Chart config mapping for Recharts/Shadcn Studio
  const chartData = useMemo(() => {
    return [
      { type: 'mc', count: breakdown.mcCount, fill: '#57493a' }, // Pilihan Ganda (Sage/Ink)
      { type: 'tf', count: breakdown.tfCount, fill: '#dd8473' }, // Benar / Salah (Coral)
      { type: 'sa', count: breakdown.saCount, fill: '#e9b94a' }, // Isian Singkat (Mustard)
    ]
  }, [breakdown])

  const chartConfig = useMemo(() => {
    return {
      count: {
        label: 'Soal',
      },
      mc: {
        label: 'Pilihan Ganda',
        color: '#57493a',
      },
      tf: {
        label: 'Benar / Salah',
        color: '#dd8473',
      },
      sa: {
        label: 'Isian Singkat',
        color: '#e9b94a',
      },
    } satisfies ChartConfig
  }, [])

  // Open modal for creating new question
  const handleOpenAdd = () => {
    setEditingQuestion(null)
    setQuestionText('')
    setOptionA('')
    setOptionB('')
    setOptionC('')
    setOptionD('')
    setCorrectAnswer('a')
    setTopicTag('')
    setDifficulty('medium')
    setQuestionType('MC')
    setModalOpen(true)
  }

  // Open modal for editing existing question
  const handleOpenEdit = (q: any) => {
    setEditingQuestion(q)
    setQuestionText(q.question)
    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    
    // Categorize type
    if (!opts || Object.keys(opts).length === 0) {
      setQuestionType('SA')
      setOptionA('')
      setOptionB('')
      setOptionC('')
      setOptionD('')
    } else if (
      Object.keys(opts).length === 2 &&
      (opts.a?.toLowerCase() === 'benar' || opts.true !== undefined)
    ) {
      setQuestionType('TF')
      setOptionA(opts.a || 'Benar')
      setOptionB(opts.b || 'Salah')
      setOptionC('')
      setOptionD('')
    } else {
      setQuestionType('MC')
      setOptionA(opts.a || '')
      setOptionB(opts.b || '')
      setOptionC(opts.c || '')
      setOptionD(opts.d || '')
    }

    setCorrectAnswer(q.correct?.toLowerCase() || 'a')
    setTopicTag(q.topic)
    setDifficulty(q.difficulty || 'medium')
    setModalOpen(true)
  }

  // Handle save question (Create or Update)
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim()) {
      toast.error('Pertanyaan wajib diisi')
      return
    }
    if (!topicTag.trim()) {
      toast.error('Topik kompetensi wajib diisi')
      return
    }

    // Format options JSON
    let optionsJson: Record<string, string> = {}
    if (questionType === 'MC') {
      if (!optionA || !optionB || !optionC || !optionD) {
        toast.error('Lengkapi semua 4 pilihan jawaban')
        return
      }
      optionsJson = { a: optionA, b: optionB, c: optionC, d: optionD }
    } else if (questionType === 'TF') {
      optionsJson = { a: optionA || 'Benar', b: optionB || 'Salah' }
    } else {
      optionsJson = {} // Short answer is empty
    }

    try {
      setSaving(true)
      const payload = {
        question: questionText,
        options: optionsJson,
        correct: correctAnswer.toUpperCase(),
        topic: topicTag.trim().toLowerCase(),
        difficulty,
        sectionId: quizType === 'SECTION_QUIZ' ? sectionId : null,
      }

      if (editingQuestion) {
        // UPDATE
        const res = await fetch(`/api/creator/courses/${course?.slug}/assessments/${editingQuestion.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Gagal memperbarui soal')
        const updated = await res.json()
        setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
        toast.success('Soal berhasil diperbarui')
      } else {
        // CREATE
        const res = await fetch(`/api/creator/courses/${course?.slug}/assessments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Gagal menambah soal')
        const created = await res.json()
        setQuestions((prev) => [...prev, created])
        toast.success('Soal baru berhasil ditambahkan')
      }

      setModalOpen(false)
      fetchQuestions()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan pertanyaan')
    } finally {
      setSaving(false)
    }
  }

  // Handle duplicate question
  const handleDuplicateQuestion = async (q: any) => {
    try {
      const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      const payload = {
        question: `${q.question} (Salinan)`,
        options: opts,
        correct: q.correct,
        topic: q.topic,
        difficulty: q.difficulty,
        sectionId: q.sectionId,
      }

      const res = await fetch(`/api/creator/courses/${course?.slug}/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Gagal menduplikasi soal')
      const created = await res.json()
      setQuestions((prev) => [...prev, created])
      toast.success('Soal berhasil diduplikasi')
      fetchQuestions()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menduplikasi')
    }
  }

  // Handle delete question
  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus soal ini?')) return
    try {
      const res = await fetch(`/api/creator/courses/${course?.slug}/assessments/${questionId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Gagal menghapus soal')
      setQuestions((prev) => prev.filter((q) => q.id !== questionId))
      toast.success('Soal berhasil dihapus')
      fetchQuestions()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus')
    }
  }

  // Helper to categorize types for displays
  const getQuestionTypeLabel = (q: any) => {
    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    if (!opts || Object.keys(opts).length === 0) return 'Isian Singkat'
    if (
      Object.keys(opts).length === 2 &&
      (opts.a?.toLowerCase() === 'benar' || opts.true !== undefined)
    ) {
      return 'Benar / Salah'
    }
    return 'Pilihan Ganda'
  }

  // Helper to resolve scoring weights
  const getQuestionPoints = (q: any) => {
    if (q.difficulty === 'hard') return '5 poin'
    if (q.difficulty === 'medium') return '3 poin'
    return '2 poin'
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 py-2 max-w-7xl mx-auto items-start select-none">
      
      {/* LEFT COLUMN: Main editor card & questions list (8 cols) */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Banner header matching mockup - updated with paper-skeuo */}
        <div className="paper-skeuo rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 min-w-0 space-y-2">
            <h2 className="text-xl font-serif font-extrabold text-text-primary leading-tight">
              {quizType === 'PRE_TEST'
                ? 'Pre-test (Assessment Awal)'
                : `Kuis Akhir Bab: ${activeSection?.title || 'Bab'}`}
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-lg">
              {quizType === 'PRE_TEST'
                ? 'Placement test untuk mengukur kemampuan awal siswa. Hasilnya akan digunakan AI untuk memetakan bab mana saja yang bisa dilewati siswa.'
                : 'Ujian komprehensif penutup modul untuk menguji pemahaman siswa sebelum membuka bab kurikulum berikutnya.'}
            </p>
          </div>
          
          <div className="flex items-center gap-6 shrink-0 bg-white/40 dark:bg-black/10 px-6 py-4 rounded-2xl border border-border/5">
            <div className="text-center">
              <span className="text-2xl font-serif font-extrabold text-text-primary block">
                {activeQuestions.length}
              </span>
              <span className="text-[9px] font-manrope font-extrabold uppercase tracking-widest text-text-muted block mt-0.5">
                TOTAL SOAL
              </span>
            </div>
            
            <div className="h-16 w-16 relative overflow-hidden rounded-xl border border-border/5 shadow-inner shrink-0">
              <Image
                src="/images/hermes-statue.jpg"
                alt="Greek Statue illustration"
                fill
                className="object-cover opacity-85 dark:opacity-75 grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Questions list header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
            <span>DAFTAR SOAL</span>
            <span className="text-[10px] font-mono bg-bg-bone/80 px-2 py-0.5 rounded-full shrink-0">
              {activeQuestions.length} soal &middot; {activeQuestions.length * 4} menit
            </span>
          </div>

          {quizType !== 'PRE_TEST' && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 coral-skeuo btn-interactive rounded-full font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Soal</span>
            </button>
          )}
        </div>

        {/* Card lists */}
        <div className="space-y-3">
          {activeQuestions.length === 0 ? (
            <div className="paper-skeuo rounded-3xl p-12 text-center">
              <Trophy className="h-8 w-8 text-[#b89a57]/30 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-text-primary font-serif">Belum Ada Soal Terdaftar</h4>
              <p className="text-xs text-text-muted max-w-sm mx-auto mt-1.5 leading-relaxed">
                Kuis ini masih kosong. Klik tombol "Tambah Soal" untuk mulai menyusun daftar pertanyaan.
              </p>
            </div>
          ) : (
            activeQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="group flex items-center gap-4 p-4 debossed-skeuo hover:bg-bg-bone/45 rounded-2xl transition-all duration-200"
              >
                {/* Reorder drag handle */}
                <div className="cursor-grab text-text-faint hover:text-text-muted shrink-0 transition-colors">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* Index counter */}
                <div className="h-6 w-6 rounded-lg bg-bg-bone/80 border border-border/5 text-[11px] font-bold flex items-center justify-center text-text-muted">
                  {idx + 1}
                </div>

                {/* Badges and text details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold font-sans tracking-wide uppercase bg-bg-surface-accent text-text-primary">
                      {getQuestionTypeLabel(q)}
                    </span>
                    {quizType === 'PRE_TEST' && q.sectionId && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-medium font-sans tracking-wide uppercase bg-accent-mustard/15 text-[#786131] border border-accent-mustard/20">
                        Bab: {sections.find((s) => s.id === q.sectionId)?.title || 'Umum'}
                      </span>
                    )}
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-medium font-sans tracking-wide uppercase bg-emerald-500/5 text-emerald-600 border border-emerald-500/10">
                      Topik: {q.topic}
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-medium font-sans tracking-wide uppercase bg-accent-mustard/5 text-accent-mustard/90 border border-accent-mustard/10">
                      {q.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-text-primary font-sans leading-relaxed truncate">
                    {q.question}
                  </h4>
                </div>

                {/* Operations & Points */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-bone/80 rounded-xl transition-all border border-transparent hover:border-border/5 cursor-pointer"
                      title="Edit pertanyaan"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicateQuestion(q)}
                      className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-bone/80 rounded-xl transition-all border border-transparent hover:border-border/5 cursor-pointer"
                      title="Duplikasi"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-2 text-text-faint hover:text-error hover:bg-red-500/5 rounded-xl transition-all border border-transparent hover:border-red-500/10 cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="px-2.5 py-1 text-[10px] font-bold text-text-muted font-sans border border-[#b89a57]/10 bg-white/60 dark:bg-black/5 rounded-xl shadow-sm shrink-0">
                    {getQuestionPoints(q)}
                  </div>
                </div>
              </div>
            ))
          )}

          {activeQuestions.length > 0 && quizType !== 'PRE_TEST' && (
            <button
              onClick={handleOpenAdd}
              className="w-full flex items-center justify-center gap-2 p-4 border border-dashed border-[#b89a57]/15 rounded-2xl text-xs font-bold text-text-secondary hover:text-accent-coral hover:bg-accent-coral/5 transition-all select-none cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Soal Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Settings sidebar & summary donut (4 cols) */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* Settings widget card - Console dashboard rows */}
        <div className="paper-skeuo rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-1 border-b border-border/5">
            <Settings className="h-4 w-4 text-accent-mustard animate-spin-slow" />
            <h3 className="text-xs font-manrope font-extrabold uppercase tracking-widest text-text-primary">
              PENGATURAN KUIS
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Status toggle - Recessed row */}
            <div className="debossed-skeuo px-4 py-3 rounded-2xl flex items-center justify-between">
              <span className="font-semibold text-text-secondary">Status Kuis Aktif</span>
              <button
                onClick={() => {
                  setStatusActive(!statusActive)
                  toast.success(`Kuis ${!statusActive ? 'diaktifkan' : 'dinonaktifkan'}`)
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-all duration-200 outline-none ${statusActive ? 'success-skeuo shadow-md' : 'bg-bg-bone/80 border-border/10 shadow-inner'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${statusActive ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Passing score threshold input - Recessed row */}
            <div className="debossed-skeuo px-4 py-3 rounded-2xl flex items-center justify-between">
              <span className="font-semibold text-text-secondary">Batas Kelulusan (Passing Score)</span>
              <div className="flex items-center gap-1 bg-bg-bone/85 dark:bg-black/10 border border-border/5 rounded-xl px-2.5 py-1 shadow-inner">
                <input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
                  className="w-8 text-center bg-transparent outline-none font-bold text-text-primary font-mono text-xs"
                  min="0"
                  max="100"
                />
                <span className="text-text-muted font-bold">%</span>
              </div>
            </div>

            {/* Duration minutes select - Recessed row */}
            <div className="debossed-skeuo px-4 py-3 rounded-2xl flex items-center justify-between">
              <span className="font-semibold text-text-secondary">Waktu Pengerjaan</span>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                className="bg-bg-bone/80 dark:bg-neutral-900 border border-border/5 rounded-xl px-2.5 py-1 outline-none text-xs font-bold text-text-primary shadow-sm"
              >
                <option value={15}>15 menit</option>
                <option value={30}>30 menit</option>
                <option value={45}>45 menit</option>
                <option value={60}>60 menit</option>
                <option value={90}>90 menit</option>
              </select>
            </div>

            {/* Randomize toggle - Recessed row */}
            <div className="debossed-skeuo px-4 py-3 rounded-2xl flex items-center justify-between">
              <span className="font-semibold text-text-secondary">Acak Urutan Soal</span>
              <button
                onClick={() => setRandomize(!randomize)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-all duration-200 outline-none ${randomize ? 'success-skeuo shadow-md' : 'bg-bg-bone/80 border-border/10 shadow-inner'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${randomize ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Show Explanation toggle - Recessed row */}
            <div className="debossed-skeuo px-4 py-3 rounded-2xl flex items-center justify-between">
              <span className="font-semibold text-text-secondary">Tampilkan Pembahasan</span>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-all duration-200 outline-none ${showExplanation ? 'success-skeuo shadow-md' : 'bg-bg-bone/80 border-border/10 shadow-inner'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${showExplanation ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Donut chart summary card - Shadcn Studio Recharts integration */}
        <div className="paper-skeuo rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-border/5">
            <h3 className="text-xs font-manrope font-extrabold uppercase tracking-widest text-text-primary">
              RINGKASAN TIPE SOAL
            </h3>
          </div>

          <div className="flex items-center gap-6 py-2">
            {/* Shadcn PieChart */}
            <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full w-full">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="type"
                    innerRadius={28}
                    outerRadius={40}
                    strokeWidth={2}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-text-primary text-lg font-serif font-extrabold"
                              >
                                {breakdown.total.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 12}
                                className="fill-text-muted text-[8px] font-sans font-bold uppercase tracking-wider"
                              >
                                SOAL
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            {/* Legend checklist */}
            <div className="flex-1 space-y-2 text-[10px] font-bold">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#57493a]" />
                  <span className="text-text-secondary font-semibold">Pilihan Ganda</span>
                </div>
                <span className="text-text-primary font-mono">{breakdown.mcCount}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#dd8473]" />
                  <span className="text-text-secondary font-semibold">Benar / Salah</span>
                </div>
                <span className="text-text-primary font-mono">{breakdown.tfCount}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#e9b94a]" />
                  <span className="text-text-secondary font-semibold">Isian Singkat</span>
                </div>
                <span className="text-text-primary font-mono">{breakdown.saCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips cards widget */}
        <div className="paper-skeuo rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-accent-coral font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-manrope font-extrabold uppercase tracking-widest text-[10px]">TIPS KREATOR AI</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {quizType === 'PRE_TEST'
              ? 'Pre-test yang baik membantu AI merekomendasikan jalur belajar terbaik. Pastikan setiap soal memiliki tag Topik yang sesuai dengan nama Bab/Modul agar lewati bab bekerja secara otomatis.'
              : 'Pastikan kuis bab ini relevan dengan materi pelajaran yang terdaftar pada bab ini. Soal dengan tingkat kesulitan medium & hard memberikan umpan balik kelulusan yang lebih bermakna.'}
          </p>
        </div>
      </div>

      {/* CREATE / EDIT OVERLAY MODAL FORM */}
      {modalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
          {/* Modal card updated to paper-skeuo */}
          <div className="w-full max-w-lg paper-skeuo p-6 rounded-3xl shadow-xl select-none relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-bone/80 transition-all border border-transparent hover:border-border/5 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-serif font-extrabold text-text-primary mb-5">
              {editingQuestion ? 'Edit Pertanyaan Kuis' : 'Tambah Pertanyaan Kuis Baru'}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs font-semibold">
              
              {/* Question Text - updated to header-skeuo-debossed */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Teks Pertanyaan</label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ketik pertanyaan kuis..."
                  className="w-full p-3 rounded-2xl border-none outline-none text-text-primary font-sans h-20 text-xs header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 transition-all"
                  required
                />
              </div>

              {/* Type toggle */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Jenis Pertanyaan</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MC', 'TF', 'SA'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setQuestionType(type)
                        if (type === 'TF') {
                          setOptionA('Benar')
                          setOptionB('Salah')
                          setCorrectAnswer('a')
                        } else if (type === 'SA') {
                          setCorrectAnswer('text')
                        } else {
                          setCorrectAnswer('a')
                        }
                      }}
                      className={`py-2 rounded-xl text-center font-bold font-sans cursor-pointer transition-all btn-interactive ${
                        questionType === type
                          ? 'coral-skeuo shadow-sm'
                          : 'paper-skeuo hover:bg-bg-surface-accent text-text-primary'
                      }`}
                    >
                      {type === 'MC' ? 'Pilihan Ganda' : type === 'TF' ? 'Benar / Salah' : 'Isian Singkat'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options Fields depending on Type */}
              {questionType === 'MC' && (
                <div className="space-y-2 border-t border-border/5 pt-3">
                  <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Pilihan Jawaban</span>
                  
                  {/* Option A - updated with header-skeuo-debossed */}
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctAnswer === 'a'}
                      onChange={() => setCorrectAnswer('a')}
                      className="cursor-pointer accent-accent-coral"
                    />
                    <input
                      type="text"
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      placeholder="Opsi A..."
                      className="flex-1 p-2 rounded-xl border-none outline-none text-text-primary header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 transition-all"
                      required
                    />
                  </div>

                  {/* Option B */}
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctAnswer === 'b'}
                      onChange={() => setCorrectAnswer('b')}
                      className="cursor-pointer accent-accent-coral"
                    />
                    <input
                      type="text"
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      placeholder="Opsi B..."
                      className="flex-1 p-2 rounded-xl border-none outline-none text-text-primary header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 transition-all"
                      required
                    />
                  </div>

                  {/* Option C */}
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctAnswer === 'c'}
                      onChange={() => setCorrectAnswer('c')}
                      className="cursor-pointer accent-accent-coral"
                    />
                    <input
                      type="text"
                      value={optionC}
                      onChange={(e) => setOptionC(e.target.value)}
                      placeholder="Opsi C..."
                      className="flex-1 p-2 rounded-xl border-none outline-none text-text-primary header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 transition-all"
                      required
                    />
                  </div>

                  {/* Option D */}
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctAnswer === 'd'}
                      onChange={() => setCorrectAnswer('d')}
                      className="cursor-pointer accent-accent-coral"
                    />
                    <input
                      type="text"
                      value={optionD}
                      onChange={(e) => setOptionD(e.target.value)}
                      placeholder="Opsi D..."
                      className="flex-1 p-2 rounded-xl border-none outline-none text-text-primary header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {questionType === 'TF' && (
                <div className="space-y-2 border-t border-border/5 pt-3">
                  <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Pilih Kunci Jawaban</span>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setCorrectAnswer('a')}
                      className={`p-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer btn-interactive transition-all ${
                        correctAnswer === 'a'
                          ? 'success-skeuo shadow-md'
                          : 'paper-skeuo hover:bg-bg-surface-accent text-text-primary'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      <span>Benar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCorrectAnswer('b')}
                      className={`p-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer btn-interactive transition-all ${
                        correctAnswer === 'b'
                          ? 'coral-skeuo shadow-md'
                          : 'paper-skeuo hover:bg-bg-surface-accent text-text-primary'
                      }`}
                    >
                      <X className="h-4 w-4" />
                      <span>Salah</span>
                    </button>
                  </div>
                </div>
              )}

              {questionType === 'SA' && (
                <div className="space-y-2 border-t border-border/5 pt-3">
                  <label className="text-[10px] font-bold text-text-muted uppercase block mb-1">Tulis Kunci Jawaban Singkat</label>
                  <input
                    type="text"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    placeholder="Masukkan jawaban yang benar..."
                    className="w-full p-2.5 rounded-xl border-none outline-none text-text-primary header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 transition-all"
                    required
                  />
                </div>
              )}

              {/* Tag and Difficulty fields */}
              <div className="grid grid-cols-2 gap-4 border-t border-border/5 pt-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase">Topik Kompetensi</label>
                  <input
                    type="text"
                    value={topicTag}
                    onChange={(e) => setTopicTag(e.target.value)}
                    placeholder="contoh: variabel"
                    className="w-full p-2.5 rounded-xl border-none outline-none text-text-primary header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 font-mono text-xs uppercase transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase">Tingkat Kesulitan</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-none outline-none text-text-primary font-bold header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 text-xs transition-all"
                  >
                    <option value="easy">Mudah (2 Poin)</option>
                    <option value="medium">Sedang (3 Poin)</option>
                    <option value="hard">Sulit (5 Poin)</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 coral-skeuo btn-interactive disabled:opacity-40 disabled:pointer-events-none rounded-full font-bold text-xs shadow-md transition-all cursor-pointer mt-4"
              >
                {saving ? 'Menyimpan...' : 'Simpan Pertanyaan'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
