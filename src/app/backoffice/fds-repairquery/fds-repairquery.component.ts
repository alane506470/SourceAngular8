import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource, MatSnackBar, MatPaginator } from '@angular/material';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';

import { HttpServiceService } from '../../../app/http-service/http-service.service';
import { ApiUrl } from '../../../environments/api-url';
import { CommRootObject } from '../../../app/api-result/api-result.interface';
import { RepairaddComponent } from './repairadd/repairadd.component';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { PreviewPicComponent } from '../preview-pic/preview-pic.component';
import { ListColumn } from '../../../@fury/shared/list/list-column.model';
import { zip  } from 'rxjs';


@Component({
  selector: 'fury-fds-repairquery',
  templateUrl: './fds-repairquery.component.html',
  styleUrls: ['./fds-repairquery.component.scss']
})
export class FdsRepairqueryComponent implements OnInit {
  changeStatusList = [
    {ticketStatus: 'W', ticketStatusName: '待處理'},
    {ticketStatus: 'F', ticketStatusName: '已結束'},
  ];

  @Input()
  columns: ListColumn[] = [
    { name: '社區', property: 'commName', visible: true, isModelProperty: true },
    { name: '諮詢單號', property: 'ticketId', visible: true, isModelProperty: true },
    {name : '換裝項目', property: 'serviceName', visible: true, isModelProperty: true},
    { name: '需求內容', property: 'ticketContent', visible: true, isModelProperty: true },
    { name: '狀態', property: 'ticketStatusName', visible: true, isModelProperty: true },
    { name: '申請人姓名', property: 'applyName', visible: true, isModelProperty: true },
    { name: '申請人手機', property: 'applyMobile', visible: true, isModelProperty: true },
    { name: '申請人地址', property: 'applyAddress', visible: true, isModelProperty: true },
    // {name: '照片', property: 'picList', visible: true, isModelProperty: true},
    {name: '創建日期', property: 'createDate', visible: false, isModelProperty: false },
    {name: '換修狀態', property: 'ticketStatus', visible: false, isModelProperty : false},
    {name: '服務單號', property: 'serviceId' , visible: false, isModelProperty: false}
  ] as ListColumn[];

  isLoading: boolean;
  form1: FormGroup;
  communityList: any[] = [];
  datePickerMinDate = moment(new Date()).add(-6, 'month').format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(+5, 'month').format('YYYY-MM-DD');
  mode: 'create' | 'update' = 'create';
  dbDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  currentPageNumber = 0;
  pageSize = 0;
  totalCount: number;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  private getComm$: Observable<any>;
  private getComm_path = ApiUrl.appQueryAllComm_path;
  private put_post_path = ApiUrl.appRepairQuery_path;
  private communityActs_path: string;

  constructor(public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private httpService: HttpServiceService) { }

  ngOnInit() {
    this.form1 = new FormGroup({
      commId: new FormControl(),
      startDate: new FormControl(moment(new Date()).add(-30, 'days').format('YYYY-MM-DD')),
      endDate: new FormControl(moment(new Date()).add(30, 'days').format('YYYY-MM-DD')),
      codeNo: new FormControl()
    });
    this.getInitAllComm();
  }

  getInitAllComm() {
    this.getComm$ = this.httpService.postData(this.getComm_path, '');

    zip(this.getComm$).subscribe((data) => {
      this.communityList = data[0].data;
      console.info(this.communityList);
      this.isLoading = false;
    },
    error => {
      console.info('fds-repairquery getInit error', error);
      this.isLoading = false;
    });
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  nextStep() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要提交嗎？(社區:${this.form1.get('commId').value})
                  (換修狀態${this.form1.get('codeNo').value})`,
        type: '1'
      }
    });
  }

  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    ans.unshift('management');
    ans.push('picList');
    return ans;
  }

  // 換修查詢
  getAllRepair(gotoFirstPage = true, pageIndex = 0) {
     if ( !this.form1.get('startDate').valid || !this.form1.get('endDate').valid) {
       this.snackbar.open('請輸入起迄日期' , '我知道了');
     } else {
       this.isLoading = true;
       const temp: CommunityQuery = this.form1.value;
       temp.startDate = moment(new Date(temp.startDate)).format(this.dbDateFormat);
       temp.endDate = moment(new Date(temp.endDate)).format(this.dbDateFormat);
       console.log(temp);
       if (temp.startDate >= temp.endDate) {
        this.snackbar.open('開始時間不能在結束時間之後' , '我知道了');
        this.isLoading = false;
       } else {
        this.httpService.postData(this.put_post_path, temp)
        .subscribe((result: CommRootObject) => {
          if (result.data !== null && result.status !== 'ERROR') {
            if (result.status === 'SUCCESS' && result.data.length === 0) {
              this.snackbar.open('查無資料', null, {
                duration: 5000
              });
              this.dataSource.data = [];
              this.isLoading = false;
            } else {
              this.dataSource.data = result.data;
              this.totalCount = result.data.length;
              this.dataSource.paginator = this.paginator;
              console.log(result.data);
              this.isLoading = false;
            }
          } else {
            this.snackbar.open(result.message, null, {
              duration: 5000
            });
             this.isLoading = false;
          }
        },
        error => {
          this.snackbar.open('請重新登入', null, {
            duration: 5000
          });
          console.error(error);
          this.isLoading = false;
        });
      }
     }
}

  // 修改換修
  updateCustomer(stock) {
    this.dialog.open(
      RepairaddComponent, {
      data: {stock}, height: '150%'
    }).afterClosed().subscribe(() => {
        this.getAllRepair(false, this.currentPageNumber);
    });
  }

  // 預覽照片
  previewAct(stock: repairRoot) {
    if (stock.picList.length !== 0) {
      console.log(stock);
        this.dialog.open(PreviewPicComponent, {
          data: {
            allImg: stock.picList,
          }
        });
    } else {
      this.snackbar.open('暫無照片', null, {
        duration: 5000
      });
    }
  }
}

interface repairRoot {
  picList: string[];
}

interface CommunityQuery {
  commId: any;
  startDate?: any;
  endDate?: any;
  codeNo?: any;
}
