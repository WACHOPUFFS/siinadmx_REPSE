import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeriodManagementPage } from './period-management.page';

const routes: Routes = [
  {
    path: '',
    component: PeriodManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeriodManagementPageRoutingModule {}
