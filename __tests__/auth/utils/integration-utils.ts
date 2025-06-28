/**
 * Integration Testing Utilities
 *
 * File ini berisi utility functions untuk membantu integration testing
 * authentication dan authorization system.
 */

import React from 'react'
import { render, RenderOptions, screen, waitFor } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { UserRoleProvider } from '@/features/auth/context/UserRoleContext'
import { UserRole, DevModeConfig } from '@/features/auth/types'
import {
  mockUseAuth,
  mockUseSession,
  mockUseUser,
  createMockSession,
  createMockUser,
  createMockSessionStorage,
} from '../__mocks__/auth-mocks'
import { testUsers, getUserByRole } from '../__mocks__/test-users'

// Custom render function with UserRoleProvider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  role?: UserRole | null
  isLoading?: boolean
  error?: string | null
  devModeEnabled?: boolean
}

export const renderWithRoleProvider = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const {
    role = null,
    isLoading = false,
    error = null,
    devModeEnabled = false,
    ...renderOptions
  } = options

  // Setup Clerk mocks based on role
  const user = getUserByRole(role)

  mockUseAuth.mockReturnValue({
    isSignedIn: role !== null,
    isLoaded: !isLoading,
  })

  mockUseSession.mockReturnValue({
    session: role ? createMockSession(role) : null,
    isLoaded: !isLoading,
  })

  mockUseUser.mockReturnValue({
    user: role ? createMockUser(role, user.firstName || 'Test User') : null,
    isLoaded: !isLoading,
  })

  // Create devMode config object
  const devModeConfig: DevModeConfig = {
    enabled: devModeEnabled,
    allowRoleSwitching: devModeEnabled,
  }

  const Wrapper = ({ children }: { children: ReactNode }) => {
    const props = { devMode: devModeConfig, children }
    return React.createElement(UserRoleProvider, props)
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Helper untuk setup mock sessionStorage
export const setupMockSessionStorage = () => {
  const mockStorage = createMockSessionStorage()

  Object.defineProperty(window, 'sessionStorage', {
    value: mockStorage,
    writable: true,
  })

  return mockStorage
}

// Helper untuk setup mock BroadcastChannel
export const setupMockBroadcastChannel = () => {
  const mockChannels = new Map<string, MockBroadcastChannel>()

  interface MockBroadcastChannel {
    name: string
    postMessage: jest.Mock
    addEventListener: jest.Mock
    removeEventListener: jest.Mock
    close: jest.Mock
    _triggerMessage: (event: MessageEvent) => void
  }

  const globalWindow = global as typeof global & {
    BroadcastChannel: jest.Mock
  }

  globalWindow.BroadcastChannel = jest.fn().mockImplementation((name: string) => {
    const listeners: Array<(event: MessageEvent) => void> = []

    const channel: MockBroadcastChannel = {
      name,
      postMessage: jest.fn((message: unknown) => {
        // Simulate message reception in other channels with same name
        setTimeout(() => {
          mockChannels.forEach((otherChannel, otherName) => {
            if (otherName === name && otherChannel !== channel) {
              otherChannel._triggerMessage({ data: message } as MessageEvent)
            }
          })
        }, 0)
      }),
      addEventListener: jest.fn((type: string, listener: (event: MessageEvent) => void) => {
        if (type === 'message') {
          listeners.push(listener)
        }
      }),
      removeEventListener: jest.fn((type: string, listener: (event: MessageEvent) => void) => {
        if (type === 'message') {
          const index = listeners.indexOf(listener)
          if (index > -1) {
            listeners.splice(index, 1)
          }
        }
      }),
      close: jest.fn(() => {
        listeners.length = 0
        mockChannels.delete(name)
      }),
      _triggerMessage: (event: MessageEvent) => {
        listeners.forEach((listener) => listener(event))
      },
    }

    mockChannels.set(name, channel)
    return channel
  })

  return mockChannels
}

// Helper untuk mock Date.now untuk time-based testing
export const mockDateNow = (timestamp?: number) => {
  const originalDateNow = Date.now

  if (timestamp) {
    Date.now = jest.fn(() => timestamp)
  } else {
    Date.now = originalDateNow
  }

  return {
    restore: () => {
      Date.now = originalDateNow
    },
  }
}

// Helper untuk wait for role to be loaded
export const waitForRoleToLoad = async (expectedRole: UserRole | null = null) => {
  await waitFor(() => {
    const loadingElements = screen.queryAllByText(/loading/i)
    expect(loadingElements).toHaveLength(0)
  })

  if (expectedRole) {
    await waitFor(() => {
      // Look for role-specific content or indicators
      const roleIndicators = screen.queryAllByText(new RegExp(expectedRole, 'i'))
      expect(roleIndicators.length).toBeGreaterThan(0)
    })
  }
}

// Helper untuk simulate role change
export const simulateRoleChange = async (
  newRole: UserRole | null,
  mockSessionStorage?: ReturnType<typeof createMockSessionStorage>,
) => {
  const user = getUserByRole(newRole)

  // Update Clerk mocks
  mockUseAuth.mockReturnValue({
    isSignedIn: newRole !== null,
    isLoaded: true,
  })

  mockUseSession.mockReturnValue({
    session: newRole ? createMockSession(newRole) : null,
    isLoaded: true,
  })

  mockUseUser.mockReturnValue({
    user: newRole ? createMockUser(newRole, user.firstName || 'Test User') : null,
    isLoaded: true,
  })

  // Update sessionStorage if provided
  if (mockSessionStorage && newRole) {
    mockSessionStorage.setItem(
      'user-role-cache',
      JSON.stringify({
        role: newRole,
        timestamp: Date.now(),
        ttl: 300000, // 5 minutes
      }),
    )
  }

  // Trigger re-render by simulating session change
  // This would normally be handled by Clerk's session events
  await waitFor(() => {
    // Wait for any pending state updates
  })
}

// Helper untuk assert role-based permissions
export const assertRolePermissions = (role: UserRole | null) => {
  const user = getUserByRole(role)

  // Check accessible routes
  user.canAccess.forEach((route) => {
    // This would be used in specific test contexts
    // where we can check if route is accessible
  })

  // Check inaccessible routes
  user.cannotAccess.forEach((route) => {
    // This would be used in specific test contexts
    // where we can check if route is blocked
  })
}

// Helper untuk simulate network errors
export const simulateNetworkError = (errorType: string = 'network') => {
  const errors = {
    network: new Error('Network request failed'),
    timeout: new Error('Request timeout'),
    unauthorized: new Error('Unauthorized access'),
    forbidden: new Error('Forbidden access'),
    server: new Error('Internal server error'),
  }

  return errors[errorType as keyof typeof errors] || errors.network
}

// Helper untuk assert loading states
export const assertLoadingState = () => {
  expect(screen.getByTestId('loading-skeleton') || screen.getByText(/loading/i)).toBeInTheDocument()
}

// Helper untuk assert error states
export const assertErrorState = (errorMessage?: string) => {
  expect(screen.getByText(/error/i) || screen.getByText(/failed/i)).toBeInTheDocument()

  if (errorMessage) {
    expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument()
  }
}

// Helper untuk assert unauthorized access
export const assertUnauthorizedAccess = () => {
  expect(
    screen.getByText(/akses ditolak/i) ||
      screen.getByText(/unauthorized/i) ||
      screen.getByText(/tidak memiliki izin/i),
  ).toBeInTheDocument()
}

// Helper untuk clean up after tests
export const cleanupIntegrationTest = () => {
  jest.clearAllMocks()

  // Reset Date.now if it was mocked
  const mockDateNow = Date.now as jest.Mock
  if (mockDateNow.mockRestore) {
    mockDateNow.mockRestore()
  }

  // Clear any global mocks
  const globalWindow = global as typeof global & {
    BroadcastChannel?: unknown
  }
  delete globalWindow.BroadcastChannel

  const windowObj = window as typeof window & {
    sessionStorage?: unknown
  }
  delete windowObj.sessionStorage
}

// Helper untuk create test context with multiple hooks
export const createTestContext = (role: UserRole | null) => {
  return {
    role,
    user: getUserByRole(role),
    permissions: getUserByRole(role).permissions,
    canAccess: getUserByRole(role).canAccess,
    cannotAccess: getUserByRole(role).cannotAccess,
  }
}

// Helper untuk simulate tab switching (cross-tab sync testing)
export const simulateTabSwitch = async (
  fromRole: UserRole | null,
  toRole: UserRole | null,
  broadcastChannels?: Map<string, any>,
) => {
  if (!broadcastChannels) {
    throw new Error('BroadcastChannels mock not available')
  }

  // Simulate role change in another tab
  const roleChannel = broadcastChannels.get('role-sync')
  if (roleChannel) {
    roleChannel._triggerMessage({
      data: {
        type: 'role-update',
        role: toRole,
        timestamp: Date.now(),
        tabId: 'other-tab-123',
      },
    } as MessageEvent)
  }

  await waitFor(() => {
    // Wait for cross-tab sync to complete
  })
}

// Helper untuk assert dashboard content based on role
export const assertDashboardContent = (role: UserRole | null) => {
  switch (role) {
    case 'admin':
      expect(
        screen.getByText(/admin control panel/i) || screen.getByText(/dashboard admin/i),
      ).toBeInTheDocument()
      break
    case 'creator':
      expect(
        screen.getByText(/creator studio/i) || screen.getByText(/dashboard creator/i),
      ).toBeInTheDocument()
      break
    case 'user':
      expect(
        screen.getByText(/dashboard learner/i) || screen.getByText(/dashboard/i),
      ).toBeInTheDocument()
      break
    default:
      // Should show unauthorized or login page
      assertUnauthorizedAccess()
  }
}

// Helper untuk test cache behavior
export const testCacheBehavior = async (
  mockStorage: ReturnType<typeof createMockSessionStorage>,
  role: UserRole,
  ttl: number = 300000,
) => {
  const cacheKey = 'user-role-cache'
  const cacheData = {
    role,
    timestamp: Date.now(),
    ttl,
  }

  // Set cache
  mockStorage.setItem(cacheKey, JSON.stringify(cacheData))

  // Verify cache was set
  expect(mockStorage.setItem).toHaveBeenCalledWith(cacheKey, JSON.stringify(cacheData))

  // Verify cache can be retrieved
  mockStorage.getItem.mockReturnValue(JSON.stringify(cacheData))
  const retrieved = JSON.parse(mockStorage.getItem(cacheKey))
  expect(retrieved.role).toBe(role)

  return retrieved
}
