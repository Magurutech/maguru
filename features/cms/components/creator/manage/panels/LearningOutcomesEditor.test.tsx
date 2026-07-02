import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { LearningOutcomesEditor } from './LearningOutcomesEditor'
import React from 'react'

// Mock global.fetch
const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

// Mock lucide-react with simple string components to bypass mock issues
jest.mock('lucide-react', () => ({
  Plus: 'span',
  Trash: 'span',
  ArrowUp: 'span',
  ArrowDown: 'span',
  Edit3: 'span',
  Target: 'span',
  Loader2: 'span',
}))

// Mock Button explicitly in this test file
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentPropsWithoutRef<'button'>) => <button {...props}>{children}</button>,
}))

describe('LearningOutcomesEditor', () => {
  const courseSlug = 'react-basics'
  const initialOutcomes = [
    'Memahami React Hook secara mendalam',
    'Menguasai arsitektur server component',
    'Membangun modul testing yang andal'
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ outcomes: [] }),
    } as Response)
  })

  it('renders empty state when no outcomes are provided', () => {
    render(<LearningOutcomesEditor courseSlug={courseSlug} initialOutcomes={[]} />)
    expect(screen.getByText(/Belum ada outcomes/i)).toBeInTheDocument()
    expect(screen.getByText(/Tambahkan apa yang akan siswa pelajari/i)).toBeInTheDocument()
  })

  it('renders the outcomes list correctly', () => {
    render(<LearningOutcomesEditor courseSlug={courseSlug} initialOutcomes={initialOutcomes} />)
    expect(screen.getByText(initialOutcomes[0])).toBeInTheDocument()
    expect(screen.getByText(initialOutcomes[1])).toBeInTheDocument()
    expect(screen.getByText(initialOutcomes[2])).toBeInTheDocument()
  })

  it('validates outcomes length before adding (min 15 chars)', async () => {
    render(<LearningOutcomesEditor courseSlug={courseSlug} initialOutcomes={initialOutcomes} />)
    
    const input = screen.getByPlaceholderText(/Tambah outcome baru.../i)
    const addButton = screen.getByRole('button', { name: /Tambah/i })

    // Enter invalid short text
    fireEvent.change(input, { target: { value: 'Terlalu pendek' } })
    fireEvent.click(addButton)

    expect(screen.getByText(/Minimal 15 karakter/i)).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('successfully adds a valid outcome and trigger PATCH', async () => {
    const newOutcome = 'Membuat custom hooks yang reusable di aplikasi'
    render(<LearningOutcomesEditor courseSlug={courseSlug} initialOutcomes={initialOutcomes} />)

    const input = screen.getByPlaceholderText(/Tambah outcome baru.../i)
    const addButton = screen.getByRole('button', { name: /Tambah/i })

    fireEvent.change(input, { target: { value: newOutcome } })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(`/api/courses/${courseSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcomes: [...initialOutcomes, newOutcome] }),
      })
    })
  })

  it('allows reordering outcomes using Up/Down buttons', async () => {
    render(<LearningOutcomesEditor courseSlug={courseSlug} initialOutcomes={initialOutcomes} />)

    // Move second item Up (which swaps index 1 with index 0)
    const upButtons = screen.getAllByTitle(/Pindah ke atas/i)
    // The first item (index 0) has a disabled up button, so we click the second item's up button (index 1)
    fireEvent.click(upButtons[1])

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(`/api/courses/${courseSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcomes: [
            initialOutcomes[1], // index 1 moved up
            initialOutcomes[0], // index 0 moved down
            initialOutcomes[2]
          ]
        }),
      })
    })
  })

  it('allows deleting an outcome and trigger PATCH', async () => {
    render(<LearningOutcomesEditor courseSlug={courseSlug} initialOutcomes={initialOutcomes} />)

    const deleteButtons = screen.getAllByTitle(/Hapus outcome/i)
    fireEvent.click(deleteButtons[0]) // delete first item

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(`/api/courses/${courseSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcomes: [initialOutcomes[1], initialOutcomes[2]] }),
      })
    })
  })
})
