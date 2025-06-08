import Hero from "./HeroSection"
import Features from "./FeaturesSection"
import HowItWorks from "./HowItWorks"
import Testimonials from "./Testimonials"
import PricingSection from "./PricingSection"
import InteractiveDemo from "./InteractiveDemo"
import CallToAction from "./CallToAction"
import Footer from "./Footer"


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
   
      <Hero />
      <Features />
      <InteractiveDemo />
     
      <PricingSection />
      <Testimonials />
    
   
      <CallToAction />
    
    </div>
  )
}
