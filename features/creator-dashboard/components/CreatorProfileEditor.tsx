'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Target, Loader2, Link2, Award, Users, Star, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

interface CreatorStats {
  rating: number
  studentsCount: number
  coursesCount: number
}

interface CreatorProfile {
  name: string
  title: string
  bio: string
  experience: string
  avatarUrl: string
  socialLinks: {
    linkedin: string
    youtube: string
    github: string
  }
  stats?: CreatorStats
}

export function CreatorProfileEditor() {
  const [profile, setProfile] = useState<CreatorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [experience, setExperience] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [youtube, setYoutube] = useState('')
  const [github, setGithub] = useState('')
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/creator/profile')
        if (!res.ok) throw new Error('Gagal memuat profil')
        const data = await res.json()
        setProfile(data)
        
        // Populate fields
        setName(data.name || '')
        setTitle(data.title || '')
        setBio(data.bio || '')
        setExperience(data.experience || '')
        setAvatarUrl(data.avatarUrl || '')
        setLinkedin(data.socialLinks?.linkedin || '')
        setYoutube(data.socialLinks?.youtube || '')
        setGithub(data.socialLinks?.github || '')
      } catch (err) {
        toast.error('Gagal mengambil data profil')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleCancel = () => {
    if (!profile) return
    setName(profile.name || '')
    setTitle(profile.title || '')
    setBio(profile.bio || '')
    setExperience(profile.experience || '')
    setAvatarUrl(profile.avatarUrl || '')
    setLinkedin(profile.socialLinks?.linkedin || '')
    setYoutube(profile.socialLinks?.youtube || '')
    setGithub(profile.socialLinks?.github || '')
    setErrors({})
  }

  const validateUrl = (url: string, _fieldName: string): boolean => {
    if (!url.trim()) return true
    try {
      if (!URL.canParse(url)) return false
      const parsed = new URL(url)
      return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    
    // Validate name
    if (name.trim().length < 2) {
      nextErrors.name = 'Nama minimal 2 karakter'
    }

    // Validate social links using native URL.canParse
    if (!validateUrl(linkedin, 'LinkedIn')) {
      nextErrors.linkedin = 'URL LinkedIn tidak valid'
    }
    if (!validateUrl(youtube, 'YouTube')) {
      nextErrors.youtube = 'URL YouTube tidak valid'
    }
    if (!validateUrl(github, 'GitHub')) {
      nextErrors.github = 'URL GitHub tidak valid'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setSaving(true)
    try {
      const payload = {
        name,
        title,
        bio,
        experience,
        avatarUrl,
        socialLinks: {
          linkedin,
          youtube,
          github
        }
      }
      
      const res = await fetch('/api/creator/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) throw new Error()
      
      setProfile((prev) => prev ? { ...prev, ...payload } : prev)
      toast.success('Profil berhasil disimpan')
    } catch {
      toast.error('Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-60" data-testid="loading-spinner">
        <Loader2 className="w-8 h-8 text-accent-coral animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 select-none font-sans">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6 bg-card border border-border/10 rounded-3xl p-6 md:p-8 paper-texture">
        <div className="flex items-center gap-2 pb-4 border-b border-border/10">
          <User className="w-5 h-5 text-accent-coral" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Pengaturan Profil Kreator
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              className="w-full text-xs text-text-primary bg-bg-bone/45 border border-border/15 p-3 rounded-2xl focus:border-accent-coral focus:outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
            {errors.name && (
              <p className="text-[10px] text-error font-medium">{errors.name}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
              Gelar
            </label>
            <input
              type="text"
              id="title"
              className="w-full text-xs text-text-primary bg-bg-bone/45 border border-border/15 p-3 rounded-2xl focus:border-accent-coral focus:outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
            />
          </div>
        </div>

        {/* Avatar URL */}
        <div className="space-y-1.5">
          <label htmlFor="avatarUrl" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            Avatar URL
          </label>
          <input
            type="text"
            id="avatarUrl"
            className="w-full text-xs text-text-primary bg-bg-bone/45 border border-border/15 p-3 rounded-2xl focus:border-accent-coral focus:outline-none transition-all"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* Short Bio */}
        <div className="space-y-1.5">
          <label htmlFor="bio" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            Bio Singkat
          </label>
          <textarea
            id="bio"
            rows={3}
            className="w-full text-xs text-text-primary bg-bg-bone/45 border border-border/15 p-3 rounded-2xl focus:border-accent-coral focus:outline-none transition-all resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* Experience */}
        <div className="space-y-1.5">
          <label htmlFor="experience" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            Pengalaman
          </label>
          <textarea
            id="experience"
            rows={3}
            className="w-full text-xs text-text-primary bg-bg-bone/45 border border-border/15 p-3 rounded-2xl focus:border-accent-coral focus:outline-none transition-all resize-none"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* Social Links Group */}
        <div className="space-y-4 pt-4 border-t border-border/10">
          <h3 className="text-[10px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Link2 className="w-4 h-4 text-accent-coral" />
            Media Sosial
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LinkedIn */}
            <div className="space-y-1.5">
              <label htmlFor="linkedin" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                LinkedIn
              </label>
              <input
                type="text"
                id="linkedin"
                className="w-full text-xs text-text-primary bg-bg-bone/45 border border-border/15 p-3 rounded-2xl focus:border-accent-coral focus:outline-none"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                disabled={saving}
              />
              {errors.linkedin && (
                <p className="text-[10px] text-error font-medium">{errors.linkedin}</p>
              )}
            </div>

            {/* YouTube */}
            <div className="space-y-1.5">
              <label htmlFor="youtube" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                YouTube
              </label>
              <input
                type="text"
                id="youtube"
                className="w-full text-xs text-text-primary bg-bg-bone/45 border border-border/15 p-3 rounded-2xl focus:border-accent-coral focus:outline-none"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                disabled={saving}
              />
              {errors.youtube && (
                <p className="text-[10px] text-error font-medium">{errors.youtube}</p>
              )}
            </div>

            {/* GitHub */}
            <div className="space-y-1.5">
              <label htmlFor="github" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                GitHub
              </label>
              <input
                type="text"
                id="github"
                className="w-full text-xs text-text-primary bg-bg-bone/45 border border-border/15 p-3 rounded-2xl focus:border-accent-coral focus:outline-none"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                disabled={saving}
              />
              {errors.github && (
                <p className="text-[10px] text-error font-medium">{errors.github}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4 border-t border-border/10">
          <Button
            type="submit"
            disabled={saving}
            className="bg-accent-coral hover:bg-[#e25e4a] text-white rounded-full px-6 text-xs font-bold shadow-glow cursor-pointer flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Simpan Profil
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={saving}
            className="text-text-secondary hover:bg-bg-surface-accent rounded-full px-6 text-xs font-bold cursor-pointer"
          >
            Batal
          </Button>
        </div>
      </form>

      {/* Stats Bento Sidebar Section */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-bg-bone/45 border border-border/10 rounded-3xl p-6 paper-texture space-y-6">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-border/10 pb-2">
            <Award className="w-4 h-4 text-accent-coral" />
            Statistik Mentor
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {/* Rating */}
            <div className="p-4 bg-card border border-border/5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-mustard/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent-mustard fill-accent-mustard" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Rating Kelas</span>
                <span className="text-lg font-black text-text-primary leading-none block mt-0.5">
                  {profile?.stats?.rating !== undefined ? profile.stats.rating : '-'}
                </span>
              </div>
            </div>

            {/* Students count */}
            <div className="p-4 bg-card border border-border/5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Total Pelajar</span>
                <span className="text-lg font-black text-text-primary leading-none block mt-0.5">
                  {profile?.stats?.studentsCount !== undefined ? profile.stats.studentsCount : '0'}
                </span>
              </div>
            </div>

            {/* Course count */}
            <div className="p-4 bg-card border border-border/5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#10b981]" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Jumlah Kelas</span>
                <span className="text-lg font-black text-text-primary leading-none block mt-0.5">
                  {profile?.stats?.coursesCount !== undefined ? profile.stats.coursesCount : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
