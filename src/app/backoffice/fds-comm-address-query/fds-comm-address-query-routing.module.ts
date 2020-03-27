import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FdsCommAddressQueryComponent } from './fds-comm-address-query.component';

const routes: Routes = [{ path: '', component: FdsCommAddressQueryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsCommAddressQueryRoutingModule { }
