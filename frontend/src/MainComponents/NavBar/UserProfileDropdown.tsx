"use client"

import { useState } from "react"
import type { FC } from "react"
import { LogOut, Settings, CreditCard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SettingsModal } from "./Settings/SettingsModal"
import { useUser } from "../../Auth/Contexts/UserContext"

// Update the UserType interface to match the User interface from UserContext
interface UserProfileDropdownProps {
  user: {
    id?: string
    full_name?: string
    email?: string
    company_id?: string | null
    role?: string
  } | null
  onSignOut: () => void
}

const UserProfileDropdown: FC<UserProfileDropdownProps> = ({ user, onSignOut }) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { isLoggingOut } = useUser()

  if (!user) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <a href="/login">Sign In</a>
      </Button>
    )
  }

  // Update to use full_name instead of name
  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : user.email
      ? user.email[0].toUpperCase()
      : "U"

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full p-0 border-0 bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 z-50" sideOffset={5}>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.full_name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              {user.role && <p className="text-xs leading-none text-muted-foreground">{user.role}</p>}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile & Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => (window.location.href = "/pricing")}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Pricing</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onSignOut} disabled={isLoggingOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing out...
              </span>
            ) : (
              <span>Sign out</span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}

export default UserProfileDropdown
