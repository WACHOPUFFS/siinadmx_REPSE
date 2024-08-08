import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlWorksPage } from './control-works.page';

const routes: Routes = [
  {
    path: '',
    component: ControlWorksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlWorksPageRoutingModule {}
