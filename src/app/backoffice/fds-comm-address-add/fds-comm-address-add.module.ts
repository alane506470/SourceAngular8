import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsCommAddressAddRoutingModule } from './fds-comm-address-add-routing.module';
import { FdsCommAddressAddComponent } from './fds-comm-address-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fury/shared/material-components.module';
import { LoadingOverlayModule } from '@fury/shared/loading-overlay/loading-overlay.module';


@NgModule({
  declarations: [FdsCommAddressAddComponent],
  imports: [
    CommonModule,
    FdsCommAddressAddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule
  ]
})
export class FdsCommAddressAddModule { }
