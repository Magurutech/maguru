'use client'

/**
 * RecentReviewsCard Component
 *
 * Kartu Bento Grid untuk menampilkan ulasan/umpan balik terbaru yang diberikan
 * oleh siswa pada materi kursus yang dipublikasikan.
 */

import React from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'

interface Review {
  id: number
  studentName: string
  courseTitle: string
  rating: number
  comment: string
  date: string
}

export function RecentReviewsCard() {
  const reviews: Review[] = [
    {
      id: 1,
      studentName: 'Rian Prasetyo',
      courseTitle: 'Introduction to React',
      rating: 5,
      comment:
        'Penjelasan useReducer sangat aplikatif dan mudah dimengerti dibandingkan tutorial lain.',
      date: '2 jam yang lalu',
    },
    {
      id: 2,
      studentName: 'Siti Aminah',
      courseTitle: 'CSS Grid & Flexbox Masterclass',
      rating: 4.8,
      comment: 'Latihan sandbox sangat membantu mempraktikkan layout kompleks secara langsung.',
      date: 'Kemarin',
    },
  ]

  return (
    <TiltCard className="md:col-span-7 card-ancient p-6 flex flex-col justify-between min-h-62 cursor-default">
      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
            Ulasan Siswa Terbaru
          </h3>
          <MessageSquare className="w-4 h-4 text-text-muted" />
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="space-y-1.5 p-3.5 bg-bg-bone/45 border border-border/5 rounded-xl transition-all hover:bg-bg-bone/80"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-xs font-bold text-text-primary">{rev.studentName}</span>
                  <span className="text-[9px] text-text-muted ml-2 font-mono">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5 text-accent-mustard">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold font-mono">{rev.rating}</span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-accent-coral uppercase tracking-wide">
                KURSUS: {rev.courseTitle}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed italic">
                &quot{rev.comment}&quot
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border/5 text-right">
        <button
          onClick={() => console.log('View all learner reviews')}
          className="text-xs text-accent-coral font-bold hover:underline cursor-pointer"
        >
          Lihat Semua Ulasan
        </button>
      </div>
    </TiltCard>
  )
}
