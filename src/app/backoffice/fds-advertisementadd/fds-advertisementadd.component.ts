import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA , MatDialogRef} from '@angular/material';

import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../../environments/api-url';
import * as Rx from 'rxjs';
import { environment } from '../../../environments/environment';
import { template } from 'lodash-es';
import { SortablejsOptions } from 'angular-sortablejs';
import * as moment from 'moment';

import { RootObject, AppCutList, AppCodeList, AppActdtl, AppActMstList, CommRootObject } from '../../../app/api-result/api-result.interface';
import { HttpServiceService } from '../../../app/http-service/http-service.service';
import { AddSkuDialogComponent } from './add-sku-dialog/add-sku-dialog.component';
import { padLeft } from '../activityadd/activityadd.component';
import { PcmSkubject } from '../../../app/api-result/pcm-sku.interface';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { zip  } from 'rxjs';
@Component({
  selector: 'fury-fds-advertisementadd',
  templateUrl: './fds-advertisementadd.component.html',
  styleUrls: ['./fds-advertisementadd.component.scss']
})
export class FdsAdvertisementaddComponent implements OnInit {

  isLoading: boolean;
  selectedIndex = 0;
  eventDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  datePickerMinDate = moment(new Date()).format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(180, 'days').format('YYYY-MM-DD');
  form1: FormGroup;
  form2: FormGroup;
  mode: 'create' | 'update';
  update = 'update';
  create = 'create';
  communityList: any[] = [];
  appCutTypeList: AppCutList[] = [];
  actStatusList: AppCodeList[] = [];
  actTypeList: AppCodeList[] = [];
  form2Array: AppActdtl[] = [];
  skuListArray: AppActdtl[] = [];
  actStatusValue;
  simpleOptions: SortablejsOptions = {
    animation: 300
  };

