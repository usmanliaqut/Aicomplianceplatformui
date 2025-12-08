import { Hero } from './landing/Hero';
import { Features } from './landing/Features';
import { HowItWorks } from './landing/HowItWorks';
import { Testimonials } from './landing/Testimonials';
import { CTASection } from './landing/CTASection';
import { Footer } from './landing/Footer';
import { Navbar } from './Navbar';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="bg-[#0F172A]">
      <Navbar onNavigate={onNavigate} currentPage="landing" />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}