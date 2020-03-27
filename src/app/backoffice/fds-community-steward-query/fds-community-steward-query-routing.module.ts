import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FdsCommunityStewardQueryComponent } from './fds-community-steward-query.component';

const routes: Routes = [{ path: '', component: FdsCommunityStewardQueryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsCommunityStewardQueryRoutingModule { }
