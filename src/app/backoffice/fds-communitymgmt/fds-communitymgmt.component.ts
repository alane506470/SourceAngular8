import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { AppCutList, CommRootObject, RootObject, AppActMstList, AppCodeList } from '../../../app/api-result/api-result.interface';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../../environments/api-url';
import { HttpServiceService } from '../../../app/http-service/http-service.service';
import * as Rx from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { PreviewComponent } from './preview/preview.component';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { zip  } from 'rxjs';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
@Component({
  selector: 'fury-fds-communitymgmt',
  templateUrl: './fds-communitymgmt.component.html',
  styleUrls: ['./fds-communitymgmt.component.scss']
})
export class FdsCommunitymgmtComponent implements OnInit {

  pageSize = 0;
  currentPageNumber = 0;
  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';
  resultsLength: number;
  isLoading: boolean;
  form1: FormGroup;
  communityList: any[] = [];
  getActStatus: AppCodeList[] = [];
  appCutTypeList: AppCutList[] = [];
  dataSource = new MatTableDataSource<any>();

  private getAppCutType$: Observable<any>;
  private getActStatus$: Observable<any>;
  private getComm$: Observable<any>;

  private appAdvs_path = ApiUrl.appAdvs_path;
  private appCut_path = ApiUrl. appAdv_getCut_path;
  private appActStatus_path = ApiUrl.appAdv_act_status_path;
  private getComm_path = ApiUrl.appQueryAllComm_path;

  @Input()
  columns: ListColumn[] = [
    { name: '活動編號', property: 'actId', visible: true, isModelProperty: true },
    { name: '活動名稱', property: 'actDesc', visible: true, isModelProperty: true },
    { name: '社區名稱', property: 'commName', visible: true, isModelProperty: true },
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
  constructor(private dialog: MatDialog, private httpService: HttpServiceService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.createForm();
    this.getInitMgmtValue();
    this.getInitAllComm();
  }

  createForm() {
    this.form1 = new FormGroup({
      'commId': new FormControl(''),
      'actDesc': new FormControl(''),
      'cutId': new FormControl('', [
        Validators.required
      ]),
      'actStatus': new FormControl('')
    });
  }

  private getInitMgmtValue() {
    this.isLoading = true;
    this.getAppCutType$ = this.httpService.getRemoteData(this.appCut_path);
    this.getActStatus$ = this.httpService.postData(this.appActStatus_path, '');

    zip(this.getAppCutType$).subscribe((data) => {
      console.info('data subscribe:', data);
      const rootObject: RootObject[] = data;
      this.appCutTypeList = rootObject[0].data.list;
      this.isLoading = false;
    },
    error => {
      console.info('fds-communitymgmt getInit error', error);
      this.isLoading = false;
    });


    zip(this.getActStatus$).subscribe((data) => {
      console.info('data subscribe:', data);
      const rootObject: CommRootObject[] = data;
      this.getActStatus = rootObject[0].data;
      this.isLoading = false;
    },
    error => {
      console.info('fds-communitymgmt getInit error', error);
      this.isLoading = false;
    });

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
      console.info('getInitAllComm getInit error', error);
      this.isLoading = false;
    });
  }

  mergeUrlvariable(variable, type) {
    const temp_stock: AppcommAdvQueryCond = variable;
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

  getAdvStock(gotoFirstPage = true, pageIndex = 0) {
    if (!this.form1.get('cutId').valid || !this.form1.get('actDesc').valid || !this.form1.get('commId').valid) {
      this.snackbar.open('請輸入查詢條件', '我知道了');
    } else {
      this.isLoading = true;
      const temp: AppcommAdvQueryCond = this.form1.value;
      const v_param = this.mergeUrlvariable(temp, 'act');
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
            for (const i in this.communityList) {
              if (stock.commId === this.communityList[i].commId) {
                stock.commName = this.communityList[i].commName;
              }
            }
          });
          return stockList;
        }
        })).subscribe((stockList: AppActMstList[]) => {
            console.info('MsgStock data:', stockList);
            this.dataSource.data = stockList;
            this.isLoading = false;
          },
          error => {
            console.error(error);
            this.isLoading = false;
          });
       }
     }

  // 顯示表格
  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    ans.unshift('management');
    return ans;
  }

  // 預覽照片
  previewAct(stock: AppActMstList) {
    if (stock.actdtl) {
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

  sendAct(stock) {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要發佈嗎？(活動編號${stock.actId})`,
        type: '1'
      }
    });

    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      this.httpService.putData(`${ApiUrl.appAdv_publish_path}/${stock.commId}/${stock.actId}`, {})
        .subscribe((result: RootObject) => {
          console.info(result);
          if (result.status === 'SUCCESS') {
            const tempSnack = this.snackbar.open(`活動編號:${stock.actId}發佈成功`, null, {
              duration: 3000
            });
            tempSnack.afterDismissed().subscribe(() => {
              this.getAdvStock();
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
}

interface AppcommAdvQueryCond {
  actDesc: any;
  cutId: any;
  actStatus?: any;
}
