import { Hero } from '@/features/homepage/hero';
import { Features } from '@/features/homepage/features';
import { Courses } from '@/features/homepage/courses';
import { Stats } from '@/features/homepage/stats';
import { Testimonials } from '@/features/homepage/testimonials';
import { CTA } from '@/features/homepage/cta';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import CustomCard from '@/features/homepage/CustomCard';

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
