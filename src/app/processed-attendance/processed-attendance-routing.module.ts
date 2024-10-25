import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessedAttendancePage } from './processed-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: ProcessedAttendancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessedAttendancePageRoutingModule {}
