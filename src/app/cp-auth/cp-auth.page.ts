import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { DataStorageService } from '../data-storage-service';
import { ToastController, ModalController, NavController } from '@ionic/angular';
import { CpAuthModalPage } from '../cp-auth-modal/cp-auth-modal.page';
import { CpAuthModalDeletePage } from '../cp-auth-modal-delete/cp-auth-modal-delete.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cp-auth',
  templateUrl: './cp-auth.page.html',
  styleUrls: ['./cp-auth.page.scss'],
})
export class CpAuthPage implements OnInit {
  socios: any[] = []; // Arreglo para almacenar los socios comerciales no confirmados
  selectedSocio: any;

  // Etiquetas para los textos en la vista
  labelAutorizarSocioComercial: string;
  labelSeleccioneSocioComercial: string;
  labelDetallesSocioComercial: string;
  buttonAceptarSocio: string;
  buttonRechazarSocio: string;
  labelNombreEmpresa: string;
  labelRFC: string;
  labelRolComo: string;
  labelFechaInicioPeriodo: string;
  labelFechaFinPeriodo: string;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private dataStorageService: DataStorageService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
    this.labelAutorizarSocioComercial = dataStorageService.labelAutorizarSocioComercial;
    this.labelSeleccioneSocioComercial = dataStorageService.labelSeleccioneSocioComercial;
    this.labelDetallesSocioComercial = dataStorageService.labelDetallesSocioComercial;
    this.buttonAceptarSocio = dataStorageService.buttonAceptarSocio;
    this.buttonRechazarSocio = dataStorageService.buttonRechazarSocio;
    this.labelNombreEmpresa = dataStorageService.labelNombreEmpresa;
    this.labelRFC = dataStorageService.labelRFC;
    this.labelRolComo = dataStorageService.labelRolComo;
    this.labelFechaInicioPeriodo = dataStorageService.labelFechaInicioPeriodo;
    this.labelFechaFinPeriodo = dataStorageService.labelFechaFinPeriodo;
  }

  ngOnInit() {
    // Llamar a la función para obtener los socios comerciales no confirmados al inicializar el componente
    this.obtenerSociosNoConfirmados();
  }

  obtenerSociosNoConfirmados() {
    const selectedCompanyId = this.authService.selectedId;
    const userId = this.authService.userId; // Obtener el userId del usuario actual del servicio AuthService
  
    if (selectedCompanyId && userId) {
      this.http.get<any>(`https://siinad.mx/php/get_cp_auth.php?id=${selectedCompanyId}&user_id=${userId}`)
        .subscribe((data: any) => {
          if (Array.isArray(data)) {
            this.socios = data; // Si `data` es un array, lo asignamos directamente
          } else if (data.mensaje) {
            this.socios = []; // Si hay un mensaje, no hay socios
            console.warn(data.mensaje);
          } else {
            this.socios = [data]; // Si es un solo objeto, conviértelo en un array
          }
        });
    }
  }
  


  getSocioDetails() {
    console.log('Detalles del socio seleccionado:', this.selectedSocio);
  }

  aceptarSocio() {
    // Crear un objeto con los campos companyId y associationId
    const data = {
      userId: this.authService.userId,
      companyId: this.authService.selectedId,
      associationId: this.selectedSocio.id
    };

    // Realizar la solicitud HTTP para actualizar el campo 'verified' del socio seleccionado a 1
    this.http.post<any>('https://siinad.mx/php/update_verified.php', data)
      .subscribe(async (response: any) => {
        if (response.success) {
          console.log('Socio aceptado con éxito');
          // Eliminar al socio del arreglo local
          this.socios = this.socios.filter(socio => socio.id !== this.selectedSocio.id);
          // Limpiar la selección del socio
          this.selectedSocio = null;

          const modal = await this.modalController.create({
            component: CpAuthModalPage,
            componentProps: { continuarRegistro: false }
          });

          await modal.present();

          const { data } = await modal.onDidDismiss();

          if (data.continuarRegistro) {
            // Acción adicional si se selecciona continuar el registro
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          await this.mostrarToast(response.message, 'danger');
        }
      }, (error) => {
        console.error('Error al aceptar al socio:', error);
      });
  }

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
      associationId: this.selectedSocio.id,
      companyId: this.authService.selectedId,
      motivo: motivo
    };

    try {
      // Realizar la solicitud HTTP para eliminar al socio de la tabla
      const response = await this.http.post<any>('https://siinad.mx/php/delete_association.php', data).toPromise();
      // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
      await this.mostrarToast(response.message, 'success');
      // Eliminar al socio del arreglo local
      this.socios = this.socios.filter(socio => socio.id !== this.selectedSocio.id);
      // Limpiar la selección del socio rechazado
      this.selectedSocio = null;
    } catch (error) {
      console.error('Error al rechazar al socio:', error);
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color
    });
    toast.present();
  }

  getRoleDisplayName(roleName: string): string {
    if (roleName === 'proveedor') {
      return 'Proveedor';
    } else if (roleName === 'cliente') {
      return 'Cliente';
    } else if (roleName === 'clienteProveedor') {
      return 'Cliente - Proveedor';
    } else {
      return roleName; // Por si hay algún otro rol no considerado
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
