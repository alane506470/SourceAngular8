import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './pages/authentication/login/login.module#LoginModule',
  },
  {
    path: 'register',
    loadChildren: './pages/authentication/register/register.module#RegisterModule',
  },
  {
    path: 'forgot-password',
    loadChildren: './pages/authentication/forgot-password/forgot-password.module#ForgotPasswordModule',
  },
  {
    path: 'coming-soon',
    loadChildren: './pages/coming-soon/coming-soon.module#ComingSoonModule',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
        pathMatch: 'full'
      },
      {
        path: 'apps/edm',
        loadChildren: 'app/backoffice/edm/edm.module#EdmModule',
      },
      {
        path: 'apps/manuscript',
        loadChildren: 'app/backoffice/manuscript/manuscript.module#ManuscriptModule',
      },
      {
        path: 'apps/messageMgt',
        loadChildren: 'app/backoffice/message-mgt/message-mgt.module#MessageMgtModule',
      },
      {
        path: 'apps/bonusadd',
        loadChildren: 'app/backoffice/bonusadd/bonusadd.module#BonusaddModule',
      },
      {
        path: 'apps/bonusquery',
        loadChildren: 'app/backoffice/bonusquery/bonusquery.module#BonusqueryModule',
      },
      {
        path: 'apps/pushadd',
        loadChildren: 'app/backoffice/pushadd/pushadd.module#PushaddModule',
      },
      {
        path: 'apps/pushquery',
        loadChildren: 'app/backoffice/pushquery/pushquery.module#PushqueryModule',
      },
      {
        path: 'apps/activityadd',
        loadChildren: 'app/backoffice/activityadd/activityadd.module#ActivityaddModule',
      },
      {
        path: 'apps/activityquery',
        loadChildren: 'app/backoffice/activityquery/activityquery.module#ActivityqueryModule',
      },
      {
        path: 'apps/messageadd',
        loadChildren: 'app/backoffice/messageadd/messageadd.module#MessageaddModule',
      },
      // {
      //   path: 'apps/messageadd/:id/:source',
      //   loadChildren: 'app/backoffice/messageadd/messageadd.module#MessageaddModule',
      // },
      {
        path: 'apps/messagequery',
        loadChildren: 'app/backoffice/messagequery/messagequery.module#MessagequeryModule',
      },
      {
        path: 'apps/getMmCouponList',
        loadChildren: 'app/backoffice/get-mm-coupon-list/get-mm-coupon-list.module#GetMmCouponListModule',
      },
      {
        path: 'apps/gameadd',
        loadChildren: 'app/backoffice/gameadd/gameadd.module#GameaddModule',
      },
      {
        path: 'apps/gamequery',
        loadChildren: 'app/backoffice/gamequery/gamequery.module#GamequeryModule',
      },
      {
        path: 'apps/groupprodadd',
        loadChildren: 'app/backoffice/groupprodadd/groupprodadd.module#GroupprodaddModule',
      },
      {
        path: 'apps/groupprodquery',
        loadChildren: 'app/backoffice/groupprodquery/groupprodquery.module#GroupprodqueryModule',
      },
      {
        path: 'apps/fds-communityadd',
        loadChildren: 'app/backoffice/fds-communityadd/fds-communityadd.module#FdsCommunityaddModule',
      },
      {
        path: 'apps/fds-communityquery',
        loadChildren: 'app/backoffice/fds-communityquery/fds-communityquery.module#FdsCommunityqueryModule',
      },
      {
        path: 'apps/fds-advertisementadd',
        loadChildren: 'app/backoffice/fds-advertisementadd/fds-advertisementadd.module#FdsAdvertisementaddModule',
      },
      {
        path: 'apps/fds-advertisementquery',
        loadChildren: 'app/backoffice/fds-advertisementquery/fds-advertisementquery.module#FdsAdvertisementqueryModule',
      },
      {
        path: 'apps/fds-repairquery',
        loadChildren: 'app/backoffice/fds-repairquery/fds-repairquery.module#FdsRepairqueryModule',
      },
      {
        path: 'apps/fds-communityadminadd',
        loadChildren: 'app/backoffice/fds-communityadminadd/fds-communityadminadd.module#FdsCommunityadminaddModule'
      },
      {
        path: 'apps/fds-communitymgmt',
        loadChildren: 'app/backoffice/fds-communitymgmt/fds-communitymgmt.module#FdsCommunitymgmtModule'
      },
      {
        path: 'apps/app-member-prefer',
        loadChildren: 'app/backoffice/app-member-prefer/app-member-prefer.module#AppMemberPreferModule'
      },
      {
        path: 'apps/app-download-from-branch',
        loadChildren: 'app/backoffice/app-download-from-branch/app-download-from-branch.module#AppDownloadFromBranchModule'
      },
      {
        path: 'apps/edm-mgt',
        loadChildren: 'app/backoffice/edm-mgt/edm-mgt.module#EdmMgtModule'
      },
      {
        path: 'apps/bonus-mgt',
        loadChildren: 'app/backoffice/bonus-mgt/bonus-mgt.module#BonusMgtModule'
      },
      {
        path: 'apps/fds-community-profile',
        loadChildren: 'app/backoffice/fds-community-profile/fds-community-profile.module#FdsCommunityProfileModule'
      },
      {
        path: 'apps/fds-community-steward',
        loadChildren: 'app/backoffice/fds-community-steward/fds-community-steward.module#FdsCommunityStewardModule'
      },
      {
        path: 'apps/fds-community-profile-query',
        loadChildren: 'app/backoffice/fds-community-profile-query/fds-community-profile-query.module#FdsCommunityProfileQueryModule'
      },
      {
        path: 'apps/fds-comm-address-add',
        loadChildren: 'app/backoffice/fds-comm-address-add/fds-comm-address-add.module#FdsCommAddressAddModule'
      },
      {
        path: 'apps/fds-comm-address-query',
        loadChildren: 'app/backoffice/fds-comm-address-query/fds-comm-address-query.module#FdsCommAddressQueryModule'
      },
      {
        path: 'apps/fds-community-steward-query',
        loadChildren: 'app/backoffice/fds-community-steward-query/fds-community-steward-query.module#FdsCommunityStewardQueryModule'
      },
      {
        path: 'apps/fds-steward-calendar-add',
        loadChildren: 'app/backoffice/fds-steward-calendar-add/fds-steward-calendar-add.module#FdsStewardCalendarAddModule'
      },
      {
        path: 'apps/fds-steward-calendar-query',
        loadChildren: 'app/backoffice/fds-steward-calendar-query/fds-steward-calendar-query.module#FdsStewardCalendarQueryModule'
      }
      // {
      //   path: 'apps/inbox',
      //   loadChildren: './pages/apps/inbox/inbox.module#InboxModule',
      // },
      // {
      //   path: 'apps/calendar',
      //   loadChildren: './pages/apps/calendar/calendar.module#CalendarAppModule',
      // },
      // {
      //   path: 'apps/chat',
      //   loadChildren: './pages/apps/chat/chat.module#ChatModule',
      // },
      // {
      //   path: 'components',
      //   loadChildren: './pages/components/components.module#ComponentsModule',
      // },
      // {
      //   path: 'forms/form-elements',
      //   loadChildren: './pages/forms/form-elements/form-elements.module#FormElementsModule',
      // },
      // {
      //   path: 'forms/form-wizard',
      //   loadChildren: './pages/forms/form-wizard/form-wizard.module#FormWizardModule',
      // },
      // {
      //   path: 'icons',
      //   loadChildren: './pages/icons/icons.module#IconsModule',
      // },
      // {
      //   path: 'page-layouts',
      //   loadChildren: './pages/page-layouts/page-layouts.module#PageLayoutsModule',
      // },
      // {
      //   path: 'maps/google-maps',
      //   loadChildren: './pages/maps/google-maps/google-maps.module#GoogleMapsModule',
      // },
      // {
      //   path: 'tables/all-in-one-table',
      //   loadChildren: './pages/tables/all-in-one-table/all-in-one-table.module#AllInOneTableModule',
      // },
      // {
      //   path: 'drag-and-drop',
      //   loadChildren: './pages/drag-and-drop/drag-and-drop.module#DragAndDropModule'
      // },
      // {
      //   path: 'editor',
      //   loadChildren: './pages/editor/editor.module#EditorModule',
      // },
      // {
      //   path: 'blank',
      //   loadChildren: './pages/blank/blank.module#BlankModule',
      // },
      // {
      //   path: 'level1/level2/level3/level4/level5',
      //   loadChildren: './pages/level5/level5.module#Level5Module',
      // },
    ]
  }
];

const qrCodeRoutes: Routes = [
  {
    path: 'householdQrcode',
    loadChildren: 'app/backoffice/household-qrcode/household-qrcode.module#HouseholdQrcodeModule',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  }),
  RouterModule.forRoot(qrCodeRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
