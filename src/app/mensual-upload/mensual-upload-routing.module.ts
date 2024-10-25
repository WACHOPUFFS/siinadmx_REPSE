import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MensualUploadPage } from './mensual-upload.page';

const routes: Routes = [
  {
    path: '',
    component: MensualUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MensualUploadPageRoutingModule {}
