/**
 * CourseFilters — Unit & Integration Tests
 *
 * Fokus: mendeteksi double re-render / infinite loop saat filter kategori dipilih.
 *
 * Root cause bug: searchParams ada di dependency array useCallback(updateParams),
 * sehingga setiap kali URL berubah (setelah router.push), updateParams instance baru
 * dibuat → useEffect debounce jalan lagi → router.push lagi → infinite loop.
 *
 * Fix: updateParams membaca searchParams via ref (bukan dependency), sehingga
 * instance-nya stabil dan tidak memicu re-run useEffect.
 *
 * Requirements: 1.2, 1.3, 1.4
 */

import { render, screen, fireEvent, act } from '@testing-library/react'
import { CourseFilters } from './CourseFilters'

// ─── Mock next/navigation ────────────────────────────────────────────────────

const mockPush = jest.fn()

let searchParamsStore: Record<string, string> = {}

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/course',
  useSearchParams: () => ({
    get: (key: string) => searchParamsStore[key] ?? null,
    toString: () =>
      Object.entries(searchParamsStore)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&'),
  }),
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setup(initialParams: Record<string, string> = {}) {
  searchParamsStore = { ...initialParams }
  mockPush.mockClear()
  return render(<CourseFilters />)
}

// Simulasi apa yang terjadi di real app: setelah router.push, searchParams berubah
// dan komponen re-render dengan params baru. Ini yang dulu memicu loop.
function simulateNavigationEffect(newParams: Record<string, string>) {
  searchParamsStore = { ...newParams }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('CourseFilters — render dasar', () => {
  it('merender search input, dropdown kategori, dan dropdown difficulty', () => {
    setup()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByLabelText('Filter kategori')).toBeInTheDocument()
    expect(screen.getByLabelText('Filter tingkat kesulitan')).toBeInTheDocument()
  })

  it('tidak menampilkan tombol Reset jika tidak ada filter aktif', () => {
    setup()
    expect(screen.queryByLabelText('Hapus semua filter')).not.toBeInTheDocument()
  })

  it('menampilkan tombol Reset jika ada filter aktif dari URL', () => {
    setup({ category: 'Pemrograman' })
    expect(screen.getByLabelText('Hapus semua filter')).toBeInTheDocument()
  })

  it('menampilkan nilai search dari URL params saat mount', () => {
    setup({ search: 'React' })
    expect(screen.getByRole('searchbox')).toHaveValue('React')
  })
})

describe('CourseFilters — search debounce', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('tidak memanggil router.push sebelum 300ms', async () => {
    setup()
    await act(async () => {
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'React' } })
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('memanggil router.push tepat 1x setelah 300ms debounce', async () => {
    setup()
    await act(async () => {
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'React' } })
      jest.advanceTimersByTime(300)
    })
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/course?search=React')
  })

  it('hanya memanggil router.push 1x meski user mengetik cepat (debounce bekerja)', async () => {
    setup()
    const input = screen.getByRole('searchbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'R' } })
      jest.advanceTimersByTime(100)
      fireEvent.change(input, { target: { value: 'Re' } })
      jest.advanceTimersByTime(100)
      fireEvent.change(input, { target: { value: 'Rea' } })
      jest.advanceTimersByTime(100)
      fireEvent.change(input, { target: { value: 'React' } })
      jest.advanceTimersByTime(300)
    })
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/course?search=React')
  })

  it('menghapus param search dari URL jika input dikosongkan', async () => {
    setup({ search: 'React' })
    await act(async () => {
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } })
      jest.advanceTimersByTime(300)
    })
    expect(mockPush).toHaveBeenCalledTimes(1)
    // search param harus dihapus (tidak ada di URL)
    expect(mockPush.mock.calls[0][0]).not.toContain('search=')
  })
})

describe('CourseFilters — filter kategori (BUG FIX: no double push)', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  /**
   * TEST KRITIS: Memastikan bug infinite loop sudah diperbaiki.
   *
   * Skenario: user memilih kategori "Pemrograman"
   * Expected: router.push dipanggil TEPAT 1x
   *
   * Bug lama: router.push dipanggil 2x+ karena:
   *   1. onValueChange → updateParams → router.push (pertama)
   *   2. searchParams berubah → updateParams instance baru → useEffect debounce jalan lagi → router.push (kedua)
   *
   * Fix: updateParams membaca searchParams via ref, bukan sebagai dependency.
   */
  it('[BUG FIX] memilih kategori hanya memanggil router.push tepat 1x', async () => {
    setup()

    const categoryTrigger = screen.getByLabelText('Filter kategori')
    await act(async () => {
      fireEvent.click(categoryTrigger)
    })

    const option = screen.getByRole('option', { name: 'Pemrograman' })
    await act(async () => {
      fireEvent.click(option)
      // Simulasi searchParams berubah setelah push — ini yang dulu memicu loop
      simulateNavigationEffect({ category: 'Pemrograman' })
      jest.advanceTimersByTime(400)
    })

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/course?category=Pemrograman')
  })

  it('[BUG FIX] memilih difficulty hanya memanggil router.push tepat 1x', async () => {
    setup()

    const difficultyTrigger = screen.getByLabelText('Filter tingkat kesulitan')
    await act(async () => {
      fireEvent.click(difficultyTrigger)
    })

    const option = screen.getByText('Pemula')
    await act(async () => {
      fireEvent.click(option)
      simulateNavigationEffect({ difficulty: 'Pemula' })
      jest.advanceTimersByTime(400)
    })

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/course?difficulty=Pemula')
  })

  it('debounce search tidak ikut terpicu saat hanya kategori yang berubah', async () => {
    setup()

    const categoryTrigger = screen.getByLabelText('Filter kategori')
    await act(async () => {
      fireEvent.click(categoryTrigger)
    })

    const option = screen.getByRole('option', { name: 'Desain' })
    await act(async () => {
      fireEvent.click(option)
      simulateNavigationEffect({ category: 'Desain' })
      jest.advanceTimersByTime(500)
    })

    // Hanya 1 push dari onValueChange, bukan 2
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush.mock.calls[0][0]).toContain('category=Desain')
  })

  it('memilih kategori lalu difficulty menghasilkan 2 push terpisah (bukan loop)', async () => {
    setup()

    // Pilih kategori
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Filter kategori'))
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('option', { name: 'Bisnis' }))
      simulateNavigationEffect({ category: 'Bisnis' })
      jest.advanceTimersByTime(400)
    })

    expect(mockPush).toHaveBeenCalledTimes(1)

    // Pilih difficulty
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Filter tingkat kesulitan'))
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Menengah'))
      simulateNavigationEffect({ category: 'Bisnis', difficulty: 'Menengah' })
      jest.advanceTimersByTime(400)
    })

    // Total 2 push, bukan lebih
    expect(mockPush).toHaveBeenCalledTimes(2)
  })
})

describe('CourseFilters — tombol Reset', () => {
  it('klik Reset menghapus semua filter dan kembali ke /course', async () => {
    setup({ category: 'Pemrograman', difficulty: 'Pemula', search: 'React' })

    const resetBtn = screen.getByLabelText('Hapus semua filter')
    await act(async () => {
      fireEvent.click(resetBtn)
    })

    expect(mockPush).toHaveBeenCalledWith('/course')
  })

  it('Reset juga mengosongkan search input', async () => {
    setup({ search: 'React' })

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Hapus semua filter'))
    })

    expect(screen.getByRole('searchbox')).toHaveValue('')
  })
})
