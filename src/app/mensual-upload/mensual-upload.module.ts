import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensualUploadPageRoutingModule } from './mensual-upload-routing.module';

import { MensualUploadPage } from './mensual-upload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MensualUploadPageRoutingModule
  ],
  declarations: [MensualUploadPage]
})
export class MensualUploadPageModule {}
