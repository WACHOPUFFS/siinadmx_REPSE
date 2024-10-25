import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessPartnerSettingsPage } from './business-partner-settings.page';

const routes: Routes = [
  {
    path: '',
    component: BusinessPartnerSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessPartnerSettingsPageRoutingModule {}
