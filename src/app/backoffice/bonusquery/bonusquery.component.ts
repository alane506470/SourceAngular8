import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { HttpServiceService } from '../../http-service/http-service.service';
// import { AppCodeObject, AppCodeList } from '../../api-result/app-code.interface';
// import { AppBonusMstList, AppBonusMstObject } from '../../api-result/app-bonus-mst.interface';
import { BonusaddComponent } from '../bonusadd/bonusadd.component';
import * as moment from 'moment';
import { RootObject, AppBonusMstList, AppCodeList } from '../../api-result/api-result.interface';
import { Observable } from 'rxjs/internal/Observable';
import * as Rx from 'rxjs';
import { ApiUrl } from '../../../environments/api-url';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import { zip  } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'fury-bonusquery',
  templateUrl: './bonusquery.component.html',
  styleUrls: ['./bonusquery.component.scss']
})
export class BonusqueryComponent implements OnInit {
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


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  get visibleColumns() {
    return this.columns
      .filter(column => column.visible)
      .map(column => column.property);
  }
  constructor(private dialog: MatDialog, private httpService: HttpServiceService, private snackbar: MatSnackBar) {
    this.form1 = new FormGroup({
      'marketId': new FormControl(''),
      'name': new FormControl(''),
      'channelId': new FormControl('', [Validators.required])
    });
  }
  ngOnInit() {
    // 分頁切換時，重新取得資料
    this.loadInitData();
    this.paginator.page.subscribe((page: PageEvent) => {
      // this.getIssues(page.pageIndex, page.pageSize);
      console.info('page', page);
      this.currentPageNumber = page.pageIndex;
      this.getBonusStock(false, page.pageIndex + 1);
    });
  }
  updateCustomer(stock) {
    this.dialog.open(BonusaddComponent, {
      data: stock, height: '150%'
    }).afterClosed().subscribe((temp_stock) => {
      if (temp_stock) {
        this.getBonusStock(false, this.currentPageNumber);
      }
    });
  }
  loadInitData() {
    // this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'))
    //   .subscribe((result: AppCodeObject) => {
    //     this.ApplyMemList = result.data.list;
    //   },
    //     error => {
    //       console.error(error);
    //     }
    //   );
    this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
    this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));
    this.getFormStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=bs_status`));

      zip(this.getApplyMem$, this.getChannelId$, this.getFormStatus$).subscribe((data) => {
        // console.info('data subscribe:', data);
        const grnoTypeObject: RootObject[] = data;
        this.ApplyMemList = grnoTypeObject[0].data.list;
        this.getChannelId = grnoTypeObject[1].data.list;
        this.getFormStatus = grnoTypeObject[2].data.list;
      });
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
  getBonusStock(gotoFirstPage = true, pageIndex = 0) {

    if ((this.form1.get('marketId').value === '') && (this.form1.get('name').value === '')) {
      this.snackbar.open('至少輸入一項查詢條件', '我知道了');
    } else {
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
          console.info('query', rootObject);
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
            console.info('BonusStock data:', stockList);
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
