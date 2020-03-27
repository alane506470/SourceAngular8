import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagequeryComponent } from './messagequery.component';
import { MessagequeryRoutingModule } from './messagequery-routing.module';
import { MessageaddModule } from '../messageadd/messageadd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MatPaginatorController } from '../paging/mat-paginator-controller';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { ListModule } from '../../../@fury/shared/list/list.module';
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
    MessagequeryRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MessageaddModule,

    // Core
    ListModule,
    PageModule
  ],
  declarations: [MessagequeryComponent],
  exports: [MessagequeryComponent],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorController },
   { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS }]
})
export class MessagequeryModule { }
