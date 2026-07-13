import React from 'react'
import { render } from '@testing-library/react'
import { NavbarGlass } from '../NavbarGlass'

// Mock Next.js navigation hooks
const mockUsePathname = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

// Mock next-themes hooks
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}))

// Mock Clerk hooks
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({ isSignedIn: false, user: null }),
  UserButton: () => <div data-testid="user-button">User Button</div>,
}))

// Mock role-based auth helpers
jest.mock('@/features/auth', () => ({
  useRoleNavigation: () => ({ getDashboardUrl: () => '/dashboard' }),
}))

describe('NavbarGlass Gating Regression Test', () => {
  beforeEach(() => {
    mockUsePathname.mockReset()
  })

  it('renders successfully on normal public pages', () => {
    mockUsePathname.mockReturnValue('/')
    const { container } = render(<NavbarGlass />)
    expect(container).toBeDefined()
  })

  it('renders null on workspace routes without hook violations', () => {
    mockUsePathname.mockReturnValue('/course/javascript-basics/learn')
    const { container } = render(<NavbarGlass />)
    expect(container.firstChild).toBeNull()
  })
})
