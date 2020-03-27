import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FdsCommunityProfileQueryComponent } from './fds-community-profile-query.component';

const routes: Routes = [{ path: '', component: FdsCommunityProfileQueryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsCommunityProfileQueryRoutingModule { }
