
import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';


import { HttpServiceService } from '../../../../app/http-service/http-service.service';
import { ApiUrl } from '../../../../environments/api-url';
import { environment } from '../../../../environments/environment';
import { CommRootObject } from '../../../../app/api-result/api-result.interface';
import { ListColumn } from '../../../../@fury/shared/list/list-column.model';
import { map } from 'rxjs/operators';
@Component({
  selector: 'fury-commadd',
  templateUrl: './commadd.component.html',
  styleUrls: ['./commadd.component.scss']
})
export class CommaddComponent implements OnInit {

  @Input()
  columns: ListColumn[] = [
    { name: '地址帳號', property: 'houseId', visible: false, isModelProperty: true },
    { name: '地址', property: 'address', visible: true, isModelProperty: true },
    { name: '棟', property: 'road', visible: false, isModelProperty: true },
    { name: '號', property: 'houseNum', visible: false, isModelProperty: true },
    { name: '樓', property: 'floor', visible: false, isModelProperty: true },
    { name: '會員名稱', property: 'name', visible: true, isModelProperty: true },
    { name: '手機', property: 'mobile', visible: true, isModelProperty: true },
    { name: '會員帳號', property: 'memberId', visible: true, isModelProperty: true },
    { name: '是否開通', property: 'isEnable', visible: true, isModelProperty: true }
  ] as ListColumn[];

  @Input()
  columns1: ListColumn[] = [
    { name: '管理員帳號', property: 'adminId', visible: true, isModelProperty: true },
    { name: '管理員姓名', property: 'name', visible: true, isModelProperty: true },
    { name: '是否啟用', property: 'isEnable', visible: true, isModelProperty: true }
  ] as ListColumn[];

  commId: any;
  isLoading: boolean;
  resultsLength: number;
  ManageResultsLength: number;
  dataSource = new MatTableDataSource<any>();
  ManagerdataSource = new MatTableDataSource<any>();
  @ViewChild('memberpaginator', {static: false}) paginator: MatPaginator;
  @ViewChild('managerpaginator', {static: false}) Managepaginator: MatPaginator;

  private API_HOST = environment.ApiHost;
  private appMemberInfo_path = ApiUrl.appMemberInfo_path;
  private appManagerInfo_path = ApiUrl.appManagerInfo_path;
  private appExportMember_path = ApiUrl.appExportMember_path;
  private appExportManager_path = ApiUrl.appExportManager_path;

  constructor( private httpService: HttpServiceService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    // console.info(this.data);
    this.commId = this.data.data.commId;
    this.insertMemberValue();
    this.insertManagerValue();
  }

  // 獲取住戶資料
  insertMemberValue() {
    this.isLoading = true;
    const temp: AppMemberQuery = {commId: this.data.data.commId};
    this.httpService.postData(this.appMemberInfo_path, temp)
    .pipe(map((rootObject: CommRootObject) => {
      console.log(rootObject);
      const stockList: AppMemberList1[] = [];
      if (rootObject.status === 'ERROR' && rootObject.data === null) {
        this.snackbar.open('查無會員資料資料', null, {
          duration: 5000
        });
        this.resultsLength = 0;
        return stockList;
      } else {
      let a = 0;
        for (const i in rootObject.data) {
          if (rootObject.data[i].memList.length !== 0) {
            // console.info(rootObject.data);
            for (const j in rootObject.data[i].memList) {
              if ( !(rootObject.data[i].memList === [])) {
              // console.info(rootObject.data[i].memList[j]);
              stockList.push(rootObject.data[i].memList[j]);
              stockList[a++].address = rootObject.data[i].address;
              }
            }
          } else {
            ++a;
            stockList.push(rootObject.data[i]);
          }
        }
        return stockList;
      }
    }))
    .subscribe((stockList: AppMemberList1[]) => {
      // console.info(stockList);
      this.resultsLength = stockList.length;
      console.info( this.resultsLength);
      this.dataSource.data = stockList;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    },
    error => {
      console.error(error);
      this.isLoading = false;
    });
  }

  // 獲取管理員資料
  insertManagerValue() {
    this.isLoading = true;
    const temp: AppMemberQuery = {commId: this.data.data.commId};
    this.httpService.postData(this.appManagerInfo_path, temp)
    .pipe(map((ManagerrootObject1: CommRootObject) => {
       console.log(ManagerrootObject1);

      if (ManagerrootObject1.status === 'ERROR' && ManagerrootObject1.data === null) {
        this.snackbar.open('查無管理員資料', null, {
          duration: 5000
        });
        const ManagerStockList = [];
        this.ManageResultsLength = 0;
        return ManagerStockList;
      } else {
          const ManagerStockList = ManagerrootObject1.data;
          this.ManageResultsLength =  ManagerrootObject1.data.length;
          return ManagerStockList;
      }
    }))
    .subscribe((ManagerStockList) => {
      // console.info(ManagerStockList);
      this.ManagerdataSource.paginator = this.Managepaginator;
      this.ManagerdataSource.data = ManagerStockList;
      this.isLoading = false;
    },
    error => {
      console.error(error);
      this.isLoading = false;
    });
  }

  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    return ans;
  }

  get visibleColumns1() {
    const ans = this.columns1
      .filter(column1 => column1.visible)
      .map(column1 => column1.property);
    return ans;
  }

  async onSubmit() {
    this.isLoading = true;
    const temp: AppMemberQuery = {commId: this.data.data.commId};
    // console.info(temp);
    this.httpService.getRemoteBlobByPost(this.appExportMember_path, temp, '社區住戶');
    await this.delay(5000);
    this.isLoading = false;
  }

  async onSubmit2() {
    this.isLoading = true;
    const temp: AppMemberQuery = {commId: this.data.data.commId};
    // console.info(temp);
    this.httpService.getRemoteBlobByPost(this.appExportManager_path, temp, '社區管理員');
    await this.delay(5000);
    this.isLoading = false;
  }

  async delay(time: number): Promise<void> {
    return new Promise<void>( (res, rej) => {
      setTimeout(res, time);
    });
  }
}


interface AppMemberQuery {
  commId?: any;
}

interface AppMemberList1 {
  houseId?: any;
  address?: any;
  road?: any;
  houseName?: any;
  floor?: any;
  name?: any;
  mobile?: any;
  memberId?: any;
  isEnable?: any;
}
