// incident-modal.component.ts
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-incident-modal',
  templateUrl: './incident-modal.component.html',
})
export class IncidentModalComponent {
  @Input() incidentOptions: string[] = [];
  @Input() employees: any[] = []; // Cambiado a array para manejar múltiples empleados
  selectedIncident: string = '';
  description: string = '';

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  saveIncident() {
    // Devuelve los datos de la incidencia y la lista de empleados al cerrar el modal
    this.modalController.dismiss({
      employees: this.employees, // Devolver todos los empleados seleccionados
      incident: this.selectedIncident,
      description: this.description,
    });
  }
}
