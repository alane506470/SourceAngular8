import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FdsAdvertisementqueryComponent } from './fds-advertisementquery.component';

const routes: Routes = [
  {
    path:'',
    component:FdsAdvertisementqueryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsAdvertisementqueryRoutingModule { }
