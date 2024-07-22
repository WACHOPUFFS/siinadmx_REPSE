import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRolesPage } from './edit-roles.page';

const routes: Routes = [
  {
    path: '',
    component: EditRolesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRolesPageRoutingModule {}
