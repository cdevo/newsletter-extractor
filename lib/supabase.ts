import { createClient } from '@supabase/supabase-js'
import { NewsletterAd } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<{
  public: {
    Tables: {
      newsletter_details: {
        Row: NewsletterAd
      }
    }
  }
}>(supabaseUrl, supabaseAnonKey)