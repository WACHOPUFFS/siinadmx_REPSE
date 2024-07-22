import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Importa el servicio AuthService

@Component({
  selector: 'app-received',
  templateUrl: './received.page.html',
  styleUrls: ['./received.page.scss'],
})
export class ReceivedPage implements OnInit {
  receivedFiles: any[] = []; // Array para almacenar los archivos recibidos

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Lógica para obtener los archivos recibidos
    this.getReceivedFiles();
  }

  getReceivedFiles() {
    // Obtener la empresa del usuario autenticado
    // const userEmpresa = this.authService.empresa;

    // Llamada HTTP para obtener los archivos recibidos desde el servidor
    this.http.get<any[]>('https://siinad.mx/php/received_files.php?empresa=' ).subscribe(
      (files: any[]) => {
        // Imprime los archivos recibidos en la consola del navegador
        console.log('Archivos recibidos:', files);

        // Iterar sobre los archivos recibidos para ajustar la ubicación del archivo
        this.receivedFiles = files.map(file => {
          return {
            nombre_archivos: file.nombre_archivos,
            ubicacion_archivos: file.ubicacion_archivos
          };
        });
      },
      error => {
        console.error('Error al obtener los archivos recibidos:', error);
      }
    );
  }
}
