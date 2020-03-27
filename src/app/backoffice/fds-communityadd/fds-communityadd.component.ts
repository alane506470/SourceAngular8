import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { FileUploader } from 'ng2-file-upload';

import { CommRootObject } from '../../../app/api-result/api-result.interface';
import { HttpServiceService } from '../../../app/http-service/http-service.service';
import { ApiUrl } from '../../../environments/api-url';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { zip  } from 'rxjs';
@Component({
  selector: 'fury-fds-communityadd',
  templateUrl: './fds-communityadd.component.html',
  styleUrls: ['./fds-communityadd.component.scss']
})
export class FdsCommunityaddComponent implements OnInit {

  isLoading: boolean;
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  selectedIndex = 0;
  houseData: any[] = [];
  getCountyId: any[] = [];
  getTownshipId: any[] = [];
  getAppFunctionId: any[] = [];
  mode: 'create' | 'update' = 'create';
  isCsvFile: boolean;
  AppFunction: any[] = [];
  appFunctionEnable: 'Y' | 'N' = 'N';

  private County_path = ApiUrl.appCounty_path;
  public uploaderJpg1: FileUploader;
  public uploaderJson1: FileReader;
  private getCounty$: Observable<any>;
  private getAppFunction$: Observable<any>;
  private put_post_path = ApiUrl.appCreateComm_path;
  private AppFunction_path = ApiUrl.appFunction_path;

  constructor( private httpService: HttpServiceService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar) {
      this.isLoading = true; }


  ngOnInit() {
    this.createForm();
    this.getInitCommunityValue();
    // [this.getAppFunction$, this.getAppFunctionId, this.AppFunction] =
    //  this.dataSource.getAppFunction( this.getAppFunction$,  this.getAppFunctionId, this.AppFunction);
    this.getAppFunction();
    this.uploaderJpg1 = new FileUploader({ queueLimit: 1, itemAlias: 'actJpg' });
    console.log( [this.getAppFunction$, this.getAppFunctionId, this.AppFunction] );
  }
    // 獲取app功能
    getAppFunction() {
      if (this.mode === 'create') {
        this.isLoading = true;
        this.getAppFunction$ = this.httpService.getRemoteData(this.AppFunction_path);


        zip(this.getAppFunction$).subscribe((data) => {
          console.log(data);
            let temp = {};
            this.getAppFunctionId = data[0].data.map( (item, index, array) => {
              this.AppFunction.push(data[0].data[index].funcId);
              if (item.funcId.indexOf('SR') !== -1) {
                      return temp = {funcName: '住戶-' + item.funcName  , funcId: item.funcId};
                    } else {
                       return temp = {funcName: '管理員-' + item.funcName , funcId: item.funcId};
                    }
            });
            // console.log(this.getAppFunctionId);
            this.isLoading = false;
        },
        error => {
          console.info('communityadd getInitAppFunctionValue error', error);
          this.isLoading = false;
        });
      }
    }

   // 獲取縣市鄉鎮
   getInitCommunityValue() {
    if (this.mode === 'create') {
      this.isLoading = true;
      this.getCounty$ = this.httpService.getRemoteData(this.County_path);


      zip( this.getCounty$).subscribe((data) => {
        // console.info('data subscribe', data);
        this.getCountyId = data[0].data;
        for (const i in this.getCountyId) {
          if (!(this.getCountyId === [])) {
            for (const j in data[0].data[i].areaList) {
              if ( !(data[0].data[i].areaList === [])) {
              // console.log(data[0].data[i].areaList[j]);
              this.getTownshipId.push(data[0].data[i].areaList[j]);
              }
            }
          }
        }
        this.isLoading = false;
      },
      error => {
        console.info('communityadd getInitCommunityValue error', error);
        this.isLoading = false;
      });
    }
  }

  // 變化鄉鎮
  changeTownshipId($eventValue: string) {
    // tslint:disable-next-line: radix
    const county = parseInt($eventValue) - 1;
    this.getTownshipId = this.getCountyId[county].areaList;
  }

  // 創建表格
  createForm() {
    this.form1 = new FormGroup({
      'commName': new FormControl(''),
      'commAdd1': new FormControl(''),
      'commAdd2': new FormControl(''),
      'commAdd3': new FormControl('')
    });
    this.form2 = new FormGroup({
      'houseList': new FormControl(''),
    });
    this.form3 = new FormGroup({
      'admNum': new FormControl('')
    });
  }

  reset(data) {
    if (data === 'form1') {
      this.form1.reset();
    } else if (data === 'form2') {
      this.form2.reset();
    } else if (data === 'form3') {
      this.form3.reset();
    } else {
      this.form1.reset();
      this.form2.reset();
      this.form3.reset();
    }
    this.snackbar.open('已重設「社區資料」所有欄位', null, {
      duration: 5000
    });
  }

  nextStep() {
    this.selectedIndex += 1;
  }

  previousStep() {
    this.selectedIndex -= 1;
  }

