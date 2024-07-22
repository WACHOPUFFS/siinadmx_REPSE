import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceivedPageRoutingModule } from './received-routing.module';

import { ReceivedPage } from './received.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceivedPageRoutingModule
  ],
  declarations: [ReceivedPage]
})
export class ReceivedPageModule {}
