import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FdsCommAddressAddComponent } from './fds-comm-address-add.component';

const routes: Routes = [{ path: '', component: FdsCommAddressAddComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsCommAddressAddRoutingModule { }
