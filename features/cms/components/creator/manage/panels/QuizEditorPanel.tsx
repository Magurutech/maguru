'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  Copy,
  Edit,
  Trash2,
  GripVertical,
  Trophy,
  Settings,
  X,
  Check,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Database,
  RefreshCw,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  LayoutList,
  ListFilter,
  BookOpen,
  Target,
} from 'lucide-react'
import { useManageContext } from '@/features/cms/Context/creator/ManageContext'
import Image from 'next/image'
import { toast } from 'sonner'
import { fetchAIGeneratedQuiz, type AIQuizQuestion } from '@/lib/ai/quiz-generator'
import { Pie, PieChart, Label } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { RichQuestionContent } from '@/features/assessment-engine/components/RichQuestionContent'

interface QuizEditorPanelProps {
  quizType: 'PRE_TEST' | 'SECTION_QUIZ'
  sectionId?: string
}

export function QuizEditorPanel({ quizType, sectionId }: QuizEditorPanelProps) {
  const {
    course,
    sections,
    questions,
    setQuestions,
    fetchQuestions,
    lessonsMap,
    knowledgeStatus,
    syncingKnowledge,
    handleSyncKnowledge,
  } = useManageContext()

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

  // Aggregate lessons directly from Database for Auto-Context
  const currentSectionLessons = useMemo(() => {
    if (quizType === 'SECTION_QUIZ' && sectionId && lessonsMap[sectionId]) {
      return lessonsMap[sectionId]
    }
    if (quizType === 'PRE_TEST') {
      return Object.values(lessonsMap).flat()
    }
    return []
  }, [quizType, sectionId, lessonsMap])

  // UI state for adding/editing questions
  const [modalOpen, setModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)

  // AI Quiz Generator States (Milestone 2 - US 4.3)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiSaving, setAiSaving] = useState(false)
  const [aiNumQuestions, setAiNumQuestions] = useState(5)
  const [aiSelectedLessonId, setAiSelectedLessonId] = useState<string>('all')
  const [aiQuestionStyle, setAiQuestionStyle] = useState<
    'balanced' | 'code_analysis' | 'case_study' | 'conceptual'
  >('balanced')
  const [aiLessonContent, setAiLessonContent] = useState('')
  const [aiQuestions, setAiQuestions] = useState<AIQuizQuestion[]>([])
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)
  // Track which question indices are in 'edit' mode (others show rendered preview)
  const [editingQuestionIndices, setEditingQuestionIndices] = useState<Set<number>>(new Set())

  const toggleQuestionEditMode = (idx: number) => {
    setEditingQuestionIndices((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  // Context content specifically filtered by creator's chosen lesson scope
  const targetLessonsForAI = useMemo(() => {
    if (aiSelectedLessonId === 'all') {
      return currentSectionLessons
    }
    return currentSectionLessons.filter((l) => l.id === aiSelectedLessonId)
  }, [aiSelectedLessonId, currentSectionLessons])

  const autoDbContent = useMemo(() => {
    const scopeTitle = activeSection?.title || course?.title || 'Dasar Pemrograman'
    if (targetLessonsForAI.length === 0) {
      return `Topik Pembahasan: ${scopeTitle}\nFokus materi mencakup konsep inti, pemahaman kode, dan pemecahan masalah.`
    }
    const validLessonTitles = targetLessonsForAI.map((l) => `"${l.title}"`).join(', ')
    const lessonsDetail = targetLessonsForAI
      .map((l) => `[Sub-Materi: ${l.title}]\nRangkuman Konten:\n${l.contentPreview || l.title}`)
      .join('\n\n')
    return `Bab: ${scopeTitle}\n\nDAFTAR MATERI SILABUS RESMI: [${validLessonTitles}]\n(PENTING: Field 'topic' untuk setiap butir soal kuis WAJIB bernilai persis salah satu dari DAFTAR MATERI SILABUS RESMI di atas! Jangan mengarang nama topik baru! Keterampilan teknis spesifik wajib dimasukkan ke field 'micro_skill').\n\n${lessonsDetail}`
  }, [targetLessonsForAI, activeSection?.title, course?.title])

  // List view mode: 'detail' (Full question, all options, answers, explanation) vs 'compact' (one-line overview)
  const [listDisplayMode, setListDisplayMode] = useState<'detail' | 'compact'>('detail')
  const [collapsedQuestionIds, setCollapsedQuestionIds] = useState<Record<string, boolean>>({})

  const toggleQuestionCollapse = (id: string) => {
    setCollapsedQuestionIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Single Question Actions in Preview
  const handleRegenerateSingle = async (index: number) => {
    setRegeneratingIndex(index)
    try {
      const fallbackContent = knowledgeStatus && knowledgeStatus.total_chunks > 0 ? undefined : autoDbContent
      const res = await fetchAIGeneratedQuiz({
        courseId: course?.id || course?.slug || 'umum',
        courseTitle: activeSection?.title || course?.title || 'Dasar Pemrograman',
        sectionId: quizType === 'SECTION_QUIZ' ? sectionId : null,
        lessonId: aiSelectedLessonId !== 'all' ? aiSelectedLessonId : null,
        numQuestions: 1,
        difficulty: 'medium',
        questionStyle: aiQuestionStyle,
        lessonContent: aiLessonContent.trim() || fallbackContent || undefined,
      })
      if (res && res.length > 0) {
        const selectedLesson = currentSectionLessons.find((l) => l.id === aiSelectedLessonId)
        let finalTopic = res[0].topic
        if (selectedLesson) {
          finalTopic = selectedLesson.title
        } else {
          const matched = currentSectionLessons.find(
            (l) =>
              l.title.toLowerCase() === (res[0].topic || '').toLowerCase() ||
              (res[0].topic || '').toLowerCase().includes(l.title.toLowerCase()) ||
              l.title.toLowerCase().includes((res[0].topic || '').toLowerCase()) ||
              (res[0].question || '').toLowerCase().includes(l.title.toLowerCase())
          )
          if (matched) {
            finalTopic = matched.title
          } else if (currentSectionLessons.length > 0) {
            finalTopic = currentSectionLessons[0].title
          }
        }
        const updatedQ = { ...res[0], topic: finalTopic }
        setAiQuestions((prev) => {
          const next = [...prev]
          next[index] = updatedQ
          return next
        })
        toast.success(`Soal #${index + 1} berhasil dirancang ulang oleh AI!`)
      }
    } catch {
      toast.error('Gagal memperbarui soal.')
    } finally {
      setRegeneratingIndex(null)
    }
  }

  const handleDeleteSingle = (index: number) => {
    setAiQuestions((prev) => prev.filter((_, i) => i !== index))
    toast.info('Soal dihapus dari daftar preview.')
  }

  const handleUpdateSingleQuestion = (index: number, field: string, val: any) => {
    setAiQuestions((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: val }
      return next
    })
  }

  // Local Form state
  const [questionText, setQuestionText] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('a')
  const [topicTag, setTopicTag] = useState('')
  const [selectedLessonId, setSelectedLessonId] = useState<string>('')
  const [microSkill, setMicroSkill] = useState('')
  const [hintsList, setHintsList] = useState<string[]>(['', ''])
  const [difficulty, setDifficulty] = useState('medium')
  const [questionType, setQuestionType] = useState<'MC' | 'TF' | 'SA'>('MC') // Multiple Choice, True/False, Short Answer
  const [explanation, setExplanation] = useState('')

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
    const firstLesson = currentSectionLessons[0]
    if (firstLesson) {
      setSelectedLessonId(firstLesson.id)
      setTopicTag(firstLesson.title)
    } else {
      setSelectedLessonId('custom')
      setTopicTag(activeSection?.title || course?.title || 'Dasar Pemrograman')
    }
    setDifficulty('medium')
    setQuestionType('MC')
    setExplanation('')
    setMicroSkill('')
    setHintsList(['', ''])
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
    setTopicTag(q.topic || '')

    // Match lesson by title or id
    const matched = currentSectionLessons.find(
      (l) => l.title.toLowerCase() === (q.topic || '').toLowerCase()
    )
    if (matched) {
      setSelectedLessonId(matched.id)
    } else {
      setSelectedLessonId('custom')
    }

    setDifficulty(q.difficulty || 'medium')
    setExplanation(opts?.explanation || q.explanation || '')
    setMicroSkill(opts?.microSkill || opts?.micro_skill || '')
    setHintsList(Array.isArray(opts?.hints) && opts.hints.length > 0 ? opts.hints : ['', ''])
    setModalOpen(true)
  }

  // Handle save question (Create or Update)
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim()) {
      toast.error('Pertanyaan wajib diisi')
      return
    }

    // Determine final topic based on selected lesson or custom input
    let finalTopic = topicTag.trim()
    if (selectedLessonId && selectedLessonId !== 'custom') {
      const pickedLesson = currentSectionLessons.find((l) => l.id === selectedLessonId)
      if (pickedLesson) finalTopic = pickedLesson.title
    }

    if (!finalTopic) {
      toast.error('Topik atau sub-materi pembelajaran wajib dipilih')
      return
    }

    // Format options JSON
    let optionsJson: Record<string, any> = {}
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

    if (explanation.trim()) {
      optionsJson.explanation = explanation.trim()
    }

    const validHints = hintsList.map((h) => h.trim()).filter((h) => h.length > 0)
    if (validHints.length > 0) {
      optionsJson.hints = validHints
    }

    if (microSkill.trim()) {
      optionsJson.microSkill = microSkill.trim()
    }

    try {
      setSaving(true)
      const payload = {
        question: questionText,
        options: optionsJson,
        correct: correctAnswer.toUpperCase(),
        topic: finalTopic,
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              <span>DAFTAR SOAL</span>
              <span className="text-[10px] font-mono bg-bg-bone/80 px-2 py-0.5 rounded-full shrink-0">
                {activeQuestions.length} soal &middot; {activeQuestions.length * 4} menit
              </span>
            </div>

            {/* View Mode Toggle: Detail vs Ringkas */}
            {activeQuestions.length > 0 && (
              <div className="flex items-center bg-bg-bone/70 p-0.5 rounded-xl border border-border/10 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setListDisplayMode('detail')
                    setCollapsedQuestionIds({})
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    listDisplayMode === 'detail'
                      ? 'bg-white dark:bg-neutral-800 text-text-primary shadow-xs'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                  title="Tampilkan soal lengkap beserta opsi dan pembahasan"
                >
                  <LayoutList className="w-3.5 h-3.5 text-accent-coral" />
                  <span>Detail Lengkap</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setListDisplayMode('compact')
                    setCollapsedQuestionIds({})
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    listDisplayMode === 'compact'
                      ? 'bg-white dark:bg-neutral-800 text-text-primary shadow-xs'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                  title="Tampilan ringkas satu baris"
                >
                  <ListFilter className="w-3.5 h-3.5 text-text-muted" />
                  <span>Ringkas</span>
                </button>
              </div>
            )}
          </div>

          {quizType !== 'PRE_TEST' && (
            <div className="flex items-center gap-2">
              {/* AI Quiz Generator Trigger Button */}
              <button
                onClick={() => {
                  setAiQuestions([])
                  setAiLessonContent(activeSection?.title ? `Bab: ${activeSection.title}` : '')
                  setAiModalOpen(true)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white btn-interactive rounded-full font-bold text-xs shadow-md transition-all cursor-pointer select-none"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Buat Kuis AI</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-4 py-2 coral-skeuo btn-interactive rounded-full font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Soal</span>
              </button>
            </div>
          )}
        </div>

        {/* Card lists */}
        <div className="space-y-3">
          {activeQuestions.length === 0 ? (
            <div className="paper-skeuo rounded-3xl p-12 text-center">
              <Trophy className="h-8 w-8 text-[#b89a57]/30 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-text-primary font-serif">Belum Ada Soal Terdaftar</h4>
              <p className="text-xs text-text-muted max-w-sm mx-auto mt-1.5 leading-relaxed">
                Kuis ini masih kosong. Klik tombol &ldquo;Tambah Soal&rdquo; untuk mulai menyusun daftar pertanyaan.
              </p>
            </div>
          ) : (
            activeQuestions.map((q, idx) => {
              const opts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || {})
              const explanationText = q.explanation || opts.explanation || opts._explanation || ''
              const microSkill = q.micro_skill || opts.microSkill || opts.micro_skill || ''
              const hints: string[] = Array.isArray(opts.hints) ? opts.hints : (Array.isArray(q.hints) ? q.hints : [])
              const isDetailOpen = listDisplayMode === 'detail' ? !collapsedQuestionIds[q.id] : !!collapsedQuestionIds[q.id]
              const correctKey = (q.correct || 'a').toLowerCase()

              return (
                <div
                  key={q.id}
                  className={`group rounded-2xl transition-all duration-200 border border-border/8 ${
                    isDetailOpen
                      ? 'p-5 debossed-skeuo space-y-3.5 hover:bg-bg-bone/45'
                      : 'p-4 debossed-skeuo hover:bg-bg-bone/45 flex items-center gap-4'
                  }`}
                >
                  {isDetailOpen ? (
                    // === DETAILED FULL QUESTION CARD ===
                    <>
                      {/* Top Row: Reorder, Badges, Points, Actions & Collapse */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-wrap">
                          <div className="cursor-grab text-text-faint hover:text-text-muted shrink-0 transition-colors">
                            <GripVertical className="h-4 w-4" />
                          </div>

                          <div className="h-6 w-6 rounded-lg bg-bg-bone/80 border border-border/5 text-[11px] font-bold flex items-center justify-center text-text-muted shrink-0">
                            {idx + 1}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold font-sans tracking-wide uppercase bg-bg-surface-accent text-text-primary">
                              {getQuestionTypeLabel(q)}
                            </span>
                            {quizType === 'PRE_TEST' && q.sectionId && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-medium font-sans tracking-wide uppercase bg-accent-mustard/15 text-[#786131] border border-accent-mustard/20">
                                Bab: {sections.find((s) => s.id === q.sectionId)?.title || 'Umum'}
                              </span>
                            )}
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-medium font-sans tracking-wide uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                              Topik: {q.topic}
                            </span>
                            {microSkill && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold font-sans tracking-wide uppercase bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                                <Target className="w-2.5 h-2.5" />
                                {microSkill}
                              </span>
                            )}
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-medium font-sans tracking-wide uppercase border ${
                              q.difficulty === 'hard'
                                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
                                : q.difficulty === 'easy'
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                                : 'bg-accent-mustard/10 text-accent-mustard border-accent-mustard/20'
                            }`}>
                              {q.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Right: Points & Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="px-2.5 py-1 text-[10px] font-bold text-text-muted font-sans border border-[#b89a57]/10 bg-white/60 dark:bg-black/5 rounded-xl shadow-2xs">
                            {getQuestionPoints(q)}
                          </div>

                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => handleOpenEdit(q)}
                              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-bone/80 rounded-xl transition-all border border-transparent hover:border-border/5 cursor-pointer"
                              title="Edit pertanyaan"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateQuestion(q)}
                              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-bone/80 rounded-xl transition-all border border-transparent hover:border-border/5 cursor-pointer"
                              title="Duplikasi"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1.5 text-text-faint hover:text-error hover:bg-red-500/5 rounded-xl transition-all border border-transparent hover:border-red-500/10 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => toggleQuestionCollapse(q.id)}
                              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-bone/80 rounded-xl transition-all border border-transparent hover:border-border/5 cursor-pointer ml-1"
                              title="Sembunyikan detail"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Full Question Text with Markdown Code Blocks Support */}
                      <div className="pt-0.5">
                        <RichQuestionContent
                          text={q.question}
                          className="text-xs sm:text-[13px] font-semibold text-text-primary font-sans"
                        />
                      </div>

                      {/* Multiple Choice Options Grid */}
                      {getQuestionTypeLabel(q) === 'Pilihan Ganda' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                          {(['a', 'b', 'c', 'd'] as const).map((optKey) => {
                            const optText = opts[optKey]
                            if (!optText) return null
                            const isCorrect = correctKey === optKey
                            return (
                              <div
                                key={optKey}
                                className={`px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                                  isCorrect
                                    ? 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-900 dark:text-emerald-200 font-bold shadow-2xs'
                                    : 'bg-white/45 dark:bg-black/15 text-text-secondary border border-border/8'
                                }`}
                              >
                                <span className={`uppercase font-mono text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${
                                  isCorrect ? 'bg-emerald-500/25 text-emerald-950 dark:text-emerald-100 font-extrabold' : 'bg-bg-bone/80 text-text-muted font-bold'
                                }`}>
                                  {optKey}.
                                </span>
                                <span className="flex-1 leading-snug">{optText}</span>
                                {isCorrect && (
                                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300 ml-auto shrink-0 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                                    <Check className="w-3 h-3" />
                                    <span>Kunci</span>
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* True / False Options */}
                      {getQuestionTypeLabel(q) === 'Benar / Salah' && (
                        <div className="flex items-center gap-3 pt-1">
                          {['a', 'b'].map((optKey) => {
                            const isCorrect = correctKey === optKey
                            const label = optKey === 'a' ? (opts.a || 'Benar') : (opts.b || 'Salah')
                            return (
                              <div
                                key={optKey}
                                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                  isCorrect
                                    ? 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-800 dark:text-emerald-200'
                                    : 'bg-white/40 dark:bg-black/10 text-text-muted border border-border/8'
                                }`}
                              >
                                <span>{label}</span>
                                {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Short Answer */}
                      {getQuestionTypeLabel(q) === 'Isian Singkat' && (
                        <div className="p-3 bg-white/40 dark:bg-black/10 rounded-xl border border-border/8 text-xs flex items-center gap-2">
                          <span className="text-text-muted font-bold">Kunci Jawaban Singkat:</span>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                            {q.correct}
                          </span>
                        </div>
                      )}

                      {/* Educational Explanation Box */}
                      {explanationText && (
                        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-text-secondary mt-1">
                          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5 flex-1">
                            <span className="font-bold text-amber-800 dark:text-amber-300 text-[11px] block uppercase tracking-wider">
                              Pembahasan Edukatif
                            </span>
                            <p className="leading-relaxed text-xs text-text-primary/90">{explanationText}</p>
                          </div>
                        </div>
                      )}

                      {/* Progressive Hints Callout (Must-Have Feature) */}
                      {hints && hints.length > 0 && (
                        <div className="p-3 rounded-2xl bg-amber-500/8 border border-amber-500/20 text-xs text-text-secondary mt-1 space-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wider">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Petunjuk Belajar Bertingkat ({hints.length} Petunjuk)</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {hints.map((hint, hIdx) => (
                              <div
                                key={hIdx}
                                className="p-2.5 rounded-xl bg-white/60 dark:bg-black/20 border border-amber-500/15 flex items-start gap-2 shadow-2xs"
                              >
                                <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 shrink-0">
                                  Hint {hIdx + 1}
                                </span>
                                <p className="text-[11px] leading-relaxed text-text-primary/90 font-medium">{hint}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // === COMPACT OVERVIEW ROW ===
                    <>
                      <div className="cursor-grab text-text-faint hover:text-text-muted shrink-0 transition-colors">
                        <GripVertical className="h-4 w-4" />
                      </div>

                      <div className="h-6 w-6 rounded-lg bg-bg-bone/80 border border-border/5 text-[11px] font-bold flex items-center justify-center text-text-muted shrink-0">
                        {idx + 1}
                      </div>

                      <div
                        className="flex-1 min-w-0 space-y-1 cursor-pointer"
                        onClick={() => toggleQuestionCollapse(q.id)}
                        title="Klik untuk membuka detail soal"
                      >
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
                          {microSkill && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-sans font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                              <Target className="w-2.5 h-2.5" />
                              {microSkill}
                            </span>
                          )}
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-medium font-sans tracking-wide uppercase bg-accent-mustard/5 text-accent-mustard/90 border border-accent-mustard/10">
                            {q.difficulty}
                          </span>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                            Kunci: {q.correct?.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-text-primary font-sans leading-relaxed truncate" title={q.question}>
                          {q.question}
                        </h4>
                      </div>

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
                          <button
                            onClick={() => toggleQuestionCollapse(q.id)}
                            className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-bone/80 rounded-xl transition-all border border-transparent hover:border-border/5 cursor-pointer"
                            title="Buka detail lengkap"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="px-2.5 py-1 text-[10px] font-bold text-text-muted font-sans border border-[#b89a57]/10 bg-white/60 dark:bg-black/5 rounded-xl shadow-sm shrink-0">
                          {getQuestionPoints(q)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )
            })
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

              {/* Sub-Materi / Lesson Selector and Difficulty fields */}
              <div className="space-y-3 border-t border-border/5 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-accent-coral" />
                      <span>Hubungkan ke Sub-Materi</span>
                    </label>
                    <select
                      value={selectedLessonId}
                      onChange={(e) => {
                        const val = e.target.value
                        setSelectedLessonId(val)
                        if (val !== 'custom') {
                          const picked = currentSectionLessons.find((l) => l.id === val)
                          if (picked) setTopicTag(picked.title)
                        }
                      }}
                      className="w-full p-2.5 rounded-xl border-none outline-none text-text-primary font-bold header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 text-xs transition-all"
                    >
                      {currentSectionLessons.map((l, idx) => (
                        <option key={l.id} value={l.id}>
                          Materi #{idx + 1}: {l.title}
                        </option>
                      ))}
                      <option value="custom">✏️ Topik Kustom / Bebas</option>
                    </select>
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

                {/* Custom Topic Tag if selected */}
                {selectedLessonId === 'custom' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Nama Topik Kustom</label>
                    <input
                      type="text"
                      value={topicTag}
                      onChange={(e) => setTopicTag(e.target.value)}
                      placeholder="Masukkan nama topik kustom..."
                      className="w-full p-2.5 rounded-xl border-none outline-none text-text-primary header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 text-xs transition-all"
                      required
                    />
                  </div>
                )}

                {/* Micro-Skill Tag */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                    <Target className="w-3 h-3 text-blue-500" />
                    <span>Micro-Skill / Kompetensi Spesifik (Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={microSkill}
                    onChange={(e) => setMicroSkill(e.target.value)}
                    placeholder="contoh: Deklarasi Variabel & Penugasan Nilai"
                    className="w-full p-2.5 rounded-xl border-none outline-none text-text-primary header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 text-xs transition-all"
                  />
                </div>
              </div>

              {/* Hints List (Petunjuk Bertingkat) */}
              <div className="space-y-2 border-t border-border/5 pt-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Petunjuk Bertingkat (Hints Siswa)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setHintsList((prev) => [...prev, ''])}
                    className="text-[10px] font-bold text-accent-coral hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Hint</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {hintsList.map((hint, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-500/20 px-2 py-1 rounded shrink-0">
                        Hint {hIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={hint}
                        onChange={(e) => {
                          const next = [...hintsList]
                          next[hIdx] = e.target.value
                          setHintsList(next)
                        }}
                        placeholder={`Petunjuk tingkat ${hIdx + 1} untuk membantu siswa...`}
                        className="flex-1 p-2 rounded-xl border-none outline-none text-text-primary header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 text-xs transition-all"
                      />
                      {hintsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setHintsList((prev) => prev.filter((_, i) => i !== hIdx))}
                          className="p-1.5 text-text-muted hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                          title="Hapus hint ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation Field */}
              <div className="space-y-1 border-t border-border/5 pt-3">
                <label className="text-[10px] font-bold text-text-muted uppercase">Pembahasan Edukatif (Opsional)</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Tuliskan pembahasan atau konsep mengapa kunci jawaban ini benar..."
                  className="w-full p-3 rounded-2xl border-none outline-none text-text-primary header-skeuo-debossed focus:ring-1 focus:ring-accent-coral/20 text-xs transition-all resize-none leading-relaxed"
                />
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

      {/* AI QUIZ GENERATOR MODAL (Milestone 2 - US 4.3) */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="paper-skeuo max-w-2xl w-full max-h-[90vh] flex flex-col rounded-3xl p-6 relative shadow-2xl border border-[#b89a57]/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-text-primary">
                    Automated AI Quiz Generator
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    Buat butir soal pilihan ganda otomatis menggunakan AI berdasarkan silabus materi.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-bone/80 text-text-muted hover:text-text-primary transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {/* STEP 1: CONFIGURATION (if no preview questions yet) */}
              {aiQuestions.length === 0 && !aiGenerating && (
                <div className="space-y-4 text-xs">
                  {/* Database & RAG Knowledge Status Badge (Milestone 3 Extension) */}
                  <div
                    className={`flex items-start gap-2.5 p-3.5 rounded-2xl text-xs border transition-all ${
                      knowledgeStatus && knowledgeStatus.total_chunks > 0
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/25 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    <Database
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        knowledgeStatus && knowledgeStatus.total_chunks > 0
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">
                            {knowledgeStatus && knowledgeStatus.total_chunks > 0
                              ? '🧠 RAG Vector Knowledge Base Aktif'
                              : '⚡ Vektor Materi Belum Di-Sync'}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                              knowledgeStatus && knowledgeStatus.total_chunks > 0
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {knowledgeStatus && knowledgeStatus.total_chunks > 0
                              ? `${knowledgeStatus.total_chunks} Chunks di Supabase`
                              : '0 Chunks'}
                          </span>
                        </div>

                        {/* In-Modal Quick Sync Action (Should-Have Side Feature) */}
                        <button
                          type="button"
                          disabled={syncingKnowledge}
                          onClick={handleSyncKnowledge}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-neutral-800/80 border border-border/15 hover:bg-white text-[10.5px] font-bold text-text-primary shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                          title="Sinkronkan materi kurikulum ke AI Vector Store sekarang"
                        >
                          <RefreshCw
                            className={`w-3 h-3 ${syncingKnowledge ? 'animate-spin text-accent-coral' : 'text-text-muted'}`}
                          />
                          <span>{syncingKnowledge ? 'Sinkronisasi...' : 'Sync Materi'}</span>
                        </button>
                      </div>

                      <p className="text-[11px] opacity-90 leading-relaxed">
                        {knowledgeStatus && knowledgeStatus.total_chunks > 0 ? (
                          <>
                            AI akan merancang butir soal mendalam berdasarkan vektor semantik lengkap{' '}
                            {aiSelectedLessonId === 'all' ? (
                              <>
                                seluruh materi pembelajaran pada{' '}
                                <strong>
                                  {quizType === 'PRE_TEST'
                                    ? 'seluruh kurikulum kursus'
                                    : `Bab '${activeSection?.title || 'Aktif'}'`}
                                </strong>
                              </>
                            ) : (
                              <>
                                materi spesifik{' '}
                                <strong>
                                  &lsquo;
                                  {currentSectionLessons.find((l) => l.id === aiSelectedLessonId)?.title ||
                                    'Terpilih'}
                                  &rsquo;
                                </strong>
                              </>
                            )}{' '}
                            dari Supabase PGVector.
                          </>
                        ) : (
                          <>
                            Materi kurikulum belum di-indeks ke AI Vector Store. Klik tombol{' '}
                            <strong>&lsquo;Sync Materi&rsquo;</strong> di atas untuk memproses embedding semantik
                            agar pembuatan soal kuis memiliki akurasi maksimal.
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Lesson Scope Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-accent-coral" />
                      Cakupan Materi Pembelajaran
                    </label>
                    <select
                      value={aiSelectedLessonId}
                      onChange={(e) => setAiSelectedLessonId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border-none outline-none text-text-primary font-bold header-skeuo-debossed text-xs"
                    >
                      <option value="all">
                        {quizType === 'PRE_TEST'
                          ? `Semua Materi Kurikulum Kursus (${currentSectionLessons.length} Materi)`
                          : `Semua Materi dalam Bab Ini (${currentSectionLessons.length} Materi)`}
                      </option>
                      {currentSectionLessons.map((lesson, lIdx) => (
                        <option key={lesson.id} value={lesson.id}>
                          Materi #{lIdx + 1}: {lesson.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Question Count & Question Style Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        Jumlah Soal Kuis
                      </label>
                      <select
                        value={aiNumQuestions}
                        onChange={(e) => setAiNumQuestions(parseInt(e.target.value) || 5)}
                        className="w-full p-2.5 rounded-xl border-none outline-none text-text-primary font-bold header-skeuo-debossed text-xs"
                      >
                        <option value={3}>3 Butir Soal (Kuis Singkat)</option>
                        <option value={5}>5 Butir Soal (Standar)</option>
                        <option value={10}>10 Butir Soal (Ujian Lengkap)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Fokus Gaya Soal
                      </label>
                      <select
                        value={aiQuestionStyle}
                        onChange={(e) => setAiQuestionStyle(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border-none outline-none text-text-primary font-bold header-skeuo-debossed text-xs"
                      >
                        <option value="balanced">⚖️ Kombinasi Seimbang (Kode, Cerita, & Konsep)</option>
                        <option value="code_analysis">💻 Analisis Kode & Output (Prediksi / Bug)</option>
                        <option value="case_study">📖 Studi Kasus & Skenario Cerita (Problem Solving)</option>
                        <option value="conceptual">🧠 Pemahaman Konseptual (Teori & Arsitektur)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      Instruksi Tambahan / Catatan Spesifik (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      value={aiLessonContent}
                      onChange={(e) => setAiLessonContent(e.target.value)}
                      placeholder="Contoh: Berikan fokus lebih banyak pada studi kasus penanganan error dan contoh kode..."
                      className="w-full p-3 rounded-2xl border-none outline-none text-text-primary header-skeuo-debossed text-xs leading-relaxed resize-none"
                    />
                    <p className="text-[10px] text-text-muted">
                      💡 Tip: Jika dikosongkan, AI otomatis menggunakan teks kurikulum lengkap dari database.
                    </p>
                  </div>
                </div>
              )}

              {/* LOADING STATE */}
              {aiGenerating && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 animate-spin flex items-center justify-center">
                      <div className="w-12 h-12 bg-background rounded-full" />
                    </div>
                    <Sparkles className="w-6 h-6 text-amber-500 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-sm text-text-primary">
                      AI sedang merancang soal kuis dari database...
                    </h4>
                    <p className="text-xs text-text-muted max-w-sm">
                      Membaca materi pembelajaran, menyusun 4 opsi pilihan ganda, dan membuat pembahasan edukatif.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: PREVIEW QUESTIONS LIST */}
              {aiQuestions.length > 0 && !aiGenerating && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-bold text-text-primary flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Hasil {aiQuestions.length} Soal AI Berhasil Dirancang:
                    </span>
                    <button
                      onClick={() => setAiQuestions([])}
                      className="text-[10.5px] text-accent-coral hover:underline cursor-pointer"
                    >
                      Konfigurasi Ulang
                    </button>
                  </div>

                  {aiQuestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 debossed-skeuo rounded-2xl space-y-2.5 border border-border/10 text-xs transition-all"
                    >
                      {/* Top Toolbar: Number, Badges, and Action Buttons */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/10">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <span className="font-bold text-accent-coral text-xs shrink-0">#{idx + 1}</span>

                          {/* Sub-Materi Silabus Dropdown Badge */}
                          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded-lg shadow-2xs" title="Materi Silabus Kursus">
                            <BookOpen className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span className="text-[10px] font-semibold text-text-muted shrink-0">Materi:</span>
                            <select
                              value={item.topic}
                              onChange={(e) => handleUpdateSingleQuestion(idx, 'topic', e.target.value)}
                              className="bg-transparent text-[10.5px] font-bold text-amber-900 dark:text-amber-100 outline-none cursor-pointer max-w-[180px] sm:max-w-[240px] truncate"
                              title="Pilih materi silabus untuk soal ini"
                            >
                              {currentSectionLessons.map((l) => (
                                <option key={l.id} value={l.title} className="bg-background text-text-primary">
                                  {l.title}
                                </option>
                              ))}
                              {!currentSectionLessons.some(l => l.title === item.topic) && (
                                <option value={item.topic} className="bg-background text-text-primary">
                                  {item.topic}
                                </option>
                              )}
                            </select>
                          </div>

                          {item.micro_skill && (
                            <span className="inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 font-semibold border border-cyan-500/25" title="Micro-Skill Teknis">
                              <Target className="w-2.5 h-2.5 text-cyan-600" />
                              <span>{item.micro_skill}</span>
                            </span>
                          )}

                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-500/10 text-text-muted font-mono font-bold">
                            {item.difficulty}
                          </span>
                        </div>

                        {/* Top Right Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRegenerateSingle(idx)}
                            disabled={regeneratingIndex === idx}
                            title="Rancang ulang soal ini dengan AI"
                            className="p-1.5 rounded-lg text-text-muted hover:text-accent-coral hover:bg-bg-bone/80 transition-all cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${regeneratingIndex === idx ? 'animate-spin text-accent-coral' : ''}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteSingle(idx)}
                            title="Hapus soal ini"
                            className="p-1.5 rounded-lg text-text-muted hover:text-destructive hover:bg-bg-bone/80 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Full-Width Question Area with Edit/Preview Toggle */}
                      <div className="w-full pt-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                            Teks Pertanyaan Kuis:
                          </label>
                          {/* Edit / Preview Mode Toggle */}
                          <div className="flex items-center bg-bg-bone/70 p-0.5 rounded-lg border border-border/10 text-[10px]">
                            <button
                              type="button"
                              onClick={() => {
                                if (editingQuestionIndices.has(idx)) toggleQuestionEditMode(idx)
                              }}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                                !editingQuestionIndices.has(idx)
                                  ? 'bg-white dark:bg-neutral-800 text-text-primary shadow-xs'
                                  : 'text-text-muted hover:text-text-primary'
                              }`}
                            >
                              👁 Preview
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!editingQuestionIndices.has(idx)) toggleQuestionEditMode(idx)
                              }}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                                editingQuestionIndices.has(idx)
                                  ? 'bg-white dark:bg-neutral-800 text-text-primary shadow-xs'
                                  : 'text-text-muted hover:text-text-primary'
                              }`}
                            >
                              ✏️ Edit
                            </button>
                          </div>
                        </div>

                        {/* Preview Mode: Render markdown + code blocks */}
                        {!editingQuestionIndices.has(idx) ? (
                          <div
                            className="w-full min-h-[56px] bg-white/60 dark:bg-black/30 p-3 rounded-xl border border-border/10 cursor-pointer hover:border-accent-coral/30 transition-all shadow-2xs"
                            onClick={() => toggleQuestionEditMode(idx)}
                            title="Klik untuk mengedit teks pertanyaan"
                          >
                            <RichQuestionContent
                              text={item.question || 'Klik untuk mulai menulis pertanyaan...'}
                              className="text-xs font-medium text-text-primary"
                            />
                          </div>
                        ) : (
                          /* Edit Mode: Raw textarea for authoring */
                          <textarea
                            rows={Math.min(12, Math.max(4, item.question.split('\n').length + 2))}
                            value={item.question}
                            onChange={(e) => handleUpdateSingleQuestion(idx, 'question', e.target.value)}
                            placeholder="Tuliskan pertanyaan kuis di sini...\n\nContoh code block:\n```python\n1: def hitung(a, b):\n2:     return a + b\n```"
                            className="w-full font-mono text-text-primary bg-white/80 dark:bg-black/50 p-3 rounded-xl border border-accent-coral/30 outline-none text-xs leading-relaxed resize-y font-sans shadow-2xs"
                            autoFocus
                            title="Mode Edit: Ketik atau paste teks + code block Markdown"
                          />
                        )}

                        {/* Helper tip when in edit mode */}
                        {editingQuestionIndices.has(idx) && (
                          <p className="text-[10px] text-text-muted leading-relaxed">
                            💡 Tip: Tulis code block dengan <code className="font-mono bg-bg-bone/80 px-1 rounded">```python ... ```</code>. Klik tombol <strong>Preview</strong> untuk melihat hasil render.
                          </p>
                        )}
                      </div>

                      {/* Options Grid */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                          Pilihan Ganda & Kunci Jawaban:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(['a', 'b', 'c', 'd'] as const).map((optKey) => {
                            const isCorrect = item.correct.toLowerCase() === optKey
                            return (
                              <div
                                key={optKey}
                                onClick={() => handleUpdateSingleQuestion(idx, 'correct', optKey)}
                                className={`px-3 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all ${
                                  isCorrect
                                    ? 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-900 dark:text-emerald-100 font-bold shadow-2xs ring-1 ring-emerald-500/20'
                                    : 'bg-white/50 dark:bg-black/20 text-text-secondary border border-border/10 hover:bg-white/80 dark:hover:bg-black/40'
                                }`}
                                title="Klik untuk memilih kunci jawaban benar"
                              >
                                <span className={`uppercase font-mono text-xs font-extrabold px-1.5 py-0.5 rounded ${
                                  isCorrect ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' : 'bg-bg-bone/80 text-text-muted'
                                }`}>
                                  {optKey}
                                </span>
                                <input
                                  type="text"
                                  value={item.options[optKey]}
                                  onChange={(e) => {
                                    e.stopPropagation()
                                    const updatedOptions = { ...item.options, [optKey]: e.target.value }
                                    handleUpdateSingleQuestion(idx, 'options', updatedOptions)
                                  }}
                                  className="flex-1 bg-transparent border-none outline-none text-xs text-text-primary"
                                />
                                {isCorrect && <Check className="w-4 h-4 ml-auto text-emerald-600 dark:text-emerald-400 shrink-0" />}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Detailed Educational Explanation */}
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wider">
                            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>Pembahasan Lengkap & Analisis Jawaban:</span>
                          </div>
                          <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-medium">
                            (Dapat diedit langsung)
                          </span>
                        </div>
                        <textarea
                          rows={Math.min(10, Math.max(3, (item.explanation || '').split('\n').length + 1))}
                          value={item.explanation || ''}
                          onChange={(e) => handleUpdateSingleQuestion(idx, 'explanation', e.target.value)}
                          placeholder="Tuliskan pembahasan lengkap mengapa kunci benar dan analisis pengecohnya..."
                          className="w-full bg-white/60 dark:bg-black/30 p-2.5 rounded-xl border border-amber-500/20 focus:border-amber-500/50 text-text-primary text-xs leading-relaxed outline-none resize-y font-sans shadow-2xs"
                        />
                      </div>

                      {/* Progressive Hints (Must-Have Feature) */}
                      {item.hints && item.hints.length > 0 && (
                        <div className="p-3 rounded-2xl bg-amber-500/8 border border-amber-500/20 text-xs space-y-2">
                          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Petunjuk Belajar Bertingkat (Progressive Hints):</span>
                          </div>
                          <div className="space-y-1.5">
                            {item.hints.map((hint, hIdx) => (
                              <div key={hIdx} className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded shrink-0">
                                  Hint {hIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={hint}
                                  onChange={(e) => {
                                    const updatedHints = [...(item.hints || [])]
                                    updatedHints[hIdx] = e.target.value
                                    handleUpdateSingleQuestion(idx, 'hints', updatedHints)
                                  }}
                                  placeholder={`Petunjuk tingkat ${hIdx + 1}...`}
                                  className="flex-1 bg-white/40 dark:bg-black/10 px-2 py-1 rounded-lg border border-amber-500/15 text-[11px] text-text-primary outline-none focus:border-amber-500/40"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-border/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="px-4 py-2 rounded-full border border-border/20 text-xs font-bold text-text-muted hover:text-text-primary hover:bg-bg-bone/40 transition-all cursor-pointer"
              >
                Tutup
              </button>

              {aiQuestions.length === 0 ? (
                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={async () => {
                    setAiGenerating(true)
                    try {
                      const fallbackContent = knowledgeStatus && knowledgeStatus.total_chunks > 0 ? undefined : autoDbContent
                      const questionsResult = await fetchAIGeneratedQuiz({
                        courseId: course?.id || course?.slug || 'umum',
                        courseTitle: activeSection?.title || course?.title || 'Dasar Pemrograman',
                        sectionId: quizType === 'SECTION_QUIZ' ? sectionId : null,
                        lessonId: aiSelectedLessonId !== 'all' ? aiSelectedLessonId : null,
                        numQuestions: aiNumQuestions,
                        difficulty: 'medium',
                        questionStyle: aiQuestionStyle,
                        lessonContent: aiLessonContent.trim() || fallbackContent || undefined,
                      })

                      if (questionsResult && questionsResult.length > 0) {
                        const selectedLesson = currentSectionLessons.find((l) => l.id === aiSelectedLessonId)
                        const normalizedQuestions = questionsResult.map((q, qIdx) => {
                          let finalTopic = q.topic
                          if (selectedLesson) {
                            finalTopic = selectedLesson.title
                          } else {
                            const matchedLesson = currentSectionLessons.find(
                              (l) =>
                                l.title.toLowerCase() === (q.topic || '').toLowerCase() ||
                                (q.topic || '').toLowerCase().includes(l.title.toLowerCase()) ||
                                l.title.toLowerCase().includes((q.topic || '').toLowerCase()) ||
                                (q.question || '').toLowerCase().includes(l.title.toLowerCase())
                            )
                            if (matchedLesson) {
                              finalTopic = matchedLesson.title
                            } else if (currentSectionLessons.length > 0) {
                              finalTopic = currentSectionLessons[qIdx % currentSectionLessons.length].title
                            } else {
                              finalTopic = activeSection?.title || 'Umum'
                            }
                          }
                          return {
                            ...q,
                            topic: finalTopic,
                          }
                        })
                        setAiQuestions(normalizedQuestions)
                        toast.success(`${normalizedQuestions.length} Soal kuis berhasil dirancang oleh AI!`)
                      } else {
                        toast.error('AI tidak dapat menghasilkan soal. Pastikan server AI aktif.')
                      }
                    } catch (err: any) {
                      toast.error(err.message || 'Gagal menghasilkan kuis AI')
                    } finally {
                      setAiGenerating(false)
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-white rounded-full font-bold text-xs shadow-md hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{aiGenerating ? 'Merancang Soal...' : 'Mulai Generate Kuis'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={aiSaving}
                  onClick={async () => {
                    setAiSaving(true)
                    try {
                      for (const q of aiQuestions) {
                        await fetch(`/api/creator/courses/${course?.slug}/assessments`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            question: q.question,
                            options: {
                              ...q.options,
                              explanation: q.explanation || '',
                              hints: q.hints || [],
                              microSkill: q.micro_skill || '',
                            },
                            correct: q.correct.toUpperCase(),
                            topic: q.topic,
                            difficulty: q.difficulty || 'medium',
                            sectionId: quizType === 'SECTION_QUIZ' ? sectionId : null,
                          }),
                        })
                      }
                      toast.success(`${aiQuestions.length} Soal Kuis berhasil disimpan ke kurikulum!`)
                      setAiModalOpen(false)
                      fetchQuestions()
                    } catch (err: any) {
                      toast.error(err.message || 'Gagal menyimpan soal AI')
                    } finally {
                      setAiSaving(false)
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 coral-skeuo btn-interactive text-white rounded-full font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{aiSaving ? 'Menyimpan...' : `Simpan Semua (${aiQuestions.length}) Soal ke Kursus`}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
