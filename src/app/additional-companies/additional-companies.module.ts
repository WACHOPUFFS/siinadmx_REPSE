import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdditionalCompaniesPageRoutingModule } from './additional-companies-routing.module';

import { AdditionalCompaniesPage } from './additional-companies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdditionalCompaniesPageRoutingModule
  ],
  declarations: [AdditionalCompaniesPage]
})
export class AdditionalCompaniesPageModule {}
