import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HouseholdQrcodeComponent } from './household-qrcode.component';

const routes: Routes = [
  {
    path: '',
    component:HouseholdQrcodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseholdQrcodeRoutingModule { }
