import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeriodConfigurationPageRoutingModule } from './period-configuration-routing.module';

import { PeriodConfigurationPage } from './period-configuration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeriodConfigurationPageRoutingModule
  ],
  declarations: [PeriodConfigurationPage]
})
export class PeriodConfigurationPageModule {}
