import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodePersonPage } from './code-person.page';

const routes: Routes = [
  {
    path: '',
    component: CodePersonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodePersonPageRoutingModule {}
