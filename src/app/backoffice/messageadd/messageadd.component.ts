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
import { Router, ActivatedRoute } from '@angular/router';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
import {
  RootObject, AppCouponMstList, AppBonusMstList, AppMsgMstList, AppCodeList,
  AppActMstList
} from '../../api-result/api-result.interface';
// import { AppMsgMstObject, AppMsgMstList } from '../../api-result/app-msg-mst.interface';
import { ApiUrl } from '../../../environments/api-url';
import { zip } from 'rxjs';
// import { AppBonusMstList, AppBonusMstObject } from '../../api-result/app-bonus-mst.interface';
// import { AppCouponMstList } from '../../api-result/app-coupon-mst.interface';
export interface AppCouponBonusMstList {
  grno: string;
  channelId: string;
  marketId: string;
  msgId?: any;
  grStatus?: string;
  bsStatus?: string;
  msgYn: string;
}
@Component({
  selector: 'fury-messageadd',
  templateUrl: './messageadd.component.html',
  styleUrls: ['./messageadd.component.scss']
})

export class MessageaddComponent implements OnInit {
  isLoading: boolean;
  form1: FormGroup;
  form2: FormGroup;
  msgStatusValue;
  piGiFlag = false;
  eventDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  private MsgId;
  datePickerMinDate = moment(new Date()).format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(180, 'days').format('YYYY-MM-DD');
  fileupFlag = true;
  uploadMemberFileDisable = true;
  fileupProcess = '等待上傳';
  // id = '5566'; source = 'hank';
  // mode: 'create' | 'update' | 'redirect' = 'create';
  mode: 'create' | 'update' = 'create';
  msgTypeMode: 'other' | 'gmode' | 'pmode' = 'other';
  memberDsicript = null;
  selectedIndex = 0;
  // channelId = null;
  private messageId = null;
  private getMsgType$: Observable<any>;
  private getApplyMem$: Observable<any>;
  private getMsgId$: Observable<any>;
  private postMsgData$: Observable<any>;
  private getMsgStatus$: Observable<any>;
  private getChannelId$: Observable<any>;
  private putMsgId$: Observable<any>;
  public uploaderJpg: FileUploader;
  public uploaderMem: FileUploader;
  msgTypeList: AppCodeList[] = [];
  ApplyMemList: AppCodeList[] = [];
  getMsgStatus: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  // private appCodes_path = '/loyalty/employee/appCodes';
  // private acl_path = 'loyalty/employee/getNextMsgId';
  // private memfile_upload_URL = '/loyalty/employee/appMsgDtl/';
  // private jpgfile_upload_URL = '/loyalty/employee/appMsgMstJpg/';
  // private put_post_path = 'loyalty/employee/appMsgMst';
  // private putCoupon_path = 'loyalty/employee/appCoupon';
  // private putBonus_path = 'loyalty/employee/appBonus';
  // private delete_path = 'loyalty/employee/appMsgMst/';
  private appCodes_path = ApiUrl.appCodes_path;
  private acl_path = ApiUrl.appMsg_getNextMsgId_path;
  private memfile_upload_URL = ApiUrl.appMsg_memfile_upload_path;
  private jpgfile_upload_URL = ApiUrl.appMsg_jpgfile_upload_path;
  private put_post_path = ApiUrl.appMsg_path;
  private putCoupon_path = ApiUrl.appCoupon_path;
  private putBonus_path = ApiUrl.appBonus_path;
  private delete_path = ApiUrl.appMsg_delete_path;
  readOnlyFlag = false;
  private fileUpMode;
  private source;
  private id;
  constructor(private httpService: HttpServiceService,
    private dialogRef: MatDialogRef<MessageaddComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) {
    this.isLoading = true;
  }

