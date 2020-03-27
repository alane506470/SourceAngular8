import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FdsCommunityStewardComponent } from './fds-community-steward.component';

const routes: Routes = [{ path: '', component: FdsCommunityStewardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsCommunityStewardRoutingModule { }
