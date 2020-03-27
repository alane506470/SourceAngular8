import { Component, OnInit } from '@angular/core';
// import { Customer } from './customer-create-update/customer.model';
import { OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Input } from '@angular/core';
// import { ListDataSource } from '../../core/list/list-datasource';
// import { ListDatabase } from '../../core/list/list-database';
import * as Rx from 'rxjs';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource, PageEvent } from '@angular/material';
import { ViewChild } from '@angular/core';
import { ManuscriptComponent } from '../manuscript/manuscript.component';
import { CustomerCreateUpdateComponent } from './customer-create-update/customer-create-update.component';
// import { ALL_IN_ONE_TABLE_DEMO_DATA } from '../tables/all-in-one-table/all-in-one-table.demo';
import { HttpServiceService } from '../../http-service/http-service.service';
import * as moment from 'moment';
import { GiftStock } from './gift-stock/gift-stock.module';
import { RootObject, AppCodeList, AppCouponMstList } from '../../api-result/api-result.interface';
import { FormGroup, FormControl, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
// import { GrnoTypeObject, Gron, List } from '../manuscript/manuscript-item.interface';
// import { AppCodeObject, AppCodeList } from '../../api-result/app-code.interface';
// import { AppCouponMstObject, AppCouponMstList } from '../../api-result/app-coupon-mst.interface';
import { ApiUrl } from '../../../environments/api-url';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import { fadeOutAnimation } from '../../../@fury/animations/route.animation';
import { zip  } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'vr-edm',
  templateUrl: './edm.component.html',
  styleUrls: ['./edm.component.scss'],
  animations: [fadeOutAnimation],
  host: { '[@fadeOutAnimation]': 'true' }
})
export class EdmComponent implements OnInit, OnDestroy {

  // subject$: ReplaySubject<GiftStock[]> = new ReplaySubject<GiftStock[]>(1);
  // data$: Observable<GiftStock[]>;
  // customers: Customer[];
  // stockArray: GiftStock[];
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

  // emailsDataSource = new MatTableDataSource<any>();
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
  // dataSource: Stock[];
  dataSource = new MatTableDataSource<any>();
  // database: ListDatabase<GiftStock>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

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
    return this.columns
      .filter(column => column.visible)
      .map(column => column.property);
  }

  ngOnInit() {
    // 分頁切換時，重新取得資料
    this.loadInitData();
    this.paginator.page.subscribe((page: PageEvent) => {
      // this.getIssues(page.pageIndex, page.pageSize);
      console.info('page', page);
      this.currentPageNumber = page.pageIndex;
      this.getGiftStock(false, page.pageIndex + 1);
    });
    // this.customers = ALL_IN_ONE_TABLE_DEMO_DATA.map(customer => new Customer(customer));

    // this.subject$.next(this.customers);
    // this.data$ = this.subject$.asObservable();

    // this.database = new ListDatabase<Customer>();
    // this.data$
    //   .filter(Boolean)
    //   .subscribe((customers) => {
    //     this.customers = customers;
    //     this.database.dataChange.next(customers);
    //     this.resultsLength = customers.length;
    //   });

    // this.dataSource = new ListDataSource<Customer>(this.database, this.sort, this.paginator, this.columns);

    //
    // this.getGiftStock();
  }

  loadInitData() {
    // this.httpService.getRemoteData(this.appCode_path.concat('?codeClass=apply_mem'))
    //   .subscribe((result: RootObject) => {
    //     // console.info('Grno subscribe:', result);
    //     this.ApplyMemList = result.data.list;
    //     // console.info('this.ApplyMemList:', this.ApplyMemList);
    //   },
    //     error => {
    //       console.error(error);
    //     }
    //   );


    this.getApplyMem$ = this.httpService.getRemoteData(this.appCode_path.concat('?codeClass=apply_mem'));
    this.getChannelId$ = this.httpService.getRemoteData(this.appCode_path.concat(`?codeClass=channel_id`));
    this.getFormStatus$ = this.httpService.getRemoteData(this.appCode_path.concat(`?codeClass=gr_status`));

      zip(this.getApplyMem$, this.getChannelId$, this.getFormStatus$).subscribe((data) => {
        // console.info('data subscribe:', data);
        const grnoTypeObject: RootObject[] = data;
        this.ApplyMemList = grnoTypeObject[0].data.list;
        this.getChannelId = grnoTypeObject[1].data.list;
        this.getFormStatus = grnoTypeObject[2].data.list;
      });
  }

  updateCustomer(stock) {
    // const confirmDialogRef = this.dialog.open(ManuscriptComponent, {
    //   data: stock
    // }).componentInstance;
    // confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
    //   console.log('edm開啟的dialog按下確認按鈕了');
    // });
    this.dialog.open(ManuscriptComponent, {
      data: stock, height: '150%'
    }).afterClosed().subscribe((temp_stock) => {
      if (temp_stock) {
        this.getGiftStock(false, this.currentPageNumber);
      }
    });
  }

  deleteCustomer(customer) {
    // this.customers.splice(this.customers.findIndex((existingCustomer) => existingCustomer.id === customer.id), 1);
    // this.subject$.next(this.customers);
  }


  onFilterChange(value) {
    // if (!this.dataSource) {
    //   return;
    // }
    // this.dataSource.filter = value;
  }

  ngOnDestroy() {
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
      const temp_gron: AppCouponMstList = this.form1.value;
      temp_gron.grno = temp_gron.grno.trim();
      temp_gron.name = temp_gron.name.trim();
      const v_param = this.mergeUrlvariable(temp_gron);
      // console.info('v_param=',v_param);
      this.httpService.getRemoteData(`${this.appCoupons_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}` + v_param)
        .pipe(map((rootObject: RootObject) => {
          console.info('rootObject=', rootObject);
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
            // console.info('data subscribe:', rootObject);
            console.info('GiftStock data createDate:', stockList);
            // this.stockArray = stockList.map(stock => new GiftStock(stock));

            // this.subject$.next(this.stockArray);
            // this.data$ = this.subject$.asObservable();

            // this.database = new ListDatabase<GiftStock>();
            // this.data$
            //   .filter(Boolean)
            //   .subscribe((stocks) => {
            //     this.stockArray = stocks;
            //     this.database.dataChange.next(stocks);
            //   });

            this.dataSource.data = stockList; // new ListDataSource<GiftStock>(this.database, this.sort, null, this.columns);
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
