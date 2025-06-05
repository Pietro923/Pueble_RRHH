"use client";
import { Users, Calendar, BarChart2, DollarSign, Gift, BookOpen, LayoutDashboard, Clipboard, AlarmClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabaseConfig'; // Tu configuración de Supabase

type Role = "admin" | "rrhh" | "nominas";

interface UserProfile {
  id: string;
  email: string;
  role: Role;
}

const NavLink = ({ href, icon: Icon, label, isActive, onClick }: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`
      group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium
      transition-all duration-300 ease-in-out
      hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 
      dark:hover:from-blue-900 dark:hover:to-blue-800
      ${isActive 
        ? "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 text-blue-600 dark:text-blue-400" 
        : "text-gray-600 dark:text-gray-300"}
    `}
  >
    <span className={`
      absolute left-0 top-0 h-full w-0.5 rounded-full
      transition-all duration-300 ease-out
      ${isActive ? "bg-blue-600" : "bg-transparent"}
      group-hover:bg-blue-600 group-hover:h-full
    `} />
    
    <Icon className={`
      mr-3 h-5 w-5
      transition-all duration-300 ease-in-out
      ${isActive 
        ? "text-blue-600 dark:text-blue-400" 
        : "text-gray-500 dark:text-gray-400"}
      group-hover:text-blue-600 dark:group-hover:text-blue-400
      group-hover:scale-110
    `} />
    
    <span className={`
      transition-all duration-300 ease-in-out
      group-hover:translate-x-1
      ${isActive 
        ? "font-semibold" 
        : "font-medium"}
    `}>
      {label}
    </span>
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const sidebarItems: Record<Role, { href: string; icon: React.ElementType; label: string }[]> = {
    admin: [
      { href: "/dashboard", icon: LayoutDashboard, label: t('menu.ADMIN.0.label') },
      { href: "/trabajadores", icon: Users, label: t('menu.ADMIN.1.label') },
      { href: "/asistencia", icon: Calendar, label: t('menu.ADMIN.2.label') },
      { href: "/desempeno", icon: BarChart2, label: t('menu.ADMIN.3.label') },
      { href: "/nominas", icon: DollarSign, label: t('menu.ADMIN.4.label') },
      { href: "/beneficios", icon: Gift, label: t('menu.ADMIN.5.label') },
      { href: "/cursos", icon: BookOpen, label: t('menu.ADMIN.6.label') },
      { href: "/postulaciones", icon: Clipboard, label: t('menu.ADMIN.7.label') },
      { href: "/recordatorios", icon: AlarmClock, label: t('menu.ADMIN.8.label') },
    ],
    rrhh: [
      { href: "/dashboard", icon: LayoutDashboard, label: t('menu.ADMIN.0.label') },
      { href: "/trabajadores", icon: Users, label: t('menu.ADMIN.1.label') },
      { href: "/asistencia", icon: Calendar, label: t('menu.rrhh.0.label') },
      { href: "/desempeno", icon: BarChart2, label: t('menu.rrhh.1.label') },
      { href: "/beneficios", icon: Gift, label: t('menu.rrhh.2.label') },
      { href: "/cursos", icon: BookOpen, label: t('menu.rrhh.3.label') },
      { href: "/recordatorios", icon: AlarmClock, label: t('menu.rrhh.4.label') },
    ],
    nominas: [
      { href: "/dashboard", icon: LayoutDashboard, label: t('menu.ADMIN.0.label') },
      { href: "/nominas", icon: DollarSign, label: t('menu.nominas.1.label') },
      { href: "/recordatorios", icon: AlarmClock, label: t('menu.nominas.2.label') },
    ],
  };

  // Obtener el rol del usuario desde Supabase
  useEffect(() => {
    async function getUserRole() {
      try {
        // Verificar si hay una sesión activa
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          return;
        }

        // Obtener el perfil del usuario con su rol
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setLoading(false);
          return;
        }

        setUserRole(userProfile?.role as Role || null);
      } catch (error) {
        console.error('Error in getUserRole:', error);
      } finally {
        setLoading(false);
      }
    }

    getUserRole();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          getUserRole();
        } else if (event === 'SIGNED_OUT') {
          setUserRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Mostrar loading o nada si no hay rol
  if (loading) {
    return (
      <div className="hidden md:block w-64 border-r bg-background dark:border-gray-700 dark:bg-gray-900 shadow-lg h-screen">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-500">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!userRole || !(userRole in sidebarItems)) return null;

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4 bg-white dark:bg-gray-900"> 
      <div className="flex-1 flex flex-col gap-6">
        {/* Logo Section */}
        <div className="flex items-center justify-center py-4">
          <Link href="/" className="flex items-center justify-center group">
            <img
              src="/logos sin fondo_Mesa de trabajo 1 copia 4.png"
              alt="Pueble S.A Logo"
              className="h-32 w-auto object-contain transition-all duration-500 ease-in-out transform group-hover:scale-110 group-hover:brightness-110 dark:brightness-75 dark:hidden"
            />
            <img
             src="/logos sin fondo_Mesa de trabajo 1 copia 4.png"
              alt="Pueble S.A Logo"
              className="h-32 w-auto object-contain transition-all duration-500 ease-in-out transform group-hover:scale-110 group-hover:brightness-110 hidden dark:block"
            />
          </Link>
        </div>
        
        <Separator className="opacity-50 dark:opacity-20" />
        
        {/* Navigation Links */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {sidebarItems[userRole].map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>  
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 
            hover:bg-blue-50 hover:text-blue-600 
            dark:hover:bg-blue-900 dark:hover:text-blue-400
            transition-all duration-300 bg-white dark:bg-gray-800"
          >
            ☰
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 dark:bg-gray-900">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-background dark:border-gray-700 dark:bg-gray-900 shadow-lg h-screen">
        <SidebarContent />
      </aside>
    </>
  );
}