import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdmMgtRoutingModule } from './edm-mgt-routing.module';
import { EdmMgtComponent } from './edm-mgt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComfirmDialogModule } from '../comfirm-dialog/comfirm-dialog.module';
import { MaterialModule } from '@fury/shared/material-components.module';
import { LoadingOverlayModule } from '@fury/shared/loading-overlay/loading-overlay.module';
import { PageModule } from '@fury/shared/page/page.module';

@NgModule({
  imports: [
    CommonModule,
    EdmMgtRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule,
    ComfirmDialogModule,
    PageModule
  ],
  declarations: [EdmMgtComponent]
})
export class EdmMgtModule { }
