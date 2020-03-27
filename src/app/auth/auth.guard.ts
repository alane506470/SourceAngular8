import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { KeycloakService, KeycloakAuthGuard } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard implements CanActivate {
  constructor(protected router: Router, protected keycloakService: KeycloakService) {
    super(router, keycloakService);
   }

  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // throw new Error("Method not implemented.");
    return new Promise((resolve, reject) => {
      console.log(this.keycloakService.getKeycloakInstance().authenticated);
      if (this.keycloakService.getKeycloakInstance().authenticated) {
        // token時效低於15分鐘就登出
        const isTokenExpired = this.keycloakService.isTokenExpired(1000);
        if (isTokenExpired) {
          localStorage.removeItem('kc_token');
          this.keycloakService.logout();
        }
        return resolve(true);
      } else {
        localStorage.clear();
        this.keycloakService.logout();
      }
    });
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }


}
