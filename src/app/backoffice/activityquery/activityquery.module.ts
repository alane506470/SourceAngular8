import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityqueryComponent } from './activityquery.component';
import { ActivityqueryRoutingModule } from './activityquery-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SortablejsModule } from 'angular-sortablejs';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { MatPaginatorIntl } from '@angular/material';
import { MatPaginatorController } from '../paging/mat-paginator-controller';
import {ActivityaddModule} from '../activityadd/activityadd.module';
import { PreviewComponent } from './preview/preview.component';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { ListModule } from '../../../@fury/shared/list/list.module';
import { PageModule } from '../../../@fury/shared/page/page.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';


export const MY_MOMENT_FORMATS = {
  parseInput: 'YYYY/MM/DD',
  fullPickerInput: 'YYYY/MM/DD',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'YYYY MMM',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  imports: [
    CommonModule,
    ActivityqueryRoutingModule,
    ReactiveFormsModule,
    SortablejsModule,
    MaterialModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ListModule,
    PageModule,
    ActivityaddModule,
    LoadingOverlayModule
  ],
  declarations: [ActivityqueryComponent, PreviewComponent],
  entryComponents: [
    PreviewComponent],
  exports: [ActivityqueryComponent],
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    { provide: MatPaginatorIntl, useClass: MatPaginatorController }
  ],
})
export class ActivityqueryModule { }
