import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CpAuthModalPageRoutingModule } from './cp-auth-modal-routing.module';

import { CpAuthModalPage } from './cp-auth-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CpAuthModalPageRoutingModule
  ],
  declarations: [CpAuthModalPage]
})
export class CpAuthModalPageModule {}
