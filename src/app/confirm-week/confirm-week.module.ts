import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmWeekPageRoutingModule } from './confirm-week-routing.module';

import { ConfirmWeekPage } from './confirm-week.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmWeekPageRoutingModule
  ],
  declarations: [ConfirmWeekPage]
})
export class ConfirmWeekPageModule {}
