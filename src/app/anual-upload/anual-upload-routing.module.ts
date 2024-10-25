import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnualUploadPage } from './anual-upload.page';

const routes: Routes = [
  {
    path: '',
    component: AnualUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnualUploadPageRoutingModule {}
