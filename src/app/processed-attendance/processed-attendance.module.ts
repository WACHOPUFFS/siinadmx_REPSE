import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcessedAttendancePageRoutingModule } from './processed-attendance-routing.module';

import { ProcessedAttendancePage } from './processed-attendance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProcessedAttendancePageRoutingModule
  ],
  declarations: [ProcessedAttendancePage]
})
export class ProcessedAttendancePageModule {}
