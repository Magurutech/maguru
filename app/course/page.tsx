'use client'

import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { CourseCatalogBanner } from '@/features/course/components/course-catalog/CourseCatalogBanner'
import { CourseCatalogPageHeader } from '@/features/course/components/course-catalog/CourseCatalogPageHeader'
import { CourseCatalogHeader } from '@/features/course/components/course-catalog/CourseCatalogHeader'
import { CategoryTabs } from '@/features/course/components/course-catalog/CategoryTabs'
import { ResultsCount } from '@/features/course/components/course-catalog/ResultsCount'
import { CourseCatalogGrid } from '@/features/course/components/course-catalog/CourseCatalogGrid'
import { LoadMoreButton } from '@/features/course/components/course-catalog/LoadMoreButton'

// Mock course data with additional fields
const mockCourses = [
  {
    id: 1,
    title: 'Ancient Dragon Martial Arts',
    creator: 'Master Li Wei',
    thumbnail: '/images/default-course-thumbnail.svg',
    rating: 4.8,
    students: 1234,
    duration: '8 weeks',
    category: 'Martial Arts',
    price: 299,
    enrolled: false,
    createdAt: '2024-01-15',
    description: 'Learn the ancient art of Dragon Style kung fu from legendary masters.',
    longDescription:
      'Embark on a mystical journey through the ancient art of Dragon Style kung fu. This comprehensive course will teach you the flowing movements, breathing techniques, and spiritual philosophy behind this legendary martial art. Master Li Wei, with over 30 years of experience, will guide you through traditional forms, combat applications, and meditation practices that have been passed down through generations of martial artists.',
    curriculum: [
      'Basic Dragon Stances',
      'Flowing Movements',
      'Combat Applications',
      'Meditation & Philosophy',
    ],
    wishlist: false,
  },
  {
    id: 2,
    title: 'Mystical Tea Ceremony',
    creator: 'Sensei Akiko',
    thumbnail: '/images/default-course-thumbnail.svg',
    rating: 4.9,
    students: 856,
    duration: '4 weeks',
    category: 'Culture',
    price: 199,
    enrolled: true,
    createdAt: '2024-02-01',
    description: 'Discover the spiritual essence of traditional tea ceremonies.',
    longDescription:
      'Immerse yourself in the sacred art of traditional Japanese tea ceremony. Learn the precise movements, seasonal considerations, and spiritual mindfulness that transform a simple tea service into a profound meditation. Sensei Akiko will teach you the way of tea, from selecting the finest leaves to creating moments of perfect harmony.',
    curriculum: [
      'Tea Selection & Preparation',
      'Ceremonial Movements',
      'Seasonal Awareness',
      'Mindful Practice',
    ],
    wishlist: true,
  },
  {
    id: 3,
    title: 'Calligraphy of the Ancients',
    creator: 'Master Chen',
    thumbnail: '/images/default-course-thumbnail.svg',
    rating: 4.7,
    students: 642,
    duration: '6 weeks',
    category: 'Arts',
    price: 249,
    enrolled: false,
    createdAt: '2024-01-20',
    description: 'Master the elegant art of ancient Asian calligraphy.',
    longDescription:
      'Discover the meditative art of traditional calligraphy where each brushstroke carries meaning and intention. Master Chen will guide you through the fundamentals of brush handling, ink preparation, and the spiritual discipline required to create beautiful characters that connect you to thousands of years of artistic tradition.',
    curriculum: ['Brush Techniques', 'Character Formation', 'Ink & Paper', 'Artistic Expression'],
    wishlist: false,
  },
  {
    id: 4,
    title: 'Meditation in Sacred Gardens',
    creator: 'Guru Priya',
    thumbnail: '/images/default-course-thumbnail.svg',
    rating: 4.9,
    students: 1567,
    duration: '12 weeks',
    category: 'Spirituality',
    price: 399,
    enrolled: false,
    createdAt: '2024-03-01',
    description: 'Find inner peace through ancient meditation techniques.',
    longDescription:
      'Journey into the depths of consciousness through time-honored meditation practices performed in sacred garden settings. Guru Priya will teach you various meditation techniques, breathing exercises, and mindfulness practices that have been used for centuries to achieve inner peace and spiritual awakening.',
    curriculum: [
      'Breathing Techniques',
      'Mindfulness Practice',
      'Garden Meditation',
      'Spiritual Awakening',
    ],
    wishlist: false,
  },
  {
    id: 5,
    title: 'Legendary Sword Forging',
    creator: 'Blacksmith Tanaka',
    thumbnail: '/images/default-course-thumbnail.svg',
    rating: 4.6,
    students: 423,
    duration: '10 weeks',
    category: 'Crafts',
    price: 599,
    enrolled: false,
    createdAt: '2024-02-15',
    description: 'Learn to forge legendary weapons using ancient techniques.',
    longDescription:
      'Master the ancient art of sword forging with traditional Japanese techniques passed down through generations of master swordsmiths. Learn to work with fire, steel, and spirit to create blades of exceptional beauty and strength. This intensive course covers everything from selecting raw materials to the final polishing of your masterpiece.',
    curriculum: ['Steel Selection', 'Fire & Forge', 'Blade Shaping', 'Final Polish'],
    wishlist: true,
  },
  {
    id: 6,
    title: 'Phoenix Dance Performance',
    creator: 'Dancer Mei Lin',
    thumbnail: '/images/default-course-thumbnail.svg',
    rating: 4.8,
    students: 789,
    duration: '8 weeks',
    category: 'Dance',
    price: 349,
    enrolled: false,
    createdAt: '2024-01-10',
    description: 'Master the graceful movements of the mythical Phoenix dance.',
    longDescription:
      'Embody the grace and power of the mythical Phoenix through this enchanting dance form. Dancer Mei Lin will teach you the flowing movements, symbolic gestures, and emotional expression that bring this legendary creature to life through dance. Perfect for those seeking to connect with ancient mythology through movement.',
    curriculum: [
      'Basic Movements',
      'Symbolic Gestures',
      'Costume & Props',
      'Performance Techniques',
    ],
    wishlist: false,
  },
]

