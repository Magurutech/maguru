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
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
              ${selectedCategory === category ? 'bg-primary text-white shadow-lg' : 'bg-white/80 text-beige-900 hover:bg-primary/10'}
            `}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
