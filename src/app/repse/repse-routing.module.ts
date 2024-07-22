import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepsePage } from './repse.page';

const routes: Routes = [
  {
    path: '',
    component: RepsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepsePageRoutingModule {}
