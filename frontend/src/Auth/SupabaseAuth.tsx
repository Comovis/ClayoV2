import { createClient } from "@supabase/supabase-js"

// Type checking for environment variables
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY

// Ensure environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  throw new Error("Missing Supabase environment variables")
}

// Create and export the Supabase client with enhanced logging
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Ensures that session is persisted across page reloads
    storage: localStorage, // Store the session and PKCE-related data in localStorage
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (...args) => {
      const startTime = Date.now()

      return fetch(...args)
        .then((response) => {
          return response
        })
        .catch((error) => {
          const duration = Date.now() - startTime
          console.error(`Supabase request failed after ${duration}ms:`, error)
          throw error
        })
    },
  },
  db: {
    schema: "public",
  },
})

// Add a simple test function that can be called to verify connection
export const testSupabaseConnection = async () => {
  try {
    const start = Date.now()
    const { data, error } = await supabase.from("users").select("count")
    const duration = Date.now() - start

    if (error) {
      console.error(`Connection test failed after ${duration}ms:`, error)
      return { success: false, error, duration }
    }

    return { success: true, data, duration }
  } catch (error) {
    console.error("Connection test exception:", error)
    return { success: false, error }
  }
}

// Run a test immediately to check connection
testSupabaseConnection()