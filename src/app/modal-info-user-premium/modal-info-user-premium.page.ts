import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-info-user-premium',
  templateUrl: './modal-info-user-premium.page.html',
  styleUrls: ['./modal-info-user-premium.page.scss'],
})
export class ModalInfoUserPremiumPage {

  constructor(private modalController: ModalController) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  suscribirse() {
    // Aquí puedes agregar la lógica para el proceso de suscripción
    console.log("Se ha suscrito al servicio financiero premium.");
    this.modalController.dismiss();
  }

}
