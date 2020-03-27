import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityaddComponent } from './activityadd.component';
import { ActivityaddRoutingModule } from './activityadd-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatAutocompleteModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SortablejsModule } from 'angular-sortablejs';


// import {
//   OwlDateTimeModule,  OwlNativeDateTimeModule,
//   DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE
// } from 'ng-pick-datetime';
// import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { AddSkuDialogComponent } from './add-sku-dialog/add-sku-dialog.component';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { PageModule } from '../../../@fury/shared/page/page.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';
// export const MY_CUSTOM_FORMATS = {
//   fullPickerInput: 'YYYY/MM/DD LT',
//   datePickerInput: 'YYYY/MM/DD',
//   timePickerInput: 'LT',
//   parseInput: 'YYYY/MM/DD',
//   monthYearLabel: 'YYYY MMM',
//   dateA11yLabel: 'YYYY/MM/DD',
//   monthYearA11yLabel: 'YYYY MMM'

// };
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
    ActivityaddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FileUploadModule,
    PageModule,
    LoadingOverlayModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    SortablejsModule
  ],
  declarations: [
    ActivityaddComponent,
    ComfirmDialogComponent,
    AddSkuDialogComponent
  ],

  entryComponents: [
    ActivityaddComponent,
    ComfirmDialogComponent,
    AddSkuDialogComponent],

  exports: [ActivityaddComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
  // providers: [
  //   // `MomentDateTimeAdapter` can be automatically provided by importing
  //   // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
  //   // here, due to limitations of our example generation script.
  //   { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
  //   { provide: OWL_DATE_TIME_LOCALE, useValue: 'zh-TW' },
  //   { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  //   { provide: MAT_DIALOG_DATA, useValue: '' },
  //   { provide: MatDialogRef, useValue: '' }
  // ],
})
export class ActivityaddModule { }
