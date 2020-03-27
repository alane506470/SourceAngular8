import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonusMgtRoutingModule } from './bonus-mgt-routing.module';
import { BonusMgtComponent } from './bonus-mgt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComfirmDialogModule } from '../comfirm-dialog/comfirm-dialog.module';
import { MaterialModule } from '@fury/shared/material-components.module';
import { LoadingOverlayModule } from '@fury/shared/loading-overlay/loading-overlay.module';
import { PageModule } from '@fury/shared/page/page.module';

@NgModule({
  imports: [
    CommonModule,
    BonusMgtRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingOverlayModule,
    ComfirmDialogModule,
    PageModule
  ],
  declarations: [BonusMgtComponent]
})
export class BonusMgtModule { }
