import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManuscriptComponent } from './manuscript.component';

const routes: Routes = [
  {
    path: '',
    component: ManuscriptComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManuscriptRoutingModule {
}
