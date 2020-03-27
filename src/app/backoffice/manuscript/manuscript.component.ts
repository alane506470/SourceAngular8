import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpServiceService } from '../../http-service/http-service.service';
// import { AppCodeObject, AppCodeList } from '../../api-result/app-code.interface';
import { RootObject, AppCouponMstList, AppCodeList } from '../../api-result/api-result.interface';
// import { AppCouponMstList,  } from '../../api-result/app-coupon-mst.interface';
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
@Component({
  selector: 'fury-form-wizard',
  templateUrl: './manuscript.component.html',
  styleUrls: ['./manuscript.component.scss'],
  // animations: [fadeOutAnimationhank],
  // host: { '[@fadeOutAnimationhank]': 'true' }
})
export class ManuscriptComponent implements OnInit {
  isLoading: boolean;
  eventDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS'; // DB時間格式
  hankDateFormat = 'YYYY-MM-DD'; // 後台datepicker時間格式
  // 後台datepicker時間起迄
  datePickerMinDate = moment(new Date()).format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(180, 'days').format('YYYY-MM-DD');
  selectedIndex = 0;
  grStatusValue;
  mode: 'create' | 'update' = 'create';
  form1: FormGroup;
  form2: FormGroup;
  private Grno;
  grnoTypeList: AppCodeList[] = [];
  ApplyMemList: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  getFormStatus: AppCodeList[] = [];
  uploadMemberFileDisable = true;
  memberDsicript = null;
  private getGrnoType$: Observable<any>;
  private getApplyMem$: Observable<any>;
  private getChannelId$: Observable<any>;
  private getFormStatus$: Observable<any>;
  private appCodes_path = ApiUrl.appCodes_path;
  private file_upload_URL = ApiUrl.appCoupon_file_upload_path;
  private put_post_path = ApiUrl.appCoupon_path;
  private delete_path = ApiUrl.appCoupon_delete_path;
  // file upload variable
  public uploader: FileUploader;
  private fileUpMode;
  fileupFlag = true;
  fileupProcess = '等待上傳';
  fileupCnt: any = '0';

  constructor(private httpService: HttpServiceService,
    private dialogRef: MatDialogRef<ManuscriptComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialog: MatDialog,
    private router: Router) {
    this.isLoading = true;
  }

