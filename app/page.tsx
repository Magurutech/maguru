import { Hero } from '@/features/homepage/component/hero';
import { Features } from '@/features/homepage/component/features';
import { Courses } from '@/features/homepage/component/courses';
import { Stats } from '@/features/homepage/component/stats';
import { Testimonials } from '@/features/homepage/component/testimonials';
import { CTA } from '@/features/homepage/component/cta';
import { Footer } from '@/features/homepage/component/footer';
import { Navbar } from '@/features/homepage/component/navbar';
import CustomCard from '@/features/homepage/component/CustomCard';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent-mint/5">
      <Navbar />
      <Hero />
      <CustomCard title="Welcome to Maguru" actionLabel="Get Started">
        <p>This is a custom card powered by your Tailwind v4 config.</p>
      </CustomCard>
      <Stats />
      <Features />
      <Courses />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
