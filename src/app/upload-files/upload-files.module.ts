import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadFilesPageRoutingModule } from './upload-files-routing.module';

import { UploadFilesPage } from './upload-files.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadFilesPageRoutingModule
  ],
  declarations: [UploadFilesPage]
})
export class UploadFilesPageModule {}
