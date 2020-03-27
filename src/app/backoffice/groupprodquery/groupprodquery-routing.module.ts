import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupprodqueryComponent } from './groupprodquery.component';

const routes: Routes = [
  {
    path: '',
    component: GroupprodqueryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupprodqueryRoutingModule { }
