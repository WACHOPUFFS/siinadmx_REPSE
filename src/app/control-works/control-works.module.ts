import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlWorksPageRoutingModule } from './control-works-routing.module';

import { ControlWorksPage } from './control-works.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlWorksPageRoutingModule
  ],
  declarations: [ControlWorksPage]
})
export class ControlWorksPageModule {}
