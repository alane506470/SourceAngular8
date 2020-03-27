import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ApiUrl } from 'environments/api-url';
import { CommRootObject, FsCommMst } from 'app/api-result/api-result.interface';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { MatTableDataSource, MatDialog, MatSnackBar, MatPaginator } from '@angular/material';
import { ListColumn } from '@fury/shared/list/list-column.model';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { FdsCommunityProfileComponent } from '../fds-community-profile/fds-community-profile.component';

@Component({
  selector: 'fds-community-profile-query',
  templateUrl: './fds-community-profile-query.component.html',
  styleUrls: ['./fds-community-profile-query.component.scss']
})
export class FdsCommunityProfileQueryComponent implements OnInit {

  form1: FormGroup;
  searchTerm$ = new Subject<string>();
  isLoading = false;
  input: string;
  resultsLength: number;
  getCountyId: any[] = [];
  getTownshipId: any[] = [];
  orignTownship: any[] = [];
  dynamicUser: any[] = [];
  getUserInCharge: any[] = [];
  getSiteInCharge: any[] = [];
  getSiteInCharge$: Observable<any>;
  private County_path = ApiUrl.appCounty_path;
  private SiteInCharge_path = ApiUrl.fs_site_in_charge_path;
  private UserInCharge_path = ApiUrl.fs_user_in_charge_path;
  private QueryCommMst_path = ApiUrl.fs_query_comm_mst_path;
  focused: boolean;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  columns: ListColumn[] = [
    { name: '', property: 'commId', visible: false, isModelProperty: true },
    { name: '', property: 'commAdd1', visible: false, isModelProperty: true },
    { name: '', property: 'commAdd2', visible: false, isModelProperty: true },
    { name: '', property: 'siteInCharge', visible: false, isModelProperty: true },
    { name: '', property: 'userInCharge', visible: false, isModelProperty: true },
    { name: '社區名稱', property: 'commName', visible: true, isModelProperty: true },
    { name: '社區縣市', property: 'commAdd1Name', visible: true, isModelProperty: true },
    { name: '社區鄉鎮市', property: 'commAdd2Name', visible: true, isModelProperty: true },
    { name: '負責分店', property: 'siteInChargeName', visible: true, isModelProperty: true },
    { name: '負責社區管家', property: 'userInChargeName', visible: true, isModelProperty: true }
  ] as ListColumn[];
  constructor(private fb: FormBuilder, private httpService: HttpServiceService, public dialog: MatDialog, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.form1 = this.fb.group({
      commName: [, [Validators.maxLength(40)]],
      commAdd1: [, [Validators.required]],
      commAdd2: [],
      siteInCharge: [],
      userInCharge: []
    });

    this.getInitCommunityValue();
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
    // console.log(this.form1.value);
  }

  getInitType = () => {
    this.getSiteInCharge$ = this.httpService.getRemoteData(this.SiteInCharge_path)
      .pipe(map((data: CommRootObject) => {
        this.getSiteInCharge = data.data;
        return data.data;
      }));

    this.httpService.getRemoteData(this.UserInCharge_path)
      .pipe(map((data: CommRootObject) => data.data))
      .subscribe(mapData => {
        this.getUserInCharge = mapData;
      });

  }

  // 變化鄉鎮
  changeTownshipId($eventValue: string) {
    // tslint:disable-next-line: radix
    const county = parseInt($eventValue) - 1;
    this.getTownshipId = this.getCountyId[county].areaList;
  }

  // 獲取縣市鄉鎮
  getInitCommunityValue() {
    this.httpService.getRemoteData(this.County_path)
      .subscribe((data: FsAddress) => {
        if (data.data) {
          // console.log(data.data);
          this.getCountyId = data.data;
          for (const i in this.getCountyId) {
            if (!(this.getCountyId === [])) {
              for (const j in data.data[i].areaList) {
                if (!(data.data[i].areaList === [])) {
                  // console.log(data.data[i].areaList[j]);
                  this.getTownshipId.push(data.data[i].areaList[j]);
                  this.orignTownship.push(data.data[i].areaList[j]);
                }
              }
            }
          }
        }

      },
        error => {
          console.log('communityadd getInitCommunityValue error', error);
        });
  }

