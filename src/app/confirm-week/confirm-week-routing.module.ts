import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmWeekPage } from './confirm-week.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmWeekPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmWeekPageRoutingModule {}
