import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GetMmCouponListComponent} from './get-mm-coupon-list.component';
const routes: Routes = [
  {
    path: '',
    component: GetMmCouponListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetMmCouponListRoutingModule { }
