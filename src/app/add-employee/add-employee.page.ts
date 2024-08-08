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
}

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {
  empleado: Empleado = {
    departamento: '',
    puesto: '',
    turno: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    estadoCivil: '',
    sexo: '',
    curp: '',
    numeroSeguroSocial: '',
    rfc: '',
    correoElectronico: '',
    telefono: '',
    contactoEmergencia: '',
    numEmergencia: '',
    fechaInicio: ''
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

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private navCtrl: NavController,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.fetchDepartamentos();
    this.fetchGenders();
    this.fetchMaritalStatuses();
  }

  fetchDepartamentos() {
    const companyId = this.authService.selectedId;
    this.http.get<any[]>(`https://siinad.mx/php/get_departments.php?company_id=${companyId}`).subscribe(
      data => {
        this.departamentos = data;
        if (this.departamentos.length > 0) {
          this.fetchPuestos(this.departamentos[0].department_id);
        }
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
      },
      error => console.error('Error al cargar puestos', error)
    );
  }

  fetchTurnos(positionId: number) {
    this.http.get<any[]>(`https://siinad.mx/php/get_shifts.php?position_id=${positionId}`).subscribe(
      data => this.turnos = data,
      error => console.error('Error al cargar turnos', error)
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

  onDepartmentChange(event: any) {
    const departmentId = event.target.value;
    this.fetchPuestos(departmentId);
  }

  onPositionChange(event: any) {
    const positionId = event.target.value;
    this.fetchTurnos(positionId);
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
    if (form.valid) {
      const data = {
        departamento: this.empleado.departamento,
        puesto: this.empleado.puesto,
        turno: this.empleado.turno,
        nombre: this.empleado.nombre,
        apellidoPaterno: this.empleado.apellidoPaterno,
        apellidoMaterno: this.empleado.apellidoMaterno,
        fechaNacimiento: this.empleado.fechaNacimiento,
        estadoCivil: this.empleado.estadoCivil,
        sexo: this.empleado.sexo,
        curp: this.empleado.curp,
        numeroSeguroSocial: this.empleado.numeroSeguroSocial,
        rfc: this.empleado.rfc,
        correoElectronico: this.empleado.correoElectronico,
        telefono: this.empleado.telefono,
        contactoEmergencia: this.empleado.contactoEmergencia,
        numEmergencia: this.empleado.numEmergencia,
        fechaInicio: this.empleado.fechaInicio,
        companyId: this.authService.selectedId,
        status: this.allFieldsCompleted ? 'Pending' : 'Incomplete'
      };

      this.http.post('https://siinad.mx/php/submit_employee.php', data).subscribe(
        async (response: any) => {
          const employeeId = response.employee_id;
          if (employeeId) {
            await this.uploadFiles(employeeId);
            if (this.allFieldsCompleted) {
              const toast = await this.toastController.create({
                message: 'Empleado registrado y solicitud enviada exitosamente.',
                duration: 2000,
                color: 'success'
              });
              toast.present();
              this.goBack();
            } else {
              const alert = await this.alertController.create({
                header: 'Información Incompleta',
                message: 'Tienes 3 días para completar la información restante.',
                buttons: ['OK']
              });
              await alert.present();
            }
          } else {
            const toast = await this.toastController.create({
              message: 'Error al registrar empleado.',
              duration: 2000,
              color: 'danger'
            });
            toast.present();
          }
        },
        async error => {
          const toast = await this.toastController.create({
            message: 'Error al registrar empleado.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
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

  async enviarSolicitud() {
    if (this.allFieldsCompleted) {
      const data = {
        departamento: this.empleado.departamento,
        puesto: this.empleado.puesto,
        turno: this.empleado.turno,
        nombre: this.empleado.nombre,
        apellidoPaterno: this.empleado.apellidoPaterno,
        apellidoMaterno: this.empleado.apellidoMaterno,
        fechaNacimiento: this.empleado.fechaNacimiento,
        estadoCivil: this.empleado.estadoCivil,
        sexo: this.empleado.sexo,
        curp: this.empleado.curp,
        numeroSeguroSocial: this.empleado.numeroSeguroSocial,
        rfc: this.empleado.rfc,
        correoElectronico: this.empleado.correoElectronico,
        telefono: this.empleado.telefono,
        contactoEmergencia: this.empleado.contactoEmergencia,
        numEmergencia: this.empleado.numEmergencia,
        fechaInicio: this.empleado.fechaInicio,
        companyId: this.authService.selectedId,
        status: 'Pending'
      };

      this.http.post('https://siinad.mx/php/submit_employee.php', data).subscribe(
        async (response: any) => {
          const employeeId = response.employee_id;
          if (employeeId) {
            await this.uploadFiles(employeeId);
            const toast = await this.toastController.create({
              message: 'Empleado registrado y solicitud enviada exitosamente.',
              duration: 2000,
              color: 'success'
            });
            toast.present();
            this.goBack();
          } else {
            const toast = await this.toastController.create({
              message: 'Error al registrar empleado.',
              duration: 2000,
              color: 'danger'
            });
            toast.present();
          }
        },
        async error => {
          const toast = await this.toastController.create({
            message: 'Error al registrar empleado.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
      );
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor, complete todos los campos obligatorios.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
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
