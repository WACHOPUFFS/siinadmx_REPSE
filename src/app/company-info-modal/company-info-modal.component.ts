import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service'; // Importa el servicio AuthService
import { ToastController, ModalController } from '@ionic/angular'; // Importa ModalController y ToastController
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-company-info-modal',
  templateUrl: './company-info-modal.component.html',
  styleUrls: ['./company-info-modal.component.scss'],
})
export class CompanyInfoModalComponent{
  @Input() companyData: any; // Recibe la información de la empresa y el representante principal
  selectedRole: string = ''; // Variable para almacenar el rol seleccionado

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  dismiss() {
    this.modalController.dismiss();
  }

  async addSocioComercialAssociation() {
    // Verificar si existe companyData
    if (this.companyData) {
      const data = {
        userId: this.authService.userId,
        empresa: this.authService.selectedId, // ID de la empresa actual
        empresaSocio: this.companyData.company_id, // ID de la empresa asociada
        role: this.selectedRole // Rol seleccionado para la asociación
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
      await this.mostrarToast('No se encontraron datos de la empresa.', 'danger');
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