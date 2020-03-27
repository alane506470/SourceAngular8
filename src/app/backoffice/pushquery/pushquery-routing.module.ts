import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PushqueryComponent} from './pushquery.component';
const routes: Routes = [
  {
    path: '',
    component: PushqueryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushqueryRoutingModule { }
