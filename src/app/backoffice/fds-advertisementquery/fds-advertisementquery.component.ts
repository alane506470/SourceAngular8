import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { MatPaginator, MatSort, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import * as Rx from 'rxjs';
import { Observable } from 'rxjs';

import { AppCutList, RootObject, AppActMstList, AppCodeList, CommRootObject } from '../../api-result/api-result.interface';
import { ApiUrl } from '../../../environments/api-url';
import { HttpServiceService } from '../../http-service/http-service.service';

import { PreviewComponent } from '../fds-advertisementquery/preview/preview.component';
import { FdsAdvertisementaddComponent } from '../fds-advertisementadd/fds-advertisementadd.component';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import { zip  } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'fury-fds-advertisementquery',
  templateUrl: './fds-advertisementquery.component.html',
  styleUrls: ['./fds-advertisementquery.component.scss']
})
export class FdsAdvertisementqueryComponent implements OnInit {
  isLoading: boolean;
  pageSize = 0;
  currentPageNumber = 0;
  resultsLength: number;
  form1: FormGroup;
  cutTypeList: AppCutList[] = [];
  getActStatus: AppCodeList[] = [];
  communityList: any[] = [];
  dataSource = new MatTableDataSource<any>();
  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';
  dbDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  private appCut_path = ApiUrl.appAdv_getCut_path;
  private appAdvs_path = ApiUrl.appAdvs_path;
  private appActStatus_path = ApiUrl.appAdv_act_status_path;
  private getComm_path = ApiUrl.appQueryAllComm_path;
  private getcutType$: Observable<any>;
  private getActStatus$: Observable<any>;
  private getComm$: Observable<any>;

  @Input()
  columns: ListColumn[] = [
    { name: '活動編號', property: 'actId', visible: false, isModelProperty: true },
    { name: '廣告活動名稱', property: 'actDesc', visible: true, isModelProperty: true },
    { name: 'APP版位 ', property: 'cutId', visible: false, isModelProperty: true },
    { name: '生效起日', property: 'startDate', visible: true, isModelProperty: true },
    { name: '生效迄日', property: 'endDate', visible: true, isModelProperty: true },
    { name: '活動狀態', property: 'actStatus_TW', visible: true, isModelProperty: true },
    { name: '活動狀態代碼', property: 'actStatus', visible: false, isModelProperty: true },
    { name: '建立日期', property: 'createDate', visible: false, isModelProperty: true },
    { name: '建立者  ', property: 'creator', visible: false, isModelProperty: true },
    { name: '修改日期', property: 'modifyDate', visible: false, isModelProperty: true },
    { name: '修改者  ', property: 'modifier', visible: false, isModelProperty: true }
  ] as ListColumn[];

  constructor(private dialog: MatDialog,
    private httpService: HttpServiceService,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    // 創建表單
    this.createForm();
    // 獲取app版位,廣告狀態
    this.getInitAdvValue();
    // 獲取所有社區
    this.getInitAllComm();
    // 分頁切換時，重新取得資料
    this.paginator.page.subscribe((page: PageEvent) => {
      console.info('page', page);
      this.currentPageNumber = page.pageIndex;
      this.getAdvStock(false, page.pageIndex + 1);
    });
  }

