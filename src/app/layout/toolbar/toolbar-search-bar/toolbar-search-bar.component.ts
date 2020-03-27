import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SidenavItem } from '../../sidenav/sidenav-item/sidenav-item.interface';
import { SidenavService } from '../../sidenav/sidenav.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { result } from 'lodash-es';
import { map, debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'fury-toolbar-search-bar',
  templateUrl: './toolbar-search-bar.component.html',
  styleUrls: ['./toolbar-search-bar.component.scss']
})
export class ToolbarSearchBarComponent implements OnInit {

  focused: boolean;
  searchTerm$ = new Subject<string>();
  input: string;

  recentlyVisited: SidenavItem[] = [];
  searchItem: SidenavItem[] = [];
  constructor(
    private router: Router,
    private sidenavService: SidenavService
  ) { }

  ngOnInit() {
    // 移除recentlyVisited
    // this.setupDemoData();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event.urlAfterRedirects);
        const item = this.sidenavService.getItemByRoute(event.urlAfterRedirects);

        if (item) {
          const index = this.recentlyVisited.indexOf(item);
          if (index > -1) {
            this.recentlyVisited.splice(index, 1);
          }

          this.recentlyVisited.unshift(item);

          if (this.recentlyVisited.length > 5) {
            this.recentlyVisited.pop();
          }
        }
      }

    });

    // 查詢menu
    this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
      .subscribe(event => {
        console.log(event);
        this.searchItem = [];
        const items = this.sidenavService.getItemByName(event);
        if (items) {
          items.forEach(item => {
            if (item.length > 0 && item) {
              item.forEach(subItem => {
                this.searchItem.unshift(subItem);
                if (this.searchItem.length > 5) {
                  this.searchItem.pop();
                }
              });
            }
          });
        }
      });
  }

  setupDemoData() {
    const formWizard = this.sidenavService.getItemByRoute('/forms/form-wizard');
    if (formWizard) this.recentlyVisited.push(formWizard);

    const inbox = this.sidenavService.getItemByRoute('/apps/inbox');
    if (inbox) this.recentlyVisited.push(inbox);

    const allInOneTable = this.sidenavService.getItemByRoute('/tables/all-in-one-table');
    if (allInOneTable) this.recentlyVisited.push(allInOneTable);

    const editor = this.sidenavService.getItemByRoute('/editor');
    if (editor) this.recentlyVisited.push(editor);

    const googleMaps = this.sidenavService.getItemByRoute('/maps/google-maps');
    if (googleMaps) this.recentlyVisited.push(googleMaps);
  }

  openDropdown() {
    this.focused = true;
  }

  closeDropdown() {
    this.focused = false;
  }

}
