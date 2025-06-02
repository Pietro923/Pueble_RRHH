import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Archive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { db } from "@/lib/supabaseConfig";
import { useTranslation } from "react-i18next";

interface Recordatorio {
  id: string;
  tipo: string;
  descripcion: string;
  fechaInicio: string; // ISO date string
  fechaFin: string;
  empleadoId: string;
  nombre: string;
  apellido: string;
  empresa: string;
  archivedAt?: string;
}

const NotificationBell = () => {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [, setCompanies] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener empresas (Grupo_Pueble) — supondremos que es una tabla en Supabase
        const { data: empresas, error: empresaError } = await db.from("Grupo_Pueble").select("nombre");
        if (empresaError) throw empresaError;

        const companyNames = empresas?.map(e => e.nombre) || [];
        setCompanies(companyNames);

        // Obtener recordatorios de todas las empresas
        let allRecordatorios: Recordatorio[] = [];

        for (const empresa of companyNames) {
          const { data: recordatoriosEmpresa, error: recordatorioError } = await db
            .from("recordatorios")
            .select("*")
            .eq("empresa", empresa);

          if (recordatorioError) continue;

          if (recordatoriosEmpresa) {
            const mapeados = recordatoriosEmpresa.map(r => ({
              ...r,
              empresa,
            })) as Recordatorio[];

            allRecordatorios = [...allRecordatorios, ...mapeados];
          }
        }

        const activos = allRecordatorios.filter(r => {
          const days = differenceInDays(new Date(r.fechaFin), new Date());
          return days >= -1;
        });

        activos.sort((a, b) =>
          differenceInDays(new Date(a.fechaFin), new Date(b.fechaFin))
        );

        setRecordatorios(activos);
        setUnreadCount(activos.length);

      } catch (err) {
        console.error("Error al obtener recordatorios:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const archiveNotification = async (recordatorio: Recordatorio) => {
    try {
      // Eliminar de recordatorios
      const { error: deleteError } = await db
        .from("recordatorios")
        .delete()
        .eq("id", recordatorio.id)
        .eq("empresa", recordatorio.empresa);

      if (deleteError) throw deleteError;

      // Insertar en archivados
      const { error: insertError } = await db
        .from("notificaciones_archivadas")
        .insert({
          ...recordatorio,
          archivedAt: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      // Actualizar estado local
      setRecordatorios(prev => prev.filter(r => r.id !== recordatorio.id));
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error("Error al archivar:", err);
    }
  };

  const getStatusColor = (recordatorio: Recordatorio) => {
    if (recordatorio.tipo === "Cumpleaños") return "text-blue-600";
    const daysRemaining = differenceInDays(new Date(recordatorio.fechaFin), new Date());
    if (daysRemaining > 5) return "text-green-600";
    if (daysRemaining > 0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative dark:text-white">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">{unreadCount}</span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <p className="font-semibold">{t("notificationBell.title")}</p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {recordatorios.length > 0 ? (
            recordatorios.map((r) => (
              <DropdownMenuItem key={r.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600">
                <div className="space-y-1 w-full">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className={`font-medium ${getStatusColor(r)}`}>
                        {r.tipo}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-white">{r.empresa}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-white">
                        {format(new Date(r.fechaFin), "dd MMM", { locale: es })}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault();
                          archiveNotification(r);
                        }}
                      >
                        <Archive className="h-4 w-4 text-gray-500 dark:text-white" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 dark:text-white">{r.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-white">
                      {r.nombre} {r.apellido}
                    </span>
                    <span className={`font-medium ${getStatusColor(r)}`}>
                      {differenceInDays(new Date(r.fechaFin), new Date()) === 0
                        ? t("notificationBell.status.todayExpires")
                        : `${Math.abs(differenceInDays(new Date(r.fechaFin), new Date()))} ${t("notificationBell.status.daysRemaining", { days: Math.abs(differenceInDays(new Date(r.fechaFin), new Date())) })}`
                      }
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-gray-500">
              {t("notificationBell.noReminders")}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
