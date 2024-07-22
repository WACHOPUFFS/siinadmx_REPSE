import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRolesPageRoutingModule } from './edit-roles-routing.module';

import { EditRolesPage } from './edit-roles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditRolesPageRoutingModule
  ],
  declarations: [EditRolesPage]
})
export class EditRolesPageModule {}