  // 顯示表格
  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    ans.unshift('management');
    return ans;
  }

  // 獲取所有社區
  getInitAllComm() {
    this.isLoading = true;
    this.getComm$ = this.httpService.postData(this.getComm_path, '');

    zip(this.getComm$).subscribe((data) => {
      this.communityList = data[0].data;
      this.isLoading = false;
    },
    error => {
      console.info('fds-repairquery getInit error', error);
      this.isLoading = false;
    });
  }

  createForm() {
    this.form1 = new FormGroup({
      'commId': new FormControl(''),
      'cutId': new FormControl('', [
        Validators.required
      ]),
      'actDesc': new FormControl('', [
        Validators.required
      ]),
      'actStartDate': new FormControl(moment(new Date()).add(-15, 'days').format('YYYY-MM-DD')),
      'actEndDate': new FormControl(moment(new Date()).add(15, 'days').format('YYYY-MM-DD')),
      'actStatus': new FormControl('')
    });
  }

  // 獲取app版位,廣告狀態
  private getInitAdvValue() {
    this.getcutType$ = this.httpService.getRemoteData(this.appCut_path);
    this.getActStatus$ = this.httpService.postData(this.appActStatus_path, '');


    zip( this.getActStatus$).subscribe((data) => {
      console.info('data subscribe:', data);
      const rootObject: CommRootObject[] = data;
      this.getActStatus = rootObject[0].data;
    });


    zip(this.getcutType$).subscribe((data) => {
      console.info('data subscribe:', data);
      const appCodeObject: RootObject[] = data;
      this.cutTypeList = appCodeObject[0].data.list;
    });
  }

  // 整合表單參數
  mergeUrlvariable(variable): string {
    const temp_stock: AppAdvQueryCond = variable;
    const arr = [];
    let param = '';
    for (const i in temp_stock) {
      if (temp_stock[i] !== '') {
        arr.push('&');
        arr.push(i);
        arr.push('=');
        arr.push(temp_stock[i]);
      }
    }
    param = arr.join('').replace(/&$/, '');
    return param;
  }

  // 預覽照片
  previewAct(stock: AppActMstList) {
    // console.log(stock);
    if (stock.actdtl.length) {
      if (stock.actdtl[0].actType === 'B') {
        console.log('step');
        this.dialog.open(PreviewComponent, {
          data: {
            allImg: stock.actdtl,
            type: '1'
          }
        });
      } else {
        if (stock.actdtl[0].lastLev === 'N') {
          console.info('step2');
          this.dialog.open(PreviewComponent, {
            data: {
              img: stock.actdtl[0].actSjpgSch,
              allImg: stock.actdtl,
              type: '3'
            }
          });
        } else {
          console.log('step3');
            this.dialog.open(PreviewComponent, {
              data: {
                img: stock.actdtl[0].actSjpgSch,
                type: '2'
              }
            });
        }
      }
    } else {
      this.snackbar.open('沒有廣告細項', '我知道了');
    }
  }

  // 查詢廣告
  getAdvStock(gotoFirstPage = true, pageIndex = 0) {
    if (!this.form1.get('cutId').valid || !this.form1.get('actDesc').valid || !this.form1.get('commId').valid) {
      this.snackbar.open('請輸入查詢條件', '我知道了');
    } else {
      this.isLoading = true;
      const temp: AppAdvQueryCond = this.form1.value;
      temp.actStartDate = moment(new Date(temp.actStartDate)).format(this.dbDateFormat);
      temp.actEndDate = moment(new Date(temp.actEndDate)).format(this.dbDateFormat);
      // console.log(temp);

      if (temp.actStartDate >= temp.actEndDate) {
        this.snackbar.open('開始時間不能在結束時間之後' , '我知道了');
        this.isLoading = false;
      } else {
      const v_param = this.mergeUrlvariable(temp);
      console.log(`${this.appAdvs_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}` + v_param);
      this.httpService.getRemoteData(`${this.appAdvs_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}` + v_param)
      .pipe(map((rootObject: RootObject) => {
        console.info(rootObject);

        if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
          this.snackbar.open('查無資料', null, {
            duration: 5000
          });
          this.dataSource.data = [];
          this.form1.reset();
          this.isLoading = false;
        } else {
          this.resultsLength = rootObject.data.total;
          const stockList: AppActMstList[] = rootObject.data.list;
          stockList.forEach(stock => {
            stock.createDate = moment(new Date(stock.createDate)).format(this.eventDateFormat);
            stock.startDate = moment(new Date(stock.startDate)).format(this.eventDateFormat);
            stock.endDate = moment(new Date(stock.endDate)).format(this.eventDateFormat);
            stock.modifyDate = moment(new Date(stock.modifyDate)).format(this.eventDateFormat);
            for (const i in this.getActStatus) {
              if (stock.actStatus === this.getActStatus[i].codeNo) {
                stock.actStatus_TW = this.getActStatus[i].codeExplain;
              }
            }
          });
          return stockList;
        }
      })).subscribe((stockList: AppActMstList[]) => {
        console.info('MsgStock data:', stockList);
        this.dataSource.data = stockList;

        if (gotoFirstPage) {
          this.paginator.firstPage();
          this.currentPageNumber = 0;
        }
        this.isLoading = false;
      },
      error => {
        console.error(error);
        this.isLoading = false;
      }
      );
     }
    }
  }

  // 修改廣告
  updateAdv(stock) {
    // console.info(stock);
    this.dialog.open(FdsAdvertisementaddComponent, {
      data: stock, height: '150%'
    }).afterClosed().subscribe((temp_stock) => {
      if (temp_stock) {
        this.getAdvStock(false, this.currentPageNumber);
      }
    });
  }

}

interface AppAdvQueryCond {
  actDesc: any;
  cutId: any;
  commId: any;
  actStartDate?: any;
  actEndDate?: any;
  actStatus?: any;
}
