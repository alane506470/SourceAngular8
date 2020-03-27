import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MessagequeryComponent} from './messagequery.component';
const routes: Routes = [
  {
    path: '',
    component: MessagequeryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagequeryRoutingModule { }
