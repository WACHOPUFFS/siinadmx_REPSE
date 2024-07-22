import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalInfoUserPremiumPageRoutingModule } from './modal-info-user-premium-routing.module';

import { ModalInfoUserPremiumPage } from './modal-info-user-premium.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalInfoUserPremiumPageRoutingModule
  ],
  declarations: [ModalInfoUserPremiumPage]
})
export class ModalInfoUserPremiumPageModule {}
