import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-acta-constitutiva-modal',
  templateUrl: './acta-constitutiva-modal.component.html',
})
export class ActaConstitutivaModalComponent {
  @Input() tarea: any;
  @Input() userId: string;
  @Input() companyId: string;


  actaConstitutiva: any = {
    domicilioSocial: '',
    nombreRepresentante: '',
    numeroEscritura: '',
    folioMercantil: '',
    fechaConstitucion: '',
    nombreNotario: '',
    nombreNotaria: '',
    lugarFacultad: '',
    seguroSocial: ''
  };

  constructor(private http: HttpClient, private modalController: ModalController) {}

  ngOnInit() {
    this.cargarInformacion();
  }

  cargarInformacion() {
    this.http.get<any[]>(`https://siinad.mx/php/getActasConstitutivas.php?companyId=${this.companyId}`)
      .subscribe(response => {
        if (response && response.length > 0) {
          this.actaConstitutiva = response[0];  // Asigna el primer resultado a la variable actaConstitutiva
        }
      }, error => {
        console.error('Error al obtener la información del acta constitutiva:', error);
      });
  }



  dismiss() {
    this.modalController.dismiss();
  }

  onSubmit(form: { value: any }) {
    const formData = {
      ...form.value,
      userId: this.userId,
      companyId: this.companyId,
      tareaId: this.tarea.id
    };

    this.http.post('https://siinad.mx/php/saveActaConstitutiva.php', formData)
      .subscribe(response => {
        console.log('Respuesta del servidor:', response);
        this.modalController.dismiss(formData);
      }, error => {
        console.error('Error al enviar los datos del formulario:', error);
      });
  }
}
