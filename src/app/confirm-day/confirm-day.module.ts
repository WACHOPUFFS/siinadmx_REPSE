import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmDayPageRoutingModule } from './confirm-day-routing.module';

import { ConfirmDayPage } from './confirm-day.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmDayPageRoutingModule
  ],
  declarations: [ConfirmDayPage]
})
export class ConfirmDayPageModule {}
