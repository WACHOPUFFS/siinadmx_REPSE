import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { SharedService } from '../shared.service'; // Importar servicio de permisos

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
  allFieldsCompleted: boolean = false;
  buttonNameSucessEmployee: string = '';

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private navCtrl: NavController,
    private authService: AuthService,
    public sharedService: SharedService, // Inyectar SharedService para manejar permisos
    private cdr: ChangeDetectorRef,
    private loadingController: LoadingController // Inyectar LoadingController
  ) { }

  ngOnInit() {
    this.loadPermissions();
  }

  async loadPermissions() {
    const loading = await this.loadingController.create({
      message: 'Cargando permisos...',
      spinner: 'crescent'
    });
    await loading.present();

    this.sharedService.loadPermissions().subscribe(
      async (response: any) => {
        if (response.success) {
          this.sharedService.permissions = response.permissions.map((perm: any) => ({
            section: perm.section,
            subSection: perm.subSection
          }));
          console.log('Permisos cargados:', this.sharedService.permissions); // Depuración

          this.buttonNameSucessEmployee = this.sharedService.hasPermission('Empleados', 'Procesar empleados')
            ? 'Aceptar empleado'
            : 'Enviar Solicitud Pendiente';

          this.loadInitialData();
        } else {
          console.error('Error en la respuesta de permisos:', response.error);
        }
        await loading.dismiss();
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await loading.dismiss();
      }
    );
  }

  loadInitialData() {
    this.fetchPendingEmployees();
    this.fetchGenders();
    this.fetchMaritalStatuses();
    this.fetchDepartamentos();
  }

  async fetchPendingEmployees() {
    const loading = await this.loadingController.create({
      message: 'Cargando empleados pendientes...',
      spinner: 'crescent'
    });
    await loading.present();

    const companyId = this.authService.selectedId;
    let endpoint = '';

    if (this.sharedService.hasPermission('Empleados', 'Editar solicitudes de empleados')) {
      endpoint = 'get_incomplete_employees.php';
    } else if (this.sharedService.hasPermission('Empleados', 'Aceptar solicitudes de empleados')) {
      endpoint = 'get_pending_employees.php';
    } else if (this.sharedService.hasPermission('Empleados', 'Procesar empleados')) {
      endpoint = 'get_complete_employees.php';
    }

    this.http.get<any[]>(`https://siinad.mx/php/${endpoint}?company_id=${companyId}`).subscribe(
      data => {
        console.log('Respuesta del servidor:', data);
        if (Array.isArray(data)) {
          this.empleadosPendientes = data;
        } else {
          console.error('Error: la respuesta no es un array');
        }
        this.cdr.detectChanges();
      },
      error => console.error('Error al cargar empleados pendientes', error)
    ).add(() => {
      loading.dismiss();
    });
  }

  async fetchDepartamentos() {
    const loading = await this.loadingController.create({
      message: 'Cargando departamentos...',
      spinner: 'crescent'
    });
    await loading.present();

    const companyId = this.authService.selectedId;
    this.http.get<any[]>(`https://siinad.mx/php/get_departments.php?company_id=${companyId}`).subscribe(
      data => {
        this.departamentos = data;
        this.cdr.detectChanges();
      },
      error => console.error('Error al cargar departamentos', error)
    ).add(() => {
      loading.dismiss();
    });
  }

  async fetchPuestos(departmentId: number) {
    const loading = await this.loadingController.create({
      message: 'Cargando puestos...',
      spinner: 'crescent'
    });
    await loading.present();

    this.http.get<any[]>(`https://siinad.mx/php/get_positions.php?department_id=${departmentId}`).subscribe(
      data => {
        this.puestos = data;
        if (this.puestos.length > 0) {
          this.fetchTurnos(this.puestos[0].position_id);
        }
        this.cdr.detectChanges();
      },
      error => console.error('Error al cargar puestos', error)
    ).add(() => {
      loading.dismiss();
    });
  }

  async fetchTurnos(positionId: number) {
    const loading = await this.loadingController.create({
      message: 'Cargando turnos...',
      spinner: 'crescent'
    });
    await loading.present();

    this.http.get<any[]>(`https://siinad.mx/php/get_shifts.php?position_id=${positionId}`).subscribe(
      data => {
        this.turnos = data;
        this.cdr.detectChanges();
      },
      error => console.error('Error al cargar turnos', error)
    ).add(() => {
      loading.dismiss();
    });
  }

  async fetchGenders() {
    const loading = await this.loadingController.create({
      message: 'Cargando géneros...',
      spinner: 'crescent'
    });
    await loading.present();

    this.http.get<any[]>('https://siinad.mx/php/get_genders.php').subscribe(
      data => {
        this.genders = data;
        this.cdr.detectChanges();
      },
      error => console.error('Error al cargar géneros', error)
    ).add(() => {
      loading.dismiss();
    });
  }

  async fetchMaritalStatuses() {
    const loading = await this.loadingController.create({
      message: 'Cargando estados civiles...',
      spinner: 'crescent'
    });
    await loading.present();

    this.http.get<any[]>('https://siinad.mx/php/get_marital_statuses.php').subscribe(
      data => {
        this.maritalStatuses = data;
        this.cdr.detectChanges();
      },
      error => console.error('Error al cargar estados civiles', error)
    ).add(() => {
      loading.dismiss();
    });
  }

  async fetchEmployeeFiles(employeeId: number) {
    const loading = await this.loadingController.create({
      message: 'Cargando archivos del empleado...',
      spinner: 'crescent'
    });
    await loading.present();

    this.http.get<any>(`https://siinad.mx/php/get_employee_files.php?employee_id=${employeeId}`).subscribe(
      data => {
        this.employeeFiles = data;
        this.checkAllFieldsCompleted();
        this.cdr.detectChanges();
      },
      error => console.error('Error al cargar archivos del empleado', error)
    ).add(() => {
      loading.dismiss();
    });
  }

  onSelectEmployee(event: any) {
    
    const employeeId = event.target.value;
    this.selectedEmployee = this.empleadosPendientes.find(emp => emp.employee_id === +employeeId) || null;
    if (this.selectedEmployee) {
      this.fetchPuestos(this.selectedEmployee.department_id);
      this.fetchTurnos(this.selectedEmployee.position_id);
      this.fetchEmployeeFiles(this.selectedEmployee.employee_id);
      this.checkAllFieldsCompleted();
    }
  }
  async eliminarSolicitud() {
    if (this.selectedEmployee) {
      const loading = await this.loadingController.create({
        message: 'Eliminando solicitud...',
        spinner: 'crescent'
      });
      await loading.present();

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
      ).add(() => {
        loading.dismiss();
      });
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
        if (this.selectedEmployee) {
          this.fetchEmployeeFiles(this.selectedEmployee.employee_id);
        }
      },
      error => console.error('Error al eliminar archivo', error)
    );
  }






  checkAllFieldsCompleted() {
    console.log('Verificando permisos y campos completados');

    if (this.sharedService.hasPermission('Empleados', 'Editar solicitudes de empleados')) {
      // Verificación para 'superV'
      this.allFieldsCompleted = !!(
        this.selectedEmployee?.first_name &&
        this.selectedEmployee?.last_name &&
        this.selectedEmployee?.middle_name &&
        this.selectedEmployee?.curp &&
        this.selectedEmployee?.social_security_number &&
        this.selectedEmployee?.rfc &&
        this.selectedEmployee?.start_date &&
        (this.files['ineFrente'] || (this.employeeFiles['ineFrente'] && this.employeeFiles['ineFrente'].length > 0)) &&
        (this.files['ineReverso'] || (this.employeeFiles['ineReverso'] && this.employeeFiles['ineReverso'].length > 0)) &&
        (this.files['constanciaFiscal'] || (this.employeeFiles['constanciaFiscal'] && this.employeeFiles['constanciaFiscal'].length > 0))
      );
    } else if (this.sharedService.hasPermission('Empleados', 'Aceptar solicitudes de empleados')) {
      // Verificación para 'admin'
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
        (this.files['ineFrente'] || (this.employeeFiles['ineFrente'] && this.employeeFiles['ineFrente'].length > 0)) &&
        (this.files['ineReverso'] || (this.employeeFiles['ineReverso'] && this.employeeFiles['ineReverso'].length > 0)) &&
        (this.files['constanciaFiscal'] || (this.employeeFiles['constanciaFiscal'] && this.employeeFiles['constanciaFiscal'].length > 0)) &&
        (this.files['cuentaInterbancaria'] || (this.employeeFiles['cuentaInterbancaria'] && this.employeeFiles['cuentaInterbancaria'].length > 0))
      );
    } else if (this.sharedService.hasPermission('Empleados', 'Procesar empleados')) {
      // Verificación para 'adminU'
      this.allFieldsCompleted = !!(
        this.selectedEmployee?.employee_code &&
        this.selectedEmployee?.daily_salary
      );
    }

    this.cdr.detectChanges();
  }














  onSubmit(form: NgForm) {
    console.log('Formulario enviado:', form.value);  // Ver los valores del formulario
  console.log('Formulario válido:', form.valid);  // Ver si el formulario es válido
  console.log('Empleado seleccionado:', this.selectedEmployee);  // Ver el empleado seleccionado
    if (
      form.valid &&
      this.selectedEmployee &&
      this.sharedService.hasPermission('Empleados', 'Editar solicitudes de empleados')
    ) {
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

      if (this.sharedService.hasPermission('Empleados', 'Aceptar solicitudes de empleados')) {
        data.net_balance = this.selectedEmployee.net_balance;
      }

      if (this.sharedService.hasPermission('Empleados', 'Procesar empleados')) {
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
  async uploadFiles() {
    if (this.selectedEmployee) {
      const loading = await this.loadingController.create({
        message: 'Subiendo archivos...',
        spinner: 'crescent'
      });
      await loading.present();

      const formData = new FormData();
      formData.append('employee_id', this.selectedEmployee.employee_id.toString());

      for (const fileType in this.files) {
        if (this.files.hasOwnProperty(fileType)) {
          formData.append(fileType, this.files[fileType]);
        }
      }

      try {
        // Usamos await para esperar la respuesta de la solicitud HTTP
        const response = await this.http.post('https://siinad.mx/php/update_upload_files.php', formData).toPromise();

        // Mostrar mensaje de éxito
        const toast = await this.toastController.create({
          message: 'Archivos actualizados exitosamente.',
          duration: 2000,
          color: 'success'
        });
        toast.present();

        // Actualizar la lista de empleados pendientes y resetear el formulario
        this.fetchPendingEmployees();
        this.selectedEmployee = null;
      } catch (error) {
        // Manejo de errores
        const toast = await this.toastController.create({
          message: 'Error al actualizar archivos.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
        console.error('Error al subir archivos:', error);
      } finally {
        // Asegurarnos de que el loader siempre se cierre, tanto si hay éxito como si ocurre un error
        loading.dismiss();
      }
    }
  }


  async enviarSolicitudPendiente() {
    if (this.selectedEmployee) {
      const loading = await this.loadingController.create({
        message: 'Enviando solicitud pendiente...',
        spinner: 'crescent'
      });
      await loading.present();

      let newStatus = 'Pending';
      let employeeStatus = '';

      if (this.sharedService.hasPermission('Empleados', 'Aceptar solicitudes de empleados')) {
        newStatus = 'Complete';
        employeeStatus = 'A';
      } else if (this.sharedService.hasPermission('Empleados', 'Editar solicitudes de empleados')) {
        newStatus = 'Pending';
      } else if (this.sharedService.hasPermission('Empleados', 'Procesar empleados')) {
        newStatus = 'Finish';
      }

      const data: any = {
        employee_id: this.selectedEmployee.employee_id,
        status: newStatus
      };

      if (newStatus === 'Complete') {
        data.employee_status = employeeStatus;
      }

      this.http.post('https://siinad.mx/php/update_employee_status.php', data).subscribe(
        async (response: any) => {
          await this.uploadFiles();
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
      ).add(() => {
        loading.dismiss();
      });
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
