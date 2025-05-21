import { createClient } from "@supabase/supabase-js"

// Log environment variables (safely)
console.log("Initializing Supabase client...")
console.log("Supabase URL exists:", !!import.meta.env.VITE_SUPABASE_URL)
console.log("Supabase Key exists:", !!import.meta.env.VITE_SUPABASE_ANON_KEY)

// Type checking for environment variables
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY

// Ensure environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  throw new Error("Missing Supabase environment variables")
}

// Log URL prefix (for debugging without exposing full URL)
console.log("Supabase URL prefix:", supabaseUrl.substring(0, 15) + "...")

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
      // Log the request (without exposing sensitive data)
      const url = args[0] as string
      const method = args[1]?.method || "GET"

      // Create a safe URL for logging (remove API keys)
      let safeUrl = url
      if (typeof url === "string") {
        // Remove API key from URL if present
        safeUrl = url.includes("?") ? url.substring(0, url.indexOf("?")) + "?[REDACTED]" : url
      }

      console.log(`Supabase ${method} request to: ${safeUrl}`)
      const startTime = Date.now()

      return fetch(...args)
        .then((response) => {
          const duration = Date.now() - startTime
          console.log(`Supabase response received in ${duration}ms with status: ${response.status}`)
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

// Log when the client is created
console.log("Supabase client created successfully")

// Add a simple test function that can be called to verify connection
export const testSupabaseConnection = async () => {
  console.log("Testing Supabase connection...")
  try {
    const start = Date.now()
    const { data, error } = await supabase.from("users").select("count")
    const duration = Date.now() - start

    if (error) {
      console.error(`Connection test failed after ${duration}ms:`, error)
      return { success: false, error, duration }
    }

    console.log(`Connection test succeeded in ${duration}ms:`, data)
    return { success: true, data, duration }
  } catch (error) {
    console.error("Connection test exception:", error)
    return { success: false, error }
  }
}

// Run a test immediately to check connection
testSupabaseConnection().then((result) => {
  if (result.success) {
    console.log("✅ Initial connection test passed")
  } else {
    console.warn("⚠️ Initial connection test failed")
  }
})
