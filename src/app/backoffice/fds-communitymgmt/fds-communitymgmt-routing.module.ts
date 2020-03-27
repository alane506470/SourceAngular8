import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FdsCommunitymgmtComponent } from './fds-communitymgmt.component';

const routes: Routes = [
  { path: '', component: FdsCommunitymgmtComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsCommunitymgmtRoutingModule { }
