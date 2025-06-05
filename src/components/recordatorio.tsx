"use client";
// ESTE COMPONENTE ES PARA EL COMPONENTE DEL DASHBOARD
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseConfig"; // Asegurate de que este archivo esté configurado correctamente
import { db } from "@/lib/supabaseConfig"; // Tu configuración de Firebase
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ClockIcon, 
  CalendarIcon, 
  UserIcon, 
  InfoIcon, 
  Archive,
  Info,
  Clipboard
} from "lucide-react";
import { format, differenceInDays, differenceInHours  } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface Recordatorio {
  id: number;
  tipo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  employee_id: number;
  nombre: string;
  apellido: string;
  empresa: string;
}

export default function Recordatorios() {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("Pueble SA - CASE IH");
  const [companies, setCompanies] = useState<string[]>([]);
  const [, setUnreadCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase.from("companies").select("name");
      if (error) console.error("Error al obtener empresas:", error);
      else setCompanies(data.map((e: any) => e.name));
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchRecordatorios = async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select(`
          id, tipo, descripcion, fecha_inicio, fecha_fin, employee_id,
          employees (
            nombre, apellido, company_id,
            companies ( name )
          )
        `);

      if (error) {
        console.error("Error al obtener recordatorios:", error);
        setRecordatorios([]);
        return;
      }

      const filtrados = (data || [])
        .filter((r: any) => r.employees?.companies?.name === selectedCompany)
        .map((r: any) => ({
          id: r.id,
          tipo: r.tipo,
          descripcion: r.descripcion,
          fecha_inicio: r.fecha_inicio,
          fecha_fin: r.fecha_fin,
          employee_id: r.employee_id,
          nombre: r.employees?.nombre || "",
          apellido: r.employees?.apellido || "",
          empresa: r.employees?.companies?.name || "",
        }));

      setRecordatorios(filtrados);
    };

    fetchRecordatorios();
  }, [selectedCompany]);

  // Podés agregar el archiving automático acá si lo necesitas

  const getStatusColor = (recordatorio: Recordatorio) => {
    const today = new Date();
    const endDate = new Date(recordatorio.fecha_fin);
    const daysRemaining = differenceInDays(endDate, today);

    if (recordatorio.tipo === "Cumpleaños") {
      return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:border-blue-600";
    }
    if (daysRemaining > 5) {
      return "bg-green-50 text-green-600 border-green-200 dark:bg-green-700 dark:text-green-100 dark:border-green-600";
    }
    if (daysRemaining > 0) {
      return "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-600";
    }
    return "bg-red-50 text-red-600 border-red-200 dark:bg-red-700 dark:text-red-100 dark:border-red-600";
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader className="bg-gray-50 border-b dark:bg-gray-950 dark:text-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center space-x-3">
            <ClockIcon className="w-6 h-6 text-primary" />
            <span>{t('notificationBell.title')}</span>
          </CardTitle>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-full md:w-[250px] bg-white dark:bg-blue-800 border-2 border-blue-300 dark:border-blue-600">
              <SelectValue placeholder={t('pagedashboard.selectCompanyPlaceholder')} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-blue-900">
              {companies.map(company => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-6 dark:text-gray-100">
        {recordatorios.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordatorios.map((recordatorio) => {
              const startDate = new Date(recordatorio.fecha_inicio);
              const endDate = new Date(recordatorio.fecha_fin);
              const statusColor = getStatusColor(recordatorio);

              return (
                <div
                  key={recordatorio.id}
                  className={`${statusColor} border rounded-xl p-5 space-y-4 transition-all hover:scale-105 hover:shadow-xl`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <Badge variant="outline" className="capitalize flex items-center">
                      <InfoIcon className="w-4 h-4 mr-2" />
                      {recordatorio.tipo}
                    </Badge>
                    <div className="flex items-center text-xs space-x-2 sm:ml-4">
                      <UserIcon className="w-4 h-4" />
                      <span>{`${recordatorio.nombre} ${recordatorio.apellido}`}</span>
                    </div>
                  </div>

                  <p className="text-base font-semibold line-clamp-2">{recordatorio.descripcion}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{t('startDate')}:</span>
                      </div>
                      <span>{format(startDate, "PPP", { locale: es })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{t('endDate')}:</span>
                      </div>
                      <span>{format(endDate, "PPP", { locale: es })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {t('notificationBell.noNotifications')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}