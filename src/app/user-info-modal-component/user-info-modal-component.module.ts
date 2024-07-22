import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserInfoModalComponentPageRoutingModule } from './user-info-modal-component-routing.module';

import { UserInfoModalComponentPage } from './user-info-modal-component.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserInfoModalComponentPageRoutingModule
  ],
  declarations: [UserInfoModalComponentPage]
})
export class UserInfoModalComponentPageModule {}
