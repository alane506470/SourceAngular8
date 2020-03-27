import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusaddComponent } from './bonusadd.component';
import { BonusaddRoutingModule } from './bonusadd-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatAutocompleteModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
import { FileUploadModule  } from 'ng2-file-upload';
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
    BonusaddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FileUploadModule,
    PageModule,

    LoadingOverlayModule
  ],
  declarations: [
    BonusaddComponent,
    ComfirmDialogComponent
   // Need for file upload
],
  entryComponents: [
    BonusaddComponent,
    ComfirmDialogComponent],
  exports: [BonusaddComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
})
export class BonusaddModule { }
