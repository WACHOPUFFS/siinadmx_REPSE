import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-establecimientos-modal',
  templateUrl: './establecimientos-modal.component.html',
  styleUrls: ['./establecimientos-modal.component.scss'],
})
export class EstablecimientosModalComponent implements OnInit {
  @Input() tarea: any;
  @Input() userId: string;
  @Input() companyId: string;

  addresses: any[] = [{
    street: '', interiorNumber: '', exteriorNumber: '', neighborhood: '', state: '', city: '', postalCode: ''
  }];
  isSubmitting: boolean = false;

  constructor(private http: HttpClient, private modalController: ModalController) { }

  ngOnInit() {
    this.cargarInformacion();
  }

  cargarInformacion() {
    this.http.get<any[]>(`https://siinad.mx/php/getAfil01.php?companyId=${this.companyId}`)
      .subscribe(response => {
        if (response && response.length > 0) {
          this.addresses = response;
        }
      }, error => {
        console.error('Error al obtener la información:', error);
      });
  }

  addAddress() {
    this.addresses.push({
      street: '', interiorNumber: '', exteriorNumber: '', neighborhood: '', state: '', city: '', postalCode: ''
    });
  }

  removeAddress(index: number) {
    if (this.addresses.length > 1) {
      this.addresses.splice(index, 1);
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
      addresses: this.addresses,
      userId: this.userId,
      companyId: this.companyId,
      tareaId: this.tarea.id
    };

    this.http.post('https://siinad.mx/php/saveAfil01.php', formData)
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
