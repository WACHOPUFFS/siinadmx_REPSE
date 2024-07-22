import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarRolModalPage } from './cambiar-rol-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarRolModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarRolModalPageRoutingModule {}
