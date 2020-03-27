import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsStewardCalendarQueryRoutingModule } from './fds-steward-calendar-query-routing.module';
import { FdsStewardCalendarQueryComponent } from './fds-steward-calendar-query.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fury/shared/material-components.module';
import { LoadingOverlayModule } from '@fury/shared/loading-overlay/loading-overlay.module';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TW_FORMATS } from '../activityadd/activityadd.module';


@NgModule({
  declarations: [FdsStewardCalendarQueryComponent],
  imports: [
    CommonModule,
    FdsStewardCalendarQueryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
})
export class FdsStewardCalendarQueryModule { }
