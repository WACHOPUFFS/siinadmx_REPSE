import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadFilesPage } from './upload-files.page';

const routes: Routes = [
  {
    path: '',
    component: UploadFilesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadFilesPageRoutingModule {}
