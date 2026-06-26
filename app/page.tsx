import HeroSection from '@/components/HeroSection'
import ServicesSection from '@/components/ServicesSection'
import WorkingHoursSection from '@/components/WorkingHoursSection'
import ReviewsSection from '@/components/ReviewsSection'
import InstagramSection from '@/components/InstagramSection'
import ContactSection from '@/components/ContactSection'
import StickyBookingBar from '@/components/StickyBookingBar'
import NavTabs from '@/components/NavTabs'

export default function HomePage() {
  return (
    <>
      <NavTabs />
      <main className="pb-28">
        <section id="profil">
          <HeroSection />
        </section>
        <section id="hizmetler" className="px-4 py-6">
          <ServicesSection />
        </section>
        <section id="adres" className="px-4 py-6 border-t border-gray-100">
          <WorkingHoursSection />
          <div className="mt-6">
            <ContactSection />
          </div>
        </section>
        <section id="yorumlar" className="px-4 py-6 border-t border-gray-100">
          <ReviewsSection />
        </section>
        <section id="instagram" className="px-4 py-6 border-t border-gray-100">
          <InstagramSection />
        </section>
      </main>
      <StickyBookingBar />
    </>
  )
}
