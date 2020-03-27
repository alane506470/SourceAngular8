import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpServiceService } from '../../http-service/http-service.service';
import * as Rx from 'rxjs';
import { RootObject, AppCodeList, AppPushMstList } from '../../api-result/api-result.interface';
import { MatDialogRef, MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { MatPaginator, MatSort, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { ApiUrl } from '../../../environments/api-url';
import { PushaddComponent } from '../pushadd/pushadd.component';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import { zip  } from 'rxjs';
import { map } from 'rxjs/operators';
interface AppPushQueryCond {
  PushSub: any;
  pushStartDate?: any;
  pushEndDate?: any;
  pushStatus?: any;
}
@Component({
  selector: 'fury-pushquery',
  templateUrl: './pushquery.component.html',
  styleUrls: ['./pushquery.component.scss']
})
export class PushqueryComponent implements OnInit {
  applyMems = [];
  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';
  dbDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  @Input()
  columns: ListColumn[] = [
    { name: '推播主檔編號', property: 'pushId', visible: true, isModelProperty: true },
    { name: '訊息編號', property: 'msgId', visible: true, isModelProperty: true },
    { name: '通路代碼', property: 'channelId', visible: true, isModelProperty: true },
    { name: '折價券代碼', property: 'grno', visible: true, isModelProperty: true },
    { name: '紅利點數代碼 ', property: 'marketId', visible: true, isModelProperty: true },
    { name: 'surId', property: 'surId', visible: false, isModelProperty: true },
    { name: '推播主題', property: 'pushSub', visible: true, isModelProperty: true },
    { name: '推播文字', property: 'pushText', visible: false, isModelProperty: true },
    { name: '發送日期', property: 'pushSendDate', visible: true, isModelProperty: true },
    { name: '結束日期', property: 'pushEndDate', visible: true, isModelProperty: true },
    { name: '發送對象', property: 'applyMem_TW', visible: true, isModelProperty: true },

    { name: '發送對象代碼', property: 'applyMem', visible: false, isModelProperty: true },
    { name: '推播狀態代碼', property: 'pushStatus', visible: false, isModelProperty: true },
    { name: '預計發送時間', property: 'estPushTime', visible: false, isModelProperty: true },
    { name: '建立日期', property: 'createDate', visible: false, isModelProperty: true },
    { name: '建立者', property: 'creator', visible: false, isModelProperty: true },
    { name: '修改日期', property: 'modifyDate', visible: false, isModelProperty: true },
    { name: '修改者', property: 'modifier', visible: false, isModelProperty: true },
    { name: '推播狀態', property: 'pushStatus_TW', visible: true, isModelProperty: true }
  ] as ListColumn[];
  form1: FormGroup;
  pageSize = 10;
  resultsLength: number;
  currentPageNumber = 0;
  private getApplyMem$: Observable<any>;
  private getPushStatus$: Observable<any>;
  private getChannelId$: Observable<any>;
  ApplyMemList: AppCodeList[] = [];
  getPushStatus: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  private appCodes_path = ApiUrl.appCodes_path;
  private appPush_path = ApiUrl.appPushs_path;
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  get visibleColumns() {
    return this.columns
      .filter(column => column.visible)
      .map(column => column.property);
  }


  constructor(private dialog: MatDialog, private httpService: HttpServiceService, private snackbar: MatSnackBar) {
    this.form1 = new FormGroup({
      'channelId': new FormControl('', [Validators.required]),
      'pushSub': new FormControl('', [
        Validators.required
      ]),
      'pushStartDate': new FormControl(moment(new Date()).add(-15, 'days').format('YYYY-MM-DD')),
      'pushEndDate': new FormControl(moment(new Date()).add(15, 'days').format('YYYY-MM-DD')),
      'pushStatus': new FormControl('')
    });
  }

  ngOnInit() {
    this.getInitPushValue();
    this.paginator.page.subscribe((page: PageEvent) => {
      // this.getIssues(page.pageIndex, page.pageSize);
      console.info('page', page);
      this.currentPageNumber = page.pageIndex;
      this.getPushStock(false, page.pageIndex + 1);
    });
  }

  updateCustomer(stock) {
    this.dialog.open(PushaddComponent, {
      data: stock, height: '150%'
    }).afterClosed().subscribe((temp_stock) => {
      console.info('temp_stock', temp_stock);
      if (temp_stock) {
        this.getPushStock(false, this.currentPageNumber);
      }
    });
  }
  mergeUrlvariable(variable): string {
    const temp_stock: AppPushQueryCond = variable;
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
  private getInitPushValue() {
    this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
    this.getPushStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=push_sta'));
    this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));

      zip(this.getApplyMem$, this.getPushStatus$, this.getChannelId$).subscribe((data) => {
        console.info('data subscribe:', data);
        const appCodeObject: RootObject[] = data;
        this.ApplyMemList = appCodeObject[0].data.list;
        this.getPushStatus = appCodeObject[1].data.list;
        this.getChannelId = appCodeObject[2].data.list;
        for (let i = 0; i < this.ApplyMemList.length; i++) {
          this.applyMems.push(this.ApplyMemList[i].codeNo);
        }
      });
  }

  getPushStock(gotoFirstPage = true, pageIndex = 0) {

    if (!this.form1.get('pushSub').valid) {
      this.snackbar.open('請輸入推播主題查詢條件', '我知道了');
    } else {
      const temp: AppPushQueryCond = this.form1.value;
      temp.pushStartDate = moment(new Date(temp.pushStartDate)).format(this.dbDateFormat);
      temp.pushEndDate = moment(new Date(temp.pushEndDate)).format(this.dbDateFormat);
      const v_param = this.mergeUrlvariable(temp);
      this.httpService.getRemoteData(`${this.appPush_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}
      &applyMems=${this.applyMems}` + v_param)
        .pipe(map((rootObject: RootObject) => {
          if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
            this.snackbar.open('查無資料', null, {
              duration: 5000
            });
          }
          console.info('query', rootObject);
          this.resultsLength = rootObject.data.total;
          const stockList: AppPushMstList[] = rootObject.data.list;
          stockList.forEach(stock => {
            stock.createDate = moment(new Date(stock.createDate)).format(this.eventDateFormat);
            stock.pushSendDate = moment(new Date(stock.pushSendDate)).format(this.eventDateFormat);
            stock.pushEndDate = moment(new Date(stock.pushEndDate)).format(this.eventDateFormat);
            stock.modifyDate = moment(new Date(stock.modifyDate)).format(this.eventDateFormat);
            for (const i in this.ApplyMemList) {
              if (stock.applyMem === this.ApplyMemList[i].codeNo) {
                stock.applyMem_TW = this.ApplyMemList[i].codeExplain;
              }
            }
            for (const i in this.getPushStatus) {
              if (stock.pushStatus === this.getPushStatus[i].codeNo) {
                stock.pushStatus_TW = this.getPushStatus[i].codeExplain;
              }
            }
          });
          return stockList;
        }))
        .subscribe(
          (stockList: AppPushMstList[]) => {
            console.info('MsgStock data:', stockList);
            this.dataSource.data = stockList;
            if (gotoFirstPage) {
              this.paginator.firstPage();
              this.currentPageNumber = 0;
            }
          },
          error => {
            console.error(error);
          }
        );
    }

  }
}
