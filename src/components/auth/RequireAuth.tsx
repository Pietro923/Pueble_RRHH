// components/auth/RequireAuth.tsx
"use client"

import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/supabaseConfig" // Asegúrate de tener configurado tu cliente de Firestore

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth()
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        // Verificar el rol en Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.data()

        if (!userDoc.exists() || userData?.role !== 'ADMIN') {
          // Si no es admin, redirigir a una página de acceso denegado
          router.push('/unauthorized')
          return
        }
      } catch (error) {
        console.error('Error verificando permisos:', error)
        router.push('/unauthorized')
        return
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 " />
      </div>
    )
  }

  return <>{children}</>
}