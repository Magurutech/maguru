# Maguru Testing Framework

## Pendahuluan

Dokumen ini menjelaskan framework testing yang digunakan di project Maguru, meliputi unit testing, integration testing, dan E2E testing.

## Teknologi Testing

Maguru menggunakan teknologi testing berikut:

1. **Unit Testing**: Jest + React Testing Library
2. **Integration Testing**: Jest + React Testing Library + MSW (Mock Service Worker)
3. **E2E Testing**: Playwright (untuk implementasi selanjutnya)

## Setup Testing

### Prerequisites

- Node.js v18+
- Yarn atau NPM

### Instalasi Dependensi

Semua dependensi testing sudah terinstal sebagai bagian dari package.json:

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/jest": "^30.0.0",
    "jest": "^30.0.3",
    "jest-environment-jsdom": "^30.0.2"
  }
}
```

## Struktur Testing

Pendekatan testing di Maguru menggunakan pendekatan **co-location**, di mana file test ditempatkan bersamaan dengan file implementasi:

```
/components
  /layout
    /navbar.tsx
    /navbar.test.tsx
    /footer.tsx
    /footer.test.tsx
/features
  /homepage
    /CustomCard.tsx
    /CustomCard.test.tsx
    /hero.tsx
    /hero.test.tsx
    ...
```

## Menjalankan Test

### Unit Testing

Untuk menjalankan semua unit test:

```bash
yarn test
```

Untuk menjalankan test dengan mode watch (memantau perubahan):

```bash
yarn test:watch
```

Untuk menjalankan test dengan laporan coverage:

```bash
yarn test:coverage
```

### Spesifik Component Testing

Untuk menjalankan test pada komponen layout:

```bash
yarn test:layout
```

Untuk menjalankan test pada komponen homepage:

```bash
yarn test:homepage
```

## Konvensi Testing

Berikut adalah konvensi testing yang digunakan di project Maguru:

### Penamaan Test

Format penamaan file test adalah: `[nama-file].test.tsx`

### Struktur Test

Setiap file test mengikuti struktur berikut:

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComponentName } from './component-file';

describe('ComponentName', () => {
  test('should render correctly', () => {
    // Test implementation
  });

  // More test cases...
});
```

### Matchers yang Sering Digunakan

- `toBeInTheDocument()`: Memeriksa elemen ada di DOM
- `toHaveTextContent()`: Memeriksa teks konten elemen
- `toBeVisible()`: Memeriksa elemen terlihat
- `toHaveClass()`: Memeriksa elemen memiliki class tertentu

## Coverage Report

Laporan coverage dapat diakses dengan menjalankan:

```bash
yarn test:coverage
```

Target coverage adalah:

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## Mocking

### Mocking Component

Mocking komponen Next.js dilakukan di `jest.setup.js`:

```javascript
// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      // Other router methods...
    };
  },
  // Other navigation exports...
}));
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)
