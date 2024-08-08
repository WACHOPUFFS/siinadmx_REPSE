import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageWeeksPageRoutingModule } from './manage-weeks-routing.module';

import { ManageWeeksPage } from './manage-weeks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageWeeksPageRoutingModule
  ],
  declarations: [ManageWeeksPage]
})
export class ManageWeeksPageModule {}
