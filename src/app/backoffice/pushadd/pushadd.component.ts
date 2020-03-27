import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpServiceService } from '../../http-service/http-service.service';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { environment } from '../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { zip  } from 'rxjs';
import { ApiUrl } from '../../../environments/api-url';
import { RootObject, AppPushMstList, AppCodeList, AppActMstList } from '../../api-result/api-result.interface';
export interface AppCouponBonusMstList {
  grno: string;
  channelId: string;
  marketId: string;
  msgId?: any;
  grStatus?: string;
  bsStatus?: string;
  msgYn: string;
}
export interface AnyObject {
  status: string;
  message?: any;
  data: any;
}
@Component({
  selector: 'fury-pushadd',
  templateUrl: './pushadd.component.html',
  styleUrls: ['./pushadd.component.scss']
})
export class PushaddComponent implements OnInit {
  isLoading: boolean;
  eventDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  form1: FormGroup;
  form2: FormGroup;
  selectedIndex = 0;
  pushStatusValue;
  mode: 'create' | 'update' = 'create';
  msgTypeMode: 'other' | 'gmode' | 'pmode' = 'other';
  memberDsicript = null;
  datePickerMinDate = moment(new Date()).format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(180, 'days').format('YYYY-MM-DD');
  public uploader: FileUploader;
  private fileUpMode;
  fileupProcess = '等待上傳';
  fileupCnt: any = '0';
  uploadMemberFileDisable = true;
  fileupFlag = true;
  private getApplyMem$: Observable<any>;
  private getPushId$: Observable<any>;
  private getFormStatus$: Observable<any>;
  private getChannelId$: Observable<any>;
  private acl_path = ApiUrl.appPush_getNextActId_path;
  private appCodes_path = ApiUrl.appCodes_path;
  private file_upload_URL = ApiUrl.appPush_file_upload_path;
  private put_post_path = ApiUrl.appPush_path;
  private delete_path = ApiUrl.appPush_delete_path;
  ApplyMemList: AppCodeList[] = [];
  getFormStatus: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  pushId;


