import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rfc-modal',
  templateUrl: './rfc-modal.component.html',
  styleUrls: ['./rfc-modal.component.scss'],
})
export class RfcModalComponent implements OnInit {
  @Input() tarea: any;
  @Input() userId: string;
  @Input() companyId: string;

  rfcInformacion: any[] = [{ rfc: '', curp: '', domicilioFiscal: '', tipoRegimen: '', regimen: '' }];
  isSubmitting: boolean = false;

  constructor(private http: HttpClient, private modalController: ModalController) { }

  ngOnInit() {
    this.cargarInformacion();
  }

  cargarInformacion() {
    this.http.get<any[]>(`https://siinad.mx/php/getRfc.php?companyId=${this.companyId}`)
      .subscribe(response => {
        if (response && response.length > 0) {
          this.rfcInformacion = response;
        }
      }, error => {
        console.error('Error al obtener la información de RFC:', error);
      });
  }

  addRfcInfo() {
    this.rfcInformacion.push({ rfc: '', curp: '', domicilioFiscal: '', tipoRegimen: '', regimen: '' });
  }

  removeRfcInfo(index: number) {
    if (this.rfcInformacion.length > 1) {
      this.rfcInformacion.splice(index, 1);
    }
  }

  dismiss() {
    if (!this.isSubmitting) {
      this.modalController.dismiss();
    }
  }

  onSubmit() {
    this.isSubmitting = true;

    const formData = {
      rfcInformacion: this.rfcInformacion,
      userId: this.userId,
      companyId: this.companyId,
      tareaId: this.tarea.id
    };

    console.log('Enviando datos:', JSON.stringify(formData, null, 2)); // Añadir este log para depurar

    this.http.post('https://siinad.mx/php/saveRfc.php', formData)
      .subscribe(response => {
        console.log('Respuesta del servidor:', response);
        this.isSubmitting = false;
        this.modalController.dismiss(formData);
      }, error => {
        console.error('Error al enviar los datos del formulario:', error);
        this.isSubmitting = false;
      });
  }
}
