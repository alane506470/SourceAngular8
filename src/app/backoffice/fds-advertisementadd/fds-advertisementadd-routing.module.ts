import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FdsAdvertisementaddComponent } from './fds-advertisementadd.component';

const routes: Routes = [
  {
    path:'',
    component:FdsAdvertisementaddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsAdvertisementaddRoutingModule { }
