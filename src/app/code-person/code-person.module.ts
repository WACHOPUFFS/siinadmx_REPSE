import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodePersonPageRoutingModule } from './code-person-routing.module';

import { CodePersonPage } from './code-person.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodePersonPageRoutingModule
  ],
  declarations: [CodePersonPage]
})
export class CodePersonPageModule {}
