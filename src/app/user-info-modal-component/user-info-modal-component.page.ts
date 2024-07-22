import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service'; // Importa el servicio AuthService
import { ToastController, ModalController } from '@ionic/angular'; // Importa ModalController y ToastController
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-info-modal-component',
  templateUrl: './user-info-modal-component.page.html',
  styleUrls: ['./user-info-modal-component.page.scss'],
})
export class UserInfoModalComponentPage {
  @Input() userData: any;
  selectedRole: string = ''; // Variable para almacenar el rol seleccionado

  constructor(private http: HttpClient, private authService: AuthService, private modalController: ModalController, private toastController: ToastController) { }

  dismiss() {
    this.modalController.dismiss();
  }



  async addSocioComercialAssociation() {
    // Verificar si hay usuarios en userData
    if (this.userData && this.userData.length > 0) {
      // Seleccionar el primer usuario
      const firstUser = this.userData[0];
      
      const data = {
        empresa: this.authService.selectedId,
        empresaSocio: firstUser.companyId,
        role: this.selectedRole
      };
  
      this.http.post('https://siinad.mx/php/associationCompanies.php', data).subscribe(
        async (response: any) => {
          if (response.success) {
            await this.mostrarToast(response.message, 'success');
          } else {
            await this.mostrarToast(response.message, 'danger');
          }
        },
        async (error: any) => {
          await this.mostrarToast('Ocurrió un error al realizar la solicitud.', 'danger');
        }
      );
    } else {
      await this.mostrarToast('No se encontraron usuarios.', 'danger');
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
