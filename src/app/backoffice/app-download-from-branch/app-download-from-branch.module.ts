import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppDownloadFromBranchRoutingModule } from './app-download-from-branch-routing.module';
import { AppDownloadFromBranchComponent } from './app-download-from-branch.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
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
    AppDownloadFromBranchRoutingModule,
    MaterialModule,
    LoadingOverlayModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PageModule
  ],
  declarations: [AppDownloadFromBranchComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
})
export class AppDownloadFromBranchModule { }
