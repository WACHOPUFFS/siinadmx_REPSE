import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserSettingSelectPage } from './user-setting-select.page';

const routes: Routes = [
  {
    path: '',
    component: UserSettingSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSettingSelectPageRoutingModule {}
