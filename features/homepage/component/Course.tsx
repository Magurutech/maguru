import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Star, BookOpen, Award } from 'lucide-react'
import Image from 'next/image'

export default function Course() {
  const courses = [
    {
      id: 1,
      title: 'Petualangan Matematika Nusantara',
      description:
        'Belajar matematika dengan cerita petualangan di kepulauan Indonesia yang menakjubkan',
      instructor: 'Prof. Sari Dewi',
      rating: 4.9,
      students: 1250,
      duration: '8 minggu',
      level: 'Pemula',
      price: 'Rp 299.000',
      originalPrice: 'Rp 599.000',
      image: '/globe.svg',
      category: 'Matematika',
      badge: 'Terpopuler',
    },
    {
      id: 2,
      title: 'Legenda Bahasa Indonesia',
      description: 'Menguasai bahasa Indonesia melalui cerita rakyat dan legenda yang memikat',
      instructor: 'Dr. Budi Santoso',
      rating: 4.8,
      students: 890,
      duration: '6 minggu',
      level: 'Menengah',
      price: 'Rp 249.000',
      originalPrice: 'Rp 499.000',
      image: '/globe.svg',
      category: 'Bahasa',
      badge: 'Terbaru',
    },
    {
      id: 3,
      title: 'Sains Alam Magis',
      description: 'Eksplorasi sains dengan pendekatan fantasy dan eksperimen yang menakjubkan',
      instructor: 'Dr. Maya Indira',
      rating: 4.7,
      students: 675,
      duration: '10 minggu',
      level: 'Lanjutan',
      price: 'Rp 399.000',
      originalPrice: 'Rp 799.000',
      image: '/globe.svg',
      category: 'Sains',
      badge: 'Eksklusif',
    },
  ]

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Terpopuler':
        return 'bg-primary-500 text-white'
      case 'Terbaru':
        return 'bg-accent-500 text-white'
      case 'Eksklusif':
        return 'bg-secondary-500 text-beige-900'
      default:
        return 'bg-beige-500 text-white'
    }
  }

  return (
    <section className="py-20 bg-ancient-fantasy relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 text-6xl opacity-10 whimsical-bounce">📚</div>
      <div className="absolute bottom-10 left-10 text-4xl opacity-20 whimsical-bounce animation-delay-1000">
        🎓
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-secondary-600" />
            <span className="text-beige-900 font-medium">Kursus Pilihan</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-beige-900 mb-6 font-serif">
            Petualangan Belajar
            <span className="text-gradient-primary block mt-2">Terbaik Untukmu ✨</span>
          </h2>

          <p className="text-xl text-beige-700 max-w-3xl mx-auto leading-relaxed">
            Temukan kursus-kursus berkualitas tinggi yang dirancang khusus untuk mengembangkan
            potensi terbaikmu dengan cara yang menyenangkan dan interaktif
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <Card
              key={course.id}
              className="card-ancient hover-lift group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  width={100}
                  height={100}
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${getBadgeColor(course.badge)} neu-button`}>
                    {course.badge}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="glass-panel px-2 py-1 rounded-full">
                    <span className="text-xs font-semibold text-beige-900">{course.level}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-beige-900 mb-2 line-clamp-2 group-hover:text-gradient-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-beige-700 text-sm line-clamp-3 mb-3">{course.description}</p>
                  <p className="text-beige-600 text-sm">
                    oleh{' '}
                    <span className="font-semibold text-secondary-600">{course.instructor}</span>
                  </p>
                </div>

                {/* Course Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-beige-700">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary-400 text-secondary-400" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-beige-900">{course.price}</span>
                    <span className="text-sm text-beige-600 line-through">
                      {course.originalPrice}
                    </span>
                  </div>
                  <div className="glass-panel px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-accent-600">50% OFF</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full btn-primary hover-glow">🚀 Mulai Belajar</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="btn-secondary hover-glow text-lg px-8 py-4 border-2"
          >
            <Award className="w-5 h-5 mr-2" />
            Lihat Semua Kursus
          </Button>
        </div>
      </div>
    </section>
  )
}
