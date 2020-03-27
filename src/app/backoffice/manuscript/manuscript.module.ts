import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManuscriptComponent } from './manuscript.component';
import { ManuscriptRoutingModule } from './manuscript-routing.module';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatAutocompleteModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
// Need for file upload
import { FileUploadModule  } from 'ng2-file-upload';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
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
    ManuscriptRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    PageModule,
    FileUploadModule,
    LoadingOverlayModule
  ],
  declarations: [
    ManuscriptComponent,
    ComfirmDialogComponent,
    // Need for file upload
  ],
  entryComponents: [
    ManuscriptComponent,
    ComfirmDialogComponent],
  exports: [ManuscriptComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
})
export class ManuscriptModule {
}
