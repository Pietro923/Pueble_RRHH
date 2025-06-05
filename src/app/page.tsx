"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseConfig";
import { differenceInYears, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutDashboard, Users, Calculator, Shield, Cake } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Employee {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  company_id?: number;
}

export default function Inicio() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [birthdayEmployees, setBirthdayEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();

  const checkBirthdays = async () => {
    const today = new Date();
    
    try {
      // Obtener empleados - usando la nueva tabla 'employees'
      const { data: employees, error: empError } = await supabase
        .from("employees")
        .select(`
          id,
          nombre,
          apellido,
          fecha_nacimiento,
          company_id,
          companies (
            name
          )
        `);

      if (empError) {
        console.error("Error fetching employees:", empError.message);
        return;
      }

      // Filtrar empleados que cumplen años hoy
      const birthdays = employees?.filter((employee: Employee) => {
        if (!employee.fecha_nacimiento) return false;
        
        const birthDate = new Date(employee.fecha_nacimiento + "T00:00:00");
        return isSameDay(
          new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
        );
      }) || [];

      setBirthdayEmployees(birthdays);

      // Crear recordatorios de cumpleaños
      for (const employee of birthdays) {
        // Verificar si ya existe un recordatorio para hoy
        const { data: existingReminders } = await supabase
          .from("reminders")
          .select("*")
          .eq("employee_id", employee.id)
          .eq("tipo", "Cumpleaños")
          .gte("fecha_inicio", new Date(today.setHours(0, 0, 0, 0)).toISOString())
          .lte("fecha_fin", new Date(today.setHours(23, 59, 59, 999)).toISOString());

        if (!existingReminders || existingReminders.length === 0) {
          const age = differenceInYears(new Date(), new Date(employee.fecha_nacimiento));
          
          await supabase.from("reminders").insert({
            tipo: "Cumpleaños",
            descripcion: `¡${employee.nombre} ${employee.apellido} cumple ${age} años hoy!`,
            fecha_inicio: new Date().toISOString(),
            fecha_fin: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
            employee_id: employee.id,
          });
        }
      }
    } catch (error) {
      console.error("Error in checkBirthdays:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          
          // Si el usuario no existe en la tabla users, crear un registro básico
          if (userError.code === 'PGRST116') {
            const { data: newUser, error: createError } = await supabase
              .from("users")
              .insert({
                id: user.id,
                email: user.email || '',
                role: 'rrhh' // rol por defecto
              })
              .select("role")
              .single();

            if (createError) {
              setError("No se pudo crear el perfil del usuario.");
              setLoading(false);
              return;
            }

            if (newUser) {
              setUserRole(newUser.role);
            }
          } else {
            setError("No se pudo obtener el rol del usuario.");
            setLoading(false);
            return;
          }
        } else if (userData) {
          setUserRole(userData.role);
        }

        await checkBirthdays();
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        setError("Error al cargar los datos del usuario.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-72" />
          <Skeleton className="h-48 w-72" />
          <Skeleton className="h-48 w-72" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const roleCards = [
    {
      role: "ADMIN",
      title: t("dashboard.roles.ADMIN.title"),
      description: t("dashboard.roles.ADMIN.description"),
      icon: Shield,
      path: "/admin",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      role: "RRHH",
      title: t("dashboard.roles.RRHH.title"),
      description: t("dashboard.roles.RRHH.description"),
      icon: Users,
      path: "/trabajadores",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      role: "NOMINAS",
      title: t("dashboard.roles.NOMINAS.title"),
      description: t("dashboard.roles.NOMINAS.description"),
      icon: Calculator,
      path: "/nominas",
      color: "bg-yellow-500/10 text-yellow-500",
    },
  ];

  return (
    <div className="bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-2xl border-none rounded-2xl overflow-hidden dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 border-b dark:border-gray-700">
            <CardTitle className="text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {t('dashboard.welcomeMessage', { userRole: userRole || 'Usuario' })}
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2 text-gray-600 dark:text-gray-300 font-medium">
              {t('dashboard.selectOptionMessage')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid gap-6">
              {/* Birthday Employees Section */}
              {birthdayEmployees.length > 0 && (
                <div className="space-y-4">
                  {birthdayEmployees.map((employee) => (
                    <Alert 
                      key={employee.id} 
                      className="border-transparent bg-blue-50/50 dark:bg-gray-700/50 
                        transition-all duration-300 ease-in-out 
                        hover:scale-[1.02] hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-full">
                          <Cake className="h-7 w-7 text-blue-600 dark:text-blue-300 animate-bounce" />
                        </div>
                        <div>
                          <AlertTitle className="text-blue-900 dark:text-white font-bold text-lg">
                            {t('empleados.birthday.title')}
                          </AlertTitle>
                          <AlertDescription className="text-blue-800 dark:text-blue-200 text-base">
                            {t('empleados.birthday.description')} <span className="font-extrabold">{employee.nombre} {employee.apellido}</span>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
  
              {/* Dashboard Cards */}
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Dashboard Card */}
                <Card className="group overflow-hidden transition-all duration-300 
                  hover:shadow-xl hover:scale-[1.02] 
                  dark:bg-gray-700/50 dark:hover:bg-gray-600/60
                  w-full max-w-md mx-auto">
                  <CardContent className="flex flex-col sm:flex-row items-center p-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center w-full">
                      <div className="bg-blue-500/10 dark:bg-blue-500/20 p-4 rounded-xl 
                        transition-all group-hover:rotate-6 group-hover:scale-110 mr-4">
                        <LayoutDashboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-1">
                          {t('dashboard.mainDashboard')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-base">
                          {t('dashboard.mainDashboardDescription')}
                        </p>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto mt-4 sm:mt-0">
                      <Button
                        onClick={() => router.push('/dashboard')}
                        variant="default"
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 
                          dark:bg-blue-700 dark:hover:bg-blue-600 
                          transition-all duration-300 
                          px-4 py-2 rounded-lg"
                      >
                        {t('dashboard.access')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
  
                {/* Role-specific Cards */}
                {roleCards.map((card) => (
                  userRole?.toUpperCase() === card.role && (
                    <Card 
                      key={card.role} 
                      className="group overflow-hidden transition-all duration-300  
                        hover:shadow-xl hover:scale-[1.02] 
                        dark:bg-gray-700/50 dark:hover:bg-gray-600/60
                        w-full max-w-md mx-auto"
                    >
                      <CardContent className="flex flex-col sm:flex-row items-center p-6 space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center w-full">
                          <div className={`p-4 rounded-xl 
                            transition-all group-hover:rotate-6 group-hover:scale-110 
                            ${card.color} dark:opacity-80 mr-4`}>
                            <card.icon className="h-7 w-7 dark:text-white" />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-1">
                              {card.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-base">
                              {card.description}
                            </p>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto mt-4 sm:mt-0">
                          <Button
                            onClick={() => router.push(card.path)}
                            variant="default"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 
                              dark:bg-blue-700 dark:hover:bg-blue-600 
                              transition-all duration-300 
                              px-4 py-2 rounded-lg"
                          >
                            {t('dashboard.access')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}