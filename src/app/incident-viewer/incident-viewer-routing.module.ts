import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentViewerPage } from './incident-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentViewerPageRoutingModule {}
