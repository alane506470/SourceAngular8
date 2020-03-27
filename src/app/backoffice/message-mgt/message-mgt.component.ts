import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpServiceService } from '../../http-service/http-service.service';
import * as Rx from 'rxjs';
import { RootObject, AppCodeList, AppMsgMstList, AppPushMstList, AppCutList, AppActMstList } from '../../api-result/api-result.interface';
import { MatDialogRef, MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { MatPaginator, MatSort, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { ApiUrl } from '../../../environments/api-url';
import { PreviewComponent } from './preview/preview.component';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import { zip  } from 'rxjs';
import { map } from 'rxjs/operators';
interface AppMsgQueryCond {
  msgType: any;
  msgSub: any;
  msgStartDate?: any;
  msgEndDate?: any;
}
interface AppPushQueryCond {
  PushSub: any;
  pushStartDate?: any;
  pushEndDate?: any;
}
interface AppActQueryCond {
  actDesc: any;
  cutId: any;
  actStartDate?: any;
  actEndDate?: any;
}
@Component({
  selector: 'fury-message-mgt',
  templateUrl: './message-mgt.component.html',
  styleUrls: ['./message-mgt.component.scss']
})
export class MessageMgtComponent implements OnInit {
  isLoading: boolean;
  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';
  dbDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  applyMems = []; // 20180704 msg訊息查詢資料要排除新會員1
  @Input()
  columnsPush: ListColumn[] = [
    { name: '推播主檔編號', property: 'pushId', visible: true, isModelProperty: true },
    { name: '訊息編號', property: 'msgId', visible: false, isModelProperty: true },
    { name: '通路代碼', property: 'channelId', visible: false, isModelProperty: true },
    { name: '折價券活動代碼', property: 'grno', visible: false, isModelProperty: true },
    { name: '紅利點數活動代碼 ', property: 'marketId', visible: false, isModelProperty: true },
    { name: 'surId', property: 'surId', visible: false, isModelProperty: true },
    { name: '推播主題', property: 'pushSub', visible: true, isModelProperty: true },
    { name: '推播文字', property: 'pushText', visible: false, isModelProperty: true },
    { name: '發送日期', property: 'pushSendDate', visible: true, isModelProperty: true },
    { name: '結束日期', property: 'pushEndDate', visible: true, isModelProperty: true },
    { name: '發送對象', property: 'applyMem_TW', visible: false, isModelProperty: true },
    { name: '發送對象代碼', property: 'applyMem', visible: false, isModelProperty: true },
    { name: '推播狀態代碼', property: 'pushStatus', visible: false, isModelProperty: true },
    { name: '預計發送時間', property: 'estPushTime', visible: false, isModelProperty: true },
    { name: '建立日期', property: 'createDate', visible: false, isModelProperty: true },
    { name: '建立者', property: 'creator', visible: false, isModelProperty: true },
    { name: '修改日期', property: 'modifyDate', visible: false, isModelProperty: true },
    { name: '修改者', property: 'modifier', visible: false, isModelProperty: true },
    { name: '推播狀態', property: 'pushStatus_TW', visible: false, isModelProperty: true }
  ] as ListColumn[];

  columnsMsg: ListColumn[] = [
    { name: '訊息編號', property: 'msgId', visible: true, isModelProperty: true },
    { name: '訊息類別', property: 'msgType', visible: false, isModelProperty: true },
    { name: '折價券活動代碼', property: 'grno', visible: false, isModelProperty: true },
    { name: '紅利點數活動代碼', property: 'marketId', visible: false, isModelProperty: true },
    { name: '訊息狀態', property: 'msgStatus', visible: false, isModelProperty: true },
    { name: '訊息主題', property: 'msgSub', visible: true, isModelProperty: true },
    { name: '訊息文字', property: 'msgTxt', visible: false, isModelProperty: true },
    { name: '訊息圖片', property: 'msgJpg', visible: false, isModelProperty: true },
    { name: '訊息連結_APP', property: 'msgUrlApp', visible: false, isModelProperty: true },
    { name: '訊息連結_網站', property: 'msgUrlWeb', visible: false, isModelProperty: true },
    { name: '發送日期', property: 'msgSendDate', visible: true, isModelProperty: true },
    { name: '結束日期', property: 'msgEndDate', visible: true, isModelProperty: true },
    { name: '發送對象', property: 'applyMem', visible: false, isModelProperty: true },
    { name: '發送筆數', property: 'recCount', visible: true, isModelProperty: true },
    { name: '開啟筆數', property: 'openCount', visible: true, isModelProperty: true },
    { name: '建立日期', property: 'createDate', visible: false, isModelProperty: true },
    { name: '建立者', property: 'creator', visible: false, isModelProperty: true },
    { name: '修改日期', property: 'modifyDate', visible: false, isModelProperty: true },
    { name: '修改者', property: 'modifier', visible: false, isModelProperty: true },
  ] as ListColumn[];

  columnsAct: ListColumn[] = [
    { name: '活動編號', property: 'actId', visible: true, isModelProperty: true },
    { name: '活動名稱', property: 'actDesc', visible: true, isModelProperty: true },
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
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  pageSize = 10;
  pageSizeAct = 0;
  resultsLengthAct: number;
  resultsLengthPush: number;
  resultsLengthMsg: number;
  private getMsgType$: Observable<any>;
  private getcutType$: Observable<any>;
  private getPushStatus$: Observable<any>;
  private getChannelId$: Observable<any>;
  private getApplyMem$: Observable<any>;
  private getMsgStatus$: Observable<any>;
  private getActStatus$: Observable<any>;
  getPushStatus: AppCodeList[] = [];
  ApplyMemList: AppCodeList[] = [];
  msgTypeList: AppCodeList[] = [];
  cutTypeList: AppCutList[] = [];
  getChannelId: AppCodeList[] = [];
  getMsgStatus: AppCodeList[] = [];
  getActStatus: AppCodeList[] = [];
  private appCut_path = ApiUrl.appCut_path;
  private appCodes_path = ApiUrl.appCodes_path;
  private appMsg_path = ApiUrl.appMsgs_path;
  private appPush_path = ApiUrl.appPushs_path;
  private appActs_path = ApiUrl.appActs_path;
  dataSourceMsg = new MatTableDataSource<any>();
  dataSourcePush = new MatTableDataSource<any>();
  dataSourceAct = new MatTableDataSource<any>();
  @ViewChild('paginatorPush', {static: false}) paginatorPush: MatPaginator;
  @ViewChild('paginatorAct', {static: false}) paginatorAct: MatPaginator;
  @ViewChild('paginatorMsg', {static: false}) paginatorMsg: MatPaginator;
  constructor(private dialog: MatDialog,
    private httpService: HttpServiceService,
    private snackbar: MatSnackBar) {
    this.form1 = new FormGroup({
      'msgType': new FormControl('', [
        Validators.required
      ]),
      'msgSub': new FormControl(''),
      'channelId': new FormControl('', [Validators.required]),
      'msgStartDate': new FormControl(moment(new Date()).add(-15, 'days').format('YYYY-MM-DD')),
      'msgEndDate': new FormControl(moment(new Date()).add(15, 'days').format('YYYY-MM-DD')),
      'msgStatus': new FormControl('')
    });
    this.form2 = new FormGroup({
      'pushSub': new FormControl('', [
        Validators.required
      ]),
      // 'pushStatus': new FormControl('N'),
      'channelId': new FormControl('', [Validators.required]),
      'pushStartDate': new FormControl(moment(new Date()).add(-15, 'days').format('YYYY-MM-DD')),
      'pushEndDate': new FormControl(moment(new Date()).add(15, 'days').format('YYYY-MM-DD')),
      'pushStatus': new FormControl('')
    });
    this.form3 = new FormGroup({
      'cutId': new FormControl('', [
        Validators.required
      ]),
      'channelId': new FormControl('', [Validators.required]),
      'actDesc': new FormControl('', [
        Validators.required
      ]),
      'actStatus': new FormControl('')
      // 'actStartDate': new FormControl(moment(new Date()).add(-15, 'days').format('YYYY-MM-DD')),
      // 'actEndDate': new FormControl(moment(new Date()).add(15, 'days').format('YYYY-MM-DD'))
    });
  }

  ngOnInit() {
    this.getInitValue();
  }


  changePage(page: PageEvent, type) {
    if (type === 'push') {
      this.getPushStock(false, page.pageIndex + 1);
    } else if (type === 'msg') {
      this.getMsgStock(false, page.pageIndex + 1);
    } else {
      this.getActStock(false, page.pageIndex + 1);
    }
  }
  visibleColumns(type) {
    if (type === 'msg') {
      const ans = this.columnsMsg
        .filter(column => column.visible)
        .map(column => column.property);
      ans.unshift('management', 'task');
      return ans;
    } else if (type === 'push') {
      const ans = this.columnsPush
        .filter(column => column.visible)
        .map(column => column.property);
      ans.unshift('management', 'task');
      return ans;
    } else {
      const ans = this.columnsAct
        .filter(column => column.visible)
        .map(column => column.property);
      ans.unshift('management');
      return ans;
    }

  }

  private timeOutError = () => {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `發送中, 請稍候再確認發送筆數 !!`,
        type: '2'
      }
    });
  }

  sendMsg(stock) {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要發送訊息嗎？(訊息活動代碼${stock.msgId})`,
        type: '1'
      }
    });

    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      this.httpService.putData(`${ApiUrl.appSendMsg}/${stock.msgId}`, {})
        .subscribe((result: RootObject) => {
          console.info(result);
          if (result.status === 'SUCCESS') {
            const tempSnack = this.snackbar.open(`訊息編號:${stock.msgId}發送成功，共${result.data}筆`, null, {
              duration: 3000
            });
            tempSnack.afterDismissed().subscribe(() => {
              this.getMsgStock();
              this.isLoading = false;
            });
          } else {
            this.snackbar.open(`訊息編號:${stock.msgId}推播失敗，原因:${result.message}`, null, {
              duration: 5000
            });
            this.isLoading = false;
          }
        },
          error => {
            console.error(error);
            this.isLoading = false;
            if (error.cause === 'java.net.SocketTimeoutException: Read timed out' && error.errorCode === 500) {
              this.timeOutError();
            } else {
              this.snackbar.open(`系統異常，請洽管理人員`, null, {
                duration: 5000
              });
            }
          });
    });

  }
  sendPush(stock) {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要推播嗎？(推播主檔編號${stock.pushId})`,
        type: '3'
      }
    });

    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      const workingDialogRef = this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: `推播主檔編號:${stock.pushId}已在進行中，請勿重複操作`,
          type: '2'
        }
      });
      // 暫時disable按鈕
      this.dataSourcePush.data.forEach(item => {
        if (item.pushId === stock.pushId) {
          item.pushStatus = 'E';
        }
      });
      this.httpService.putData(`${ApiUrl.appPushNote}/${stock.pushId}`, {})
        .subscribe((result: RootObject) => {
          console.info(result);
          if (result.status === 'SUCCESS') {
            const tempSnack = this.snackbar.open(`推播編號:${stock.pushId}發送成功`, null, {
              duration: 3000
            });
            this.getPushStock();
            this.isLoading = false;
          } else {
            this.getPushStock();
            this.snackbar.open(`推播主檔編號:${stock.pushId}推播失敗，原因:${result.message}`, null, {
              duration: 5000
            });
            this.isLoading = false;
          }
        },
          error => {
            console.error(error);
            this.getPushStock();
            this.isLoading = false;
            if (error.cause === 'java.net.SocketTimeoutException: Read timed out' && error.errorCode === 500) {
              this.timeOutError();
            } else {
              this.snackbar.open(`系統異常，請洽管理人員`, null, {
                duration: 5000
              });
            }
          });

      workingDialogRef.componentInstance.doConfirm.subscribe(() => {
        console.log('推播中警示');
      });
    });


  }
  sendAct(stock) {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要發佈嗎？(活動編號${stock.actId})`,
        type: '1'
      }
    });

    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      this.httpService.putData(`${ApiUrl.appPublish}/${stock.actId}`, {})
        .subscribe((result: RootObject) => {
          console.info(result);
          if (result.status === 'SUCCESS') {
            const tempSnack = this.snackbar.open(`活動編號:${stock.actId}發佈成功`, null, {
              duration: 3000
            });
            tempSnack.afterDismissed().subscribe(() => {
              this.getActStock();
              this.isLoading = false;
            });
          } else {
            this.snackbar.open(`活動編號:${stock.actId}發佈失敗，原因:${result.message}`, null, {
              duration: 5000
            });
            this.isLoading = false;
          }
        },
          error => {
            console.error(error);
            this.snackbar.open(`系統異常，請洽管理人員`, null, {
              duration: 5000
            });
            this.isLoading = false;
          });
    });

  }
  // 訊息管理新增進去排程作業裡面
  sendTask(stock) {
    const nowTime = new Date().toString();
    if (Date.parse(stock.msgSendDate).valueOf() - Date.parse(nowTime).valueOf() < (60 * 1000)) {
      const pathTimeDialogRef = this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: `訊息活動排程發送時間發生在過去，無法排程`,
          type: '2'
        }
      });
    } else {
      const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: `確定要寫入排程中嗎？(訊息活動代碼${stock.msgSendDate})`,
          type: '1'
        }
      });

      confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
        this.isLoading = true;
        this.httpService.putData(`${ApiUrl.appTask}/${stock.msgId}`, {})
          .subscribe((result: RootObject) => {
            console.log(result);
            if (result.status === 'SUCCESS') {
              const tempSnack = this.snackbar.open(`訊息編號:${stock.msgId}，${result.data}共1筆`, null, {
                duration: 3000
              });
              tempSnack.afterDismissed().subscribe(() => {
                this.getMsgStock();
                this.isLoading = false;
              });
            } else {
              this.snackbar.open(`訊息編號:${stock.msgId}推播失敗，原因:${result.data}`, null, {
                duration: 5000
              });
              this.isLoading = false;
            }
          },
            error => {
              console.error(error);
              this.snackbar.open(`系統異常，請洽管理人員`, null, {
                duration: 5000
              });
              this.isLoading = false;
            });
      });
    }
  }
  // 推播管理新增進去排程作業裡面
  sendPushTask(stock) {
    const nowTime = new Date().toString();
    if (Date.parse(stock.pushSendDate).valueOf() - Date.parse(nowTime).valueOf() < (60 * 1000)) {
      const pathTimeDialogRef = this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: `推播排程發送時間發生在過去，無法排程`,
          type: '2'
        }
      });
    } else {
      const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: `確定要寫入排程中嗎？(訊息活動代碼${stock.pushSendDate})`,
          type: '1'
        }
      });
      confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
        this.isLoading = true;
        this.httpService.putData(`${ApiUrl.appPushTask}/${stock.pushId}`, {})
          .subscribe((result: RootObject) => {
            console.log(result);
            if (result.status === 'SUCCESS') {
              const tempSnack = this.snackbar.open(`訊息編號:${stock.pushId}，${result.data}共1筆`, null, {
                duration: 3000
              });
              tempSnack.afterDismissed().subscribe(() => {
                this.getPushStock();
                this.isLoading = false;
              });
            } else {
              this.snackbar.open(`訊息編號:${stock.msgId}推播失敗，原因:${result.message}`, null, {
                duration: 5000
              });
              this.isLoading = false;
            }
          },
            error => {
              console.error(error);
              this.snackbar.open(`系統異常，請洽管理人員`, null, {
                duration: 5000
              });
              this.isLoading = false;
            });
      });
    }
  }

  previewAct(stock: AppActMstList) {
    if (stock.actdtl) {
      if (stock.actdtl[0].actType === 'B') {
        console.info('step1');
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
          console.info('step3');
          this.dialog.open(PreviewComponent, {
            data: {
              img: stock.actdtl[0].actSjpgSch,
              type: '2'
            }
          });
        }
      }
    }
  }
  mergeUrlvariable(variable, type): string {
    if (type === 'msg') {
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
      param = arr.join('').replace(/&$/, '');
      return `${param}`;
    } else if (type === 'push') {
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
      param = arr.join('').replace(/&$/, '');
      return `${param}`;
    } else {
      const temp_stock: AppActQueryCond = variable;
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
      return `${param}`;
    }
  }
  getMsgStock(gotoFirstPage = true, pageIndex = 0) {

    if (!this.form1.get('msgType').valid) {
      this.snackbar.open('請輸入查詢條件', '我知道了');
    } else {
      const temp: AppMsgQueryCond = this.form1.value;
      temp.msgStartDate = moment(new Date(temp.msgStartDate)).format(this.dbDateFormat);
      temp.msgEndDate = moment(new Date(temp.msgEndDate)).format(this.dbDateFormat);
      console.info('temp=                 ', temp);
      const v_param = this.mergeUrlvariable(temp, 'msg');
      console.info('v_param=              ', v_param);
      this.httpService.getRemoteData(`${this.appMsg_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}
      &applyMems=${this.applyMems}` + v_param)
        .pipe(map((rootObject: RootObject) => {
          if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
            this.snackbar.open('查無資料', null, {
              duration: 5000
            });
          }
          console.info('query', rootObject);
          this.resultsLengthMsg = rootObject.data.total;
          const stockList: AppMsgMstList[] = rootObject.data.list;
          stockList.forEach(stock => {
            stock.createDate = moment(new Date(stock.createDate)).format(this.eventDateFormat);
            stock.msgSendDate = moment(new Date(stock.msgSendDate)).format(this.eventDateFormat);
            stock.msgEndDate = moment(new Date(stock.msgEndDate)).format(this.eventDateFormat);
            stock.modifyDate = moment(new Date(stock.modifyDate)).format(this.eventDateFormat);
          });
          return stockList;
        }))
        .subscribe(
          (stockList: AppMsgMstList[]) => {
            console.info('MsgStock data:', stockList);
            this.dataSourceMsg.data = stockList;
            if (gotoFirstPage) {
              this.paginatorMsg.firstPage();
            }
          },
          error => {
            console.error(error);
          }
        );
    }

  }
  getPushStock(gotoFirstPage = true, pageIndex = 0) {

    if (!this.form2.get('pushSub').valid) {
      this.snackbar.open('請輸入查詢條件', '我知道了');
    } else {
      const temp: AppPushQueryCond = this.form2.value;
      temp.pushStartDate = moment(new Date(temp.pushStartDate)).format(this.dbDateFormat);
      temp.pushEndDate = moment(new Date(temp.pushEndDate)).format(this.dbDateFormat);
      const v_param = this.mergeUrlvariable(temp, 'push');
      console.info('v_param push:', v_param);
      this.httpService.getRemoteData(`${this.appPush_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}
      &applyMems=${this.applyMems}` + v_param)
        .pipe(map((rootObject: RootObject) => {
          if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
            this.snackbar.open('查無資料', null, {
              duration: 5000
            });
          }
          console.info('query', rootObject);
          this.resultsLengthPush = rootObject.data.total;
          console.info('this.resultsLengthPush at getstock', this.resultsLengthPush);
          const stockList: AppPushMstList[] = rootObject.data.list;
          stockList.forEach(stock => {
            stock.createDate = moment(new Date(stock.createDate)).format(this.eventDateFormat);
            stock.pushSendDate = moment(new Date(stock.pushSendDate)).format(this.eventDateFormat);
            stock.pushEndDate = moment(new Date(stock.pushEndDate)).format(this.eventDateFormat);
            stock.modifyDate = moment(new Date(stock.modifyDate)).format(this.eventDateFormat);
          });
          return stockList;
        }))
        .subscribe(
          (stockList: AppPushMstList[]) => {
            console.info('PushStock data:', stockList);
            this.dataSourcePush.data = stockList;
            if (gotoFirstPage) {
              this.paginatorPush.firstPage();
            }
          },
          error => {
            console.error(error);
          }
        );
    }

  }
  getActStock(gotoFirstPage = true, pageIndex = 0) {

    if (!this.form3.get('cutId').valid || !this.form3.get('actDesc').valid) {
      this.snackbar.open('請輸入查詢條件', '我知道了');
    } else {
      const temp: AppActQueryCond = this.form3.value;
      // temp.actStartDate = moment(new Date(temp.actStartDate)).format(this.dbDateFormat);
      // temp.actEndDate = moment(new Date(temp.actEndDate)).format(this.dbDateFormat);
      const v_param = this.mergeUrlvariable(temp, 'act');
      // console.info('v_param=', v_param);
      this.httpService.getRemoteData(`${this.appActs_path}?pageSize=${this.pageSizeAct}&pageIndex=${pageIndex}` + v_param)
        .pipe(map((rootObject: RootObject) => {
          console.info('query', rootObject);
          if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
            this.snackbar.open('查無資料', null, {
              duration: 5000
            });
          }
          this.resultsLengthAct = rootObject.data.total;
          const stockList: AppActMstList[] = rootObject.data.list;
          stockList.forEach(stock => {
            stock.createDate = moment(new Date(stock.createDate)).format(this.eventDateFormat);
            stock.startDate = moment(new Date(stock.startDate)).format(this.eventDateFormat);
            stock.endDate = moment(new Date(stock.endDate)).format(this.eventDateFormat);
            stock.modifyDate = moment(new Date(stock.modifyDate)).format(this.eventDateFormat);
          });
          return stockList;
        }))
        .subscribe(
          (stockList: AppActMstList[]) => {
            console.info('ActStock data:', stockList);
            this.dataSourceAct.data = stockList;
            this.dataSourceAct.paginator = this.paginatorAct;
            if (gotoFirstPage) {
              this.paginatorAct.firstPage();
              // this.currentPageNumber = 0;
            }
          },
          error => {
            console.error(error);
          }
        );
    }

  }
  private getInitValue() {
    this.getcutType$ = this.httpService.getRemoteData(this.appCut_path);
    // this.getPushStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=push_sta'));
    this.getMsgType$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=msg_type'));
    this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));
    this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
    this.getMsgStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=msg_status'));
    this.getPushStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=push_sta'));
    this.getActStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=act_status'));

    zip(this.getMsgType$, this.getcutType$, this.getChannelId$, this.getApplyMem$, this.getMsgStatus$,
      this.getPushStatus$, this.getActStatus$).subscribe((data) => {
        console.info('data subscribe:', data);
        const appCodeObject: RootObject[] = data;
        this.msgTypeList = appCodeObject[0].data.list;
        this.cutTypeList = appCodeObject[1].data.list;
        // this.getPushStatus = appCodeObject[2].data.list.filter(status => status.codeNo !== 'D');
        this.getChannelId = appCodeObject[2].data.list;
        this.ApplyMemList = appCodeObject[3].data.list.filter(mem => mem.codeNo !== '1');
        this.getMsgStatus = appCodeObject[4].data.list;
        this.getPushStatus = appCodeObject[5].data.list;
        this.getActStatus = appCodeObject[6].data.list;
        for (let i = 0; i < this.ApplyMemList.length; i++) {
          this.applyMems.push(this.ApplyMemList[i].codeNo);
        }
        // this.getPushStatus.splice(this.getPushStatus.findIndex((existingCustomer) =>
        //   existingCustomer.codeNo === 'D'), 1);

      });
  }

}

