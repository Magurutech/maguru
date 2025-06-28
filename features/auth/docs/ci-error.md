Run yarn install --frozen-lockfile
yarn install v1.22.22
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
warning " > @tailwindcss/vite@4.1.10" has unmet peer dependency "vite@^5.2.0 || ^6".
warning " > eslint-config-airbnb@19.0.4" has incorrect peer dependency "eslint@^7.32.0 || ^8.2.0".
warning " > eslint-config-airbnb@19.0.4" has incorrect peer dependency "eslint-plugin-react-hooks@^4.3.0".
warning "eslint-config-airbnb > eslint-config-airbnb-base@15.0.0" has incorrect peer dependency "eslint@^7.32.0 || ^8.2.0".
warning " > eslint-plugin-tailwindcss@3.18.0" has incorrect peer dependency "tailwindcss@^3.4.0".
[4/4] Building fresh packages...
$ npm run env:validate

> maguru@0.1.0 env:validate
> tsx -e "const { validateEnvSafe } = require('./lib/env-validation.ts'); const result = validateEnvSafe(); if (!result.success) { console.error(result.error); process.exit(1); } console.log('✅ Environment validation passed');"

Environment validation failed:
NODE_ENV: NODE_ENV must be one of: development, staging, production
APP_ENV: APP_ENV must be one of: dev, prod
NEXT_PUBLIC_APP_URL: Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Required
CLERK_SECRET_KEY: Required
DATABASE_URL: Required
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.
Error: Process completed with exit code 1.