  createForm() {
    this.form1 = new FormGroup({
      'grno': new FormControl(''),
      'grStatus': new FormControl(this.defaults.grStatus || 'N'),
      'name': new FormControl(this.defaults.name || '', [
        Validators.required
      ]),
      'giftType': new FormControl(this.defaults.giftType || '', [
        Validators.required
      ]),
      'msgYn': new FormControl(this.defaults.msgYn || '', [
        Validators.required
      ]),
      'grAmount': new FormControl(this.defaults.grAmount || '', [
        Validators.required
      ]),
      'grDesc': new FormControl(this.defaults.grDesc || ''),
      'channelId': new FormControl(this.defaults.channelId || '', [Validators.required]),
      'startDate': new FormControl(moment(new Date(this.defaults.startDate)).format('YYYY-MM-DD') || '', [Validators.required]),
      'endDate': new FormControl(moment(new Date(this.defaults.endDate)).format('YYYY-MM-DD') || '', [Validators.required]),
      'applyMem': new FormControl(this.defaults.applyMem || '', [Validators.required])

    });
    this.form2 = new FormGroup({
      'uploadMemberFile': new FormControl('')
    });
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
    console.info('this.mode=', this.mode);
    this.createForm();
    this.getInitGrnoValue();
    this.uploader = new FileUploader({ queueLimit: 1, itemAlias: 'memberIdFile' });

    this.form1.get('msgYn').markAsTouched();
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
    console.info('file success response', response);
    this.isLoading = false;
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
    // console.info('this files.item[0]', files);
    // console.info('this queue', this.uploader.queue);

  }
  private getInitGrnoValue() {
    if (this.mode === 'create') {
      this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
      this.getGrnoType$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=gift_type'));
      this.getFormStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=gr_status`));
      this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));

        zip(this.getGrnoType$, this.getApplyMem$, this.getChannelId$, this.getFormStatus$).subscribe((data) => {
          // console.info('data subscribe:', data);
          const grnoTypeObject: RootObject[] = data;
          this.grnoTypeList = grnoTypeObject[0].data.list;
          this.ApplyMemList = grnoTypeObject[1].data.list;
          this.getChannelId = grnoTypeObject[2].data.list;
          this.getFormStatus = grnoTypeObject[3].data.list;
          this.form1.patchValue({ 'grno': this.Grno });
          for (const i in this.getFormStatus) {
            if (this.form1.get('grStatus').value === this.getFormStatus[i].codeNo) {
              this.grStatusValue = this.getFormStatus[i].codeExplain;
            }
          }
          this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('grno').value}/${this.fileUpMode}`;
          };
          this.isLoading = false;
        },
          errors => {
            this.isLoading = false;
            console.info('couponadd getInitGrnoValue error', errors);
          });
    } else {
      this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
      this.getGrnoType$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=gift_type'));
      this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));
      this.getFormStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=gr_status`));

        zip(this.getGrnoType$, this.getApplyMem$, this.getChannelId$, this.getFormStatus$).subscribe((data) => {
          // console.info('data subscribe5566:', data);
          const grnoTypeObject: RootObject[] = data;
          this.grnoTypeList = grnoTypeObject[0].data.list;
          this.ApplyMemList = grnoTypeObject[1].data.list;
          this.getChannelId = grnoTypeObject[2].data.list;
          this.getFormStatus = grnoTypeObject[3].data.list;
          for (const i in this.getFormStatus) {
            if (this.form1.get('grStatus').value === this.getFormStatus[i].codeNo) {
              this.grStatusValue = this.getFormStatus[i].codeExplain;
            }
          }
          this.form1.patchValue({ 'grno': this.defaults.grno });
          this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('grno').value}/${this.fileUpMode}`;
          };
          this.isLoading = false;
        },
          errors => {
            this.isLoading = false;
            console.info('couponadd getInitGrnoValue error', errors);
          });
    }


    // this.getGrno$.subscribe((data: RootObject) => {
    //   console.info('Grno subscribe:', data);
    //   this.Grno = data.data;
    //   this.form1.patchValue({ 'grno': this.Grno });
    // },
    //   error => {
    //     console.error(error);
    //   }
    // );
  }
  fileUpDelete() {
    this.uploader.clearQueue();
    this.form2.get('uploadMemberFile').reset();
    this.fileupCnt = '0';
    this.fileupProcess = '等待上傳';
  }
  deleteClick() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要刪除嗎？(折價券活動代碼${this.form1.get('grno').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      const grno_value = this.form1.get('grno').value;
      this.deleteGrno(grno_value);
      console.log('grno_value', grno_value);

    });
  }
  showSubmitResult(message: string, status: string, wording: string) {
    if (status === 'ERROR') {
      this.snackbar.open(`${wording}失敗，原因：${message}`, '我知道了');
    } else if (status === 'SUCCESS') {
      if (this.mode === 'update') {
        this.dialogRef.close('1');
      } else {
        if (this.form1.get('msgYn').value === 'Y') {
          const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
            data: {
              message: '您剛選擇要發送訊息，請記得至「訊息設定→新增訊息」做設定',
              type: '1'
            }
          });
          confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
            // this.router.navigateByUrl(`apps/messageadd/${this.form1.get('grno').value}`);
            // this.router.navigateByUrl(`apps/messageadd/${this.form1.get('grno').value}/grno`);
          });
        }
        this.router.navigateByUrl('');
      }
      this.snackbar.open(`${wording}成功`, null, {
        duration: 5000
      });
    } else {
      this.snackbar.open(`${wording}異常，請洽相關窗口`, '我知道了');
    }
  }
  private postGrno(temp_gron) {
    this.httpService.postData(this.put_post_path, temp_gron)
      .subscribe((grnoTypeObject: RootObject) => {
        // console.info('post subscribe:', grnoTypeObject.status);
        // console.info('post subscribe:', grnoTypeObject.message);
        this.isLoading = false;
        this.showSubmitResult(grnoTypeObject.message, grnoTypeObject.status, '儲存');
      },
        error => {
          this.isLoading = false;
          console.error(error);
        });
  }

  private deleteGrno(grno_value) {
    this.httpService.deleteData(`${this.delete_path}${grno_value}`)
      .subscribe((result: RootObject) => {
        // console.info('post subscribe:', grnoTypeObject.status);
        // console.info('delete result:', result);
        this.showSubmitResult(result.message, result.status, '刪除');
      },
        error => {
          console.error(error);
        });
  }

  private putGrno(temp_gron) {
    this.httpService.putData(this.put_post_path, temp_gron)
      .subscribe((grnoTypeObject: RootObject) => {
        // console.info('post subscribe:', grnoTypeObject.status);
        // console.info('post subscribe:', grnoTypeObject.message);
        this.isLoading = false;
        this.showSubmitResult(grnoTypeObject.message, grnoTypeObject.status, '儲存');
      },
        error => {
          console.error(error);
          this.isLoading = false;
        });
  }
  nextStep() {
    // if (this.form1.get('startDate').value > this.form1.get('endDate').value) {
    if (moment(this.form1.get('startDate').value).format('YYYY-MM-DD') > moment(this.form1.get('endDate').value).format('YYYY-MM-DD')) {
      this.snackbar.open('注意!「生效日期」比「結束日期」大', null, {
        duration: 5000
      });
    } else {
      this.selectedIndex += 1;
    }
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
        this.form1.patchValue({ 'grno': this.Grno });
      } else {
        this.form1.patchValue({ 'grno': this.defaults.grno });
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
        message: `確定要儲存嗎？(折價券活動代碼${this.form1.get('grno').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      const temp_gron: AppCouponMstList = this.form1.value;
      temp_gron.startDate = moment(new Date(temp_gron.startDate)).format(this.eventDateFormat);
      temp_gron.endDate = moment(new Date(temp_gron.endDate)).format(this.eventDateFormat);
      if (!(temp_gron.name === null)) {
        temp_gron.name = temp_gron.name.trim();
      }
      if (!(temp_gron.grDesc === null)) {
        temp_gron.grDesc = temp_gron.grDesc.trim();
      }

      // temp_gron.grDesc = temp_gron.grDesc.trim();
      if (this.mode === 'create') {
        this.postGrno(temp_gron);
      } else {
        this.putGrno(temp_gron);

      }
      (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
    });
  }

  previousStep() {
    this.selectedIndex -= 1;
  }
  isUpdateMode() {
    return this.mode === 'update';
  }
  // isDeleteData() {
  //   return this.defaults.grStatus === 'D';
  // }
  // isSubmitDisable() {
  //   if (this.mode === 'update') {
  //     if (this.defaults.grStatus === 'D') {
  //       return true;
  //     } else {
  //       return !(this.form1.valid && this.fileupFlag);
  //     }
  //   } else {
  //     return !(this.form1.valid && this.fileupFlag);
  //   }

  // }
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

  checkGrno() {
    const grno: String = this.form1.get('grno').value;
    if (grno) {
      this.httpService.getRemoteData(`${this.delete_path}${grno}`)
        .subscribe((result: RootObject) => {
          console.info('getMsgSub subscribe:', result);
          if (result.data) {
            this.snackbar.open('活動編號重複', null, {
              duration: 5000
            });
          }
        },
          error => {
            console.error(error);
          }
        );
    }
  }
}
