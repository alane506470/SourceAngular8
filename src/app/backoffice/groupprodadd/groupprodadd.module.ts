import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupprodaddComponent } from './groupprodadd.component';
import { GroupprodaddRoutingModule } from './groupprodadd-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatAutocompleteModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
import { OwlDateTimeModule,  OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { PageModule } from '../../../@fury/shared/page/page.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';

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
    GroupprodaddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FileUploadModule,
    MatAutocompleteModule,
    PageModule,
    LoadingOverlayModule,
    // 21955 訊息起迄日要細至時分
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [GroupprodaddComponent, ComfirmDialogComponent],
  entryComponents: [
    GroupprodaddComponent,
    ComfirmDialogComponent],
  exports: [GroupprodaddComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
})
export class GroupprodaddModule { }
