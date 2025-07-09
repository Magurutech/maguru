'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, BookOpen, Search, Bell } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { SignOutButton, UserButton } from '@clerk/nextjs'
import { useUserRole } from '@/features/auth'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn } = useUser()
  const { role, isAdmin, isCreator, isUser } = useUserRole()

  const navItems = [
    { label: 'Beranda', href: '#home' },
    { label: 'Kursus', href: '#courses' },
    { label: 'Tentang', href: '#about' },
    { label: 'Kontak', href: '#contact' },
  ]

  // Handler untuk close menu mobile setelah klik link
  const handleNavClick = () => setIsOpen(false)

  // Handler untuk sign out dengan close mobile menu
  const handleSignOut = () => {
    setIsOpen(false)
  }

  // Get dashboard URL based on role
  const getDashboardUrl = () => {
    if (isAdmin) return '/admin'
    if (isCreator) return '/creator'
    if (isUser) return '/dashboard'
    return '/dashboard' // Default fallback
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ancient-fantasy/95 backdrop-blur-lg border-b border-beige-300/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-neu">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-beige-900 font-serif">Maguru</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-beige-700 hover:text-gradient-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-beige-700 hover:bg-beige-100 hover:text-beige-900"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-beige-300 text-beige-900 hover:bg-beige-100 neu-button"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="btn-primary magical-glow">
                    Daftar
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-beige-700 hover:bg-beige-100 hover:text-beige-900"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-beige-700 hover:bg-beige-100 hover:text-beige-900"
                >
                  <Bell className="w-4 h-4" />
                </Button>

                {/* Role-based Dashboard Link */}
                <Link href={getDashboardUrl()}>
                  <Button variant="ghost" className="text-sm bg-beige-100 hover:bg-beige-50">
                    Dashboard
                    {role && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {role}
                      </span>
                    )}
                  </Button>
                </Link>

                <SignOutButton
                  signOutOptions={{ redirectUrl: '/' }}
                  data-testid="desktop-sign-out-button"
                >
                  <Button variant="ghost" className="text-beige-700 hover:bg-beige-100">
                    Keluar
                  </Button>
                </SignOutButton>

                <UserButton
                  afterSignOutUrl="/"
                  data-testid="desktop-user-button"
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8 rounded-full border-2 border-secondary-400',
                    },
                  }}
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-beige-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-beige-900" />
            ) : (
              <Menu className="w-6 h-6 text-beige-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-beige-300/50">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-beige-700 hover:text-gradient-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div className="flex flex-col space-y-2 pt-4 border-t border-beige-300/50">
                {!isSignedIn ? (
                  <>
                    <Link href="/sign-in">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-beige-300 text-beige-900 hover:bg-beige-100 neu-button"
                        onClick={handleNavClick}
                      >
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button
                        size="sm"
                        className="w-full btn-primary hover-glow"
                        onClick={handleNavClick}
                      >
                        Daftar Gratis
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Mobile Role-based Dashboard Link */}
                    <Link href={getDashboardUrl()}>
                      <Button
                        variant="outline"
                        className="w-full justify-start neu-button"
                        onClick={handleNavClick}
                      >
                        <span className="flex items-center">
                          Dashboard
                          {role && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {role}
                            </span>
                          )}
                        </span>
                      </Button>
                    </Link>

                    <SignOutButton
                      signOutOptions={{ redirectUrl: '/' }}
                      data-testid="mobile-sign-out-button"
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-beige-700 hover:bg-beige-100"
                        onClick={handleSignOut}
                      >
                        Keluar
                      </Button>
                    </SignOutButton>

                    <div className="pt-2 flex justify-center">
                      <UserButton
                        afterSignOutUrl="/"
                        data-testid="mobile-user-button"
                        appearance={{
                          elements: {
                            avatarBox: 'w-10 h-10 rounded-full border-2 border-secondary-400',
                          },
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
