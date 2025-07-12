import { Course, CourseCatalogItem } from '../types'
import { mockCourseTransformers } from './courseTransformers'

/**
 * Mock Course Data untuk Development/Testing
 *
 * Data ini menggunakan interface Course (database model) dan bisa
 * ditransform ke display models menggunakan courseTransformers
 */

// ============================================================================
// Mock Course : Card Manage Course Role Creator 
// ============================================================================

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Petualangan Matematika Nusantara',
    description: 'Belajar matematika dengan cerita petualangan di kepulauan Indonesia',
    thumbnail: '/globe.svg',
    status: 'PUBLISHED',
    students: 1250,
    lessons: 24,
    duration: '8 jam',
    rating: 4.8,
    category: 'Matematika',
    createdAt: new Date(2024, 0, 15),
    creatorId: '1',
    updatedAt: new Date(2024, 0, 15),
  },
  {
    id: '2',
    title: 'Legenda Bahasa Indonesia',
    description: 'Menguasai bahasa Indonesia melalui cerita rakyat dan legenda',
    thumbnail: '/globe.svg',
    status: 'DRAFT',
    students: 0,
    lessons: 18,
    duration: '6 jam',
    rating: 0,
    category: 'Bahasa',
    createdAt: new Date(2024, 1, 20),
    creatorId: '1',
    updatedAt: new Date(2024, 1, 20),
  },
  {
    id: '3',
    title: 'Sains Alam Magis',
    description: 'Eksplorasi sains dengan pendekatan fantasy dan eksperimen menarik',
    thumbnail: '/globe.svg',
    status: 'PUBLISHED',
    students: 890,
    lessons: 32,
    duration: '12 jam',
    rating: 4.6,
    category: 'Sains',
    createdAt: new Date(2024, 0, 8),
    creatorId: '1',
    updatedAt: new Date(2024, 0, 8),
  },
]

// ============================================================================
// Mock Course : Card Catalog Course Role User 
// ============================================================================

export const mockCoursesCatalog: CourseCatalogItem[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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



/**
 * Mock Data Utilities
 * 
 * Utility functions untuk mengakses mock data dalam format yang berbeda
 * Berguna untuk development, testing, dan prototyping
 */

export const mockCourseUtils = {
  /**
   * Get courses dalam format database model (Course[])
   */
  getCourses: (): Course[] => {
    return mockCourses
  },

  /**
   * Get courses dalam format catalog display (CourseCatalogItem[])
   */
  getCatalogItems: () => {
    return mockCourses.map((course) => mockCourseTransformers.toCatalogItem(course))
  },

  /**
   * Get courses dalam format detail view (CourseDetailView[])
   */
  getDetailViews: () => {
    return mockCourses.map((course) => mockCourseTransformers.toDetailView(course))
  },

  /**
   * Get single course by ID dalam format database model
   */
  getCourseById: (id: string): Course | undefined => {
    return mockCourses.find((course) => course.id === id)
  },

  /**
   * Get single course by ID dalam format catalog item
   */
  getCatalogItemById: (id: string) => {
    const course = mockCourses.find((course) => course.id === id)
    return course ? mockCourseTransformers.toCatalogItem(course) : undefined
  },

  /**
   * Get single course by ID dalam format detail view
   */
  getDetailViewById: (id: string) => {
    const course = mockCourses.find((course) => course.id === id)
    return course ? mockCourseTransformers.toDetailView(course) : undefined
  },

  /**
   * Filter courses by category
   */
  getCoursesByCategory: (category: string): Course[] => {
    return mockCourses.filter((course) => course.category === category)
  },

  /**
   * Get published courses only
   */
  getPublishedCourses: (): Course[] => {
    return mockCourses.filter((course) => course.status === 'PUBLISHED')
  },

  /**
   * Get courses by status
   */
  getCoursesByStatus: (status: string): Course[] => {
    return mockCourses.filter((course) => course.status === status)
  },

  /**
   * Search courses by title or description
   */
  searchCourses: (query: string): Course[] => {
    const lowerQuery = query.toLowerCase()
    return mockCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery)
    )
  },
}

// Backward compatibility
export const metadataCourse = mockCourses 