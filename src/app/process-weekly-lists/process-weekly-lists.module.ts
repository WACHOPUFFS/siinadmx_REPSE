import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcessWeeklyListsPageRoutingModule } from './process-weekly-lists-routing.module';

import { ProcessWeeklyListsPage } from './process-weekly-lists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProcessWeeklyListsPageRoutingModule
  ],
  declarations: [ProcessWeeklyListsPage]
})
export class ProcessWeeklyListsPageModule {}
