import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnualReviewPage } from './anual-review.page';

const routes: Routes = [
  {
    path: '',
    component: AnualReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnualReviewPageRoutingModule {}
