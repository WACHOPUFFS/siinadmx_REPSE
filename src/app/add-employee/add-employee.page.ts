import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

interface Empleado {
  [key: string]: any;
  departamento: string;
  puesto: string;
  turno: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  estadoCivil: string;
  sexo: string;
  curp: string;
  numeroSeguroSocial: string;
  rfc: string;
  correoElectronico: string;
  telefono: string;
  contactoEmergencia: string;
  numEmergencia: string;
  fechaInicio: string;

  // Campos bancarios
  numeroCuenta: string;
  nombreBanco: string;
  sucursalBanco: string;
  clabeInterbancaria: string;
}


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {
  isSubmitting = false; // Variable para controlar el envío

  empleado: Empleado = {
    departamento: '',
    puesto: '',
    turno: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    estadoCivil: '',
    sexo: '',
    curp: '',
    numeroSeguroSocial: '',
    rfc: '',
    correoElectronico: '',
    telefono: '',
    contactoEmergencia: '',
    numEmergencia: '',
    fechaInicio: '',

    // Campos bancarios
    numeroCuenta: '',
    nombreBanco: '',
    sucursalBanco: '',
    clabeInterbancaria: ''
  };

  departamentos: any[] = [];
  puestos: any[] = [];
  turnos: any[] = [];
  genders: any[] = [];
  maritalStatuses: any[] = [];
  curpValidationMessage: string = '';
  mostrarInfonavit: boolean = false;
  files: { [key: string]: File } = {};
  allFieldsCompleted: boolean = false;

  solicitudes: any[] = [];

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private navCtrl: NavController,
    private authService: AuthService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.fetchSolicitudesUltimos15Dias();
    this.fetchDepartamentos();
    this.fetchPuestos();
    this.fetchTurnos();
    this.fetchGenders();
    this.fetchMaritalStatuses();
  }

  fetchSolicitudesUltimos15Dias() {
    const companyId = this.authService.selectedId;  // ID de la empresa
    const userId = this.authService.userId;  // ID del usuario que inició sesión (asegúrate de que esto esté disponible)
    const today = new Date();
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(today.getDate() - 15);

    const params = {
      company_id: companyId,
      user_id: userId,  // Se añade el parámetro del usuario
      fechaInicio: fifteenDaysAgo.toISOString().split('T')[0],
      fechaFin: today.toISOString().split('T')[0],
    };

    this.http.get<any>('https://siinad.mx/php/get_employee_requests.php', { params }).subscribe(
      data => {
        console.log('Solicitudes registradas:', data); // Verifica los datos recibidos

        // Verificar si 'data.solicitudes' es un array antes de asignarlo
        if (data && Array.isArray(data.solicitudes)) {
          this.solicitudes = data.solicitudes;
        } else {
          console.error('El dato recibido no es un array de solicitudes');
          this.solicitudes = []; // Asigna un array vacío si no es un array
        }
      },
      error => {
        console.error('Error al cargar solicitudes registradas', error);
        this.solicitudes = [];
      }
    );


  }


  getStatusDescription(status: string): string {
    switch (status.toLowerCase()) {  // Usar toLowerCase() para asegurarnos de que no haya errores por mayúsculas/minúsculas
      case 'incomplete':
        return 'Solicitud incompleta - Pendiente de información adicional';
      case 'pending':
        return 'Solicitud pendiente - En espera de aprobación por el administrador';
      case 'complete':
        return 'Solicitud completa - En espera de procesamiento por el administrativo';
      case 'finish':
        return 'Solicitud finalizada - Empleado dado de alta';
      default:
        return 'Estado desconocido';
    }
  }
  


  fetchDepartamentos() {
    const companyId = this.authService.selectedId;
    this.http.get<any[]>(`https://siinad.mx/php/get_departments.php?company_id=${companyId}`).subscribe(
      data => {
        console.log('Departamentos:', data); // Verificar la respuesta
        this.departamentos = Array.isArray(data) ? data : []; // Asegurarse de que sea un array
      },
      error => {
        console.error('Error al cargar departamentos', error);
        this.departamentos = []; // En caso de error, asigna un array vacío
      }
    );
  }

  fetchPuestos() {
    const companyId = this.authService.selectedId;
    this.http.get<any[]>(`https://siinad.mx/php/get_positions.php?company_id=${companyId}`).subscribe(
      data => {
        console.log('Puestos:', data); // Verificar la respuesta
        this.puestos = Array.isArray(data) ? data : []; // Asegurarse de que sea un array
      },
      error => {
        console.error('Error al cargar puestos', error);
        this.puestos = []; // En caso de error, asigna un array vacío
      }
    );
  }

  fetchTurnos() {
    const companyId = this.authService.selectedId;
    this.http.get<any[]>(`https://siinad.mx/php/get_shifts.php?company_id=${companyId}`).subscribe(
      data => {
        console.log('Turnos:', data); // Verificar la respuesta
        this.turnos = Array.isArray(data) ? data : []; // Asegurarse de que sea un array
      },
      error => {
        console.error('Error al cargar turnos', error);
        this.turnos = []; // En caso de error, asigna un array vacío
      }
    );
  }


  fetchGenders() {
    this.http.get<any[]>('https://siinad.mx/php/get_genders.php').subscribe(
      data => this.genders = data,
      error => console.error('Error al cargar géneros', error)
    );
  }

  fetchMaritalStatuses() {
    this.http.get<any[]>('https://siinad.mx/php/get_marital_statuses.php').subscribe(
      data => this.maritalStatuses = data,
      error => console.error('Error al cargar estados civiles', error)
    );
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
  }

  async onSubmit(form: NgForm) {
    if (this.isSubmitting) return; // Evita doble envío
    this.isSubmitting = true; // Bloquea envíos adicionales

    if (form.valid) {
      const status = this.allFieldsCompleted ? 'Pending' : 'Incomplete';
      const data = {
        ...this.empleado,
        companyId: this.authService.selectedId,
        userId: this.authService.userId,
        status
      };

      this.http.post('https://siinad.mx/php/submit_employee.php', data).subscribe(
        async (response: any) => {
          const employeeId = response.employee_id;
          const requestId = response.request_id;
          if (employeeId) {
            await this.uploadFiles(employeeId);
            const alert = await this.alertController.create({
              header: status === 'Pending' ? 'Solicitud Enviada' : 'Información Guardada',
              message: status === 'Pending'
                ? `Empleado registrado exitosamente. Folio de solicitud: ${requestId}.`
                : `Información guardada. Tienes 3 días para completar la solicitud. Folio: ${requestId}`,
              buttons: ['OK']
            });
            await alert.present();
            this.goBack();
          } else {
            const toast = await this.toastController.create({
              message: 'Error al registrar empleado.',
              duration: 2000,
              color: 'danger'
            });
            toast.present();
          }
          this.isSubmitting = false; // Libera el bloqueo
        },
        async error => {
          const toast = await this.toastController.create({
            message: 'Error al registrar empleado.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
          this.isSubmitting = false; // Libera el bloqueo
        }
      );
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor, complete todos los campos obligatorios.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      this.validateAllFormFields(form);
      this.isSubmitting = false; // Libera el bloqueo
    }
  }




  checkAllFieldsCompleted() {
    this.allFieldsCompleted = !!(
      this.empleado.nombre &&
      this.empleado.apellidoPaterno &&
      this.empleado.apellidoMaterno &&
      this.empleado.curp &&
      this.empleado.numeroSeguroSocial &&
      this.empleado.rfc &&
      this.empleado.fechaInicio &&
      this.files['ineFrente'] &&
      this.files['ineReverso'] &&
      this.files['constanciaFiscal']
    );
  }



  uploadFiles(employeeId: number) {
    const formData = new FormData();
    formData.append('employee_id', employeeId.toString());

    Object.keys(this.files).forEach(fileType => {
      formData.append(fileType, this.files[fileType]);
    });

    this.http.post('https://siinad.mx/php/upload_employee_files.php', formData).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Archivos del empleado subidos exitosamente.',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      },
      async error => {
        const toast = await this.toastController.create({
          message: 'Error al subir archivos del empleado.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    );
  }

  validateAllFormFields(form: NgForm) {
    Object.keys(form.controls).forEach(field => {
      const control = form.controls[field];
      control?.markAsTouched({ onlySelf: true });
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
