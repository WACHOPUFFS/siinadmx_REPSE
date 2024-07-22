import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPremiumPageRoutingModule } from './registro-premium-routing.module';

import { RegistroPremiumPage } from './registro-premium.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroPremiumPageRoutingModule
  ],
  declarations: [RegistroPremiumPage]
})
export class RegistroPremiumPageModule {}
