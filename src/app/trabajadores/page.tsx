"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabaseConfig";
import { Trash2, Users, List, Cake, Pencil, Linkedin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { differenceInYears, isSameDay } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Employee {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  correo: string;
  fecha_nacimiento: string;
  genero: string;
  estado: 'activo' | 'inactivo';
  titulo: string;
  linkedin?: string;
  sueldo: number;
  bono: number;
  incentivo: number;
  company_id: number;
  department_id: number;
  subdepartment_id: number;
  position_id: number;
  // Datos relacionados (joins)
  company_name?: string;
  department_name?: string;
  subdepartment_name?: string;
  position_name?: string;
}

interface Company {
  id: number;
  name: string;
  group_id: number;
}

interface Department {
  id: number;
  name: string;
  company_id: number;
}

interface Subdepartment {
  id: number;
  name: string;
  department_id: number;
}

interface Position {
  id: number;
  name: string;
  subdepartment_id: number;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("todos");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [birthdayEmployees, setBirthdayEmployees] = useState<Employee[]>([]);
  const { t } = useTranslation();
  const [linkedinValue, setLinkedinValue] = useState('');
  
  // Estados para edición
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);
  const [editingSubDepartmentId, setEditingSubDepartmentId] = useState<number | null>(null);
  const [editingPositionId, setEditingPositionId] = useState<number | null>(null);
  
  const [newEmployee, setNewEmployee] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    titulo: "",
    correo: "",
    fecha_nacimiento: "",
    genero: "",
    sueldo: "",
    bono: "",
    incentivo: "",
    linkedin: ""
  });
  
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [view, setView] = useState("list");
  
  // Estados para las estructuras organizacionales
  const [companies, setCompanies] = useState<Company[]>([]);
  const [subdepartments, setSubdepartments] = useState<Subdepartment[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedSubDepartmentId, setSelectedSubDepartmentId] = useState<number | null>(null);
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null);

  // Función para desactivar empleado
  const handleDeactivate = async (employeeId: number) => {
    if (!employeeId) return;

    try {
      const { error } = await supabase
        .from('employees')
        .update({ estado: 'inactivo' })
        .eq('id', employeeId);

      if (error) throw error;

      // Actualizar estado local
      setEmployees(prevEmployees =>
        prevEmployees.map(employee =>
          employee.id === employeeId ? { ...employee, estado: 'inactivo' } : employee
        )
      );
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error al desactivar el empleado:", error);
    }
  };

  // Cargar empresas
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('name');

        if (error) throw error;
        setCompanies(data || []);
      } catch (error) {
        console.error("Error al obtener las compañías:", error);
      }
    };

    fetchCompanies();
  }, []);

  // Cargar departamentos cuando se selecciona una empresa
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedCompany) {
        setDepartments([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('departments')
          .select('*')
          .eq('company_id', selectedCompany)
          .order('name');

        if (error) throw error;
        setDepartments(data || []);
      } catch (error) {
        console.error('Error al obtener departamentos:', error);
      }
    };

    fetchDepartments();
  }, [selectedCompany]);

  // Cargar subdepartamentos cuando se selecciona un departamento
  useEffect(() => {
    const fetchSubdepartments = async () => {
      const currentDepartmentId = view === "edit" ? editingDepartmentId : selectedDepartmentId;
      
      if (!currentDepartmentId) {
        setSubdepartments([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subdepartments')
          .select('*')
          .eq('department_id', currentDepartmentId)
          .order('name');

        if (error) throw error;
        setSubdepartments(data || []);
      } catch (error) {
        console.error('Error al obtener subdepartamentos:', error);
      }
    };

    fetchSubdepartments();
  }, [selectedDepartmentId, editingDepartmentId, view]);

  // Cargar posiciones cuando se selecciona un subdepartamento
  useEffect(() => {
    const fetchPositions = async () => {
      const currentSubDepartmentId = view === "edit" ? editingSubDepartmentId : selectedSubDepartmentId;
      
      if (!currentSubDepartmentId) {
        setPositions([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('positions')
          .select('*')
          .eq('subdepartment_id', currentSubDepartmentId)
          .order('name');

        if (error) throw error;
        setPositions(data || []);
      } catch (error) {
        console.error('Error al obtener posiciones:', error);
      }
    };

    fetchPositions();
  }, [selectedSubDepartmentId, editingSubDepartmentId, view]);

  // Configurar datos de edición cuando se selecciona un empleado
  useEffect(() => {
    if (editingEmployee && view === "edit") {
      setEditingDepartmentId(editingEmployee.department_id);
      setEditingSubDepartmentId(editingEmployee.subdepartment_id);
      setEditingPositionId(editingEmployee.position_id);
    }
  }, [editingEmployee, view]);

  // Función para verificar cumpleaños
  const checkBirthdays = async (employeesData: Employee[]) => {
    const today = new Date();
    
    // Filtrar empleados que cumplen años hoy
    const birthdays = employeesData.filter(employee => {
      if (!employee.fecha_nacimiento) return false;
      const birthDate = new Date(employee.fecha_nacimiento);
      return isSameDay(
        new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
      );
    });
    
    setBirthdayEmployees(birthdays);

    // Crear recordatorios de cumpleaños
    for (const employee of birthdays) {
      const birthDate = new Date(employee.fecha_nacimiento);
      const age = differenceInYears(new Date(), birthDate);

      try {
        // Verificar si ya existe un recordatorio para hoy
        const { data: existingReminder } = await supabase
          .from('reminders')
          .select('id')
          .eq('employee_id', employee.id)
          .eq('tipo', 'Cumpleaños')
          .gte('fecha_inicio', new Date().toISOString().split('T')[0])
          .lt('fecha_inicio', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

        if (existingReminder && existingReminder.length > 0) {
          console.log(`Ya existe un recordatorio de cumpleaños para ${employee.nombre} ${employee.apellido} hoy.`);
          continue;
        }

        // Crear nuevo recordatorio
        const { error } = await supabase
          .from('reminders')
          .insert({
            employee_id: employee.id,
            tipo: 'Cumpleaños',
            descripcion: `¡${employee.nombre} ${employee.apellido} cumple ${age} años hoy!`,
            fecha_inicio: new Date().toISOString(),
            fecha_fin: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
          });

        if (error) throw error;
        console.log(`Recordatorio de cumpleaños creado para ${employee.nombre} ${employee.apellido}.`);
      } catch (error) {
        console.error("Error al crear notificación de cumpleaños:", error);
      }
    }
  };

  // Cargar empleados
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!selectedCompany) return;

      try {
        const { data, error } = await supabase
          .from('employees')
          .select(`
            *,
            companies!inner(name),
            departments!inner(name),
            subdepartments!inner(name),
            positions!inner(name)
          `)
          .eq('company_id', selectedCompany)
          .eq('estado', 'activo');

        if (error) throw error;

        const employeesData = (data || []).map(emp => ({
          ...emp,
          company_name: emp.companies?.name,
          department_name: emp.departments?.name,
          subdepartment_name: emp.subdepartments?.name,
          position_name: emp.positions?.name
        }));

        setEmployees(employeesData);
        setFilteredEmployees(employeesData);
        checkBirthdays(employeesData);
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
      }
    };

    fetchEmployees();
  }, [selectedCompany]);

  // Filtrar por departamento
  useEffect(() => {
    const filtered = employees.filter(
      emp => selectedDepartment === "todos" || emp.department_id?.toString() === selectedDepartment
    );
    setFilteredEmployees(filtered);
  }, [selectedDepartment, employees]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
  };

  // Función para obtener y actualizar contador
  const getNewEmployeeId = async () => {
    if (!selectedCompany) return null;

    try {
      // Buscar el contador para la empresa
      const { data: companies } = await supabase
        .from('companies')
        .select('name')
        .eq('id', selectedCompany)
        .single();

      if (!companies) return null;

      const { data: counter, error: fetchError } = await supabase
        .from('employee_counters')
        .select('last_id')
        .eq('company_name', companies.name)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const newId = (counter?.last_id || 0) + 1;

      // Actualizar o insertar contador
      const { error: upsertError } = await supabase
        .from('employee_counters')
        .upsert({
          company_name: companies.name,
          last_id: newId
        });

      if (upsertError) throw upsertError;

      return newId;
    } catch (error) {
      console.error("Error al obtener nuevo ID:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompany || !selectedDepartmentId || !selectedSubDepartmentId || !selectedPositionId) {
      alert("Por favor selecciona todos los campos requeridos");
      return;
    }

    try {
      const newEmployeeData = {
        nombre: newEmployee.nombre,
        apellido: newEmployee.apellido,
        dni: parseInt(newEmployee.dni, 10) || null,
        correo: newEmployee.correo,
        fecha_nacimiento: newEmployee.fecha_nacimiento || null,
        genero: newEmployee.genero,
        titulo: newEmployee.titulo,
        sueldo: parseFloat(newEmployee.sueldo) || 0,
        bono: parseFloat(newEmployee.bono) || 0,
        incentivo: parseFloat(newEmployee.incentivo) || 0,
        linkedin: newEmployee.linkedin,
        estado: 'activo',
        company_id: selectedCompany,
        department_id: selectedDepartmentId,
        subdepartment_id: selectedSubDepartmentId,
        position_id: selectedPositionId
      };

      const { error } = await supabase
        .from('employees')
        .insert(newEmployeeData);

      if (error) throw error;

      // Restablecer formulario
      setNewEmployee({
        nombre: "",
        apellido: "",
        dni: "",
        titulo: "",
        correo: "",
        fecha_nacimiento: "",
        genero: "",
        sueldo: "",
        bono: "",
        incentivo: "",
        linkedin: ""
      });

      setSelectedDepartmentId(null);
      setSelectedSubDepartmentId(null);
      setSelectedPositionId(null);

      // Recargar empleados
      const { data, error: fetchError } = await supabase
        .from('employees')
        .select(`
          *,
          companies!inner(name),
          departments!inner(name),
          subdepartments!inner(name),
          positions!inner(name)
        `)
        .eq('company_id', selectedCompany)
        .eq('estado', 'activo');

      if (fetchError) throw fetchError;

      const employeesData = (data || []).map(emp => ({
        ...emp,
        company_name: emp.companies?.name,
        department_name: emp.departments?.name,
        subdepartment_name: emp.subdepartments?.name,
        position_name: emp.positions?.name
      }));

      setEmployees(employeesData);
      setFilteredEmployees(employeesData);
      setView("list");
    } catch (error) {
      console.error("Error al agregar el empleado:", error);
    }
  };

  const handleUpdateLinkedin = async (employeeId: number) => {
    if (!linkedinValue.trim() || !employeeId) return;

    try {
      const { error } = await supabase
        .from('employees')
        .update({ linkedin: linkedinValue.trim() })
        .eq('id', employeeId);

      if (error) throw error;

      // Actualizar estado local
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId ? { ...employee, linkedin: linkedinValue.trim() } : employee
        )
      );

      setLinkedinValue('');
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error al actualizar el LinkedIn:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee?.id) return;

    try {
      const updatedEmployeeData = {
        nombre: editingEmployee.nombre,
        apellido: editingEmployee.apellido,
        dni: parseInt(editingEmployee.dni.toString(), 10) || null,
        correo: editingEmployee.correo,
        fecha_nacimiento: editingEmployee.fecha_nacimiento,
        genero: editingEmployee.genero,
        titulo: editingEmployee.titulo,
        sueldo: parseFloat(editingEmployee.sueldo.toString()) || 0,
        bono: editingEmployee.bono || 0,
        incentivo: editingEmployee.incentivo || 0,
        linkedin: editingEmployee.linkedin,
        department_id: editingDepartmentId,
        subdepartment_id: editingSubDepartmentId,
        position_id: editingPositionId
      };

      const { error } = await supabase
        .from('employees')
        .update(updatedEmployeeData)
        .eq('id', editingEmployee.id);

      if (error) throw error;

      // Actualizar estado local
      setEmployees(prevEmployees =>
  prevEmployees.map(emp =>
    emp.id === editingEmployee.id ? { ...emp, ...updatedEmployeeData } as Employee : emp
  )
);

      setEditingEmployee(null);
      setEditingDepartmentId(null);
      setEditingSubDepartmentId(null);
      setEditingPositionId(null);
      setView("list");
    } catch (error) {
      console.error("Error al actualizar el empleado:", error);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingEmployee) return;
    setEditingEmployee({
      ...editingEmployee,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <div className="space-y-6 p-6 bg-slate-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-2xl">
      {birthdayEmployees.length > 0 && (
        <div className="space-y-4">
          {birthdayEmployees.map((employee) => (
            <Alert 
              key={employee.id} 
              className="bg-white dark:bg-gray-700 border-blue-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                  <Cake className="h-6 w-6 text-blue-600 dark:text-white animate-bounce" />
                </div>
                <div>
                  <AlertTitle className="text-blue-900 dark:text-white font-semibold text-lg">
                    {t('empleados.birthday.title')}
                  </AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-200 text-base">
                    {t('empleados.birthday.description')} <span className="font-bold">{employee.nombre} {employee.apellido}</span>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t('empleados.employeesManagement.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('empleados.employeesManagement.description')}
          </p>
        </div>
  
        <Card className="w-full sm:w-72 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <CardContent className="pt-4 space-y-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 rounded-lg shadow-lg">
            <label className="block text-md font-semibold text-blue-700 dark:text-blue-300 mb-2 transition-colors">
              {t('pagedashboard.selectCompanyLabel')}
            </label>
            <Select 
              value={selectedCompany ? selectedCompany.toString() : ""} 
              onValueChange={(value) => setSelectedCompany(Number(value))}
            >
              <SelectTrigger className="w-full bg-white dark:bg-blue-800 border-2 border-blue-300 dark:border-blue-600 hover:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-300">
                <SelectValue 
                  placeholder={t('pagedashboard.selectCompanyPlaceholder')} 
                  className="text-blue-600 dark:text-blue-200"
                />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-700 shadow-xl">
                {companies.map((company) => (
                  <SelectItem 
                    key={company.id} 
                    value={company.id.toString()}
                    className="hover:bg-blue-100 dark:hover:bg-blue-800 focus:bg-blue-200 dark:focus:bg-blue-700 transition-colors"
                  >
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
  
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button 
          onClick={() => setView("add")} 
          className={`flex-1 sm:flex-none ${view === "add" 
            ? "bg-primary hover:bg-primary/80 text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200" 
            : "bg-white text-primary hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-white"}`}>
          <Users className="mr-2 h-4 w-4" />
          {t('empleados.buttons.addEmployee')}
        </Button>
        <Button 
          onClick={() => setView("list")} 
          className={`flex-1 sm:flex-none ${view === "list" 
            ? "bg-primary hover:bg-primary/80 text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200" 
            : "bg-white text-primary hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-white"}`}>
          <List className="mr-2 h-4 w-4" />
          {t('empleados.buttons.viewEmployeesList')}
        </Button>
      </div>

      {view === "list" && (
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t('empleados.filters.departmentFilterLabel')}
                </label>
                <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('empleados.filters.departmentFilterPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">{t('empleados.filters.allDepartments')}</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {view === "edit" && editingEmployee && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{t('empleados.editEmployee.title')}</CardTitle>
            <CardDescription>
              {t('empleados.editEmployee.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="nombre">
                    {t('empleados.addEmployee.form.fields.nombre.label')}
                  </label>
                  <Input 
                    id="nombre" 
                    name="nombre" 
                    value={editingEmployee.nombre} 
                    onChange={handleEditInputChange} 
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="apellido">
                    {t('empleados.addEmployee.form.fields.apellido.label')}
                  </label>
                  <Input 
                    id="apellido" 
                    name="apellido" 
                    value={editingEmployee.apellido} 
                    onChange={handleEditInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.apellido.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="dni">
                    {t('empleados.addEmployee.form.fields.dni.label')}
                  </label>
                  <Input 
                    id="dni" 
                    name="dni" 
                    value={editingEmployee.dni} 
                    onChange={handleEditInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.dni.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="titulo">
                    {t('empleados.addEmployee.form.fields.titulo.label')}
                  </label>
                  <Input 
                    id="titulo" 
                    name="titulo" 
                    value={editingEmployee.titulo} 
                    onChange={handleEditInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.titulo.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="correo">
                    {t('empleados.addEmployee.form.fields.correo.label')}
                  </label>
                  <Input 
                    id="correo" 
                    name="correo" 
                    value={editingEmployee.correo} 
                    onChange={handleEditInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.correo.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>

                {/* DEPARTAMENTO */}
<div className="space-y-2">
  <label className="text-sm font-medium text-muted-foreground">
    {t('empleados.addEmployee.form.fields.departamento.label')}
  </label>
  <Select 
    value={editingDepartmentId ? editingDepartmentId.toString() : ""} 
    onValueChange={(value) => {
      const id = value ? Number(value) : null;
      setEditingDepartmentId(id);
      setEditingSubDepartmentId(null);
      setEditingPositionId(null);
    }}
  >
    <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
      <SelectValue placeholder={t('empleados.addEmployee.form.fields.departamento.placeholder')} />
    </SelectTrigger>
    <SelectContent>
      {departments.length === 0 ? (
        <SelectItem value="no-departments" disabled>
          No hay departamentos disponibles
        </SelectItem>
      ) : (
        departments.map((dept) => (
          <SelectItem key={dept.id} value={dept.id.toString()}>
            {dept.name}
          </SelectItem>
        ))
      )}
    </SelectContent>
  </Select>
</div>

{/* SUB DEPARTAMENTO */}
<div className="space-y-2">
  <label className="text-sm font-medium text-muted-foreground">
    {t('empleados.addEmployee.form.fields.subdepartamento.label')}
  </label>
  <Select
    value={editingSubDepartmentId ? editingSubDepartmentId.toString() : ""}
    onValueChange={(value) => {
      const id = value ? Number(value) : null;
      setEditingSubDepartmentId(id);
      setEditingPositionId(null);
    }}
    disabled={!editingDepartmentId}
  >
    <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
      <SelectValue placeholder={t('empleados.addEmployee.form.fields.subdepartamento.placeholder')} />
    </SelectTrigger>
    <SelectContent>
      {subdepartments.length === 0 ? (
        <SelectItem value="no-subdepartments" disabled>
          No hay SubDepartamentos disponibles
        </SelectItem>
      ) : (
        subdepartments.map((subDep) => (
          <SelectItem key={subDep.id} value={subDep.id.toString()}>
            {subDep.name}
          </SelectItem>
        ))
      )}
    </SelectContent>
  </Select>
</div>

{/* PUESTO DE TRABAJO */}
<div className="space-y-2">
  <label className="text-sm font-medium text-muted-foreground">
    {t('empleados.addEmployee.form.fields.puesto.label')}
  </label>
  <Select
    value={editingPositionId ? editingPositionId.toString() : ""}
    onValueChange={(value) => {
      const id = value ? Number(value) : null;
      setEditingPositionId(id);
    }}
    disabled={!editingSubDepartmentId}
  >
    <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
      <SelectValue placeholder={t('empleados.addEmployee.form.fields.puesto.placeholder')} />
    </SelectTrigger>
    <SelectContent>
      {positions.length === 0 ? (
        <SelectItem value="no-positions" disabled>
          No hay puestos disponibles
        </SelectItem>
      ) : (
        positions.map((position) => (
          <SelectItem key={position.id} value={position.id.toString()}>
            {position.name}
          </SelectItem>
        ))
      )}
    </SelectContent>
  </Select>
</div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="sueldo">
                    {t('empleados.addEmployee.form.fields.sueldo.label')}
                  </label>
                  <Input 
                    id="sueldo" 
                    name="sueldo" 
                    value={editingEmployee.sueldo} 
                    onChange={handleEditInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.sueldo.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="genero">
                    {t('empleados.addEmployee.form.fields.genero.label')}
                  </label>
                  <div className="flex items-center space-x-6">
                    <label htmlFor="male" className="flex items-center space-x-2">
                      <input
                        id="male"
                        type="radio"
                        name="genero"
                        value="masculino"
                        checked={editingEmployee.genero === "masculino"}
                        onChange={handleEditInputChange} 
                      />
                      <span>{t('empleados.addEmployee.form.fields.genero.options.male')}</span>
                    </label>
                    <label htmlFor="female" className="flex items-center space-x-2">
                      <input
                        id="female"
                        type="radio"
                        name="genero"
                        value="femenino"
                        checked={editingEmployee.genero === "femenino"}
                        onChange={handleEditInputChange} 
                      />
                      <span>{t('empleados.addEmployee.form.fields.genero.options.female')}</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="fecha_nacimiento">
                    {t('empleados.addEmployee.form.fields.fechaNacimiento.label')}
                  </label>
                  <Input 
                    id="fecha_nacimiento" 
                    name="fecha_nacimiento" 
                    type="date" 
                    value={editingEmployee.fecha_nacimiento} 
                    onChange={handleEditInputChange} 
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="linkedin">
                    {t('empleados.addEmployee.form.fields.linkedin.label')}
                  </label>
                  <Input 
                    id="linkedin" 
                    name="linkedin" 
                    value={editingEmployee.linkedin || ''} 
                    onChange={handleEditInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.linkedin.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20" 
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingEmployee(null);
                    setView("list");
                  }}
                >
                  {t('empleados.editEmployee.buttoncancel')}
                </Button>
                <Button type="submit">
                  {t('empleados.editEmployee.button')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {view === "add" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{t('empleados.addEmployee.title')}</CardTitle>
            <CardDescription>
              {t('empleados.addEmployee.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="nombre">
                    {t('empleados.addEmployee.form.fields.nombre.label')}
                  </label>
                  <Input 
                    id="nombre" 
                    name="nombre" 
                    value={newEmployee.nombre} 
                    onChange={handleInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.nombre.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="apellido">
                    {t('empleados.addEmployee.form.fields.apellido.label')}
                  </label>
                  <Input 
                    id="apellido" 
                    name="apellido" 
                    value={newEmployee.apellido} 
                    onChange={handleInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.apellido.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="dni">
                    {t('empleados.addEmployee.form.fields.dni.label')}
                  </label>
                  <Input 
                    id="dni" 
                    name="dni" 
                    value={newEmployee.dni} 
                    onChange={handleInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.dni.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="titulo">
                    {t('empleados.addEmployee.form.fields.titulo.label')}
                  </label>
                  <Input 
                    id="titulo" 
                    name="titulo" 
                    value={newEmployee.titulo} 
                    onChange={handleInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.titulo.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="correo">
                    {t('empleados.addEmployee.form.fields.correo.label')}
                  </label>
                  <Input 
                    id="correo" 
                    name="correo" 
                    value={newEmployee.correo} 
                    onChange={handleInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.correo.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>

                {/* DEPARTAMENTO */}
<div className="space-y-2">
  <label className="text-sm font-medium text-muted-foreground">
    {t('empleados.addEmployee.form.fields.departamento.label')}
  </label>
  <Select 
    value={selectedDepartmentId ? selectedDepartmentId.toString() : ""} 
    onValueChange={(value) => {
      const id = value ? Number(value) : null;
      setSelectedDepartmentId(id);
      setSelectedSubDepartmentId(null);
      setSelectedPositionId(null);
    }}
  >
    <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
      <SelectValue placeholder={t('empleados.addEmployee.form.fields.departamento.placeholder')} />
    </SelectTrigger>
    <SelectContent>
      {departments.length === 0 ? (
        <SelectItem value="no-departments" disabled>
          No hay departamentos disponibles
        </SelectItem>
      ) : (
        departments.map((dept) => (
          <SelectItem key={dept.id} value={dept.id.toString()}>
            {dept.name}
          </SelectItem>
        ))
      )}
    </SelectContent>
  </Select>
</div>

{/* SUB DEPARTAMENTO */}
<div className="space-y-2">
  <label className="text-sm font-medium text-muted-foreground">
    {t('empleados.addEmployee.form.fields.subdepartamento.label')}
  </label>
  <Select
    value={selectedSubDepartmentId ? selectedSubDepartmentId.toString() : ""}
    onValueChange={(value) => {
      const id = value ? Number(value) : null;
      setSelectedSubDepartmentId(id);
      setSelectedPositionId(null);
    }}
    disabled={!selectedDepartmentId}
  >
    <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
      <SelectValue placeholder={t('empleados.addEmployee.form.fields.subdepartamento.placeholder')} />
    </SelectTrigger>
    <SelectContent>
      {subdepartments.length === 0 ? (
        <SelectItem value="no-subdepartments" disabled>
          No hay SubDepartamentos disponibles
        </SelectItem>
      ) : (
        subdepartments.map((subDep) => (
          <SelectItem key={subDep.id} value={subDep.id.toString()}>
            {subDep.name}
          </SelectItem>
        ))
      )}
    </SelectContent>
  </Select>
</div>

{/* PUESTO DE TRABAJO */}
<div className="space-y-2">
  <label className="text-sm font-medium text-muted-foreground">
    {t('empleados.addEmployee.form.fields.puesto.label')}
  </label>
  <Select
    value={selectedPositionId ? selectedPositionId.toString() : ""}
    onValueChange={(value) => {
      const id = value ? Number(value) : null;
      setSelectedPositionId(id);
    }}
    disabled={!selectedSubDepartmentId}
  >
    <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
      <SelectValue placeholder={t('empleados.addEmployee.form.fields.puesto.placeholder')} />
    </SelectTrigger>
    <SelectContent>
      {positions.length === 0 ? (
        <SelectItem value="no-positions" disabled>
          No hay puestos disponibles
        </SelectItem>
      ) : (
        positions.map((position) => (
          <SelectItem key={position.id} value={position.id.toString()}>
            {position.name}
          </SelectItem>
        ))
      )}
    </SelectContent>
  </Select>
</div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="sueldo">
                    {t('empleados.addEmployee.form.fields.sueldo.label')}
                  </label>
                  <Input 
                    id="sueldo" 
                    name="sueldo" 
                    value={newEmployee.sueldo} 
                    onChange={handleInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.sueldo.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="genero">
                    {t('empleados.addEmployee.form.fields.genero.label')}
                  </label>
                  <div className="flex items-center space-x-6">
                    <label htmlFor="male" className="flex items-center space-x-2">
                      <input
                        id="male"
                        type="radio"
                        name="genero"
                        value="masculino"
                        checked={newEmployee.genero === "masculino"}
                        onChange={handleInputChange}
                      />
                      <span>{t('empleados.addEmployee.form.fields.genero.options.male')}</span>
                    </label>
                    <label htmlFor="female" className="flex items-center space-x-2">
                      <input
                        id="female"
                        type="radio"
                        name="genero"
                        value="femenino"
                        checked={newEmployee.genero === "femenino"}
                        onChange={handleInputChange}
                      />
                      <span>{t('empleados.addEmployee.form.fields.genero.options.female')}</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="fecha_nacimiento">
                    {t('empleados.addEmployee.form.fields.fechaNacimiento.label')}
                  </label>
                  <Input 
                    id="fecha_nacimiento" 
                    name="fecha_nacimiento" 
                    type="date" 
                    value={newEmployee.fecha_nacimiento} 
                    onChange={handleInputChange} 
                    className="focus:ring-2 focus:ring-primary/20"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="linkedin">
                    {t('empleados.addEmployee.form.fields.linkedin.label')}
                  </label>
                  <Input 
                    id="linkedin" 
                    name="linkedin" 
                    value={newEmployee.linkedin} 
                    onChange={handleInputChange} 
                    placeholder={t('empleados.addEmployee.form.fields.linkedin.placeholder')}
                    className="focus:ring-2 focus:ring-primary/20" 
                  />
                </div>

              </div>
              <div className="flex justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                  {t('empleados.buttons.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {view === "list" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('empleados.employeesList.headers.nombre')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.apellido')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.dni')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.titulo')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.correo')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.departamento')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.subdepartamento')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.puesto')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.sueldo')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.genero')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.fechaNacimiento')}</TableHead>
              <TableHead>{t('empleados.employeesList.headers.acciones')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="dark:hover:backdrop-brightness-125 dark:hover:text-primary dark:hover:shadow-md dark:transition-all dark:duration-300 rounded-lg">
            {filteredEmployees
              .filter(employee => employee.estado === 'activo')
              .map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.nombre}</TableCell>
                  <TableCell>{employee.apellido}</TableCell>
                  <TableCell>{employee.dni}</TableCell>
                  <TableCell>{employee.titulo}</TableCell>
                  <TableCell>{employee.correo}</TableCell>
                  <TableCell>{employee.department_name}</TableCell>
                  <TableCell>{employee.subdepartment_name}</TableCell>
                  <TableCell>{employee.position_name}</TableCell>
                  <TableCell>${employee.sueldo}</TableCell>
                  <TableCell>{employee.genero}</TableCell>
                  <TableCell>
  {employee.fecha_nacimiento ? (
    isNaN(new Date(employee.fecha_nacimiento).getTime()) ? (
      t('empleados.employeesList.invalidDate')
    ) : (
      new Date(employee.fecha_nacimiento).toLocaleDateString('es-ES', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    )
  ) : (
    t('empleados.employeesList.noDate')
  )}
</TableCell>

                  <TableCell className="space-x-2">
                    {employee.linkedin ? (
                      <a 
                        href={employee.linkedin.startsWith('http') ? employee.linkedin : `https://${employee.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline">
                          <Linkedin className="h-4 w-4 dark:text-white text-black" />
                        </Button>
                      </a>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline">
                            <Linkedin className="h-4 w-4 text-black dark:text-white" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-gray-950 dark:text-white">
                          <AlertDialogTitle>{t('empleados.linkedin.title')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {`${t('empleados.linkedin.titlept1')} ${employee.nombre} ${employee.apellido} ${t('empleados.linkedin.titlept2')}`}
                            <br />
                            {t('empleados.linkedin.description')}
                          </AlertDialogDescription>
                          <Input
                            className="dark:text-white text-black"
                            placeholder="www.linkedin.com/in/"
                            value={linkedinValue}
                            onChange={(e) => setLinkedinValue(e.target.value)}
                          />
                          <div className="flex justify-end space-x-2">
                            <AlertDialogCancel onClick={() => setSelectedEmployee(null)}>
                              {t('empleados.linkedin.button1')}
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleUpdateLinkedin(employee.id)}>
                              {t('empleados.linkedin.button2')}
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingEmployee(employee);
                        setView("edit");
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white dark:bg-gray-950 dark:text-white">
                        <AlertDialogTitle>
                          {`${t('empleados.baja.title')} ${employee.nombre} ${employee.apellido}?`}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('empleados.baja.description')}
                        </AlertDialogDescription>
                        <div className="flex justify-end space-x-2">
                          <AlertDialogCancel onClick={() => setSelectedEmployee(null)}>
                            {t('empleados.baja.button1')}
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeactivate(employee.id)}>
                            {t('empleados.baja.button2')}
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
