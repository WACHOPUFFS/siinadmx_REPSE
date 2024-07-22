import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEditarEmpleadoPageRoutingModule } from './modal-editar-empleado-routing.module';

import { ModalEditarEmpleadoPage } from './modal-editar-empleado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalEditarEmpleadoPageRoutingModule
  ],
  declarations: [ModalEditarEmpleadoPage]
})
export class ModalEditarEmpleadoPageModule {}
