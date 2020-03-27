import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FdsCommunityaddComponent } from './fds-communityadd.component';

const routes: Routes = [
  {
    path:'',
    component:FdsCommunityaddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsCommunityaddRoutingModule { }
