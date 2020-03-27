import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ActivityqueryComponent} from './activityquery.component';
const routes: Routes = [
  {
    path: '',
    component: ActivityqueryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityqueryRoutingModule { }
