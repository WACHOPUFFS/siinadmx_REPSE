import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cp-auth-modal-delete',
  templateUrl: './cp-auth-modal-delete.page.html',
  styleUrls: ['./cp-auth-modal-delete.page.scss'],
})
export class CpAuthModalDeletePage {

  @Input() mostrarMotivoRechazo: boolean;
  @Input() confirmarRechazoSocio: Function; // Definir la entrada para la función confirmarRechazoSocio
  @Output() motivoRechazoConfirmado = new EventEmitter<string>();

  motivo: string = '';

  constructor(private modalController: ModalController) { }

  confirmarRechazo() {
    console.log('Se confirmó el rechazo con motivo:', this.motivo);
    this.motivoRechazoConfirmado.emit(this.motivo);
    // Llamar a la función confirmarRechazoSocio con el motivo recibido
    this.confirmarRechazoSocio(this.motivo);
    this.cerrarModal();
  }

  cancelar() {
    console.log('Se canceló el rechazo');
    this.cerrarModal();
  }

  async cerrarModal() {
    console.log('Cerrando modal');
    await this.modalController.dismiss();
  }
}
