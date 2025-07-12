import { Navbar } from '@/features/homepage/component/Navbars'
import { Heros } from '@/features/homepage/component/Heros'
import Course from '@/features/homepage/component/Course'
import { Feature } from '@/features/homepage/component/Feature'
import { Testimonials } from '@/features/homepage/component/Testimonial'
import { Stats } from '@/features/homepage/component/Stat'
import { CTA } from '@/features/homepage/component/Cts'
import Footers from '@/features/homepage/component/Footers'

export default function Home() {
  return (
    <div className="min-h-screen bg-ancient-fantasy">
      <Navbar />
      <main>
        <Heros />
        <Course />
        <Feature />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footers />
    </div>
  )
}
