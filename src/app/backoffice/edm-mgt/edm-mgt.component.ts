import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiUrl } from 'environments/api-url';
import { AppCodeList, RootObject, AppCouponMstList } from 'app/api-result/api-result.interface';
import { Observable } from 'rxjs/internal/Observable';
import { MatPaginator, MatTableDataSource, MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { HttpServiceService } from 'app/http-service/http-service.service';
import * as Rx from 'rxjs';
import * as moment from 'moment';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { ListColumn } from '@fury/shared/list/list-column.model';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fury-edm-mgt',
  templateUrl: './edm-mgt.component.html',
  styleUrls: ['./edm-mgt.component.scss']
})
export class EdmMgtComponent implements OnInit {

  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';

  @Input()
  columns: ListColumn[] = [
    { name: '折價券活動代碼', property: 'grno', visible: true, isModelProperty: true },
    { name: '折價券活動名稱', property: 'name', visible: true, isModelProperty: true },
    { name: '適用通路代碼', property: 'channelId', visible: false, isModelProperty: true },
    { name: '適用通路', property: 'channelId_TW', visible: true, isModelProperty: true },
    { name: '活動狀態代碼', property: 'grStatus', visible: false, isModelProperty: true },
    { name: '折價券面額', property: 'grAmount', visible: true, isModelProperty: true },
    { name: '折價券類別', property: 'giftType', visible: false, isModelProperty: true },
    { name: '適用會員', property: 'applyMem_TW', visible: true, isModelProperty: true },
    { name: '生效日', property: 'startDate', visible: true, isModelProperty: true },
    { name: '結束日', property: 'endDate', visible: true, isModelProperty: true },
    { name: '折價券文案', property: 'grDesc', visible: false, isModelProperty: true },
    { name: '活動文案圖檔', property: 'grJpg', visible: false, isModelProperty: true },
    { name: '折價券URL連結', property: 'grLink', visible: false, isModelProperty: true },
    { name: '折價券使用說明', property: 'grUsage', visible: false, isModelProperty: true },
    { name: '適用會員代碼', property: 'applyMem', visible: false, isModelProperty: true },
    { name: '是否發送訊息', property: 'msgYn', visible: false, isModelProperty: true },
    { name: '訊息主檔', property: 'msgId', visible: false, isModelProperty: true },
    { name: '建立日期', property: 'createDate', visible: false, isModelProperty: true },
    { name: '建立者', property: 'creator', visible: false, isModelProperty: true },
    { name: '修改日期', property: 'modifyDate', visible: false, isModelProperty: true },
    { name: '修改者', property: 'modifier', visible: false, isModelProperty: true },
    { name: '活動狀態', property: 'grStatus_TW', visible: true, isModelProperty: true }
  ] as ListColumn[];

  isLoading = false;
  form1: FormGroup;
  pageSize = 10;
  resultsLength: number;
  currentPageNumber = 0;
  private appCode_path = ApiUrl.appCodes_path;
  private appCoupons_path = ApiUrl.appCoupons_path;
  ApplyMemList: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  getFormStatus: AppCodeList[] = [];
  private getApplyMem$: Observable<any>;
  private getChannelId$: Observable<any>;
  private getFormStatus$: Observable<any>;
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(private dialog: MatDialog,
    private httpService: HttpServiceService,
    private snackbar: MatSnackBar) {
    this.form1 = new FormGroup({
      'grno': new FormControl(''),
      'name': new FormControl(''),
      'channelId': new FormControl('', [Validators.required])
    });
  }

  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    ans.unshift('management');
    return ans;
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadInitData();
    this.paginator.page.subscribe((page: PageEvent) => {
      // this.getIssues(page.pageIndex, page.pageSize);
      console.log('page', page);
      this.currentPageNumber = page.pageIndex;
      this.getGiftStock(false, page.pageIndex + 1);
    });
  }

  loadInitData() {
    this.getApplyMem$ = this.httpService.getRemoteData(this.appCode_path.concat('?codeClass=apply_mem'));
    this.getChannelId$ = this.httpService.getRemoteData(this.appCode_path.concat(`?codeClass=channel_id`));
    this.getFormStatus$ = this.httpService.getRemoteData(this.appCode_path.concat(`?codeClass=gr_status`));

    zip(this.getApplyMem$, this.getChannelId$, this.getFormStatus$).subscribe((data) => {
      // console.info('data subscribe:', data);
      const grnoTypeObject: RootObject[] = data;
      this.ApplyMemList = grnoTypeObject[0].data.list;
      this.getChannelId = grnoTypeObject[1].data.list;
      this.getFormStatus = grnoTypeObject[2].data.list;
      this.isLoading = false;
    });
  }

  mergeUrlvariable(variable): string {
    const temp_stock: AppCouponMstList = variable;
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
    // console.info('hank arr=', arr);
    param = arr.join('').replace(/&$/, '');
    return param;
  }

  getGiftStock(gotoFirstPage = true, pageIndex = 0) {

    if ((this.form1.get('grno').value === '') && (this.form1.get('name').value === '')) {
      this.snackbar.open('至少輸入一項查詢條件', '我知道了');
    } else {
      this.isLoading = true;
      const temp_gron: AppCouponMstList = this.form1.value;
      temp_gron.grno = temp_gron.grno.trim();
      temp_gron.name = temp_gron.name.trim();
      const v_param = this.mergeUrlvariable(temp_gron);
      // console.info('v_param=',v_param);
      this.httpService.getRemoteData(`${this.appCoupons_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}` + v_param)
        .pipe(map((rootObject: RootObject) => {
          console.log('rootObject=', rootObject);
          if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
            this.snackbar.open('查無資料', null, {
              duration: 5000
            });
          }
          this.resultsLength = rootObject.data.total;
          const stockList: AppCouponMstList[] = rootObject.data.list;
          stockList.forEach(stock => {
            stock.createDate = moment(new Date(stock.createDate)).format(this.eventDateFormat);
            stock.endDate = moment(new Date(stock.endDate)).format(this.eventDateFormat);
            stock.startDate = moment(new Date(stock.startDate)).format(this.eventDateFormat);
            stock.modifyDate = moment(new Date(stock.modifyDate)).format(this.eventDateFormat);
            for (const i in this.ApplyMemList) {
              if (stock.applyMem === this.ApplyMemList[i].codeNo) {
                stock.applyMem_TW = this.ApplyMemList[i].codeExplain;
              }
            }
            for (const i in this.getChannelId) {
              if (stock.channelId === this.getChannelId[i].codeNo) {
                stock.channelId_TW = this.getChannelId[i].codeExplain;
              }
            }
            for (const i in this.getFormStatus) {
              if (stock.grStatus === this.getFormStatus[i].codeNo) {
                stock.grStatus_TW = this.getFormStatus[i].codeExplain;
              }
            }
          });
          return stockList;
        }))
        .subscribe(
          (stockList: AppCouponMstList[]) => {
            console.log('GiftStock data createDate:', stockList);

            this.dataSource.data = stockList; // new ListDataSource<GiftStock>(this.database, this.sort, null, this.columns);
            this.isLoading = false;
            if (gotoFirstPage) {
              this.paginator.firstPage();
              this.currentPageNumber = 0;
            }
          },
          error => {
            this.isLoading = false;
            this.snackbar.open(`查詢失敗，請重新登入`, null, {
              duration: 2000
            });
            console.error(error);
          }
        );
    }

  }

  sendAct(stock) {
    console.log(stock);
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要發佈嗎？(折價券活動代碼${stock.grno})`,
        type: '1'
      }
    });

    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      this.httpService.putData(`${ApiUrl.appCoupon_path}/${stock.grno}`, {})
        .subscribe((result: RootObject) => {
          console.log(result);
          if (result.status === 'SUCCESS') {
            const tempSnack = this.snackbar.open(`折價券活動代碼:${stock.grno}發佈成功`, null, {
              duration: 3000
            });
            tempSnack.afterDismissed().subscribe(() => {
              this.getGiftStock();
              this.isLoading = false;
            });
          } else {
            this.snackbar.open(`折價券活動代碼:${stock.grno}發佈失敗`, null, {
              duration: 5000
            });
            this.isLoading = false;
          }
        },
          error => {
            console.error(error);
            this.snackbar.open(`連線異常，請重新登入`, null, {
              duration: 5000
            });
            this.isLoading = false;
          });
    });
  }
}


