import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdsAdvertisementqueryRoutingModule } from './fds-advertisementquery-routing.module';
import { FdsAdvertisementqueryComponent } from './fds-advertisementquery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreviewComponent } from './preview/preview.component';
import { FdsAdvertisementaddModule } from '../fds-advertisementadd/fds-advertisementadd.module';
import { LoadingOverlayModule } from '../../../@fury/shared/loading-overlay/loading-overlay.module';
import { PageModule } from '../../../@fury/shared/page/page.module';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
@NgModule({
  imports: [
    CommonModule,
    FdsAdvertisementqueryRoutingModule,
    LoadingOverlayModule,
    PageModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FdsAdvertisementaddModule
  ],
  declarations: [FdsAdvertisementqueryComponent, PreviewComponent],
  entryComponents: [PreviewComponent],
  exports: [FdsAdvertisementqueryComponent]
})
export class FdsAdvertisementqueryModule { }
