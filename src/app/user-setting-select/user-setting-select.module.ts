import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSettingSelectPageRoutingModule } from './user-setting-select-routing.module';

import { UserSettingSelectPage } from './user-setting-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSettingSelectPageRoutingModule
  ],
  declarations: [UserSettingSelectPage]
})
export class UserSettingSelectPageModule {}
