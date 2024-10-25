import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentControlPageRoutingModule } from './incident-control-routing.module';

import { IncidentControlPage } from './incident-control.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentControlPageRoutingModule
  ],
  declarations: [IncidentControlPage]
})
export class IncidentControlPageModule {}
