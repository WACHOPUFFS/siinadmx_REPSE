import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { ModalController } from '@ionic/angular';
import { RechazoModalComponent } from '../rechazo-modal/rechazo-modal.component';
import { ReviewInfoModalComponent } from '../review-info-modal/review-info-modal.component';

interface Tarea {
  id: number;
  nombre: string;
  status: boolean;
  archivo?: File;
  cargado?: boolean;
  estado?: string;
}

interface Archivo {
  id: number;
  tarea_id: number;
  file_path: string;
  upload_date: string;
  user_id: number;
  uploaded_by: string;
  tarea_nombre?: string;  // Campo adicional para el nombre de la tarea
  estado?: string;  // Estado del archivo (aceptado/rechazado/pendiente)
  comentario?: string;  // Comentario en caso de rechazo
}
@Component({
  selector: 'app-mensual-review',
  templateUrl: './mensual-review.page.html',
  styleUrls: ['./mensual-review.page.scss'],
})
export class MensualReviewPage implements OnInit {

  archivos: Archivo[] = [];
  archivosCargados: Archivo[] = [];
  archivosAceptados: Archivo[] = [];
  archivosRechazados: Archivo[] = [];
  tareas: Tarea[] = [
    { id: 1, nombre: 'Acta Constitutiva', status: false },
    { id: 2, nombre: 'RFC', status: false },
    { id: 3, nombre: 'AFIL01', status: false },
    { id: 4, nombre: 'Autorización vigente STPS', status: false },
    { id: 5, nombre: 'Establecimientos', status: false },
    { id: 6, nombre: 'Contrato', status: false },
  ];
  selectedCompanyId: number | null = null;

  cargados: number = 0;
  completos: number = 0;
  incompletos: number = 0;
  noCargados: number = this.tareas.length;
  filter: string = 'cargados';

  constructor(private http: HttpClient, public authService: AuthService, private modalController: ModalController) {}

  ngOnInit() {
    this.selectedCompanyId = Number(this.authService.selectedId);
    if (this.selectedCompanyId) {
      this.obtenerArchivos(this.selectedCompanyId);
    }
  }

  obtenerArchivos(idCompany: number) {
    this.http.get<Archivo[]>(`https://siinad.mx/php/getDocumentStatus.php?companyId=${idCompany}`)
      .subscribe(response => {
        console.log('Document status response:', response); // Verificar la respuesta

        // Imprimir tareas para verificar coincidencias
        console.log('Lista de tareas:', this.tareas);

        this.archivos = response.map(archivo => {
          const tarea = this.tareas.find(t => t.id === parseInt(archivo.tarea_id as any, 10));
          console.log(`Archivo: ${archivo.file_path}, tarea_id: ${archivo.tarea_id}, Matching tarea:`, tarea); // Verificar tarea coincidente
          if (tarea) {
            archivo.tarea_nombre = tarea.nombre;
            tarea.status = true; // Asume que si el archivo está en la base de datos, está cargado
            tarea.estado = archivo.estado;  // Asignar el estado del archivo a la tarea
          }
          return archivo;
        });

        this.categorizarArchivos();
        this.updateCounters();
        console.log('Processed archivos:', this.archivos); // Verificar los archivos procesados
      }, error => {
        console.error('Error al obtener los archivos:', error);
      });
  }

  categorizarArchivos() {
    this.archivosCargados = this.archivos.filter(a => a.estado === 'cargado');
    this.archivosAceptados = this.archivos.filter(a => a.estado === 'aceptado');
    this.archivosRechazados = this.archivos.filter(a => a.estado === 'rechazado');
  }

  updateCounters() {
    this.cargados = this.archivosCargados.length;
    this.completos = this.archivosAceptados.length;
    this.incompletos = this.archivosRechazados.length;
    this.noCargados = this.tareas.length - this.cargados - this.completos - this.incompletos;
  }

  setFilter(filter: string) {
    this.filter = filter;
  }

  async aceptarArchivo(archivo: Archivo) {
    archivo.estado = 'aceptado';
    if (this.selectedCompanyId !== null) {
      this.http.post('https://siinad.mx/php/updateArchivoStatus.php', { id: archivo.id, estado: archivo.estado })
        .subscribe(response => {
          console.log('Archivo aceptado:', response);
          this.obtenerArchivos(this.selectedCompanyId!);
        }, error => {
          console.error('Error al aceptar el archivo:', error);
        });
    }
  }

  async rechazarArchivo(archivo: Archivo) {
    const modal = await this.modalController.create({
      component: RechazoModalComponent,
      componentProps: { archivo }
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        archivo.estado = 'rechazado';
        archivo.comentario = result.data.comentario;
        if (this.selectedCompanyId !== null) {
          this.http.post('https://siinad.mx/php/updateArchivoStatus.php', {
            id: archivo.id,
            estado: archivo.estado,
            comentario: archivo.comentario
          }).subscribe(response => {
            console.log('Archivo rechazado:', response);
            this.obtenerArchivos(this.selectedCompanyId!);
          }, error => {
            console.error('Error al rechazar el archivo:', error);
          });
        }
      }
    });

    return await modal.present();
  }

  async revisarInformacionAdicional(archivo: Archivo) {
    const tarea = this.tareas.find(t => t.id === archivo.tarea_id);
    if (!tarea) {
      console.error('No se encontró la tarea correspondiente');
      return;
    }

    if (this.selectedCompanyId !== null) {
      const modal = await this.modalController.create({
        component: ReviewInfoModalComponent,
        componentProps: { companyId: this.selectedCompanyId, tareaId: archivo.tarea_id, tareaNombre: tarea.nombre }
      });

      return await modal.present();
    }
  }
}
