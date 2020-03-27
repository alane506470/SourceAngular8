import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpServiceService } from '../../http-service/http-service.service';
import * as Rx from 'rxjs';
import { MatDialogRef, MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import { AppMember, AppMemberLikesList } from '../../api-result/api-result.interface';
import { ApiUrl } from '../../../environments/api-url';
import { zip  } from 'rxjs';
@Component({
  selector: 'fury-get-mm-coupon-list',
  templateUrl: './get-mm-coupon-list.component.html',
  styleUrls: ['./get-mm-coupon-list.component.scss']
})
export class GetMmCouponListComponent implements OnInit {
  eventDateFormat = 'YYYY/MM/DD HH:mm:ss';
  form1: FormGroup;
  isLoading: boolean;
  private getCouponY20$: Observable<any>;
  private getCouponN20$: Observable<any>;
  private getCouponY10$: Observable<any>;
  private getCouponN10$: Observable<any>;
  private appMemQry$: Observable<any>;
  private appMemLikesQry$: Observable<any>;
  public appMemberLikeStore: AppMemberLikesList[] = [];
  public appMemberLikeProd: AppMemberLikesList[] = [];

  public appMember: AppMember = {
    memberId: '',
    mobile: '',
    jpgUrl: '',
    isRegister: '',
    appRegDate: '',
    firstLogin: '',
    lastLogin: '',
    createDate: '',
    creator: '',
    modifyDate: '',
    modifier: ''
  };
  unUseShopGold;
  UsedShopGold;
  unUseCoupon;
  UsedCoupon;
  constructor(private httpService: HttpServiceService, private snackbar: MatSnackBar) {
    this.form1 = new FormGroup({
      'memberId': new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit() {
  }

  getCouponList(gotoFirstPage = true, pageIndex = 0) {
    this.isLoading = true;
    this.appMember = {
      memberId: '',
      mobile: '',
      jpgUrl: '',
      isRegister: '',
      appRegDate: '',
      firstLogin: '',
      lastLogin: '',
      createDate: '',
      creator: '',
      modifyDate: '',
      modifier: ''
    };
    this.unUseShopGold = [];
    this.UsedShopGold = [];
    this.unUseCoupon = [];
    this.UsedCoupon = [];
    this.appMemberLikeProd = [];
    this.appMemberLikeStore = [];
    // 折價券已使用
    this.getCouponY20$ = this.httpService.getRemoteData
      (`${ApiUrl.appCouponList}/Y/20?fakeMemberId=${this.form1.get('memberId').value}`);
    // 折價券未使用
    this.getCouponN20$ = this.httpService.getRemoteData
      (`${ApiUrl.appCouponList}/N/20?fakeMemberId=${this.form1.get('memberId').value}`);
    // 購物金已使用
    this.getCouponY10$ = this.httpService.getRemoteData
      (`${ApiUrl.appCouponList}/Y/10?fakeMemberId=${this.form1.get('memberId').value}`);
    // 購物金未使用
    this.getCouponN10$ = this.httpService.getRemoteData
      (`${ApiUrl.appCouponList}/N/10?fakeMemberId=${this.form1.get('memberId').value}`);

    this.appMemQry$ = this.httpService.getRemoteData
      (`${ApiUrl.appMemQry}?fakeMemberId=${this.form1.get('memberId').value}`);

    this.appMemLikesQry$ = this.httpService.getRemoteData
      (`${ApiUrl.appMemLikesQry}?fakeMemberId=${this.form1.get('memberId').value}`);


      zip(this.getCouponN20$, this.getCouponY20$, this.getCouponN10$,
        this.getCouponY10$, this.appMemQry$, this.appMemLikesQry$).subscribe((result: any) => {
          console.info('result subscribe:', result);
          // 20180815 移除所有displaytype邏輯
          // for (let i = 0; i < result[0].data.list.length; i++) {
          //   if (result[0].data.list[i].displayType === '60') {
          //     let startDate = new Date(result[0].data.list[i].startDate);
          //     if (startDate <= today) {
          //       this.unUseCoupon.push(result[0].data.list[i]);
          //     }
          //   } else {
          //     this.unUseCoupon.push(result[0].data.list[i]);
          //   }
          // }
          if (result[4].status === 'SUCCESS') {
            if (result[0].data) {
              for (let i = 0; i < result[0].data.list.length; i++) {
                this.unUseCoupon.push(result[0].data.list[i]);
              }
            }
            if (result[1].data) {
              this.UsedCoupon = result[1].data.list;
            }


            if (result[2].data) {
              for (let i = 0; i < result[2].data.list.length; i++) {
                this.unUseShopGold.push(result[2].data.list[i]);
              }
            }
            if (result[3].data) {
              this.UsedShopGold = result[3].data.list;
            }


            this.appMember = result[4].data;
            this.appMember.createDate = moment(new Date(this.appMember.createDate)).format(this.eventDateFormat);
            this.appMember.firstLogin = moment(new Date(this.appMember.firstLogin)).format(this.eventDateFormat);
            this.appMember.lastLogin = moment(new Date(this.appMember.lastLogin)).format(this.eventDateFormat);
            this.appMember.appRegDate = moment(new Date(this.appMember.appRegDate)).format(this.eventDateFormat);

            if (result[5].data) {
              for (let i = 0; i < result[5].data.list.length; i++) {
                if (result[5].data.list[i].likeType === 'store') {
                  this.appMemberLikeStore.push(result[5].data.list[i]);
                } else if (result[5].data.list[i].likeType === 'prod_type') {
                  this.appMemberLikeProd.push(result[5].data.list[i]);
                } else { }
              }
            }

            this.appMemberLikeStore.forEach(stock => {
              stock.createDate = moment(new Date(stock.createDate)).format(this.eventDateFormat);
              stock.modifyDate = moment(new Date(stock.modifyDate)).format(this.eventDateFormat);
            });
            this.appMemberLikeProd.forEach(stock => {
              stock.createDate = moment(new Date(stock.createDate)).format(this.eventDateFormat);
              stock.modifyDate = moment(new Date(stock.modifyDate)).format(this.eventDateFormat);
            });


          } else {

            this.snackbar.open(result[4].message, null, {
              duration: 5000
            });
          }

          // 20180815 移除所有displaytype邏輯
          // for (let i = 0; i < result[2].data.list.length; i++) {
          //   if (result[2].data.list[i].displayType === '60') {
          //     let startDate = new Date(result[2].data.list[i].startDate);
          //     if (startDate <= today) {
          //       this.unUseShopGold.push(result[2].data.list[i]);
          //     }
          //   } else {
          //     this.unUseShopGold.push(result[2].data.list[i]);
          //   }
          // }




          this.isLoading = false;
        },
          error => {
            console.info('activityadd getInitActivityValue error', error);
            this.isLoading = false;
          });

  }

}
