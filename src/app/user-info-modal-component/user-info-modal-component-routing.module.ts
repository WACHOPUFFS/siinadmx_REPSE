import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserInfoModalComponentPage } from './user-info-modal-component.page';

const routes: Routes = [
  {
    path: '',
    component: UserInfoModalComponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserInfoModalComponentPageRoutingModule {}
