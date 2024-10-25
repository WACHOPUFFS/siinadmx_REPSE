import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodeCompanyPage } from './code-company.page';

const routes: Routes = [
  {
    path: '',
    component: CodeCompanyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodeCompanyPageRoutingModule {}
