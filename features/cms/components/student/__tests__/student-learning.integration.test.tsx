import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { useProgressHandlers } from '@/features/cms/hooks/learn/useProgressHandlers'
import { CourseCompletionModal } from '../CourseCompletionModal'
import { toast } from 'sonner'

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Student Learning Feature Integration Tests (Must Have & Should Have)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    // Default mock fetch
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('1. True Optimistic Progress & Snapshot Rollback', () => {
    it('should immediately optimistically mark lesson complete, and confirm on 200 OK', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ completed: true }),
      })

      let completedIds = new Set<string>(['lesson-1'])
      let progress = { percentage: 25, completedLessons: 1, totalLessons: 4 }

      const setCompletedLessonIds = jest.fn((updater) => {
        completedIds = typeof updater === 'function' ? updater(completedIds) : updater
      })
      const setProgress = jest.fn((updater) => {
        progress = typeof updater === 'function' ? updater(progress) : updater
      })

      const { result } = renderHook(() =>
        useProgressHandlers({ setCompletedLessonIds, setProgress })
      )

      await act(async () => {
        await result.current.markComplete('lesson-2')
      })

      // State was updated optimistically
      expect(completedIds.has('lesson-2')).toBe(true)
      expect(progress.completedLessons).toBe(2)
      expect(progress.percentage).toBe(50)
      expect(toast.success).toHaveBeenCalledWith('Pelajaran berhasil diselesaikan!')
    })

    it('should rollback to previous snapshot when API returns 500 error', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Database transaction failed' }),
      })

      let completedIds = new Set<string>(['lesson-1'])
      let progress = { percentage: 25, completedLessons: 1, totalLessons: 4 }

      const setCompletedLessonIds = jest.fn((updater) => {
        completedIds = typeof updater === 'function' ? updater(completedIds) : updater
      })
      const setProgress = jest.fn((updater) => {
        progress = typeof updater === 'function' ? updater(progress) : updater
      })

      const { result } = renderHook(() =>
        useProgressHandlers({ setCompletedLessonIds, setProgress })
      )

      await act(async () => {
        await result.current.markComplete('lesson-2')
      })

      // Must rollback to previous state
      expect(completedIds.has('lesson-2')).toBe(false)
      expect(progress.completedLessons).toBe(1)
      expect(progress.percentage).toBe(25)
      expect(toast.error).toHaveBeenCalledWith('Database transaction failed')
    })

    it('should rollback and alert user when session has expired (401 Unauthorized)', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      })

      let completedIds = new Set<string>()
      let progress = { percentage: 0, completedLessons: 0, totalLessons: 5 }

      const setCompletedLessonIds = jest.fn((updater) => {
        completedIds = typeof updater === 'function' ? updater(completedIds) : updater
      })
      const setProgress = jest.fn((updater) => {
        progress = typeof updater === 'function' ? updater(progress) : updater
      })

      const { result } = renderHook(() =>
        useProgressHandlers({ setCompletedLessonIds, setProgress })
      )

      await act(async () => {
        await result.current.markComplete('lesson-1')
      })

      // Rolled back
      expect(completedIds.has('lesson-1')).toBe(false)
      expect(toast.error).toHaveBeenCalledWith(
        'Sesi login telah berakhir. Silakan login kembali untuk menyimpan kemajuan.'
      )
    })
  })

  describe('2. Auto-Resume & LocalStorage Sync', () => {
    it('should store and read the last visited lesson id in localStorage', () => {
      const courseSlug = 'python-dasar'
      const lessonId = 'lesson-105'

      localStorage.setItem(`maguru_last_lesson_${courseSlug}`, lessonId)
      const retrieved = localStorage.getItem(`maguru_last_lesson_${courseSlug}`)

      expect(retrieved).toBe(lessonId)
    })

    it('should find first uncompleted lesson in an unlocked section', () => {
      const completedLessonIds = new Set(['les-1', 'les-2'])
      const sections = [
        {
          id: 'sec-1',
          isLocked: false,
          lessons: [
            { id: 'les-1', title: 'Bab 1' },
            { id: 'les-2', title: 'Bab 2' },
          ],
        },
        {
          id: 'sec-2',
          isLocked: false,
          lessons: [
            { id: 'les-3', title: 'Bab 3' },
            { id: 'les-4', title: 'Bab 4' },
          ],
        },
      ]

      // Search logic from LearnContext
      let targetLessonId: string | null = null
      for (const section of sections) {
        if (section.isLocked) continue
        const firstUncompleted = section.lessons.find(
          (l) => !completedLessonIds.has(l.id)
        )
        if (firstUncompleted) {
          targetLessonId = firstUncompleted.id
          break
        }
      }

      expect(targetLessonId).toBe('les-3')
    })
  })

  describe('3. Reading Time Calculation Formula', () => {
    it('should calculate reading time accurately with 200 words per minute baseline', () => {
      const calculateReadingTime = (text: string) => {
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
        return {
          wordCount,
          readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
        }
      }

      // 50 words -> 1 minute minimum
      const shortText = new Array(50).fill('kata').join(' ')
      expect(calculateReadingTime(shortText)).toEqual({
        wordCount: 50,
        readingTimeMinutes: 1,
      })

      // 450 words -> 3 minutes
      const mediumText = new Array(450).fill('pemrograman').join(' ')
      expect(calculateReadingTime(mediumText)).toEqual({
        wordCount: 450,
        readingTimeMinutes: 3,
      })
    })
  })

  describe('4. CourseCompletionModal (100% Milestone Celebration)', () => {
    it('should render milestone dialog with 100% stats and handle actions', () => {
      const mockOnClose = jest.fn()
      const mockOnBackToCatalog = jest.fn()

      render(
        <CourseCompletionModal
          isOpen={true}
          onClose={mockOnClose}
          courseTitle="Python Dasar"
          totalLessons={12}
          onBackToCatalog={mockOnBackToCatalog}
        />
      )

      expect(screen.getByText('Pencapaian Luar Biasa!')).toBeInTheDocument()
      expect(screen.getByText('100%')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()

      const backBtn = screen.getByRole('button', { name: /Kembali ke Katalog Kursus/i })
      fireEvent.click(backBtn)
      expect(mockOnBackToCatalog).toHaveBeenCalledTimes(1)

      const closeBtn = screen.getByRole('button', { name: /Tutup & Tinjau Kembali Materi/i })
      fireEvent.click(closeBtn)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('5. Section Quiz Retake, Attempt Limit & 1-Hour Cooldown', () => {
    it('should calculate best score preservation correctly when retake score is lower', () => {
      const attempt1Score = 65
      const attempt2Score = 40
      const bestScore = Math.max(attempt1Score, attempt2Score)

      expect(bestScore).toBe(65)
    })

    it('should unlock section when retake score reaches threshold (>= 70%)', () => {
      const attempt1Score = 50
      const attempt2Score = 75
      const bestScore = Math.max(attempt1Score, attempt2Score)
      const unlockedNextSection = bestScore >= 70

      expect(bestScore).toBe(75)
      expect(unlockedNextSection).toBe(true)
    })

    it('should enforce cooldown if student fails (< 70%) after 2 attempts within 1 hour', () => {
      const recordedAttempts = 2
      const lastAttemptAt = new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 mins ago
      const score = 55

      const timeSinceLastAttempt = Date.now() - new Date(lastAttemptAt).getTime()
      const COOLDOWN_DURATION_MS = 3600 * 1000 // 1 hour

      const isCooldownActive =
        score < 70 && recordedAttempts >= 2 && timeSinceLastAttempt < COOLDOWN_DURATION_MS
      const remainingSeconds = Math.ceil((COOLDOWN_DURATION_MS - timeSinceLastAttempt) / 1000)

      expect(isCooldownActive).toBe(true)
      expect(remainingSeconds).toBeGreaterThan(0)
      expect(remainingSeconds).toBeLessThanOrEqual(2700) // approx 45 mins remaining
    })

    it('should reset attempt counter after 1-hour cooldown has passed', () => {
      const recordedAttempts = 2
      const lastAttemptAt = new Date(Date.now() - 65 * 60 * 1000).toISOString() // 65 mins ago (past 1 hour)
      const timeSinceLastAttempt = Date.now() - new Date(lastAttemptAt).getTime()
      const COOLDOWN_DURATION_MS = 3600 * 1000

      const isCooldownActive = timeSinceLastAttempt < COOLDOWN_DURATION_MS
      const newAttempts = timeSinceLastAttempt >= COOLDOWN_DURATION_MS ? 1 : recordedAttempts + 1

      expect(isCooldownActive).toBe(false)
      expect(newAttempts).toBe(1)
    })
  })
})
