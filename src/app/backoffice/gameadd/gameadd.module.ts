import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatAutocompleteModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SortablejsModule } from 'angular-sortablejs';
import { GameaddRoutingModule } from './gameadd-routing.module';
import { GameaddComponent } from './gameadd.component';
import { AddLevGoalDialogComponent } from './add-lev-goal-dialog/add-lev-goal-dialog.component';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
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
    GameaddRoutingModule,
    MaterialModule,
    FormsModule, ReactiveFormsModule,
    SortablejsModule,
    PageModule,
    LoadingOverlayModule
  ],
  declarations: [GameaddComponent, AddLevGoalDialogComponent, ComfirmDialogComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ],
  entryComponents: [AddLevGoalDialogComponent, ComfirmDialogComponent]
})
export class GameaddModule { }
