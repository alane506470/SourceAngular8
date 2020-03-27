import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatAutocompleteModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GamequeryRoutingModule } from './gamequery-routing.module';
import { GamequeryComponent } from './gamequery.component';
import { MatPaginatorIntl } from '@angular/material';
import { MatPaginatorController } from '../paging/mat-paginator-controller';
import {GameaddModule} from '../gameadd/gameadd.module';
import { QrcodeDownloadComponent } from './qrcode-download/qrcode-download.component';
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
    GamequeryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ListModule,
    PageModule,
    GameaddModule,
    LoadingOverlayModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' },
    { provide: MatPaginatorIntl, useClass: MatPaginatorController }
  ],
  declarations: [GamequeryComponent, QrcodeDownloadComponent],
  exports: [GamequeryComponent],
  entryComponents: [QrcodeDownloadComponent]
})
export class GamequeryModule { }
