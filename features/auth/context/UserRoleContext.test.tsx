/**
 * Unit Tests untuk UserRoleContext.tsx
 *
 * Testing React Context Provider dengan Supabase Auth:
 * - UserRoleProvider component
 * - Role state resolution
 * - onAuthStateChange subscription
 * - useUserRoleContext hook
 */

import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { UserRoleProvider, useUserRoleContext, DEFAULT_ROLE } from './UserRoleContext'

// Mock Supabase client
const mockGetUser = jest.fn()
const mockUnsubscribe = jest.fn()
const mockOnAuthStateChange = jest.fn((callback) => {
  return {
    data: {
      subscription: {
        unsubscribe: mockUnsubscribe,
      },
    },
  }
})

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
    },
  })),
}))

// Test consumer component
function TestConsumer() {
  const { role, isLoading, error, setRole, clearRole, refreshRole } = useUserRoleContext()

  return (
    <div>
      <span data-testid="role">{role ?? 'none'}</span>
      <span data-testid="loading">{isLoading ? 'loading' : 'ready'}</span>
      <span data-testid="error">{error ?? 'no-error'}</span>
      <button onClick={() => setRole('admin')}>Set Admin</button>
      <button onClick={() => clearRole()}>Clear</button>
      <button onClick={() => refreshRole()}>Refresh</button>
    </div>
  )
}

describe('UserRoleContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          app_metadata: { role: 'creator' },
          user_metadata: {},
        },
      },
      error: null,
    })
  })

  it('provides resolved user role from Supabase auth', async () => {
    render(
      <UserRoleProvider>
        <TestConsumer />
      </UserRoleProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('ready')
      expect(screen.getByTestId('role').textContent).toBe('creator')
    })
  })

  it('falls back to DEFAULT_ROLE if user has no explicit role metadata', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'test-user-id',
          app_metadata: {},
          user_metadata: {},
        },
      },
      error: null,
    })

    render(
      <UserRoleProvider>
        <TestConsumer />
      </UserRoleProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('role').textContent).toBe(DEFAULT_ROLE)
    })
  })

  it('clears role when user is not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: new Error('Not authenticated'),
    })

    render(
      <UserRoleProvider>
        <TestConsumer />
      </UserRoleProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('role').textContent).toBe('none')
    })
  })

  it('allows updating role manually via setRole and clearRole', async () => {
    render(
      <UserRoleProvider>
        <TestConsumer />
      </UserRoleProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('role').textContent).toBe('creator')
    })

    act(() => {
      screen.getByText('Set Admin').click()
    })

    expect(screen.getByTestId('role').textContent).toBe('admin')

    act(() => {
      screen.getByText('Clear').click()
    })

    expect(screen.getByTestId('role').textContent).toBe('none')
  })

  it('subscribes to onAuthStateChange and unsubscribes on unmount', () => {
    const { unmount } = render(
      <UserRoleProvider>
        <TestConsumer />
      </UserRoleProvider>
    )

    expect(mockOnAuthStateChange).toHaveBeenCalled()

    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('throws error when useUserRoleContext is used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestConsumer />)).toThrow(
      'useUserRoleContext must be used within a UserRoleProvider'
    )

    spy.mockRestore()
  })
})
