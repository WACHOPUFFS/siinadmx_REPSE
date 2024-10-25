import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartmentManagementPage } from './department-management.page';

const routes: Routes = [
  {
    path: '',
    component: DepartmentManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentManagementPageRoutingModule {}
