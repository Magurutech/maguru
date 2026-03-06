# Bundle Analysis Setup Guide

**Purpose:** Monitor dan optimize bundle size untuk performa aplikasi  
**Priority:** MEDIUM  
**Estimated Time:** 30 minutes

---

## 🎯 Why Bundle Analysis?

### Benefits
1. **Identify Large Dependencies** - Temukan library yang membengkakkan bundle
2. **Code Splitting Opportunities** - Identifikasi kandidat untuk lazy loading
3. **Duplicate Detection** - Temukan duplicate dependencies
4. **Performance Monitoring** - Track bundle size over time

### Current Status
❌ Bundle analyzer belum dikonfigurasi  
⚠️ Tidak ada visibility terhadap bundle size

---

## 📦 Installation

```bash
# Install @next/bundle-analyzer
yarn add -D @next/bundle-analyzer

# Verify installation
yarn list @next/bundle-analyzer
```

---

## ⚙️ Configuration

### Step 1: Update `next.config.ts`

```typescript
// next.config.ts
import type { NextConfig } from 'next'

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

// Skip validation untuk testing dan CI environment
const isTestEnvironment = process.env.NODE_ENV === 'test' || typeof jest !== 'undefined'
const isCIEnvironment = process.env.CI === 'true'

if (!isTestEnvironment && !isCIEnvironment) {
  try {
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
} else {
  console.log('ℹ️ Environment validation skipped for CI/Test environment')
}

const nextConfig: NextConfig = {
  // ... existing configuration
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
        hostname: 'fxtkilqjzsncefjpfnlb.supabase.co',
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
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  reactStrictMode: true,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
    styledComponents: true,
  },

  experimental: {
    optimizePackageImports: ['@radix-ui/react-slot', 'lucide-react', 'clsx', 'tailwind-merge'],
    ...(!isCIEnvironment && {
      memoryBasedWorkersCount: true,
    }),
  },

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

  redirects: async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
  ],

  output: 'standalone',

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  ...(process.env.NODE_ENV === 'development' &&
    !isCIEnvironment && {
      logging: {
        fetches: {
          fullUrl: true,
        },
      },
    }),
}

// Wrap config with bundle analyzer
export default withBundleAnalyzer(nextConfig)
```

### Step 2: Verify Script Exists

Check `package.json`:
```json
{
  "scripts": {
    "build:analyze": "ANALYZE=true next build"
  }
}
```

✅ Script sudah ada di package.json

---

## 🚀 Usage

### Run Bundle Analysis

```bash
# Build with analysis
yarn build:analyze

# Or with environment variable
ANALYZE=true yarn build
```

### What Happens?
1. Next.js builds the application
2. Bundle analyzer generates visualization
3. Browser opens automatically with interactive treemap
4. Two HTML reports generated:
   - `.next/analyze/client.html` - Client bundle
   - `.next/analyze/server.html` - Server bundle

---

## 📊 Reading the Report

### Treemap Visualization
- **Box Size** = File size
- **Color** = Module type
- **Nested Boxes** = Dependencies

### Key Metrics to Monitor

#### 1. Total Bundle Size
```
Target: < 200KB (gzipped)
Current: TBD after first analysis
```

#### 2. Largest Dependencies
Look for:
- Unused dependencies
- Duplicate packages
- Heavy libraries that can be replaced

#### 3. Code Splitting Opportunities
Identify:
- Large route bundles
- Shared chunks
- Vendor bundles

---

## 🎯 Optimization Strategies

### 1. Dynamic Imports
```typescript
// Before: Static import
import HeavyComponent from './HeavyComponent'

// After: Dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false, // Optional: disable SSR for client-only components
})
```

### 2. Tree Shaking
```typescript
// ❌ Bad: Imports entire library
import _ from 'lodash'

// ✅ Good: Import specific functions
import debounce from 'lodash/debounce'
```

### 3. Package Optimization
```typescript
// Already configured in next.config.ts
experimental: {
  optimizePackageImports: [
    '@radix-ui/react-slot',
    'lucide-react',
    'clsx',
    'tailwind-merge'
  ],
}
```

### 4. Replace Heavy Dependencies

Example candidates:
```bash
# moment.js (heavy) → date-fns (lighter)
# lodash (full) → lodash-es (tree-shakeable)
# axios → native fetch
```

---

## 📈 Monitoring & Tracking

### Setup Bundle Size Tracking

#### Option 1: GitHub Actions
```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check

on:
  pull_request:
    branches: [main, develop]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: yarn install
      - run: ANALYZE=true yarn build
      - uses: actions/upload-artifact@v3
        with:
          name: bundle-analysis
          path: .next/analyze/
```

#### Option 2: Bundle Size Bot
```bash
# Install bundlesize
yarn add -D bundlesize

# Add to package.json
{
  "bundlesize": [
    {
      "path": ".next/static/chunks/*.js",
      "maxSize": "200 kB"
    }
  ]
}
```

---

## 🎯 Target Metrics

### Bundle Size Targets
```
First Load JS:
- Homepage: < 100KB
- Course Page: < 150KB
- Admin Dashboard: < 200KB

Shared Chunks:
- framework: < 50KB
- commons: < 100KB
- main: < 50KB
```

### Performance Budget
```json
{
  "budgets": [
    {
      "path": "/_app",
      "maxSize": "200kb"
    },
    {
      "path": "/course/*",
      "maxSize": "150kb"
    }
  ]
}
```

---

## ✅ Success Criteria

- [ ] Bundle analyzer installed
- [ ] Configuration updated
- [ ] First analysis completed
- [ ] Baseline metrics documented
- [ ] Optimization opportunities identified
- [ ] Action plan created

---

## 📝 Next Steps

### Immediate
1. Install bundle analyzer
2. Run first analysis
3. Document baseline metrics

### Short Term
4. Identify top 5 largest dependencies
5. Create optimization tickets
6. Implement dynamic imports for heavy components

### Long Term
7. Setup automated bundle size tracking
8. Add bundle size checks to CI/CD
9. Monitor bundle size trends

---

## 🔗 Resources

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Next.js Optimization Guide](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Bundle Phobia](https://bundlephobia.com/) - Check package sizes

---

**Created by:** Kiro AI Assistant  
**Last Updated:** 7 Maret 2026
