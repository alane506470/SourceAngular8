import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GamequeryComponent} from './gamequery.component';
const routes: Routes = [
  {
    path: '',
    component: GamequeryComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamequeryRoutingModule { }
