import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { ApiUrl } from 'environments/api-url';
import { Observable, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommRootObject } from 'app/api-result/api-result.interface';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ListColumn } from '@fury/shared/list/list-column.model';
import { FdsCommunityStewardComponent } from '../fds-community-steward/fds-community-steward.component';

@Component({
  selector: 'fds-community-steward-query',
  templateUrl: './fds-community-steward-query.component.html',
  styleUrls: ['./fds-community-steward-query.component.scss']
})
export class FdsCommunityStewardQueryComponent implements OnInit {

  isLoadingSIC = true;
  isLoading = false;
  input;
  focused: boolean;
  searchTerm$ = new Subject<string>();
  resultsLength: number;
  dynamicUser: any[] = [];
  getUserInCharge: any[] = [];
  form1: FormGroup;
  getSiteInCharge$: Observable<any>;
  dataSource = new MatTableDataSource<any>();
  columns: ListColumn[] = [
    // { name: '', property: 'commId', visible: false, isModelProperty: true },
    // { name: '', property: 'commAdd1', visible: false, isModelProperty: true },
    // { name: '', property: 'commAdd2', visible: false, isModelProperty: true },
    // { name: '', property: 'siteInCharge', visible: false, isModelProperty: true },
    // { name: '', property: 'userInCharge', visible: false, isModelProperty: true },
    { name: '社區管家姓名', property: 'userName', visible: true, isModelProperty: true },
    { name: '所屬分店', property: 'siteInChargeValue', visible: true, isModelProperty: true },

  ] as ListColumn[];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  private SiteInCharge_path = ApiUrl.fs_site_in_charge_path;
  private CommSte_path = ApiUrl.fs_query_mgr_mst_path;
  private UserInCharge_path = ApiUrl.fs_user_in_charge_path;
  private exportInfo_path = ApiUrl.fs_export_mst_path;
  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private snackbar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.form1 = this.fb.group({
      userName: ['', [Validators.maxLength(40)]],
      siteInCharge: ['']
    });
    this.getInitType();
    this.searchTerm$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(event => {
        this.dynamicUser = this.getUserInCharge.filter((item: { 'userId': string, 'userName': string }) => {
          // console.log(item.userName);
          return item.userName.includes(event);
        });
        this.getUserInCharge.forEach((item: { 'userId': string, 'userName': string }) => {
          if (item.userId.includes(event) && !(this.dynamicUser.includes(event))) {
            this.dynamicUser.unshift(item);
          }
        });
      });
  }

  getInitType = () => {
    this.getSiteInCharge$ = this.httpService.getRemoteData(this.SiteInCharge_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.httpService.getRemoteData(this.UserInCharge_path)
      .pipe(map((data: CommRootObject) => data.data))
      .subscribe(mapData => {
        this.getUserInCharge = mapData;
      });
  }

  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    ans.unshift('management');
    return ans;
  }

  query = () => {
    // console.log(this.form1);
    this.isLoading = true;
    this.httpService.getRemoteData(this.concatUrl(this.CommSte_path))
      .pipe(map((val: CommRootObject) => {
        if (val.errorCode === '101') {
          this.snackbar.open(val.message, null, {
            duration: 5000
          });
        }
        return val.data;
      }))
      .subscribe((fsCommSteList) => {
        // console.log(fsCommSteList);
        this.dataSource.data = fsCommSteList;
        this.resultsLength = fsCommSteList.length;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
        error => {
          // console.log(error);
          this.dataSource.data = [];
          this.resultsLength = 0;
          if (error.errorCode === '937') {
            this.snackbar.open(error.message, null, {
              duration: 5000
            });
          }
          if (error.errorCode === '918') {
            this.snackbar.open(error.message, null, {
              duration: 5000
            });
          }
          this.isLoading = false;
        });
  }

  getValue = (column) => {
    return this.form1.get(column).value;
  }

  concatUrl = (path) => {
    let uri = path.concat('?');
    if (this.getValue('userName') === undefined || this.getValue('userName') === null) {
      uri = uri.concat(`userName=&`);
    } else {
      uri = uri.concat(`userName=${this.getValue('userName')}&`);
    }
    if (this.getValue('siteInCharge') === undefined || this.getValue('siteInCharge') === null) {
      uri = uri.concat(`siteInCharge=&`);
    } else {
      uri = uri.concat(`siteInCharge=${this.getValue('siteInCharge')}&`);
    }
    return decodeURIComponent(uri);
  }

  closeDropdown() {
    // console.log(this.form1.get('userName').value);
    this.focused = false;
    let existence = false;
    for (const item of this.getUserInCharge) {
      if (item.userName !== this.form1.get('userName').value) {
        existence = false;
      } else {
        existence = true;
        break;
      }
    }
    if (!existence) {
      this.form1.patchValue({ 'userName': '' });
    }
  }

  selectUserInCharge = (item) => {
    this.form1.patchValue({ 'userName': item.userName });
  }

  openDropdown() {
    this.focused = true;
  }

  reset() {
    this.form1.reset();
  }

  async onSubmit() {
    this.isLoading = true;
    this.httpService.getRemoteBlobByPost(this.concatUrl(this.exportInfo_path), {}, '管家明細');
    await this.delay(5000);
    this.isLoading = false;
  }

  async delay(time: number): Promise<void> {
    return new Promise<void>((res, rej) => {
      setTimeout(res, time);
    });
  }

  // 更新
  update(stock) {
    this.dialog.open(
      FdsCommunityStewardComponent, {
      data: stock, height: '150%'
    }).afterClosed().subscribe(() => {
      // console.log('over');
      this.query();
    });

  }
}
