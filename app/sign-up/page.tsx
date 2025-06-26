'use client';

import React from 'react';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent-mint/5">
      <div className="glass-panel p-8 rounded-lg shadow-glass w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              card: 'bg-transparent shadow-none border-none',
              formButtonPrimary: 'neu-button bg-gradient-to-r from-primary to-secondary text-white',
              headerTitle: 'text-2xl font-bold text-primary',
              headerSubtitle: 'text-muted-foreground',
              footer: 'hidden',
            },
          }}
        />
      </div>
    </main>
  );
}
