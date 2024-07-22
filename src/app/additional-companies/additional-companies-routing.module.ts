import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdditionalCompaniesPage } from './additional-companies.page';

const routes: Routes = [
  {
    path: '',
    component: AdditionalCompaniesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditionalCompaniesPageRoutingModule {}
