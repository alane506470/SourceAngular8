import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdsAdvertisementaddRoutingModule } from './fds-advertisementadd-routing.module';
import { FdsAdvertisementaddComponent } from './fds-advertisementadd.component';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { SortablejsModule } from 'angular-sortablejs';
import { AddSkuDialogComponent } from './add-sku-dialog/add-sku-dialog.component';
import { ComfirmDialogModule } from '../comfirm-dialog/comfirm-dialog.module';
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
    FdsAdvertisementaddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    LoadingOverlayModule,
    PageModule,
    SortablejsModule,
    ComfirmDialogModule
  ],
  entryComponents: [FdsAdvertisementaddComponent, AddSkuDialogComponent],
  declarations: [FdsAdvertisementaddComponent, AddSkuDialogComponent],
  exports: [FdsAdvertisementaddComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
})
export class FdsAdvertisementaddModule { }
