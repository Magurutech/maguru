Run echo "=== Running TypeScript check ==="
=== Running TypeScript check ===
yarn run v1.22.22
$ tsc --noEmit
error TS2688: Cannot find type definition file for '@testing-library/jest-dom'.
The file is in the program because:
Entry point of type library '@testing-library/jest-dom' specified in compilerOptions
error TS2688: Cannot find type definition file for 'jest'.
The file is in the program because:
Entry point of type library 'jest' specified in compilerOptions
error TS2688: Cannot find type definition file for 'node'.
The file is in the program because:
Entry point of type library 'node' specified in compilerOptions
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
"types": ["node", "jest", "@testing-library/jest-dom"],
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
"@/_": ["./_"]
}
},
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
"exclude": ["node_modules", "dist", "build", "coverage"]
}
