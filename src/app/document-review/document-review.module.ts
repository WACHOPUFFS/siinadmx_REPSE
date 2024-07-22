import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentReviewPageRoutingModule } from './document-review-routing.module';

import { DocumentReviewPage } from './document-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentReviewPageRoutingModule
  ],
  declarations: [DocumentReviewPage]
})
export class DocumentReviewPageModule {}
