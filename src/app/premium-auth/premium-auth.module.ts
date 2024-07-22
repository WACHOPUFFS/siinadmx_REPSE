import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PremiumAuthPageRoutingModule } from './premium-auth-routing.module';

import { PremiumAuthPage } from './premium-auth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PremiumAuthPageRoutingModule
  ],
  declarations: [PremiumAuthPage]
})
export class PremiumAuthPageModule {}
