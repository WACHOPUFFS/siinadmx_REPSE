import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-company-request',
  templateUrl: './company-request.page.html',
  styleUrls: ['./company-request.page.scss'],
})
export class CompanyRequestPage {

  constructor(
    public authService: AuthService, // Hacer el servicio AuthService público
    private http: HttpClient,
    private toastController: ToastController
  ) { }

  async enviarMensaje(mensaje: string) {
    // Obtener datos del usuario del servicio AuthService
    const username = this.authService.username;
    const empresa = this.authService.selectedCompany;

    // Comprobar si se ha iniciado sesión y se tienen los datos del usuario
    if (username ) {
      const datosMensaje = {
        userRequester: username,
        message: mensaje,
        senderCompany: empresa
      };

      // Enviar los datos del mensaje al servidor
      this.http.post('https://siinad.mx/php/guardar_mensaje.php', datosMensaje).subscribe(
        async (response: any) => {
          if (response.success) {
            // Mensaje enviado exitosamente
            await this.mostrarToast('Mensaje enviado correctamente, en espera de confirmación por un administrador', 'success');
          } else {
            // Error al enviar el mensaje
            await this.mostrarToast('Error al enviar el mensaje', 'danger');
          }
        },
        async (error) => {
          console.error('Error al enviar el mensaje:', error);
          await this.mostrarToast('Error al enviar el mensaje', 'danger');
        }
      );
    } else {
      // Mostrar mensaje de error si no se pueden obtener los datos del usuario
      await this.mostrarToast('Error: Usuario no autenticado', 'danger');
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
}
