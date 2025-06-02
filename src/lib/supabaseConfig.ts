// lib/supabaseConfig.ts
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configurar persistencia de sesión (equivalente a browserSessionPersistence)
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Exportar instancias específicas para facilitar el uso
export const auth = supabase.auth
export const db = supabase // Para operaciones de base de datos
export const storage = supabase.storage

export default supabase