  sendForm = () => {
    // console.log(this.concatUrl());
    this.isLoading = true;
    this.httpService.getRemoteData(this.concatUrl())
      .pipe(map((val: CommRootObject) => {
        if (val.errorCode === '999') {
          this.snackbar.open(val.message, null, {
            duration: 5000
          });
        }
        if (val.errorCode === '914') {
          this.snackbar.open(val.message, null, {
            duration: 5000
          });
        }
        if (val.errorCode === '101') {
          this.snackbar.open(val.message, null, {
            duration: 5000
          });
        }
        return val.data;
      }))
      .subscribe((fsCommMstList: FsCommMst[]) => {
        if (fsCommMstList) {
          // console.log(fsCommMstList);
          for (const fsComm of fsCommMstList) {
            const tempCommAdd1 = this.getCountyId.find((item, index, array) => {
              return item.code === fsComm.commAdd1;
            });
            const tempCommAdd2 = this.orignTownship.find((item, index, array) => {
              return item.code === fsComm.commAdd2;
            });
            const tempSiteInCharge = this.getSiteInCharge.find((item, index, array) => {
              return item.code === fsComm.siteInCharge;
            });
             const tempUserInCharge = this.getUserInCharge.find((item, index, array) => {
              return item.userId === fsComm.userInCharge;
            });
            if (tempCommAdd1) {
              fsComm.commAdd1Name = tempCommAdd1.name;
            }
            if (tempCommAdd2) {
              fsComm.commAdd2Name = tempCommAdd2.name;
            }
            if (tempSiteInCharge) {
              fsComm.siteInChargeName = tempSiteInCharge.name;
            }
            if (tempUserInCharge) {
              fsComm.userInChargeName = tempUserInCharge.userId;
            }
          }
          this.dataSource.data = fsCommMstList;
          this.resultsLength = fsCommMstList.length;
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource.data = [];
          this.resultsLength = 0;
          this.dataSource.paginator = this.paginator;
        }

        this.isLoading = false;
      },
      error => {
        this.snackbar.open(error.message, null, {
          duration: 5000
        });
        this.isLoading = false;
      });
      this.form1.markAllAsTouched();
  }

    // 更新
    update(stock) {
      this.dialog.open(
        FdsCommunityProfileComponent, {
        data: stock, height: '150%'
      }).afterClosed().subscribe(() => {
        console.log('over');
          this.sendForm();
      });
    }

  reset = () => {
    this.form1.reset();
  }

  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    ans.unshift('management');
    return ans;
  }

  openDropdown() {
    this.focused = true;
  }

  closeDropdown() {
    this.focused = false;
    let existence = false;
    for (const item of this.getUserInCharge) {
      if (item.userId !== this.form1.get('userInCharge').value) {
        existence = false;
      } else {
        existence = true;
        break;
      }
    }
    if (!existence) {
      this.form1.patchValue({ 'userInCharge': null });
    }
  }

  selectUserInCharge = (item) => {
    this.form1.patchValue({ 'userInCharge': item.userId });
  }

  getValue = (column) => {
    return this.form1.get(column).value;
  }

  concatUrl = () => {
    console.log(this.form1.value);
    console.log(this.getValue('commName') !== null);
    let uri = this.QueryCommMst_path.concat('?');
    if (this.getValue('commName') !== null) {
      uri = uri.concat(`commName=${this.getValue('commName')}&`);
    }
    if (this.getValue('commAdd1') !== null) {
      uri = uri.concat(`commAdd1=${this.getValue('commAdd1')}&`);
    }
    if (this.getValue('commAdd2') !== null) {
      uri = uri.concat(`commAdd2=${this.getValue('commAdd2')}&`);
    }
    if (this.getValue('userInCharge') !== null && this.getValue('userInCharge') !== undefined) {
      uri = uri.concat(`userInCharge=${this.getValue('userInCharge')}&`);
    }
    if (this.getValue('siteInCharge') !== null) {
      uri = uri.concat(`siteInCharge=${this.getValue('siteInCharge')}&`);
    }
    console.log(uri);
    return uri;
  }

  //   updateCommunity(stock: FdsCommunityList) {
  //     console.info(stock);
  //    if (stock.commAdd1) {
  //      this.dialog.open(PreviewComponent, {
  //        data: {
  //          data: stock,
  //          getCountyId: this.getCountyId,
  //          getTownshipId: this.getTownshipIdForPreview
  //        }, height: '150%'
  //        }).afterClosed().subscribe(() => {
  //          this.getCommunity('updata');
  //        });
  //    }
  //  }
}

interface FsAddress {
  status: string;
  errorCode: string;
  message: string;
  data: Array<any>;
}
