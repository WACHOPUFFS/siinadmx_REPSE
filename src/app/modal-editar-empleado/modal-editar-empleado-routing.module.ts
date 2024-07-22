import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEditarEmpleadoPage } from './modal-editar-empleado.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEditarEmpleadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEditarEmpleadoPageRoutingModule {}
