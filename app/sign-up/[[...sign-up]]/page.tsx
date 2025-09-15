'use client'

import React from 'react'
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent-mint/5 relative overflow-hidden">
      <SignUp
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
        signInUrl="/sign-in"
      />
    </main>
  )
}
