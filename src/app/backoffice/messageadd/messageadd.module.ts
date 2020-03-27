import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageaddComponent } from './messageadd.component';
import { MessageaddRoutingModule } from './messageadd-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatAutocompleteModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
import {
  OwlDateTimeModule,  OwlNativeDateTimeModule,
  DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE
} from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { PageModule } from '../../../@fury/shared/page/page.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';
// 21955 訊息起迄日要細至時分
export const MY_CUSTOM_FORMATS = {
  fullPickerInput: 'YYYY/MM/DD LT',
  datePickerInput: 'YYYY/MM/DD',
  timePickerInput: 'LT',
  parseInput: 'YYYY/MM/DD',
  monthYearLabel: 'YYYY MMM',
  dateA11yLabel: 'YYYY/MM/DD',
  monthYearA11yLabel: 'YYYY MMM'

};
// export const TW_FORMATS = {
//   parse: {
//     dateInput: 'YYYY/MM/DD'
//   },
//   display: {
//     dateInput: 'YYYY/MM/DD',
//     monthYearLabel: 'YYYY MMM',
//     dateA11yLabel: 'YYYY/MM/DD',
//     monthYearA11yLabel: 'YYYY MMM'
//   }
// };
@NgModule({
  imports: [
    CommonModule,
    MessageaddRoutingModule,
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
  declarations: [MessageaddComponent, ComfirmDialogComponent],
  entryComponents: [
    MessageaddComponent,
    ComfirmDialogComponent],
  exports: [MessageaddComponent],
  providers: [
    // { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    // { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    // 21955 訊息起迄日要細至時分
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'zh-TW' },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
})
export class MessageaddModule { }
