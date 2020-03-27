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
import { AddSkuDialogComponent } from './add-sku-dialog/add-sku-dialog.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RootObject, AppCodeList, AppCutList, ActdtlTemp, AppActdtl, AppActMstList } from '../../api-result/api-result.interface';
import { SortablejsOptions } from 'angular-sortablejs';
import { PcmSkubject } from '../../api-result/pcm-sku.interface';
// import { ActdtlTemp, AppActList, Actdtl } from '../../api-result/app-act.interface';
import { ApiUrl } from '../../../environments/api-url';
import { zip  } from 'rxjs';
// interface Tesss {
//   actId: string;
//   actDtlSeq?: number;
//   actType?: any;
//   actSjpgSch?: any;
//   jpgSeq?: any;
//   actSjpgLink?: any;
//   actBjpgSch?: any;
//   actBjpgLink?: any;
//   sku?: any;
//   skuName?: any;
//   skuSeq?: any;
//   skuJpgSch?: any;
//   lastLev?: any;
//   createDate?: any;
//   creator?: any;
//   modifyDate?: any;
//   modifier?: any;
// }

@Component({
  selector: 'fury-activityadd',
  templateUrl: './activityadd.component.html',
  styleUrls: ['./activityadd.component.scss']
})

export class ActivityaddComponent implements OnInit {
  isLoading: boolean;
  eventDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  datePickerMinDate = moment(new Date()).format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(180, 'days').format('YYYY-MM-DD');
  skuListArray: AppActdtl[] = [];
  form2Array: AppActdtl[] = [];
  actStatusValue;
  form1: FormGroup;
  form2: FormGroup;
  selectedIndex = 0;
  private fileUpMode;
  private actId;
  mode: 'create' | 'update' = 'create';
  // fileupFlag = false;
  // alreadyfileupFlag = false;
  public uploaderJpg1: FileUploader;
  public uploaderJpg2: FileUploader;
  private appCodes_path = ApiUrl.appCodes_path;
  private delete_path = ApiUrl.appAct_delete_path;
  private acl_path = ApiUrl.appAct_getNextActId_path;
  private appCut_path = ApiUrl.appCut_path;
  private file_upload_URL = ApiUrl.appAct_file_upload_path;
  private pcm_path = environment.pcm_path;
  private put_post_path = ApiUrl.appAct_path;
  private getActType$: Observable<any>;
  private getActId$: Observable<any>;
  private getAppCutType$: Observable<any>;
  private getActStatus$: Observable<any>;
  private getChannelId$: Observable<any>;
  actStatusList: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  actTypeList: AppCodeList[] = [];
  appCutTypeList: AppCutList[] = [];
  simpleOptions: SortablejsOptions = {
    animation: 300
  };


