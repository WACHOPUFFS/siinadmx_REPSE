import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeriodManagementPageRoutingModule } from './period-management-routing.module';

import { PeriodManagementPage } from './period-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeriodManagementPageRoutingModule
  ],
  declarations: [PeriodManagementPage]
})
export class PeriodManagementPageModule {}
