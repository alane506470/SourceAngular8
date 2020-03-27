import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { MatDialogRef, MatTableDataSource, PageEvent, MatSnackBar, MatDialog, MatPaginator } from '@angular/material';
import { HttpServiceService } from '../../http-service/http-service.service';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ApiUrl } from '../../../environments/api-url';
import { RootObject, AppCodeList, AppGameMstList, AppStoreList } from '../../api-result/api-result.interface';
import * as Rx from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { GameaddComponent } from '../gameadd/gameadd.component';
import { QrcodeDownloadComponent } from './qrcode-download/qrcode-download.component';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import { zip  } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fury-gamequery',
  templateUrl: './gamequery.component.html',
  styleUrls: ['./gamequery.component.scss']
})
export class GamequeryComponent implements OnInit {
  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';
  isLoading: boolean;
  pageSize = 0;
  form1: FormGroup;
  resultsLength: number;
  currentPageNumber = 0;
  getChannelId: AppCodeList[] = [];
  getFormStatus: AppCodeList[] = [];
  private getFormStatus$: Observable<any>;
  private getChannelId$: Observable<any>;
  private getHolaStoreId$: Observable<any>;
  private getTlwStoreId$: Observable<any>;

  // dataSource
  dataSource = new MatTableDataSource<any>();
  columns: ListColumn[] = [
    { name: '遊戲代碼', property: 'gameId', visible: true, isModelProperty: true },
    { name: '遊戲名稱', property: 'gameDesc', visible: true, isModelProperty: true },
    { name: '適用通路代碼', property: 'channelId', visible: false, isModelProperty: true },
    { name: '適用通路', property: 'channelId_TW', visible: true, isModelProperty: true },
    { name: '遊戲狀態', property: 'gameStatus_TW', visible: true, isModelProperty: true },

    { name: '開始日期', property: 'startDate', visible: true, isModelProperty: true },
    { name: '結束日期', property: 'endDate', visible: true, isModelProperty: true },
    { name: '遊戲狀態代碼', property: 'gameStatus', visible: false, isModelProperty: true },
    { name: '關卡數', property: 'level', visible: false, isModelProperty: true },
    { name: '獎勵數', property: 'goal', visible: false, isModelProperty: true },
    { name: '建立日期', property: 'createDate', visible: false, isModelProperty: true },
    { name: '建立人員', property: 'creator', visible: false, isModelProperty: true },
    { name: '修改日期', property: 'modifyDate', visible: false, isModelProperty: true },
    { name: '修改人員', property: 'modifier', visible: false, isModelProperty: true },
  ] as ListColumn[];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    ans.unshift('management');
    return ans;
  }
  constructor(private dialog: MatDialog, private http: HttpClient, private httpService: HttpServiceService, private snackbar: MatSnackBar) {
    this.isLoading = true;
    this.form1 = new FormGroup({
      'gameDesc': new FormControl('', [
        Validators.required
      ]),
      'startDate': new FormControl(moment(new Date()).add(-15, 'days').format('YYYY-MM-DD')),
      'endDate': new FormControl(moment(new Date()).add(15, 'days').format('YYYY-MM-DD')),
      'channelId': new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.loadInitData();
    this.paginator.page.subscribe((page: PageEvent) => {
      // this.getIssues(page.pageIndex, page.pageSize);
      console.info('page', page);
      this.currentPageNumber = page.pageIndex;
      this.getStock(false, page.pageIndex + 1);
    });
  }
  loadInitData() {
    this.getChannelId$ = this.httpService.getRemoteData(ApiUrl.appCodes_path.concat(`?codeClass=channel_id`));
    this.getFormStatus$ = this.httpService.getRemoteData(ApiUrl.appCodes_path.concat(`?codeClass=game_sta`));


      zip(this.getChannelId$, this.getFormStatus$).subscribe((data) => {
        // console.info('data subscribe:', data);
        const result: RootObject[] = data;
        this.getChannelId = result[0].data.list;
        this.getFormStatus = result[1].data.list;
        this.isLoading = false;
      },
        error => {
          console.info('gamequery loadInitData error', error);
          this.isLoading = false;
        });
  }
  getStock(gotoFirstPage = true, pageIndex = 0) {
    this.isLoading = true;
    if (this.form1.get('gameDesc').value === '') {
      this.snackbar.open('請輸入遊戲名稱', '我知道了');
    } else {
      const temp: AppGameMstList = this.form1.value;
      temp.gameDesc = temp.gameDesc.trim();
      const v_param = this.mergeUrlvariable(temp);
      this.httpService.getRemoteData(`${ApiUrl.appGames_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}` + v_param)
        .pipe(map((rootObject: RootObject) => {
          if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
            this.snackbar.open('查無資料', null, {
              duration: 5000
            });
          }
          console.info('query', rootObject);
          this.resultsLength = rootObject.data.total;
          const stockList: AppGameMstList[] = rootObject.data.list;
          stockList.forEach(stock => {
            stock.createDate = moment(new Date(stock.createDate)).format(this.eventDateFormat);
            stock.endDate = moment(new Date(stock.endDate)).format(this.eventDateFormat);
            stock.startDate = moment(new Date(stock.startDate)).format(this.eventDateFormat);
            stock.modifyDate = moment(new Date(stock.modifyDate)).format(this.eventDateFormat);
            for (const i in this.getChannelId) {
              if (stock.channelId === this.getChannelId[i].codeNo) {
                stock.channelId_TW = this.getChannelId[i].codeExplain;
              }
            }
            for (const i in this.getFormStatus) {
              if (stock.gameStatus === this.getFormStatus[i].codeNo) {
                stock.gameStatus_TW = this.getFormStatus[i].codeExplain;
              }
            }
          });
          return stockList;
        }))
        .subscribe(
          (stockList: AppGameMstList[]) => {
            console.info('BonusStock data:', stockList);
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
    this.dialog.open(GameaddComponent, {
      data: stock, height: '150%'
    }).afterClosed().subscribe((temp_stock) => {
      if (temp_stock) {
        this.getStock(false, this.currentPageNumber);
      }
    });
  }
  mergeUrlvariable(variable): string {
    const temp_stock: AppGameMstList = variable;
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
  qrCode(list) {
    console.info('listlistlist',list);

    this.getHolaStoreId$ = this.httpService.getRemoteData(ApiUrl.appStoreQry.concat(`/HOLA`));
    this.getTlwStoreId$ = this.httpService.getRemoteData(ApiUrl.appStoreQry.concat(`/TLW`));
   zip(this.getHolaStoreId$, this.getTlwStoreId$).subscribe((result) => {
      console.info('data subscribe:', result);
      const rootObject: RootObject[] = result;
      const holaStoreId: AppStoreList[] = rootObject[0].data.list;
      const tlwStoreId: AppStoreList[] = rootObject[1].data.list;

      const confirmDialogRef = this.dialog.open(QrcodeDownloadComponent, {
        data: {
          hola: holaStoreId,
          tlw: tlwStoreId,
          channelId: list.channelId
        }
      });
      confirmDialogRef.afterClosed().subscribe((data) => {
        console.info('店點代碼', data);
        if (data) {
          this.isLoading = true;
          this.httpService.getRemoteBlob(ApiUrl.appGame_download_QRcode.concat(`?gameId=${list.gameId}&storeId=${data}`))
            .subscribe((ans) => {
              this.downloadFile(ans);
              console.info('data subscribe:', ans);
              this.isLoading = false;
            },
              error => {
                console.info('gamequery download qrcode error', error);
                this.isLoading = false;
              });

        }
        confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
          confirmDialogRef.close();
        });
      });

    },
      error => {
        console.info('gamequery getStoreId error', error);
      });
  }

  downloadFile(data) {
    let fileName = `abc.zip`;
    // get fileName for http headers
    console.info('data', data);
    const contentDispositionHeader = data.headers.get('content-disposition');
    console.info('contentDispositionHeader', contentDispositionHeader);

    if (contentDispositionHeader) {
      try {
        fileName = contentDispositionHeader.split(';')[1].trim().split('=')[1];
        console.info('fileName', fileName);

      } catch (error) {
        console.info(error);
      }
    }
    const blob = new Blob([data.body], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const downloadPage = document.createElement('a');
    document.body.appendChild(downloadPage);
    downloadPage.setAttribute('style', 'display: none');
    downloadPage.href = url;
    downloadPage.download = fileName;
    downloadPage.click();
    window.URL.revokeObjectURL(url);
    downloadPage.remove(); // remove the element
  }

}
