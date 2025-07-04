'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, ImageIcon } from 'lucide-react'

interface Course {
  id?: string
  title: string
  description: string
  thumbnail: string
  status: 'draft' | 'published' | 'archived'
  students: number
  lessons: number
  duration: string
  rating: number
  category: string
  createdAt: string
}

interface CreateCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCourseCreated: (course: Course) => void
}

export function CreateCourseDialog({
  open,
  onOpenChange,
  onCourseCreated,
}: CreateCourseDialogProps) {
  const [formData, setFormData] = useState<{
    title: string
    description: string
    category: string
    thumbnail: string
    status: 'draft' | 'published' | 'archived'
  }>({
    title: '',
    description: '',
    category: '',
    thumbnail: '',
    status: 'draft',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newCourse: Course = {
      ...formData,
      thumbnail: formData.thumbnail || '/placeholder.svg?height=200&width=300',
      students: 0,
      lessons: 0,
      duration: '0 jam',
      rating: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }

    onCourseCreated(newCourse)

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      thumbnail: '',
      status: 'draft',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-ancient-fantasy border-secondary-300 glass-panel">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-beige-900 flex items-center gap-2 font-serif">
            ✨ Buat Kursus Baru
          </DialogTitle>
          <DialogDescription className="text-beige-700">
            Mulai petualangan belajar baru dengan membuat kursus yang menakjubkan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-beige-900 font-medium">
              Judul Kursus *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Petualangan Matematika Nusantara"
              required
              className="neu-input border-beige-300 focus:border-secondary-400 focus:ring-secondary-200"
            />
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-beige-900 font-medium">
              Deskripsi Kursus *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan tentang kursus Anda dan apa yang akan dipelajari siswa..."
              required
              rows={4}
              className="neu-input border-beige-300 focus:border-secondary-400 focus:ring-secondary-200 resize-none"
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-beige-900 font-medium">
                Kategori *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="neu-input border-beige-300 focus:border-secondary-400 focus:ring-secondary-200">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matematika">📊 Matematika</SelectItem>
                  <SelectItem value="bahasa">📚 Bahasa Indonesia</SelectItem>
                  <SelectItem value="sains">🔬 Sains</SelectItem>
                  <SelectItem value="sejarah">🏛️ Sejarah</SelectItem>
                  <SelectItem value="seni">🎨 Seni & Budaya</SelectItem>
                  <SelectItem value="teknologi">💻 Teknologi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-beige-900 font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'published' | 'archived') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="neu-input border-beige-300 focus:border-secondary-400 focus:ring-secondary-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">📝 Draft</SelectItem>
                  <SelectItem value="published">✨ Diterbitkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label className="text-beige-900 font-medium">Thumbnail Kursus</Label>
            <Card className="border-2 border-dashed border-secondary-400 bg-beige-50 hover:bg-white/60 transition-colors card-ancient">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mb-4 whimsical-bounce">
                    <ImageIcon className="h-8 w-8 text-secondary-600" />
                  </div>
                  <h3 className="text-lg font-medium text-beige-900 mb-2">Upload Thumbnail</h3>
                  <p className="text-beige-700 text-sm mb-4">
                    Pilih gambar yang menarik untuk kursus Anda
                  </p>
                  <Button type="button" variant="outline" className="btn-secondary hover-glow">
                    <Upload className="h-4 w-4 mr-2" />
                    Pilih File
                  </Button>
                  <p className="text-xs text-beige-600 mt-2">PNG, JPG hingga 2MB</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-beige-300 text-beige-900 hover:bg-beige-100 neu-button"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="btn-primary magical-glow"
              disabled={!formData.title || !formData.description || !formData.category}
            >
              🚀 Buat Kursus
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
