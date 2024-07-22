import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PermissionsBusineesPartnerPageRoutingModule } from './permissions-businees-partner-routing.module';

import { PermissionsBusineesPartnerPage } from './permissions-businees-partner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PermissionsBusineesPartnerPageRoutingModule
  ],
  declarations: [PermissionsBusineesPartnerPage]
})
export class PermissionsBusineesPartnerPageModule {}
