import { createClient } from "@supabase/supabase-js"

// Type checking for environment variables
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY

// Ensure environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Ensures that session is persisted across page reloads
    storage: localStorage, // Store the session and PKCE-related data in localStorage
  },
})
