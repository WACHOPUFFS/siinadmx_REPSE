import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';

interface Empleado {
  [key: string]: any;
  employee_id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  birth_date: string;
  marital_status_id: number;
  gender_id: number;
  curp: string;
  social_security_number: string;
  rfc: string;
  email: string;
  phone_number: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  start_date: string;
  department_id: number;
  position_id: number;
  shift_id: number;
  status: string;
  net_balance?: number;  // Campo adicional para saldo neto
  daily_salary?: number; // Campo adicional para salario diario
  employee_code?: string; // Campo adicional para código del empleado
}

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.page.html',
  styleUrls: ['./edit-employee.page.scss'],
})
export class EditEmployeePage implements OnInit {
  empleadosPendientes: Empleado[] = [];
  selectedEmployee: Empleado | null = null;
  departamentos: any[] = [];
  puestos: any[] = [];
  turnos: any[] = [];
  genders: any[] = [];
  maritalStatuses: any[] = [];
  curpValidationMessage: string = '';
  mostrarInfonavit: boolean = false;
  files: { [key: string]: File } = {};
  employeeFiles: any = {};
  isAdmin: boolean = false;
  isAdminU: boolean = false;
  buttonNameSucessEmployee: string = '';
  allFieldsCompleted: boolean = false;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private navCtrl: NavController,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.selectedLevelUser === 'admin';
    this.isAdminU = this.authService.selectedLevelUser === 'adminU';
    this.buttonNameSucessEmployee = this.isAdminU ? 'Aceptar empleado' : 'Enviar Solicitud Pendiente';
    this.loadInitialData();
  }

  loadInitialData() {
    this.fetchPendingEmployees();
    this.fetchGenders();
    this.fetchMaritalStatuses();
    this.fetchDepartamentos();
  }

  fetchPendingEmployees() {
    const companyId = this.authService.selectedId;
    let endpoint = '';

    if (this.authService.selectedLevelUser === 'superV') {
      endpoint = 'get_incomplete_employees.php';
    } else if (this.authService.selectedLevelUser === 'admin') {
      endpoint = 'get_pending_employees.php';
    } else if (this.authService.selectedLevelUser === 'adminU') {
      endpoint = 'get_complete_employees.php';
    }

    this.http.get<any[]>(`https://siinad.mx/php/${endpoint}?company_id=${companyId}`).subscribe(
      data => {
        console.log('Respuesta del servidor:', data);  // Depuración
        if (Array.isArray(data)) {
          this.empleadosPendientes = data;
        } else {
          console.error('Error: la respuesta no es un array');
        }
        this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
      },
      error => console.error('Error al cargar empleados pendientes', error)
    );
  }

  fetchDepartamentos() {
    const companyId = this.authService.selectedId;
    this.http.get<any[]>(`https://siinad.mx/php/get_departments.php?company_id=${companyId}`).subscribe(
      data => {
        this.departamentos = data;
        this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
      },
      error => console.error('Error al cargar departamentos', error)
    );
  }

  fetchPuestos(departmentId: number) {
    this.http.get<any[]>(`https://siinad.mx/php/get_positions.php?department_id=${departmentId}`).subscribe(
      data => {
        this.puestos = data;
        if (this.puestos.length > 0) {
          this.fetchTurnos(this.puestos[0].position_id);
        }
        this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
      },
      error => console.error('Error al cargar puestos', error)
    );
  }

  fetchTurnos(positionId: number) {
    this.http.get<any[]>(`https://siinad.mx/php/get_shifts.php?position_id=${positionId}`).subscribe(
      data => {
        this.turnos = data;
        this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
      },
      error => console.error('Error al cargar turnos', error)
    );
  }

  fetchGenders() {
    this.http.get<any[]>('https://siinad.mx/php/get_genders.php').subscribe(
      data => {
        console.log('Géneros cargados:', data); // Depuración
        this.genders = data;
        this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
      },
      error => console.error('Error al cargar géneros', error)
    );
  }

  fetchMaritalStatuses() {
    this.http.get<any[]>('https://siinad.mx/php/get_marital_statuses.php').subscribe(
      data => {
        console.log('Estados civiles cargados:', data); // Depuración
        this.maritalStatuses = data;
        this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
      },
      error => console.error('Error al cargar estados civiles', error)
    );
  }

  fetchEmployeeFiles(employeeId: number) {
    this.http.get<any>(`https://siinad.mx/php/get_employee_files.php?employee_id=${employeeId}`).subscribe(
      data => {
        this.employeeFiles = data;
        this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
      },
      error => console.error('Error al cargar archivos del empleado', error)
    );
  }

  onSelectEmployee(event: any) {
    const employeeId = event.target.value;
    this.selectedEmployee = this.empleadosPendientes.find(emp => emp.employee_id === +employeeId) || null;
    if (this.selectedEmployee) {
      console.log('Empleado seleccionado:', this.selectedEmployee); // Depuración
      this.fetchPuestos(this.selectedEmployee.department_id);
      this.fetchTurnos(this.selectedEmployee.position_id);
      this.fetchEmployeeFiles(this.selectedEmployee.employee_id);
      this.checkAllFieldsCompleted();
    }
  }

  eliminarSolicitud() {
    if (this.selectedEmployee) {
      const employeeId = this.selectedEmployee.employee_id;
      this.http.post('https://siinad.mx/php/delete_employee_request.php', { employee_id: employeeId }).subscribe(
        async (response: any) => {
          const toast = await this.toastController.create({
            message: 'Solicitud de empleado eliminada exitosamente.',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.fetchPendingEmployees();
          this.selectedEmployee = null;
        },
        async error => {
          const toast = await this.toastController.create({
            message: 'Error al eliminar solicitud de empleado.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
      );
    }
  }

  onDepartmentChange(event: any) {
    const departmentId = event.target.value;
    if (this.selectedEmployee) {
      this.selectedEmployee.department_id = departmentId;
      this.fetchPuestos(departmentId);
      this.checkAllFieldsCompleted();
    }
  }

  onPositionChange(event: any) {
    const positionId = event.target.value;
    if (this.selectedEmployee) {
      this.selectedEmployee.position_id = positionId;
      this.fetchTurnos(positionId);
      this.checkAllFieldsCompleted();
    }
  }

  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file) {
      this.files[fileType] = file;
      console.log(`Archivo ${fileType} seleccionado:`, file);
      this.checkAllFieldsCompleted();
    }
  }

  mostrarOcultarCampo(event: any) {
    this.mostrarInfonavit = event.target.value === 'si';
    this.checkAllFieldsCompleted();
  }

  eliminarArchivo(fileId: number) {
    this.http.post('https://siinad.mx/php/delete_employee_file.php', { file_id: fileId }).subscribe(
      response => {
        console.log('Archivo eliminado', response);
        if (this.selectedEmployee) {
          this.fetchEmployeeFiles(this.selectedEmployee.employee_id);
        }
      },
      error => console.error('Error al eliminar archivo', error)
    );
  }

  checkAllFieldsCompleted() {
    if (this.authService.selectedLevelUser === 'superV') {
      this.allFieldsCompleted = !!(
        this.selectedEmployee?.first_name &&
        this.selectedEmployee?.last_name &&
        this.selectedEmployee?.middle_name &&
        this.selectedEmployee?.curp &&
        this.selectedEmployee?.social_security_number &&
        this.selectedEmployee?.rfc &&
        this.selectedEmployee?.start_date &&
        this.files['ineFrente'] &&
        this.files['ineReverso'] &&
        this.files['constanciaFiscal']
      );
    } else if (this.authService.selectedLevelUser === 'admin') {
      this.allFieldsCompleted = !!(
        this.selectedEmployee?.first_name &&
        this.selectedEmployee?.last_name &&
        this.selectedEmployee?.middle_name &&
        this.selectedEmployee?.curp &&
        this.selectedEmployee?.social_security_number &&
        this.selectedEmployee?.rfc &&
        this.selectedEmployee?.start_date &&
        this.selectedEmployee?.net_balance &&
        this.selectedEmployee?.email &&
        this.selectedEmployee?.phone_number &&
        this.files['ineFrente'] &&
        this.files['ineReverso'] &&
        this.files['constanciaFiscal'] &&
        this.files['cuentaInterbancaria']
      );
    } else if (this.authService.selectedLevelUser === 'adminU') {
      this.allFieldsCompleted = !!this.selectedEmployee?.daily_salary;
    }
    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.selectedEmployee) {
      const data: any = {
        id: this.selectedEmployee.employee_id,
        departamento: this.selectedEmployee.department_id,
        puesto: this.selectedEmployee.position_id,
        turno: this.selectedEmployee.shift_id,
        nombre: this.selectedEmployee.first_name,
        apellidoPaterno: this.selectedEmployee.last_name,
        apellidoMaterno: this.selectedEmployee.middle_name,
        fechaNacimiento: this.selectedEmployee.birth_date,
        estadoCivil: this.selectedEmployee.marital_status_id,
        sexo: this.selectedEmployee.gender_id,
        curp: this.selectedEmployee.curp,
        numeroSeguroSocial: this.selectedEmployee.social_security_number,
        rfc: this.selectedEmployee.rfc,
        correoElectronico: this.selectedEmployee.email,
        telefono: this.selectedEmployee.phone_number,
        contactoEmergencia: this.selectedEmployee.emergency_contact_name,
        numEmergencia: this.selectedEmployee.emergency_contact_number,
        fechaInicio: this.selectedEmployee.start_date,
        companyId: this.authService.selectedId
      };

      if (this.isAdmin) {
        data.net_balance = this.selectedEmployee.net_balance;
      }

      if (this.isAdminU) {
        data.daily_salary = this.selectedEmployee.daily_salary;
        data.employee_code = this.selectedEmployee.employee_code;
      }

      this.http.post('https://siinad.mx/php/update_employee.php', data).subscribe(
        async (response: any) => {
          const toast = await this.toastController.create({
            message: 'Empleado actualizado exitosamente.',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.uploadFiles();
        },
        async error => {
          const toast = await this.toastController.create({
            message: 'Error al actualizar empleado.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
      );
    } else {
      this.validateAllFormFields(form);
    }
  }

  uploadFiles() {
    if (this.selectedEmployee) {
      const formData = new FormData();
      formData.append('employee_id', this.selectedEmployee.employee_id.toString());

      for (const fileType in this.files) {
        formData.append(fileType, this.files[fileType]);
      }

      this.http.post('https://siinad.mx/php/update_upload_files.php', formData).subscribe(
        async (response: any) => {
          const toast = await this.toastController.create({
            message: 'Archivos actualizados exitosamente.',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.fetchPendingEmployees();
          this.selectedEmployee = null;
        },
        async error => {
          const toast = await this.toastController.create({
            message: 'Error al actualizar archivos.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
      );
    }
  }

  enviarSolicitudPendiente() {
    if (this.selectedEmployee) {
      let newStatus = 'Pending';
      if (this.authService.selectedLevelUser === 'admin') {
        newStatus = 'Complete';
      } else if (this.authService.selectedLevelUser === 'superV') {
        newStatus = 'Pending';
      } else if (this.authService.selectedLevelUser === 'adminU') {
        newStatus = 'Finish';
      }

      const data = {
        employee_id: this.selectedEmployee.employee_id,
        status: newStatus
      };

      this.http.post('https://siinad.mx/php/update_employee_status.php', data).subscribe(
        async (response: any) => {
          const toast = await this.toastController.create({
            message: 'Estado de la solicitud actualizado exitosamente.',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.fetchPendingEmployees();
          this.selectedEmployee = null;
        },
        async error => {
          const toast = await this.toastController.create({
            message: 'Error al actualizar el estado de la solicitud.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
      );
    }
  }

  validateAllFormFields(form: NgForm) {
    Object.keys(form.controls).forEach(field => {
      const control = form.controls[field];
      control?.markAsTouched({ onlySelf: true });
    });
  }

  selectEmployee(employee: Empleado | null) {
    this.selectedEmployee = employee;
    this.checkAllFieldsCompleted();
  }

  cancelarYResetear() {
    this.selectedEmployee = null;
    const employeeSelect = document.getElementById('employeeSelect') as HTMLSelectElement;
    if (employeeSelect) {
      employeeSelect.value = ''; // Resetea el valor seleccionado
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
