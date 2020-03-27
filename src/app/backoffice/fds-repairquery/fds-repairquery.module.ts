import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { FdsRepairqueryRoutingModule } from './fds-repairquery-routing.module';
import { FdsRepairqueryComponent } from './fds-repairquery.component';
import { RepairaddComponent } from './repairadd/repairadd.component';
import { ComfirmDialogModule } from '../comfirm-dialog/comfirm-dialog.module';
import { PreviewPicModule } from '../preview-pic/preview-pic.module';
import { PreviewComponent } from './preview/preview.component';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';
import { PageModule } from '../../../@fury/shared/page/page.module';

export const TW_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD'
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY MMM'
  }
};

@NgModule({
  imports: [
    CommonModule,
    FdsRepairqueryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule,
    PageModule,
    ComfirmDialogModule,
    PreviewPicModule
  ],
  declarations: [FdsRepairqueryComponent, RepairaddComponent, PreviewComponent],
  entryComponents: [FdsRepairqueryComponent, RepairaddComponent, PreviewComponent],
  exports: [FdsRepairqueryComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
})
export class FdsRepairqueryModule { }
