import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {  FormBuilder } from '@angular/forms';
import { ApiUrl } from 'environments/api-url';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { CommRootObject, FsCommMst, Air, Bath, CommInfo, Construction, Household,
   Hydropwer, Marketing, Other } from 'app/api-result/api-result.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'fds-community-profile',
  templateUrl: './fds-community-profile.component.html',
  styleUrls: ['./fds-community-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FdsCommunityProfileComponent implements OnInit {

  selectedIndex = 0;
  remark = '';
  isLoading = false;
  formValid = false;
  AirData: Air = {
    acType: '',
    windowType: [],
    separateType: [],
    indoorType: [],
    sunType: []
  };
  BathData: Bath = {
    bathType: [],
    bathWall: '',
    toiletPipe: '',
    toiletShape: '',
    bathBrand: '',
    sinkIn: '',
    sinkOut: '',
    kitchen: '',
    balcony: '',
    balconyW: '',
    washlet: [],
    plug: [],
    hanger: ''
  };
  CommInfoData: CommInfo = {
    commId: null,
    commName: '',
    commAdd1: '',
    commAdd2: '',
    commAdd3: '',
    siteInCharge: '',
    userInCharge: '',
    numHouse: null,
    status: '',
    rank: '',
    chiefStaffName: '',
    chiefStaffTel: '',
    chiefStaffMobile: '',
    chairmanName: '',
    chairmanTel: '',
    chairmanMobile: '',
  };
  Constructor: Construction = {
    buildCompany: '',
    buildDate: null,
    commType: [],
    commPattern: [],
    interiorType: [],
    buildExterior: []
  };
  HouseHoldDate: Household = {
    orgType: '',
    orgTee: null,
    housePrice: null,
    householdType: '',
    appYn: '',
    appName: ''
  };
  Hydropower: Hydropwer = {
    gasType: '',
    voltage: '',
    cpipeType: '',
    hpipeType: '',
  };
  Marketing: Marketing = {
    marketType: [],
    dmMethod: []
  };
  Other: Other = {
    trash: '',
    trashTime: '',
  };
  mstForm: FsCommMst = {
    commId: '', commName: '', commAdd1: '', commAdd2: '',
    commAdd3: '', siteInCharge: '', userInCharge: '', numHouse: ''
  };
  mode: 'create' | 'update' = 'create';
  private createCommMst_path = ApiUrl.fs_create_comm_mst_path;
  private updateCommMst_path = ApiUrl.fs_update_comm_mst_path;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any, private httpService: HttpServiceService,
    private fb: FormBuilder, public dialog: MatDialog,
    private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    if (this.defaults) {
      console.log(this.defaults);
      this.mode = 'update';
      this.formValid = true;
      this.largeToSmaller(this.AirData);
      this.largeToSmaller(this.Constructor);
      this.largeToSmaller(this.CommInfoData);
      this.largeToSmaller(this.BathData);
      this.largeToSmaller(this.HouseHoldDate);
      this.largeToSmaller(this.Hydropower);
      this.largeToSmaller(this.Marketing);
      this.largeToSmaller(this.Other);
      this.remark = this.defaults.remark;
    } else {
      this.mode = 'create';
    }
  }

  largeToSmaller = (data) => {
    Object.keys(data).map((key) => {
      if (this.defaults.hasOwnProperty(key)) {
        data[key] = this.defaults[key];
      }
    });
  }

  saveForm = (data: { val: any, count?: number, invalid?: any }) => {
    // console.log(data.invalid);
    if (data.count === 1) {
      if (data.invalid === false) {
        this.formValid = true;
      } else {
        this.formValid = false;
      }
      this.mstForm.commId = data.val.commId;
      this.mstForm.commName = data.val.commName;
      this.mstForm.commAdd1 = data.val.commAdd1;
      this.mstForm.commAdd2 = data.val.commAdd2;
      this.mstForm.commAdd3 = data.val.commAdd3;
      this.mstForm.siteInCharge = data.val.siteInCharge;
      this.mstForm.userInCharge = data.val.userInCharge;
      this.mstForm.numHouse = data.val.numHouse;
      this.mstForm.chiefStaffName = data.val.chiefStaffName;
      this.mstForm.chiefStaffTel = data.val.chiefStaffTel;
      this.mstForm.chiefStaffMobile = data.val.chiefStaffMobile;
      this.mstForm.chairmanName = data.val.chairmanName;
      this.mstForm.chairmanTel = data.val.chairmanTel;
      this.mstForm.chairmanMobile = data.val.chairmanMobile;
      this.mstForm.status = data.val.status;
    } else if (data.count === 2) {
      this.mstForm.buildCompany = data.val.buildCompany;
      this.mstForm.buildDate = data.val.buildDate;
      this.mstForm.commType = data.val.commType;
      this.mstForm.commPattern = data.val.commPattern;
      this.mstForm.interiorType = data.val.interiorType;
      this.mstForm.buildExterior = data.val.buildExterior;

    } else if (data.count === 3) {
      this.mstForm.orgType = data.val.orgType;
      this.mstForm.householdType = data.val.householdType;
      this.mstForm.orgTee = data.val.orgTee;
      this.mstForm.housePrice = data.val.housePrice;
      this.mstForm.appYn = data.val.appYn;
      this.mstForm.appName = data.val.appName;
    } else if (data.count === 4) {
      this.mstForm.gasType = data.val.gasType;
      this.mstForm.voltage = data.val.voltage;
      this.mstForm.cpipeType = data.val.cpipeType;
      this.mstForm.hpipeType = data.val.hpipeType;


    } else if (data.count === 5) {
      this.mstForm.acType = data.val.acType;
      this.mstForm.windowType = data.val.windowType;
      this.mstForm.separateType = data.val.separateType;
      this.mstForm.indoorType = data.val.indoorType;
      this.mstForm.sunType = data.val.sunType;
    } else if (data.count === 6) {
      this.mstForm.bathType = data.val.bathType;
      this.mstForm.bathWall = data.val.bathWall;
      this.mstForm.toiletPipe = data.val.toiletPipe;
      this.mstForm.bathBrand = data.val.bathBrand;
      this.mstForm.sinkIn = data.val.sinkIn;
      this.mstForm.sinkOut = data.val.sinkOut;
      this.mstForm.balcony = data.val.balcony;
      this.mstForm.hanger = data.val.hanger;
      this.mstForm.balconyW = data.val.balconyW;
      this.mstForm.kitchen = data.val.kitchen;
      this.mstForm.toiletShape = data.val.toiletShape;
      this.mstForm.washlet = data.val.washlet;
      this.mstForm.plug = data.val.plug;

    } else if (data.count === 7) {
      this.mstForm.marketType = data.val.marketType;
      this.mstForm.dmMethod = data.val.dmMethod;
    } else {
      this.mstForm.trash = data.val.trash;
      this.mstForm.trashTime = data.val.trashTime;
    }
    this.mstForm.remark = this.remark;
    // console.log(this.mstForm);
  }

  sendForm = () => {
    if (this.formValid === false) {
      this.snackbar.open('必填欄位未填寫', null, {
        duration: 5000
      });
      this.selectedIndex = 0;
    } else {
      const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: `確定要儲存嗎？`,
          type: '1'
        }
      });

      confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
        this.isLoading = true;
        if (this.mode === 'create') {
          this.httpService.postData(this.createCommMst_path, this.mstForm)
            .subscribe(
              (val: CommRootObject) => {
                if (val.errorCode === '100') {
                  this.snackbar.open(val.message, null, {
                    duration: 5000
                  });
                  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                  this.router.onSameUrlNavigation = 'reload';
                  this.router.navigate(['/apps/fds-community-profile']);
                }
              },
              error => {
                  this.snackbar.open(error.message, null, {
                    duration: 5000
                  });
                  this.isLoading = false;
              },
              () => { this.isLoading = false; }
            );
        } else {
          this.httpService.putData(this.updateCommMst_path, this.mstForm)
            .subscribe(
              (val: CommRootObject) => {
                if (val.errorCode === '105') {
                  this.snackbar.open(val.message, null, {
                    duration: 5000
                  });

                }
              },
              error => {
                this.snackbar.open('更新失敗', null, {
                  duration: 5000
                });
                this.isLoading = false;
              },
              () => { this.isLoading = false; }
            );
        }

      });
    }

  }

  nextStep = () => {
    this.selectedIndex++;
  }
}