  constructor(private httpService: HttpServiceService,
    private dialogRef: MatDialogRef<PushaddComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialog: MatDialog,
    private router: Router) {
    this.isLoading = true;
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
      this.fileUpMode = 'modify';
      this.memberDsicript = this.defaults.applyMem_TW;
      this.setFileupControl(this.defaults.applyMem);
    } else {
      this.defaults = {};
      this.fileUpMode = 'new';
    }
    this.createForm();
    this.getInitPushValue();
    this.uploader = new FileUploader({ queueLimit: 1, itemAlias: 'memberIdFile' });
  }
  previousStep() {
    this.selectedIndex -= 1;
  }
  isUpdateMode() {
    return this.mode === 'update';
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
      if (this.mode === 'create') {
        this.form1.patchValue({ 'pushId': this.pushId });
      } else {
        this.form1.patchValue({ 'pushId': this.defaults.pushId });
      }
      this.memberDsicript = null;
      this.snackbar.open('已重設所有欄位', null, {
        duration: 5000
      });
      this.uploader.clearQueue();
      confirmDialogRef.close();
    });

  }

  onSubmit() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要儲存嗎？(推播代碼${this.form1.get('pushId').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      const temp: AppPushMstList = this.form1.value;
      temp.pushSendDate = moment(new Date(temp.pushSendDate)).format(this.eventDateFormat);
      temp.pushEndDate = moment(new Date(temp.pushEndDate)).format(this.eventDateFormat);
      console.info('temp', temp);
      if (!(temp.pushSub === null)) {
        temp.pushSub = temp.pushSub.trim();
      }
      if (!(temp.pushText === null)) {
        temp.pushText = temp.pushText.trim();
      }
      if (this.form1.get('marketId').value) {
        temp.marketId = temp.marketId.trim();
      }
      if (this.form1.get('grno').value) {
        temp.grno = temp.grno.trim();
      }
      if (this.form1.get('actId').value) {
        temp.actId = temp.actId.trim();
      }

      if (this.mode === 'create') {
        this.postData(temp);
      } else {
        this.putData(temp);

      }
      (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
    });

  }
  private putData(temp) {
    this.httpService.putData(this.put_post_path, temp)
      .subscribe((grnoTypeObject: RootObject) => {
        this.showSubmitResult(grnoTypeObject.message, grnoTypeObject.status, '儲存');
        this.isLoading = false;
      },
        error => {
          console.error(error);
          this.isLoading = false;
        });
  }
  private postData(temp) {
    this.httpService.postData(this.put_post_path, temp)
      .subscribe((grnoTypeObject: RootObject) => {
        this.showSubmitResult(grnoTypeObject.message, grnoTypeObject.status, '儲存');
        this.isLoading = false;
      },
        error => {
          console.error(error);
          this.isLoading = false;
        });
  }
  deleteClick() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要刪除嗎？(推播代碼${this.form1.get('pushId').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      const value = this.form1.get('pushId').value;
      this.deleteData(value);
    });
  }
  showSubmitResult(message: string, status: string, wording: string) {
    if (status === 'ERROR') {
      this.snackbar.open(`${wording}失敗，原因：${message}`, '我知道了');
    } else if (status === 'SUCCESS') {
      if (this.mode === 'update') {
        this.dialogRef.close('1');
      } else {
        this.router.navigateByUrl('');
      }
      this.snackbar.open(`${wording}成功`, null, {
        duration: 5000
      });
    } else {
      this.snackbar.open(`${wording}異常，請洽相關窗口`, '我知道了');
    }
  }
  private deleteData(value) {
    this.httpService.deleteData(`${this.delete_path}${value}`)
      .subscribe((result: RootObject) => {
        this.showSubmitResult(result.message, result.status, '刪除');
      },
        error => {
          console.error(error);
        });
  }
  // idValid() {
  //   if (this.form1.get('marketId').value && this.form1.get('grno').value) {
  //     this.snackbar.open('注意!「折價券」或「紅利點數」活動請擇一輸入', null, {
  //       duration: 5000
  //     });

  //   } else {
  //     if (this.form1.get('marketId').value) {
  //       this.msgTypeMode = 'pmode';
  //     } else if (this.form1.get('grno').value) {
  //       this.msgTypeMode = 'gmode';
  //     } else if ((!(this.form1.get('marketId').value)) && (!(this.form1.get('grno').value))) {
  //       this.msgTypeMode = 'other';
  //       this.form1.get('channelId').setValue('');
  //     }
  //     console.info('msgTypeMode', this.msgTypeMode);
  //     if (this.msgTypeMode === 'pmode' || this.msgTypeMode === 'gmode') {
  //       const id = this.msgTypeMode === 'pmode' ? this.form1.get('marketId').value : this.form1.get('grno').value;
  //       const url = this.msgTypeMode === 'pmode' ?
  //         `${ApiUrl.appBonuss_path}?marketId=${id.trim()}` :
  //         `${ApiUrl.appCoupons_path}?grno=${id.trim()}`;
  //       console.info('url=', url);
  //       this.httpService.getRemoteData(url)
  //         .subscribe((root: RootObject) => {
  //           console.info('root', root);
  //           if (root.status === 'SUCCESS') {
  //             const stockList: AppCouponBonusMstList[] = root.data.list;
  //             if (root.data.total === 1) {
  //               if (stockList[0].bsStatus === 'D' || stockList[0].grStatus === 'D') {
  //                 const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
  //                   data: {
  //                     message: `此${this.msgTypeMode === 'pmode' ?
  //                       '紅利點數' : '折價券'}活動狀態為「刪除」，請輸入其他活動代碼`,
  //                     type: '1'
  //                   }
  //                 });
  //                 this.form1.get(this.msgTypeMode === 'pmode' ? 'marketId' : 'grno').setValue('');
  //                 this.form1.get('channelId').setValue('');
  //               } else {
  //                 this.form1.get('channelId').setValue(stockList[0].channelId);
  //               }

  //             } else {
  //               this.snackbar.open(`${this.msgTypeMode === 'pmode' ?
  //                 '紅利點數' : '折價券'}活動代碼錯誤，請重新輸入`, null, {
  //                   duration: 5000
  //                 });
  //               this.form1.get(this.msgTypeMode === 'pmode' ? 'marketId' : 'grno').setValue('');
  //               this.form1.get('channelId').setValue('');
  //             }
  //           } else {
  //             this.snackbar.open('系統錯誤，請洽相關窗口', null, {
  //               duration: 5000
  //             });
  //           }
  //         });
  //     }
  //   }


  // }
  msgIdVaild() {
    if (this.form1.get('msgId').value) {
      const id = this.form1.get('msgId').value;
      const url = `${ApiUrl.appMsg_path}/${id.trim()}`;
      console.info('url=', url);
      this.httpService.getRemoteData(url)
        .subscribe((root: AnyObject) => {
          console.info('msgid', root);
          if (root.status === 'SUCCESS') {
            if (!root.data) {
              this.snackbar.open('找不到資料，請重新輸入訊息編號', null, {
                duration: 5000
              });
              this.form1.get('msgId').setValue('');
            } else {
              if (root.data.msgStatus === 'D') {
                const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
                  data: {
                    message: `此訊息編號狀態為「刪除」，請輸入其他編號`,
                    type: '1'
                  }
                });
                this.form1.get('msgId').setValue('');
              }

            }
          } else {
            this.snackbar.open('系統錯誤，請洽相關窗口', null, {
              duration: 5000
            });
          }
        });
    }
  }
  nextStep() {
    if (moment(this.form1.get('pushSendDate').value).format('YYYY-MM-DD') >
      moment(this.form1.get('pushEndDate').value).format('YYYY-MM-DD')) {
      this.snackbar.open('注意!「發送日期」比「結束日期」大', null, {
        duration: 5000
      });
    } else if (this.form1.get('marketId').value && this.form1.get('grno').value) {
      this.snackbar.open('注意!「折價券」或「紅利點數」活動請擇一輸入', null, {
        duration: 5000
      });

    } else {
      this.selectedIndex += 1;
    }
  }
  createForm() {
    this.form1 = new FormGroup({
      'pushId': new FormControl(''),
      'msgId': new FormControl(this.defaults.msgId || ''),
      'actId': new FormControl(this.defaults.actId || ''),
      'marketId': new FormControl(this.defaults.marketId || ''),
      'grno': new FormControl(this.defaults.grno || ''),
      'channelId': new FormControl(this.defaults.channelId || '', [Validators.required]),
      'pushSub': new FormControl(this.defaults.pushSub || '', [
        Validators.required
      ]),
      'pushText': new FormControl(this.defaults.pushText || '', [
        Validators.required
      ]),
      'pushSendDate': new FormControl(moment(new Date(this.defaults.pushSendDate)).format('YYYY-MM-DD HH:mm') || '', [Validators.required]),
      'pushEndDate': new FormControl(moment(new Date(this.defaults.pushEndDate)).format('YYYY-MM-DD HH:mm') || '', [Validators.required]),
      'applyMem': new FormControl(this.defaults.applyMem || '', [Validators.required]),
      'pushStatus': new FormControl(this.defaults.pushStatus || 'N')
    });
    this.form2 = new FormGroup({
      'uploadMemberFile': new FormControl('')
    });
  }
  private getInitPushValue() {
    if (this.mode === 'create') {
      this.getPushId$ = this.httpService.getRemoteData(this.acl_path);
      this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
      this.getFormStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=push_sta`));
      this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));

        zip(this.getPushId$, this.getApplyMem$, this.getFormStatus$, this.getChannelId$).subscribe((data) => {
          console.info('data subscribe:', data);
          const appCodeObject: RootObject[] = data;
          this.pushId = appCodeObject[0].data;
          this.ApplyMemList = appCodeObject[1].data.list;
          this.getFormStatus = appCodeObject[2].data.list;
          this.getChannelId = appCodeObject[3].data.list;
          this.form1.patchValue({ 'pushId': this.pushId });
          for (const i in this.getFormStatus) {
            if (this.form1.get('pushStatus').value === this.getFormStatus[i].codeNo) {
              this.pushStatusValue = this.getFormStatus[i].codeExplain;
            }
          }
          this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('pushId').value}/${this.fileUpMode}`;
          };
          this.isLoading = false;
        },
          errors => {
            console.info('pushadd getInitPushValue error', errors);
            this.isLoading = false;
          });

    } else {
      this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
      this.getFormStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=push_sta`));
      this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));

        zip(this.getApplyMem$, this.getFormStatus$, this.getChannelId$).subscribe((data) => {
          console.info('data subscribe:', data);
          const appCodeObject: RootObject[] = data;
          this.ApplyMemList = appCodeObject[0].data.list;
          this.getFormStatus = appCodeObject[1].data.list;
          this.getChannelId = appCodeObject[2].data.list;
          for (const i in this.getFormStatus) {
            if (this.form1.get('pushStatus').value === this.getFormStatus[i].codeNo) {
              this.pushStatusValue = this.getFormStatus[i].codeExplain;
            }
          }
          this.form1.patchValue({ 'pushId': this.defaults.pushId });
          this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('pushId').value}/${this.fileUpMode}`;
          };
          this.isLoading = false;
        },
          errors => {
            console.info('pushadd getInitPushValue error', errors);
            this.isLoading = false;
          }
        );
    }
  }
  actIdValid() {
    if (this.form1.get('actId').value) {
      const actId = this.form1.get('actId').value;
      this.httpService.getRemoteData(`${ApiUrl.appAct_path}/${actId.trim()}`)
        .subscribe((root: RootObject) => {
          console.info('root', root);
          if (root.status === 'SUCCESS') {
            const stockList: AppActMstList[] = root.data.list;
            if (stockList[0].cutId !== 'Z001_01') {
              const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
                data: {
                  message: `此活動代碼APP版面設定非「Event Page」，請輸入其他活動代碼`,
                  type: '3'
                }
              });
              this.form1.get('actId').setValue('');
              confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
                confirmDialogRef.close();
              });
            }
          } else {
            const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
              data: {
                message: `活動代碼錯誤，請重新輸入`,
                type: '3'
              }
            });
            this.form1.get('actId').setValue('');
            confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
              confirmDialogRef.close();
            });
          }
        });
    }

  }
  fileUploadSubmit() {
    this.isLoading = true;
    this.fileupFlag = false;
    this.fileupProcess = '上傳中';
    const kcToken = localStorage.getItem('kc_token');
    // console.info('this.uploader.options.kc_token=', `Bearer ${kcToken}`);
    this.uploader.authTokenHeader = 'Authorization';
    this.uploader.authToken = `Bearer ${kcToken}`;
    this.uploader.uploadAll();
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const resault: RootObject = JSON.parse(response);
    this.isLoading = false;
    // console.info('file item', item.alias);
    if (resault.status === 'SUCCESS') {
      this.snackbar.open('上傳成功', null, {
        duration: 5000
      });
      this.fileupFlag = true;
      this.fileupProcess = '上傳成功';
      this.fileupCnt = resault.data;
    } else {
      this.snackbar.open(`上傳失敗，原因：${resault.message}`, '我知道了', {
        duration: 5000
      });
      this.fileupFlag = false;
      this.fileupProcess = '上傳失敗';
    }
  }
  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    console.info('file server fail response', response);
    this.isLoading = false;
    this.snackbar.open(`連線檔案上傳Server失敗，請洽管理人員`, '我知道了');
    this.fileupFlag = false;
    this.fileupProcess = '上傳失敗';
  }
  handleFileInput(files: File[]) {
    this.uploader.clearQueue();
    this.uploader.addToQueue(files);
    this.fileupProcess = '等待上傳';
    this.fileupCnt = '0';
  }
  fileUpDelete() {
    this.uploader.clearQueue();
    this.form2.get('uploadMemberFile').reset();
    this.fileupCnt = '0';
    this.fileupProcess = '等待上傳';
  }
  onchange(event) {
    // console.info('event is =', event);
    this.setFileupControl(event.value);
  }
  setFileupControl(member) {

    switch (member) {
      case '1': {
        this.uploadMemberFileDisable = true;
        this.fileupFlag = true;
        break;
      }
      case '2': {
        this.uploadMemberFileDisable = false;
        if (this.mode === 'create') {
          this.fileupFlag = false;
        } else {
          this.fileupFlag = true;
        }
        break;
      }
      case '3': {
        this.uploadMemberFileDisable = true;
        this.fileupFlag = true;
        break;
      }
      default: {
        this.memberDsicript = null;
        break;
      }
    }
  }

}
