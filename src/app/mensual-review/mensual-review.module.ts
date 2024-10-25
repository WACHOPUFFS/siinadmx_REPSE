import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensualReviewPageRoutingModule } from './mensual-review-routing.module';

import { MensualReviewPage } from './mensual-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MensualReviewPageRoutingModule
  ],
  declarations: [MensualReviewPage]
})
export class MensualReviewPageModule {}
