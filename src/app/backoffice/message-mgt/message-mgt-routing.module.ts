import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MessageMgtComponent } from './message-mgt.component';

const routes: Routes = [
  {
    path: '',
    component: MessageMgtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageMgtRoutingModule { }
