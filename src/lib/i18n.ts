// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Recursos de traducción
const resources = {
    en: {
        translation: {
          settings: {
            title: 'Settings',
            description: 'Manage your application preferences',
            appearance: 'Appearance and Regional',
            appearanceDescription: 'Customize application appearance and regional preferences'
          },
          theme: {
            label: 'Theme',
            light: 'Light',
            dark: 'Dark',
            system: 'System'
          },
          fontSize: {
            label: 'Font Size',
            small: 'Small',
            normal: 'Normal',
            large: 'Large'
          },
          language: {
            label: 'Language',
            placeholder: 'Select a language',
            es: 'Spanish',
            en: 'English',
            fr: 'French'
          },
          buttons: {
            save: 'Save Changes'
          },
          notifications: {
            saveSuccess: {
              title: 'Settings Updated',
              description: 'Changes have been saved successfully'
            },
            saveError: {
              title: 'Error',
              description: 'Could not update settings'
            }
          },
          loading: {
            label: 'Loading...'
          },
          header: {
            myAccount: "My Account",
            profile: "Profile",
            settings: "Settings",
            notificationsHistory: "Notifications History",
            logout: "Log Out",
            logoutConfirmation: {
              title: "Are you sure?",
              description: "This action will log you out. You will need to log back in to access your account.",
              cancel: "Cancel",
              confirm: "Log Out"
            }
          },
          sidebar: {
            toggle: "Open/Close Sidebar"
          },
          dashboard: {
            welcomeMessage: "Welcome {{userRole}}",
            selectOptionMessage: "Select one of the following options to get started",
            mainDashboard: "Main Dashboard",
            mainDashboardDescription: "Access the main dashboard of the system",
            access: "Access",
            roles: {
              ADMIN: {
                title: "Administration",
                description: "Access the full system administration panel"
              },
              RRHH: {
                title: "Human Resources",
                description: "Manage HR processes and personnel"
              },
              NOMINAS: {
            title: "Payroll",
                description: "Manage payroll and employee payments"
              }
            }
          },
          menu: {
            ADMIN: [
              { "href": "/dashboard", "label": "Dashboard" },
              { "href": "/trabajadores", "label": "Employees" },
              { "href": "/asistencia", "label": "Attendance" },
              { "href": "/desempeno", "label": "Performance" },
              { "href": "/nominas", "label": "Payroll" },
              { "href": "/beneficios", "label": "Benefits" },
              { "href": "/cursos", "label": "Training" },
              { "href": "/postulaciones", "label": "Applications" },
              { "href": "/recordatorios", "label": "Reminders" }
            ],
            rrhh: [
              { "href": "/asistencia", "label": "Attendance" },
              { "href": "/desempeno", "label": "Performance" },
              { "href": "/beneficios", "label": "Benefits" },
              { "href": "/cursos", "label": "Training" },
              { "href": "/recordatorios", "label": "Reminders" }
            ],
            nominas: [
              { "href": "/trabajadores", "label": "Employees" },
              { "href": "/nominas", "label": "Payroll" },
              { "href": "/recordatorios", "label": "Reminders" }
            ]
          },
          adminPanel: {
                userTab:"Create User",
                companyTab:"Add Company",
                selectCompanyLabel:"Company",
                departmentNameLabel:"New Department",
                departmentNamePlaceholder:"Enter Department",
                createDepartmentButton:"Create Department",
                selectDepartmentLabel:"Select Department",
                selectDepartmentPlaceholder:"Department",
                subdepartmentNameLabel:"New Sub Department",
                subdepartmentNamePlaceholder:"Enter New Sub Department",
                createSubdepartmentButton:"Create Sub Department",
                selectSubdepartmentLabel:"Select Sub Department",
                selectSubdepartmentPlaceholder:"Sub Department",
                jobPositionNameLabel:"New Job Position",
                jobPositionNamePlaceholder:"Job Position",
                createJobPositionButton:"Create New Position",
                deptoTab:"Manage Departments",
                companyNameLabel:"Enter the name of the Company",
                companyNamePlaceholder:"New Company",
                loadingCreateCompanyButton:"Adding...",
                createCompanyButton:"Add",
                title: "Admin Panel",
                createUserDescription: "Create a new user in the system",
                emailLabel: "Email Address",
                passwordLabel: "Password",
                roleLabel: "User Role",
                selectRolePlaceholder: "Select a role",
                emailPlaceholder: "email@example.com",
                roleAdmin: "Administrator",
                roleRrhh: "Human Resources",
                roleNominas: "Payroll",
                createUserButton: "Create User",
                loadingCreateUserButton: "Creating user...",
                successMessage: "User {email} successfully created with role {role}",
                errorMessage: "Error creating user. Please try again.",
                errorInvalidResponse: "Server error: Invalid response",
                noAdminSession: "No active admin session"
            },
            notificationBell: {
                title: "Reminders",
                noNotifications: "No pending reminders",
                status: {
                  todayExpires: "Expires today",
                  daysRemaining: "days remaining",
                  expired: "days expired"
                },
                company: "Company",
                description: "Description",
                archive: "Archive",
                reminder: "Reminder"
              },
              statusColors: {
                green: "text-green-600",
                yellow: "text-yellow-600",
                red: "text-red-600"
              },
              dropdown: {
                reminderHeader: "Reminders",
                archiveNotification: "Archive notification"
              },
              selectCompany: "Select company",
              details: "Details",
              start: "Start",
              end: "End",
              today: "Today",
              expired: "Expired",
              remainingDays: "days remaining",
              description: "Description",
              reminderDetails: "Reminder details",
              type: "Type",
              employee: "Employee",
              startDate: "Start Date",
              endDate: "End Date",

              graficotorta:{
                card:{
                  title:"Employee Distribution by Gender",
                  description:"Total employees:",
                  description2:"The number of employees is divided between men and women.",
                  genre:"man",
                  genre2:"woman"
                }
              },
              unauthorized:{
                card:{
                  title:"Access Denied",
                  content:"You do not have permission to access this page.",
                  button:"Back"
                }
              },
              recordatorios: {
                toast: {
                  description1: "Please complete all fields",
                  description2: "The end date cannot be earlier than the start date",
                  description3: "Selected employee not found",
                  title4: "Success!",
                  description4: "Reminder added successfully",
                  description5: "Error saving the reminder"
                },
                card: {
                  title: "New Reminder",
                  label1: "Company",
                  label1PlaceHolder: "Select Company",
                  label2: "Employee",
                  label2PlaceHolder: "Select Employee",
                  label3: "Reminder Type",
                  label3PlaceHolder1: "Select type",
                  label3PlaceHolder2: "Vacation",
                  label3PlaceHolder3: "Leave",
                  label4: "Start Date",
                  label4PlaceHolder: "Select date",
                  label5: "End Date",
                  label5PlaceHolder: "Select date",
                  label6: "Description",
                  label6PlaceHolder: "Additional details",
                  button: "Save Reminder"
                },
              },
              postulaciones: {
                toast: {
                  title1: "Invalid URL",
                  description1: "Please enter a valid LinkedIn Jobs URL",
                  title2: "Posting Added",
                  description2: "The posting has been successfully added",
                  title3: "Error",
                  description3: "Could not add the posting",
                  title4: "Posting Archived",
                  description4: "The posting has been archived",
                  title5: "Error",
                  description5: "Could not archive the posting",
                  title6: "Posting Deleted",
                  description6: "The posting has been deleted",
                  title7: "Error",
                  description7: "Could not delete the posting",
                  title8: "Employee Registered",
                  description8: "The employee has been successfully registered",
                  title9: "Error",
                  description9: "Could not register the employee"
                },
                jobApplications: {
                  header: {
                    title: "Job Postings",
                    searchButton: "Add Search",
                    eliminar: "Delete",
                    archivar: "Archive",
                    detalles: "Details",
                    detallespublicacion: "Posting Details",
                    informaciondetallada: "Detailed information of the archived posting",
                    informacionpublicacion: "Posting Information",
                    titulo: "Title",
                    descripcion: "Description",
                    cancelar: "Cancel",
                    agregar: "Add",
                    registrar: "Register",
                    empleadocontratado: "Hired Employee",
                    nombrecom: "Full Name",
                    dni: "ID Number",
                    correo: "Email",
                    depto: "Department",
                    subdepto: "Sub Department",
  puesto: "Position",
                    genero: "Gender",
                    fechanac: "Date of Birth",
                    sueldo: "Salary",
                    cerrar: "Close",
                    agg: "Add New Posting",
                    contrataste: "Did you hire someone for this position?",
                    si: "Yes",
                    no: "No",
                    registrarnuevoempleado: "Register New Employee",
                    titulodelapubli: "Publication Title",
                    activa: "Active",
                    archivada: "Archived",
                  },
                  searchPlaceholder: "Search by title or company...",
                  addJob: {
                    urlPlaceholder: "Paste LinkedIn Jobs URL",
                    addButton: "Add Posting",
                    loading: "Loading..."
                  },
                  noResults: "No postings match the search.",
                  details: {
                    viewDetailsButton: "View details",
                    dialog: {
                      archiveButton: "Archive",
                      deleteButton: "Delete",
                      deleteIcon: "Delete",
                      viewOnLinkedIn: "View on LinkedIn",
                      registerEmployeeDialog: {
                        title: "Register new employee?",
                        description: "Do you want to register the new employee before archiving the posting?",
                        archiveOnly: "Archive only",
                        registerEmployee: "Register employee"
                      },
                      registerEmployeeForm: {
                        title: "Register new employee",
                        fields: {
                          name: "First Name",
                          lastName: "Last Name",
                          department: "Department",
                          position: "Position",
                          startDate: "Start Date",
                          salary: "Salary"
                        },
                        cancel: "Cancel",
                        register: "Register"
                      }
                    }
                  }
                }
              },
              cursos: {
                title: "Training Programs",
                selectcompany: "Select company",
                toast: {
                  title_course_completed: "Course Completed",
                  description_course_completed: "The course has been completed, you can view details in Archived Courses",
                  title_error_archiving_course: "Error - Course not archived",
                  description_error_archiving_course: "Please try again, an error occurred"
                },
                global_view: {
                  card_title: "Global Course View",
                  select_month_placeholder: "Select month",
                  select_year_placeholder: "Year",
                  table_headers: {
                    employee: "Employee",
                    assigned_courses: "Assigned Courses",
                    progress: "Progress"
                  }
                },
                tabs: {
                  courses_list: "Courses List",
                  calendar: "Calendar",
                  global_view: "Global View",
                  archived_courses: "Archived Courses"
                },
                courses_list: {
                  courses: "Available Courses",
                  add_new_course: "Add New Course",
                  table_headers: {
                    course_name: "Course Name",
                    department: "Department",
                    duration: "Duration",
                    status: "Status",
                    actions: "Actions"
                  },
                  buttons: {
                    details: "Details",
                    assign: "Assign"
                  }
                },
                calendar: {
                  card_title: "Course Calendar"
                },
                archived_courses: {
                  no_courses: "No Archived Courses",
                  card_title: "Completed Courses",
                  table_headers: {
                    course_name: "Course Name",
                    department: "Department",
                    archived_date: "Archived Date",
                    final_status: "Final Status",
                    badge: "Completed"
                  }
                },
                modal: {
                  add_course: {
                    errors: {
                      name_required: "Name Required",
                      start_date_required: "Start Date Required",
                      end_date_required: "End Date Required",
                      invalid_date_range: "Invalid Dates",
                      description_required: "Description Required"
                    },
                    title: "Add New Course",
                    fields: {
                      course_name: "Course Name",
                      course_nameplaceholder: "Course Name",
                      department: "Department",
                      departmentplaceholder: "Department",
                      dateStart: "Start Date",
                      dateEnd: "End Date",
                      duration: "Duration",
                      description: "Description",
                      descriptionplaceholder: "Course description",
                      button1: "Cancel",
                      button2: "Save Course"
                    }
                  }
                },
                details: {
                  title: "Course Details",
                  employeeAssing: "Assigned Employees",
                  employeenofound: "Employee not found",
                  archiveButton: "Archive Course",
                  selectemployeetitle: "Assign Employee to Course",
                  selectemployee: "Select Employee",
                  selectemployeeplaceholder: "Select Employee",
                  selectbutton: "Assign"
                }
              },
              perfil: {
              info_personal: "Personal Information",
              actualizar_info: "Update Personal Information",
              perfil_personal: "Personal Profile",
              descripcion_perfil: "View your personal information and contact details",
              nickname: "Nickname",
              nombre_completo: "Full Name",
              email: "Email",
              telefono: "Phone",
              departamento: "Department",
              biografia: "Biography",
              actualizar_perfil: "Update Personal Profile",
              descripcion_actualizar: "Update your personal information and contact details",
              cambiar_foto: "Change Photo",
              guardar_cambios: "Save Changes",
              cancelar: "Cancel",
              perfil_actualizado: "Profile Updated",
              cambios_guardados: "Changes have been saved successfully.",
              error: "Error",
              guardar_error: "Could not save the changes.",
              url_avatar: "Profile Picture"
            },
            notificaciones:{
              title:"Archived Notifications",
              nonotis:"There are no archived notifications",
              vence:"Expires on"
            },
            login: {
              bienvenido: "Welcome back",
              ingresa_credenciales: "Enter your credentials to continue",
              correo_electronico: "Email Address",
              placeholder_email: "user@company.com",
              contraseña: "Password",
              placeholder_password: "••••••••",
              usuario_no_encontrado: "User not found.",
              contraseña_incorrecta: "Incorrect password.",
              error_autenticacion: "Authentication error. Please try again.",
              iniciar_sesion: "Log In",
              iniciando_sesion: "Logging in...",
              gestiona_proyectos: "Easily manage your projects",
              monitorea_progreso: "Monitor the progress of your projects and keep everything under control from our platform."
            },
            beneficios: {
              page_title: "Employee Benefits",
              page_description: "Discover all the benefits available for our team",
              tabs: {
                printable_list: "Printable List",
                organization_chart: "Organization Chart"
              },
              organization_chart: {
                title: "Company Organization Chart",
                placeholder: "Company Organization Chart"
              },
              benefits_list: {
                title: "Complete Benefits List",
                print_button: "Print"
              },
              categories: {
                free_time: "Free Time",
                health_and_wellness: "Health and Wellness",
                financial_benefits: "Financial Benefits"
              },
              benefits: {
                free_time1: "20 days of paid vacation per year",
                free_time2: "Day off on your birthday",
                free_time3: "Extended paternity leave",
                free_time4: "Extended maternity leave",
                health1: "Comprehensive health insurance for employees and immediate family",
                health2: "Free membership to a local gym",
                financial1: "Pension plan with 5% contribution",
                financial2: "Back-to-school bonus",
                financial3: "Christmas box"
              }
            },
            asistencia: {
              page_title: "Attendance Register",
              select_company_placeholder: "Select a company",
              table_headers: {
                id: "ID",
                name: "Name",
                dni: "ID Number",
                department: "Department",
                attendance: "Attendance"
              },
              no_employees_in_company: "No employees in this company",
              select_company_message: "Select a company to view the employees",
              mark_attendance_button: "Mark Attendance"
            },
            pagedashboard: {
              dashboardTitle: "HR Dashboard",
              dashboardDescription: "Overview of human resources",
              selectCompanyLabel: "Select Company",
              selectCompanyPlaceholder: "Select Company",
              totalEmployeesTitle: "Total Employees",
              totalEmployeesDescription: "Active employees",
              averageAttendanceTitle: "Average Attendance",
              averageAttendanceDescription: "Last month",
              payrollExpenseTitle: "Payroll Expense",
              payrollExpenseDescription: "Monthly total",
              trainingHoursTitle: "Training Hours",
              trainingHoursDescription: "Total hours",
              salaryAnalysisTitle: "Salary Analysis by Department",
              averageLabel: "Average",
              standardDeviationLabel: "Standard Deviation",
              genderDistributionTitle: "Gender Distribution",
              genderDistributionDescription: "Employee gender ratio in the organization",
              remindersTitle: "Reminders"
            },
            nominas: {
              toast: {
                error: "Error loading data",
                success: "Absences saved successfully",
                errorasistencia: "Error saving absences",
              },
              header: {
                title: "Payroll Management",
                sectionTitle: "Monthly Payroll - Period",
                selectCompany: "Select Company",
                saveAbsences: "Save Absences",
                filterDepartment: "Filter by Department",
                deptos: "All Departments",
                noEmployees: "No employees to display",
                selectCompanyMessage: "Select a company to view payroll data",
              },
              columns: {
                name: "Name",
                surname: "Surname",
                dni: "DNI",
                email: "Email",
                department: "Department",
                subdepartment: "Sub Department",
                puesto: "Position",
                basicSalary: "Basic Salary",
                averageIncentive: "Average Incentive",
                monthlyIncentive: "Monthly Incentive",
                absenceDays: "Days of Absence",
                absenceDiscount: "Absence Discount",
                totalBasicIncentive: "Total Basic + Incentive",
                bonus: "Bonus",
                finalTotal: "Final Total (Basic Total + Bonus)"
              },
              dialog: {
                button1: "Calculate Salary, Incentives, Bonuses, and Totals",
                title: "Calculate Salary, Incentives, Bonuses, and Totals",
                description: "Please enter the required data",
                globalGroup: "Global Increase (Entire Company)",
                globalGroupDescription: "Percentage Increase",
                globalGroupPlaceholder: "Enter percentage",
                Department: "Department Increase (Entire Department)",
                selectDepartmentPlaceholder: "Select a Department",
                DepartmentDescription: "Percentage Increase",
                SubDepartment: "Sub Department Increase (Entire SubDept)",
                Empleado: "Incentives and Bonuses by Employee",
                SubDepartmentDescription: "Percentage Increase",
                SubDepartmentPlaceholder: "Enter increase for subdepartment",
                incentivoprom: "Average Incentive",
                incentivomens: "Monthly Incentive",
                inas: "Days of Absence",
                bono: "Bonus",
                button2: "Save Changes",
              },
            },
            desempeño: {
              title: "Performance Evaluation System",
              legajosection: {
                tipo1: "Contract",
                tipo2: "Evaluations",
                tipo3: "Personal Documents",
                leg: "Records",
              },
              tabs: {
                employe: "Employees",
                employeTec: "Technicians",
              },
              dialogs: {
                legajo: {
                  title: "Records of",
                  description: "Select the year and type of document",
                  leg: "Record",
                  fileButtonAlert: "Opening {{fileType}} for {{employeeName}} for the year {{year}}.",
                  closeButton: "Close",
                },
                evaluation: {
                  titles: {
                    self: "Self-Evaluation",
                    boss: "Manager's Evaluation",
                    calibration: "Final Calibration",
                    asesor: "Advisor Evaluation",
                    capacitador: "Trainer Evaluation",
                    calibrationTec: "Final Technical Calibration",
                    legajo: "Employee Records",
                  },
                  footerButtons: {
                    cancel: "Cancel",
                    save: "Save",
                  },
                },
              },
              evaluationPage: {
                dialogs: {
                  uploadedFiles: "Uploaded Files",
                  pdpTitle: "Professional Development Plan",
                  pdcTitle: "Curricular Development Plan",
                  self_evaluationTitle: "Self-Evaluation",
                  boss_evaluationTitle: "Manager's Evaluation",
                  calibrationTitle: "Calibration",
                  asesor_evaluationTitle: "Advisor Evaluation",
                  capacitador_evaluationTitle: "Trainer Evaluation",
                  final_calibrationTitle: "Final Calibration",
                  legajoTitle: "Records",
                  self_evaluationDescription: "View or Update Self-Evaluation",
                  boss_evaluationDescription: "View or Update Manager's Evaluation",
                  calibrationDescription: "View or Update Calibration",
                  asesor_evaluationDescription: "View or Update Advisor Evaluation",
                  capacitador_evaluationDescription: "View or Update Trainer Evaluation",
                  final_calibrationDescription: "View or Update Final Calibration",
                  legajoDescription: "View or Update Records",
                  pdpDescription: "View or Update Employee's Plan",
                  pdcDescription: "View or Update Technician's Plan",
                },
                general: {
                  employeeTitle: "Performance Evaluation - Employees",
                  techTitle: "Performance Evaluation - Technicians",
                  selectCompany: "Select a company",
                },
                tableHeaders: {
                  employee: ["Name", "Surname", "Department", "Position", "PDP", "Self-Evaluation", "Manager's Evaluation", "Final Calibration", "Actions"],
                  tech: ["Name", "Surname", "Department", "Position", "PDC", "Advisor Evaluation", "Trainer Evaluation", "Final Calibration", "Record"],
                },
                actions: {
                  uploadFile: "Upload File",
                  uploadAnotherFile: "Upload Another File",
                  view: "View",
                  pdp: "PDP",
                  viewPDP: "PDP",
                  viewPDC: "PDC",
                  uploadPDP:"PDP",
        uploadPDC:"PDC",
                  uploadAutoevaluación: "Upload Self-Evaluation",
                  uploadEvaluaciónJefe: "Upload Manager's Evaluation",
                  uploadCalibración: "Upload Calibration",
                  uploadEvaluaciónAsesor: "Upload Advisor Evaluation",
                  uploadEvaluaciónCapacitador: "Upload Trainer Evaluation",
                  uploadCalibraciónFinal: "Upload Final Calibration",
                  uploadLegajo: "Record",
                },
              },
            },
            empleados: {
              linkedin: {
                title: "Link not available",
                titlept1: "The employee",
                titlept2: "does not have a LinkedIn link",
                description: "Would you like to add one?",
                button1: "Cancel",
                button2: "Add",
              },
              nohay: {
                nohaydepto: "No Departments Available",
                nohaysubdepto: "No Sub Departments Available",
                nohaypuesto: "No Positions Available",
              },
              baja: {
                title: "Are you sure you want to deactivate",
                description: "This action will change the employee's status to inactive.",
                button1: "Cancel",
                button2: "Yes, deactivate"
              },
              birthday: {
                title: "Birthdays!",
                description: "Today is the birthday of "
              },
              employeesManagement: {
                title: "Employee Management",
                description: "Manage personnel information"
              },
              companySelection: {
                label: "Select Company",
                placeholder: "Select company"
              },
              buttons: {
                addEmployee: "Add New Employee",
                viewEmployeesList: "View Employee List",
                save: "Save"
              },
              filters: {
                departmentFilterLabel: "Filter by Department",
                departmentFilterPlaceholder: "Select department",
                allDepartments: "All departments"
              },
              addEmployee: {
                title: "Add New Employee",
                description: "Enter the new employee's data",
                form: {
                  fields: {
                    nombre: {
                      label: "First Name",
                      placeholder: "Juan"
                    },
                    apellido: {
                      label: "Last Name",
                      placeholder: "Pérez"
                    },
                    dni: {
                      label: "DNI",
                      placeholder: "12345678"
                    },
                    titulo:{
                     label: "Degree",
                      placeholder: "Academic title or specialization"
                    },
                    correo: {
                      label: "Email",
                      placeholder: "juan.perez@example.com"
                    },
                    departamento: {
                      label: "Department",
                      placeholder: "Sales"
                    },
                    subdepartamento:{
                      label:"Sub Department",
                      placeholder:"Marketing",
                    },
                    puesto:{
                      label:"Position",
                      placeholder:"Sales Manager",
                    },
                    sueldo: {
                      label: "Salary",
                      placeholder: "70000"
                    },
                    genero: {
                      label: "Gender",
                      options: {
                        male: "Male",
                        female: "Female"
                      }
                    },
                    fechaNacimiento: {
                      label: "Date of Birth",
                      placeholder: "dd/mm/yyyy"
                    },
                    linkedin: {
                      label: "LinkedIn Link",
                      placeholder: "Link to Profile",
                    },
                  }
                }
              },
              employeesList: {
                headers: {
                  nombre: "First Name",
                  apellido: "Last Name",
                  dni: "DNI",
                  titulo:"Degree",
                  correo: "Email",
                  departamento: "Department",
                  subdepartamento: "Sub Department",
                  puesto: "Position",
                  sueldo: "Salary",
                  genero: "Gender",
                  fechaNacimiento: "Date of Birth",
                  acciones: "Actions"
                },
                actions: {
                  delete: "Delete"
                },
                noDate: "Date not available"
              },
              editEmployee: {
                title: "Edit Data",
                description: "Here you can edit employee personal data. Remember to check carefully.",
                button: "Update",
                buttoncancel: "Cancel"
              }              
            }
        }
      },


      es: {
        translation: {
          settings: {
            title: 'Configuración',
            description: 'Gestiona tus preferencias de aplicación',
            appearance: 'Apariencia y Regional',
            appearanceDescription: 'Personaliza la apariencia de la aplicación y tus preferencias regionales'
          },
          theme: {
            label: 'Tema',
            light: 'Claro',
            dark: 'Oscuro',
            system: 'Sistema'
          },
          fontSize: {
            label: 'Tamaño de fuente',
            small: 'Pequeño',
            normal: 'Normal',
            large: 'Grande'
          },
          language: {
            label: 'Idioma',
            placeholder: 'Selecciona un idioma',
            es: 'Español',
            en: 'Inglés',
            fr: 'Francés'
          },
          buttons: {
            save: 'Guardar Cambios'
          },
          notifications: {
            saveSuccess: {
              title: 'Configuración Actualizada',
              description: 'Los cambios han sido guardados exitosamente'
            },
            saveError: {
              title: 'Error',
              description: 'No se pudo actualizar la configuración'
            }
          },
          loading: {
            label: 'Cargando...'
          },
          header: {
            myAccount: "Mi Cuenta",
            profile: "Perfil",
            settings: "Configuración",
            notificationsHistory: "Historial de Notificaciones",
            logout: "Cerrar Sesión",
            logoutConfirmation: {
              title: "¿Estás seguro?",
              description: "Esta acción cerrará tu sesión actual. Tendrás que volver a iniciar sesión para acceder a tu cuenta.",
              cancel: "Cancelar",
              confirm: "Cerrar Sesión"
            }
          },
          sidebar: {
            toggle: "Abrir/Cerrar Barra Lateral"
          },
          dashboard: {
            welcomeMessage: "Bienvenido {{userRole}}",
            selectOptionMessage: "Selecciona una de las siguientes opciones para comenzar.",
            mainDashboard: "Dashboard Principal",
            mainDashboardDescription: "Accede al panel principal del sistema",
            access: "Acceder",
            roles: {
                ADMIN: {
                  title: "Administración",
                  description: "Accede al panel de administración completo del sistema."
                },
                RRHH: {
                  title: "Recursos Humanos",
                  description:  "Accede al listado de empleados y gestiona el personal."
                },
                NOMINAS: {
              title: "Nóminas",
                  description:"Administra las nóminas y pagos del personal."
                }
              }
          }, 
          menu: {
    ADMIN: [
      { "href": "/dashboard", label: "Dashboard" },
      { "href": "/trabajadores", label: "Empleados" },
      { "href": "/asistencia", label: "Asistencia" },
      { "href": "/desempeno", label: "Desempeño" },
      { "href": "/nominas", label: "Nóminas" },
      { "href": "/beneficios",label: "Beneficios" },
      { "href": "/cursos", label: "Formación" },
      { "href": "/postulaciones", label: "Postulaciones" },
      { "href": "/recordatorios", label: "Recordatorios" }
    ],
    rrhh: [
      { "href": "/asistencia", label: "Asistencia" },
      { "href": "/desempeno", label: "Desempeño" },
      { "href": "/beneficios",label: "Beneficios" },
      { "href": "/cursos", label: "Formación" },
      { "href": "/recordatorios", label: "Recordatorios" }
    ],
    nominas: [
      { "href": "/trabajadores", label: "Empleados" },
      { "href": "/nominas", label: "Nóminas" },
      { "href": "/recordatorios", label: "Recordatorios" }
    ]
  },
  adminPanel: {
    userTab:"Crear Usuario",
    companyTab:"Agregar Empresa",
    selectCompanyLabel:"Empresa",
    departmentNameLabel:"Nuevo Departamento",
    departmentNamePlaceholder:"Ingresar Departamento",
    createDepartmentButton:"Crear Departamento",
    selectDepartmentLabel:"Seleccionar Departamento",
    selectDepartmentPlaceholder:"Departamento",
    subdepartmentNameLabel:"Nuevo Sub Departamento",
    subdepartmentNamePlaceholder:"Ingresar Nuevo Sub Departamento",
    createSubdepartmentButton:"Crear Sub Departamento",
    selectSubdepartmentLabel:"Seleccionar Sub Departamento",
    selectSubdepartmentPlaceholder:"Sub Departamento",
    jobPositionNameLabel:"Nuevo Puesto de Trabajo",
    jobPositionNamePlaceholder:"Puesto de Trabajo",
    createJobPositionButton:"Crear Nuevo Puesto",
    deptoTab:"Administrar Departamentos",
    companyNameLabel:"Ingresar el nombre de la Empresa",
    companyNamePlaceholder:"Nueva Empresa",
    loadingCreateCompanyButton:"Agregando...",
    createCompanyButton:"Agregar",
    title: "Panel de Administración",
    createUserDescription: "Crear nuevo usuario en el sistema",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "correo@ejemplo.com",
    passwordLabel: "Contraseña",
    roleLabel: "Rol del Usuario",
    selectRolePlaceholder: "Selecciona un rol",
    roleAdmin: "Administrador",
    roleRrhh: "Recursos Humanos",
    roleNominas: "Nóminas",
    createUserButton: "Crear Usuario",
    loadingCreateUserButton: "Creando usuario...",
    successMessage: "Usuario {email} creado exitosamente con rol {role}",
    errorMessage: "Error al crear el usuario. Por favor, intenta de nuevo.",
    errorInvalidResponse: "Error del servidor: respuesta no válida",
    noAdminSession: "No hay sesión de administrador activa",
  },
  notificationBell: {
    title: "Recordatorios",
    noNotifications: "No hay recordatorios pendientes",
    status: {
      todayExpires: "Vence hoy",
      daysRemaining: "días restantes",
      expired: "días vencidos"
    },
    company: "Empresa",
    description: "Descripción",
    archive: "Archivar",
    reminder: "Recordatorio"
  },
  statusColors: {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600"
  },
  dropdown: {
    reminderHeader: "Recordatorios",
    archiveNotification: "Archivar notificación"
  },
  selectCompany: "Seleccionar empresa",
  details: "Detalles",
  start: "Inicio",
  end: "Fin",
  today: "Hoy",
  expired: "Vencido",
  remainingDays: "días restantes",
  description: "Descripcion",
  reminderDetails: "Detalles del Recordatorio",
  type: "Tipo",
  employee: "Empleado",
  startDate: "Fecha de Inicio",
  endDate: "Fecha de Fin",

  graficotorta:{
    card:{
      title: "Distribución de Empleados por Género",
      description: "Total de empleados:",
      description2: "El número de empleados está dividido entre hombres y mujeres.",
      genre: "hombre",
      genre2: "mujer"
    }
  },
  unauthorized:{
    card:{
      title:"Acceso Denegado",
      content:"No tienes permisos para acceder a esta página.",
      button:"Volver"
    }
  },
  recordatorios:{
    toast:{
      description1:"Por favor completa todos los campos",
      description2:"La fecha de fin no puede ser anterior a la fecha de inicio",
      description3:"Empleado seleccionado no encontrado",
      title4:"¡Éxito!",
      description4:"Recordatorio agregado correctamente",
      description5:"Error al guardar el recordatorio",
    },
    card:{
      title:"Nuevo Recordatorio",
      label1:"Empresa",
      label1PlaceHolder:"Seleccionar Empresa",
      label2:"Empleado",
      label2PlaceHolder:"Seleccionar Empleado",
      label3:"Tipo de Recordatorio",
      label3PlaceHolder1:"Seleccionar tipo",
      label3PlaceHolder2:"Vacaciones",
      label3PlaceHolder3:"Licencia",
      label4:"Fecha de Inicio",
      label4PlaceHolder:"Seleccionar fecha",
      label5:"Fecha de Fin",
      label5PlaceHolder:"Seleccionar fecha",
      label6:"Descripción",
      label6PlaceHolder:"Detalles adicionales",
      button:"Guardar Recordatorio"
    },
  },
  postulaciones:{ 
    toast:{
      title1:"URL inválida",
      description1:"Por favor, ingresa una URL válida de LinkedIn Jobs",
      title2:"Publicación agregada",
      description2:"La publicación se ha agregado correctamente",
      title3:"Error",
      description3:"No se pudo agregar la publicación",
      title4:"Publicación archivada",
      description4:"La publicación ha sido archivada",
      title5:"Error",
      description5:"No se pudo archivar la publicación",
      title6:"Publicación eliminada",
      description6:"La publicación ha sido eliminada",
      title7:"Error",
      description7:"No se pudo eliminar la publicación",
      title8:"Empleado registrado",
      description8:"El empleado se ha registrado exitosamente",
      title9:"Error",
      description9:"No se pudo registrar al empleado",
    },
    jobApplications: {
      header: {
        linkedin:"LinkedIn",
        title: "Publicaciones de trabajo",
        searchButton: "Agregar Busqueda",
        eliminar: "Eliminar",
        archivar:"Archivar",
        detalles: "Detalles",
        detallespublicacion:"Detalles de la publicación",
        informaciondetallada:"Información detallada de la publicación archivada",
        informacionpublicacion:"Informacion de la publicación",
        titulo:"Titulo",
        descripcion:"Descripción",
        cancelar:"Cancelar",
        agregar:"Agregar",
        registrar:"Registrar",
        empleadocontratado:"Empleado Contratado",
        nombrecom:"Nombre Completo",
        dni:"DNI",
        correo:"Correo",
        depto:"Departamento",
        subdepto:"Sub Departamento",
        puesto:"Puesto",
        genero:"Genero",
        fechanac:"Fecha de Nacimiento",
        sueldo:"Sueldo",
        cerrar:"Cerrar",
        agg:"Agregar Nueva Publicación",
        contrataste:"¿Contrataste a alguien para este puesto?",
        si:"Sí",
        no:"No",
        registrarnuevoempleado:"Registrar nuevo Empleado",
        titulodelapubli:"Título de la Publicación",
        activa:"Activa",
        archivada:"Archivada",

      },
      searchPlaceholder: "Buscar por título o empresa...",
      addJob: {
        urlPlaceholder: "Pegar URL de LinkedIn Jobs",
        addButton: "Agregar Publicación",
        loading: "Cargando..."
      },
      noResults: "No hay publicaciones que coincidan con la búsqueda.",
      details: {
        viewDetailsButton: "Ver detalles",
        dialog: {
          archiveButton: "Archivar",
          deleteButton: "Eliminar",
          deleteIcon: "Eliminar",
          viewOnLinkedIn: "Ver en LinkedIn",
          registerEmployeeDialog: {
            title: "¿Registrar nuevo empleado?",
            description: "¿Deseas registrar al nuevo empleado antes de archivar la publicación?",
            archiveOnly: "Solo archivar",
            registerEmployee: "Registrar empleado"
          },
          registerEmployeeForm: {
            title: "Registrar nuevo empleado",
            fields: {
              name: "Nombre",
              lastName: "Apellido",
              department: "Departamento",
              position: "Puesto",
              startDate: "Fecha de inicio",
              salary: "Salario"
            },
            cancel: "Cancelar",
            register: "Registrar"
          }
        }
      }
    }
  },
  cursos:{
    title:"Programas de Formación",
    selectcompany:"Seleccionar empresa",
    toast: {
      title_course_completed: "Curso Finalizado",
      description_course_completed: "El curso ha sido finalizado, puede observar detalles en Cursos archivados",
      title_error_archiving_course: "Error - Curso no archivado",
      description_error_archiving_course: "Por favor, reintenta, ha ocurrido un error"
    },
    global_view: {
      card_title: "Vista Global de Cursos",
      select_month_placeholder: "Seleccionar mes",
      select_year_placeholder: "Año",
      table_headers: {
        employee: "Empleado",
        assigned_courses: "Cursos Asignados",
        progress: "Progreso"
      }
    },
    tabs: {
      courses_list: "Lista de Cursos",
      calendar: "Calendario",
      global_view: "Vista Global",
      archived_courses: "Cursos Archivados"
    },
    courses_list: {
      courses:"Cursos Disponibles",
      add_new_course: "Agregar Nuevo Curso",
      table_headers: {
        course_name: "Nombre del Curso",
        department: "Departamento",
        duration: "Duración",
        status: "Estado",
        actions: "Acciones"
      },
      buttons:{
        details:"Detalles",
        assign:"Asignar",

      }
    },
    calendar: {
      card_title: "Calendario de Cursos"
    },
    archived_courses: {
      no_courses:"No Hay Cursos Archivados",
      card_title: "Cursos Finalizados",
      table_headers: {
        course_name: "Nombre del Curso",
        department: "Departamento",
        archived_date: "Fecha de Archivo",
        final_status: "Estado Final",
         badge:"Finalizado"
      },
    },
    modal: {
      add_course: {
        errors:{
          name_required:"Nombre Requerido",
          start_date_required:"Fecha de Inicio Requerida",
          end_date_required:"Fecha de Fin Requerida",
          invalid_date_range:"Fechas Invalidas",
          description_required:"Descripción Requerida"
        },
        title: "Agregar Nuevo Curso",
        fields: {
          course_name: "Nombre del Curso",
          course_nameplaceholder: "Nombre del Curso",
          department: "Departamento",
          departmentplaceholder:"Departamento",
          dateStart: "Fecha de Inicio",
          dateEnd:"Fecha de Fin",
          duration:"Duración",
          description:"Descripción",
          descriptionplaceholder:"Descripción del curso",
          button1:"Cancelar",
          button2:"Guardar Curso",
        }
      }
    },
    details:{
      title:"Detalles del Curso",
      employeeAssing:"Empleados Asignados",
      employeenofound:"Empleado no encontrado",
      archiveButton:"Archivar Curso",
      selectemployeetitle:"Asignar Empleado al Curso",
      selectemployee:"Seleccionar Empleado",
      selectemployeeplaceholder:"Seleccionar Empleado",
      selectbutton:"Asignar"
    }
  },
  perfil:{
      info_personal: "Información Personal",
      actualizar_info: "Actualizar Información Personal",
      perfil_personal: "Perfil Personal",
      descripcion_perfil: "Observa tu información personal y detalles de contacto",
      nickname: "Nickname",
      nombre_completo: "Nombre completo",
      email: "Email",
      telefono: "Teléfono",
      departamento: "Departamento",
      biografia: "Biografía",
      actualizar_perfil: "Actualizar Perfil Personal",
      descripcion_actualizar: "Actualiza tu información personal y detalles de contacto",
      cambiar_foto: "Cambiar foto",
      guardar_cambios: "Guardar Cambios",
      cancelar: "Cancelar",
      perfil_actualizado: "Perfil actualizado",
      cambios_guardados: "Los cambios han sido guardados correctamente.",
      error: "Error",
      guardar_error: "No se pudieron guardar los cambios.",
      url_avatar: "Imagen de Perfil"
    },
    notificaciones:{
      title:"Notificaciones Archivadas",
      nonotis:"No hay notificaciones archivadas",
      vence:"Vence el"
    },
    login:{
      bienvenido: "Bienvenido de nuevo",
      ingresa_credenciales: "Ingresa tus credenciales para continuar",
      correo_electronico: "Correo Electrónico",
      placeholder_email: "usuario@empresa.com",
      contraseña: "Contraseña",
      placeholder_password: "••••••••",
      usuario_no_encontrado: "Usuario no encontrado.",
      contraseña_incorrecta: "Contraseña incorrecta.",
      error_autenticacion: "Error de autenticación. Intenta nuevamente.",
      iniciar_sesion: "Iniciar Sesión",
      iniciando_sesion: "Iniciando sesión...",
      gestiona_proyectos: "Gestiona tus proyectos fácilmente",
      monitorea_progreso: "Monitorea el progreso de tus proyectos y mantén todo bajo control desde nuestra plataforma."
    },

    beneficios:{
      page_title: "Beneficios para Empleados",
      page_description: "Descubre todos los beneficios disponibles para nuestro equipo",
    tabs: {
      printable_list: "Lista Imprimible",
      organization_chart: "Organigrama"
    },
    organization_chart: {
      title: "Organigrama de la Compañía",
      placeholder: "Organigrama de la Empresa"
    },
    benefits_list: {
      title: "Lista Completa de Beneficios",
      print_button: "Imprimir"
    },
    categories: {
      free_time: "Tiempo Libre",
      health_and_wellness: "Salud y Bienestar",
      financial_benefits: "Beneficios Financieros"
    },
    benefits: {
      free_time1: "20 días de vacaciones pagadas al año",
      free_time2: "Día de cumpleaños libre",
      free_time3: "Paternidad extendida",
      free_time4: "Maternidad extendida",
      health1: "Seguro Médico completo para empleados y familiares directos",
      health2: "Membresía gratuita en gimnasio local",
      financial1: "Plan de Pensiones con contribución del 5%",
      financial2: "Bono por inicio de clases",
      financial3: "Caja navideña"
    }
  },
  asistencia:{
    page_title: "Registro de Asistencia",
    select_company_placeholder: "Selecciona una empresa",
    table_headers: {
      id: "ID",
      name: "Nombre",
      dni: "DNI",
      department: "Departamento",
      attendance: "Asistencia"
    },
    no_employees_in_company: "No hay empleados en esta empresa",
    select_company_message: "Selecciona una empresa para ver los empleados",
    mark_attendance_button: "Marcar Asistencia"
  },
  pagedashboard:{
      dashboardTitle: "Dashboard RRHH",
      dashboardDescription: "Vista general de recursos humanos",
      selectCompanyLabel: "Seleccionar Empresa",
      selectCompanyPlaceholder: "Seleccionar Empresa",
      totalEmployeesTitle: "Total Empleados",
      totalEmployeesDescription: "Empleados activos",
      averageAttendanceTitle: "Asistencia Promedio",
      averageAttendanceDescription: "Último mes",
      payrollExpenseTitle: "Gasto en Nómina",
      payrollExpenseDescription: "Total mensual",
      trainingHoursTitle: "Horas de Formación",
      trainingHoursDescription: "Horas totales",
      salaryAnalysisTitle: "Análisis Salarial por Departamento",
      averageLabel: "Promedio",
      standardDeviationLabel: "Desvío Estándar",
      genderDistributionTitle: "Distribución por Género",
      genderDistributionDescription: "Proporción de empleados por género en la organización",
      remindersTitle: "Recordatorios"
  },
  nominas:{
    toast:{
      error:"Error al cargar los datos",
      success:"Inasistencias guardadas correctamente",
      errorasistencia:"Error al guardar las inasistencias",
    },
    header: {
    title: "Gestión de Nóminas",
    sectionTitle: "Nómina Mensual - Período",
    selectCompany: "Seleccionar empresa",
    saveAbsences: "Guardar Inasistencias",
    filterDepartment: "Filtrar por departamento",
    deptos:"Todos los departamentos",
    noEmployees: "No hay empleados para mostrar",
    selectCompanyMessage: "Seleccione una empresa para ver los datos de nómina"
  },
    columns: {
    name: "Nombre",
    surname: "Apellido",
    dni: "DNI",
    email: "Correo",
    department: "Departamento",
    subdepartment:"Sub Departamento",
    puesto: "Puesto",
    basicSalary: "Sueldo Básico",
    averageIncentive: "Incentivo Promedio",
    monthlyIncentive: "Incentivo Mensual",
    absenceDays: "Días Inasistencia",
    absenceDiscount: "Descuento Inasistencias",
    totalBasicIncentive: "Total Básico + Incentivo",
    bonus: "Bono",
    finalTotal: "Total Final (Total Basico + Bono)"
  },
  dialog:{
    button1:"Calcular Sueldo, Incentivos, Bonos, y Totales",
    title:"Calcular Sueldo, Incentivos, Bonos, y Totales",
    description:"Ingrese por favor los datos requeridos",
    globalGroup:"Aumento Global (Toda la Empresa)",
    globalGroupDescription:"Aumento del %",
    globalGroupPlaceholder:"Ingrese el porcentaje",
    Department:"Aumento de Departamento (Todo el Departamento)",
    selectDepartmentPlaceholder:"Seleccione un Departamento",
    DepartmentDescription:"Aumento del %",
    SubDepartment:"Aumento de Sub Departamento (Todo el SubDepto)",
    Empleado:"Incentivos y Bonos por Empleado",
    SubDepartmentDescription:"Aumento del %",
    SubDepartmentPlaceholder:"Introduce incremento por subdepartamento",
    incentivoprom: "Incentivo Promedio",
    incentivomens:"Incentivo Mensual",
    inas:"Dias de Inasistencias",
    bono:"Bono",
    button2:"Guardar Cambios",
  }
  },

  desempeño:{
    title:"Sistema de Evaluación de Desempeño",
    legajosection:{
      tipo1:"Contrato",
      tipo2:"Evaluaciones",
      tipo3:"Documentos Personales",
      leg:"Legajos"
    },
    tabs:{
      employe:"Empleados",
      employeTec:"Técnicos"
    },
    dialogs: {
      legajo: {
        title: "Legajos de",
        description: "Seleccione el año y tipo de documento",
        leg:"Legajo",
        fileButtonAlert: "Abriendo {{fileType}} para {{employeeName}} del año {{year}}.",
        closeButton: "Cerrar"
      },
      evaluation: { 
        titles: {
          self: "Autoevaluación",
          boss: "Evaluación del Jefe",
          calibration: "Calibración Final",
          asesor: "Evaluacion del Asesor",
          capacitador: "Evaluacion del Capacitador",
          calibrationTec: "Calibración Final Tecnico",
          legajo: "Legajos del Empleado"
        },
        footerButtons: {
          cancel: "Cancelar",
          save: "Guardar"
        }
      },
    },
    evaluationPage: {
      dialogs:{
        uploadedFiles:"Archivos cargados",
        pdpTitle:"Plan de Desarrollo Profesional",
        pdcTitle:"Plan de Desarrolo Curricular",
        self_evaluationTitle:"AutoEvaluación",
        boss_evaluationTitle:"Evaluación del Jefe Directo",
        calibrationTitle:"Calibración",
        asesor_evaluationTitle:"Evaluación del Asesor",
        capacitador_evaluationTitle:"Evaluación del Capacitador",
        final_calibrationTitle:"Calibración Final",
        legajoTitle:"Legajos",
        self_evaluationDescription:"Ver o Actualizar AutoEvaluación",
        boss_evaluationDescription:"Ver o Actualizar Evaluación del Jefe Directo",
        calibrationDescription:"Ver o Actualizar Calibración",
        asesor_evaluationDescription:"Ver o Actualizar Evaluación del Asesor",
        capacitador_evaluationDescription:"Ver o Actualizar Evaluación del Capacitador",
        final_calibrationDescription:"Ver o Actualizar Calibración Final",
        legajoDescription:"Ver o Actualizar Legajos",
        pdpDescription:"Ver o Actualizar Plan del empleado",
        pdcDescription:"Ver o Actualizar Plan del Tecnico",
      },
      general: {
        employeeTitle: "Evaluación de Desempeño - Empleados",
        techTitle: "Evaluación de Desempeño - Técnicos",
        selectCompany: "Selecciona una empresa"
      },
      tableHeaders: {
        employee: ["Nombre", "Apellido","Departamento", "Puesto", "PDP", "Autoevaluación", "Evaluación Jefe", "Calibración Final", "Acciones"],
        tech: ["Nombre", "Apellido","Departamento", "Puesto", "PDC", "Evaluación Asesor", "Evaluación Capacitador", "Calibración Final", "Legajo"]
      },
      actions: {
        uploadFile:"Cargar Archivo",
        uploadAnotherFile:"Cargar un nuevo Archivo",
        view:"Ver",
        uploadPDP:"PDP",
        uploadPDC:"PDC",
        viewPDP: "PDP",
        viewPDC: "PDC",
        uploadAutoevaluación: "Cargar Autoevaluacion",
        uploadEvaluaciónJefe: "Cargar Evaluación Jefe",
        uploadCalibración: "Cargar Calibracion",
        uploadEvaluaciónAsesor: "Cargar Evaluación Asesor",
        uploadEvaluaciónCapacitador: "Cargar Evaluación Capacitador",
        uploadCalibraciónFinal: "Cargar Calibracion",
        uploadLegajo:"Legajo"
      }
    }
  },
  empleados:{
    linkedin:{
      title:"Link no disponible",
      titlept1:"El empleado",
      titlept2:"no posee Link de LinkedIn",
      description:"¿Desea agregarle?",
      button1:"Cancelar",
      button2:"Agregar",
    },
    nohay:{
      nohaydepto:"No hay Departamentos Disponibles",
      nohaysubdepto:"No hay Sub Departamentos Disponibles",
      nohaypuesto:"No hay Puestos Disponibles",
    },
    baja:{
    title:"¿Seguro de dar de baja a",
    description:"Esta acción cambiará el estado del empleado a inactivo.",
    button1:"Cancelar",
    button2:"Sí, dar de baja",
    },
    birthday: {
      title: "¡Cumpleaños!",
      description: "Hoy es el cumpleaños de "
    },
    employeesManagement: {
      title: "Gestión de Empleados",
      description: "Administra la información del personal"
    },
    companySelection: {
      label: "Seleccionar Empresa",
      placeholder: "Seleccionar empresa"
    },
    buttons: {
      addEmployee: "Agregar Nuevo Empleado",
      viewEmployeesList: "Ver Lista de Empleados",

      save: "Guardar"
    },
    filters: {
      departmentFilterLabel: "Filtrar por Departamento",
      departmentFilterPlaceholder: "Seleccionar departamento",
      allDepartments: "Todos los departamentos"
    },
    addEmployee: {
      title: "Agregar Nuevo Empleado",
      description: "Ingresa los datos del nuevo empleado",
      form: {
        fields: {
          nombre: {
            label: "Nombre",
            placeholder: "Juan"
          },
          apellido: {
            label: "Apellido",
            placeholder: "Pérez"
          },
          dni: {
            label: "DNI",
            placeholder: "12345678"
          },
          titulo: {
            label: "Título",
            placeholder: "Título académico o especialización"
          },
          correo: {
            label: "Correo",
            placeholder: "juan.perez@ejemplo.com"
          },
          departamento: {
            label: "Departamento",
            placeholder: "Administración"
          },
          subdepartamento: {
            label: "Sub Departamento",
            placeholder: "Sub Depto"
          },
          puesto: {
            label: "Puesto de Trabajo",
            placeholder: "Puesto"
          },
          sueldo: {
            label: "Sueldo",
            placeholder: "70000"
          },
          genero: {
            label: "Género",
            options: {
              male: "Masculino",
              female: "Femenino"
            }
          },
          fechaNacimiento: {
            label: "Fecha de Nacimiento",
            placeholder: "dd/mm/yyyy"
          },
          linkedin:{
            label:"Link de LinkedIn",
            placeholder: "Link al Perfil",
          }
        }
      }
    },
    employeesList: {
      headers: {
        nombre: "Nombre",
        apellido: "Apellido",
        dni: "DNI",
        titulo: "Título",
        correo: "Correo",
        departamento: "Departamento",
        subdepartamento:"Sub Departamento",
        puesto: "Puesto",
        sueldo: "Sueldo",
        genero: "Género",
        fechaNacimiento: "Fecha de Nacimiento",
        acciones: "Acciones"
      },
      actions: {
        delete: "Eliminar"
      },
      invalidDate:"Fecha invalida",
      noDate: "Fecha no disponible"
    },
    editEmployee: {
      title: "Editar datos",
      description: "Aquí puedes editar los datos personales de empleados. Recuerda Revisar bien",
      button: "Actualizar",
      buttoncancel: "Cancelar"
    }    
  }


    
  }     
  },




      fr: {
        translation: {
          settings: {
            title: 'Paramètres',
            description: 'Gérer les préférences de l\'application',
            appearance: 'Apparence et Régional',
            appearanceDescription: 'Personnaliser l\'apparence de l\'application et les préférences régionales'
          },
          theme: {
            label: 'Thème',
            light: 'Clair',
            dark: 'Sombre',
            system: 'Système'
          },
          fontSize: {
            label: 'Taille de police',
            small: 'Petit',
            normal: 'Normal',
            large: 'Grand'
          },
          language: {
            label: 'Langue',
            placeholder: 'Sélectionnez une langue',
            es: 'Espagnol',
            en: 'Anglais',
            fr: 'Français'
          },
          buttons: {
            save: 'Enregistrer les modifications'
          },
          notifications: {
            saveSuccess: {
              title: 'Paramètres Mis à Jour',
              description: 'Les modifications ont été enregistrées avec succès'
            },
            saveError: {
              title: 'Erreur',
              description: 'Impossible de mettre à jour les paramètres'
            }
          },
          loading: {
            label: 'Chargement...'
          },
          header: {
            myAccount: "Mon Compte",
            profile: "Profil",
            settings: "Paramètres",
            notificationsHistory: "Historique des Notifications",
            logout: "Déconnexion",
            logoutConfirmation: {
              title: "Êtes-vous sûr ?",
              description: "Cette action fermera votre session. Vous devrez vous reconnecter pour accéder à votre compte.",
              cancel: "Annuler",
              confirm: "Déconnexion"
            }
          },
          sidebar: {
            toggle: "Ouvrir/Fermer la Barre Latérale"
          },
          dashboard: {
            welcomeMessage: "Bienvenue {{userRole}}",
            selectOptionMessage: "Sélectionnez l'une des options suivantes pour commencer",
            mainDashboard: "Tableau de bord principal",
            mainDashboardDescription: "Accédez au tableau de bord principal du système",
            access: "Accéder",
            roles: {
              ADMIN: {
                title: "Administration",
                description: "Accédez au panneau d'administration complet du système"
              },
              RRHH: {
                title: "Ressources humaines",
                description: "Gérez les processus et le personnel des ressources humaines"
              },
              NOMINAS: {
                title: "Paie",
                description: "Administrez les paies et les paiements du personnel"
              }
            }
          },
          menu: {
            ADMIN: [
              { "href": "/dashboard", "label": "Tableau de bord" },
              { "href": "/trabajadores", "label": "Employés" },
              { "href": "/asistencia", "label": "Présence" },
              { "href": "/desempeno", "label": "Performance" },
              { "href": "/nominas", "label": "Paie" },
              { "href": "/beneficios", "label": "Avantages" },
              { "href": "/cursos", "label": "Formation" },
              { "href": "/postulaciones", "label": "Candidatures" },
              { "href": "/recordatorios", "label": "Rappels" }
            ],
            rrhh: [
              { "href": "/asistencia", "label": "Présence" },
              { "href": "/desempeno", "label": "Performance" },
              { "href": "/beneficios", "label": "Avantages" },
              { "href": "/cursos", "label": "Formation" },
              { "href": "/recordatorios", "label": "Rappels" }
            ],
            nominas: [
              { "href": "/trabajadores", "label": "Employés" },
              { "href": "/nominas", "label": "Paie" },
              { "href": "/recordatorios", "label": "Rappels" }
            ]
          },
          adminPanel: {
                userTab:"Créer un utilisateur",
                companyTab:"Ajouter une entreprise",
                selectCompanyLabel:"Entreprise",
                departmentNameLabel:"Nouveau Département",
                departmentNamePlaceholder:"Saisir Département",
                createDepartmentButton:"Créer Département",
                selectDepartmentLabel:"Sélectionner Département",
                selectDepartmentPlaceholder:"Département",
                subdepartmentNameLabel:"Nouveau Sous-Département",
                subdepartmentNamePlaceholder:"Saisir Nouveau Sous-Département",
                createSubdepartmentButton:"Créer Sous-Département",
                selectSubdepartmentLabel:"Sélectionner Sous-Département",
                selectSubdepartmentPlaceholder:"Sous-Département",
                jobPositionNameLabel:"Nouveau Poste de Travail",
                jobPositionNamePlaceholder:"Poste de Travail",
                createJobPositionButton:"Créer Nouveau Poste",
                deptoTab:"Gérer Départements",
                companyNameLabel:"Saisir le nom de l'entreprise",
                companyNamePlaceholder:"Nouvelle entreprise",
                loadingCreateCompanyButton:"Ajout en cours...",
                createCompanyButton:"Ajouter",
                title: "Panneau d'administration",
                createUserDescription: "Créer un nouvel utilisateur dans le système",
                emailLabel: "Adresse électronique",
                emailPlaceholder:"email@exemple.com",
                passwordLabel: "Mot de passe",
                roleLabel: "Rôle de l'utilisateur",
                selectRolePlaceholder: "Sélectionner un rôle",
                roleAdmin: "Administrateur",
                roleRrhh: "Ressources humaines",
                roleNominas: "Paie",
                createUserButton: "Créer un utilisateur",
                loadingCreateUserButton: "Création de l'utilisateur...",
                successMessage: "Utilisateur {email} créé avec succès avec le rôle {role}",
                errorMessage: "Erreur lors de la création de l'utilisateur. Veuillez réessayer.",
                errorInvalidResponse: "Erreur du serveur : réponse invalide",
                noAdminSession: "Aucune session administrateur active"
            },
            notificationBell: {
                title: "Rappels",
                noNotifications: "Aucun rappel en attente",
                status: {
                  todayExpires: "Expire aujourd'hui",
                  daysRemaining: " jours restants",
                  expired: " jours expirés"
                },
                company: "Entreprise",
                description: "Description",
                archive: "Archiver",
                reminder: "Rappel"
              },
              statusColors: {
                green: "text-green-600",
                yellow: "text-yellow-600",
                red: "text-red-600"
              },
              dropdown: {
                reminderHeader: "Rappels",
                archiveNotification: "Archiver la notification"
              },
              selectCompany: "Sélectionner l'entreprise",
              details: "Détails",
              start: "Début",
              end: "Fin",
              today: "Aujourd'hui",
              expired: "Expiré",
              remainingDays: "jours restants",
              description: "Description",
              reminderDetails: "Détails du rappel",
              type: "Type",
              employee: "Employé",
              startDate: "Date de début",
              endDate: "Date de fin",
              graficotorta:{
                card:{
                  title: "Répartition des employés par genre",
                  description: "Total des employés :",
                  description2: "Le nombre d'employés est divisé entre hommes et femmes.",
                  genre: "homme",
                  genre2: "femme"
                }
              },
              unauthorized:{
                card:{
                  title:"Accès refusé",
                  content:"Vous n'avez pas les autorisations pour accéder à cette page.",
                  button:"Retour"
                }
              },
              recordatorios: {
                toast: {
                  description1: "Veuillez remplir tous les champs",
                  description2: "La date de fin ne peut pas être antérieure à la date de début",
                  description3: "Employé sélectionné non trouvé",
                  title4: "Succès!",
                  description4: "Rappel ajouté avec succès",
                  description5: "Erreur lors de l'enregistrement du rappel"
                },
                card: {
                  title: "Nouveau Rappel",
                  label1: "Entreprise",
                  label1PlaceHolder: "Sélectionner l'entreprise",
                  label2: "Employé",
                  label2PlaceHolder: "Sélectionner l'employé",
                  label3: "Type de Rappel",
                  label3PlaceHolder1: "Sélectionner le type",
                  label3PlaceHolder2: "Vacances",
                  label3PlaceHolder3: "Congé",
                  label4: "Date de début",
                  label4PlaceHolder: "Sélectionner la date",
                  label5: "Date de fin",
                  label5PlaceHolder: "Sélectionner la date",
                  label6: "Description",
                  label6PlaceHolder: "Détails supplémentaires",
                  button: "Enregistrer le Rappel"
                },
              },
              postulaciones: {
                toast: {
                  title1: "URL invalide",
                  description1: "Veuillez entrer une URL valide de LinkedIn Jobs",
                  title2: "Publication ajoutée",
                  description2: "La publication a été ajoutée avec succès",
                  title3: "Erreur",
                  description3: "La publication n'a pas pu être ajoutée",
                  title4: "Publication archivée",
                  description4: "La publication a été archivée",
                  title5: "Erreur",
                  description5: "La publication n'a pas pu être archivée",
                  title6: "Publication supprimée",
                  description6: "La publication a été supprimée",
                  title7: "Erreur",
                  description7: "La publication n'a pas pu être supprimée",
                  title8: "Employé enregistré",
                  description8: "L'employé a été enregistré avec succès",
                  title9: "Erreur",
                  description9: "L'employé n'a pas pu être enregistré"
                },
                jobApplications: {
                  header: {
                    title: "Offres d'emploi",
                    searchButton: "Ajouter recherche",
                    eliminar: "Supprimer",
                    archivar: "Archiver",
                    detalles: "Détails",
                    detallespublicacion: "Détails de la publication",
                    informaciondetallada: "Informations détaillées de la publication archivée",
                    informacionpublicacion: "Informations sur la publication",
                    titulo: "Titre",
                    descripcion: "Description",
                    cancelar: "Annuler",
                    agregar: "Ajouter",
                    registrar: "Enregistrer",
                    empleadocontratado: "Employé embauché",
                    nombrecom: "Nom complet",
                    dni: "DNI",
                    correo: "Email",
                    depto: "Département",
                     subdepto: "Sous Département",
  puesto: "Poste",
                    genero: "Genre",
                    fechanac: "Date de naissance",
                    sueldo: "Salaire",
                    cerrar: "Fermer",
                    agg: "Ajouter nouvelle publication",
                    contrataste: "Avez-vous embauché quelqu'un pour ce poste ?",
                    si: "Oui",
                    no: "Non",
                    registrarnuevoempleado: "Enregistrer nouveau employé",
                    titulodelapubli: "Titre de la publication",
                    activa: "Active",
                    archivada: "Archivée"
                  },
                  searchPlaceholder: "Rechercher par titre ou entreprise...",
                  addJob: {
                    urlPlaceholder: "Coller l'URL de LinkedIn Jobs",
                    addButton: "Ajouter publication",
                    loading: "Chargement..."
                  },
                  noResults: "Aucune publication ne correspond à la recherche.",
                  details: {
                    viewDetailsButton: "Voir détails",
                    dialog: {
                      archiveButton: "Archiver",
                      deleteButton: "Supprimer",
                      deleteIcon: "Supprimer",
                      viewOnLinkedIn: "Voir sur LinkedIn",
                      registerEmployeeDialog: {
                        title: "Enregistrer un nouvel employé ?",
                        description: "Voulez-vous enregistrer le nouvel employé avant d'archiver la publication ?",
                        archiveOnly: "Archiver uniquement",
                        registerEmployee: "Enregistrer employé"
                      },
                      registerEmployeeForm: {
                        title: "Enregistrer un nouvel employé",
                        fields: {
                          name: "Prénom",
                          lastName: "Nom de famille",
                          department: "Département",
                          position: "Poste",
                          startDate: "Date de début",
                          salary: "Salaire"
                        },
                        cancel: "Annuler",
                        register: "Enregistrer"
                      }
                    }
                  }
                }
              },
              cursos: {
                title: "Programmes de Formation",
                selectcompany: "Sélectionner l'entreprise",
                toast: {
                  title_course_completed: "Cours terminé",
                  description_course_completed: "Le cours a été terminé, vous pouvez voir les détails dans les Cours Archivés",
                  title_error_archiving_course: "Erreur - Cours non archivé",
                  description_error_archiving_course: "Veuillez réessayer, une erreur est survenue"
                },
                global_view: {
                  card_title: "Vue Globale des Cours",
                  select_month_placeholder: "Sélectionner le mois",
                  select_year_placeholder: "Année",
                  table_headers: {
                    employee: "Employé",
                    assigned_courses: "Cours Assignés",
                    progress: "Progrès"
                  }
                },
                tabs: {
                  courses_list: "Liste des Cours",
                  calendar: "Calendrier",
                  global_view: "Vue Globale",
                  archived_courses: "Cours Archivés"
                },
                courses_list: {
                  courses: "Cours Disponibles",
                  add_new_course: "Ajouter un Nouveau Cours",
                  table_headers: {
                    course_name: "Nom du Cours",
                    department: "Département",
                    duration: "Durée",
                    status: "Statut",
                    actions: "Actions"
                  },
                  buttons: {
                    details: "Détails",
                    assign: "Assigner"
                  }
                },
                calendar: {
                  card_title: "Calendrier des Cours"
                },
                archived_courses: {
                  no_courses: "Aucun Cours Archivé",
                  card_title: "Cours Terminés",
                  table_headers: {
                    course_name: "Nom du Cours",
                    department: "Département",
                    archived_date: "Date d'Archivage",
                    final_status: "Statut Final",
                    badge: "Terminé"
                  }
                },
                modal: {
                  add_course: {
                    errors: {
                      name_required: "Nom requis",
                      start_date_required: "Date de début requise",
                      end_date_required: "Date de fin requise",
                      invalid_date_range: "Dates invalides",
                      description_required: "Description requise"
                    },
                    title: "Ajouter un Nouveau Cours",
                    fields: {
                      course_name: "Nom du Cours",
                      course_nameplaceholder: "Nom du Cours",
                      department: "Département",
                      departmentplaceholder: "Département",
                      dateStart: "Date de Début",
                      dateEnd: "Date de Fin",
                      duration: "Durée",
                      description: "Description",
                      descriptionplaceholder: "Description du cours",
                      button1: "Annuler",
                      button2: "Enregistrer le Cours"
                    }
                  }
                },
                details: {
                  title: "Détails du Cours",
                  employeeAssing: "Employés Assignés",
                  employeenofound: "Employé non trouvé",
                  archiveButton: "Archiver le Cours",
                  selectemployeetitle: "Assigner un Employé au Cours",
                  selectemployee: "Sélectionner un Employé",
                  selectemployeeplaceholder: "Sélectionner un Employé",
                  selectbutton: "Assigner"
                }
              },
              perfil: {
              info_personal: "Informations personnelles",
              actualizar_info: "Mettre à jour les informations personnelles",
              perfil_personal: "Profil personnel",
              descripcion_perfil: "Voir vos informations personnelles et coordonnées",
              nickname: "Surnom",
              nombre_completo: "Nom complet",
              email: "Email",
              telefono: "Téléphone",
              departamento: "Département",
              biografia: "Biographie",
              actualizar_perfil: "Mettre à jour le profil personnel",
              descripcion_actualizar: "Mettez à jour vos informations personnelles et coordonnées",
              cambiar_foto: "Changer la photo",
              guardar_cambios: "Enregistrer les modifications",
              cancelar: "Annuler",
              perfil_actualizado: "Profil mis à jour",
              cambios_guardados: "Les modifications ont été enregistrées avec succès.",
              error: "Erreur",
              guardar_error: "Impossible d'enregistrer les modifications.",
              url_avatar: "Photo de Profil"
            },
            notificaciones:{
              title: "Notifications archivées",
             nonotis:"Aucune notification n'est archivée",
             vence:"Expire le",
            },
            login: {
              bienvenido: "Bienvenue à nouveau",
              ingresa_credenciales: "Entrez vos identifiants pour continuer",
              correo_electronico: "Adresse e-mail",
              placeholder_email: "utilisateur@entreprise.com",
              contraseña: "Mot de passe",
              placeholder_password: "••••••••",
              usuario_no_encontrado: "Utilisateur non trouvé.",
              contraseña_incorrecta: "Mot de passe incorrect.",
              error_autenticacion: "Erreur d'authentification. Veuillez réessayer.",
              iniciar_sesion: "Se connecter",
              iniciando_sesion: "Connexion en cours...",
              gestiona_proyectos: "Gérez vos projets facilement",
              monitorea_progreso: "Surveillez l'avancement de vos projets et gardez tout sous contrôle depuis notre plateforme."
            },
            beneficios: {
              page_title: "Avantages pour les employés",
              page_description: "Découvrez tous les avantages disponibles pour notre équipe",
              tabs: {
                printable_list: "Liste imprimable",
                organization_chart: "Organigramme"
              },
              organization_chart: {
                title: "Organigramme de l'entreprise",
                placeholder: "Organigramme de l'entreprise"
              },
              benefits_list: {
                title: "Liste complète des avantages",
                print_button: "Imprimer"
              },
              categories: {
                free_time: "Temps libre",
                health_and_wellness: "Santé et bien-être",
                financial_benefits: "Avantages financiers"
              },
              benefits: {
                free_time1: "20 jours de congés payés par an",
                free_time2: "Jour de congé pour votre anniversaire",
                free_time3: "Congé de paternité prolongé",
                free_time4: "Congé de maternité prolongé",
                health1: "Assurance santé complète pour les employés et leur famille proche",
                health2: "Abonnement gratuit à une salle de sport locale",
                financial1: "Plan de retraite avec contribution de 5%",
                financial2: "Prime de rentrée scolaire",
                financial3: "Coffret de Noël"
              }
            },
            asistencia: {
              page_title: "Enregistrement de présence",
              select_company_placeholder: "Sélectionnez une entreprise",
              table_headers: {
                id: "ID",
                name: "Nom",
                dni: "Numéro d'identification",
                department: "Département",
                attendance: "Présence"
              },
              no_employees_in_company: "Il n'y a pas d'employés dans cette entreprise",
              select_company_message: "Sélectionnez une entreprise pour voir les employés",
              mark_attendance_button: "Marquer la présence"
            },
            pagedashboard: {
              dashboardTitle: "Tableau de bord RH",
              dashboardDescription: "Vue d'ensemble des ressources humaines",
              selectCompanyLabel: "Sélectionner l'entreprise",
              selectCompanyPlaceholder: "Sélectionner l'entreprise",
              totalEmployeesTitle: "Total des employés",
              totalEmployeesDescription: "Employés actifs",
              averageAttendanceTitle: "Assiduité moyenne",
              averageAttendanceDescription: "Dernier mois",
              payrollExpenseTitle: "Dépenses de la masse salariale",
              payrollExpenseDescription: "Total mensuel",
              trainingHoursTitle: "Heures de formation",
              trainingHoursDescription: "Total des heures",
              salaryAnalysisTitle: "Analyse salariale par département",
              averageLabel: "Moyenne",
              standardDeviationLabel: "Écart type",
              genderDistributionTitle: "Répartition par sexe",
              genderDistributionDescription: "Proportion des employés par sexe dans l'organisation",
              remindersTitle: "Rappels"
            },
            nominas: {
              toast: {
                error: "Erreur lors du chargement des données",
                success: "Absences enregistrées avec succès",
                errorasistencia: "Erreur lors de l'enregistrement des absences",
              },
              header: {
                title: "Gestion de la Paie",
                sectionTitle: "Paie Mensuelle - Période",
                selectCompany: "Sélectionner une entreprise",
                saveAbsences: "Enregistrer les absences",
                filterDepartment: "Filtrer par département",
                deptos: "Tous les départements",
                noEmployees: "Aucun employé à afficher",
                selectCompanyMessage: "Sélectionnez une entreprise pour voir les données de paie",
              },
              columns: {
                name: "Nom",
                surname: "Prénom",
                dni: "DNI",
                email: "E-mail",
                department: "Département",
                subdepartment: "Sous-département",
                puesto: "Poste",
                basicSalary: "Salaire de Base",
                averageIncentive: "Prime Moyenne",
                monthlyIncentive: "Prime Mensuelle",
                absenceDays: "Jours d'Absence",
                absenceDiscount: "Réduction pour Absences",
                totalBasicIncentive: "Total Base + Prime",
                bonus: "Bonus",
                finalTotal: "Total Final (Total de Base + Prime)",
              },
              dialog: {
                button1: "Calculer Salaire, Primes, Bonus, et Totaux",
                title: "Calculer Salaire, Primes, Bonus, et Totaux",
                description: "Veuillez entrer les données requises",
                globalGroup: "Augmentation Globale (Toute l'Entreprise)",
                globalGroupDescription: "Pourcentage d'Augmentation",
                globalGroupPlaceholder: "Entrez le pourcentage",
                Department: "Augmentation de Département (Tout le Département)",
                selectDepartmentPlaceholder: "Sélectionnez un Département",
                DepartmentDescription: "Pourcentage d'Augmentation",
                SubDepartment: "Augmentation de Sous-département (Tout le Sous-Dept)",
                Empleado: "Primes et Bonus par Employé",
                SubDepartmentDescription: "Pourcentage d'Augmentation",
                SubDepartmentPlaceholder: "Entrez l'augmentation pour le sous-département",
                incentivoprom: "Prime Moyenne",
                incentivomens: "Prime Mensuelle",
                inas: "Jours d'Absence",
                bono: "Bonus",
                button2: "Enregistrer les Modifications",
              },
            },
            desempeño: {
              title: "Système d'Évaluation de Performance",
              legajosection: {
                tipo1: "Contrat",
                tipo2: "Évaluations",
                tipo3: "Documents Personnels",
                leg: "Dossiers",
              },
              tabs: {
                employe: "Employés",
                employeTec: "Techniciens",
              },
              dialogs: {
                legajo: {
                  title: "Dossiers de",
                  description: "Sélectionnez l'année et le type de document",
                  leg: "Dossier",
                  fileButtonAlert: "Ouverture de {{fileType}} pour {{employeeName}} pour l'année {{year}}.",
                  closeButton: "Fermer",
                },
                evaluation: {
                  titles: {
                    self: "Auto-évaluation",
                    boss: "Évaluation du Manager",
                    calibration: "Calibration Finale",
                    asesor: "Évaluation de l'Conseiller",
                    capacitador: "Évaluation du Formateur",
                    calibrationTec: "Calibration Finale Technique",
                    legajo: "Dossiers de l'Employé",
                  },
                  footerButtons: {
                    cancel: "Annuler",
                    save: "Enregistrer",
                  },
                },
              },
              evaluationPage: {
                dialogs: {
                  uploadedFiles: "Fichiers Téléchargés",
                  pdpTitle: "Plan de Développement Professionnel",
                  pdcTitle: "Plan de Développement Curriculaire",
                  self_evaluationTitle: "Auto-évaluation",
                  boss_evaluationTitle: "Évaluation du Manager",
                  calibrationTitle: "Calibration",
                  asesor_evaluationTitle: "Évaluation du Conseiller",
                  capacitador_evaluationTitle: "Évaluation du Formateur",
                  final_calibrationTitle: "Calibration Finale",
                  legajoTitle: "Dossiers",
                  self_evaluationDescription: "Voir ou Mettre à Jour l'Auto-évaluation",
                  boss_evaluationDescription: "Voir ou Mettre à Jour l'Évaluation du Manager",
                  calibrationDescription: "Voir ou Mettre à Jour la Calibration",
                  asesor_evaluationDescription: "Voir ou Mettre à Jour l'Évaluation du Conseiller",
                  capacitador_evaluationDescription: "Voir ou Mettre à Jour l'Évaluation du Formateur",
                  final_calibrationDescription: "Voir ou Mettre à Jour la Calibration Finale",
                  legajoDescription: "Voir ou Mettre à Jour les Dossiers",
                  pdpDescription: "Voir ou Mettre à Jour le Plan de l'Employé",
                  pdcDescription: "Voir ou Mettre à Jour le Plan du Technicien",
                },
                general: {
                  employeeTitle: "Évaluation de Performance - Employés",
                  techTitle: "Évaluation de Performance - Techniciens",
                  selectCompany: "Sélectionnez une entreprise",
                },
                tableHeaders: {
                  employee: ["Nom", "Prénom", "Département", "Poste", "PDP", "Auto-évaluation", "Évaluation du Manager", "Calibration Finale", "Actions"],
                  tech: ["Nom", "Prénom", "Département", "Poste", "PDC", "Évaluation du Conseiller", "Évaluation du Formateur", "Calibration Finale", "Dossier"],
                },
                actions: {
                  uploadFile: "Télécharger un Fichier",
                  uploadAnotherFile: "Télécharger un Nouveau Fichier",
                  view: "Voir",
                  pdp: "PDP",
                  uploadPDP:"PDP",
        uploadPDC:"PDC",
                  viewPDP: "PDP",
                  viewPDC: "PDC",
                  uploadAutoevaluación: "Télécharger l'Auto-évaluation",
                  uploadEvaluaciónJefe: "Télécharger l'Évaluation du Manager",
                  uploadCalibración: "Télécharger la Calibration",
                  uploadEvaluaciónAsesor: "Télécharger l'Évaluation du Conseiller",
                  uploadEvaluaciónCapacitador: "Télécharger l'Évaluation du Formateur",
                  uploadCalibraciónFinal: "Télécharger la Calibration Finale",
                  uploadLegajo: "Dossier",
                },
              },
            },
            empleados: {
              linkedin: {
                title: "Lien non disponible",
                titlept1: "L'employé",
                titlept2: "ne possède pas de lien LinkedIn",
                description: "Voulez-vous en ajouter un?",
                button1: "Annuler",
                button2: "Ajouter",
              },
              nohay: {
                nohaydepto: "Aucun département disponible",
                nohaysubdepto: "Aucun sous-département disponible",
                nohaypuesto: "Aucun poste disponible",
              },
              baja: {
                title: "Êtes-vous sûr de désactiver",
                description: "Cette action changera le statut de l'employé en inactif.",
                button1: "Annuler",
                button2: "Oui, désactiver"
              },
              birthday: {
                title: "Anniversaires!",
                description: "Aujourd'hui c'est l'anniversaire de "
              },
              employeesManagement: {
                title: "Gestion des Employés",
                description: "Gérez les informations du personnel"
              },
              companySelection: {
                label: "Sélectionner une Entreprise",
                placeholder: "Sélectionner une entreprise"
              },
              buttons: {
                addEmployee: "Ajouter un Nouvel Employé",
                viewEmployeesList: "Voir la Liste des Employés",
                save: "Enregistrer"
              },
              filters: {
                departmentFilterLabel: "Filtrer par Département",
                departmentFilterPlaceholder: "Sélectionner un département",
                allDepartments: "Tous les départements"
              },
              addEmployee: {
                title: "Ajouter un Nouvel Employé",
                description: "Entrez les informations du nouvel employé",
                form: {
                  fields: {
                    nombre: {
                      label: "Prénom",
                      placeholder: "Juan"
                    },
                    apellido: {
                      label: "Nom de Famille",
                      placeholder: "Pérez"
                    },
                    dni: {
                      label: "DNI",
                      placeholder: "12345678"
                    },
                    correo: {
                      label: "E-mail",
                      placeholder: "juan.perez@exemple.com"
                    },
                    departamento: {
                      label: "Département",
                      placeholder: "Ventes"
                    },
                    titulo: {
                      label: "Titre",
                      placeholder: "Titre académique ou spécialisation"
                    },
                    sueldo: {
                      label: "Salaire",
                      placeholder: "70000"
                    },
                    genero: {
                      label: "Genre",
                      options: {
                        male: "Homme",
                        female: "Femme"
                      }
                    },
                    fechaNacimiento: {
                      label: "Date de Naissance",
                      placeholder: "jj/mm/aaaa"
                    },
                    linkedin: {
                      label: "Lien LinkedIn",
                      placeholder: "Lien vers le Profil",
                    },
                  }
                }
              },
              employeesList: {
                headers: {
                  nombre: "Prénom",
                  apellido: "Nom de Famille",
                  dni: "DNI",
                  titulo: "Diplôme", 
                  correo: "E-mail",
                  departamento: "Département",
                  subdepartamento: "Sous-département",
                  puesto:"Poste",
                  sueldo: "Salaire",
                  genero: "Genre",
                  fechaNacimiento: "Date de Naissance",
                  acciones: "Actions"
                },
                actions: {
                  delete: "Supprimer"
                },
                noDate: "Date non disponible"
              },
              editEmployee: {
                title: "Modifier les données",
                description: "Ici, vous pouvez modifier les données personnelles des employés. N'oubliez pas de bien vérifier.",
                button: "Mettre à jour",
                buttoncancel: "Annuler"
              },
            }
          }
        }
      };

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // Idioma por defecto
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;