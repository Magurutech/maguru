import React from 'react'
import Link from 'next/link'
import { BookOpen, Video, FileText, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuickActionsPanel() {
  return (
    <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6 mb-8">
      <h2 className="text-xl font-semibold text-beige-900 mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/creator/courses/create">
          <Button className="w-full h-20 flex flex-col items-center justify-center bg-merah-500 hover:bg-merah-600 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            <BookOpen className="w-6 h-6 mb-2" />
            Buat Kursus Baru
          </Button>
        </Link>
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center border-kuning-300 text-kuning-700 hover:bg-kuning-50 hover:border-kuning-500 hover:scale-105 transition-all duration-200"
        >
          <Video className="w-6 h-6 mb-2" />
          Upload Video
        </Button>
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center border-hijau-300 text-hijau-700 hover:bg-hijau-50 hover:border-hijau-500 hover:scale-105 transition-all duration-200"
        >
          <FileText className="w-6 h-6 mb-2" />
          Tulis Artikel
        </Button>
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center border-beige-300 text-beige-700 hover:bg-beige-50 hover:border-beige-500 hover:scale-105 transition-all duration-200"
        >
          <BarChart3 className="w-6 h-6 mb-2" />
          Lihat Analytics
        </Button>
      </div>
    </div>
  )
}
