import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsBusineesPartnerPage } from './permissions-businees-partner.page';

const routes: Routes = [
  {
    path: '',
    component: PermissionsBusineesPartnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionsBusineesPartnerPageRoutingModule {}
