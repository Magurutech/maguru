# Page snapshot

```yaml
- link "Skip to Clerk keyless mode content":
  - /url: "#--clerk-keyless-prompt-button"
- main:
  - heading "Sign in to" [level=1]
  - paragraph: Welcome back! Please sign in to continue
  - text: Email address
  - textbox "Email address": existing+clerk_test@example.com
  - paragraph:
    - img
    - text: Couldn't find your account.
  - text: Password
  - textbox "Password": ExistingSecurePass2024!
  - button "Show password":
    - img
  - button "Continue":
    - text: Continue
    - img
  - text: Don’t have an account?
  - link "Sign up":
    - /url: http://localhost:3000/sign-up
- text: "Dev Mode: Role Switcher Current: null"
- button "admin"
- button "creator"
- button "user"
- alert
- button "Open Next.js Dev Tools":
  - img
- button "Clerk is in keyless mode":
  - paragraph: Clerk is in keyless mode
```