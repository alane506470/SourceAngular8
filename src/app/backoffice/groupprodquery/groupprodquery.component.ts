import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { ApiUrl } from '../../../environments/api-url';
import { HttpServiceService } from '../../http-service/http-service.service';
import { RootObject, AppCodeList, Appclusterprod, AppclusterprodList } from '../../api-result/api-result.interface';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import {zip} from 'rxjs'
@Component({
  selector: 'fury-groupprodquery',
  templateUrl: './groupprodquery.component.html',
  styleUrls: ['./groupprodquery.component.scss']
})

export class GroupprodqueryComponent implements OnInit {
  isLoading: boolean;
  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';
  dbDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  @Input()
  columns: ListColumn[] = [
    { name: '分群代碼', property: 'clusterId', visible: true, isModelProperty: true },
    { name: '分群說明', property: 'clusterDesc', visible: true, isModelProperty: true },
    { name: '商品代碼', property: 'sku', visible: true, isModelProperty: true },
    { name: '商品名稱', property: 'skuName', visible: true, isModelProperty: true }
  ] as ListColumn[];
  form1: FormGroup;
  pageSize = 10;
  currentPageNumber = 0;
  resultsLength: number;
  private getChannelId$: Observable<any>;
  getChannelId: AppCodeList[] = [];
  private appCodes_path = ApiUrl.appCodes_path;
  private appClusterProd_path = ApiUrl.appClusterProd_path;
  dataSource = new MatTableDataSource<any>();


  @ViewChild(MatPaginator , {static: false}) paginator: MatPaginator;
  get visibleColumns() {
    return this.columns
      .filter(column => column.visible)
      .map(column => column.property);
  }
  constructor(private httpService: HttpServiceService, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public defaults: any) {
    this.form1 = new FormGroup({
      'channelId': new FormControl('', [Validators.required]),
      'startDate': new FormControl(moment(new Date()).add(-15, 'days').format('YYYY-MM-DD'), [Validators.required]),
      'endDate': new FormControl(),
    });
  }

  ngOnInit() {
    this.getInitValue();
    // 分頁切換時，重新取得資料
    this.paginator.page.subscribe((page: PageEvent) => {
      console.info('page', page);
      this.currentPageNumber = page.pageIndex;
      this.getAppClusterProd(false, page.pageIndex + 1);
    });
  }

  getAppClusterProd(gotoFirstPage = true, pageIndex = 0) {
    if (!this.form1.get('channelId').valid) {
      this.snackbar.open('請輸入適用通路', '我知道了');
    }
    if (!this.form1.get('startDate').valid) {
      this.snackbar.open('請輸入生效起日', '我知道了');
    }
    const temp: Appclusterprod = this.form1.value;
    temp.startDate = moment(new Date(temp.startDate)).format(this.dbDateFormat);
    temp.endDate = temp.endDate == null ? null : moment(new Date(temp.endDate)).format(this.dbDateFormat);
    const v_param = this.mergeUrlvariable(temp);
    // console.info('v_param=', v_param);
    this.httpService.getRemoteData(`${this.appClusterProd_path}?pageSize=${this.pageSize}&pageIndex=${pageIndex}${v_param}`)
      .pipe(map((rootObject: RootObject) => {
        const appclusterprodList: AppclusterprodList[] = rootObject.data.list;
        if (rootObject.status === 'SUCCESS' && rootObject.data.total === 0) {
          this.snackbar.open('查無資料', null, {
            duration: 5000
          });
        } else {
          console.info('query', rootObject);
          this.resultsLength = rootObject.data.total;
        }
        return appclusterprodList;
      }))
      .subscribe(
        (appclusterprodList: AppclusterprodList[]) => {
          console.info('MsgStock data:', appclusterprodList);
          this.dataSource.data = appclusterprodList;
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

  mergeUrlvariable(variable): string {
    const temp: Appclusterprod = variable;
    const arr = [];
    let param = '';
    for (const i in temp) {
      if (temp[i] !== '') {
        arr.push('&');
        arr.push(i);
        arr.push('=');
        arr.push(temp[i]);
      }
    }
    // console.info('hank arr=', arr);
    param = arr.join('').replace(/&$/, '');
    return param;
  }

  private getInitValue() {
    this.getChannelId$ = this.httpService.getRemoteData(`${this.appCodes_path}?codeClass=channel_id`);

      zip(this.getChannelId$).subscribe((data) => {
        console.info('data subscribe:', data);
        const appCodeObject: RootObject[] = data;
        this.getChannelId = appCodeObject[0].data.list;
      });
  }

  checkInput() {
    if ((this.form1.get('channelId').valid) && (this.form1.get('startDate').valid)) {
      return false;
    } else {
      return true;
    }
  }
}
