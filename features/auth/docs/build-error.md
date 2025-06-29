Run echo "=== Running TypeScript check ==="
=== Running TypeScript check ===
yarn run v1.22.22
$ /home/runner/work/maguru/maguru/node_modules/.bin/tsc --noEmit --skipLibCheck
Error: __tests__/auth/__mocks__/auth-mocks.ts(11,28): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(12,31): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(13,28): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(19,13): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(41,18): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(49,23): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(54,26): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(62,12): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(75,14): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(79,14): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(83,17): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(87,12): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(103,3): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(110,24): error TS2304: Cannot find name 'global'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(110,41): error TS2304: Cannot find name 'global'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(113,35): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(117,26): error TS2304: Cannot find name 'global'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(117,43): error TS2304: Cannot find name 'global'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(122,18): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(131,3): error TS2304: Cannot find name 'jest'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(133,26): error TS2304: Cannot find name 'global'.
Error: __tests__/auth/__mocks__/auth-mocks.ts(133,43): error TS2304: Cannot find name 'global'.
Error: app/admin/dashboard/page.tsx(310,10): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: app/creator/dashboard/page.tsx(308,10): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: app/dashboard/page.tsx(290,10): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: app/layout.tsx(53,26): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: app/layout.tsx(54,37): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: app/layout.tsx(57,31): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: app/layout.tsx(58,39): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: app/unauthorized/page.tsx(141,10): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: features/auth/context/UserRoleContext.tsx(396,7): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: features/auth/hooks/useUserRole.ts(185,9): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: features/auth/lib/middlewareUtils.ts(238,7): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: features/auth/lib/middlewareUtils.ts(238,49): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: features/auth/lib/middlewareUtils.ts(252,9): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: features/auth/lib/roleUtils.ts(383,23): error TS2694: Namespace 'NodeJS' has no exported member 'Timeout'.
Error: lib/env-validation.ts(52,7): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(54,12): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(59,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(60,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(61,6): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(64,12): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(68,7): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(70,38): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(88,10): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(110,19): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(140,7): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(140,56): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/env-validation.ts(142,27): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: lib/prisma.ts(13,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: middleware.ts(82,9): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: next.config.ts(4,27): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: next.config.ts(4,69): error TS2304: Cannot find name 'jest'.
Error: next.config.ts(5,25): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: next.config.ts(10,33): error TS2580: Cannot find name 'require'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: next.config.ts(15,7): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: next.config.ts(65,7): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: next.config.ts(134,7): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: next.config.ts(144,1): error TS2580: Cannot find name 'module'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: scripts/test-db.ts(50,5): error TS2580: Cannot find name 'require'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: scripts/test-db.ts(50,22): error TS2580: Cannot find name 'module'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: scripts/test-db.ts(52,17): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
Error: scripts/test-db.ts(53,18): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
error Command failed with exit code 2.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
Error: Process completed with exit code 2.

#debug Typescript on failure 
Run echo "=== TypeScript Debug Information ==="
=== TypeScript Debug Information ===
Node version: v20.19.2
warning Filtering by arguments is deprecated. Please use the pattern option instead.
TypeScript version: yarn list v1.22.22
Done in 0.41s.
Types installed:
yarn list v1.22.22
Done in 0.33s.
tsconfig.json:
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": [
    "node_modules",
    "dist",
    "build",
    "coverage",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx"
  ]
}