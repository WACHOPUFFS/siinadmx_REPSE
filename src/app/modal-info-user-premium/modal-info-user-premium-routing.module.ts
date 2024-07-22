import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalInfoUserPremiumPage } from './modal-info-user-premium.page';

const routes: Routes = [
  {
    path: '',
    component: ModalInfoUserPremiumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalInfoUserPremiumPageRoutingModule {}
