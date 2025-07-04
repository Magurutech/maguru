import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CourseSearchFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onStatusChange: (status: string) => void
  onCreateCourse: () => void
}

export function CourseSearchFilter({
  searchQuery,
  onSearchChange,
  onStatusChange,
  onCreateCourse,
}: CourseSearchFilterProps) {
  return (
    <Card className="mb-8 glass-panel border-secondary-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full md:w-auto">
            <div className="relative flex-1 border-beige-300 border-2 rounded-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-beige-700 h-4 w-4" />
              <Input
                placeholder="Cari kursus..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 neu-input border-beige-300 focus:border-secondary-400 focus:ring-secondary-200"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="neu-button border-beige-300 hover:border-secondary-400 hover-glow"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onStatusChange('all')}>
                  Semua Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange('published')}>
                  Diterbitkan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange('draft')}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange('archived')}>
                  Diarsipkan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={onCreateCourse} className="btn-primary magical-glow">
            <Plus className="h-4 w-4 mr-2" />
            Buat Kursus Baru
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