  constructor(private httpService: HttpServiceService,
    private dialogRef: MatDialogRef<ActivityaddComponent>,
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
      // this.fileupFlag = true;
      // this.alreadyfileupFlag = true;
    } else {
      this.defaults = {};
      this.fileUpMode = 'new';
    }
    console.info('this.mode=', this.mode);
    this.createForm();
    this.getInitActivityValue();
    this.isUploadJpg1();
    this.cutIdChange();
    this.uploaderJpg1 = new FileUploader({ queueLimit: 1, itemAlias: 'actJpg' });
    this.uploaderJpg2 = new FileUploader({ queueLimit: 1, itemAlias: 'actJpg' });
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
  deleteSkuList(sku_item) {
    // console.info('delete 前', this.skuListArray.length);
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: '確定要刪除此商品嗎？',
        type: '3'
      }
    });
    confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
      this.skuListArray.splice(this.skuListArray.findIndex((existingCustomer) =>
        existingCustomer.sku === sku_item.sku), 1);
      confirmDialogRef.close();
    });
    // console.info('delete 後', this.skuListArray.length);
    console.info('all array', this.skuListArray);
  }
  addSkuList() {
    const confirmDialogRef = this.dialog.open(AddSkuDialogComponent, {
      data: {
        type: '1'
      }
    });
    // this.dialog.open(AddSkuDialogComponent);
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
          confirmDialogRef2.componentInstance.doConfirm3.subscribe(() => {
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
  addSku(skuNumber) {
    
    this.isLoading = true;
    const kcToken = localStorage.getItem('kc_token');
    this.httpService.getSkuData(`${this.pcm_path}?code=${skuNumber}&sys=crm`, kcToken)
      .subscribe((result: PcmSkubject) => {
        this.isLoading = false;
        console.info('PcmSkubject aaa', result);
        if (result.status === 'Success') {
          // APP 精選商品需要檢查是否有價錢
          const cutId = this.form1.get('cutId').value;
          if (cutId === 'A001_03') {
            if (!result.ecallowedToSell) {
              this.snackbar.open(`商品(${result.skuNumber})無售價，不可加入！`, null, {
                duration: 5000
              });
              return;
            }
          }
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
    let errorSku = '';
    for (let j = 0; j < skuList.length; j++) {
      this.httpService.getSkuData(`${this.pcm_path}?code=${skuList[j]}&sys=crm`, kcToken)
        .subscribe((result: PcmSkubject) => {
          if (result.status === 'Success') {
            // APP 精選商品需要檢查是否有價錢
            const cutId = this.form1.get('cutId').value;
            if (cutId === 'A001_03') {
              if (!result.ecallowedToSell) {
                errorSku += `${result.skuNumber},`;
                fail_600++;               
              } else {
                success = this.addSku2Array(success, result);
              }
            } else {
              success = this.addSku2Array(success, result);
            }
            
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
            let errorMsg = `上傳${skuList.length}筆，成功${success}筆，失敗${fail_600 +
              fail_601 + fail_602 + fail_undefine}筆`;
            if (errorSku.length > 0) {
              errorMsg +=`，以下商品無售價，不可加入(${ errorSku.substring(0, errorSku.length - 1) })`;
              }
            this.snackbar.open(errorMsg, '我知道了');
            this.isLoading = false;
          }
        },
          error => {
            console.error('get pcm data error', error);
          });

    }
  }

  private addSku2Array(success: number, result: PcmSkubject) {
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
    return success;
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

  onSubmit() {

    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要儲存嗎？(活動代碼${this.form1.get('actId').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      // this.form2.get('actDtlSeq').setValue('1');
      console.info('this.form1.value', this.form1.value);
      console.info('this.form2.value', this.form2.value);
      const temp: AppActMstList = this.form1.value;
      temp.startDate = moment(new Date(temp.startDate)).format(this.eventDateFormat);
      temp.endDate = moment(new Date(temp.endDate)).format(this.eventDateFormat);
      if (!(temp.actDesc === null)) {
        temp.actDesc = temp.actDesc.trim();
      }
      let num = 0;
      if (this.form2.get('actType').value === 'B') {

        // 20180713 PM要求拿掉actSjpgLink欄位 by hank
        this.form2.patchValue({ 'actBjpgLink': '', 'actSjpgSch': '', 'actBjpgSch': '', 'lastLev': '' });
        // this.form2.patchValue({ 'actSjpgLink': '', 'actBjpgLink': '', 'actSjpgSch': '', 'actBjpgSch': '', 'lastLev': '' });
        // this.form2Array.push(this.form2.value);
        this.skuListArray.forEach(stock => {
          stock.skuSeq = num + 1;
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
            this.form2Array.push(arr);
          } else {
            this.skuListArray.forEach(stock => {
              stock.skuSeq = num + 1;
              stock.actType = this.form2.get('actType').value;
              // stock.actSjpgLink = this.form2.get('actSjpgLink').value; 20180713 PM要求拿掉actSjpgLink欄位 by hank
              stock.actBjpgLink = this.form2.get('actBjpgLink').value;
              stock.actSjpgSch = this.form2.get('actSjpgSch').value;
              stock.actBjpgSch = this.form2.get('actBjpgSch').value;
              stock.lastLev = this.form2.get('lastLev').value;
              this.form2Array.push(stock);
              num++;
            });
          }
        } else {
          this.form2Array.push(this.form2.value);
        }
      }

      temp.actdtl = this.form2Array;
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
  createForm() {
    this.form1 = new FormGroup({
      'actId': new FormControl(this.defaults.actId || ''),
      'actDesc': new FormControl(this.defaults.actDesc || ''),
      'cutId': new FormControl(this.defaults.cutId || '', [
        Validators.required
      ]),
      'channelId': new FormControl(this.defaults.channelId || '', [Validators.required]),
      'startDate': new FormControl(moment(new Date(this.defaults.startDate)).format('YYYY-MM-DD') || '', [Validators.required]),
      'endDate': new FormControl(moment(new Date(this.defaults.endDate)).format('YYYY-MM-DD') || '', [Validators.required]),
      'actStatus': new FormControl(this.defaults.actStatus || 'N'),
    });
    if (this.mode === 'create') {
      this.form2 = new FormGroup({

        'actId': new FormControl(this.defaults.actId || ''),
        'actType': new FormControl('A', [
          Validators.required
        ]),
        'actSjpgSch': new FormControl(''),
        // 'actSjpgLink': new FormControl(''),  20180713 PM要求拿掉actSjpgLink欄位 by hank
        'actBjpgSch': new FormControl(''),
        'actBjpgLink': new FormControl(''),
        'lastLev': new FormControl('Y'),
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
  private getInitActivityValue() {
    if (this.mode === 'create') {
      this.getActId$ = this.httpService.getRemoteData(this.acl_path);
      this.getAppCutType$ = this.httpService.getRemoteData(this.appCut_path);
      this.getActType$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=act_type'));
      this.getActStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=act_status'));
      this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));
        zip(this.getActId$, this.getActType$, this.getAppCutType$, this.getActStatus$, this.getChannelId$).subscribe((data) => {
          console.info('data subscribe:', data);
          const rootObject: RootObject[] = data;
          this.actId = rootObject[0].data;
          this.actTypeList = rootObject[1].data.list;
          this.appCutTypeList = rootObject[2].data.list;
          this.actStatusList = rootObject[3].data.list;
          this.getChannelId = rootObject[4].data.list;
          this.form1.patchValue({ 'actId': this.actId });
          this.form2.patchValue({ 'actId': this.actId });
          for (const i in this.actStatusList) {
            if (this.form1.get('actStatus').value === this.actStatusList[i].codeNo) {
              this.actStatusValue = this.actStatusList[i].codeExplain;
            }
          }
          this.uploaderJpg1.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('actId').value}/${this.fileUpMode}`;
          };
          this.uploaderJpg2.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('actId').value}/${this.fileUpMode}`;
          };
          this.isLoading = false;
        },
          error => {
            console.info('activityadd getInitActivityValue error', error);
            this.isLoading = false;
          });
    } else {
      this.getAppCutType$ = this.httpService.getRemoteData(this.appCut_path);
      this.getActType$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=act_type'));
      this.getActStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=act_status'));
      this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));
        zip(this.getActType$, this.getAppCutType$, this.getActStatus$, this.getChannelId$).subscribe((data) => {
          console.info('data subscribe:', data);
          const rootObject: RootObject[] = data;
          this.actTypeList = rootObject[0].data.list;
          this.appCutTypeList = rootObject[1].data.list;
          this.actStatusList = rootObject[2].data.list;
          this.getChannelId = rootObject[3].data.list;
          this.form1.patchValue({ 'actId': this.defaults.actId });
          this.form2.patchValue({ 'actId': this.defaults.actId });
          for (const i in this.actStatusList) {
            if (this.form1.get('actStatus').value === this.actStatusList[i].codeNo) {
              this.actStatusValue = this.actStatusList[i].codeExplain;
            }
          }
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
          this.uploaderJpg1.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('actId').value}/${this.fileUpMode}`;
          };
          this.uploaderJpg2.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            item.url = `${environment.ApiHost}${this.file_upload_URL}${this.form1.get('actId').value}/${this.fileUpMode}`;
          };

          this.isLoading = false;
        },
          error => {
            console.info('activityadd getInitActivityValue error', error);
            this.isLoading = false;
          });
    }
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
  reset(data) {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: '確定要重設頁面嗎？',
        type: '3'
      }
    });
    confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
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
        this.skuListArray.splice(0, this.skuListArray.length);
        this.snackbar.open('已重設「活動明細」所有欄位', null, {
          duration: 5000
        });
      }
      confirmDialogRef.close();
    });

  }
  previousStep() {
    this.selectedIndex -= 1;
  }
  isUpdateMode() {
    return this.mode === 'update';
  }
  deleteClick() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要刪除嗎？(活動編號${this.form1.get('actId').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      const actId_value = this.form1.get('actId').value;
      this.deleteData(actId_value);
    });
  }


  private deleteData(actId_value) {
    this.httpService.deleteData(`${this.delete_path}${actId_value}`)
      .subscribe((result: RootObject) => {
        this.showSubmitResult(result.message, result.status, '刪除');
      },
        error => {
          console.error(error);
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
      // else {
      //   if (this.form1.get('msgYn').value === 'Y') {
      //     const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      //       data: {
      //         message: '是否要導轉到訊息設定頁面？',
      //         type: '2'
      //       }
      //     });
      //     confirmDialogRef.componentInstance.doConfirm2.subscribe(() => {
      //       this.router.navigateByUrl(`apps/messageadd/${this.form1.get('marketId').value}/marketId`);
      //     });
      //   }
      // }
      this.snackbar.open(`${wording}成功`, null, {
        duration: 5000
      });
    } else {
      this.snackbar.open(`${wording}異常，請洽相關窗口`, '我知道了');
    }
  }
  fileUploadSubmit(data) {
    this.isLoading = true;
    console.info('data', data);
    const kcToken = localStorage.getItem('kc_token');
    if (data === 'JPG1') {
      console.info('file uploaderJpg1', this.uploaderJpg1);
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
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders, data: any): any {
    const resault: RootObject = JSON.parse(response);
    this.isLoading = false;
    console.info('file success', resault);
    if (resault.status === 'SUCCESS') {
      this.snackbar.open('上傳成功', null, {
        duration: 5000
      });
      if (data === 'JPG1') {
        // this.fileupFlag = true;
        // this.alreadyfileupFlag = true;

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
  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    console.info('file server fail response', response);
    this.snackbar.open(`連線檔案上傳Server失敗，請洽管理人員`, '我知道了');
    this.isLoading = false;
    // console.info('this upload item 2=', item);
  }
  isUploadJpg1() {

    //   if (this.mode === 'create') {
    //     if (this.form2.get('actType').value === 'A') {
    //       if (this.alreadyfileupFlag === false) {
    //         this.fileupFlag = false;
    //       }
    //       this.form2.controls['lastLev'].setValidators([Validators.required]);
    //       this.form2.controls['lastLev'].updateValueAndValidity();
    //     } else {
    //       this.fileupFlag = true;
    //     }
    //   }
    // }


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
  // app版位選擇click
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
}


export function padLeft(str, len) {
  str = '' + str;
  if (str.length >= len) {
    return str;
  } else {
    return padLeft('0' + str, len);
  }
}
