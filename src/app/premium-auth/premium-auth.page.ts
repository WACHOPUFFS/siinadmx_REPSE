import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Importa el servicio AuthService
import { DataStorageService } from '../data-storage-service';
import { ToastController, ModalController } from '@ionic/angular'; // Importa ModalController y ToastController
import {CpAuthModalPage} from  '../cp-auth-modal/cp-auth-modal.page';
import {CpAuthModalDeletePage} from  '../cp-auth-modal-delete/cp-auth-modal-delete.page';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-premium-auth',
  templateUrl: './premium-auth.page.html',
  styleUrls: ['./premium-auth.page.scss'],
})
export class PremiumAuthPage implements OnInit {
  empleados: any[] = []; // Arreglo para almacenar los empleados no confirmados
  selectedEmployee: any;

  labelAutorizarSocioComercial: string;
  labelSeleccioneSocioComercial: string;
  labelDetallesSocioComercial: string;
  buttonAceptarSocio: string;
  buttonRechazarSocio:string;
  labelAliasUsuario: string;
  labelNombreCompletoUsuario: string;
  labelCorreo: string;
  labelFechaInicioPeriodo: string;
  labelFechaFinPeriodo: string;
  labelRFC: string;
  labelRolComo: string;
  labelNombreEmpresa: string;
  

  constructor(private navCtrl: NavController, private router: Router, private authService: AuthService, private http: HttpClient, private dataStorageService: DataStorageService,   private toastController: ToastController, private modalController: ModalController) {
    this.labelAutorizarSocioComercial = dataStorageService.labelAutorizarSocioComercial;
    this.labelSeleccioneSocioComercial = dataStorageService.labelSeleccioneSocioComercial;
    this.labelDetallesSocioComercial = dataStorageService.labelDetallesSocioComercial;
    this.buttonAceptarSocio = dataStorageService.buttonAceptarSocio;
    this.buttonRechazarSocio = dataStorageService.buttonRechazarSocio;
    this.labelRFC = dataStorageService.labelRFC;
    this.labelRolComo = dataStorageService.labelRolComo;
    this.labelAliasUsuario = dataStorageService.labelAliasUsuario;
    this.labelNombreCompletoUsuario = dataStorageService.labelNombreCompletoUsuario;
    this.labelCorreo = dataStorageService.labelCorreo;
    this.labelFechaInicioPeriodo = dataStorageService.labelFechaInicioPeriodo;
    this.labelFechaFinPeriodo = dataStorageService.labelFechaFinPeriodo;
    this.labelNombreEmpresa = dataStorageService.labelNombreEmpresa;
    this.buttonAceptarSocio = dataStorageService.buttonAceptarSocio;
    this.buttonRechazarSocio = dataStorageService.buttonRechazarSocio;
    
   }

  ngOnInit() {
    // Llamar a la función para obtener los empleados no confirmados al inicializar el componente
    this.obtenerEmpleadosNoConfirmados();
  }

  obtenerEmpleadosNoConfirmados() {

      // Realizar la solicitud HTTP para obtener los empleados no confirmados
      this.http.get<any[]>(`https://siinad.mx/php/get_infoSocioComercial.php`)
        .subscribe((data: any[]) => {
          // Asignar los datos de los empleados obtenidos al arreglo de empleados
          this.empleados = data;
        });
    
  }

  getEmployeeDetails() {
    console.log('Detalles del empleado seleccionado:', this.selectedEmployee);
  }

  aceptarSocio() {
    // Crear un objeto con los campos userId y nameCompany
    const data = { 
      userId: this.selectedEmployee.id,
      username: this.selectedEmployee.username,
      name: this.selectedEmployee.name,
      email: this.selectedEmployee.email,
      phone: this.selectedEmployee.phone,
      rfc: this.selectedEmployee.rfc,
      nameCompany: this.selectedEmployee.nameCompany,
      fecha_inicio: this.selectedEmployee.fecha_inicio,
      fecha_fin: this.selectedEmployee.fecha_fin,
      fecha_inicio_request: this.selectedEmployee.fecha_inicio_request,
      fecha_fin_request: this.selectedEmployee.fecha_fin_request,
      folioSolicitud: this.selectedEmployee.requestFolio
  
    };
  
    // Realizar la solicitud HTTP para actualizar el campo 'verified' del usuario seleccionado a 1
    this.http.post<any>('https://siinad.mx/php/sucess_socioComercial.php', data)
      .subscribe(async (response: any) => {
        // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
        console.log('Socio aceptado con éxito');
        // También puedes eliminar al usuario del arreglo local
        this.empleados = this.empleados.filter(empleado => empleado.id !== this.selectedEmployee.id);
        // Limpiar la selección del usuario rechazado
        this.selectedEmployee = null;
  
        if (response.success) {
          const modal = await this.modalController.create({
            component: CpAuthModalPage,
            componentProps: { continuarRegistro: false }
          });
  
          await modal.present();
  
          const { data } = await modal.onDidDismiss();
  
          if (data.continuarRegistro) {
  
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          await this.mostrarToast(response.message, 'danger');
        }
      }, (error) => {
        // Manejar cualquier error de la solicitud HTTP
        console.error('Error al aceptar al socio:', error);
      });
  }
  


  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color
    });
    toast.present();
  }

 // rechazarSocio() {
//
 //   const data = { 
 //     userId: this.selectedEmployee.id,
 //     companyId: this.authService.selectedId
 //   };
//
 //   // Realizar la solicitud HTTP para eliminar al usuario de la tabla
 //   this.http.post<any>('https://siinad.mx/php/delete_user.php', data)
 //     .subscribe( async (response: any) => {
 //       // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
 //       await this.mostrarToast(response.message, 'success');
 //       // También puedes eliminar al usuario del arreglo local
 //       this.empleados = this.empleados.filter(empleado => empleado.id !== this.selectedEmployee.id);
 //       // Limpiar la selección del usuario rechazado
 //       this.selectedEmployee = null;
//
 //     }, (error) => {
 //       // Manejar cualquier error de la solicitud HTTP
 //       console.error('Error al rechazar al socio:', error);
 //     });
 // }


  rechazarSocio() {
    this.presentModal();
  }
  
  async presentModal() {
    const modal = await this.modalController.create({
      component: CpAuthModalDeletePage,
      componentProps: {
        continuarRegistro: false,
        mostrarMotivoRechazo: true,
        confirmarRechazoSocio: this.confirmarRechazoSocio.bind(this) // Pasar la función como propiedad al modal
      }
    });
  
    // Manejar el evento motivoRechazoConfirmado emitido por el modal
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        const motivoRechazo = data.data;
        // Llamar al método confirmarRechazoSocio() pasando el motivo recibido
        this.confirmarRechazoSocio(motivoRechazo);
      }
    });
  
    await modal.present();
  }
  
  async confirmarRechazoSocio(motivo: string) {
    const data = { 
      userId: this.selectedEmployee.id,
      companyId: this.authService.selectedId,
      motivo: motivo
    };
  
    try {
      // Realizar la solicitud HTTP para eliminar al usuario de la tabla
      const response = await this.http.post<any>('https://siinad.mx/php/deleteSolicitud.php', data).toPromise();
      // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
      await this.mostrarToast(response.message, 'success');
      // También puedes eliminar al usuario del arreglo local
      this.empleados = this.empleados.filter(empleado => empleado.id !== this.selectedEmployee.id);
      // Limpiar la selección del usuario rechazado
      this.selectedEmployee = null;
    } catch (error) {
      // Manejar cualquier error de la solicitud HTTP
      console.error('Error al rechazar al socio:', error);
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
  

