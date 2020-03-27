import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FdsCommunityadminaddComponent } from './fds-communityadminadd.component';

const routes: Routes = [
  {
    path: '',
    component: FdsCommunityadminaddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsCommunityadminaddRoutingModule { }
