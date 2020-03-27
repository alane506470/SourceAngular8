import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsCommunityaddRoutingModule } from './fds-communityadd-routing.module';
import { FdsCommunityaddComponent } from './fds-communityadd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { ComfirmDialogModule } from '../comfirm-dialog/comfirm-dialog.module';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';

@NgModule({
  imports: [
    CommonModule,
    FdsCommunityaddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FileUploadModule,
    LoadingOverlayModule,
    ComfirmDialogModule
  ],
  entryComponents: [FdsCommunityaddComponent],

  declarations: [FdsCommunityaddComponent]
})
export class FdsCommunityaddModule { }
