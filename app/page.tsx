import { Hero } from '@/features/homepage/component/Hero';
import { Features } from '@/features/homepage/component/Features';
import { Courses } from '@/features/homepage/component/Courses';
import { Stats } from '@/features/homepage/component/Stats';
import { Testimonials } from '@/features/homepage/component/Testimonials';
import { CTA } from '@/features/homepage/component/Cta';
import { Footer } from '@/features/homepage/component/Footer';
import { Navbar } from '@/features/homepage/component/Navbar';
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
