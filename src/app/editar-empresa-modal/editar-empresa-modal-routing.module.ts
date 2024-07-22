import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarEmpresaModalPage } from './editar-empresa-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EditarEmpresaModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarEmpresaModalPageRoutingModule {}
