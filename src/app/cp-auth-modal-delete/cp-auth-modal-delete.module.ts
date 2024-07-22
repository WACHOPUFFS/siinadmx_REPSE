import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CpAuthModalDeletePageRoutingModule } from './cp-auth-modal-delete-routing.module';

import { CpAuthModalDeletePage } from './cp-auth-modal-delete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CpAuthModalDeletePageRoutingModule
  ],
  declarations: [CpAuthModalDeletePage]
})
export class CpAuthModalDeletePageModule {}
