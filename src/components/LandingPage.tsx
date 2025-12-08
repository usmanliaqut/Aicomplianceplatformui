import { Hero } from './landing/Hero';
import { Features } from './landing/Features';
import { HowItWorks } from './landing/HowItWorks';
import { Testimonials } from './landing/Testimonials';
import { CTASection } from './landing/CTASection';
import { Footer } from './landing/Footer';
import { Navbar } from './Navbar';

export function LandingPage() {
  return (
    <div className="bg-[#0F172A]">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}