/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // Add any other environment variables your project uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
