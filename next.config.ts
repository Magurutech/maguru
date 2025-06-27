/** @type {import('next').NextConfig} */

// Skip validation untuk testing environment
const isTestEnvironment = process.env.NODE_ENV === 'test' || typeof jest !== 'undefined'

if (!isTestEnvironment) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { validateEnvSafe } = require('./lib/env-validation.ts')
    const validation = validateEnvSafe()
    if (!validation.success) {
      console.error('❌ Environment validation failed:')
      console.error(validation.error)
      process.exit(1)
    }
  } catch (error) {
    console.warn(
      '⚠️ Environment validation skipped:',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}

const nextConfig = {
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'another-domain.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Modern image optimization
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Development optimizations
  reactStrictMode: true,
  swcMinify: true,

  // Compiler configuration
  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,

    // Styled components support (if needed)
    styledComponents: true,
  },

  // Experimental features
  experimental: {
    // Enable modern bundling
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },

    // Performance optimizations
    optimizePackageImports: ['@radix-ui/react-slot', 'lucide-react', 'clsx', 'tailwind-merge'],

    // Memory usage optimization
    memoryBasedWorkersCount: true,
  },

  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],

  // Redirect configuration
  redirects: async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
  ],

  // Environment variables untuk client-side
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Output configuration
  output: 'standalone',

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Performance logging (development only)
  ...(process.env.NODE_ENV === 'development' && {
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
  }),
}

module.exports = nextConfig
