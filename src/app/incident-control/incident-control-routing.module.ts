import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentControlPage } from './incident-control.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentControlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentControlPageRoutingModule {}
