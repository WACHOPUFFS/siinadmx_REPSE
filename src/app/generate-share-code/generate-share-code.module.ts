import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerateShareCodePageRoutingModule } from './generate-share-code-routing.module';

import { GenerateShareCodePage } from './generate-share-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerateShareCodePageRoutingModule
  ],
  declarations: [GenerateShareCodePage]
})
export class GenerateShareCodePageModule {}
