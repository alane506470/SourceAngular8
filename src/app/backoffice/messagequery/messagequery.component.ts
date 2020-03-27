import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpServiceService } from '../../http-service/http-service.service';
import * as Rx from 'rxjs';
import { RootObject, AppCodeList, AppMsgMstList } from '../../api-result/api-result.interface';
// import { AppMsgMstObject, AppMsgMstList } from '../../api-result/app-msg-mst.interface';
import { MatDialogRef, MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { MatPaginator, MatSort, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { MessageaddComponent } from '../messageadd/messageadd.component';
import { ApiUrl } from '../../../environments/api-url';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import { zip  } from 'rxjs';
import { map } from 'rxjs/operators';
interface AppMsgQueryCond {
  msgType: any;
  msgSub: any;
  grno?: any;
  marketId?: any;
  msgStartDate?: any;
  msgEndDate?: any;
  msgStatus?: any;
}
@Component({
  selector: 'fury-messagequery',
  templateUrl: './messagequery.component.html',
  styleUrls: ['./messagequery.component.scss']
})


export class MessagequeryComponent implements OnInit {
  applyMems = []; // 20180704 msg訊息查詢資料要輸入條件applyMems
  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';
  dbDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  @Input()
  columns: ListColumn[] = [
    { name: '訊息代碼', property: 'msgId', visible: true, isModelProperty: true },
    { name: '訊息類別(代碼)', property: 'msgType', visible: false, isModelProperty: true },
    { name: '訊息類別', property: 'msgType_TW', visible: true, isModelProperty: true },
    { name: '折價券活動代碼', property: 'grno', visible: true, isModelProperty: true },
    { name: '紅利點數活動代碼', property: 'marketId', visible: true, isModelProperty: true },
    { name: '訊息狀態', property: 'msgStatus', visible: false, isModelProperty: true },
    { name: '適用會員', property: 'applyMem_TW', visible: false, isModelProperty: true },
    // { name: '是否推播', property: 'pushNoteFlag', visible: false, isModelProperty: true },
    // { name: '推播主題', property: 'pushNoteSub', visible: false, isModelProperty: true },
    // { name: '推播文字', property: 'pushNoteTxt', visible: false, isModelProperty: true },
    { name: '訊息主題', property: 'msgSub', visible: true, isModelProperty: true },
    { name: '訊息文字', property: 'msgTxt', visible: false, isModelProperty: true },
    { name: '訊息圖片', property: 'msgJpg', visible: false, isModelProperty: true },
    { name: '訊息連結_APP', property: 'msgUrlApp', visible: false, isModelProperty: true },
    { name: '訊息連結_網站', property: 'msgUrlWeb', visible: false, isModelProperty: true },
    { name: '發送日期', property: 'msgSendDate', visible: true, isModelProperty: true },
    { name: '結束日期', property: 'msgEndDate', visible: true, isModelProperty: true },
    { name: '發送對象', property: 'applyMem', visible: false, isModelProperty: true },
    { name: '發送筆數', property: 'recCount', visible: false, isModelProperty: true },
    { name: '開啟筆數', property: 'openCount', visible: false, isModelProperty: true },
    // { name: '二推', property: 'secPushFlag', visible: false, isModelProperty: true },
    { name: '建立日期', property: 'createDate', visible: false, isModelProperty: true },
    { name: '建立者', property: 'creator', visible: false, isModelProperty: true },
    { name: '修改日期', property: 'modifyDate', visible: false, isModelProperty: true },
    { name: '修改者', property: 'modifier', visible: false, isModelProperty: true },
    { name: '活動狀態', property: 'msgStatus_TW', visible: true, isModelProperty: true }
  ] as ListColumn[];
  form1: FormGroup;
  pageSize = 10;
  resultsLength: number;
  currentPageNumber = 0;
  private getMsgType$: Observable<any>;
  private getMsgSub$: Observable<any>;
  private getApplyMem$: Observable<any>;
  private getMsgStatus$: Observable<any>;
  private getChannelId$: Observable<any>;
  msgTypeList: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  msgSubList: AppMsgMstList[] = [];
  ApplyMemList: AppCodeList[] = [];
  getMsgStatus: AppCodeList[] = [];
  // private appCodes_path = '/loyalty/employee/appCodes';
  // private appMsg_path = 'loyalty/employee/appMsgMsts';
  private appCodes_path = ApiUrl.appCodes_path;
  private appMsg_path = ApiUrl.appMsgs_path;
  dataSource = new MatTableDataSource<any>();


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  get visibleColumns() {
    return this.columns
      .filter(column => column.visible)
      .map(column => column.property);
  }
  constructor(private dialog: MatDialog, private httpService: HttpServiceService, private snackbar: MatSnackBar) {
    this.form1 = new FormGroup({
      'msgType': new FormControl('', [
        Validators.required
      ]),
      'msgSub': new FormControl(''),
      'channelId': new FormControl('', [Validators.required]),
      'grno': new FormControl(''),
      'marketId': new FormControl(''),
      'msgStartDate': new FormControl(moment(new Date()).add(-15, 'days').format('YYYY-MM-DD')),
      'msgEndDate': new FormControl(moment(new Date()).add(15, 'days').format('YYYY-MM-DD')),
      'msgStatus': new FormControl('')
    });
  }

  ngOnInit() {
    this.getInitMsgValue();
    // 分頁切換時，重新取得資料
    this.paginator.page.subscribe((page: PageEvent) => {
      // this.getIssues(page.pageIndex, page.pageSize);
      console.info('page', page);
      this.currentPageNumber = page.pageIndex;
      this.getMsgStock(false, page.pageIndex + 1);
    });

  }
  updateCustomer(stock) {
    this.dialog.open(MessageaddComponent, {
      data: stock, height: '150%'
    }).afterClosed().subscribe((temp_stock) => {
      console.info('temp_stock', temp_stock);
      if (temp_stock) {
        this.getMsgStock(false, this.currentPageNumber);
      }
    });
  }
  mergeUrlvariable(variable): string {
    const temp_stock: AppMsgQueryCond = variable;
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
  getMsgStock(gotoFirstPage = true, pageIndex = 0) {

    if (!this.form1.get('msgType').valid) {
      this.snackbar.open('請輸入查詢條件', '我知道了');
    } else {
      const temp: AppMsgQueryCond = this.form1.value;
      // temp.msgStartDate = this.form1.get('msgStartDate').valid ? moment(new Date(temp.msgStartDate)).format(this.dbDateFormat) : '';
      temp.msgStartDate = moment(new Date(temp.msgStartDate)).format(this.dbDateFormat);
      temp.msgEndDate = moment(new Date(temp.msgEndDate)).format(this.dbDateFormat);
      // console.info('temp=', temp);
      const v_param = this.mergeUrlvariable(temp);
      // console.info('v_param=', v_param);
      this.httpService.getRemoteData(`${this.appMsg_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}
      &applyMems=${this.applyMems}` + v_param)
        .pipe(map((rootObject: RootObject) => {
          if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
            this.snackbar.open('查無資料', null, {
              duration: 5000
            });
          }
          console.info('query', rootObject);
          this.resultsLength = rootObject.data.total;
          const stockList: AppMsgMstList[] = rootObject.data.list;
          stockList.forEach(stock => {
            stock.createDate = moment(new Date(stock.createDate)).format(this.eventDateFormat);
            stock.msgSendDate = moment(new Date(stock.msgSendDate)).format(this.eventDateFormat);
            stock.msgEndDate = moment(new Date(stock.msgEndDate)).format(this.eventDateFormat);
            stock.modifyDate = moment(new Date(stock.modifyDate)).format(this.eventDateFormat);
            for (const i in this.ApplyMemList) {
              if (stock.applyMem === this.ApplyMemList[i].codeNo) {
                stock.applyMem_TW = this.ApplyMemList[i].codeExplain;
              }
            }
            for (const i in this.msgTypeList) {
              if (stock.msgType === this.msgTypeList[i].codeNo) {
                stock.msgType_TW = this.msgTypeList[i].codeExplain;
              }
            }
            for (const i in this.getMsgStatus) {
              if (stock.msgStatus === this.getMsgStatus[i].codeNo) {
                stock.msgStatus_TW = this.getMsgStatus[i].codeExplain;
              }
            }
          });
          return stockList;
        }))
        .subscribe(
          (stockList: AppMsgMstList[]) => {
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

  // msgTypeClick() {
  //   this.form1.patchValue({'msgSub': null});
  //   // this.form1.patchValue({ 'msgId': this.MsgId });
  //   this.getMsgSub$ = this.httpService.getRemoteData(this.appMsg_path.concat(`?msgType=${this.form1.get('msgType').value}`));
  //   this.getMsgSub$.subscribe((result: RootObject) => {
  //     console.info('getMsgSub subscribe:', result);
  //     this.msgSubList = result.data.list;
  //   },
  //     error => {
  //       console.error(error);
  //     }
  //   );
  // }
  private getInitMsgValue() {
    this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
    this.getMsgType$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=msg_type'));
    this.getMsgStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=msg_status'));
    this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));

      zip(this.getMsgType$, this.getApplyMem$, this.getMsgStatus$, this.getChannelId$).subscribe((data) => {
        console.info('data subscribe:', data);
        const appCodeObject: RootObject[] = data;
        this.msgTypeList = appCodeObject[0].data.list;
        this.ApplyMemList = appCodeObject[1].data.list;
        this.getMsgStatus = appCodeObject[2].data.list;
        this.getChannelId = appCodeObject[3].data.list;
        for (let i = 0; i < this.ApplyMemList.length; i++) {
          this.applyMems.push(this.ApplyMemList[i].codeNo);
        }
      });
  }

}
