import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusinessPartnerRegisterPageRoutingModule } from './business-partner-register-routing.module';

import { BusinessPartnerRegisterPage } from './business-partner-register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusinessPartnerRegisterPageRoutingModule
  ],
  declarations: [BusinessPartnerRegisterPage]
})
export class BusinessPartnerRegisterPageModule {}
