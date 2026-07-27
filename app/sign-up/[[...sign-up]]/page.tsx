'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { SkeuButton } from '@/components/shadcn-studio/button/skeu-button'
import { SkeuoCard } from '@/components/shadcn-studio/card/skeucard'
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
            role: 'user',
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    } catch (err: unknown) {
      setError('Terjadi kesalahan saat pendaftaran. Silakan coba lagi.')
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError(null)
    setGoogleLoading(true)

    try {
      const supabase = createClient()
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (oauthError) {
        setError(oauthError.message)
        setGoogleLoading(false)
      }
    } catch (err: unknown) {
      setError('Terjadi kesalahan saat mengalihkan ke Google.')
      setGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-canvas relative overflow-hidden">
      <div className="w-full max-w-md">
        <SkeuoCard
          variant="paper"
          titleText="Buat Akun Maguru"
          descriptionText="Gabung bersama ribuan pengajar & murid di platform online Maguru."
        >
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent-sage/20 text-accent-sage flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-primary">
                Pendaftaran Berhasil!
              </h3>
              <p className="text-xs text-text-muted">
                Silakan periksa email Anda untuk melakukan verifikasi akun sebelum masuk.
              </p>
              <Link href="/sign-in">
                <SkeuButton variant="primary" className="w-full mt-2">
                  Kembali ke Halaman Masuk
                </SkeuButton>
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              {error && (
                <div className="p-3 mb-4 rounded-lg bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google OAuth Button */}
              <SkeuButton
                type="button"
                variant="secondary"
                disabled={googleLoading || loading}
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-2.5 py-3 mb-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-semibold text-xs text-text-primary">
                  {googleLoading ? 'Mengalihkan ke Google...' : 'Daftar dengan Google'}
                </span>
              </SkeuButton>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-text-faint/15 w-full"></div>
                <span className="bg-canvas px-3 text-[10px] uppercase font-mono tracking-widest text-text-muted shrink-0">
                  atau via email
                </span>
                <div className="border-t border-text-faint/15 w-full"></div>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wider font-semibold text-text-primary uppercase block">
                    Nama Lengkap
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Nama Lengkap Anda"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    startIcon={<User className="w-4 h-4 text-text-muted" />}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wider font-semibold text-text-primary uppercase block">
                    Alamat Email
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    startIcon={<Mail className="w-4 h-4 text-text-muted" />}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wider font-semibold text-text-primary uppercase block">
                    Kata Sandi
                  </label>
                  <Input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    startIcon={<Lock className="w-4 h-4 text-text-muted" />}
                  />
                </div>

                <SkeuButton
                  type="submit"
                  variant="primary"
                  disabled={loading || googleLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-2"
                >
                  <span>{loading ? 'Memproses...' : 'Daftar Akun Baru'}</span>
                  <ArrowRight className="w-4 h-4" />
                </SkeuButton>

                <div className="text-center pt-2 border-t border-text-faint/10">
                  <p className="text-xs text-text-muted">
                    Sudah memiliki akun?{' '}
                    <Link
                      href="/sign-in"
                      className="font-semibold text-accent-coral hover:underline"
                    >
                      Masuk Sekarang
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          )}
        </SkeuoCard>
      </div>
    </main>
  )
}
