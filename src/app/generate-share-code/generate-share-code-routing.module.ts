import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerateShareCodePage } from './generate-share-code.page';

const routes: Routes = [
  {
    path: '',
    component: GenerateShareCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateShareCodePageRoutingModule {}
