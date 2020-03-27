import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiUrl } from 'environments/api-url';
import { AppCodeList, RootObject, AppBonusMstList } from 'app/api-result/api-result.interface';
import { Observable, zip } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { HttpServiceService } from 'app/http-service/http-service.service';
import * as Rx from 'rxjs';
import * as moment from 'moment';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { ListColumn } from '@fury/shared/list/list-column.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fury-bonus-mgt',
  templateUrl: './bonus-mgt.component.html',
  styleUrls: ['./bonus-mgt.component.scss']
})
export class BonusMgtComponent implements OnInit {

  isLoading: boolean;
  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';

  @Input()
  columns: ListColumn[] = [
    { name: '紅利點數活動代碼', property: 'marketId', visible: true, isModelProperty: true },
    { name: '紅利點數活動名稱', property: 'name', visible: true, isModelProperty: true },
    { name: '活動文案', property: 'bsDesc', visible: false, isModelProperty: true },
    { name: '活動圖檔', property: 'bsJpg', visible: false, isModelProperty: true },
    { name: '贈送點數', property: 'bonus', visible: false, isModelProperty: true },
    { name: '活動url連結', property: 'bsLink', visible: false, isModelProperty: true },
    { name: '活動狀態代碼', property: 'bsStatus', visible: false, isModelProperty: true },
    { name: '適用通路代碼', property: 'channelId', visible: false, isModelProperty: true },
    { name: '適用通路', property: 'channelId_TW', visible: true, isModelProperty: true },
    { name: '適用會員', property: 'applyMem_TW', visible: true, isModelProperty: true },
    { name: '適用會員代碼', property: 'applyMem', visible: false, isModelProperty: true },
    { name: '是否發送訊息', property: 'msgYn', visible: false, isModelProperty: true },
    { name: '訊息主檔', property: 'msgId', visible: false, isModelProperty: true },
    { name: '點數活動類別', property: 'bsType', visible: false, isModelProperty: true },
    { name: '點數活動條件', property: 'bsCond', visible: false, isModelProperty: true },
    { name: '建立日期', property: 'createDate', visible: false, isModelProperty: true },
    { name: '建立者', property: 'creator', visible: false, isModelProperty: true },
    { name: '修改日期', property: 'modifyDate', visible: false, isModelProperty: true },
    { name: '修改者', property: 'modifier', visible: false, isModelProperty: true },
    { name: '生效日期', property: 'startDate', visible: true, isModelProperty: true },
    { name: '結束日期', property: 'endDate', visible: true, isModelProperty: true },
    { name: '活動狀態', property: 'bsStatus_TW', visible: true, isModelProperty: true }
  ] as ListColumn[];
  form1: FormGroup;
  pageSize = 10;
  resultsLength: number;
  currentPageNumber = 0;
  private appCodes_path = ApiUrl.appCodes_path;
  private appBonuss_path = ApiUrl.appBonuss_path;
  ApplyMemList: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  getFormStatus: AppCodeList[] = [];
  private getApplyMem$: Observable<any>;
  private getChannelId$: Observable<any>;
  private getFormStatus$: Observable<any>;
  // dataSource
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    ans.unshift('management');
    return ans;
  }

  constructor(private dialog: MatDialog, private httpService: HttpServiceService, private snackbar: MatSnackBar) {
    this.form1 = new FormGroup({
      'marketId': new FormControl(''),
      'name': new FormControl(''),
      'channelId': new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadInitData();
    this.paginator.page.subscribe((page: PageEvent) => {
      // this.getIssues(page.pageIndex, page.pageSize);
      console.log('page', page);
      this.currentPageNumber = page.pageIndex;
      this.getBonusStock(false, page.pageIndex + 1);
    });
  }

  loadInitData() {
    this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
    this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));
    this.getFormStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=bs_status`));

    zip(this.getApplyMem$, this.getChannelId$, this.getFormStatus$).subscribe((data) => {
      // console.info('data subscribe:', data);
      const grnoTypeObject: RootObject[] = data;
      this.ApplyMemList = grnoTypeObject[0].data.list;
      this.getChannelId = grnoTypeObject[1].data.list;
      this.getFormStatus = grnoTypeObject[2].data.list;
      this.isLoading = false;
    });
  }

  getBonusStock(gotoFirstPage = true, pageIndex = 0) {

    if ((this.form1.get('marketId').value === '') && (this.form1.get('name').value === '')) {
      this.snackbar.open('至少輸入一項查詢條件', '我知道了');
    } else {
      this.isLoading = true;
      const temp: AppBonusMstList = this.form1.value;
      temp.marketId = temp.marketId.trim();
      temp.name = temp.name.trim();
      const v_param = this.mergeUrlvariable(temp);
      this.httpService.getRemoteData(`${this.appBonuss_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}` + v_param)
        .pipe(map((rootObject: RootObject) => {
          if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
            this.snackbar.open('查無資料', null, {
              duration: 5000
            });
          }
          console.log('query', rootObject);
          this.resultsLength = rootObject.data.total;
          const stockList: AppBonusMstList[] = rootObject.data.list;
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
              if (stock.bsStatus === this.getFormStatus[i].codeNo) {
                stock.bsStatus_TW = this.getFormStatus[i].codeExplain;
              }
            }
          });
          return stockList;
        }))
        .subscribe(
          (stockList: AppBonusMstList[]) => {
            console.log('BonusStock data:', stockList);
            this.dataSource.data = stockList;
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

  mergeUrlvariable(variable): string {
    const temp_stock: AppBonusMstList = variable;
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

  sendAct(stock) {
    console.log(stock);
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要發佈嗎？(折價券活動代碼${stock.marketId})`,
        type: '1'
      }
    });

    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      this.httpService.putData(`${ApiUrl.appBonus_path}/${stock.marketId}`, {})
        .subscribe((result: RootObject) => {
          console.log(result);
          if (result.status === 'SUCCESS') {
            const tempSnack = this.snackbar.open(`紅利點數活動代碼:${stock.marketId}發佈成功`, null, {
              duration: 3000
            });
            tempSnack.afterDismissed().subscribe(() => {
              this.getBonusStock();
              this.isLoading = false;
            });
          } else {
            this.snackbar.open(`紅利點數活動代碼:${stock.marketId}發佈失敗`, null, {
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
