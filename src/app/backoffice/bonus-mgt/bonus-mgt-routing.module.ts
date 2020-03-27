import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BonusMgtComponent } from './bonus-mgt.component';

const routes: Routes = [
  {
    path: '',
    component: BonusMgtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonusMgtRoutingModule { }
