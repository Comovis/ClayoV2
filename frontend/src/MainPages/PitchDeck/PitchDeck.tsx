"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Import all slide components
import CoverSlide from "./Slides/CoverSlide1"
import ProblemSlide from "./Slides/ProblemSlide2"
import SolutionSlide from "./Slides/SolutionSlide3"
import TechnologySlide from "./Slides/TechnologySlide4"
import VisionSlide from "./Slides/VisionSlide5"
import MarketSlide from "./Slides/MarketSlide6"
import BusinessModelSlide from "./Slides/BusinessModel7"
import TractionSlide from "./Slides/TractionSlide8"
import MarketStrategySlide from "./Slides/MarketStrategySlide9"
import FinancialsSlide from "./Slides/FinancialsSlide10"
import TeamSlide from "./Slides/TeamSlide11"
import InvestmentSlide from "./Slides/InvestmentSlide12"

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 12

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const slides = [
    <CoverSlide key="cover" />,
    <ProblemSlide key="problem" />,
    <SolutionSlide key="solution" />,
    <TechnologySlide key="technology" />,
    <VisionSlide key="vision" />,
    <MarketSlide key="market" />,
    <BusinessModelSlide key="business-model" />,
    <TractionSlide key="traction" />,
    <MarketStrategySlide key="market-strategy" />,
    <FinancialsSlide key="financials" />,
    <TeamSlide key="team" />,
    <InvestmentSlide key="investment" />,
  ]

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={prevSlide} disabled={currentSlide === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${currentSlide === index ? "bg-blue-600" : "bg-gray-300"}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          <Button variant="outline" onClick={nextSlide} disabled={currentSlide === totalSlides - 1}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
