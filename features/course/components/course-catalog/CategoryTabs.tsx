import { Button } from '@/components/ui/button'

interface CategoryTabsProps {
  categories: string[]
  selectedCategory: string
  onSelect: (category: string) => void
}

export function CategoryTabs({ categories, selectedCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className="mb-8">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(category)}
            className={`whitespace-nowrap glass-panel transition-all duration-200 font-medium rounded-full px-5 py-2 shadow-sm ${
              selectedCategory === category
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                : 'bg-white/30 border-white/40 hover:bg-white/50 text-gray-700'
            }`}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
