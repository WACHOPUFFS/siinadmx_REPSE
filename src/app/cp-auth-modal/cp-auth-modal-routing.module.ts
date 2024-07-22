import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CpAuthModalPage } from './cp-auth-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CpAuthModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CpAuthModalPageRoutingModule {}
