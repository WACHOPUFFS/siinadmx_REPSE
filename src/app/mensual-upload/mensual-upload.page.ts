import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { ModalController } from '@ionic/angular';

interface Tarea {
  id: number;
  nombre: string;
  enero: boolean;
  febrero: boolean;
  marzo: boolean;
  abril: boolean;
  mayo: boolean;
  junio: boolean;
  julio: boolean;
  agosto: boolean;
  septiembre: boolean;
  octubre: boolean;
  noviembre: boolean;
  diciembre: boolean;
  estado: string;
  file_path?: string;
  [key: string]: any;  // Índice de cadena para permitir el acceso dinámico a las propiedades
}

@Component({
  selector: 'app-mensual-upload',
  templateUrl: './mensual-upload.page.html',
  styleUrls: ['./mensual-upload.page.scss'],
})
export class MensualUploadPage implements OnInit {
  meses: string[] = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  tareas: Tarea[] = [
    { id: 1, nombre: 'Ause ISCOE', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 2, nombre: 'Ause SISUB', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 3, nombre: 'Archivo SULA', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 4, nombre: 'CFDI nómina (xml y PDF)', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 5, nombre: 'Declaración y Acuse De ISR', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 6, nombre: 'Declaración y Acuse De IVA', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 7, nombre: 'Lista Del Personal', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 8, nombre: 'Opinión Cumplimiento SAT', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 9, nombre: 'Opinión cumplimiento IMSS', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 10, nombre: 'Opinión de cumplimiento INFONAVIT', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 11, nombre: 'Pago Bancario De ISR', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 12, nombre: 'Pago Bancario De IVA', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 13, nombre: 'Pago Bancario IMSS', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 14, nombre: 'Reporte ISCOE', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
    { id: 15, nombre: 'Reporte SISUB', enero: false, febrero: false, marzo: false, abril: false, mayo: false, junio: false, julio: false, agosto: false, septiembre: false, octubre: false, noviembre: false, diciembre: false, estado: 'No cargado' },
  ];

  cargados: number = 0;
  completos: number = 0;
  incompletos: number = 0;
  noCargados: number = this.tareas.length;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.obtenerEstadoArchivos();
  }

  async openModal(tarea: Tarea) {
    // Implementación de la lógica para abrir modales según la tarea
  }

  triggerFileInput(id: number) {
    const fileInput = document.getElementById(`fileInput${id}`) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.click();
    } else {
      console.error(`Element with id fileInput${id} not found`);
    }
  }

  onFileSelected(event: Event, tarea: Tarea) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      console.log(`Archivo seleccionado para ${tarea.nombre}:`, file.name);
      this.uploadFile(tarea, file);
    }
  }

  uploadFile(tarea: Tarea, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.authService.userId);
    formData.append('companyId', this.authService.selectedId);
    formData.append('tareaId', tarea.id.toString());

    this.http.post('https://siinad.mx/php/documentUpload.php', formData)
      .subscribe(response => {
        console.log('Respuesta del servidor:', response);
        tarea.estado = 'cargado';
        this.updateCounters();
        this.obtenerEstadoArchivos();
      }, error => {
        console.error('Error al subir el archivo:', error);
      });
  }

  updateCounters() {
    this.cargados = this.tareas.filter(t => t.estado === 'cargado').length;
    this.completos = this.tareas.filter(t => t.estado === 'aceptado').length;
    this.incompletos = this.tareas.filter(t => t.estado === 'rechazado').length;
    this.noCargados = this.tareas.length - this.cargados - this.completos - this.incompletos;
  }

  descargarArchivo(tarea: Tarea) {
    if (tarea.file_path) {
      window.open(`https://siinad.mx/php/${tarea.file_path}`, '_blank');
    } else {
      console.error('No file path found for download.');
    }
  }

  obtenerEstadoArchivos() {
    const companyId = this.authService.selectedId;

    if (!companyId) {
      console.error('Company ID is missing.');
      return;
    }

    this.http.get<any[]>(`https://siinad.mx/php/getDocumentStatus.php?companyId=${companyId}`)
      .subscribe(response => {
        console.log('Document status response:', response);
        if (Array.isArray(response)) {
          response.forEach((doc) => {
            const tarea = this.tareas.find(t => t.id === parseInt(doc.tarea_id, 10));
            if (tarea) {
              tarea.estado = doc.estado ?? 'No cargado';
              tarea.file_path = doc.file_path;
              // Asignar valores a los meses basados en la respuesta
              // Aquí necesitarás asignar los valores correctos para cada mes según la respuesta
              this.meses.forEach(mes => {
                if (doc[mes] !== undefined) {
                  tarea[mes] = doc[mes];
                }
              });
            }
          });
          this.updateCounters();
        } else {
          console.error('Unexpected response format:', response);
        }
      }, error => {
        console.error('Error al obtener el estado de los archivos:', error);
      });
  }
}
