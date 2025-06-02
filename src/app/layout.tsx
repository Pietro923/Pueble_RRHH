"use client";
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabaseConfig";
import { Sonner, Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import NotificationBell from '@/components/notificaciones';
import { AppSettingsProvider } from "@/components/appSettingsProvider";
import '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import type { User } from '@supabase/supabase-js';

const inter = Inter({ subsets: ['latin'] });

type Role = "ADMIN" | "rrhh" | "nominas";

interface UserProfile {
  id: string;
  email: string;
  role: Role;
  name?: string;
  avatar_url?: string;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Función para obtener el perfil del usuario
    async function fetchUserProfile(userId: string) {
      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          // Si no existe el perfil, redirigir a login
          if (error.code === 'PGRST116') { // No rows returned
            setIsAuthenticated(false);
            router.push('/login');
            return;
          }
        }

        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        setIsAuthenticated(false);
        router.push('/login');
      }
    }

    // Verificar sesión inicial
    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsAuthenticated(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          await fetchUserProfile(session.user.id);
        } else {
          setIsAuthenticated(false);
          if (!isLoggingOut && pathname !== '/login') {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setIsAuthenticated(false);
      }
    }

    getInitialSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
          if (!isLoggingOut && pathname !== '/login') {
            router.push('/login');
          }
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
          // Opcionalmente refrescar el perfil
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router, isLoggingOut]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      document.body.style.pointerEvents = 'auto';
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        return;
      }

      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <html lang="es">
        <body className={inter.className}>
          <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600">{t('loading.label')}</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Login page
  if (!isAuthenticated && pathname === '/login') {
    return (
      <html lang="es">
        <body className={inter.className}>
          <main className="min-h-screen">
            {children}
            <Toaster />
          </main>
        </body>
      </html>
    );
  }

  // Si está autenticado pero no tiene perfil, mostrar loading
  if (isAuthenticated && !userProfile) {
    return (
      <html lang="es">
        <body className={inter.className}>
          <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600">Cargando perfil...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  const userName = userProfile?.name || user?.email || 'Usuario';
  const userAvatarUrl = userProfile?.avatar_url;

  return (
    <html lang="es">
      <body className={`${inter.className} dark:bg-gray-900`}>
        <AppSettingsProvider>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
              {isSidebarOpen && (
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Sidebar />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Navbar */}
              <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30">
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16">
                    {/* Left section */}
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="mr-4 dark:hover:bg-gray-700"
                      >
                        {isSidebarOpen ? (
                          <X className="h-6 w-6 dark:text-white" />
                        ) : (
                          <Menu className="h-6 w-6 dark:text-white" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Right section */}
                    <div className="flex items-center space-x-4">
                      <NotificationBell />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex items-center space-x-2 dark:text-white">
                            <Avatar className="h-8 w-8">
                              <AvatarImage 
                                src={userAvatarUrl || ""} 
                                alt={`Avatar de ${userName}`}
                              />
                              <AvatarFallback className="bg-blue-600 text-white dark:text-white">
                                {userName?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline-block font-medium dark:text-white">
                              {userName}
                            </span>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className='dark:text-white'>
                            {t('header.myAccount')}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Link href="/perfil">
                            <DropdownMenuItem className='dark:text-white'>
                              {t('header.profile')}
                            </DropdownMenuItem>
                          </Link>
                          <Link href="/configuracion">
                            <DropdownMenuItem className='dark:text-white'>
                              {t('header.settings')}
                            </DropdownMenuItem>
                          </Link>
                          <Link href="/notificaciones">
                            <DropdownMenuItem className='dark:text-white'>
                              {t('header.notificationsHistory')}
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }} 
                                className="text-red-600 dark:hover:text-red-600"
                              >
                                <LogOut className="mr-2 h-4 w-4" />
                                {t('header.logout')}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className='bg-white dark:bg-gray-900 dark:text-white'>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {t('header.logoutConfirmation.title')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('header.logoutConfirmation.description')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className='dark:bg-gray-800 dark:hover:bg-gray-700'>
                                  {t('header.logoutConfirmation.cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleLogout}
                                  className="bg-red-600 hover:bg-red-700 dark:text-white"
                                >
                                  {t('header.logoutConfirmation.confirm')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </header>
              
              {/* Main content area */}
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {children}
                  </motion.div>
                </div>
              </main>
            </div>
            <Toaster />
          </div>
        </AppSettingsProvider>
      </body>
    </html>
  );
}