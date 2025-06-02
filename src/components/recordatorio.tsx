"use client";
// ESTE COMPONENTE ES PARA EL COMPONENTE DEL DASHBOARD
import { useEffect, useState } from "react";
import { 
  collection, 
  getDocs, 
  Timestamp,
  doc,
  deleteDoc,
  addDoc
} from "firebase/firestore";
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
  id: string;
  tipo: string;
  descripcion: string;
  fechaInicio: Timestamp;
  fechaFin: Timestamp;
  empleadoId: string;
  nombre: string;
  apellido: string;
  empresa: string; // Agregamos este campo
}

function Recordatorios() {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("Pueble SA - CASE IH");
  const [companies, setCompanies] = useState<string[]>([]); // Empresas dinámicas
  const [, setUnreadCount] = useState(0);
  const [selectedRecordatorio, setSelectedRecordatorio] = useState<Recordatorio | null>(null); // Estado para el recordatorio seleccionado
  const { t } = useTranslation(); // Hook de traducción dentro del componente funcional
  
  // Función para archivar recordatorios de cumpleaños
  const archiveBirthdayReminders = async () => {
    try {
      const q = collection(db, "Grupo_Pueble", selectedCompany, "recordatorios");
      const snapshot = await getDocs(q);
      
      const birthdayRecordatorios = snapshot.docs
        .filter(doc => {
          const recordatorio = doc.data() as Recordatorio;
          // Filtrar solo recordatorios de tipo "Cumpleaños"
          if (recordatorio.tipo === "Cumpleaños") {
            const endDate = recordatorio.fechaFin.toDate();
            const hoursSinceEnd = differenceInHours(new Date(), endDate);
            
            // Si han pasado más de 24 horas desde la fecha de fin
            return hoursSinceEnd > 24;
          }
          return false;
        });

      // Archivar cada recordatorio de cumpleaños
      for (const birthdayDoc of birthdayRecordatorios) {
        const recordatorio = birthdayDoc.data() as Recordatorio;
        
        // Eliminar de la colección original
        const recordatorioRef = doc(db, "Grupo_Pueble", selectedCompany, "recordatorios", birthdayDoc.id);
        await deleteDoc(recordatorioRef);

        // Agregar a la colección de archivados
        const archivedRef = collection(db, "Grupo_Pueble", selectedCompany, "notificaciones_archivadas");
        await addDoc(archivedRef, {
          ...recordatorio,
          archivedAt: Timestamp.now()
        });

        console.log(`Cumpleaños de ${recordatorio.nombre} ${recordatorio.apellido} archivado automáticamente`);
      }
    } catch (error) {
      console.error("Error al archivar recordatorios de cumpleaños:", error);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Obtén referencia a la colección "Grupo_Pueble"
        const collectionRef = collection(db, "Grupo_Pueble");
        
        // Obtén los documentos dentro de la colección
        const snapshot = await getDocs(collectionRef);
        
        // Extrae los nombres de los documentos
        const companyNames = snapshot.docs.map(doc => doc.id);
        
        // Agrega "Todas" al inicio de la lista
        setCompanies([...companyNames]);
      } catch (error) {
        console.error("Error al obtener las compañías:", error);
      }
    };
  
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchRecordatorios = async () => {
      try {
        const q = collection(db, "Grupo_Pueble", selectedCompany, "recordatorios");
        const snapshot = await getDocs(q);
  
        if (snapshot.empty) {
          console.log("No se encontraron recordatorios");
          setRecordatorios([]); // Limpia el estado si no hay recordatorios
          return;
        }
  
        const data: Recordatorio[] = snapshot.docs.map((doc) => {
          const record = doc.data();
          return {
            id: doc.id,
            tipo: record.tipo || "",
            descripcion: record.descripcion || "",
            fechaInicio: record.fechaInicio || Timestamp.fromDate(new Date()),
            fechaFin: record.fechaFin || Timestamp.fromDate(new Date()),
            empleadoId: record.empleadoId || "",
            nombre: record.nombre || "",
            apellido: record.apellido || "",
            empresa: selectedCompany, // Agregamos la empresa actual
          };
        });
  
        console.log("Recordatorios obtenidos:", data);
        setRecordatorios(data);
      } catch (error) {
        console.error("Error al obtener recordatorios:", error);
      }
    };
  
    fetchRecordatorios();
  // Configurar un intervalo para verificar y archivar cada 24 horas
  const archiveInterval = setInterval(archiveBirthdayReminders, 24 * 60 * 60 * 1000);

  // Limpiar el intervalo cuando el componente se desmonte
  return () => {
    clearInterval(archiveInterval);
  };
}, [selectedCompany]);

  const getStatusColor = (recordatorio: Recordatorio) => {
    const today = new Date();
    const endDate = recordatorio.fechaFin.toDate(); // Fin de la fecha del recordatorio
    const daysRemaining = differenceInDays(endDate, today); // Calculamos los días restantes
  
    // Si la notificación es de tipo "Cumpleaños", asignar color azul
    if (recordatorio.tipo === "Cumpleaños") {
      return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:border-blue-600";
    }
  
    // Si faltan más de 5 días
    if (daysRemaining > 5) {
      return "bg-green-50 text-green-600 border-green-200 dark:bg-green-700 dark:text-green-100 dark:border-green-600";
    }
  
    // Si quedan 5 días o menos
    if (daysRemaining > 0) {
      return "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-600";
    }
  
    // Si la fecha es hoy o ya ha pasado
    return "bg-red-50 text-red-600 border-red-200 dark:bg-red-700 dark:text-red-100 dark:border-red-600";
  };

  const archiveNotification = async (recordatorio: Recordatorio) => {
      try {
        // Eliminar de la colección original
        const recordatorioRef = doc(db, "Grupo_Pueble", recordatorio.empresa, "recordatorios", recordatorio.id);
        await deleteDoc(recordatorioRef);
  
        // Agregar a la colección de archivados
        const archivedRef = collection(db, "Grupo_Pueble", recordatorio.empresa, "notificaciones_archivadas");
        await addDoc(archivedRef, {
          ...recordatorio,
          archivedAt: Timestamp.now()
        });
  
        // Actualizar el estado local
        setRecordatorios(prev => prev.filter(r => r.id !== recordatorio.id));
        setUnreadCount(prev => prev - 1);
      } catch (error) {
        console.error("Error al archivar la notificación:", error);
      }
    };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg ">
      <CardHeader className="bg-gray-50 border-b dark:bg-gray-950 dark:text-gray-100">
        {/* Flex container with responsive behavior */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center space-x-3">
            <ClockIcon className="w-6 h-6 text-primary" />
            <span>{t('notificationBell.title')}</span>
          </CardTitle>
          <Select 
          value={selectedCompany} 
          onValueChange={setSelectedCompany}
        >
            <SelectTrigger className="w-full md:w-[250px] bg-white dark:bg-blue-800 border-2 border-blue-300 dark:border-blue-600 hover:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-300">
            <SelectValue 
              placeholder={t('pagedashboard.selectCompanyPlaceholder')} 
              className="text-blue-600 dark:text-blue-200"
            />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-700 shadow-xl">
            {companies.map((company) => (
              <SelectItem 
                key={company} 
                value={company} 
                className="hover:bg-blue-100 dark:hover:bg-blue-800 focus:bg-blue-200 dark:focus:bg-blue-700 transition-colors"
              >
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
            const startDate = recordatorio.fechaInicio.toDate();
            const endDate = recordatorio.fechaFin.toDate();
            const daysRemaining = differenceInDays(endDate, new Date()); // Calculamos los días restantes
            const statusColor = getStatusColor(recordatorio);  // Pasa el objeto recordatorio directamente

  return (
    <div
      key={recordatorio.id}
      className={` 
        ${statusColor} 
        border rounded-xl p-5 space-y-4 
        transform transition-all duration-300 
        hover:scale-105 hover:shadow-xl
      `}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        {/* Badge Section */}
        <Badge variant="outline" className="capitalize flex items-center">
          <InfoIcon className="w-4 h-4 mr-2" />
          {recordatorio.tipo}
        </Badge>

        {/* Name Section */}
        <div className="flex items-center text-xs space-x-2 sm:ml-4">
          <UserIcon className="w-4 h-4" />
          <span>{`${recordatorio.nombre} ${recordatorio.apellido}`}</span>
        </div>
      </div>

      <p className="text-base font-semibold line-clamp-2">
        {recordatorio.descripcion}
      </p>

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

      <div className="flex justify-between items-center pt-2 border-t">
        <span className="text-xs font-medium">
          {daysRemaining > 0
            ? `${daysRemaining} ${t('remainingDays')}`
            : daysRemaining === 0
            ? t('today')
            : t('expired')}
        </span>
        <Dialog>
        <DialogTrigger asChild>
            <div className="flex space-x-2"> {/* Contenedor para agrupar los elementos */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedRecordatorio(recordatorio)} // Establece el recordatorio seleccionado
              >
                {t('details')}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.preventDefault();
                  archiveNotification(recordatorio);
                }}
              >
                <Archive className="h-4 w-4 text-gray-500 dark:text-white" />
              </Button>
            </div>
          </DialogTrigger>

          <DialogContent className={`
        ${statusColor} 
        border-2 border-blue-200 
        rounded-2xl 
        p-6 
        space-y-5 
        max-w-md 
        mx-auto 
        transform 
        transition-all 
        duration-300 
        hover:scale-[1.02] 
        hover:shadow-2xl 
        dark:bg-gray-800 
        dark:border-gray-700
      `}>
            <DialogHeader className="border-b pb-3 mb-2">
            <DialogTitle className="text-2xl font-bold text-blue-800 dark:text-blue-200 flex items-center">
          <Info className="mr-3 w-7 h-7 text-blue-600" />
          {t('reminderDetails')}
        </DialogTitle>
            </DialogHeader>
            <DialogDescription className="space-y-4 text-gray-700 dark:text-gray-200"> 
              {selectedRecordatorio && (
                <>
                  <div className="flex items-center">
                    <Clipboard className="mr-3 w-5 h-5 text-blue-500" />
                    <p>
                      <strong>{t('type')}:</strong> {selectedRecordatorio.tipo}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Info className="mr-3 w-5 h-5 text-blue-500 mt-1" />
                    <p>
                      <strong>{t('description')}:</strong> {selectedRecordatorio.descripcion}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="mr-3 w-5 h-5 text-blue-500" />
                    <p>
                      <strong>{t('employee')}:</strong> {selectedRecordatorio.nombre} {selectedRecordatorio.apellido}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="mr-3 w-5 h-5 text-blue-500" />
                    <p>
                      <strong>{t('startDate')}:</strong> {format(selectedRecordatorio.fechaInicio.toDate(), "PPP", { locale: es })}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="mr-3 w-5 h-5 text-blue-500" />
                    <p>
                      <strong>{t('endDate')}:</strong> {format(selectedRecordatorio.fechaFin.toDate(), "PPP", { locale: es })}
                    </p>
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
})}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">{t('notificationBell.noReminders')}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default Recordatorios;