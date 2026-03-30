import nextConfig from 'eslint-config-next';
import tseslint from 'typescript-eslint';

const config = [
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
      'prisma/generated/**',
      '**/*.wasm-base64.js',
      // Tiptap Simple Editor template — third-party generated code
      'components/tiptap-templates/**',
      'components/tiptap-ui/**',
      'components/tiptap-ui-primitive/**',
      'components/tiptap-node/**',
      'components/tiptap-icons/**',
      'hooks/use-composed-ref.ts',
      'hooks/use-cursor-visibility.ts',
      'hooks/use-element-rect.ts',
      'hooks/use-is-breakpoint.ts',
      'hooks/use-menu-navigation.ts',
      'hooks/use-tiptap-editor.ts',
      'hooks/use-window-size.ts',
      'hooks/use-unmount.ts',
      'lib/tiptap-utils.ts',
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

export default config;
