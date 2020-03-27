import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { ApiUrl } from '../../../environments/api-url';
// import { AppCodeObject, AppCodeList } from '../../api-result/app-code.interface';
import { RootObject, AppBonusMstList, AppCodeList } from '../../api-result/api-result.interface';
// import { AppBonusMstObject, AppBonusMstList } from '../../api-result/app-bonus-mst.interface';
import { zip  } from 'rxjs';
@Component({
  selector: 'fury-bonusadd',
  templateUrl: './bonusadd.component.html',
  styleUrls: ['./bonusadd.component.scss']
})
export class BonusaddComponent implements OnInit {
  isLoading: boolean;
  eventDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  form1: FormGroup;
  form2: FormGroup;
  selectedIndex = 0;
  mode: 'create' | 'update' = 'create';
  memberDsicript = null;
  fileupFlag = true;
  uploadMemberFileDisable = true;
  private MarketId;
  datePickerMinDate = moment(new Date()).format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(180, 'days').format('YYYY-MM-DD');
  private getMarketId$: Observable<any>;
  private getBonusType$: Observable<any>;
  private getBonusCond$: Observable<any>;
  private getApplyMem$: Observable<any>;
  private getChannelId$: Observable<any>;
  private acl_path = ApiUrl.appBonus_getNextMarketId_path;
  private appCodes_path = ApiUrl.appCodes_path;
  private file_upload_URL = ApiUrl.appBonus_file_upload_path;
  private put_post_path = ApiUrl.appBonus_path;
  private delete_path = ApiUrl.appBonus_delete_path;
  bonusTypeList: AppCodeList[] = [];
  ApplyMemList: AppCodeList[] = [];
  bonusCondList: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  // file upload variable
  public uploader: FileUploader;
  private fileUpMode;
  fileupProcess = '等待上傳';
  fileupCnt: any = '0';


  constructor(private httpService: HttpServiceService,
    private dialogRef: MatDialogRef<BonusaddComponent>,
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
    console.info('this.mode=', this.mode);
    this.createForm();
    this.getInitBonusValue();
    this.uploader = new FileUploader({ queueLimit: 1, itemAlias: 'memberIdFile' });
  }
  private getInitBonusValue() {
    if (this.mode === 'create') {
      this.getMarketId$ = this.httpService.getRemoteData(this.acl_path);
      this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
      this.getBonusType$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=bs_type'));
      this.getBonusCond$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=bs_cond'));
      this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));
      // console.info('getMarketId url=',this.acl_path);

