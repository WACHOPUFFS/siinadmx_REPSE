import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';  // Asegúrate de tener el servicio de autenticación

interface Empleado {
  employee_id: number;
  employee_code: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  full_name: string;
  photo?: string;
  birth_date: string;
  birth_place?: string;
  curp: string;
  curp_initials?: string;
  curp_final?: string;
  social_security_number: string;
  unique_medical_unit_code?: string;
  rfc: string;
  homoclave?: string;
  bank_account_number?: string;
  bank_branch?: string;
  bank_name?: string;
  employee_status: string;
  daily_salary?: number;
  daily_salary_date?: string;
  variable_salary?: number;
  variable_salary_date?: string;
  average_salary?: number;
  average_salary_date?: string;
  integrated_salary?: number;
  integrated_salary_date?: string;
  calculated_salary?: number;
  affected_salary?: number;
  extraordinary_calculated_salary?: number;
  extraordinary_affected_salary?: number;
  salary_modification_net?: number;
  start_date: string;
  contract_type?: string;
  employee_type?: string;
  payment_base?: string;
  payment_method?: string;
  salary_zone?: string;
  ptu_calculation?: string;
  christmas_bonus_calculation?: string;
  imss_registration?: string;
  imss_deregistration?: string;
  phone_number: string;
  postal_code?: string;
  address?: string;
  city?: string;
  state?: string;
  father_name?: string;
  mother_name?: string;
  afore_number?: string;
  termination_date?: string;
  termination_reason?: string;
  settlement_base_salary?: number;
  extra_field_1?: string;
  extra_field_2?: string;
  extra_numeric_field_1?: number;
  clabe?: string;
  email: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  created_at: string;
  updated_at: string;
  department_id: number; // ID del departamento
  position_id: number;   // ID del puesto
  shift_id: number;      // ID del turno
  gender_id: number;
  marital_status_id: number;
}

interface EmployeeFile {
  file_id: number;
  file_type: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
}

interface Departamento {
  department_id: number;
  department_name: string;
}

interface Puesto {
  position_id: number;
  position_name: string;
}

