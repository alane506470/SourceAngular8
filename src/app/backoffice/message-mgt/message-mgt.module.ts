import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatAutocompleteModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MessageMgtRoutingModule } from './message-mgt-routing.module';
import { MessageMgtComponent } from './message-mgt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material';
import { MatPaginatorController } from '../paging/mat-paginator-controller';
import { PreviewComponent } from './preview/preview.component';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { ListModule } from '../../../@fury/shared/list/list.module';
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
    MessageMgtRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    // Core
    ListModule,
    PageModule,
    LoadingOverlayModule
  ],
  declarations: [
    MessageMgtComponent,
    PreviewComponent,
    ComfirmDialogComponent
  ],

  entryComponents: [
    PreviewComponent,
    ComfirmDialogComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorController },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ],
  exports: [MessageMgtComponent]
})
export class MessageMgtModule { }
