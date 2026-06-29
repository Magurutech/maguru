// Polyfill untuk Node.js environment - HARUS DI AWAL sebelum import lain
// Menggunakan node-fetch v2 untuk polyfill yang lebih robust
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Polyfill Web Streams API (diperlukan untuk MSW v2)
require('web-streams-polyfill/polyfill')

// Polyfill fetch API - only if not already available
// Skip node-fetch import to avoid ESM issues in Jest
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn()
}
if (typeof global.Headers === 'undefined') {
  global.Headers = jest.fn()
}
if (typeof global.Request === 'undefined') {
  global.Request = jest.fn()
}
if (typeof global.Response === 'undefined') {
  global.Response = jest.fn()
}

// Import jest-dom untuk menambahkan custom matchers seperti toBeInTheDocument()
require('@testing-library/jest-dom')

// Import React untuk mock components
const React = require('react')

// Setup environment variables untuk testing
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_testing'
process.env.CLERK_SECRET_KEY = 'sk_test_testing'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL = '/sign-in'
process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL = '/sign-up'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  writable: true,
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
})

// Mock BroadcastChannel
global.BroadcastChannel = jest.fn().mockImplementation(() => ({
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
  close: jest.fn(),
}))

// Mock atob dan btoa untuk JWT
global.atob = jest.fn()
global.btoa = jest.fn()

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})

// Mock auth hooks dari features/auth
jest.mock('@/features/auth', () => ({
  useUserRole: jest.fn(() => ({
    role: 'user',
    isLoading: false,
    error: null,
    isAdmin: false,
    isCreator: false,
    isUser: true,
  })),
  useRoleGuard: jest.fn(() => ({
    canAccessAdmin: () => false,
    canAccessCreator: () => false,
    canAccessUser: () => true,
  })),
  useRoleLoadingState: jest.fn(() => ({
    shouldShowLoader: false,
    isLoading: false,
  })),
  useRoleConditional: jest.fn(() => ({
    showForAdmin: false,
    showForCreator: false,
    showForUser: true,
  })),
  useRoleErrorHandling: jest.fn(() => ({
    hasError: false,
    error: null,
    retry: jest.fn(),
  })),
  useRoleDevelopment: jest.fn(() => ({
    switchRole: jest.fn(),
    currentMockRole: null,
  })),
  UserRoleProvider: ({ children }) => children,
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(() => ({
    user: {
      id: 'user_test123',
      firstName: 'Test',
      lastName: 'User',
      primaryEmailAddress: {
        emailAddress: 'test@example.com',
      },
      createdAt: new Date('2023-01-01'),
    },
    isLoaded: true,
    isSignedIn: true,
  })),
  useAuth: jest.fn(() => ({
    isLoaded: true,
    isSignedIn: true,
    signOut: jest.fn(),
  })),
  UserButton: () => <div data-testid="user-button">User Button</div>,
  SignIn: () => <div data-testid="sign-in">Sign In</div>,
  SignUp: () => <div data-testid="sign-up">Sign Up</div>,
}))

// Mock Clerk Server (untuk course.service.ts)
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(() => Promise.resolve({ userId: 'user_test123' })),
  clerkClient: jest.fn(() => Promise.resolve({
    users: {
      getUser: jest.fn((userId) => Promise.resolve({
        id: userId,
        publicMetadata: { role: 'USER' },
      })),
    },
  })),
}))

// Mock Lucide React icons
// Mock Lucide React icons dynamically using Proxy to prevent undefined import errors
jest.mock('lucide-react', () => {
  const React = require('react')
  return new Proxy({}, {
    get: (target, name) => {
      const Component = (props) => React.createElement('div', {
        'data-testid': `${name.toLowerCase()}-icon`,
        ...props
      })
      Component.displayName = name
      return Component
    }
  })
})

// Mock UI Components
jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, ...props }) => React.createElement('button', props, children)),
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: jest.fn(({ children, ...props }) => React.createElement('span', props, children)),
}))

jest.mock('@/components/ui/input', () => ({
  Input: jest.fn((props) => React.createElement('input', props)),
}))

jest.mock('@/components/ui/select', () => ({
  Select: jest.fn(({ children, onValueChange, value }) => {
    // Pass onValueChange down via context-like prop drilling through data attribute
    return React.createElement(
      'div',
      { 'data-value': value, 'data-testid': 'select-root' },
      React.Children.map(children, (child) =>
        child ? React.cloneElement(child, { _onValueChange: onValueChange }) : child
      )
    )
  }),
  SelectTrigger: jest.fn(({ children, 'aria-label': ariaLabel, _onValueChange, ...props }) =>
    React.createElement('button', { 'aria-label': ariaLabel, role: 'combobox', ...props }, children)
  ),
  SelectValue: jest.fn(({ placeholder }) =>
    React.createElement('span', null, placeholder)
  ),
  SelectContent: jest.fn(({ children, _onValueChange }) =>
    React.createElement(
      'div',
      { role: 'listbox' },
      React.Children.map(children, (child) =>
        child ? React.cloneElement(child, { _onValueChange }) : child
      )
    )
  ),
  SelectItem: jest.fn(({ children, value, _onValueChange, ...props }) =>
    React.createElement(
      'div',
      {
        role: 'option',
        'data-value': value,
        onClick: () => _onValueChange && _onValueChange(value),
        ...props,
      },
      children
    )
  ),
}))

// Suppress console errors during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
