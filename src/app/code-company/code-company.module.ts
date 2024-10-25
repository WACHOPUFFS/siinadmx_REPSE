import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodeCompanyPageRoutingModule } from './code-company-routing.module';

import { CodeCompanyPage } from './code-company.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodeCompanyPageRoutingModule
  ],
  declarations: [CodeCompanyPage]
})
export class CodeCompanyPageModule {}
