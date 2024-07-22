import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Importa el servicio AuthService

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.page.html',
  styleUrls: ['./upload-files.page.scss'],
})
export class UploadFilesPage implements OnInit {
  tableHeaders: string[] = [];
  tableData: string[][] = [];
  empresas: string[] = [];
  empresaDestino: string; // Cambio de nombre de la variable

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Verifica si el usuario ha iniciado sesión al cargar la página
    if (!this.authService.isLoggedIn) {
      // Si el usuario no ha iniciado sesión, redirige a la página de inicio de sesión
      this.router.navigate(['/login']);
    } else {
      // Si el usuario ha iniciado sesión, carga las empresas
      // this.selectedEmpresa();
    }
  }

 //sa selectedEmpresa() {
 //Obtener la empresa del usuario del servicio AuthService
 //st userEmpresa = this.authService.empresa;

 //Si userEmpresa es un array, asigna la primera empresa por defecto
 //(Array.isArray(userEmpresa)) {
 //his.empresaDestino = userEmpresa[0];
 //lse {
 //his.empresaDestino = userEmpresa;
 //

 //s.http.get<any[]>('https://ctrlobra.sinsetec.com.mx/php/empresas.php').subscribe(
 //empresas: any[]) => {
 // this.empresas = empresas.map(empresa => empresa.nombreEmpresa);
 //,
 //rror => {
 // console.error('Error al cargar las empresas:', error);
 //
 //   );
 // }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.error('No se seleccionó ningún archivo.');
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const contents = reader.result as string;
      const rows = contents.split('\n');
      this.tableHeaders = rows[0].split(',');

      this.tableData = [];
      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',');
        this.tableData.push(columns);
      }
    };
    reader.readAsText(file);
  }

  onUploadFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      console.error('No se seleccionó ningún archivo.');
      return;
    }

    // Obtener el nombre de usuario del servicio AuthService
    const username = this.authService.username;

    // Obtener la empresa destino seleccionada en el formulario
    const empresaDestino = this.empresaDestino;

    const formData = new FormData();
    formData.append('file', file); // Agrega el archivo al objeto FormData
    formData.append('sender', username); // Agrega el nombre de usuario como remitente
    formData.append('recipient', empresaDestino); // Agrega la empresa destino

    // Envía los datos al servidor PHP
    this.http.post('https://ctrlobra.sinsetec.com.mx/php/upload.php', formData)
      .subscribe(
        (response) => {
          console.log('Archivo cargado exitosamente en el servidor:', response);
          // Puedes mostrar un mensaje de éxito o realizar otras acciones aquí
          // Por ejemplo, podrías actualizar la lista de empresas después de cargar el archivo
          // this.selectedEmpresa();
        },
        (error) => {
          console.error('Error al cargar el archivo en el servidor:', error);
          // Manejar el error según sea necesario
        }
      );
  }
}