  private actId;
  public uploaderJpg1: FileUploader;
  public uploaderJpg2: FileUploader;
  private getAppCutType$: Observable<any>;
  private getActStatus$: Observable<any>;
  private getActType$: Observable<any>;
  private getActId$: Observable<any>;
  private getComm$: Observable<any>;
  private acl_path = ApiUrl.appAdv_getNextAdvId_path;
  private appCut_path = ApiUrl. appAdv_getCut_path;
  private delete_path = ApiUrl. appAdv_delete_path;
  private file_upload_URL = ApiUrl.appAdv_file_upload_path;
  private appActType_path = ApiUrl.appAdv_act_type_path;
  private appActStatus_path = ApiUrl.appAdv_act_status_path;
  private getComm_path = ApiUrl.appQueryAllComm_path;
  private pcm_path = environment.pcm_path;
  private put_post_path = ApiUrl.appAdv_path;
  private fileUpMode = 'new';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
   private router: Router,
   private dialogRef: MatDialogRef<FdsAdvertisementaddComponent>,
   private httpService: HttpServiceService,
   public dialog: MatDialog,
   private snackbar: MatSnackBar) {
   this.isLoading = true;
  }

  ngOnInit() {
    // 判斷更新或修改
    if (this.defaults) {
      this.mode = 'update';
      this.fileUpMode = 'modify';
      // this.fileupFlag = true;
      // this.alreadyfileupFlag = true;
    } else {
      this.mode = 'create';
      this.defaults = {};
      this.fileUpMode = 'new';
    }

    // 創建表單
    this.createForm();
    // 獲取app版位,廣告狀態,廣告編號,廣告明細類別
    this.getInitAdvValue();
    // 獲取所有社區
    this.getInitAllComm();
    // 活動明細為廣告則必填一張圖片
    this.isUploadJpg1();
    // APP版位選擇-遊戲
    this.cutIdChange();
    this.uploaderJpg1 = new FileUploader({ queueLimit: 1, itemAlias: 'actJpg' });
    this.uploaderJpg2 = new FileUploader({ queueLimit: 1, itemAlias: 'actJpg' });
  }
  // 獲取app版位,廣告狀態,廣告編號,廣告明細類別
  private getInitAdvValue() {
    if (this.mode === 'create') {
    this.getActId$ = this.httpService.getRemoteData(this.acl_path);
    this.getAppCutType$ = this.httpService.getRemoteData(this.appCut_path);
    this.getActType$ = this.httpService.postData(this.appActType_path, '');
    this.getActStatus$ = this.httpService.postData(this.appActStatus_path, '');


    zip(this.getActType$, this.getActStatus$).subscribe((data) => {
      console.info('data subscribe:', data);
      const rootObject: CommRootObject[] = data;
      this.actTypeList = rootObject[0].data;
      this.actStatusList = rootObject[1].data;
      for (const i in this.actStatusList) {
        if (this.form1.get('actStatus').value === this.actStatusList[i].codeNo) {
          this.actStatusValue = this.actStatusList[i].codeExplain;
        }
      }
    });


    zip(this.getActId$, this.getAppCutType$).subscribe((data) => {
      console.info('data subscribe1:', data);
      const rootObject: RootObject[] = data;
      this.actId = rootObject[0].data;
      this.appCutTypeList = rootObject[1].data.list;
      this.form1.patchValue({ 'actId': this.actId});
      this.form2.patchValue({ 'actId': this.actId});
        this.isLoading = false;
      },
      error => {
        console.info('activityadd getInitActivityValue error', error);
        this.isLoading = false;
      });
    } else {
      this.getAppCutType$ = this.httpService.getRemoteData(this.appCut_path);
      this.getActType$ = this.httpService.postData(this.appActType_path, '');
      this.getActStatus$ = this.httpService.postData(this.appActStatus_path, '');


      zip(this.getActType$, this.getActStatus$).subscribe((data) => {
        console.info('data subscribe:', data);
        const rootObject: CommRootObject[] = data;
        this.actTypeList = rootObject[0].data;
        this.actStatusList = rootObject[1].data;
        for (const i in this.actStatusList) {
          if (this.form1.get('actStatus').value === this.actStatusList[i].codeNo) {
            this.actStatusValue = this.actStatusList[i].codeExplain;
          }
        }
      });


      zip( this.getAppCutType$).subscribe((data) => {
        console.info('data subscribe1:', data);
        const rootObject: RootObject[] = data;
        this.appCutTypeList = rootObject[0].data.list;
        this.form1.patchValue({ 'actId': this.defaults.actId });
        this.form2.patchValue({ 'actId': this.defaults.actId });
        if (this.defaults.actdtl) {
          if ((this.defaults.actdtl[0].actType === 'A' && this.defaults.actdtl[0].lastLev === 'N') ||
            (this.defaults.actdtl[0].actType === 'B')) {
            if (this.form1.get('cutId').value === 'G001_01') {
              this.form2.patchValue({ 'gameId': this.defaults.actdtl[0].sku });
            } else {
              for (let i = 0; i < this.defaults.actdtl.length; i++) {
                this.skuListArray.push(this.defaults.actdtl[i]);
              }
            }

          }
        }

        this.isLoading = false;
      },
        error => {
          console.info('activityadd getInitActivityValue error', error);
          this.isLoading = false;
        });
    }
  }

  // 獲取所有社區
  getInitAllComm() {
    this.isLoading = true;
    this.getComm$ = this.httpService.postData(this.getComm_path, '');

    zip(this.getComm$).subscribe((data) => {
      this.communityList = data[0].data;
      this.isLoading = false;
    },
    error => {
      console.info('fds-advertisementadd getInit error', error);
      this.isLoading = false;
    });
  }

  createForm() {
    // 因為新增時有commIds但沒有commId，但
    const arrayForUpdate = [this.defaults.commId];
    this.form1 = new FormGroup({
      'commId' : new FormControl(this.defaults.commId),
      'commIds' : new FormControl(arrayForUpdate || ''),
      'actId': new FormControl(this.defaults.actId || ''),
      'actDesc': new FormControl(this.defaults.actDesc || ''),
      'cutId': new FormControl(this.defaults.cutId || '', [
        Validators.required
      ]),
      'startDate': new FormControl(moment(new Date(this.defaults.startDate)).format('YYYY-MM-DD') || '', [Validators.required]),
      'endDate': new FormControl(moment(new Date(this.defaults.endDate)).format('YYYY-MM-DD') || '', [Validators.required]),
      'actStatus': new FormControl(this.defaults.actStatus || 'N')
    });

    if (this.mode === 'create') {
      this.form2 = new FormGroup({
        'actId': new FormControl(this.defaults.actId || ''),
        'actType' : new FormControl('A', [
          Validators.required
        ]),
        'actSjpgSch': new FormControl(''),
        'actBjpgSch': new FormControl(''),
        'actBjpgLink': new FormControl(''),
        'lastLev' : new FormControl('Y'),
        'gameId': new FormControl('')

      });
    } else {
      if (this.defaults.actdtl) {
        this.form2 = new FormGroup({
          'actId': new FormControl(this.defaults.actId || ''),
          'actType': new FormControl(this.defaults.actdtl[0].actType || 'A', [
            Validators.required
          ]),
          'actSjpgSch': new FormControl(this.defaults.actdtl[0].actSjpgSch || ''),
          // 'actSjpgLink': new FormControl(this.defaults.actdtl[0].actSjpgLink || ''), 20180713 PM要求拿掉actSjpgLink欄位 by hank
          'actBjpgSch': new FormControl(this.defaults.actdtl[0].actBjpgSch || ''),
          'actBjpgLink': new FormControl(this.defaults.actdtl[0].actBjpgLink || ''),
          'lastLev': new FormControl(this.defaults.actdtl[0].lastLev || 'Y'),
          'gameId': new FormControl('')
        });
      }
    }
  }

  addSkuList() {
    const confirmDialogRef = this.dialog.open(AddSkuDialogComponent, {
      data: {
        type: '1'
      }
    });
    confirmDialogRef.afterClosed().subscribe((data) => {
      console.info('商品清單號碼', data);
      console.info('商品清單號碼補0', padLeft(data, 18));
      if (data) {
        console.info('findindex', this.skuListArray.findIndex((existingCustomer) =>
          existingCustomer.sku === padLeft(data, 18)));
        if (this.skuListArray.findIndex((existingCustomer) =>
          existingCustomer.sku === padLeft(data, 18)) !== -1) {
          const confirmDialogRef2 = this.dialog.open(ComfirmDialogComponent, {
            data: {
              message: `此商品號碼${padLeft(data, 18)}已存在商品清單，確定要重複加入嗎?`,
              type: '3'
            }
          });
          confirmDialogRef2.componentInstance.dodelayCloseConfirm.subscribe(() => {
            this.addSku(padLeft(data, 18));
            confirmDialogRef2.close();
          });
        } else {
          this.addSku(padLeft(data, 18));
        }
      }

      confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
        confirmDialogRef.close();
      });
    });
  }

  addSkuListBatch() {
    const confirmDialogRef = this.dialog.open(AddSkuDialogComponent, {
      data: {
        type: '2'
      }
    });
    confirmDialogRef.afterClosed().subscribe((data) => {
      console.info('批次商品清單', data);
      if (data) {
        if (data.length <= 50) {
          for (let i = 0; i < data.length; i++) {
            data[i] = padLeft(data[i], 18);
          }
          console.info('商品清單號碼補0', data);
          this.addSkuBatch(data);
        }
      }
      confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
        confirmDialogRef.close();
      });
    });
  }

  deleteSkuList(sku_item) {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: '確定要刪除此商品嗎？',
        type: '3'
      }
    });
    confirmDialogRef.componentInstance.dodelayCloseConfirm.subscribe(() => {
      this.skuListArray.splice(this.skuListArray.findIndex((existingCustomer) =>
        existingCustomer.sku === sku_item.sku), 1);
      confirmDialogRef.close();
    });
    // console.info('delete 後', this.skuListArray.length);
    console.info('all array', this.skuListArray);
  }

  addSku(skuNumber) {
    this.isLoading = true;
    const kcToken = localStorage.getItem('kc_token');
    this.httpService.getSkuData(`${this.pcm_path}?code=${skuNumber}&sys=crm`, kcToken)
      .subscribe((result: PcmSkubject) => {
        this.isLoading = false;
        console.info('PcmSkubject aaa', result);
        if (result.status === 'Success') {
          const temp_sku = result.skuNumber;
          const temp_sku_skuName = result.skuName;
          let temp_sku_skuJpgSch;
          for (const i in result.galleryImage01) {
            if (result.galleryImage01[i].size === '450x450') {
              temp_sku_skuJpgSch = result.galleryImage01[i].url;
            }
          }
          if (!temp_sku_skuJpgSch) {
            this.snackbar.open('此商品無450x450圖片', null, {
              duration: 5000
            });
          }
          this.skuListArray.push({
            actId: this.form1.get('actId').value,
            skuName: temp_sku_skuName,
            sku: temp_sku,
            skuJpgSch: temp_sku_skuJpgSch
          });
        } else {
          switch (result.err_CODE) {
            case '600': {
              this.snackbar.open(result.err_MSG, null, {
                duration: 5000
              });
              break;
            }
            case '601': {
              this.snackbar.open(result.err_MSG, null, {
                duration: 5000
              });
              break;
            }
            case '602': {
              this.snackbar.open(result.err_MSG, null, {
                duration: 5000
              });
              break;
            }
            default: {
              this.snackbar.open('無定義錯誤代碼，請洽管理人員', null, {
                duration: 5000
              });
              break;
            }
          }

        }

      },
        error => {
          console.error('get pcm data error', error);
          this.isLoading = false;
        });
  }

  addSkuBatch(skuList) {
    this.isLoading = true;
    const kcToken = localStorage.getItem('kc_token');
    let success = 0;
    let fail_600 = 0; let fail_601 = 0; let fail_602 = 0; let fail_undefine = 0;
    for (let j = 0; j < skuList.length; j++) {
      this.httpService.getSkuData(`${this.pcm_path}?code=${skuList[j]}&sys=crm`, kcToken)
        .subscribe((result: PcmSkubject) => {
          if (result.status === 'Success') {
            success++;
            const temp_sku = result.skuNumber;
            const temp_sku_skuName = result.skuName;
            let temp_sku_skuJpgSch;
            for (const i in result.galleryImage01) {
              if (result.galleryImage01[i].size === '450x450') {
                temp_sku_skuJpgSch = result.galleryImage01[i].url;
              }
            }
            this.skuListArray.push({
              actId: this.form1.get('actId').value,
              skuName: temp_sku_skuName,
              sku: temp_sku,
              skuJpgSch: temp_sku_skuJpgSch
            });
          } else {
            switch (result.err_CODE) {
              case '600': {
                fail_600++;
                break;
              }
              case '601': {
                fail_601++;
                break;
              }
              case '602': {
                fail_602++;
                break;
              }
              default: {
                fail_undefine++;
                break;
              }
            }

          }
          if (skuList.length === success + fail_600 + fail_601 + fail_602 + fail_undefine) {
            this.snackbar.open(`上傳${skuList.length}筆，成功${success}筆，失敗${fail_600 +
              fail_601 + fail_602 + fail_undefine}筆`, '我知道了');
            this.isLoading = false;
          }
        },
          error => {
            console.error('get pcm data error', error);
          });

    }
  }

  reset(data) {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: '確定要重設頁面嗎？',
        type: '3'
      }
    });
    confirmDialogRef.componentInstance.dodelayCloseConfirm.subscribe(() => {
      if (data === 'form1') {
        this.form1.reset();
        if (this.mode === 'create') {
          this.form1.patchValue({ 'actId': this.actId });
        } else {
           this.form1.patchValue({ 'actId': this.defaults.actId });
        }
        this.snackbar.open('已重設「活動主檔」所有欄位', null, {
          duration: 5000
        });
      } else {
        this.form2.reset();
        this.uploaderJpg1.clearQueue();
        this.form2.get('actSjpgSch').setValue('');
        this.form2.get('actBjpgSch').setValue('');
        this.uploaderJpg2.clearQueue();
        if (this.mode === 'create') {
          this.form2.patchValue({ 'actId': this.actId });
        } else {
           this.form2.patchValue({ 'actId': this.defaults.actId });
        }
        this.snackbar.open('已重設「活動明細」所有欄位', null, {
          duration: 5000
        });
      }
      confirmDialogRef.close();
    });
   }

   nextStep() {
    if (moment(this.form1.get('startDate').value).format(this.eventDateFormat) >
      moment(this.form1.get('endDate').value).format(this.eventDateFormat)) {
      this.snackbar.open('注意!「生效起日」比「生效迄日」大', null, {
        duration: 5000
      });
    } else {
      this.selectedIndex += 1;
    }
   }

  previousStep() {
    this.selectedIndex -= 1;
  }

  // 針對更新時才會顯示的刪除社區BUTTON
  deleteClick() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent,
      {
        data: {

          message: `確定要刪除嗎？(新增活動${this.form1.get('actId').value})`,
          type: '1'
        }
      });
      confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
        const actId_value = this.form1.get('actId').value;
        const commId_value: any[] = this.form1.get('commIds').value;
        this.deleteData(actId_value, commId_value);
      });
  }

  private deleteData(actId_value, commId_value) {
    this.httpService.deleteData(`${this.delete_path}${commId_value}/${actId_value}`)
    .subscribe((result: RootObject) => {
      this.showSubmitResult(result.message, result.status, '刪除');
    },
      error => {
        console.error(error);
      });
  }

  fileUploadSubmit(data) {
    this.isLoading = true;
    this.uploaderJpg1.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('commIds').value.join()}/${this.form1.get('actId').value}/${this.fileUpMode}`;
    };
    this.uploaderJpg2.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('commIds').value.join()}/${this.form1.get('actId').value}/${this.fileUpMode}`;

    };
    console.info('file uploaderJpg1', this.uploaderJpg1); // 上傳資訊
    const kcToken = localStorage.getItem('kc_token');
     if (data === 'JPG1') {
     this.uploaderJpg1.authTokenHeader = 'Authorization';
     this.uploaderJpg1.authToken = `Bearer ${kcToken}`;
     this.uploaderJpg1.uploadAll();
     this.uploaderJpg1.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
     this.uploaderJpg1.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, data);
     } else {
      console.info('file uploaderJpg2', this.uploaderJpg2.response);
      this.uploaderJpg2.authTokenHeader = 'Authorization';
      this.uploaderJpg2.authToken = `Bearer ${kcToken}`;
      this.uploaderJpg2.uploadAll();
      this.uploaderJpg2.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
      this.uploaderJpg2.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, data);

     }
    }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    console.info('file server fail response', response);
    this.isLoading = false;
    this.snackbar.open(`連線檔案上傳Server失敗，請洽管理人員`, '我知道了');
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders, data: any): any {
    const resault: RootObject = JSON.parse(response);
    this.isLoading = false;
    console.info('file success', resault);
    if (resault.status === 'SUCCESS') {
      this.snackbar.open('上傳成功', null, {
        duration: 5000
      });
      if (data === 'JPG1') {
        this.form2.get('actSjpgSch').setValue(resault.data);
        console.info('file success JPG1', this.form2.get('actSjpgSch').value);
      } else {
        this.form2.get('actBjpgSch').setValue(resault.data);
        console.info('file success JPG2', this.form2.get('actBjpgSch').value);
      }
    } else {
      this.snackbar.open(`上傳失敗，原因：${resault.message}`, '我知道了', {
        duration: 5000
      });
    }
  }

  serverFileRemove(data) {
    // console.info();
    if (data === 'JPG1') {
      if (this.form2.get('actSjpgSch').value) {
        this.form2.get('actSjpgSch').setValue('');
      }
    } else {
      if (this.form2.get('actBjpgSch').value) {
        this.form2.get('actBjpgSch').setValue('');
      }
    }

  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  // 提交BUTTON
  onSubmit() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要儲存嗎？(活動代碼${this.form1.get('actId').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      console.info('this.fom1.value', this.form1.value);
      console.info('this.fom2.value', this.form2.value);
      const temp: AppActMstList = {
      'commIds' : this.form1.get('commIds').value,
      'actId' : this.form1.get('actId').value,
      'actStatus' : this.form1.get('actStatus').value,
      'cutId' : this.form1.get('cutId').value,
      'startDate' : moment(new Date(this.form1.get('startDate').value)).format(this.eventDateFormat),
      'endDate' : moment(new Date(this.form1.get('endDate').value)).format(this.eventDateFormat),
      'actDesc' : this.form1.get('actDesc').value,
      'actdtl' : []
    };
      // console.info(temp);
      let num = 0;
      if (this.form2.get('actType').value === 'B') {
         this.form2.patchValue({ 'actBjpgLink': '', 'actSjpgSch': '', 'actBjpgSch': '', 'lastLev': '' });
         this.skuListArray.forEach(stock => {
           stock.skuSeq = num + 1;
           stock.commId = this.form1.get('commId').value,
           stock.actId = this.form1.get('actId').value,
           stock.actType = this.form2.get('actType').value;
           // stock.actSjpgLink = this.form2.get('actSjpgLink').value; 20180713 PM要求拿掉actSjpgLink欄位 by hank
           stock.actBjpgLink = this.form2.get('actBjpgLink').value;
           stock.actSjpgSch = this.form2.get('actSjpgSch').value;
           stock.actBjpgSch = this.form2.get('actBjpgSch').value;
           stock.lastLev = this.form2.get('lastLev').value;
           this.form2Array.push(stock);
           num++;
         });
        } else {
          if (this.form2.get('lastLev').value === 'N') {
            if (this.form1.get('cutId').value === 'G001_01') {
              const arr: AppActdtl = {
                'commId': this.form1.get('commId').value,
                'actId': this.form1.get('actId').value,
                'skuName': 'GAME',
                'sku': this.form2.get('gameId').value,
                'skuSeq': 1,
                'actType': this.form2.get('actType').value,
                'actBjpgLink': this.form2.get('actBjpgLink').value,
                'actSjpgSch': this.form2.get('actSjpgSch').value,
                'actBjpgSch': this.form2.get('actBjpgSch').value,
                'lastLev': this.form2.get('lastLev').value
              };
              // console.log(arr);
              this.form2Array.push(arr);
            } else {
              this.skuListArray.forEach(stock => {
                stock.skuSeq = num + 1;
                stock.commId = this.form1.get('commId').value,
                stock.actType = this.form2.get('actType').value;
                stock.actBjpgLink = this.form2.get('actBjpgLink').value;
                stock.actSjpgSch = this.form2.get('actSjpgSch').value;
                stock.actBjpgSch = this.form2.get('actBjpgSch').value;
                stock.lastLev = this.form2.get('lastLev').value;
                // console.log( stock);
                this.form2Array.push(stock);
                num++;
              });
            }
          } else {
              // console.log(this.form2.value);
              const arr: AppActdtl = {
                'commId': this.form1.get('commId').value,
                'actId': this.form1.get('actId').value,
                'skuName': '',
                'sku': '',
                'skuSeq': ' ',
                'actType': this.form2.get('actType').value,
                'actBjpgLink': this.form2.get('actBjpgLink').value,
                'actSjpgSch': this.form2.get('actSjpgSch').value,
                'actBjpgSch': this.form2.get('actBjpgSch').value,
                'lastLev': this.form2.get('lastLev').value
              };
              this.form2Array.push(arr);
          }
    }
    // console.log(this.form2Array);
    temp.actdtl = this.form2Array;
    if (this.mode === 'create') {
      this.postData(temp);
    } else {
      this.putData(temp);
    }
     (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
    }
    );

  }

  // 廣告新增
  private postData(temp) {
    console.info(temp);
    this.httpService.postData(this.put_post_path, temp)
    .subscribe((result: RootObject) => {
      this.showSubmitResult(result.message, result.status, '儲存');
      this.isLoading = false;
    },
    error => {
      console.error(error);
      this.isLoading = false;
    });

    this.isLoading = false;
  }

  // 廣告更新
  private putData(temp) {
    console.info(temp);
    this.httpService.putData(this.put_post_path, temp)
      .subscribe((result: RootObject) => {
        this.showSubmitResult(result.message, result.status, '儲存');
        this.isLoading = false;
      },
        error => {
          console.error(error);
          this.isLoading = false;
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

  // APP版位選擇-遊戲
  cutIdChange() {
    if (this.form1.get('cutId').value === 'G001_01') {
      this.form2.get('actType').setValue('A');
      this.form2.get('actType').disable();
      this.form2.get('lastLev').setValue('N');
      this.form2.get('lastLev').disable();
      this.form2.controls['gameId'].setValidators([Validators.required]);
      this.form2.controls['gameId'].updateValueAndValidity();

    } else {
      this.form2.get('actType').enable();
      this.form2.get('lastLev').enable();
      this.form2.controls['gameId'].clearValidators();
      this.form2.controls['gameId'].updateValueAndValidity();
    }
  }

  // 活動明細為廣告則必填一張圖片
  isUploadJpg1() {
    if (this.form2.get('actType').value === 'A') {
      this.form2.controls['actSjpgSch'].setValidators([Validators.required]);
      this.form2.controls['actSjpgSch'].updateValueAndValidity();
      this.form2.controls['lastLev'].setValidators([Validators.required]);
      this.form2.controls['lastLev'].updateValueAndValidity();
    } else {
      this.form2.controls['actSjpgSch'].clearValidators();
      this.form2.controls['actSjpgSch'].updateValueAndValidity();
      this.form2.controls['lastLev'].clearValidators();
      this.form2.controls['lastLev'].updateValueAndValidity();
    }
  }

  handleFileInput(files: File[], data) {
    if (data === 'JPG1') {
      this.uploaderJpg1.clearQueue();
      const temp = files;
      this.uploaderJpg1.addToQueue(temp);
    } else {
      this.uploaderJpg2.clearQueue();
      const temp = files;
      this.uploaderJpg2.addToQueue(temp);
    }

}
}

interface AppAdvList {
  actId?: string;
  advDesc?: string;
  cutId?: any;
  advStatus?: any;
  advType?: any;
  advdtl: AppAdvdtl[];
}
interface AppAdvdtl {
  actId?: string;
  advType?: any;
  advSjpgSch?: any;
  advBjpgSch?: any;
  advBjpgLink?: any;
  lastLev?: any;
}

