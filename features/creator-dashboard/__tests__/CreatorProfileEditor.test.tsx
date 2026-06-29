import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { CreatorProfileEditor } from '../components/CreatorProfileEditor'
import React from 'react'

// Mock global.fetch
const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}))

describe('CreatorProfileEditor', () => {
  const mockProfile = {
    userId: 'user_test123',
    name: 'Lutfi Mentor',
    title: 'Senior Software Engineer',
    bio: 'Saya memiliki 10 tahun pengalaman dalam mengajar pemrograman.',
    experience: 'Ex-Google, Tech Lead at Kiro Tech',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/lutfi-mentor',
      youtube: 'https://youtube.com/c/lutficodes',
      github: 'https://github.com/lutfi'
    },
    stats: {
      rating: 4.8,
      studentsCount: 250,
      coursesCount: 5
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    // mock fetch to hang
    mockFetch.mockReturnValue(new Promise(() => {}))
    render(<CreatorProfileEditor />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders the profile form on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProfile),
    } as Response)

    render(<CreatorProfileEditor />)

    // Wait for load
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProfile.name)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockProfile.title)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockProfile.experience)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockProfile.socialLinks.linkedin)).toBeInTheDocument()
    })

    // Verify stats are rendered
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('250')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('validates social links and name length before saving', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProfile),
    } as Response)

    render(<CreatorProfileEditor />)

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProfile.name)).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/Nama Lengkap/i)
    const linkedinInput = screen.getByLabelText(/LinkedIn/i)
    const saveButton = screen.getByRole('button', { name: /Simpan Profil/i })

    // Input invalid name (too short, min 2)
    fireEvent.change(nameInput, { target: { value: 'A' } })
    fireEvent.click(saveButton)
    expect(screen.getByText(/Nama minimal 2 karakter/i)).toBeInTheDocument()

    // Input invalid URL
    fireEvent.change(nameInput, { target: { value: 'Valid Name' } })
    fireEvent.change(linkedinInput, { target: { value: 'not-a-url' } })
    fireEvent.click(saveButton)
    expect(screen.getByText(/URL LinkedIn tidak valid/i)).toBeInTheDocument()
    
    expect(mockFetch).toHaveBeenCalledTimes(1) // only the initial GET
  })

  it('successfully saves profile changes via PUT', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProfile),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)

    render(<CreatorProfileEditor />)

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProfile.name)).toBeInTheDocument()
    })

    const titleInput = screen.getByLabelText(/Gelar/i)
    const saveButton = screen.getByRole('button', { name: /Simpan Profil/i })

    fireEvent.change(titleInput, { target: { value: 'Principal Software Engineer' } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenLastCalledWith('/api/creator/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mockProfile.name,
          title: 'Principal Software Engineer',
          bio: mockProfile.bio,
          experience: mockProfile.experience,
          avatarUrl: mockProfile.avatarUrl,
          socialLinks: {
            linkedin: mockProfile.socialLinks.linkedin,
            youtube: mockProfile.socialLinks.youtube,
            github: mockProfile.socialLinks.github
          }
        }),
      })
    })
  })
})
