'use client'

/**
 * ActionRequiredCard Component
 *
 * Implements the "Perlu Tindakan" Action Center card with tightened -2 spacing.
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { Bell, ChevronRight, FileCheck, MessageSquare, BookOpen } from 'lucide-react'

interface ActionTask {
  id: number
  title: string
  detail: string
  priority: 'Tinggi' | 'Sedang' | 'Rendah'
  timeEstimate: string
  icon: typeof FileCheck
  badgeColor: string
}

export function ActionRequiredCard() {
  const [tasks] = useState<ActionTask[]>([
    {
      id: 1,
      title: 'Tinjau 4 Tugas Siswa',
      detail: 'Ada 4 tugas yang menunggu penilaian',
      priority: 'Tinggi',
      timeEstimate: '2-4 jam',
      icon: FileCheck,
      badgeColor: 'bg-[#FF4D4D]/15 text-[#C62828] border-[#FF4D4D]/30',
    },
    {
      id: 2,
      title: 'Jawab 2 Diskusi Baru',
      detail: 'Pertanyaan dan diskusi dari siswa',
      priority: 'Sedang',
      timeEstimate: '4-6 jam',
      icon: MessageSquare,
      badgeColor: 'bg-[#FFE8C4] text-[#B96500] border-[#FFB148]/50',
    },
    {
      id: 3,
      title: 'Perbarui Kursus Modul 1',
      detail: 'Ada pembaruan materi dari tim',
      priority: 'Rendah',
      timeEstimate: '1-2 hari',
      icon: BookOpen,
      badgeColor: 'bg-[#F3EBFF] text-[#6B21A8] border-[#8C4FFF]/30',
    },
  ])

  return (
    <div className="md:col-span-4 border border-[#D8C4A7]/60 rounded-3xl p-4 sm:p-4.5 bg-[#FFFDF9] shadow-[0_4px_16px_rgba(45,35,25,0.05)] flex flex-col justify-between gap-3">
      <div className="space-y-2.5 w-full">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[#D8C4A7]/30 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Bell className="w-3.5 h-3.5 text-[#B96500]" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#E53935]" />
            </div>
            <h3 className="font-sans text-xs sm:text-[13px] font-bold text-[#2D2319]">
              Perlu Tindakan
            </h3>
          </div>

          <Link
            href="/creator/students"
            className="text-[10.5px] font-sans font-medium text-[#6E5D4B] hover:text-[#2D2319] transition-colors"
          >
            Lihat Semua ➔
          </Link>
        </div>

        {/* Task Items List */}
        <div className="space-y-2">
          {tasks.map((task) => {
            const Icon = task.icon
            return (
              <div
                key={task.id}
                className="p-2.5 rounded-2xl bg-[#FAF5ED]/50 hover:bg-[#FAF5ED] border border-[#D8C4A7]/40 transition-colors flex items-center justify-between gap-2.5 group cursor-pointer"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {/* Task Icon */}
                  <div className="w-7 h-7 rounded-xl bg-[#FFFDF9] border border-[#D8C4A7]/50 flex items-center justify-center shrink-0 text-[#2D2319] shadow-2xs mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-[#6E5D4B] group-hover:text-[#2D2319] transition-colors" />
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-sans text-xs font-bold text-[#2D2319] leading-tight truncate">
                      {task.title}
                    </h4>
                    <p className="font-sans text-[10.5px] text-[#6E5D4B] truncate leading-none">
                      {task.detail}
                    </p>

                    {/* Badges: Priority + Time estimate */}
                    <div className="flex items-center gap-1 pt-0.5">
                      <span
                        className={`text-[9px] font-sans font-semibold px-1.5 py-0.5 rounded-full border ${task.badgeColor}`}
                      >
                        Prioritas {task.priority}
                      </span>
                      <span className="text-[9.5px] font-sans text-[#6E5D4B]/70 tabular-nums">
                        ⏱️ {task.timeEstimate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Arrow */}
                <ChevronRight className="w-3.5 h-3.5 text-[#D8C4A7] group-hover:text-[#2D2319] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Card Footer Button */}
      <Link
        href="/creator/students"
        className="w-full text-center py-2 bg-[#FAF5ED] hover:bg-[#F5EDE0] border border-[#D8C4A7]/50 rounded-xl text-xs font-sans font-semibold text-[#2D2319] transition-colors flex items-center justify-center gap-1 shadow-2xs"
      >
        <span>Lihat Semua Tugas</span>
        <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  )
}
