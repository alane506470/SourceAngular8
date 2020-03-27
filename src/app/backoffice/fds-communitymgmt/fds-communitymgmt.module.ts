import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsCommunitymgmtRoutingModule } from './fds-communitymgmt-routing.module';
import { FdsCommunitymgmtComponent } from './fds-communitymgmt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreviewComponent } from './preview/preview.component';
import { ComfirmDialogModule } from '../comfirm-dialog/comfirm-dialog.module';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';
import { PageModule } from '../../../@fury/shared/page/page.module';

@NgModule({
  imports: [
    CommonModule,
    FdsCommunitymgmtRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule,
    PageModule,
    ComfirmDialogModule
  ],
  entryComponents: [PreviewComponent],
  declarations: [FdsCommunitymgmtComponent, PreviewComponent]
})
export class FdsCommunitymgmtModule { }
