import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FdsCommunityqueryComponent } from './fds-communityquery.component';

const routes: Routes = [
  {
    path:'',
    component:FdsCommunityqueryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsCommunityqueryRoutingModule { }
