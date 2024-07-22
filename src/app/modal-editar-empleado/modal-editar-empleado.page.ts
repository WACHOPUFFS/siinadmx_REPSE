import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-modal-editar-empleado',
  templateUrl: './modal-editar-empleado.page.html',
  styleUrls: ['./modal-editar-empleado.page.scss'],
})
export class ModalEditarEmpleadoPage  {
  @Input() empleado: any;

  constructor(private modalController: ModalController) {}

  cerrarModal() {
    this.modalController.dismiss();
  }
}
