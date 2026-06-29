'use client'

/**
 * TodaysGoalCard Component
 *
 * Kartu Bento Grid untuk mencatat target belajar harian, lengkap
 * dengan checklist interaktif dan status kemajuan.
 */

import React from 'react'
import { Trophy, CheckCircle2 } from 'lucide-react'
import { TiltCard } from './TiltCard'

interface Goal {
  id: number
  text: string
  completed: boolean
}

interface TodaysGoalCardProps {
  goals: Goal[]
  onToggleGoal: (id: number) => void
  completedCount: number
  progressPercent: number
}

export function TodaysGoalCard({
  goals,
  onToggleGoal,
  completedCount,
  progressPercent,
}: TodaysGoalCardProps) {
  return (
    <TiltCard 
      className="md:col-span-4 card-ancient p-6 flex flex-col justify-between min-h-[340px] cursor-default"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
            Target Hari Ini
          </h3>
          <Trophy className="w-4 h-4 text-accent-mustard" />
        </div>
        
        {/* Checklist */}
        <div className="space-y-3">
          {goals.map((goal) => (
            <div 
              key={goal.id}
              onClick={() => onToggleGoal(goal.id)}
              className={`flex items-start gap-3 p-2.5 rounded-xl border border-transparent transition-all cursor-pointer select-none ${
                goal.completed 
                  ? 'bg-success/5 border-success/10 text-text-muted' 
                  : 'hover:bg-bg-surface-accent hover:border-border/10 text-text-secondary'
              }`}
            >
              <button 
                type="button"
                aria-label={goal.completed ? "Tandai belum selesai" : "Tandai selesai"}
                className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                  goal.completed 
                    ? 'bg-success text-white' 
                    : 'border border-text-faint hover:border-accent-coral'
                }`}
              >
                {goal.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <span className={`text-xs leading-relaxed font-medium ${goal.completed ? 'line-through' : ''}`}>
                {goal.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Progress Ring/Bar */}
      <div className="pt-4 border-t border-border/10 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted font-medium">Progres Hari Ini</span>
          <span className="font-bold text-accent-coral">{progressPercent}%</span>
        </div>
        <div className="w-full bg-bg-surface-accent rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-accent-coral h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-text-muted text-center italic mt-1">
          {completedCount === goals.length 
            ? '🎉 Luar biasa! Semua target hari ini tercapai!' 
            : `${goals.length - completedCount} target lagi untuk hari ini`}
        </p>
      </div>
    </TiltCard>
  )
}
