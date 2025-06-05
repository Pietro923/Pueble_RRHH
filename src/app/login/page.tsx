"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslation } from "react-i18next"
import { supabase } from "@/lib/supabaseConfig"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    document.body.style.pointerEvents = 'auto'
    return () => {
      document.body.style.pointerEvents = 'auto'
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setError(t('login.contraseña_incorrecta'))
      } else {
        setError(t('login.error_autenticacion'))
      }
    } else {
      router.push("/") // Redirige al home o page.tsx
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950">
      {/* Sección izquierda: Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-20">
        <div className="max-w-md w-full mx-auto space-y-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-8"
          >
            <img
              src="/logos sin fondo_Mesa de trabajo 1 copia 4.png"
              alt="Logo"
              className="h-40 w-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8 border-none shadow-2xl rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('login.bienvenido')}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('login.ingresa_credenciales')}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <Label htmlFor="email" className="text-sm font-medium dark:text-gray-300">
                        {t('login.correo_electronico')}
                      </Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('login.placeholder_email')}
                          required
                          className="pl-10 h-12 bg-gray-50/50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-800 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <Label htmlFor="password" className="text-sm font-medium dark:text-gray-300">
                        {t('login.contraseña')}
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t('login.placeholder_password')}
                          required
                          className="pl-10 h-12 bg-gray-50/50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-800 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="rounded-xl">
                      <AlertCircle className="h-4 w-4 dark:text-red-400" />
                      <AlertDescription className="dark:text-gray-300">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:from-blue-700 dark:to-purple-700 dark:hover:from-blue-800 dark:hover:to-purple-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{t('login.iniciando_sesion')}</span>
                      </div>
                    ) : (
                      t('login.iniciar_sesion')
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Sección derecha: Ilustración */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 dark:bg-gray-900">
        <div className="w-full flex flex-col items-center justify-center p-12 space-y-8">
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src="/zafra.jpg"
            alt="Ilustración de progreso"
            className="max-w-md w-full h-auto hover:scale-105 transition-transform duration-300"
          />
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center space-y-4 max-w-md"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('login.gestiona_proyectos')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t('login.monitorea_progreso')}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
