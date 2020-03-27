import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomerCreateUpdateModule} from './customer-create-update/customer-create-update.module';
import { EdmComponent } from './edm.component';
import { EdmRoutingModule } from './edm-routing.module';
import { MatPaginatorIntl } from '@angular/material';
import {ManuscriptModule} from '../manuscript/manuscript.module';
import { MatPaginatorController } from '../paging/mat-paginator-controller';
import { ListModule } from '../../../@fury/shared/list/list.module';
import { PageModule } from '../../../@fury/shared/page/page.module';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
@NgModule({
  imports: [
    CommonModule,
    EdmRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,

    // Core
    ListModule,
    PageModule,
    CustomerCreateUpdateModule,
    ManuscriptModule
  ],
  declarations: [EdmComponent],
  exports: [EdmComponent],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorController}]
})
export class EdmModule {
}