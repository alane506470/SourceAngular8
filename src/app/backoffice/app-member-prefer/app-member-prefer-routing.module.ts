import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppMemberPreferComponent } from './app-member-prefer.component';

const routes: Routes = [
  {
  path: '',
  component: AppMemberPreferComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppMemberPreferRoutingModule { }
