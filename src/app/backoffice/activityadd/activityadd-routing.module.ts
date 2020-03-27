import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ActivityaddComponent } from './activityadd.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityaddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityaddRoutingModule { }
