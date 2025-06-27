/** @type {import('next').NextConfig} */

// Import environment validation untuk memastikan konfigurasi yang benar
import { validateEnvSafe, isDevelopment } from './lib/env-validation.js'

// Validasi environment variables saat build
const envValidation = validateEnvSafe()
if (!envValidation.success) {
  console.error('❌ Environment validation failed:')
  console.error(envValidation.error)
  process.exit(1)
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
  ...(isDevelopment() && {
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
  }),
}

module.exports = nextConfig
