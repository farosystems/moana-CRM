// ============================================
// CLIENTE DE SUPABASE - SERVIDOR - CRM MOANA
// ============================================
// Configuración del cliente de Supabase para uso en Server Components
// ============================================

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // La función set puede fallar en Server Components
            // Esto es normal y se puede ignorar
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // La función remove puede fallar en Server Components
            // Esto es normal y se puede ignorar
          }
        },
      },
    }
  )
}
