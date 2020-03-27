import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpServiceService } from '../../http-service/http-service.service';
import * as Rx from 'rxjs';
import { MatDialogRef, MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { MatPaginator, MatSort, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { AppCutList, RootObject, AppActMstList, AppCodeList } from '../../api-result/api-result.interface';
import { ApiUrl } from '../../../environments/api-url';
import { ActivityaddComponent } from '../activityadd/activityadd.component';
import { PreviewComponent } from './preview/preview.component';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import { zip  } from 'rxjs';
import { map } from 'rxjs/operators';
interface AppActQueryCond {
  actDesc: any;
  cutId: any;
  actStartDate?: any;
  actEndDate?: any;
  channelId?: any;
  actStatus?: any;
}

@Component({
  selector: 'fury-activityquery',
  templateUrl: './activityquery.component.html',
  styleUrls: ['./activityquery.component.scss']
})
export class ActivityqueryComponent implements OnInit {
  isLoading: boolean;
  form1: FormGroup;
  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';
  dbDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  @Input()
  columns: ListColumn[] = [
    { name: '活動編號', property: 'actId', visible: false, isModelProperty: true },
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
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  pageSize = 0;
  resultsLength: number;
  currentPageNumber = 0;
  private getcutType$: Observable<any>;
  private getActStatus$: Observable<any>;
  private getChannelId$: Observable<any>;
  cutTypeList: AppCutList[] = [];
  getActStatus: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  private appCut_path = ApiUrl.appCut_path;
  private appActs_path = ApiUrl.appActs_path;
  private appCodes_path = ApiUrl.appCodes_path;
  dataSource = new MatTableDataSource<any>();
  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    ans.unshift('management');
    return ans;
  }
  constructor(private dialog: MatDialog, private httpService: HttpServiceService, private snackbar: MatSnackBar) {
    this.form1 = new FormGroup({
      'cutId': new FormControl('', [
        Validators.required
      ]),
      'actDesc': new FormControl('', [
        Validators.required
      ]),
      'actStartDate': new FormControl(moment(new Date()).add(-15, 'days').format('YYYY-MM-DD')),
      'actEndDate': new FormControl(moment(new Date()).add(15, 'days').format('YYYY-MM-DD')),
      'channelId': new FormControl('', [Validators.required]),
      'actStatus': new FormControl('')
    });
  }

  ngOnInit() {
    this.getInitActValue();
    // 分頁切換時，重新取得資料
    this.paginator.page.subscribe((page: PageEvent) => {
      // this.getIssues(page.pageIndex, page.pageSize);
      console.info('page', page);
      this.currentPageNumber = page.pageIndex;
      this.getActStock(false, page.pageIndex + 1);
    });

  }
  private getInitActValue() {

    this.getcutType$ = this.httpService.getRemoteData(this.appCut_path);
    this.getActStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=act_status'));
    this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));
      zip(this.getcutType$, this.getActStatus$, this.getChannelId$).subscribe((data) => {
        console.info('data subscribe:', data);
        const appCodeObject: RootObject[] = data;
        this.cutTypeList = appCodeObject[0].data.list;
        this.getActStatus = appCodeObject[1].data.list;
        this.getChannelId = appCodeObject[2].data.list;
      });


  }
  mergeUrlvariable(variable): string {
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
    // console.info('hank arr=', arr);
    param = arr.join('').replace(/&$/, '');
    return param;
  }
  getActStock(gotoFirstPage = true, pageIndex = 0) {
    this.isLoading = true;
    if (!this.form1.get('cutId').valid || !this.form1.get('actDesc').valid) {
      this.snackbar.open('請輸入查詢條件', '我知道了');
    } else {
      const temp: AppActQueryCond = this.form1.value;
      // temp.msgStartDate = this.form1.get('msgStartDate').valid ? moment(new Date(temp.msgStartDate)).format(this.dbDateFormat) : '';
      temp.actStartDate = moment(new Date(temp.actStartDate)).format(this.dbDateFormat);
      temp.actEndDate = moment(new Date(temp.actEndDate)).format(this.dbDateFormat);
      // console.info('temp=', temp);
      console.log(temp)
      const v_param = this.mergeUrlvariable(temp);
      console.log("v_param------"+v_param);
      // console.info('v_param=', v_param);
      console.log(`${this.appActs_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}` + v_param)
      this.httpService.getRemoteData(`${this.appActs_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}` + v_param)
        .pipe(map((rootObject: RootObject) => {
          console.log(rootObject);
          console.info('query', rootObject);
          if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
            this.snackbar.open('查無資料', null, {
              duration: 5000
            });
          }
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
        }))
        .subscribe(
          (stockList: AppActMstList[]) => {
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
  updateCustomer(stock) {
    this.dialog.open(ActivityaddComponent, {
      data: stock, height: '150%'
    }).afterClosed().subscribe((temp_stock) => {
      if (temp_stock) {
        this.getActStock(false, this.currentPageNumber);
      }
    });

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

}
