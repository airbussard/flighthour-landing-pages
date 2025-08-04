import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSectionBusiness from '@/components/sections/firmenevents/HeroSectionBusiness'
import BusinessBenefitsSection from '@/components/sections/firmenevents/BusinessBenefitsSection'
import CorporatePackagesSection from '@/components/sections/firmenevents/CorporatePackagesSection'
import EventSpaceSection from '@/components/sections/firmenevents/EventSpaceSection'
import SimulatorSection from '@/components/sections/SimulatorSection'
import CorporateTestimonialsSection from '@/components/sections/firmenevents/CorporateTestimonialsSection'
import BookingProcessSection from '@/components/sections/firmenevents/BookingProcessSection'
import CorporateCTASection from '@/components/sections/firmenevents/CorporateCTASection'

export default function Firmenevents() {
  return (
    <>
      <Header />
      <main>
        <HeroSectionBusiness />
        <BusinessBenefitsSection />
        <CorporatePackagesSection />
        <EventSpaceSection />
        <SimulatorSection />
        <BookingProcessSection />
        <CorporateTestimonialsSection />
        <CorporateCTASection />
      </main>
      <Footer />
    </>
  )
}