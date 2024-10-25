import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusinessPartnerSettingsPageRoutingModule } from './business-partner-settings-routing.module';

import { BusinessPartnerSettingsPage } from './business-partner-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusinessPartnerSettingsPageRoutingModule
  ],
  declarations: [BusinessPartnerSettingsPage]
})
export class BusinessPartnerSettingsPageModule {}
