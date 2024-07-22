import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarEmpresaModalPageRoutingModule } from './editar-empresa-modal-routing.module';

import { EditarEmpresaModalPage } from './editar-empresa-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarEmpresaModalPageRoutingModule
  ],
  declarations: [EditarEmpresaModalPage]
})
export class EditarEmpresaModalPageModule {}
