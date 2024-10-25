import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmDayPage } from './confirm-day.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmDayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmDayPageRoutingModule {}