interface Turno {
  shift_id: number;
  shift_name: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent implements OnInit {
  @Input() employeeId: number; // Recibir el ID del empleado
  employee: Empleado = {
    employee_id: 0,
    employee_code: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    full_name: '',
    photo: '',
    birth_date: '',
    birth_place: '',
    curp: '',
    curp_initials: '',
    curp_final: '',
    social_security_number: '',
    unique_medical_unit_code: '',
    rfc: '',
    homoclave: '',
    bank_account_number: '',
    bank_branch: '',
    bank_name: '',
    employee_status: '',
    daily_salary: 0,
    daily_salary_date: '',
    variable_salary: 0,
    variable_salary_date: '',
    average_salary: 0,
    average_salary_date: '',
    integrated_salary: 0,
    integrated_salary_date: '',
    calculated_salary: 0,
    affected_salary: 0,
    extraordinary_calculated_salary: 0,
    extraordinary_affected_salary: 0,
    salary_modification_net: 0,
    start_date: '',
    contract_type: '',
    employee_type: '',
    payment_base: '',
    payment_method: '',
    salary_zone: '',
    ptu_calculation: '',
    christmas_bonus_calculation: '',
    imss_registration: '',
    imss_deregistration: '',
    phone_number: '',
    postal_code: '',
    address: '',
    city: '',
    state: '',
    father_name: '',
    mother_name: '',
    afore_number: '',
    termination_date: '',
    termination_reason: '',
    settlement_base_salary: 0,
    extra_field_1: '',
    extra_field_2: '',
    extra_numeric_field_1: 0,
    clabe: '',
    email: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    created_at: '',
    updated_at: '',
    department_id: 0,
    position_id: 0,
    shift_id: 0,
    gender_id: 0,
    marital_status_id: 0
  };

  files: EmployeeFile[] = []; // Almacena los archivos del empleado
  departamentos: Departamento[] = [];
  puestos: Puesto[] = [];
  turnos: Turno[] = [];

  genders: any[] = [];  // Aquí se almacenarán los géneros
  maritalStatuses: any[] = [];  // Lista de estados civiles

  expectedFileTypes: string[] = ['ineFrente', 'ineReverso', 'constanciaFiscal', 'numSeguroSocialArchivo', 'actaNacimiento', 'CURPFile', 'comprobanteDomicilio', 'cuentaInterbancaria', 'retencionInfonavit', 'antecedentesPenales', 'comprobanteEstudios'];


  employeeFiles: EmployeeFile[] = []; // Array de archivos

  selectedFiles: { [key: number]: File } = {}; // Objeto para almacenar los archivos seleccionados por ID de archivo

  constructor(private modalController: ModalController, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    // Obtener detalles del empleado y luego iniciar la carga de departamentos, puestos y turnos
    this.getGenders();  // Obtener la lista de géneros
    this.getMaritalStatuses();  // Obtener la lista de estados civiles
    this.getEmployeeDetails(this.employeeId);

    // Verificar los archivos cargados
    console.log("Archivos del empleado:", this.employeeFiles);

  }

  // Obtener los detalles del empleado desde el servidor
  getEmployeeDetails(employeeId: number) {
    this.http.get<{ success: boolean, employee: Empleado, files: EmployeeFile[] }>(`https://siinad.mx/php/get_employee_details.php?employee_id=${employeeId}`)
      .subscribe(response => {
        if (response.success) {
          this.employee = response.employee;
          this.employeeFiles = response.files as EmployeeFile[]; // Asignar los archivos obtenidos
          console.log('Archivos del empleado:', this.employeeFiles); // Depura la respuesta para ver si hay archivos
          // Obtener departamentos
          this.getDepartamentos();

          // Cargar puestos basados en el department_id del empleado
          if (this.employee.department_id) {
            this.getPuestos(this.employee.department_id);
          }

          // Cargar turnos basados en el position_id del empleado
          if (this.employee.position_id) {
            this.getTurnos(this.employee.position_id);
          }
        } else {
          console.error('Error al cargar los detalles del empleado');
        }
      });
  }

  // Obtener la lista de departamentos
  getDepartamentos() {
    const companyId = this.authService.selectedId; // Obtener el ID de la empresa desde AuthService
    this.http.get<Departamento[]>(`https://siinad.mx/php/get_departments.php?company_id=${companyId}`)
      .subscribe(departments => {
        this.departamentos = departments; // Asignar el array de departamentos
      }, error => {
        console.error('Error al cargar los departamentos:', error);
      });
  }

  getPuestos(departmentId: number) {
    this.http.get<Puesto[]>(`https://siinad.mx/php/get_positions.php?department_id=${departmentId}`)
      .subscribe(
        response => {
          if (response && response.length > 0) {
            this.puestos = response;  // Ahora asignamos directamente el array devuelto por el PHP
            console.log("Puestos cargados:", this.puestos);
          } else {
            console.error('No se encontraron puestos en la respuesta.');
          }
        },
        error => {
          console.error('Error en la solicitud HTTP de puestos:', error);
        }
      );
  }


  getTurnos(positionId: number) {
    this.http.get<Turno[]>(`https://siinad.mx/php/get_shifts.php?position_id=${positionId}`)
      .subscribe(
        response => {
          if (response && response.length > 0) {
            this.turnos = response;  // Asignamos directamente el array de turnos
            console.log("Turnos cargados:", this.turnos);
          } else {
            console.error('No se encontraron turnos en la respuesta.');
          }
        },
        error => {
          console.error('Error en la solicitud HTTP de turnos:', error);
        }
      );
  }



  // Cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }



  downloadFile(filePath: string) {
    const fullUrl = `https://www.siinad.mx/php/${filePath}`; // URL completa del archivo
    window.open(fullUrl, '_blank'); // Abrir el archivo en una nueva pestaña o iniciar la descarga
  }

  deleteFile(fileId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      // Petición HTTP al backend para eliminar el archivo
      this.http.post<ApiResponse>('https://www.siinad.mx/php/delete_employee_file.php', { file_id: fileId })
        .subscribe(
          (response: ApiResponse) => {
            if (response.success) {
              console.log('Archivo eliminado con éxito');
              // Remover el archivo de la lista de archivos locales para que ya no se muestre en la UI
              this.employeeFiles = this.employeeFiles.filter(file => file.file_id !== fileId);
            } else {
              console.error('Error al eliminar el archivo:', response.message);
              alert('Ocurrió un error al intentar eliminar el archivo. Inténtalo de nuevo.');
            }
          },
          error => {
            // Manejo de errores de la petición
            console.error('Error de red o servidor:', error);
            alert('Error al conectar con el servidor. Verifica tu conexión.');
          }
        );
    }
  }


  // Método para obtener etiquetas amigables para el tipo de archivo
  getLabelForFileType(fileType: string): string {
    switch (fileType) {
      case 'ineFrente':
        return 'Identificación INE (Frente)';
      case 'ineReverso':
        return 'Identificación INE (Reverso)';
      case 'constanciaFiscal':
        return 'Constancia de Situación Fiscal';
      case 'numSeguroSocialArchivo':
        return 'Número de Seguro Social y Unidad Médica';
      case 'actaNacimiento':
        return 'Acta de Nacimiento';
      case 'CURPFile':
        return 'CURP';
      case 'comprobanteDomicilio':
        return 'Comprobante de Domicilio';
      case 'cuentaInterbancaria':
        return 'Cuenta Interbancaria';
      case 'retencionInfonavit':
        return 'Carta de Retención de Infonavit';
      case 'antecedentesPenales':
        return 'Carta de No Antecedentes Penales';
      case 'comprobanteEstudios':
        return 'Comprobante de Estudios';
      default:
        return 'Archivo';
    }
  }


  onFileChange(event: any, fileType: string, fileId?: number) {
    const file = event.target.files[0];
    if (!file) {
      console.error('No se seleccionó ningún archivo.');
      return;
    }

    // Verificar que se haya recibido correctamente el tipo de archivo
    console.log('Archivo seleccionado:', file);
    console.log('Tipo de archivo:', fileType);
    console.log('ID de archivo:', fileId);

    const formData = new FormData();
    formData.append('employee_id', this.employee.employee_id.toString()); // Agregar el ID del empleado
    formData.append(fileType, file); // Aquí el nombre del campo es dinámico según el tipo de archivo (ineFrente, constanciaFiscal, etc.)

    // Si hay un fileId, lo enviamos para actualizar el archivo existente
    if (fileId) {
      formData.append('file_id', fileId.toString());
    }

    // Verificar qué datos contiene FormData antes de enviarlo
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    // Enviar el archivo al servidor
    this.http.post('https://www.siinad.mx/php/update_upload_files.php', formData)
      .subscribe(response => {
        console.log('Respuesta del servidor:', response);
        this.getEmployeeDetails(this.employee.employee_id); // Refresca los detalles del empleado
      }, error => {
        console.error('Error al subir el archivo:', error);
      });
  }









  triggerFileInput(inputId: string) {
    const fileInput = document.getElementById(inputId) as HTMLElement;
    console.log('Intentando seleccionar input con ID:', inputId); // Verificar el ID del input
    if (fileInput) {
      fileInput.click(); // Simula el clic en el input oculto
    } else {
      console.error('No se pudo encontrar el input de archivo con ID:', inputId);
    }
  }





  onPhotoChange(event: any) {
    const file = event.target.files[0]; // Captura el archivo

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        // Si se selecciona un archivo, asigna la vista previa de la imagen
        if (typeof reader.result === 'string') {
          this.employee.photo = reader.result; // Previsualización de la foto
        }
      };

      reader.readAsDataURL(file); // Leer archivo como URL

      // Llama al método para subir el archivo al servidor
      this.uploadPhoto(file);
    }
  }



  uploadPhoto(file: File) {
    const formData = new FormData();

    formData.append('employee_id', this.employee.employee_id.toString()); // Agregar el ID del empleado
    formData.append('file', file); // Agregar el archivo de la imagen
    formData.append('file_type', 'photo'); // Puedes definir un tipo de archivo si es necesario

    // Realizar la solicitud HTTP para subir el archivo
    this.http.post('https://siinad.mx/php/upload_employee_photo.php', formData)
      .subscribe(
        response => {
          console.log('Foto subida exitosamente', response);
          // Aquí podrías actualizar la vista si es necesario o hacer algún cambio en la UI
        },
        error => {
          console.error('Error al subir la foto', error);
        }
      );
  }


  getFileByType(fileType: string): EmployeeFile | null {
    return this.employeeFiles.find(file => file.file_type === fileType) || null;
  }



  saveGeneralInfo() {
    const generalInfo = {
      employee_id: this.employee.employee_id,
      employee_code: this.employee.employee_code,
      first_name: this.employee.first_name,  // Separamos el nombre
      middle_name: this.employee.middle_name,  // Separamos el segundo nombre
      last_name: this.employee.last_name,  // Separamos el apellido
      birth_date: this.employee.birth_date,
      birth_place: this.employee.birth_place,
      curp: this.employee.curp,
      rfc: this.employee.rfc,
      phone_number: this.employee.phone_number,
      email: this.employee.email,
      gender_id: this.employee.gender_id,  // Campo de género
      marital_status_id: this.employee.marital_status_id,  // Campo de estado civil
      company_id: this.authService.selectedId  // ID de la empresa
    };
  
    this.http.post<ApiResponse>('https://www.siinad.mx/php/update_general_info.php', generalInfo)
      .subscribe(response => {
        if (response.success) {
          console.log('Información general actualizada con éxito', response);
        } else {
          alert(response.message);
        }
      }, error => {
        console.error('Error al actualizar la información general', error);
      });
  }
  





  saveFinancialInfo() {
    const financialInfo = {
      employee_id: this.employee.employee_id, // Incluye el ID del empleado
      social_security_number: this.employee.social_security_number,
      bank_account_number: this.employee.bank_account_number,
      bank_name: this.employee.bank_name,
      bank_branch: this.employee.bank_branch,
      clabe: this.employee.clabe
    };

    this.http.post('https://www.siinad.mx/php/update_financial_info.php', financialInfo)
      .subscribe(response => {
        console.log('Información financiera actualizada con éxito', response);
      }, error => {
        console.error('Error al actualizar la información financiera', error);
      });
  }


  saveWorkInfo() {
    const workInfo = {
      employee_id: this.employee.employee_id, // Incluye el ID del empleado
      department_id: this.employee.department_id,
      position_id: this.employee.position_id,
      shift_id: this.employee.shift_id,
      start_date: this.employee.start_date,
      employee_status: this.employee.employee_status
    };

    this.http.post('https://www.siinad.mx/php/update_work_info.php', workInfo)
      .subscribe(response => {
        console.log('Información laboral actualizada con éxito', response);
      }, error => {
        console.error('Error al actualizar la información laboral', error);
      });
  }


  getGenders() {
    this.http.get<any[]>('https://www.siinad.mx/php/get_genders.php')
      .subscribe(response => {
        this.genders = response;  // Asignar la lista de géneros al array
        console.log(this.genders);  // Verificar en la consola que se recibieron los datos
      }, error => {
        console.error('Error al obtener los géneros', error);  // Manejo de errores
      });
  }

  // Método para obtener los estados civiles desde el backend
  getMaritalStatuses() {
    this.http.get<any[]>('https://www.siinad.mx/php/get_marital_statuses.php')
      .subscribe(response => {
        this.maritalStatuses = response;  // Asignar la lista de estados civiles al array
        console.log(this.maritalStatuses);  // Verificar en la consola que se recibieron los datos
      }, error => {
        console.error('Error al obtener los estados civiles', error);  // Manejo de errores
      });
  }

}
