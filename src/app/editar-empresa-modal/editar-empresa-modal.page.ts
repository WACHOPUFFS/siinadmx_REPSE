import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-editar-empresa-modal',
  templateUrl: './editar-empresa-modal.page.html',
  styleUrls: ['./editar-empresa-modal.page.scss'],
})
export class EditarEmpresaModalPage {
  @Input() company: any;

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  async guardarCambios() {
    this.http.post('https://siinad.mx/php/update-company.php', this.company).subscribe(
      async (response: any) => {
        if (response.message) {
          const toast = await this.toastController.create({
            message: response.message,
            duration: 3000,
            color: 'success'
          });
          toast.present();
          this.modalController.dismiss({ updatedCompany: this.company });
        } else {
          const toast = await this.toastController.create({
            message: response.error,
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: 'Error al actualizar los datos',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    );
  }
}


