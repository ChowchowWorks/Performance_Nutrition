import { createClient } from "@supabase/supabase-js"
import { auth } from "./firebase"

const supabaseURL = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseURL,
  supabaseKey,
  {
    accessToken: async () => {
      const user = auth.currentUser

      if (!user) {
        return null
      }

      return await user.getIdToken(false)
    }
  }
)