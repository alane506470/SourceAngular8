import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsCommunityStewardQueryRoutingModule } from './fds-community-steward-query-routing.module';
import { FdsCommunityStewardQueryComponent } from './fds-community-steward-query.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fury/shared/material-components.module';
import { LoadingOverlayModule } from '@fury/shared/loading-overlay/loading-overlay.module';
import { PageModule } from '@fury/shared/page/page.module';
import { FdsCommunityStewardModule } from '../fds-community-steward/fds-community-steward.module';


@NgModule({
  declarations: [FdsCommunityStewardQueryComponent],
  imports: [
    CommonModule,
    FdsCommunityStewardQueryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule,
    PageModule,
    FdsCommunityStewardModule
  ]
})
export class FdsCommunityStewardQueryModule { }
