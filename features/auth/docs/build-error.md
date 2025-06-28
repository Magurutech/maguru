Run echo "Building application..."
Building application...
yarn run v1.22.22
$ next build
⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
▲ Next.js 15.3.4

- Experiments (use with caution):
  ✓ memoryBasedWorkersCount

Creating an optimized production build ...
Failed to compile.

app/layout.tsx
An error occurred in `next/font`.

Error: Cannot find module '@tailwindcss/postcss'
Require stack:

- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/index.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/index.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack-config.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack-build/impl.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/compiled/jest-worker/processChild.js
  at Module.\_resolveFilename (node:internal/modules/cjs/loader:1212:15)
  at /home/runner/work/maguru/maguru/node_modules/next/dist/server/require-hook.js:55:36
  at Function.resolve (node:internal/modules/helpers:193:19)
  at loadPlugin (/home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:53:32)
  at /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:185:56
  at Array.map (<anonymous>)
  at getPostCssPlugins (/home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:185:47)
  at async /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/index.js:125:36

app/layout.tsx
An error occurred in `next/font`.

Error: Cannot find module '@tailwindcss/postcss'
Require stack:

- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/index.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/index.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack-config.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack-build/impl.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/compiled/jest-worker/processChild.js
  at Module.\_resolveFilename (node:internal/modules/cjs/loader:1212:15)
  at /home/runner/work/maguru/maguru/node_modules/next/dist/server/require-hook.js:55:36
  at Function.resolve (node:internal/modules/helpers:193:19)
  at loadPlugin (/home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:53:32)
  at /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:185:56
  at Array.map (<anonymous>)
  at getPostCssPlugins (/home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:185:47)
  at async /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/index.js:125:36

app/layout.tsx
An error occurred in `next/font`.

Error: Cannot find module '@tailwindcss/postcss'
Require stack:

- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/index.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/index.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack-config.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack-build/impl.js
- /home/runner/work/maguru/maguru/node_modules/next/dist/compiled/jest-worker/processChild.js
  at Module.\_resolveFilename (node:internal/modules/cjs/loader:1212:15)
  at /home/runner/work/maguru/maguru/node_modules/next/dist/server/require-hook.js:55:36
  at Function.resolve (node:internal/modules/helpers:193:19)
  at loadPlugin (/home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:53:32)
  at /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:185:56
  at Array.map (<anonymous>)
  at getPostCssPlugins (/home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/plugins.js:185:47)
  at async /home/runner/work/maguru/maguru/node_modules/next/dist/build/webpack/config/blocks/css/index.js:125:36

> Build failed because of webpack errors
> error Command failed with exit code 1.
> info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
> Error: Process completed with exit code 1.
