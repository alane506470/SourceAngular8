import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import each from 'lodash-es/each';
import isArray from 'lodash-es/isArray';
import isEqual from 'lodash-es/isEqual';
import keys from 'lodash-es/keys';
import sortBy from 'lodash-es/sortBy';
import { BehaviorSubject } from 'rxjs';
import { SidenavItem } from './sidenav-item/sidenav-item.interface';
import { filter, map, takeUntil } from 'rxjs/operators';
import { componentDestroyed } from '../../../@fury/shared/component-destroyed';
import { MediaObserver } from '@angular/flex-layout';
import { HttpServiceService } from '../../../app/http-service/http-service.service';
import { KeycloakService, KeycloakEvent, KeycloakEventType } from 'keycloak-angular';
import { MatDialog } from '@angular/material';
import { ComfirmDialogComponent } from 'app/backoffice/comfirm-dialog/comfirm-dialog.component';


@Injectable()
export class SidenavService implements OnDestroy {

  mobileBreakpoint = 'lt-md';
  private acl_path = 'aclapi/acl/queryUserMenu?systypeCode=11';
  /**
   * Sidenav Items
   * @type {BehaviorSubject<SidenavItem[]>}
   * @private
   */
  // API是否成功
  private _isApiFail = new BehaviorSubject<boolean>(true);
  ApiFail$ = this._isApiFail.asObservable();

  // 觀察是否有權限
  private _isAdmin = new BehaviorSubject<boolean>(false);
  colse$ = this._isAdmin.asObservable();

  private _items = new BehaviorSubject<SidenavItem[]>([]);

  items$ = this._items.asObservable();

  get items(): SidenavItem[] {
    return this._items.getValue();
  }

  set items(items: SidenavItem[]) {
    this._items.next(items);
  }

  /**
   * Currently Open
   * @type {BehaviorSubject<SidenavItem[]>}
   * @private
   */
  private _currentlyOpen = new BehaviorSubject<SidenavItem[]>([]);

  currentlyOpen$ = this._currentlyOpen.asObservable();

  get currentlyOpen(): SidenavItem[] {
    return this._currentlyOpen.getValue();
  }

  set currentlyOpen(currentlyOpen: SidenavItem[]) {
    this._currentlyOpen.next(currentlyOpen);
  }

  private _openSubject = new BehaviorSubject<boolean>(this.mediaObserver.isActive(this.mobileBreakpoint));

  open$ = this._openSubject.asObservable();
  private _modeSubject = new BehaviorSubject<'side' | 'over'>(this.mediaObserver.isActive(this.mobileBreakpoint) ? 'over' : 'side');
  mode$ = this._modeSubject.asObservable();
  private _collapsedSubject = new BehaviorSubject<boolean>(false);
  collapsed$ = this._collapsedSubject.asObservable();
  private _expandedSubject = new BehaviorSubject<boolean>(false);
  expanded$ = this._expandedSubject.asObservable();

