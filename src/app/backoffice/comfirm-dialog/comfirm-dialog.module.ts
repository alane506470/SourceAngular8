import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComfirmDialogRoutingModule } from './comfirm-dialog-routing.module';
import { ComfirmDialogComponent } from './comfirm-dialog.component';
import { MaterialModule } from '../../../@fury/shared/material-components.module';

@NgModule({
  imports: [
    CommonModule,
    ComfirmDialogRoutingModule,
    MaterialModule
  ],
  entryComponents: [ComfirmDialogComponent],
  exports: [ComfirmDialogComponent],
  declarations: [ComfirmDialogComponent]
})
export class ComfirmDialogModule { }
