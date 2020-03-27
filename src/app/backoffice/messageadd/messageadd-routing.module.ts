import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MessageaddComponent} from './messageadd.component';
const routes: Routes = [
  {
    path: '',
    component: MessageaddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageaddRoutingModule { }
