import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FdsStewardCalendarQueryComponent } from './fds-steward-calendar-query.component';

const routes: Routes = [{ path: '', component: FdsStewardCalendarQueryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsStewardCalendarQueryRoutingModule { }
