import nextConfig from 'eslint-config-next';
import tseslint from 'typescript-eslint';

export default [
  // Global ignores - harus di awal
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '.turbo/**',
      'out/**',
      'coverage/**',
      '.swc/**',
      'tsconfig.tsbuildinfo',
    ],
  },

  // Next.js config (sudah include react, typescript, jsx-a11y, dll)
  ...nextConfig,

  // Custom rules untuk TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
