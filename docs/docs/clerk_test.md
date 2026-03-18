# Testing with Playwright

[Playwright](https://playwright.dev) is an open-source, end-to-end testing framework that automates web application testing across multiple browsers. This guide will help you set up your environment for creating authenticated tests with Clerk, assuming you have some familiarity with both Clerk and Playwright.

> See the [demo repo](https://github.com/clerk/clerk-playwright-nextjs) that demonstrates testing a Clerk-powered application using [Testing Tokens](https://clerk.com/docs/guides/development/testing/overview.md#testing-tokens). To run the tests, you'll need dev instance Clerk API keys, a test user with username and password, and have username and password authentication enabled in the Clerk Dashboard.

1. ## Install `@clerk/testing`

   Clerk's testing package provides integration helpers for popular testing frameworks. Run the following command to install it:

   **npm**

   ```sh {{ filename: 'terminal' }}
   npm i @clerk/testing --save-dev
   ```

   **yarn**

   ```sh {{ filename: 'terminal' }}
   yarn add -D @clerk/testing
   ```

   **pnpm**

   ```sh {{ filename: 'terminal' }}
   pnpm add @clerk/testing -D
   ```
2. ## Set your API keys

   In your test runner, set your Publishable Key and Secret Key as the `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` environment variables, respectively.

   > Ensure that the Secret Key is provided securely to prevent exposure to third parties. For example, if you are using GitHub Actions, refer to [_Using secrets in GitHub Actions_](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).
3. ## Configure Playwright with Clerk

   The `clerkSetup()` function obtains a Testing Token when your test suite starts, making it available for all subsequent tests to use. This ensures that you don't have to manually generate a Testing Token for each test.

   To configure Playwright with Clerk, call the `clerkSetup()` function in your [global setup file](https://playwright.dev/docs/test-global-setup-teardown), as shown in the following example:

   ```tsx {{ filename: 'global.setup.ts' }}
   import { clerkSetup } from '@clerk/testing/playwright'
   import { test as setup } from '@playwright/test'

   // Setup must be run serially, this is necessary if Playwright is configured to run fully parallel: https://playwright.dev/docs/test-parallel
   setup.describe.configure({ mode: 'serial' })

   setup('global setup', async ({}) => {
     await clerkSetup()
   })
   ```

   > Instead of calling `clerkSetup()`, you can manually set the Testing Token by setting the `CLERK_TESTING_TOKEN` environment variable to the [Testing Token](https://clerk.com/docs/guides/development/testing/overview.md#testing-tokens) that you create through the Backend API.
4. ## Use `setupClerkTestingToken()`

   Now that Playwright is configured with Clerk, you can use the `setupClerkTestingToken()` function to include the Testing Token in individual test cases. This function injects the Testing Token for the specific test, ensuring the test can bypass Clerk's bot detection mechanisms. See the following example:

   ```tsx {{ filename: 'my-test.spec.ts' }}
   import { setupClerkTestingToken } from '@clerk/testing/playwright'
   import { test } from '@playwright/test'

   test('sign up', async ({ page }) => {
     await setupClerkTestingToken({ page })

     await page.goto('/sign-up')
     // Add additional test logic here
   })
   ```


# Test helpers

The `@clerk/testing` package also provides some helper functions to sign in/sign out with Clerk in your Playwright tests without having to interact with the UI.
To use these commands, import the `clerk` object from the `@clerk/testing/playwright` package.

### `clerk.signIn()`

The `clerk.signIn()` function is used to sign in a user using Clerk. This helper only supports the following first factor strategies: password, phone code, and email code. Multi-factor authentication is not supported.

Before calling `clerk.signIn()`, it is required to call `page.goto()` and navigate to an unprotected page that loads Clerk. For example, the index (`/`) page.

> `clerk.signIn()` internally uses the `setupClerkTestingToken()` helper, so you don't need to call it separately.

#### Parameters

`clerk.signIn()` accepts an object with the following properties:

| Name                           | Type                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| page                           | Page                          | The Playwright Page object to use for the sign-in operation.                                                                                                                                                                                                                                                                                                                                                                               |
| emailAddress?                  | string                        | The email address of the user to sign in. This is an alternative to using the signInParams parameter. A Secret KeyYour Clerk Secret Key is used to authenticate requests from your backend to Clerk's API. You can find it on the API keys page in the Clerk Dashboard. Do not expose this on the frontend with a public environment variable. is required to be set in the CLERK\_SECRET\_KEY environment variable to use this parameter. |
| signInParams                   | ClerkSignInParams             | The parameters to use for the sign-in operation. See ClerkSignInParams.                                                                                                                                                                                                                                                                                                                                                                    |
| setupClerkTestingTokenOptions? | SetupClerkTestingTokenOptions | Options to pass to setupClerkTestingToken(). See SetupClerkTestingTokenOptions.                                                                                                                                                                                                                                                                                                                                                            |

#### `ClerkSignInParams`

The `ClerkSignInParams` type is used to define the object that is passed to the `signInParams` parameter of the `clerk.signIn()` function. It has the following properties:

| Name                                                                                    | Type                                                                                                                                                    | Description                                                                      |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| password: The command will sign in the user using the provided password and identifier. | phone\_code: You must have a user with a test phone number as an identifier (e.g., +15555550100). Currently only supported in development environments. |                                                                                  |
| identifier                                                                              | string                                                                                                                                                  | The user's identifier. This could be a username, a phone number, or an email.    |
| password                                                                                | string                                                                                                                                                  | The user's password. This is required only if the strategy is set to 'password'. |

#### `SetupClerkTestingTokenOptions`

The `SetupClerkTestingTokenOptions` type is used to define the object that is passed to the `setupClerkTestingTokenOptions` parameter of the `clerk.signIn()` function. It has the following properties:

| Name            | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| frontendApiUrl? | string | The Frontend API URLYour Clerk Frontend API URL, or FAPI URL, is the URL of your Clerk app's dedicated Frontend API instance. You can find it on the API keys page in the Clerk Dashboard. for your Clerk dev instance, without the protocol. If provided, it overrides the Frontend API URL parsed from the Publishable KeyYour Clerk Publishable Key tells your app what your FAPI URL is, enabling your app to locate and communicate with your dedicated FAPI instance. You can find it on the API keys page in the Clerk Dashboard.. |

#### Example

The following example demonstrates how to use `clerk.signIn()` in a test to sign in a user.

```ts {{ filename: 'e2e/app.spec.ts' }}
import { clerk } from '@clerk/testing/playwright'

test('sign in', async ({ page }) => {
  // Navigate to an unprotected page that loads Clerk
  await page.goto('/')

  await clerk.signIn({
    page,
    signInParams: { strategy: 'phone_code', identifier: '+15555550100' },
  })

  // Navigate to a protected page
  await page.goto('/protected')
})
```

If you would prefer to sign a user in directly by email address, you can use the `emailAddress` parameter instead of the `signInParams` parameter.

```ts {{ filename: 'e2e/app.spec.ts' }}
import { clerk } from '@clerk/testing/playwright'

test('sign in', async ({ page }) => {
  // Navigate to an unprotected page that loads Clerk
  await page.goto('/')

  await clerk.signIn({
    page,
    emailAddress: process.env.TEST_USER_EMAIL,
  })

  await page.goto('/protected')
})
```

### `clerk.signOut()`

`clerk.signOut()` is used to sign out the current user using Clerk.

Before calling `clerk.signOut()`, it is required to call `page.goto()` and navigate to an unprotected page that loads Clerk. For example, the index (`/`) page.

#### Parameters

`clerk.signOut()` accepts an object with the following properties:

| Name            | Type           | Description                                                  |
| --------------- | -------------- | ------------------------------------------------------------ |
| page            | Page           | The Playwright Page object to use for the sign-in operation. |
| signOutOptions? | SignOutOptions | Options to pass to clerk.signOut(). See SignOutOptions.      |

#### `SignOutOptions`

The `SignOutOptions` type is used to define the object that is passed to the `signOutOptions` parameter of the `clerk.signOut()` function. It has the following properties:

| Name         | Type   | Description                                                                         |
| ------------ | ------ | ----------------------------------------------------------------------------------- |
| sessionId?   | string | The ID of a specific session to sign out of. Useful for multi-session applications. |
| redirectUrl? | string | The full URL or path to navigate after sign-out is complete.                        |

#### Example

The following example demonstrates how to use `clerk.signOut()` in a test to sign out a user.

```ts {{ filename: 'e2e/app.spec.ts' }}
import { clerk } from '@clerk/testing/playwright'

test('sign out', async ({ page }) => {
  // Navigate to an unprotected page that loads Clerk
  await page.goto('/')

  await clerk.signIn({
    page,
    signInParams: { strategy: 'phone_code', identifier: '+15555550100' },
  })

  await page.goto('/protected')
  await clerk.signOut({ page })
  await page.goto('/protected')
  // should redirect to sign in page
})
```

### `clerk.loaded()`

`clerk.loaded()` asserts that Clerk has been loaded.

Before calling `clerk.loaded()`, it is required to call `page.goto()` and navigate to an unprotected page that loads Clerk. For example, the index (`/`) page.

#### Parameters

`clerk.loaded()` accepts an object with the following properties:

| Name | Type | Description                                                  |
| ---- | ---- | ------------------------------------------------------------ |
| page | Page | The Playwright Page object to use for the sign-in operation. |

#### Example

The following example demonstrates how to use `clerk.loaded()` in a test to assert that Clerk has been loaded.

```ts {{ filename: 'e2e/app.spec.ts' }}
import { clerk } from '@clerk/testing/playwright'

test('ensure that clerk has loaded', async ({ page }) => {
  // Navigate to an unprotected page that loads Clerk
  await page.goto('/')

  await clerk.loaded({ page })
  // clerk has loaded
})
```


# Test authenticated flows

Playwright executes tests in isolated environments called browser contexts. Because each test case runs in a new browser context, the user session is not shared between test cases by default. However, tests can load existing authenticated state.

This guide demonstrates how to save the auth state globally and load it in your test cases, eliminating the need to authenticate in every test and speeding up test execution. Visit the [Playwright docs about authentication](https://playwright.dev/docs/auth) for more information.

> See the [demo repo](https://github.com/clerk/clerk-playwright-nextjs) that demonstrates testing a Clerk-powered application using [Testing Tokens](https://clerk.com/docs/guides/development/testing/overview.md#testing-tokens). To run the tests, you'll need dev instance Clerk API keys, a test user with username and password, and have username and password authentication enabled in the Clerk Dashboard.

1. ## Create a storage directory

   Create a `playwright/.clerk` directory and add it to your `.gitignore`. Once the auth state is generated, it will be stored to a file in this directory. Later on, tests will reuse this state and start already authenticated.

   ```sh {{ filename: 'terminal' }}
   mkdir -p playwright/.clerk
   echo $'\nplaywright/.clerk' >> .gitignore
   ```
2. ## Prepare auth state for your tests

   Authenticate and save the auth state in your [global setup file](https://playwright.dev/docs/test-global-setup-teardown).

   This file:

   - Is executed before all projects.
   - Calls [`clerkSetup()`](https://clerk.com/docs/guides/development/testing/playwright/overview.md#configure-playwright-with-clerk) to configure Playwright with Clerk.
   - Calls `clerk.signIn()` to sign in a test user using credentials stored in environment variables. See the [reference](https://clerk.com/docs/guides/development/testing/playwright/test-helpers.md#clerk-sign-in) for more information about the different parameters you can pass.
   - Checks if the user can access a protected page to ensure the user is successfully authenticated.
   - Stores the auth state in the storage file.

   ```tsx {{ filename: 'global.setup.ts' }}
   import { clerk, clerkSetup } from '@clerk/testing/playwright'
   import { test as setup } from '@playwright/test'
   import path from 'path'

   // Configure Playwright with Clerk
   setup('global setup', async ({}) => {
     await clerkSetup()
   })

   // Define the path to the storage file, which is `user.json`
   const authFile = path.join(__dirname, '../playwright/.clerk/user.json')

   setup('authenticate and save state to storage', async ({ page }) => {
     // Perform authentication steps.
     // This example uses a Clerk helper to authenticate
     await page.goto('/')
     await clerk.signIn({
       page,
       signInParams: {
         strategy: 'password',
         identifier: process.env.E2E_CLERK_USER_USERNAME!,
         password: process.env.E2E_CLERK_USER_PASSWORD!,
       },
     })
     await page.goto('/protected')
     // Ensure the user has successfully accessed the protected page
     // by checking an element on the page that only the authenticated user can access
     await page.waitForSelector("h1:has-text('This is a PROTECTED page')")

     await page.context().storageState({ path: authFile })
   })
   ```
3. ## Load the stored auth state in your tests

   You can either load the stored auth state [in the config](#in-the-config) or directly [in a test file](#in-a-test-file). Loading in the config is useful if you want to authenticate once and reuse the same auth state for all tests or groups of tests. Loading in a test file is useful if you want to authenticate for a specific test case.
4. ### In the config

   In your `playwright.config.ts`, create a `global setup` project and declare it as a [dependency](https://playwright.dev/docs/test-projects#dependencies) for all your testing projects. This means that the `global setup` project will always run before all the tests, and because it's where you prepared auth state, it will authenticate before all the tests. All testing projects should use the authenticated state as `storageState`.

   ```tsx {{ filename: 'playwright.config.ts' }}
   // ...
   projects: [
     {
       name: 'global setup',
       testMatch: /global\.setup\.ts/,
     },
     {
       name: 'Main tests',
       testMatch: /.*app.spec.ts/,
       use: {
         ...devices['Desktop Chrome'],
       },
       dependencies: ['global setup'],
     },
     {
       name: 'Authenticated tests',
       testMatch: /.*authenticated.spec.ts/,
       use: {
         ...devices['Desktop Chrome'],

         // Use prepared Clerk auth state
         storageState: 'playwright/.clerk/user.json',
       },
       dependencies: ['global setup'],
     },
   ]
   ```
5. ### In a test file

   To use the stored auth state in a test file, see the following example:

   ```tsx {{ filename: 'authenticated.spec.ts', mark: [4, 5] }}
   import { test } from '@playwright/test'

   // Use prepared Clerk auth state
   test.use({ storageState: 'playwright/.clerk/user.json' })

   test('user test', async ({ page }) => {
     // page is authenticated
   })
   ```

For more information, feedback, or issues, visit the [`@clerk/testing`](https://github.com/clerk/javascript/tree/main/packages/testing) package.
