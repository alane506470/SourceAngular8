import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment';



const Keycloak = require('./keycloak'); // load keycloak.js locally
type KeycloakClient = KeycloakModule.KeycloakClient;
@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  static keycloakAuth: KeycloakClient = Keycloak({
    'realm': environment.keycloakRealm,
    'url': environment.AuthHost,
    'ssl-required': 'external',
    'clientId': 'backoffice-angular',
    'public-client': true,
    'confidential-port': 0
  });

    static init(options?: any): Promise<any> {
        return new Promise((resolve, reject) => {
          KeycloakService.keycloakAuth.init(options)
                .success(() => {
                    console.log('keycloakAuth success');
                    resolve();
                })
                .error((errorData: any) => {
                    console.log('keycloakAuth error', errorData);
                    reject(errorData);
                });
        });
    }

    authenticated(): boolean {
        return KeycloakService.keycloakAuth.authenticated;
    }

    login() {
      console.log('login',   KeycloakService.keycloakAuth);
        KeycloakService.keycloakAuth.login();
    }

    logout() {
        KeycloakService.keycloakAuth.logout();
    }

    account() {
        KeycloakService.keycloakAuth.accountManagement();
    }

    isTokenExpired(minValidity: number): boolean {
        return KeycloakService.keycloakAuth.isTokenExpired(minValidity);
    }

    getToken(): Promise<string> {
      console.log('login getToken');
        return new Promise<string>((resolve, reject) => {
            if (KeycloakService.keycloakAuth.token) {
                KeycloakService.keycloakAuth
                    .updateToken(5)
                    .success(() => {
                      console.log('getToken - success');
                        resolve(<string>KeycloakService.keycloakAuth.token);
                    })
                    .error(() => {
                      console.log('getToken - error');
                      reject('Failed to refresh token');
                    });
            } else {
                reject('Not loggen in');
            }
        });
    }
}
