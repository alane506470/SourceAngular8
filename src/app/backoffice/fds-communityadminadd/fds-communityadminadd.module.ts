import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsCommunityadminaddRoutingModule } from './fds-communityadminadd-routing.module';
import { FdsCommunityadminaddComponent } from './fds-communityadminadd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComfirmDialogModule } from '../comfirm-dialog/comfirm-dialog.module';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';

@NgModule({
  imports: [
    CommonModule,
    FdsCommunityadminaddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule,
    ComfirmDialogModule
  ],
  entryComponents: [FdsCommunityadminaddComponent],
  declarations: [FdsCommunityadminaddComponent]
})
export class FdsCommunityadminaddModule { }
