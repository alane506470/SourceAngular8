import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'simple',
    loadChildren: './page-layout-simple/page-layout-simple.module#PageLayoutSimpleModule'
  },
  {
    path: 'simple-tabbed',
    loadChildren: './page-layout-simple-tabbed/page-layout-simple-tabbed.module#PageLayoutSimpleTabbedModule'
  },
  {
    path: 'card',
    loadChildren: './page-layout-card/page-layout-card.module#PageLayoutCardModule'
  },
  {
    path: 'card-tabbed',
    loadChildren: './page-layout-card-tabbed/page-layout-card-tabbed.module#PageLayoutCardTabbedModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageLayoutsRoutingModule {
}
