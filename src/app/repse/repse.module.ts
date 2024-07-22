import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepsePageRoutingModule } from './repse-routing.module';

import { RepsePage } from './repse.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepsePageRoutingModule
  ],
  declarations: [RepsePage]
})
export class RepsePageModule {}