  constructor(private router: Router, private httpService: HttpServiceService, public dialog: MatDialog,
    private mediaObserver: MediaObserver, private keycloakService: KeycloakService) {
    this.router.events.pipe(
      filter<NavigationEnd>(event => event instanceof NavigationEnd),
      takeUntil(componentDestroyed(this))
    ).subscribe(event => {
      this.setCurrentlyOpenByRoute(event.url);

      if (this.mediaObserver.isActive(this.mobileBreakpoint)) {
        // Close Sidenav on Mobile after Route Change
        this._openSubject.next(false);
      }
    });

    this.mediaObserver.asObservable().pipe(
      map(() => this.mediaObserver.isActive(this.mobileBreakpoint)),
      takeUntil(componentDestroyed(this))
    ).subscribe(isMobile => {
      if (isMobile) {
        this._openSubject.next(false);
        this._modeSubject.next('over');
        this._collapsedSubject.next(false);
      } else {
        this._openSubject.next(true);
        this._modeSubject.next('side');
      }
    });

    this.keycloakService.keycloakEvents$.subscribe((event: KeycloakEvent) => {
      console.log(event);
      switch (event.type) {
        case KeycloakEventType.OnAuthError:
          console.log('KeycloakEventType.OnAuthError');
          break;
        case KeycloakEventType.OnAuthLogout:
          console.log('KeycloakEventType.OnAuthLogout');
          break;
        case KeycloakEventType.OnAuthRefreshError:
          console.log('KeycloakEventType.OnAuthRefreshError');
          break;
        case KeycloakEventType.OnAuthRefreshSuccess:
          console.log('KeycloakEventType.OnAuthRefreshSuccess');
          break;
        case KeycloakEventType.OnAuthSuccess:
          console.log('KeycloakEventType.OnAuthSuccess');
          break;
        case KeycloakEventType.OnReady:
          console.log('KeycloakEventType.OnReady');
          break;
        case KeycloakEventType.OnTokenExpired:
          console.log('KeycloakEventType.OnTokenExpired');
          this.onTokenExpired();
          break;
        default:
          break;
      }
    });

    if (this.keycloakService.getKeycloakInstance().authenticated) {
      // token時效低於15分鐘就登出
      if (this.keycloakService.getKeycloakInstance().isTokenExpired(1000)) {
        localStorage.removeItem('kc_token');
        this.keycloakService.logout();
      } else {
        this.keycloakService.getToken().then(token => {
          localStorage.setItem('kc_token', token);
          this.getMenutree(this.acl_path);
        });
      }
    } else {
      localStorage.clear();
      this.keycloakService.logout();
    }

  }