        zip(this.getMarketId$, this.getApplyMem$, this.getBonusType$, this.getBonusCond$, this.getChannelId$)
        .subscribe((data) => {
          console.info('data subscribe:', data);
          const appCodeObject: RootObject[] = data;
          this.MarketId = appCodeObject[0].data;
          this.ApplyMemList = appCodeObject[1].data.list;
          this.bonusTypeList = appCodeObject[2].data.list;
          this.bonusCondList = appCodeObject[3].data.list;
          this.getChannelId = appCodeObject[4].data.list;
          this.form1.patchValue({ 'marketId': this.MarketId });
          this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('marketId').value}/${this.fileUpMode}`;
          };
          this.isLoading = false;
        },
          errors => {
            console.info('bounsadd getInitBonusValue error ', errors);
            this.isLoading = false;
          });
    } else {
      this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
      this.getBonusType$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=bs_type'));
      this.getBonusCond$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=bs_cond'));
      this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));

        zip(this.getApplyMem$, this.getBonusType$, this.getBonusCond$, this.getChannelId$)
        .subscribe((data) => {
          console.info('data subscribe:', data);
          const appCodeObject: RootObject[] = data;
          this.ApplyMemList = appCodeObject[0].data.list;
          this.bonusTypeList = appCodeObject[1].data.list;
          this.bonusCondList = appCodeObject[2].data.list;
          this.getChannelId = appCodeObject[3].data.list;
          this.form1.patchValue({ 'marketId': this.defaults.marketId });
          this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('marketId').value}/${this.fileUpMode}`;
          };
          this.isLoading = false;
        },
        errors => {
            console.info('bounsadd getInitBonusValue error ', errors);
            this.isLoading = false;
          });
    }
  }

  createForm() {
    this.form1 = new FormGroup({
      'marketId': new FormControl(''),
      'name': new FormControl(this.defaults.name || '', [
        Validators.required
      ]),
      'bsType': new FormControl(this.defaults.bsType || '', [
        Validators.required
      ]),
      'bsCond': new FormControl(this.defaults.bsCond || '', [
        Validators.required
      ]),
      'msgYn': new FormControl(this.defaults.msgYn || '', [
        Validators.required
      ]),
      'bonus': new FormControl(this.defaults.bonus || '', [
        Validators.required
      ]),
      'bsDesc': new FormControl(this.defaults.bsDesc || ''),
      'bsLink': new FormControl(this.defaults.bsLink || ''),
      'channelId': new FormControl(this.defaults.channelId || '', [Validators.required]),
      'startDate': new FormControl(moment(new Date(this.defaults.startDate)).format('YYYY-MM-DD') || '', [Validators.required]),
      'endDate': new FormControl(moment(new Date(this.defaults.endDate)).format('YYYY-MM-DD') || '', [Validators.required]),
      'applyMem': new FormControl(this.defaults.applyMem || '', [Validators.required]),

    });
    this.form2 = new FormGroup({
      'uploadMemberFile': new FormControl('')
    });
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
        this.form1.patchValue({ 'marketId': this.MarketId });
      } else {
        this.form1.patchValue({ 'marketId': this.defaults.marketId });
      }
      this.memberDsicript = null;
      this.snackbar.open('已重設所有欄位', null, {
        duration: 5000
      });
      this.uploader.clearQueue();
      confirmDialogRef.close();
    });

  }
  onchange(event) {
    // console.info('event is =', event);
    this.setFileupControl(event.value);
  }
  deleteClick() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要刪除嗎？(紅利點數活動代碼${this.form1.get('marketId').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      const marketId_value = this.form1.get('marketId').value;
      this.deleteData(marketId_value);
    });
  }
  private deleteData(marketId_value) {
    this.httpService.deleteData(`${this.delete_path}${marketId_value}`)
      .subscribe((result: RootObject) => {
        // console.info('post subscribe:', grnoTypeObject.status);
        // console.info('delete result:', result);
        this.showSubmitResult(result.message, result.status, '刪除');
      },
        error => {
          console.error(error);
        });
  }
  onSubmit() {

    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要儲存嗎？(紅利點數活動代碼${this.form1.get('marketId').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      const temp: AppBonusMstList = this.form1.value;
      temp.startDate = moment(new Date(temp.startDate)).format(this.eventDateFormat);
      temp.endDate = moment(new Date(temp.endDate)).format(this.eventDateFormat);
      if (!(temp.name === null)) {
        temp.name = temp.name.trim();
      }
      if (!(temp.bsDesc === null)) {
        temp.bsDesc = temp.bsDesc.trim();
      }
      if (!(temp.bsLink === null)) {
        temp.bsLink = temp.bsLink.trim();
      }
      // temp.name = temp.name.trim();
      // temp.bsDesc = temp.bsDesc.trim();
      // temp.bsLink = temp.bsLink.trim();
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
      .subscribe((result: RootObject) => {
        // console.info('post subscribe:', grnoTypeObject.status);
        // console.info('post subscribe:', grnoTypeObject.message);
        this.showSubmitResult(result.message, result.status, '儲存');
        this.isLoading = false;
      },
        error => {
          console.error(error);
          this.isLoading = false;
        });
  }
  private postData(temp) {
    this.httpService.postData(this.put_post_path, temp)
      .subscribe((result: RootObject) => {
        // console.info('post subscribe:', grnoTypeObject.status);
        // console.info('post subscribe:', grnoTypeObject.message);
        this.showSubmitResult(result.message, result.status, '儲存');
        this.isLoading = false;
      },
        error => {
          console.error(error);
          this.isLoading = false;
        });
  }

  // isDeleteData() {
  //   return this.defaults.bsStaus === 'D';
  // }
  // isSubmitDisable() {
  //   if (this.mode === 'update') {
  //     if (this.defaults.bsStaus === 'D') {
  //       return true;
  //     } else {
  //       return !(this.form1.valid && this.fileupFlag);
  //     }
  //   } else {
  //     return !(this.form1.valid && this.fileupFlag);
  //   }

  // }
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
            // this.router.navigateByUrl(`apps/messageadd/${this.form1.get('marketId').value}/marketId`);
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
  nextStep() {
    // console.info('start date',moment(this.form1.get('startDate').value).format('YYYY-MM-DD') );
    // console.info('endDate date',moment(this.form1.get('endDate').value).format('YYYY-MM-DD') );
    if (moment(this.form1.get('startDate').value).format('YYYY-MM-DD') > moment(this.form1.get('endDate').value).format('YYYY-MM-DD')) {
      this.snackbar.open('注意!「生效日期」比「結束日期」大', null, {
        duration: 5000
      });
    } else {
      this.selectedIndex += 1;
    }
  }
  fileUploadSubmit() {
    this.fileupFlag = false;
    this.isLoading = true;
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
    // console.info('file item', item.alias);
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
  }
  fileUpDelete() {
    this.uploader.clearQueue();
    this.form2.get('uploadMemberFile').reset();
    this.fileupCnt = '0';
    this.fileupProcess = '等待上傳';
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
