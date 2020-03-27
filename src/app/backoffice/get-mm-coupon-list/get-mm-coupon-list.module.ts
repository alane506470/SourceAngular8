import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetMmCouponListRoutingModule } from './get-mm-coupon-list-routing.module';
import { GetMmCouponListComponent } from './get-mm-coupon-list.component';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';
import { PageModule } from '../../../@fury/shared/page/page.module';


@NgModule({
  imports: [
    CommonModule,
    GetMmCouponListRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    LoadingOverlayModule,
    PageModule
  ],
  declarations: [GetMmCouponListComponent]
})
export class GetMmCouponListModule { }
