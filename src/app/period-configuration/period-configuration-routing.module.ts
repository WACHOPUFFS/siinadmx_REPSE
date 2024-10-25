import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeriodConfigurationPage } from './period-configuration.page';

const routes: Routes = [
  {
    path: '',
    component: PeriodConfigurationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeriodConfigurationPageRoutingModule {}
