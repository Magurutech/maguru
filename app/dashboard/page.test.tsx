import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DashboardPage from './page'

// Mock Clerk hooks
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}))

// Mock Navbar component
jest.mock('@/features/homepage/component/Navbars', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}))

describe('Dashboard Page', () => {
  const mockUseUser = jest.requireMock('@clerk/nextjs').useUser

  beforeEach(() => {
    // Default mock: user sudah login
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        id: 'user_123',
        firstName: 'John',
        primaryEmailAddress: {
          emailAddress: 'john@example.com',
        },
        createdAt: new Date('2023-01-01'),
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('menampilkan halaman dashboard dengan informasi user', () => {
    render(<DashboardPage />)

    // Cek elemen utama dashboard
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('user_123')).toBeInTheDocument()
    expect(screen.getByText('Kursus Terbaru')).toBeInTheDocument()
    expect(screen.getByText('Aktivitas Terbaru')).toBeInTheDocument()

    // Check welcome messages (there are multiple, so use getAllByText)
    const welcomeMessages = screen.getAllByText(/Selamat datang, John!/)
    expect(welcomeMessages.length).toBeGreaterThan(0)
  })

  test('menampilkan loading state ketika user belum loaded', () => {
    // Mock loading state
    mockUseUser.mockReturnValue({
      isLoaded: false,
      user: null,
    })

    render(<DashboardPage />)

    // Loading state should show animated elements
    const loadingElements = document.querySelectorAll('.animate-pulse')
    expect(loadingElements.length).toBeGreaterThan(0)

    // Dashboard content should not be visible during loading
    expect(screen.queryByText('Selamat datang')).not.toBeInTheDocument()
  })

  test('menampilkan fallback name ketika firstName tidak ada', () => {
    // Mock user tanpa firstName
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        id: 'user_123',
        firstName: null,
        primaryEmailAddress: {
          emailAddress: 'john@example.com',
        },
        createdAt: new Date('2023-01-01'),
      },
    })

    render(<DashboardPage />)

    // Should show fallback name (there are multiple instances)
    const fallbackMessages = screen.getAllByText(/Selamat datang, Pengguna!/)
    expect(fallbackMessages.length).toBeGreaterThan(0)
  })
})
