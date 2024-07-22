import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentReviewPage } from './document-review.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentReviewPageRoutingModule {}
