import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CpAuthModalDeletePage } from './cp-auth-modal-delete.page';

const routes: Routes = [
  {
    path: '',
    component: CpAuthModalDeletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CpAuthModalDeletePageRoutingModule {}
