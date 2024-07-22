import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service'; // Importa el servicio AuthService

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {

  username: string;
  password: string;
  emailForPasswordRecovery: string; // Agrega una nueva propiedad para almacenar el correo electrónico para recuperación de contraseña

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private authService: AuthService // Inyecta el servicio AuthService
  ) {
    
   }

  ngOnInit() {
  }

  async recoverPassword() {
    if (!this.emailForPasswordRecovery) {
      this.presentToast('Por favor, ingresa tu correo electrónico', 'warning');
      return;
    }

    const data = new FormData();
    data.append('email', this.emailForPasswordRecovery);

    this.http.post('https://siinad.mx/php/recover_password.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          this.presentToast('Se ha enviado un correo electrónico con instrucciones para recuperar tu contraseña', 'success');
        } else {
          this.presentToast(response.message, 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud:', error);
        let errorMessage = 'Error en la solicitud';
        if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.presentToast(errorMessage, 'danger');
      }
    );
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color
    });
    toast.present();
  }

}
