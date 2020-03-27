import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsCommAddressQueryRoutingModule } from './fds-comm-address-query-routing.module';
import { FdsCommAddressQueryComponent } from './fds-comm-address-query.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fury/shared/material-components.module';
import { LoadingOverlayModule } from '@fury/shared/loading-overlay/loading-overlay.module';


@NgModule({
  declarations: [FdsCommAddressQueryComponent],
  imports: [
    CommonModule,
    FdsCommAddressQueryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule
  ]
})
export class FdsCommAddressQueryModule { }
