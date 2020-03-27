import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FdsCommunityProfileComponent } from './fds-community-profile.component';

const routes: Routes = [{ path: '', component: FdsCommunityProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsCommunityProfileRoutingModule { }
