import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FdsCommunityqueryRoutingModule } from './fds-communityquery-routing.module';
import { FdsCommunityqueryComponent } from './fds-communityquery.component';
import { PreviewComponent } from './preview/preview.component';
import { CommaddComponent } from './commadd/commadd.component';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';
import { PageModule } from '../../../@fury/shared/page/page.module';
import { ListModule } from '../../../@fury/shared/list/list.module';

@NgModule({
  imports: [
    CommonModule,
    FdsCommunityqueryRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingOverlayModule,
    PageModule,
    ListModule
  ],
  entryComponents: [PreviewComponent, CommaddComponent],

  declarations: [FdsCommunityqueryComponent, PreviewComponent, CommaddComponent]
})
export class FdsCommunityqueryModule { }
