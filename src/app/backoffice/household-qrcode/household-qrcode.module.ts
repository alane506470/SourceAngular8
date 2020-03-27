import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseholdQrcodeRoutingModule } from './household-qrcode-routing.module';
import { HouseholdQrcodeComponent } from './household-qrcode.component';

// import { QRCodeModule } from 'angular2-qrcode';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';
@NgModule({
  imports: [
    CommonModule,
    HouseholdQrcodeRoutingModule,
    MaterialModule,
    LoadingOverlayModule,
    NgxQRCodeModule,
  ],
  declarations: [HouseholdQrcodeComponent]
})
export class HouseholdQrcodeModule { }
