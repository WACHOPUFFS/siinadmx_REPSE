import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PremiumAuthPage } from './premium-auth.page';

const routes: Routes = [
  {
    path: '',
    component: PremiumAuthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PremiumAuthPageRoutingModule {}
