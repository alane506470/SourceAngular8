import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GameaddComponent } from './gameadd.component';


const routes: Routes = [
  {
    path: '',
    component: GameaddComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameaddRoutingModule { }
