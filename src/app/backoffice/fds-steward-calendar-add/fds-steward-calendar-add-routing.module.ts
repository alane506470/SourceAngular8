import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FdsStewardCalendarAddComponent } from './fds-steward-calendar-add.component';

const routes: Routes = [{ path: '', component: FdsStewardCalendarAddComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsStewardCalendarAddRoutingModule { }
