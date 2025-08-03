import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import TargetGroupSection from '@/components/sections/TargetGroupSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import PackagesSection from '@/components/sections/PackagesSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TargetGroupSection />
        <BenefitsSection />
        <PackagesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}