const categories = ['All', 'Martial Arts', 'Culture', 'Arts', 'Spirituality', 'Crafts', 'Dance']
const sortOptions = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

interface Course {
  id: number
  title: string
  creator: string
  thumbnail: string
  rating: number
  students: number
  duration: string
  category: string
  price: number
  enrolled: boolean
  createdAt: string
  description: string
  longDescription: string
  curriculum: string[]
  wishlist: boolean
}

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popularity')
  const [showBanner, setShowBanner] = useState(true)

  // Simulate loading courses
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setCourses(mockCourses)
      setLoading(false)
    }
    loadCourses()
  }, [])

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.students - a.students
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        default:
          return 0
      }
    })

    return filtered
  }, [courses, searchQuery, selectedCategory, sortBy])

  const handleEnroll = (courseId: number) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === courseId ? { ...course, enrolled: true } : course)),
    )
    const course = courses.find((c) => c.id === courseId)
    toast.success(`You've successfully enrolled in "${course?.title}". Start learning now!`)
  }

  const handleWishlist = (courseId: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, wishlist: !course.wishlist } : course,
      ),
    )
    const course = courses.find((c) => c.id === courseId)
    const isAdding = !course?.wishlist
    toast.success(
      isAdding
        ? `"${course?.title}" has been added to your wishlist.`
        : `"${course?.title}" has been removed from your wishlist.`,
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSortBy('popularity')
  }

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'All' || sortBy !== 'popularity'

  const handleLoadMore = () => {
    // TODO: Implement load more functionality
    console.log('Load more courses')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDE0] via-[#F0E6D6] to-[#EBE0CC]">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-200/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <CourseCatalogBanner showBanner={showBanner} onClose={() => setShowBanner(false)} />
        <CourseCatalogPageHeader />

        <CourseCatalogHeader
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <ResultsCount count={filteredAndSortedCourses.length} loading={loading} />

        <CourseCatalogGrid
          courses={filteredAndSortedCourses}
          loading={loading}
          onEnroll={handleEnroll}
          onWishlist={handleWishlist}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <LoadMoreButton
          hasMoreCourses={!loading && filteredAndSortedCourses.length > 0}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  )
}
