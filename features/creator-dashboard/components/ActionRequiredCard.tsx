'use client'

/**
 * ActionRequiredCard Component
 *
 * Kartu Bento Grid untuk menampilkan aksi mendesak yang memerlukan perhatian
 * dari pembuat/mentor (misal review tugas siswa, diskusi, perbaikan kuis).
 */

import React, { useState } from 'react'
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'

interface Task {
  id: number
  title: string
  detail: string
  urgency: 'high' | 'medium' | 'low'
  completed: boolean
}

export function ActionRequiredCard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Tinjau 4 Tugas Siswa', detail: 'Modul 2: React State Management', urgency: 'high', completed: false },
    { id: 2, title: 'Jawab 2 Diskusi Baru', detail: 'Pertanyaan tentang Suspense API', urgency: 'medium', completed: false },
    { id: 3, title: 'Perbarui Kuis Modul 1', detail: 'Ada laporan typo di soal No. 5', urgency: 'low', completed: false }
  ])

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  return (
    <TiltCard 
      className="md:col-span-4 card-ancient p-6 flex flex-col justify-between min-h-[340px] cursor-default"
    >
      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
            Perlu Tindakan
          </h3>
          <AlertCircle className="w-4 h-4 text-accent-coral" />
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => {
            const isHigh = task.urgency === 'high'
            const isMedium = task.urgency === 'medium'
            return (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border border-transparent transition-all cursor-pointer select-none ${
                  task.completed 
                    ? 'bg-success/5 border-success/10 text-text-muted' 
                    : 'hover:bg-bg-surface-accent hover:border-border/10 text-text-secondary'
                }`}
              >
                <button
                  type="button"
                  aria-label={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                  className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'bg-success text-white' 
                      : isHigh
                        ? 'border border-accent-coral'
                        : isMedium
                          ? 'border border-accent-mustard'
                          : 'border border-text-faint hover:border-accent-coral'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold text-text-primary leading-tight ${task.completed ? 'line-through text-text-muted' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-[10px] text-text-muted truncate mt-0.5">
                    {task.detail}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer statistics */}
      <div className="pt-4 border-t border-border/10">
        <button 
          onClick={() => console.log('View all creator tasks')}
          className="w-full text-center py-2 bg-bg-bone hover:bg-bg-surface-accent border border-border/10 rounded-xl text-xs font-semibold text-text-secondary transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          <span>Lihat Semua Tugas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </TiltCard>
  )
}
