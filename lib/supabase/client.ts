// ============================================
// CLIENTE DE SUPABASE - CRM MOANA
// ============================================
// Configuración del cliente de Supabase para uso en el navegador
// ============================================

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

// Variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validación de variables de entorno
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL no está definida en las variables de entorno')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida en las variables de entorno')
}

// Crear cliente de Supabase con tipos
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Cliente de Supabase sin tipos (para casos especiales)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
