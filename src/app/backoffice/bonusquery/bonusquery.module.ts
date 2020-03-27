import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusqueryComponent } from './bonusquery.component';
import { BonusqueryRoutingModule } from './bonusquery-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BonusaddModule} from '../bonusadd/bonusadd.module';
import { MatPaginatorIntl } from '@angular/material';
import { MatPaginatorController } from '../paging/mat-paginator-controller';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { ListModule } from '../../../@fury/shared/list/list.module';
import { PageModule } from '../../../@fury/shared/page/page.module';

@NgModule({
  imports: [
    CommonModule,
    BonusqueryRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    BonusaddModule,

    // Core
    ListModule,
    PageModule,
  ],
  declarations: [BonusqueryComponent],
  exports: [BonusqueryComponent],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorController }]
})
export class BonusqueryModule { }
