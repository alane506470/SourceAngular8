import { Component, OnInit } from '@angular/core';
import { VERSION } from '../../../../environments/version';
import { HttpServiceService } from '../../../../app/http-service/http-service.service';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'fury-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  styleUrls: ['./toolbar-user.component.scss']
})
export class ToolbarUserComponent implements OnInit {

  isOpen: boolean;
  public token: string;
  version = VERSION;
  constructor(private httpService: HttpServiceService,
     private kc: KeycloakService, private router: Router) { }

  ngOnInit() {
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }

  login() {
    this.kc.login();
  }

  logout() {
    this.token = null;
    localStorage.clear();
    this.kc.logout();
  }

  authenticated(): boolean {
    return this.kc.getKeycloakInstance().authenticated;
  }

  getToken() {
    this.kc.getToken().then(token => {
      this.token = token;
      localStorage.setItem('kc_token', token);
      console.info('getToken', token);
    });
  }

  getGiftStock() {
    this.httpService.getRemoteData('crm/giftProdStocks/20161018144')
      .subscribe(
        data => {
          console.info('data subscribe:', data);
        },
        error => {
          console.error(error);
        }
      );
  }
}
