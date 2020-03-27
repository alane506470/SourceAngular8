import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BonusqueryComponent } from './bonusquery.component';

const routes: Routes = [
  {
    path: '',
    component: BonusqueryComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonusqueryRoutingModule { }
