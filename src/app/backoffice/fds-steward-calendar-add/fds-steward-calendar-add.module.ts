import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsStewardCalendarAddRoutingModule } from './fds-steward-calendar-add-routing.module';
import { FdsStewardCalendarAddComponent } from './fds-steward-calendar-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fury/shared/material-components.module';
import { LoadingOverlayModule } from '@fury/shared/loading-overlay/loading-overlay.module';
import { FileUploadModule } from 'ng2-file-upload';
import { ClickOutsideModule } from '@fury/shared/click-outside/click-outside.module';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TW_FORMATS } from '../activityadd/activityadd.module';


@NgModule({
  declarations: [FdsStewardCalendarAddComponent],
  imports: [
    CommonModule,
    FdsStewardCalendarAddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FileUploadModule,
    ClickOutsideModule,
    LoadingOverlayModule,

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
})
export class FdsStewardCalendarAddModule { }
