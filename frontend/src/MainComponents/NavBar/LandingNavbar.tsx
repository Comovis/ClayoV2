"use client"

import { ChevronDown, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"
import { useState } from "react"
import UserProfileDropdown from "./UserProfileDropdown"

interface UserType {
  id?: string
  name?: string
  email?: string
  profileImage?: string
}

interface LandingHeaderProps {
  user: UserType | null
  logout: () => void
}

const LandingHeader = ({ user, logout }: LandingHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-900/95 dark:border-slate-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
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
                <Link href="#document-hub" className="w-full">
                  Document Hub
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#port-intelligence" className="w-full">
                  Port Intelligence
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#fleet-management" className="w-full">
                  Fleet Management
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="#features"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
          >
            Features
          </Link>
          <Link
            href="#demo"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
          >
            Demo
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
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
              >
                Log In
              </Button>
              <Button className="bg-slate-800 hover:bg-slate-700 text-white">Book a Demo</Button>
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
                href="#document-hub"
                className="block py-1 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Document Hub
              </Link>
              <Link
                href="#port-intelligence"
                className="block py-1 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Port Intelligence
              </Link>
              <Link
                href="#fleet-management"
                className="block py-1 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fleet Management
              </Link>
            </div>

            <Link
              href="#features"
              className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            {!user && (
              <div className="pt-2 flex flex-col space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  Log In
                </Button>
                <Button className="w-full bg-slate-800 hover:bg-slate-700">Book a Demo</Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default LandingHeader