  // 刪除社區編號
  deleteClick() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent,
      {
        data: {
          message: `確定要刪除嗎？`,
          type: '1'
        }
      });
      confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
        this.reset('all');
      });
  }

   onSubmit() {
    console.log(this.houseData);
    const authSetup: AuthSetup = {};
    for (const i in this.getAppFunctionId) {
      if (this.getAppFunctionId.length !== 0) {
        for (const j in this.AppFunction) {
          if (this.AppFunction[j] === this.getAppFunctionId[i].funcId) {
            this.appFunctionEnable = 'Y';
            break;
          } else {
            this.appFunctionEnable = 'N';
          }
        }
        switch (i) {
          case  '0': {
            authSetup.AD00001 = this.appFunctionEnable;
            break;
          }
          case  '1': {
            authSetup.SR00001 = this.appFunctionEnable;
            break;
          }
          case  '2':  {
            authSetup.AD00002 = this.appFunctionEnable;
            break;
          }
          case  '3':  {
            authSetup.SR00002 = this.appFunctionEnable;
            break;
          }
          case  '4':  {
            authSetup.AD00003 = this.appFunctionEnable;
            break;
          }
          case  '5':  {
            authSetup.SR00003 = this.appFunctionEnable;
            break;
          }
          case  '6': {
            authSetup.SR00004 = this.appFunctionEnable;
            break;
          }
          case  '7':  {
            authSetup.AD00004 = this.appFunctionEnable;
            break;
          }
          case  '8':  {
            authSetup.AD00005 = this.appFunctionEnable;
            break;
          }
          case  '9':  {
            authSetup.SR00005 = this.appFunctionEnable;
            break;
          }
          case  '10':  {
            authSetup.AD00006 = this.appFunctionEnable;
            break;
          }
          case  '11':  {
            authSetup.AD00007 = this.appFunctionEnable;
            break;
          }
        }
      }
    }
    // console.log(authSetup);
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要儲存嗎？`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      // console.info(this.houseData);
      const temp: FdsCommunityList = this.form1.value;

      if (temp.commName !== null) {
        temp.commName = temp.commName.trim();
      }
      if (temp.commAdd3 !== null) {
        temp.commAdd3 = temp.commAdd3.trim();
      }
      if (this.form3.get('admNum').value) {
        temp.admNum = String(this.form3.get('admNum').value);
      } else {
        temp.admNum = '';
      }
      if (this.houseData.length !== 0) {
        temp.houseList =  this.houseData;
      }
      if (this.AppFunction.length !== 0) {
        temp.authSetup = authSetup;
      }
      console.info(temp);
      this.httpService.postData(this.put_post_path, temp)
      .subscribe((result: CommRootObject) => {
       this.snackbar.open(result.message, null, {
        duration: 5000
      });
       console.log(result.message);
       this.isLoading = false;
      },
      error => {
        this.snackbar.open(error, null, {
          duration: 5000
        });
        console.error(error);
        this.isLoading = false;
      });
    });
  }

  // 讀取住戶資料
  fileUpload(event) {
    // console.info(event);
    if (event.target.files[0] !== undefined) {
      const len = event.target.files[0].name.indexOf('.');
      const filetype = event.target.files[0].name.substring(len + 1);
      // console.info(len);
      // console.info(filetype);
      if (!(filetype === 'csv')) {
        this.snackbar.open('請選擇csv檔', null, {
          duration: 3000
        });
        this.isCsvFile = false;
      } else {
        const reader = new FileReader();
        reader.readAsText(event.srcElement.files[0], 'big5');
        const me = this;
        reader.onload = () => {
          console.log( reader.result);
          me.houseData = this.csvJSON(<string>reader.result);
        };
        this.isCsvFile = true;
      }
    } else {
      this.snackbar.open('請選擇csv檔', null, {
        duration: 3000
      });
      this.isCsvFile = false;
    }
  }

  // csvToArray
    public csvJSON(csv) {
      const headers = 'address,road,houseNum,floor,add1,add2';
      const lines = csv.split('\n');
      const result = [];
      const header = headers.split(',');
      for (let i = 1; i < lines.length; i++) {

        const obj = {};
        const currentline = lines[i].split(',');
        console.log(currentline.length);
        if (currentline.length <= 3 || currentline[0].trim() === '') {
          continue;
        }
          for (let j = 0; j < header.length; j++) {
              obj[header[j]] = currentline[j];
          }
          result.push(obj);
      }
      return result;
  }
}


export interface FdsCommunityList {
  commId?: any;
  commName?: any;
  commAdd1?: any;
  commAdd2?: any;
  commAdd3?: any;
  houseList?: ApphouseList[];
  admNum?: any;
  authSetup?: AuthSetup;
}

export interface ApphouseList {
  address?: any;
  road?: any;
  houseNum?: any;
  floor?: any;
  add1?: any;
  add2?: any;
}

interface AuthSetup {
  AD00001?: any;
  SR00001?: any;
  AD00002?: any;
  SR00002?: any;
  AD00003?: any;
  SR00003?: any;
  SR00004?: any;
  AD00004?: any;
  AD00005?: any;
  SR00005?: any;
  AD00006?: any;
  AD00007?: any;
}
