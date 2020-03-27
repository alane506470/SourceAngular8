import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupprodaddComponent } from './groupprodadd.component';

const routes: Routes = [
  {
    path: '',
    component: GroupprodaddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupprodaddRoutingModule { }
