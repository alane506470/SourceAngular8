import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsCommunityProfileQueryRoutingModule } from './fds-community-profile-query-routing.module';
import { FdsCommunityProfileQueryComponent } from './fds-community-profile-query.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fury/shared/material-components.module';
import { LoadingOverlayModule } from '@fury/shared/loading-overlay/loading-overlay.module';
import { ClickOutsideModule } from '@fury/shared/click-outside/click-outside.module';
import { FdsCommunityProfileModule } from '../fds-community-profile/fds-community-profile.module';
import { PageModule } from '@fury/shared/page/page.module';


@NgModule({
  declarations: [FdsCommunityProfileQueryComponent],
  imports: [
    CommonModule,
    FdsCommunityProfileQueryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule,
    ClickOutsideModule,
    FdsCommunityProfileModule,
    PageModule
  ]
})
export class FdsCommunityProfileQueryModule { }
