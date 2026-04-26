import React from 'react'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type TaskPriority = 'high' | 'medium' | 'low'

export interface PendingTask {
  id: number
  title: string
  priority: TaskPriority
  dueDate: string
}

interface PendingTasksPanelProps {
  tasks: PendingTask[]
  onComplete?: (taskId: number) => void
  onViewAll?: () => void
}

const priorityStyles: Record<TaskPriority, string> = {
  high: 'bg-merah-100 text-merah-800',
  medium: 'bg-kuning-100 text-kuning-800',
  low: 'bg-hijau-100 text-hijau-800',
}

export function PendingTasksPanel({ tasks, onComplete, onViewAll }: PendingTasksPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-neu border border-beige-200">
      <div className="p-6 border-b border-beige-100">
        <h2 className="text-xl font-semibold text-beige-900">Tugas Pending</h2>
      </div>

      <div className="divide-y divide-beige-100">
        {tasks.map((task) => (
          <div key={task.id} className="p-6 hover:bg-beige-50 transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-beige-900 mb-2">{task.title}</h3>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}
                    data-testid={`task-priority-${task.id}`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-sm text-beige-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.dueDate}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-beige-300 text-beige-700 hover:bg-beige-100 hover:scale-105 transition-all duration-200"
                onClick={() => onComplete?.(task.id)}
              >
                Selesai
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-beige-100">
        <Button
          variant="outline"
          className="w-full border-beige-300 text-beige-700 hover:bg-beige-50"
          onClick={onViewAll}
        >
          Lihat Semua Tugas
        </Button>
      </div>
    </div>
  )
}
