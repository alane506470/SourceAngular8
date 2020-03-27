import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER, ApplicationRef, DoBootstrap } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs'; // Needed for Touch functionality of Material Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { PendingInterceptorModule } from '../@fury/shared/loading-indicator/pending-interceptor.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BackofficeModule } from './backoffice/backoffice.module';
import { KEYCLOAK_HTTP_PROVIDER } from './keycloak-service/keycloak.http';
import { AuthGuard } from './auth/auth.guard';
import { HttpInterceptorProviders } from './http-interceptor';
import { initializer } from './keycloak-service/app-init';
import { KeycloakService } from 'keycloak-angular';

const keycloakService = new KeycloakService();
@NgModule({
  imports: [
    // Angular Core Module // Don't remove!
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Fury Core Modules
    AppRoutingModule,

    // Layout Module (Sidenav, Toolbar, Quickpanel, Content)
    LayoutModule,

    // Google Maps Module
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey
    }),

    // Displays Loading Bar when a Route Request or HTTP Request is pending
    PendingInterceptorModule,

    BackofficeModule
    // Register a Service Worker (optional)
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    {

      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill'
      } as MatFormFieldDefaultOptions
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      } as MatSnackBarConfig
    },
    AuthGuard,
    HttpInterceptorProviders,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: KeycloakService,
      useValue: keycloakService
    }
  ],
  // entryComponents: [ComfirmDialogComponent]
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void {
    // throw new Error("Method not implemented.");
    keycloakService.init().then(() => {
      console.log('[ngDoBootstrap] bootstrap app');
      appRef.bootstrap(AppComponent);
    })
    .catch(error => console.error('[ngDoBootstrap] init Keycloak failed', error));
  }
}
