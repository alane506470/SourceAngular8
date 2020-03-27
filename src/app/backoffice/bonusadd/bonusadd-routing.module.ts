import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BonusaddComponent } from './bonusadd.component';

const routes: Routes = [
  {
    path: '',
    component: BonusaddComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonusaddRoutingModule { }
