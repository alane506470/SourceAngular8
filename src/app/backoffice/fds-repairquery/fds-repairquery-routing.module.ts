import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FdsRepairqueryComponent } from './fds-repairquery.component';

const routes: Routes = [{ path: '', component: FdsRepairqueryComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdsRepairqueryRoutingModule { }
