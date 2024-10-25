import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessWeeklyListsPage } from './process-weekly-lists.page';

const routes: Routes = [
  {
    path: '',
    component: ProcessWeeklyListsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessWeeklyListsPageRoutingModule {}
