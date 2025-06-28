Run echo "=== Running TypeScript check ==="
=== Running TypeScript check ===
yarn run v1.22.22
$ tsc --noEmit
Error: app/admin/dashboard/page.test.tsx(9,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: app/creator/dashboard/page.test.tsx(9,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: app/dashboard/page.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: app/sign-in/[[...sign-in]]/page.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: app/sign-up/[[...sign-up]]/page.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/auth/components/RoleDisplay.test.tsx(15,43): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/auth/context/UserRoleContext.test.tsx(16,46): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/auth/hooks/useUserRole.test.ts(15,28): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/homepage/component/Course.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/homepage/component/Cts.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/homepage/component/CustomCard.test.tsx(2,43): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/homepage/component/Feature.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/homepage/component/Footers.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/homepage/component/Heros.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/homepage/component/Navbars.test.tsx(2,43): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/homepage/component/Stat.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
Error: features/homepage/component/Testimonial.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.
error Command failed with exit code 2.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
Error: Process completed with exit code 2.

# Debug Typescript on Failure
Run echo "=== TypeScript Debug Information ==="
=== TypeScript Debug Information ===
Node version: v20.19.2
warning Filtering by arguments is deprecated. Please use the pattern option instead.
TypeScript version: yarn list v1.22.22
Done in 0.34s.
Types installed:
yarn list v1.22.22
Done in 0.34s.
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
  "exclude": ["node_modules", "dist", "build", "coverage"]