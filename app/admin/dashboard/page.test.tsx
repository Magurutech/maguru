/**
 * Admin Dashboard Page Tests
 *
 * Test untuk memastikan admin dashboard berfungsi dengan benar
 * dengan proper role checking dan admin-specific features.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminDashboardPage from './page'

// Mock semua dependencies dengan implementasi sederhana
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}))

jest.mock('@/features/auth', () => ({
  useUserRole: jest.fn(),
  useRoleGuard: jest.fn(),
  useRoleLoadingState: jest.fn(),
}))

jest.mock('next/link', () => {
  return function MockLink({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>
  }
})

describe('AdminDashboardPage', () => {
  const mockUseUser = jest.fn()
  const mockUseUserRole = jest.fn()
  const mockUseRoleGuard = jest.fn()
  const mockUseRoleLoadingState = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state when user is not loaded', () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: false,
    })
    mockUseUserRole.mockReturnValue({
      role: null,
      isAdmin: false,
    })
    mockUseRoleGuard.mockReturnValue({
      canAccessAdmin: () => false,
    })
    mockUseRoleLoadingState.mockReturnValue({
      shouldShowLoader: true,
    })

    render(<AdminDashboardPage />)

    // Should show loading animation
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('should render access denied for non-admin users', () => {
    mockUseUser.mockReturnValue({
      user: { firstName: 'John' },
      isLoaded: true,
    })
    mockUseUserRole.mockReturnValue({
      role: 'user',
      isAdmin: false,
    })
    mockUseRoleGuard.mockReturnValue({
      canAccessAdmin: () => false,
    })
    mockUseRoleLoadingState.mockReturnValue({
      shouldShowLoader: false,
    })

    render(<AdminDashboardPage />)

    expect(screen.getByText('Akses Ditolak')).toBeInTheDocument()
    expect(screen.getByText('Anda tidak memiliki izin administrator.')).toBeInTheDocument()
  })

  it('should render admin dashboard for admin users', () => {
    mockUseUser.mockReturnValue({
      user: { firstName: 'Admin' },
      isLoaded: true,
    })
    mockUseUserRole.mockReturnValue({
      role: 'admin',
      isAdmin: true,
    })
    mockUseRoleGuard.mockReturnValue({
      canAccessAdmin: () => true,
    })
    mockUseRoleLoadingState.mockReturnValue({
      shouldShowLoader: false,
    })

    render(<AdminDashboardPage />)

    expect(screen.getByText('Admin Control Panel')).toBeInTheDocument()
    expect(screen.getByText(/Selamat datang, Admin!/)).toBeInTheDocument()
  })

  it('should display admin stats correctly', () => {
    mockUseUser.mockReturnValue({
      user: { firstName: 'Admin' },
      isLoaded: true,
    })
    mockUseUserRole.mockReturnValue({
      role: 'admin',
      isAdmin: true,
    })
    mockUseRoleGuard.mockReturnValue({
      canAccessAdmin: () => true,
    })
    mockUseRoleLoadingState.mockReturnValue({
      shouldShowLoader: false,
    })

    render(<AdminDashboardPage />)

    // Check for stats display
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('2,486')).toBeInTheDocument()
    expect(screen.getByText('Total Courses')).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
  })

  it('should display system alerts', () => {
    mockUseUser.mockReturnValue({
      user: { firstName: 'Admin' },
      isLoaded: true,
    })
    mockUseUserRole.mockReturnValue({
      role: 'admin',
      isAdmin: true,
    })
    mockUseRoleGuard.mockReturnValue({
      canAccessAdmin: () => true,
    })
    mockUseRoleLoadingState.mockReturnValue({
      shouldShowLoader: false,
    })

    render(<AdminDashboardPage />)

    expect(screen.getByText('System Alerts')).toBeInTheDocument()
    expect(screen.getByText('High Storage Usage')).toBeInTheDocument()
    expect(screen.getByText('Pending Reviews')).toBeInTheDocument()
  })

  it('should display recent activities', () => {
    mockUseUser.mockReturnValue({
      user: { firstName: 'Admin' },
      isLoaded: true,
    })
    mockUseUserRole.mockReturnValue({
      role: 'admin',
      isAdmin: true,
    })
    mockUseRoleGuard.mockReturnValue({
      canAccessAdmin: () => true,
    })
    mockUseRoleLoadingState.mockReturnValue({
      shouldShowLoader: false,
    })

    render(<AdminDashboardPage />)

    expect(screen.getByText('Recent Activities')).toBeInTheDocument()
    expect(screen.getByText('15 pengguna baru mendaftar')).toBeInTheDocument()
  })

  it('should display development info in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    mockUseUser.mockReturnValue({
      user: { firstName: 'Admin' },
      isLoaded: true,
    })
    mockUseUserRole.mockReturnValue({
      role: 'admin',
      isAdmin: true,
    })
    mockUseRoleGuard.mockReturnValue({
      canAccessAdmin: () => true,
    })
    mockUseRoleLoadingState.mockReturnValue({
      shouldShowLoader: false,
    })

    render(<AdminDashboardPage />)

    expect(screen.getByText('🔧 Development Info')).toBeInTheDocument()
    expect(screen.getByText('Route:')).toBeInTheDocument()
    expect(screen.getByText('/admin/dashboard')).toBeInTheDocument()

    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })
})
