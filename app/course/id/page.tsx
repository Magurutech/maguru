import { CourseDetailPage } from '@/features/course/components/course-detail/CourseDetailPage'

// Mock course data - in a real app, this would come from an API
const mockCourse = {
  id: 'ancient-wisdom-101',
  title: 'Ancient Wisdom: Philosophy of the East',
  description:
    'Embark on a transformative journey through the philosophical traditions of Ancient Asia. Discover timeless wisdom from Confucius, Lao Tzu, and Buddha that remains relevant in our modern world.',
  thumbnail: '/vercel.svg',
  instructor: {
    name: 'Master Li Wei',
    avatar: '/vercel.svg',
    bio: 'Master Li Wei is a renowned scholar of Eastern philosophy with over 20 years of teaching experience. He holds a PhD in Comparative Philosophy from Beijing University.',
    credentials: [
      'PhD in Comparative Philosophy',
      '20+ years teaching experience',
      'Published author of 5 books',
    ],
    rating: 4.9,
    students: 15420,
  },
  rating: 4.8,
  totalRatings: 2847,
  students: 12543,
  duration: '8 weeks',
  level: 'Beginner',
  language: 'English',
  price: 299,
  originalPrice: 399,
  category: 'Philosophy',
  lastUpdated: '2024-01-15',
  certificate: true,
  downloadableResources: 25,
  articlesCount: 12,
  videosCount: 45,
  totalHours: 24,
  enrolled: false,
  inWishlist: false,
  learningOutcomes: [
    'Understand core principles of Confucianism, Taoism, and Buddhism',
    'Apply ancient wisdom to modern life challenges',
    'Develop mindfulness and meditation practices',
    'Gain historical context of Eastern philosophical traditions',
  ],
  requirements: [
    'No prior knowledge of philosophy required',
    'Open mind and willingness to explore new perspectives',
    'Basic English reading comprehension',
  ],
  curriculum: [
    {
      title: 'Introduction to Eastern Philosophy',
      lessons: 6,
      duration: '3 hours',
      lessons_detail: [
        { title: 'What is Eastern Philosophy?', duration: '25 min', type: 'video', preview: true },
        { title: 'Historical Context', duration: '30 min', type: 'video' },
        { title: 'Key Differences from Western Thought', duration: '20 min', type: 'article' },
      ],
    },
    {
      title: 'Confucianism: The Way of Virtue',
      lessons: 8,
      duration: '4 hours',
      lessons_detail: [
        { title: 'Life of Confucius', duration: '35 min', type: 'video' },
        { title: 'The Analects', duration: '40 min', type: 'video' },
        { title: 'Virtue Ethics in Practice', duration: '25 min', type: 'interactive' },
      ],
    },
    {
      title: 'Taoism: The Natural Way',
      lessons: 7,
      duration: '3.5 hours',
      lessons_detail: [
        { title: 'Lao Tzu and the Tao Te Ching', duration: '30 min', type: 'video' },
        { title: 'Wu Wei: Action through Non-Action', duration: '25 min', type: 'video' },
        { title: 'Meditation Practice', duration: '20 min', type: 'practice' },
      ],
    },
  ],
  reviews: [
    {
      id: 1,
      user: 'Sarah Chen',
      avatar: '/vercel.svg',
      rating: 5,
      date: '2024-01-10',
      comment:
        "Absolutely transformative course! Master Li Wei's teaching style is engaging and the content is profound yet accessible.",
      helpful: 24,
    },
    {
      id: 2,
      user: 'David Kumar',
      avatar: '/vercel.svg',
      rating: 5,
      date: '2024-01-08',
      comment:
        'The practical applications of ancient wisdom to modern life are incredible. Highly recommend!',
      helpful: 18,
    },
  ],
}

export default function CoursePage() {
  return <CourseDetailPage course={mockCourse} />
}