  ngOnInit() {
    // this.source = this.route.snapshot.params['source'];
    // this.id = this.route.snapshot.params['id'];
    if (this.defaults) {
      this.mode = 'update';
      this.fileUpMode = 'modify';
      this.memberDsicript = this.defaults.applyMem_TW;
      this.setFileupControl(this.defaults.applyMem);
      this.createForm();
      this.activityClick();
      this.getInitMsgValue();
    }
    // } else if (this.source && this.id) {
    //   this.mode = 'redirect';
    //   this.readOnlyFlag = true;
    //   this.fileUpMode = 'new';
    // }
    else {
      this.defaults = {};
      this.fileUpMode = 'new';
      this.createForm();
      this.getInitMsgValue();
      this.activityClick();
    }
    this.uploaderJpg = new FileUploader({ queueLimit: 1, itemAlias: 'msgMstJpg' });
    this.uploaderMem = new FileUploader({ queueLimit: 1, itemAlias: 'memberIdFile' });
  }
  deleteClick() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要刪除嗎？(訊息代碼${this.form1.get('msgId').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      const value = this.form1.get('msgId').value;
      this.deleteData(value);
    });

  }
  private deleteData(value) {
    this.httpService.deleteData(`${this.delete_path}${value}`)
      .subscribe((result: RootObject) => {
        // console.info('post subscribe:', grnoTypeObject.status);
        // console.info('delete result:', result);
        this.showSubmitResult(result.message, result.status, '刪除');
      },
        error => {
          console.error(error);
        });
  }
  nextStep() {
    // if (this.form1.get('msgSendDate').value > this.form1.get('msgEndDate').value) {
    if (moment(this.form1.get('msgSendDate').value).format('YYYY-MM-DD')
      > moment(this.form1.get('msgEndDate').value).format('YYYY-MM-DD')) {
      this.snackbar.open('注意!「發送日期」比「結束日期」大', null, {
        duration: 5000
      });
    } else {
      this.selectedIndex += 1;
    }
  }
  private putMsg(temp) {
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
  // idValid() {
  //   if (this.msgTypeMode === 'pmode' || this.msgTypeMode === 'gmode') {
  //     const id = this.msgTypeMode === 'pmode' ? this.form1.get('marketId').value : this.form1.get('grno').value;
  //     const url = this.msgTypeMode === 'pmode' ?
  //       `${ApiUrl.appBonuss_path}?marketId=${id.trim()}` :
  //       `${ApiUrl.appCoupons_path}?grno=${id.trim()}`;
  //     console.info('url=', url);
  //     this.httpService.getRemoteData(url)
  //       .subscribe((root: RootObject) => {
  //         console.info('root', root);
  //         if (root.status === 'SUCCESS') {
  //           const stockList: AppCouponBonusMstList[] = root.data.list;
  //           if (root.data.total === 1) {
  //             if (stockList[0].msgYn === 'N') {
  //               const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
  //                 data: {
  //                   message: `此${this.msgTypeMode === 'pmode' ?
  //                     '紅利點數' : '折價券'}活動代碼訊息設定為「不發送」，請輸入其他活動代碼`,
  //                   type: '1'
  //                 }
  //               });
  //               this.form1.get(this.msgTypeMode === 'pmode' ? 'marketId' : 'grno').setValue('');
  //               this.form1.get('channelId').setValue('');
  //             } else if (stockList[0].bsStatus === 'D' || stockList[0].grStatus === 'D') {
  //               const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
  //                 data: {
  //                   message: `此${this.msgTypeMode === 'pmode' ?
  //                     '紅利點數' : '折價券'}活動狀態為「刪除」，請輸入其他活動代碼`,
  //                   type: '1'
  //                 }
  //               });
  //               this.form1.get(this.msgTypeMode === 'pmode' ? 'marketId' : 'grno').setValue('');
  //               this.form1.get('channelId').setValue('');
  //             } else {
  //               this.form1.get('channelId').setValue(stockList[0].channelId);
  //               this.messageId = stockList[0].msgId;
  //             }

  //           } else {
  //             this.snackbar.open(`${this.msgTypeMode === 'pmode' ?
  //               '紅利點數' : '折價券'}活動代碼錯誤，請重新輸入`, null, {
  //                 duration: 5000
  //               });
  //             this.form1.get(this.msgTypeMode === 'pmode' ? 'marketId' : 'grno').setValue('');
  //             this.form1.get('channelId').setValue('');
  //           }
  //         } else {
  //           this.snackbar.open('系統錯誤，請洽相關窗口', null, {
  //             duration: 5000
  //           });
  //         }
  //       });
  //   }

  // }
  private postMsg(temp) {
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
  onSubmit() {
    if ((this.uploaderJpg.queue.length >= 1) && !(this.form1.get('msgJpg').value)) {
      this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: `請上傳訊息圖片至雲端，不上傳請移除訊息圖片`,
          type: '1'
        }
      });
    } else {
      const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: `確定要儲存嗎？(訊息活動代碼${this.form1.get('msgId').value})`,
          type: '3'
        }
      });

      confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
        const temp: AppMsgMstList = this.form1.value;
        this.isLoading = true;
        temp.msgSendDate = moment(new Date(temp.msgSendDate)).format(this.eventDateFormat);
        temp.msgEndDate = moment(new Date(temp.msgEndDate)).format(this.eventDateFormat);


        if (!(temp.msgSub === null)) {
          temp.msgSub = temp.msgSub.trim();
        }
        if (!(temp.msgTxt === null)) {
          temp.msgTxt = temp.msgTxt.trim();
        }
        if (!(temp.msgUrlApp === null)) {
          temp.msgUrlApp = temp.msgUrlApp.trim();
        }
        if (!(temp.msgUrlWeb === null)) {
          temp.msgUrlWeb = temp.msgUrlWeb.trim();
        }
        if (!(temp.marketId === null)) {
          temp.marketId = temp.marketId.trim();
        }
        if (!(temp.grno === null)) {
          temp.grno = temp.grno.trim();
        }
        if (!(temp.actId === null)) {
          temp.actId = temp.actId.trim();
        }

        if (this.form1.get('msgType').value === 'P' || this.form1.get('msgType').value === 'G') {
          const id = this.msgTypeMode === 'pmode' ? this.form1.get('marketId').value : this.form1.get('grno').value;
          const url = this.msgTypeMode === 'pmode' ?
            `${ApiUrl.appBonuss_path}?marketId=${id.trim()}` :
            `${ApiUrl.appCoupons_path}?grno=${id.trim()}`;
          this.httpService.getRemoteData(url)
            .subscribe((root: RootObject) => {
              if (root.status === 'SUCCESS') {
                const stockList: AppCouponBonusMstList[] = root.data.list;
                if (root.data.total === 1) {
                  if (stockList[0].msgYn === 'N') {
                    const confirmDialogRef2 = this.dialog.open(ComfirmDialogComponent, {
                      data: {
                        message: `此${this.msgTypeMode === 'pmode' ?
                          '紅利點數' : '折價券'}活動代碼訊息設定為「不發送」，請輸入其他活動代碼`,
                        type: '1'
                      }
                    });
                  } else if (stockList[0].bsStatus === 'D' || stockList[0].grStatus === 'D') {
                    const confirmDialogRef3 = this.dialog.open(ComfirmDialogComponent, {
                      data: {
                        message: `此${this.msgTypeMode === 'pmode' ?
                          '紅利點數' : '折價券'}活動狀態為「刪除」，請輸入其他活動代碼`,
                        type: '1'
                      }
                    });
                  } else {
                    if (stockList[0].msgId) {
                      const confirmDialogRef4 = this.dialog.open(ComfirmDialogComponent, {
                        data: {
                          message: `${this.msgTypeMode === 'pmode' ?
                            '紅利點數' : '折價券'}活動已存在訊息(${stockList[0].msgId})，是否要覆蓋訊息?`,
                          type: '3'
                        }
                      });
                      confirmDialogRef4.componentInstance.doConfirm3.subscribe(() => {
                        // if (this.mode === 'create' || this.mode === 'redirect') {
                        if (this.mode === 'create') {
                          this.createData(temp);
                        } else {
                          this.updateData(temp);
                        }
                        (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
                        confirmDialogRef4.close();
                      });
                    } else {
                      if (this.mode === 'create') {
                        this.createData(temp);
                      } else {
                        this.updateData(temp);
                      }
                      (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
                    }
                  }

                } else if (root.data.total === 0) {
                  if (this.mode === 'create') {
                    this.postMsg(temp);
                  } else {
                    this.putMsg(temp);
                  }
                  (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
                } else {
                  this.snackbar.open(`${this.msgTypeMode === 'pmode' ?
                    '紅利點數' : '折價券'}活動代碼超過2筆相同代碼，請重新輸入`, null, {
                    duration: 5000
                  });
                }
              } else {
                this.snackbar.open('系統錯誤，請洽相關窗口', null, {
                  duration: 5000
                });
              }
            });

          // 20180622--改為不判斷折價券或紅利是否存在，存在就回寫msgid，不存在就不回寫msgid
          // if (this.messageId) {
          //   const confirmDialogRef2 = this.dialog.open(ComfirmDialogComponent, {
          //     data: {
          //       message: `${this.msgTypeMode === 'pmode' ?
          //         '紅利點數' : '折價券'}活動已存在訊息(${this.messageId})，是否要覆蓋訊息?`,
          //       type: '3'
          //     }
          //   });
          //   confirmDialogRef2.componentInstance.doConfirm3.subscribe(() => {
          //     // if (this.mode === 'create' || this.mode === 'redirect') {
          //     if (this.mode === 'create') {
          //       this.createData(temp);
          //     } else {
          //       this.updateData(temp);
          //     }
          //     (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
          //     confirmDialogRef2.close();
          //   });
          // } else {
          //   // if (this.mode === 'create' || this.mode === 'redirect') {

          //   if (this.mode === 'create') {
          //     this.createData(temp);
          //   } else {
          //     this.updateData(temp);
          //   }
          //   (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
          // }
        } else {
          // if (this.mode === 'create' || this.mode === 'redirect') {
          if (this.mode === 'create') {
            this.postMsg(temp);
          } else {
            this.putMsg(temp);

          }
          (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
        }
        // if (this.mode === 'create' || this.mode === 'redirect') {
        //   this.postData(temp);
        // } else {
        //   this.putData(temp);

        // }
        // (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
        confirmDialogRef.close();
      });

    }
  }

  private createData(temp) {
    // if (this.form1.get('msgType').value === 'G') {
    //   this.putMsgId$ = this.httpService.putData(this.putCoupon_path, { 'msgId': temp.msgId, 'grno': temp.grno });
    // } else {
    //   this.putMsgId$ = this.httpService.putData(this.putBonus_path, { 'msgId': temp.msgId, 'marketId': temp.marketId });
    // }
    this.putMsgId$ = this.msgTypeMode === 'pmode' ?
      this.httpService.putData(this.putBonus_path, { 'msgId': temp.msgId, 'marketId': temp.marketId }) :
      this.httpService.putData(this.putCoupon_path, { 'msgId': temp.msgId, 'grno': temp.grno });
    this.postMsgData$ = this.httpService.postData(this.put_post_path, temp);


    zip(this.postMsgData$, this.putMsgId$).subscribe((data) => {
      console.info('data subscribe:', data);
      this.isLoading = false;
      const root: RootObject[] = data;
      if (root[0].status === 'SUCCESS' && root[1].status === 'SUCCESS') {
        this.snackbar.open(`儲存成功`, null, {
          duration: 5000
        });
        this.router.navigateByUrl('');
      } else {
        this.snackbar.open(`儲存異常，請洽相關窗口`, '我知道了');
      }

    },
      errors => {
        this.isLoading = false;
        console.info('messageadd createData error', errors);
      });

  }

  private updateData(temp) {
    this.putMsgId$ = this.msgTypeMode === 'pmode' ?
      this.httpService.putData(this.putBonus_path, { 'msgId': temp.msgId, 'marketId': temp.marketId }) :
      this.httpService.putData(this.putCoupon_path, { 'msgId': temp.msgId, 'grno': temp.grno });
    this.postMsgData$ = this.httpService.putData(this.put_post_path, temp);


    zip(this.postMsgData$, this.putMsgId$).subscribe((data) => {
      console.info('data subscribe:', data);

      const root: RootObject[] = data;
      if (root[0].status === 'SUCCESS' && root[1].status === 'SUCCESS') {
        this.snackbar.open(`儲存成功`, null, {
          duration: 5000
        });
        if (this.mode === 'update') {
          this.dialogRef.close('1');
        }
      } else {
        this.snackbar.open(`儲存異常，請洽相關窗口`, '我知道了');
      }
      this.isLoading = false;
    },
      errors => {
        this.isLoading = false;
        console.info('messageadd createData error', errors);
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
  private getInitMsgValue() {
    // if (this.mode === 'create' || this.mode === 'redirect') {
    if (this.mode === 'create') {
      this.getMsgId$ = this.httpService.getRemoteData(this.acl_path);
      this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
      this.getMsgType$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=msg_type'));
      this.getMsgStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=msg_status'));
      this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));

      zip(this.getMsgId$, this.getApplyMem$, this.getMsgType$, this.getMsgStatus$, this.getChannelId$).subscribe((data) => {
        console.info('data subscribe:', data);

        const appCodeObject: RootObject[] = data;
        this.MsgId = appCodeObject[0].data;
        this.ApplyMemList = appCodeObject[1].data.list;
        this.msgTypeList = appCodeObject[2].data.list;
        this.getMsgStatus = appCodeObject[3].data.list;
        this.getChannelId = appCodeObject[4].data.list;
        for (const i in this.getMsgStatus) {
          if (this.form1.get('msgStatus').value === this.getMsgStatus[i].codeNo) {
            this.msgStatusValue = this.getMsgStatus[i].codeExplain;
          }
        }
        this.form1.patchValue({ 'msgId': this.MsgId, 'msgType': this.msgTypeList[0].codeNo });
        this.uploaderMem.onBeforeUploadItem = (item) => {
          item.withCredentials = false;
          item.url = `${environment.ApiHost}${this.memfile_upload_URL}${this.form1.get('msgId').value}/${this.fileUpMode}`;
        };
        this.uploaderJpg.onBeforeUploadItem = (item) => {
          item.withCredentials = false;
          item.url = `${environment.ApiHost}${this.jpgfile_upload_URL}${this.form1.get('msgId').value}/${this.fileUpMode}`;
        };
        this.isLoading = false;
        // if (this.mode === 'redirect') {
        //   if (this.source === 'grno') {
        //     this.form1.get('msgType').setValue('G');
        //     this.form1.get('grno').setValue(this.id);
        //     // this.form1.get('grno').disable();
        //   } else {
        //     this.form1.get('msgType').setValue('P');
        //     this.form1.get('marketId').setValue(this.id);
        //     console.info('PPPPPPPPPPPP');
        //     console.info('this id', this.id);
        //   }
        //   this.msgTypeList = this.msgTypeList.filter(item => item.codeNo === this.form1.get('msgType').value);
        //   // this.form1.get('activity').disable();
        // }

      },
        errors => {
          console.info('messageadd getInitMsgValue error', errors);
          this.isLoading = false;
        });
    } else {
      this.getApplyMem$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=apply_mem'));
      this.getMsgType$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=msg_type'));
      this.getMsgStatus$ = this.httpService.getRemoteData(this.appCodes_path.concat('?codeClass=msg_status'));
      this.getChannelId$ = this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`));

      zip(this.getApplyMem$, this.getMsgType$, this.getMsgStatus$, this.getChannelId$).subscribe((data) => {
        console.info('data subscribe:', data);
        const appCodeObject: RootObject[] = data;
        this.ApplyMemList = appCodeObject[0].data.list;
        this.msgTypeList = appCodeObject[1].data.list;
        this.getMsgStatus = appCodeObject[2].data.list;
        this.getChannelId = appCodeObject[3].data.list;
        for (const i in this.getMsgStatus) {
          if (this.form1.get('msgStatus').value === this.getMsgStatus[i].codeNo) {
            this.msgStatusValue = this.getMsgStatus[i].codeExplain;
          }
        }
        this.form1.patchValue({ 'msgId': this.defaults.msgId });
        // this.idValid();
        this.uploaderMem.onBeforeUploadItem = (item) => {
          item.withCredentials = false;
          item.url = `${environment.ApiHost}${this.memfile_upload_URL}${this.form1.get('msgId').value}/${this.fileUpMode}`;
        };
        this.uploaderJpg.onBeforeUploadItem = (item) => {
          item.withCredentials = false;
          item.url = `${environment.ApiHost}${this.jpgfile_upload_URL}${this.form1.get('msgId').value}/${this.fileUpMode}`;
        };
        this.isLoading = false;
      },
        errors => {
          console.info('messageadd getInitMsgValue error', errors);
          this.isLoading = false;
        });

    }
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
  previousStep() {
    this.selectedIndex -= 1;
  }
  isUpdateMode() {
    return this.mode === 'update';
  }
  handleFileInput(files: File[], data) {
    if (data === 'JPG') {
      console.log(this.form1.get('msgJpg').value);
      this.uploaderJpg.clearQueue();
      this.uploaderJpg.addToQueue(files);
      this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: `請上傳訊息圖片至雲端`,
          type: '1'
        }
      });
    } else {
      this.uploaderMem.clearQueue();
      this.uploaderMem.addToQueue(files);
      this.fileupProcess = '等待上傳';
      this.form1.get('recCount').setValue('0');
    }


  }
  fileUpDelete() {
    this.uploaderMem.clearQueue();
    this.form2.get('uploadMemberFile').reset();
    this.fileupProcess = '等待上傳';
    this.form1.get('recCount').setValue('0');
  }
  serverFileRemove() {

    if (this.form1.get('msgJpg').value) {
      this.form1.get('msgJpg').setValue('');
    }

  }
  fileUploadSubmit(data) {
    this.isLoading = true;
    const kcToken = localStorage.getItem('kc_token');
    if (data === 'JPG') {

      // console.info('this upload mode=', this.fileUpMode);
      this.uploaderJpg.authTokenHeader = 'Authorization';
      this.uploaderJpg.authToken = `Bearer ${kcToken}`;
      this.uploaderJpg.uploadAll();
      this.uploaderJpg.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
      this.uploaderJpg.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

    } else {
      // console.info('this upload mode=', this.fileUpMode);
      this.fileupProcess = '上傳中';
      this.fileupFlag = false;
      this.uploaderMem.authTokenHeader = 'Authorization';
      this.uploaderMem.authToken = `Bearer ${kcToken}`;
      this.uploaderMem.uploadAll();
      this.uploaderMem.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
      this.uploaderMem.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

    }
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const resault: RootObject = JSON.parse(response);
    console.info('file success', resault);
    this.isLoading = false;
    if (resault.status === 'SUCCESS') {
      this.snackbar.open('上傳成功', null, {
        duration: 5000
      });
      if (item.alias === 'memberIdFile') {
        this.fileupFlag = true;
        this.fileupProcess = '上傳成功';
        this.form1.get('recCount').setValue(resault.data);
      } else {
        this.form1.get('msgJpg').setValue(resault.data);
      }
    } else {
      this.snackbar.open(`上傳失敗，原因：${resault.message}`, '我知道了', {
        duration: 5000
      });
      if (item.alias === 'memberIdFile') {
        this.fileupFlag = false;
        this.fileupProcess = '上傳失敗';
      }
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
      'msgId': new FormControl(''),
      'actId': new FormControl(this.defaults.actId || ''),
      'msgStatus': new FormControl(this.defaults.actStatus || 'N'),
      'channelId': new FormControl(this.defaults.channelId || '', [Validators.required]),
      'recCount': new FormControl(this.defaults.recCount || ''),
      'msgType': new FormControl(this.defaults.msgType || '', [
        Validators.required
      ]),
      'grno': new FormControl(this.defaults.grno || ''),
      'marketId': new FormControl(this.defaults.marketId || ''),
      // 'activity': new FormControl('none', [
      //   Validators.required
      // ]),
      // 'pushNoteFlag': new FormControl(this.defaults.pushNoteFlag || 'N', [
      //   Validators.required
      // ]),
      // 'pushNoteSub': new FormControl(this.defaults.pushNoteSub || ''),
      // 'pushNoteTxt': new FormControl(this.defaults.pushNoteTxt || ''),
      'msgSub': new FormControl(this.defaults.msgSub || '', [
        Validators.required
      ]),
      'msgTxt': new FormControl(this.defaults.msgTxt || '', [
        Validators.required
      ]),
      'msgJpg': new FormControl(this.defaults.msgJpg || ''),
      'msgUrlApp': new FormControl(this.defaults.msgUrlApp || ''),
      'msgUrlWeb': new FormControl(this.defaults.msgUrlWeb || ''),
      'msgSendDate': new FormControl(moment(new Date(this.defaults.msgSendDate)).format('YYYY-MM-DD HH:mm') || '', [Validators.required]),
      'msgEndDate': new FormControl(moment(new Date(this.defaults.msgEndDate)).format('YYYY-MM-DD HH:mm') || '', [Validators.required]),
      'applyMem': new FormControl(this.defaults.applyMem || '', [Validators.required]),
      // 'secPushFlag': new FormControl(this.defaults.secPushFlag || '', [
      //   Validators.required
      // ])
    });
    this.form2 = new FormGroup({
      'uploadMemberFile': new FormControl('')
    });
  }
  // pushNoteFlagClick() {
  //   // console.info('enter');
  //   if (this.form1.get('pushNoteFlag').value === 'Y') {
  //     this.form1.controls['pushNoteSub'].setValidators([Validators.required, Validators.maxLength(20)]);
  //     this.form1.controls['pushNoteSub'].updateValueAndValidity();
  //     this.form1.controls['pushNoteTxt'].setValidators([Validators.required, Validators.maxLength(40)]);
  //     this.form1.controls['pushNoteTxt'].updateValueAndValidity();
  //   } else {
  //     this.form1.controls['pushNoteSub'].clearValidators();
  //     this.form1.controls['pushNoteSub'].updateValueAndValidity();
  //     this.form1.controls['pushNoteTxt'].clearValidators();
  //     this.form1.controls['pushNoteTxt'].updateValueAndValidity();
  //   }
  // }
  activityClick() {
    // this.form1.get('channelId').setValue('');
    // this.messageId = null;
    // if (this.form1.get('msgType').value === 'G') {
    //   this.form1.controls['grno'].setValidators([Validators.required, Validators.maxLength(20)]);
    //   this.form1.controls['grno'].updateValueAndValidity();
    //   this.form1.controls['marketId'].setValue('');
    //   this.form1.controls['marketId'].clearValidators();
    //   this.form1.controls['marketId'].updateValueAndValidity();
    // } else if (this.form1.get('msgType').value === 'P') {
    //   this.form1.controls['grno'].clearValidators();
    //   this.form1.controls['grno'].setValue('');
    //   this.form1.controls['grno'].updateValueAndValidity();
    //   this.form1.controls['marketId'].setValidators([Validators.required, Validators.maxLength(12)]);
    //   this.form1.controls['marketId'].updateValueAndValidity();
    // } else {
    //   this.form1.controls['grno'].setValue('');
    //   this.form1.controls['grno'].clearValidators();
    //   this.form1.controls['grno'].updateValueAndValidity();
    //   this.form1.controls['marketId'].setValue('');
    //   this.form1.controls['marketId'].clearValidators();
    //   this.form1.controls['marketId'].updateValueAndValidity();
    // }




    switch (this.form1.get('msgType').value) {
      case 'G': {
        this.msgTypeMode = 'gmode';
        this.form1.controls['grno'].setValidators([Validators.required]);
        this.form1.controls['grno'].updateValueAndValidity();
        // 20180627 PM要求每筆資料都要可選擇channelId by hank
        // this.form1.controls['channelId'].setValidators([Validators.required]);
        // this.form1.controls['channelId'].updateValueAndValidity();
        this.form1.controls['marketId'].setValue('');
        this.form1.controls['marketId'].clearValidators();
        this.form1.controls['marketId'].updateValueAndValidity();

        // this.form1.controls['msgSendDate'].setValue('');
        // this.form1.controls['msgSendDate'].updateValueAndValidity();
        // this.form1.controls['msgEndDate'].setValue('');
        // this.form1.controls['msgEndDate'].updateValueAndValidity();
        // this.form1.controls['applyMem'].setValue('');
        // this.form1.controls['applyMem'].updateValueAndValidity();

        this.piGiFlag = false;
        break;
      }
      case 'GI': {
        this.msgTypeMode = 'gmode';
        this.form1.controls['grno'].setValidators([Validators.required]);
        this.form1.controls['grno'].updateValueAndValidity();
        this.form1.controls['marketId'].setValue('');
        this.form1.controls['marketId'].clearValidators();
        this.form1.controls['marketId'].updateValueAndValidity();
        // 20180627 PM要求每筆資料都要可選擇channelId by hank
        // this.form1.controls['channelId'].setValue('');
        // this.form1.controls['channelId'].clearValidators();
        // this.form1.controls['channelId'].updateValueAndValidity();

        this.form1.controls['msgSendDate'].setValue(moment(new Date()).add(2, 'days').format('YYYY-MM-DD'));
        this.form1.controls['msgSendDate'].updateValueAndValidity();
        this.form1.controls['msgEndDate'].setValue(moment(new Date()).add(5, 'days').format('YYYY-MM-DD'));
        this.form1.controls['msgEndDate'].updateValueAndValidity();
        this.form1.controls['applyMem'].setValue('3');
        this.form1.controls['applyMem'].updateValueAndValidity();
        this.piGiFlag = true;
        break;
      }
      case 'P': {
        this.msgTypeMode = 'pmode';
        this.form1.controls['grno'].clearValidators();
        this.form1.controls['grno'].setValue('');
        // 20180627 PM要求每筆資料都要可選擇channelId by hank
        // this.form1.controls['channelId'].setValidators([Validators.required]);
        // this.form1.controls['channelId'].updateValueAndValidity();
        this.form1.controls['grno'].updateValueAndValidity();
        this.form1.controls['marketId'].setValidators([Validators.required]);
        this.form1.controls['marketId'].updateValueAndValidity();

        // this.form1.controls['msgSendDate'].setValue('');
        // this.form1.controls['msgSendDate'].updateValueAndValidity();
        // this.form1.controls['msgEndDate'].setValue('');
        // this.form1.controls['msgEndDate'].updateValueAndValidity();
        // this.form1.controls['applyMem'].setValue('');
        // this.form1.controls['applyMem'].updateValueAndValidity();


        this.piGiFlag = false;
        break;
      }
      case 'PI': {
        this.msgTypeMode = 'pmode';
        this.form1.controls['grno'].clearValidators();
        this.form1.controls['grno'].setValue('');
        this.form1.controls['grno'].updateValueAndValidity();
        this.form1.controls['marketId'].setValidators([Validators.required]);
        this.form1.controls['marketId'].updateValueAndValidity();
        // 20180627 PM要求每筆資料都要可選擇channelId by hank
        // this.form1.controls['channelId'].setValue('');
        // this.form1.controls['channelId'].clearValidators();
        // this.form1.controls['channelId'].updateValueAndValidity();

        this.form1.controls['msgSendDate'].setValue(moment(new Date()).add(2, 'days').format('YYYY-MM-DD'));
        this.form1.controls['msgSendDate'].updateValueAndValidity();
        this.form1.controls['msgEndDate'].setValue(moment(new Date()).add(5, 'days').format('YYYY-MM-DD'));
        this.form1.controls['msgEndDate'].updateValueAndValidity();
        this.form1.controls['applyMem'].setValue('3');
        this.form1.controls['applyMem'].updateValueAndValidity();
        this.piGiFlag = true;
        break;
      }
      default: {
        this.msgTypeMode = 'other';
        this.form1.controls['grno'].setValue('');
        this.form1.controls['grno'].clearValidators();
        this.form1.controls['grno'].updateValueAndValidity();
        this.form1.controls['marketId'].setValue('');
        this.form1.controls['marketId'].clearValidators();
        this.form1.controls['marketId'].updateValueAndValidity();
        // 20180627 PM要求每筆資料都要可選擇channelId by hank
        // this.form1.controls['channelId'].setValue('');
        // this.form1.controls['channelId'].clearValidators();
        // this.form1.controls['channelId'].updateValueAndValidity();
        // this.form1.controls['msgSendDate'].setValue('');
        // this.form1.controls['msgSendDate'].updateValueAndValidity();
        // this.form1.controls['msgEndDate'].setValue('');
        // this.form1.controls['msgEndDate'].updateValueAndValidity();
        // this.form1.controls['applyMem'].setValue('');
        // this.form1.controls['applyMem'].updateValueAndValidity();

        this.piGiFlag = false;
        break;
      }

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
  reset() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: '確定要重設頁面嗎？',
        type: '3'
      }
    });
    confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
      this.form1.reset();
      if (this.mode === 'update') {
        this.form1.patchValue({ 'marketId': this.defaults.marketId });
        this.form1.patchValue({ 'grno': this.defaults.grno });
        this.form1.patchValue({ 'msgId': this.defaults.msgId });
        this.form1.patchValue({ 'msgType': this.defaults.msgType });
      }
      // else if (this.mode === 'redirect') {
      //   if (this.source === 'grno') {
      //     this.form1.patchValue({ 'msgType': 'G' });
      //     this.form1.patchValue({ 'grno': this.id });
      //   } else {
      //     this.form1.patchValue({ 'msgType': 'P' });
      //     this.form1.patchValue({ 'marketId': this.id });
      //   }
      //   this.form1.patchValue({ 'msgId': this.MsgId });
      // }
      else {
        this.form1.patchValue({ 'msgId': this.MsgId });
      }
      this.memberDsicript = null;
      this.snackbar.open('已重設「訊息設定」所有欄位', null, {
        duration: 5000
      });
      this.uploaderJpg.clearQueue();
      this.uploaderMem.clearQueue();
      confirmDialogRef.close();
    });

  }

  onchange(event) {
    // console.info('event is =', event);
    this.setFileupControl(event.value);
  }


}
