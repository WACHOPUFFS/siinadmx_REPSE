import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessPartnerRegisterPage } from './business-partner-register.page';

const routes: Routes = [
  {
    path: '',
    component: BusinessPartnerRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessPartnerRegisterPageRoutingModule {}
