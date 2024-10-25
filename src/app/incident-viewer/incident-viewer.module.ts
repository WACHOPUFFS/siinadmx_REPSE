import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentViewerPageRoutingModule } from './incident-viewer-routing.module';

import { IncidentViewerPage } from './incident-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentViewerPageRoutingModule
  ],
  declarations: [IncidentViewerPage]
})
export class IncidentViewerPageModule {}
