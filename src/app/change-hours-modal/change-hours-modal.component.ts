// change-hours-modal.component.ts
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment'; // Importar moment.js para manejar fechas y tiempos

@Component({
  selector: 'app-change-hours-modal',
  templateUrl: './change-hours-modal.component.html',
  styleUrls: ['./change-hours-modal.component.scss'],
})
export class ChangeHoursModalComponent {
  @Input() employees: any[] = []; // Array de empleados seleccionados

  entryTime: string;
  lunchStart: string;
  lunchEnd: string;
  exitTime: string;

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  saveHours() {
    // Formatear los tiempos a 'HH:mm:ss'
    const formattedEntryTime = moment(this.entryTime).format('HH:mm:ss');
    const formattedLunchStart = moment(this.lunchStart).format('HH:mm:ss');
    const formattedLunchEnd = moment(this.lunchEnd).format('HH:mm:ss');
    const formattedExitTime = moment(this.exitTime).format('HH:mm:ss');
  
    // Envía los datos al componente que abre el modal junto con la lista de empleados
    this.modalController.dismiss({
      employees: this.employees, // Devolver todos los empleados seleccionados
      entryTime: formattedEntryTime,
      lunchStart: formattedLunchStart,
      lunchEnd: formattedLunchEnd,
      exitTime: formattedExitTime,
    });
  }
}
