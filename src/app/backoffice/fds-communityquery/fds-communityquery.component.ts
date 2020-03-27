import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import * as Rx from 'rxjs';
import { MatDialog, MatTableDataSource,MatSnackBar, MatPaginator } from '@angular/material';
import { HttpServiceService } from '../../../app/http-service/http-service.service';
import { Observable } from 'rxjs';

import { FdsCommunityList, FdsCommunityaddComponent } from '../fds-communityadd/fds-communityadd.component';
import { PreviewComponent } from './preview/preview.component';
import { CommaddComponent } from './commadd/commadd.component';
import { RootObject, CommRootObject } from '../../../app/api-result/api-result.interface';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import { ApiUrl } from '../../../environments/api-url';
import { zip  } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fury-fds-communityquery',
  templateUrl: './fds-communityquery.component.html',
  styleUrls: ['./fds-communityquery.component.scss']
})
export class FdsCommunityqueryComponent implements OnInit {
  isLoading: boolean;
  form1: FormGroup;
  resultsLength: number;
  pageSize = 0;
  totalCount: number;
  getCountyId: any[] = [];
  getTownshipId: any[] = [];
  getTownshipIdForPreview: any[] = [];
  communityList: any[] = [];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @Input()
  columns: ListColumn[] = [
    { name: '', property: 'commId', visible: false, isModelProperty: true },
    { name: '', property: 'commAdd1', visible: false, isModelProperty: true },
    { name: '', property: 'commAdd2', visible: false, isModelProperty: true },
    { name: '社區名稱', property: 'commName', visible: true, isModelProperty: true },
    { name: '社區縣市', property: 'commAdd1Name', visible: true, isModelProperty: true },
    { name: '社區鄉鎮市', property: 'commAdd2Name', visible: true, isModelProperty: true },
  ] as ListColumn[];

  private County_path = ApiUrl.appCounty_path;
  private getCounty$: Observable<any>;
  private getComm$: Observable<any>;
  private getComm_path = ApiUrl.appQueryAllComm_path;
  private put_post_path = ApiUrl.appCommQuery_path;

  constructor(private dialog: MatDialog, private httpService: HttpServiceService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.createForm();
    this.getInitCommunityValue();
    this.getInitAllComm();
  }

  getInitAllComm() {
    this.isLoading = true;
    this.getComm$ = this.httpService.postData(this.getComm_path, '');


    zip(this.getComm$).subscribe((data) => {
      this.communityList = data[0].data;
      this.isLoading = false;
    },
    error => {
      console.info('fds-repairquery getInit error', error);
      this.isLoading = false;
    });
  }

  getInitCommunityValue() {
    this.isLoading = true;
      this.getCounty$ = this.httpService.getRemoteData(this.County_path);

      zip( this.getCounty$).subscribe((data) => {
        console.info('data subscribe', data);
        this.getCountyId = data[0].data;
        for (const i in this.getCountyId) {
          if (i !== undefined || i !== null) {
            for (const j in data[0].data[i].areaList) {
              if (i !== undefined || i !== null) {
                this.getTownshipId.push(data[0].data[i].areaList[j]);
                this.getTownshipIdForPreview.push(data[0].data[i].areaList[j]);
              }
            }
          }
        }
        this.isLoading = false;
      });
    }

    changeTownshipId($eventValue: string) {
      // tslint:disable-next-line: radix
      const county = parseInt($eventValue) - 1;
      console.log(county);
      this.getTownshipId = this.getCountyId[county].areaList;
    }

    createForm() {
      this.isLoading = true;
      this.form1 = new FormGroup({
        'commId': new FormControl(''),
        'commAdd1': new FormControl(''),
        'commAdd2': new FormControl('')
      });

    }

    get visibleColumns() {
      const ans = this.columns
        .filter(column => column.visible)
        .map(column => column.property);
      ans.unshift('management');
      ans.unshift('houseinfo');
      return ans;
    }

    getCommunity(modify?: string) {
      this.isLoading = true;
      if (!this.form1.get('commId').valid || !this.form1.get('commAdd1').valid || !this.form1.get('commAdd2').valid) {
        this.snackbar.open('請輸入查詢條件' , '我知道了');
        this.isLoading = false;
      } else {
        if (modify === 'updata') {
          this.getInitAllComm();
        }
        const temp: Community = this.form1.value;
        this.httpService.postData(this.put_post_path, temp)
        .pipe(map((rootObject: CommRootObject) => {
          console.info('query', rootObject);
          if (rootObject.status === 'ERROR' && rootObject.data === null) {
            this.snackbar.open('查無資料', null, {
              duration: 5000
            });
            this.dataSource.data = [];
            this.form1.reset();
            this.isLoading = false;
          }

          const stockList: Community[] = rootObject.data;
          // console.info(stockList);
          for (const i in stockList) {
            if (stockList !== null) {
              const tempCommName = this.communityList.find(function(item, index, array) {
                return item.commId === stockList[i].commId;
              });
              const tempCommAdd1 = this.getCountyId.find((item, index, array) => {
                return item.code === stockList[i].commAdd1;
              });
              const tempCommAdd2 = this.getTownshipId.find((item, index, array) => {
                return item.code === stockList[i].commAdd2;
              });

              stockList[i].commName = tempCommName.commName;
              stockList[i].commAdd1Name = tempCommAdd1.name;
              stockList[i].commAdd2Name = tempCommAdd2.name;
            }
          }
          return stockList;
        }))
        .subscribe((stockList: Community[]) => {
          if (stockList instanceof Array) {
            this.dataSource.data = stockList;
            this.resultsLength = stockList.length;
            this.dataSource.paginator = this.paginator;
          }
          this.isLoading = false;
        },
        error => {
          console.error(error);
          this.form1.reset();
          this.isLoading = false;
        });
      }
    }

    updateCommunity(stock: FdsCommunityList) {
       console.info(stock);
      if (stock.commAdd1) {
        this.dialog.open(PreviewComponent, {
          data: {
            data: stock,
            getCountyId: this.getCountyId,
            getTownshipId: this.getTownshipIdForPreview
          }, height: '150%'
          }).afterClosed().subscribe(() => {
            this.getCommunity('updata');
          });
      }
    }

    downloadHouse(stock: FdsCommunityList) {
      if (stock) {
        this.dialog.open(CommaddComponent, {
          data: {
            data: stock,
          },
          height: '150%'
        });
      }
    }
  }

export interface Community {
  commId: string;
  commAdd1Name: string;
  commAdd2Name: string;
  commName: string;
  commAdd2: string;
  commAdd1: string;
  commAdd3: string;
}
