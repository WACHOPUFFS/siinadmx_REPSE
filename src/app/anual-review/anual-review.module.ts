import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnualReviewPageRoutingModule } from './anual-review-routing.module';

import { AnualReviewPage } from './anual-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnualReviewPageRoutingModule
  ],
  declarations: [AnualReviewPage]
})
export class AnualReviewPageModule {}
