"use client"

import { Menu, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"
import { useState } from "react"
import UserProfileDropdown from "./UserProfileDropdown"
import BookDemoModal from "./BookDemoModal"

interface UserType {
  id?: string
  name?: string
  email?: string
  profileImage?: string
}

interface LandingHeaderProps {
  user: UserType | undefined
  logout: (() => void) | undefined
}

const LandingHeader = ({ user, logout }: LandingHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate("/login")
  }

  // Function to handle smooth scrolling to section
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/">
              <img src={LogoBlack || "/placeholder.svg"} alt="Comovis Logo" className="h-10" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleScrollToSection("demo")}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              Interactive Demo
            </button>

            <button
              onClick={() => handleScrollToSection("how-it-works")}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              How Comovis Works
            </button>

            <button
              onClick={() => handleScrollToSection("call-to-action")}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              Join Pilot Program
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <UserProfileDropdown user={user} onSignOut={logout} />
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                  onClick={handleLoginClick}
                >
                  Log In
                </Button>
                <Button className="bg-slate-800 hover:bg-slate-700 text-white" onClick={() => setDemoModalOpen(true)}>
                  Book a Demo
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="p-2 mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {user && <UserProfileDropdown user={user} onSignOut={logout} />}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800 absolute top-full left-0 right-0 z-50">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => handleScrollToSection("demo")}
                className="text-left text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Interactive Demo
              </button>

              <button
                onClick={() => handleScrollToSection("how-it-works")}
                className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                How Comovis Works
              </button>

              <button
                onClick={() => handleScrollToSection("call-to-action")}
                className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Join Pilot Program
              </button>

              {!user && (
                <div className="pt-2 flex flex-col space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLoginClick}>
                    Log In
                  </Button>
                  <Button
                    className="w-full bg-slate-800 hover:bg-slate-700"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setDemoModalOpen(true)
                    }}
                  >
                    Book a Demo
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Book Demo Modal */}
      <BookDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </>
  )
}

export default LandingHeader