import { Component, OnInit, Inject } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as Rx from 'rxjs';
import { zip  } from 'rxjs';

import { ApiUrl } from '../../../environments/api-url';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
import { environment } from '../../../environments/environment';
import { HttpServiceService } from '../../http-service/http-service.service';
import { RootObject, AppCodeList, Appclusterprod } from '../../api-result/api-result.interface';

@Component({
  selector: 'fury-groupprodadd',
  templateUrl: './groupprodadd.component.html',
  styleUrls: ['./groupprodadd.component.scss']
})

export class GroupprodaddComponent implements OnInit {
  isLoading: boolean;
  form1: FormGroup;
  msgStatusValue;
  piGiFlag = false;
  eventDateFormat = 'YYYY-MM-DD';
  datePickerMinDate = moment(new Date()).format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(180, 'days').format('YYYY-MM-DD');
  fileupFlag = false;
  uploadMemberFileDisable = true;
  fileupProcess = '等待上傳';
  mode: 'create' | 'update' = 'create';
  memberDsicript = null;
  private getChannelId$: Observable<any>;
  public uploaderCSV: FileUploader;
  getChannelId: AppCodeList[] = [];
  private appCodes_path = ApiUrl.appCodes_path;
  private groupProdFile_upload_URL = ApiUrl.appClusterProd_file_upload_path;
  readOnlyFlag = false;
  constructor(private httpService: HttpServiceService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialog: MatDialog,
    private router: Router) {
    this.isLoading = true;
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
      this.memberDsicript = this.defaults.applyMem_TW;
      this.createForm();
      this.getInitMsgValue();
    } else {
      this.defaults = {};
      this.createForm();
      this.getInitMsgValue();
    }
    this.uploaderCSV = new FileUploader({
      queueLimit: 1,
      itemAlias: 'memberIdFile',
      allowedMimeType: ['application/csv', 'text/csv', 'application/vnd.ms-excel']
    });
    this.uploaderCSV.onWhenAddingFileFailed = (fileItem) => {
      this.fileupFlag = false;
      this.snackbar.open('檔案格式錯誤', null, {
        duration: 5000
      });
    };
  }

  private getInitMsgValue() {
    // if (this.mode === 'create' || this.mode === 'redirect') {
    if (this.mode === 'create') {
      this.getChannelId$ = this.httpService.getRemoteData(`${this.appCodes_path}?codeClass=channel_id`);
        zip(this.getChannelId$).subscribe((data) => {
          console.info('data subscribe:', data);

          const appCodeObject: RootObject[] = data;
          this.getChannelId = appCodeObject[0].data.list;

          this.uploaderCSV.onBeforeUploadItem = (item) => {
            const temp: Appclusterprod = this.form1.value;
            this.isLoading = true;
            temp.startDate = moment(new Date(temp.startDate)).format(this.eventDateFormat);
            temp.endDate = moment(new Date(temp.endDate)).format(this.eventDateFormat);
            if (!(temp.channelId === '')) {
              temp.channelId = temp.channelId.trim();
            }
            item.withCredentials = false;
            // tslint:disable-next-line:max-line-length
            item.url = `${environment.ApiHost}${this.groupProdFile_upload_URL}/${temp.channelId}/${temp.startDate}/${temp.endDate}`;
            console.log(item.url);
          };
          this.isLoading = false;
        },
        errors => {
          console.info('messageadd getInitMsgValue error', errors);
          this.isLoading = false;
        });
    }
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  handleFileInput(files: File[], e) {
    this.uploaderCSV.clearQueue();
    this.uploaderCSV.addToQueue(files);
    this.fileupFlag = true;
  }

  removeUploadFile() {
    this.uploaderCSV.clearQueue();
    this.fileupFlag = false;
  }

  fileUploadSubmit() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要儲存嗎？`,
        type: '3'
      }
    });
    confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
      this.isLoading = true;
      const kcToken = localStorage.getItem('kc_token');
      this.uploaderCSV.authTokenHeader = 'Authorization';
      this.uploaderCSV.authToken = `Bearer ${kcToken}`;
      this.uploaderCSV.uploadAll();
      this.uploaderCSV.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
      this.uploaderCSV.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
      this.fileupFlag = true;
      confirmDialogRef.close();
    });
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const resault: RootObject = JSON.parse(response);
    console.info('file success', resault);
    this.isLoading = false;
    if (resault.status === 'SUCCESS') {
      this.snackbar.open('儲存成功', null, {
        duration: 5000
      });
      this.router.navigateByUrl('');
    } else {
      this.snackbar.open(`儲存失敗，原因：${resault.message}`, '我知道了', {
        duration: 5000
      });
      // console.info('this upload item=', item);
    }
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    console.info('file server fail response', response);
    this.isLoading = false;
    this.snackbar.open(`連線檔案上傳Server失敗，請洽管理人員`, '我知道了');
    this.fileupFlag = false;
    this.fileupProcess = '上傳失敗';
    // console.info('this upload item 2=', item);
  }

  createForm() {
    this.form1 = new FormGroup({
      'channelId': new FormControl(this.defaults.channelId || '', [Validators.required]),
      'startDate': new FormControl(moment(new Date(this.defaults.msgSendDate)).format('YYYY-MM-DD HH:mm:ss') || '', [Validators.required]),
      'endDate': new FormControl(moment(new Date(this.defaults.msgEndDate)).format('YYYY-MM-DD HH:mm:ss') || '', [Validators.required]),
    });
  }

  reset() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: '確定要重設頁面嗎？',
        type: '3'
      }
    });
    confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
      this.form1.reset();
      this.memberDsicript = null;
      this.snackbar.open('已重設「分群商品設定」所有欄位', null, {
        duration: 5000
      });
      this.uploaderCSV.clearQueue();
      confirmDialogRef.close();
    });
  }
}
