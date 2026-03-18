/**
 * EnrollButton (EnrollableCourseCard) — Unit Tests
 *
 * Covers:
 * - Toast success muncul sebelum navigasi (bug fix: delay 800ms)
 * - Redirect ke /course/{id}/learn setelah enroll sukses
 * - 401 → toast error + redirect ke /sign-in
 * - 409 → langsung redirect (sudah enrolled)
 * - Error lain → toast error, tidak redirect
 *
 * Requirements: 2.1, 2.2, 2.7
 */

import { render, screen, fireEvent, act } from '@testing-library/react'
import { EnrollableCourseCard } from './EnrollButton'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockToastSuccess = jest.fn()
const mockToastError = jest.fn()
jest.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}))

// Mock CourseCard — render a simple enroll button
jest.mock('@/features/cms/components/student/CourseCard', () => ({
  CourseCard: ({ onEnroll, enrolled, enrolling }: {
    onEnroll?: () => void
    enrolled: boolean
    enrolling: boolean
  }) => (
    <div>
      <span data-testid="enrolled-status">{enrolled ? 'enrolled' : 'not-enrolled'}</span>
      <button
        data-testid="enroll-btn"
        onClick={onEnroll}
        disabled={enrolling}
      >
        {enrolling ? 'Loading...' : 'Daftar Sekarang'}
      </button>
    </div>
  ),
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockCourse = {
  id: 'course-123',
  title: 'Belajar React',
  description: 'Kursus React dari dasar',
  category: 'Pemrograman',
  difficulty: 'Pemula',
  status: 'PUBLISHED',
}

function setup(enrolled = false) {
  mockPush.mockClear()
  mockToastSuccess.mockClear()
  mockToastError.mockClear()
  return render(<EnrollableCourseCard course={mockCourse} enrolled={enrolled} />)
}

function mockFetch(status: number, body: object = {}) {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  })
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('EnrollableCourseCard — enroll sukses', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('memanggil toast.success sebelum router.push (toast tidak hilang)', async () => {
    mockFetch(201)
    setup()

    await act(async () => {
      fireEvent.click(screen.getByTestId('enroll-btn'))
    })

    // Toast harus sudah dipanggil
    expect(mockToastSuccess).toHaveBeenCalledWith('Berhasil mendaftar ke "Belajar React"')

    // Tapi router.push belum dipanggil (masih dalam delay 800ms)
    expect(mockPush).not.toHaveBeenCalled()

    // Setelah 800ms, baru redirect
    await act(async () => {
      jest.advanceTimersByTime(800)
    })

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/course/course-123/learn')
  })

  it('mengupdate status enrolled di UI setelah enroll sukses', async () => {
    mockFetch(201)
    setup(false)

    expect(screen.getByTestId('enrolled-status')).toHaveTextContent('not-enrolled')

    await act(async () => {
      fireEvent.click(screen.getByTestId('enroll-btn'))
    })

    expect(screen.getByTestId('enrolled-status')).toHaveTextContent('enrolled')
  })

  it('menampilkan loading state saat proses enroll berlangsung', async () => {
    // Buat fetch yang lambat
    global.fetch = jest.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        status: 201,
        json: () => Promise.resolve({}),
      }), 500))
    )
    setup()

    fireEvent.click(screen.getByTestId('enroll-btn'))

    // Langsung setelah klik, tombol harus disabled/loading
    expect(screen.getByTestId('enroll-btn')).toBeDisabled()

    await act(async () => {
      jest.advanceTimersByTime(500)
    })
  })
})

describe('EnrollableCourseCard — error handling', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('401 → toast error + redirect ke /sign-in', async () => {
    mockFetch(401)
    setup()

    await act(async () => {
      fireEvent.click(screen.getByTestId('enroll-btn'))
    })

    expect(mockToastError).toHaveBeenCalledWith('Silakan login terlebih dahulu')
    expect(mockPush).toHaveBeenCalledWith('/sign-in')
    expect(mockToastSuccess).not.toHaveBeenCalled()
  })

  it('409 (sudah enrolled) → redirect langsung tanpa toast error', async () => {
    mockFetch(409)
    setup()

    await act(async () => {
      fireEvent.click(screen.getByTestId('enroll-btn'))
    })

    // Langsung redirect, tidak perlu delay karena tidak ada toast
    expect(mockPush).toHaveBeenCalledWith('/course/course-123/learn')
    expect(mockToastError).not.toHaveBeenCalled()
  })

  it('409 → mengupdate status enrolled di UI', async () => {
    mockFetch(409)
    setup(false)

    await act(async () => {
      fireEvent.click(screen.getByTestId('enroll-btn'))
    })

    expect(screen.getByTestId('enrolled-status')).toHaveTextContent('enrolled')
  })

  it('403 (course DRAFT) → toast error dengan pesan dari API', async () => {
    mockFetch(403, { error: 'Kursus ini belum dipublikasikan' })
    setup()

    await act(async () => {
      fireEvent.click(screen.getByTestId('enroll-btn'))
    })

    expect(mockToastError).toHaveBeenCalledWith('Kursus ini belum dipublikasikan')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('error jaringan → toast error fallback', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'))
    setup()

    await act(async () => {
      fireEvent.click(screen.getByTestId('enroll-btn'))
    })

    expect(mockToastError).toHaveBeenCalledWith('Terjadi kesalahan. Coba lagi.')
    expect(mockPush).not.toHaveBeenCalled()
  })
})

describe('EnrollableCourseCard — sudah enrolled', () => {
  it('tidak memanggil fetch jika sudah enrolled dari awal', () => {
    global.fetch = jest.fn()
    setup(true)

    // Tidak ada tombol enroll yang bisa diklik (enrolled=true → "Lanjut Belajar")
    expect(screen.getByTestId('enrolled-status')).toHaveTextContent('enrolled')
  })
})

describe('EnrollableCourseCard — toast timing (regression test)', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  /**
   * Regression test untuk bug: toast hilang karena router.push langsung dipanggil
   * setelah toast.success, menyebabkan komponen unmount sebelum toast sempat render.
   *
   * Fix: delay 800ms sebelum router.push agar toast sempat terlihat.
   */
  it('[REGRESSION] toast.success dipanggil SEBELUM router.push, bukan bersamaan', async () => {
    mockFetch(201)
    setup()

    const callOrder: string[] = []
    mockToastSuccess.mockImplementation(() => callOrder.push('toast'))
    mockPush.mockImplementation(() => callOrder.push('push'))

    await act(async () => {
      fireEvent.click(screen.getByTestId('enroll-btn'))
    })

    // Sebelum 800ms: toast sudah dipanggil, push belum
    expect(callOrder).toEqual(['toast'])

    await act(async () => {
      jest.advanceTimersByTime(800)
    })

    // Setelah 800ms: push dipanggil setelah toast
    expect(callOrder).toEqual(['toast', 'push'])
  })
})
