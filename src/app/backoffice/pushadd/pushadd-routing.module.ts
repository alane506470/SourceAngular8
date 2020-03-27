import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PushaddComponent} from './pushadd.component';

const routes: Routes = [
  {
    path: '',
    component: PushaddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushaddRoutingModule { }
