import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-processed-lists-modal',
  templateUrl: './processed-lists-modal.component.html',
  styleUrls: ['./processed-lists-modal.component.scss'],
})
export class ProcessedListsModalComponent implements OnInit {
  processedFiles: any[] = []; // Lista de archivos procesados

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadProcessedFiles();
  }

  // Cargar los archivos procesados
  async loadProcessedFiles() {
    const companyId = this.authService.selectedId;
    const url = `https://siinad.mx/php/get_processed_files.php?company_id=${companyId}`;
    
    this.http.get(url).subscribe((data: any) => {
      this.processedFiles = data; // Guardar los archivos procesados en la lista
    });
  }

  // Cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }
}
