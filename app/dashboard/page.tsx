'use client'

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { BookOpen, Home, Settings, User } from 'lucide-react'
import { Navbar } from '@/features/homepage/component/navbar'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent-mint/5">
        <div className="glass-panel p-8 rounded-lg shadow-glass">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20"></div>
            <div className="h-4 w-48 rounded bg-primary/20"></div>
            <div className="h-3 w-36 rounded bg-primary/10"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent-mint/5 relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-mint/5 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 glass-panel p-6 hidden md:block">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Maguru
          </span>
        </div>

        <nav className="space-y-6">
          <div>
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Pengaturan
                </Button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="md:ml-64 p-6 pt-20">
        {/* Header */}
        <header className="glass-panel p-4 rounded-lg shadow-glass flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="text-sm text-gray-600">
            Selamat datang, {user?.firstName || 'Pengguna'}!
          </div>
        </header>

        {/* Content */}
        <main className="space-y-6">
          <div className="glass-panel p-6 rounded-lg shadow-glass">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Selamat datang, {user?.firstName || 'Pengguna'}!
            </h2>
            <p className="text-gray-600 mb-4">
              Ini adalah halaman dashboard Maguru. Anda telah berhasil masuk ke akun Anda.
            </p>
            <div className="bg-white/50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Informasi Akun:</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <span className="font-medium">Email:</span>{' '}
                  {user?.primaryEmailAddress?.emailAddress}
                </li>
                <li>
                  <span className="font-medium">ID:</span> {user?.id}
                </li>
                <li>
                  <span className="font-medium">Bergabung:</span>{' '}
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-lg shadow-glass">
              <h3 className="font-semibold mb-3">Kursus Terbaru</h3>
              <p className="text-gray-600 text-sm">
                Belum ada kursus yang tersedia. Silakan kembali lagi nanti.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-lg shadow-glass">
              <h3 className="font-semibold mb-3">Aktivitas Terbaru</h3>
              <p className="text-gray-600 text-sm">
                Belum ada aktivitas terbaru. Mulai jelajahi kursus untuk melihat aktivitas di sini.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2023 Maguru. Hak Cipta Dilindungi.</p>
        </footer>
      </div>
    </div>
  )
}
