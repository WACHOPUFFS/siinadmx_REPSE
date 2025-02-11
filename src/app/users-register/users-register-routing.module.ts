import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersRegisterPage } from './users-register.page';

const routes: Routes = [
  {
    path: '',
    component: UsersRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRegisterPageRoutingModule {}
