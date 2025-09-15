'use client'

import React from 'react'
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              'neu-button bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity',
          },
          variables: {
            colorPrimary: '#8C4FFF',
            colorTextOnPrimaryBackground: 'white',
            borderRadius: '0.5rem',
          },
        }}
        signUpUrl="/sign-up"
      />
    </main>
  )
}