  onTokenExpired() {
    const confirmDialogRef2 = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: '權限逾時，請重新登入',
        type: '3'
      }
    });
    confirmDialogRef2.componentInstance.dodelayCloseConfirm.subscribe(() => {
      localStorage.clear();
      this.keycloakService.logout();
      confirmDialogRef2.close();
    });
  }

  open() {
    this._openSubject.next(true);
  }

  close() {
    this._openSubject.next(false);
  }

  setCollapsed(collapsed: boolean) {
    this._collapsedSubject.next(collapsed);
  }

  toggleCollapsed() {
    this._collapsedSubject.next(!this._collapsedSubject.getValue());
  }

  setExpanded(expanded: boolean) {
    this._expandedSubject.next(expanded);
  }

  toggleExpanded() {
    this._expandedSubject.next(!this._expandedSubject.getValue());
  }

  addItems(items: SidenavItem[]) {
    items.forEach(item => this.addItem(item));
  }

  addItem(item: SidenavItem) {
    const foundIndex = this.items.findIndex((existingItem) => isEqual(existingItem, item));
    if (foundIndex === -1) {
      this.setParentRecursive(item);
      this.items = [...this.items, item];
    }
  }

  toggleItemOpen(item: SidenavItem) {
    let currentlyOpen = this.currentlyOpen;

    if (this.isOpen(item)) {
      if (currentlyOpen.length > 1) {
        currentlyOpen.length = currentlyOpen.indexOf(item);
      } else {
        currentlyOpen = [];
      }
    } else {
      currentlyOpen = this.getParents(item);
    }

    this.currentlyOpen = currentlyOpen;
  }

  sortRecursive(array: SidenavItem[], propertyName: string): SidenavItem[] {
    const that = this;

    array.forEach(function (item) {
      // console.log(item);
      const keyArray = keys(item);
      keyArray.forEach(function (key) {
        if (isArray(item[key])) {
          item[key] = that.sortRecursive(item[key], propertyName);
        }
      });
    });

    return sortBy(array, propertyName);
  }

  getItemByRoute(route) {
    return this.getItemByRouteRecursive(route, this.items);
  }

  ngOnDestroy(): void { }

  private getParents(item: SidenavItem, items: SidenavItem[] = []) {
    items.unshift(item);

    if (item.parent) {
      return this.getParents(item.parent, items);
    } else {
      return items;
    }
  }

  private isOpen(item: SidenavItem) {
    return (this.currentlyOpen.indexOf(item) > -1);
  }

  private setCurrentlyOpenByRoute(route: string) {
    const item = this.getItemByRouteRecursive(route, this.items);
    let currentlyOpen = [];

    if (item && item.parent) {
      currentlyOpen = this.getParents(item);
    } else if (item) {
      currentlyOpen = [item];
    }

    this.currentlyOpen = currentlyOpen;
  }

  getItemByName(name: string) {
    return this.getItemByNameRecursive(name, this.items);
  }
  getItemByNameRecursive(searchName: string, collection: SidenavItem[]) {
    const result = collection.map(item => {
      return item.subItems.filter(subItem => {
        return subItem.name.includes(searchName);
      });
    });
    // console.log(result);
    return result;
  }
  private getItemByRouteRecursive(route: string, collection: SidenavItem[]) {
    let result = collection.find(i => i.routeOrFunction === route);
    // 在查一次子項目，如果返回false則中斷
    if (!result) {
      each(collection, (item) => {
        if (item && item.subItems && item.subItems.length > 0) {
          const found = this.getItemByRouteRecursive(route, item.subItems);

          if (found) {
            result = found;
            return false;
          }
        }
      });
    }

    return result;
  }

  private setParentRecursive(item: SidenavItem) {
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach(subItem => {
        subItem.parent = item;
        this.setParentRecursive(subItem);
      });
    }
  }

  private async getMenutree(acl_path) {
    const menuTree = localStorage.getItem('menuTree');
    if (menuTree) {
      const menuTreeObj = JSON.parse(menuTree);
      this.buildMenuTree(menuTreeObj);
      // 解鎖畫面 Alan
      this.lockView(false);
    } else {
      this.httpService.getRemoteData(acl_path)
        .subscribe((data: RootObject) => {
          console.log('data subscribe:', data);
          this.buildMenuTree(data);
          // if no error save in localStorage
          localStorage.setItem('menuTree', JSON.stringify(data));
          // 解鎖畫面 Alan
          this.lockView(false);
        },
          error => {
            console.error(error);
          }
        );
    }
  }

  private buildMenuTree(data: RootObject) {
    const menuRoot: RootMenu[] = data.data.rootMenu;
    const menuTree: Child[] = menuRoot[0].children;
    console.info('menuTree:', menuTree);
    menuTree.forEach(menuNode => {
      console.info('menuNode:', menuNode);
      if (menuNode.rightCode === 'MMC06') {
        this.setChartOpen(true);
      }
      const item = new SidenavItem();
      item.name = menuNode.rightName;
      item.icon = menuNode.note;
      item.routeOrFunction = null;
      item.position = menuNode.sort - 100;

      const subMenuTree: Child[] = menuNode.children;
      const subItems = new Array();
      // console.log(menuNode.children);
      // console.log(subMenuTree);
      subMenuTree.forEach(subMenuNode => {
        console.info('subMenuNode:', subMenuNode);
        const subItem = new SidenavItem();
        subItem.name = subMenuNode.rightName;
        subItem.routeOrFunction = subMenuNode.url;
        subItem.position = subMenuNode.sort;
        subItems.push(subItem);
      });
      item.subItems = subItems;
      this.addItem(item);
    });
  }

  setChartOpen(open: boolean) {
    this._isAdmin.next(open);
  }

  lockView(lock: boolean) {
    this._isApiFail.next(lock);
  }

}
export interface RootObject {
  status: string;
  message?: any;
  data: Data;
}

export interface Data {
  userInfo: UserInfo;
  groupInfoList: any[];
  errorList: any[];
  roles: Role[];
  rootMenu: RootMenu[];
  manageStoreInfoList: ManageStoreInfoList[];
}

export interface UserInfo {
  empId: string;
  cname: string;
  ename: string;
  email: string;
  sessionToken?: any;
  storeId: string;
  storeName: string;
}

export interface Child {
  rightCode: string;
  rightName: string;
  type: string;
  url?: any;
  sort: number;
  iconUrl?: any;
  supperCode: string;
  sysTypeCode: string;
  isLast: string;
  note?: any;
  extUrl?: any;
  children: Child[];
}

export interface Role {
  roleCode: string;
  cnName: string;
  sysTypeCode: string;
}

export interface ManageStoreInfoList {
  storeId: string;
  storeCname: string;
  storeEname: string;
}

export interface RootMenu {
  rightCode?: any;
  rightName?: any;
  type?: any;
  url?: any;
  sort: number;
  iconUrl?: any;
  supperCode?: any;
  sysTypeCode?: any;
  isLast?: any;
  note?: any;
  extUrl?: any;
  children: Child[];
}
