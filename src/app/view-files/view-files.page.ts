import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-view-files',
  templateUrl: './view-files.page.html',
  styleUrls: ['./view-files.page.scss'],
})
export class ViewFilesPage implements OnInit {
  csvData: any[] = [];
  csvHeaders: string[] = [];
  selectedFile: File | null = null;
  destinatarios: string[] = [];
  selectedDestinatario: string = '';
  section: string = '';

  constructor(private papa: Papa, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.section = params.get('section') || '';
      this.loadDestinatarios();
      this.handleSectionChange();
    });
  }

  loadDestinatarios() {
    // Aquí debes llamar a tu servicio para obtener los destinatarios desde tu backend.
    // Ejemplo ficticio:
    this.destinatarios = ['Empresa A', 'Empresa B', 'Empresa C'];
  }

  handleSectionChange() {
    // Lógica específica para cada sección
    switch (this.section) {
      case 'ICOSOE':
        // lógica específica para ICOSOE
        break;
      case 'CIR':
        // lógica específica para CIR
        break;
      case 'ParteVariable':
        // lógica específica para Parte Variable
        break;
      case 'DatosEmpresa':
        // lógica específica para Datos Empresa
        break;
      case 'DatosMovimiento':
        // lógica específica para Datos Movimiento
        break;
      case 'DatosSumarios':
        // lógica específica para Datos Sumarios
        break;
      case 'DatosTrabajador':
        // lógica específica para Datos Trabajador
        break;
      default:
        // lógica por defecto si es necesario
        break;
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  processCSV() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.papa.parse(reader.result as string, {
          complete: (result) => {
            this.csvHeaders = result.data[0];
            this.csvData = result.data.slice(1);
          },
        });
      };
      reader.readAsText(this.selectedFile);
    }
  }

  enviarDatos() {
    // Lógica para enviar los datos
  }
}
