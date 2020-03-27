import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsCommunityProfileRoutingModule } from './fds-community-profile-routing.module';
import { FdsCommunityProfileComponent } from './fds-community-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fury/shared/material-components.module';
import { LoadingOverlayModule } from '@fury/shared/loading-overlay/loading-overlay.module';
import { CommInfoComponent } from './comm-info/comm-info.component';
import { ConstructionComponent } from './construction/construction.component';
import { HouseholdComponent } from './household/household.component';
import { HydropowerComponent } from './hydropower/hydropower.component';
import { AirComponent } from './air/air.component';
import { BathComponent } from './bath/bath.component';
import { MarketingComponent } from './marketing/marketing.component';
import { OtherComponent } from './other/other.component';
import { MAT_DIALOG_DATA, MatDialogRef, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { TW_FORMATS } from '../activityadd/activityadd.module';
import { ComfirmDialogModule } from '../comfirm-dialog/comfirm-dialog.module';
import { ClickOutsideModule } from '@fury/shared/click-outside/click-outside.module';


@NgModule({
  declarations: [FdsCommunityProfileComponent, CommInfoComponent, ConstructionComponent, HouseholdComponent, HydropowerComponent,
     AirComponent, BathComponent, MarketingComponent, OtherComponent],
  imports: [
    CommonModule,
    FdsCommunityProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule,
    ComfirmDialogModule,
    ClickOutsideModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: '' },
    { provide: MatDialogRef, useValue: '' }
  ]
})
export class FdsCommunityProfileModule { }
