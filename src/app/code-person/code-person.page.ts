import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular'; // Importa ToastController
import { AuthService } from '../auth.service'; // Importa tu servicio de autenticación
import { DataStorageService } from '../data-storage-service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-code-person',
  templateUrl: './code-person.page.html',
  styleUrls: ['./code-person.page.scss'],
})
export class CodePersonPage {
  codigoUsuario: string; // Variable para almacenar el código del usuario
  labelCodigoDeUsuario: string;
  labelTitleCodePerson: string;



  constructor(private http: HttpClient,
    private toastController: ToastController,
    private authService: AuthService, private dataStorageService: DataStorageService,     private navCtrl: NavController) {
      this.labelTitleCodePerson = dataStorageService.buttonMiCodigoSocioComercial;
    this.labelCodigoDeUsuario = dataStorageService.labelCodigoDeUsuario;

  }

  ngOnInit() {
    // Cargar los usuarios al inicializar el componente
    this.loadCode();
  }

  loadCode() {
    // Obtener el ID de usuario desde el servicio de autenticación
    const idUsuario = this.authService.userId;

    // Preparar los datos para enviar al servidor
    const data = {
      idUsuario: idUsuario
    };

    this.http.post('https://siinad.mx/php/loadCode.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          // Si la solicitud fue exitosa, asigna el código del usuario obtenido
          this.codigoUsuario = response.codigoUsuario;
          await this.mostrarToast(response.message, 'success');
        } else {
          // Error en la solicitud, mostrar un mensaje de error al usuario
          await this.mostrarToast(response.message, 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error en la solicitud de registro.', 'danger');
      }
    );
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
