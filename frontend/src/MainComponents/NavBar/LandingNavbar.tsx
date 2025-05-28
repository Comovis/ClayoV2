"use client"

import type React from "react"

import { ChevronDown, Menu, X, Ship, Anchor, FileText, MapPin } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"
import { useState } from "react"
import UserProfileDropdown from "./UserProfileDropdown"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate("/login")
  }

  const handleDemoRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setDemoModalOpen(false)
      // You would typically send the form data to your backend here
    } catch (error) {
      console.error("Error submitting demo request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-900/95 dark:border-slate-800">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/">
              <img src={LogoBlack || "/placeholder.svg"} alt="Comovis Logo" className="h-6" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white">
                Solutions <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem>
                  <Link to="#document-hub" className="w-full flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Document Hub
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="#port-intelligence" className="w-full flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Port Intelligence
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="#fleet-management" className="w-full flex items-center gap-2">
                    <Ship className="h-4 w-4" />
                    Fleet Management
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="#features"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              Features
            </Link>
            <Link
              to="#demo"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              Demo
            </Link>
            <Link
              to="#pricing"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              Pricing
            </Link>
            <Link
              to="#testimonials"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              Testimonials
            </Link>
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
              <div className="border-b pb-2 dark:border-slate-800">
                <p className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-2">Solutions</p>
                <Link
                  to="#document-hub"
                  className="block py-1 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Document Hub
                </Link>
                <Link
                  to="#port-intelligence"
                  className="block py-1 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Port Intelligence
                </Link>
                <Link
                  to="#fleet-management"
                  className="block py-1 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fleet Management
                </Link>
              </div>

              <Link
                to="#features"
                className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="#demo"
                className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Demo
              </Link>
              <Link
                to="#pricing"
                className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="#testimonials"
                className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
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
      <Dialog open={demoModalOpen} onOpenChange={setDemoModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Anchor className="h-5 w-5 text-slate-800" />
              Book Your Personalised Demo
            </DialogTitle>
            <DialogDescription>
              See how Comovis can help prevent vessel detentions and streamline your maritime compliance.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDemoRequest} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Smith" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="john.smith@company.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company name</Label>
              <Input id="company" placeholder="Shipping Company Ltd." required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fleet-manager">Fleet Manager</SelectItem>
                  <SelectItem value="compliance-officer">Compliance Officer</SelectItem>
                  <SelectItem value="vessel-operator">Vessel Operator</SelectItem>
                  <SelectItem value="port-agent">Port Agent</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fleet-size">Fleet size</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select fleet size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 vessels</SelectItem>
                  <SelectItem value="6-20">6-20 vessels</SelectItem>
                  <SelectItem value="21-50">21-50 vessels</SelectItem>
                  <SelectItem value="51-100">51-100 vessels</SelectItem>
                  <SelectItem value="100+">100+ vessels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">What are your main compliance challenges?</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your current compliance process and challenges..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Scheduling...
                  </>
                ) : (
                  "Schedule Demo"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LandingHeader
