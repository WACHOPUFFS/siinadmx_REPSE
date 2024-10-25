import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnualUploadPageRoutingModule } from './anual-upload-routing.module';

import { AnualUploadPage } from './anual-upload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnualUploadPageRoutingModule
  ],
  declarations: [AnualUploadPage]
})
export class AnualUploadPageModule {}
