import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageWeeksPage } from './manage-weeks.page';

const routes: Routes = [
  {
    path: '',
    component: ManageWeeksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageWeeksPageRoutingModule {}
