import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http'; 
import { UserInfoModalComponentPage } from '../user-info-modal-component/user-info-modal-component.page';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.page.html',
  styleUrls: ['./add-person.page.scss'],
})
export class AddPersonPage implements OnInit {
  codigoSocioComercial: string;

  constructor(
    private toastController: ToastController,
    private modalController: ModalController,
    private http: HttpClient,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  async openUserInfoModal() {
    // Construir la URL con los datos de consulta
    const url = `https://siinad.mx/php/load_association.php?codigoSocioComercial=${this.codigoSocioComercial}`;

    // Realizar la solicitud HTTP GET
    this.http.get(url)
      .subscribe(async (response: any) => {
        const modal = await this.modalController.create({
          component: UserInfoModalComponentPage,
          componentProps: {
            userData: response,
          },
        });
        await modal.present();
      }, async (error) => {
        console.error('Error al cargar la asociación:', error);
        await this.mostrarToast('Error al cargar la asociación', 'danger');
      });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
