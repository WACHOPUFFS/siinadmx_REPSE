import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyRequestPageRoutingModule } from './company-request-routing.module';

import { CompanyRequestPage } from './company-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyRequestPageRoutingModule
  ],
  declarations: [CompanyRequestPage]
})
export class CompanyRequestPageModule {}
