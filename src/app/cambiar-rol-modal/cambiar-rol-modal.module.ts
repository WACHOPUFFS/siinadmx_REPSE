import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarRolModalPageRoutingModule } from './cambiar-rol-modal-routing.module';

import { CambiarRolModalPage } from './cambiar-rol-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarRolModalPageRoutingModule
  ],
  declarations: [CambiarRolModalPage]
})
export class CambiarRolModalPageModule {}
