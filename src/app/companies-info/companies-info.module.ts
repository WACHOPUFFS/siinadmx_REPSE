import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompaniesInfoPageRoutingModule } from './companies-info-routing.module';

import { CompaniesInfoPage } from './companies-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompaniesInfoPageRoutingModule
  ],
  declarations: [CompaniesInfoPage]
})
export class CompaniesInfoPageModule {}
