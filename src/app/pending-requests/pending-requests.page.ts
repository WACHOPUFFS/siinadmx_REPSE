import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service'; // Importa el servicio AuthService

interface Solicitud {
  id: number;
  userRequester: string;
  message: string;
  senderCompany: string;
}

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.page.html',
  styleUrls: ['./pending-requests.page.scss'],
})
export class PendingRequestsPage {
  solicitudes: Solicitud[] = [];
  solicitudSeleccionada: Solicitud;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private authService: AuthService // Importa el servicio AuthService
  ) { }

  ionViewWillEnter() {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes() {
    const selectedCompany = this.authService.selectedCompany; // Obtiene el nombre de la empresa seleccionada
    if (selectedCompany) {
      // Si hay una empresa seleccionada, realiza la solicitud HTTP con el nombre de la empresa como parámetro
      this.http.get<Solicitud[]>(`https://siinad.mx/php/obtener_solicitudes_pendientes.php?company=${selectedCompany}`)
        .subscribe((data) => {
          this.solicitudes = data;
        });
    }
  }

  mostrarDetalleSolicitud(solicitud: Solicitud) {
    this.solicitudSeleccionada = solicitud;
  }

  aceptarSolicitud(id: number) {
    this.http.post<any>('URL_DEL_ENDPOINT_PARA_ACEPTAR_SOLICITUD', { id })
      .subscribe((response) => {
        // Manejar la respuesta del servidor, por ejemplo, actualizar la lista de solicitudes
        this.mostrarToast('Solicitud aceptada correctamente', 'success');
        this.obtenerSolicitudes(); // Actualizar la lista de solicitudes después de aceptar una solicitud
      }, (error) => {
        // Manejar errores si la solicitud falla
        console.error('Error al aceptar la solicitud:', error);
      });
  }
  
  rechazarSolicitud(id: number) {
    this.http.post<any>('URL_DEL_ENDPOINT_PARA_RECHAZAR_SOLICITUD', { id })
      .subscribe((response) => {
        // Manejar la respuesta del servidor, por ejemplo, actualizar la lista de solicitudes
        this.mostrarToast('Solicitud rechazada correctamente', 'danger');
        this.obtenerSolicitudes(); // Actualizar la lista de solicitudes después de rechazar una solicitud
      }, (error) => {
        // Manejar errores si la solicitud falla
        console.error('Error al rechazar la solicitud:', error);
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
}
