import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DepartmentManagementPageRoutingModule } from './department-management-routing.module';

import { DepartmentManagementPage } from './department-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DepartmentManagementPageRoutingModule
  ],
  declarations: [DepartmentManagementPage]
})
export class DepartmentManagementPageModule {}
