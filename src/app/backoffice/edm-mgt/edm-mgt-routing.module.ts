import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EdmMgtComponent } from './edm-mgt.component';

const routes: Routes = [
  {
    path: '',
    component: EdmMgtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EdmMgtRoutingModule { }
