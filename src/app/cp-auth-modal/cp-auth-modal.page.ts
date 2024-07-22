import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataStorageService } from '../data-storage-service';


@Component({
  selector: 'app-cp-auth-modal',
  templateUrl: './cp-auth-modal.page.html',
  styleUrls: ['./cp-auth-modal.page.scss'],
})
export class CpAuthModalPage  {


  @Input() continuarConfirmarSocio: boolean;
  labelContinuarConfirmarSocio: string;
  labelSi: string;
  labelNoHome: string;

  constructor(private modalController: ModalController, private dataStorageService: DataStorageService) { 
    this.labelContinuarConfirmarSocio = dataStorageService.labelContinuarConfirmarSocio;
    this.labelSi = dataStorageService.labelSi;
    this.labelNoHome = dataStorageService.labelNoHome;
  }

  cerrarModal(continuar: boolean) {
    this.modalController.dismiss({ continuarRegistro: continuar });
  }
}
