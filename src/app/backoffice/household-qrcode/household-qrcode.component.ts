import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../../app/http-service/http-service.service';
import { ApiUrl } from '../../../environments/api-url';
import { CommRootObject } from '../../../app/api-result/api-result.interface';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fury-household-qrcode',
  templateUrl: './household-qrcode.component.html',
  styleUrls: ['./household-qrcode.component.scss']
})
export class HouseholdQrcodeComponent implements OnInit {

  isClick = false;
  isLoading: boolean;
  memberQrCode: Array<MemberQrCode> = [];
  private appMemberInfo_path = ApiUrl.appMemberInfo_path;

  constructor( private httpService: HttpServiceService,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.postMemberValue();
  }

  postMemberValue() {
    this.isLoading = true;
    console.log(new URL(location.href).searchParams.get('commId'));
     const temp: AppMemberQuery = {commId: new URL(location.href).searchParams.get('commId')};
     this.httpService.postData(this.appMemberInfo_path, temp)
     .pipe(map((rootObject: CommRootObject) => {
       console.log(rootObject);
      if (rootObject.status === 'ERROR' && rootObject.data === null) {
        this.snackbar.open('查無會員資料資料', null, {
          duration: 5000
        });
      } else {
        for (const i in rootObject.data) {
          if (rootObject.data.length !== 0) {
            this.memberQrCode.push(rootObject.data[i]);
            this.memberQrCode[i].qrAddress = rootObject.data[i].road + ',' +
            rootObject.data[i].houseNum + ',' + rootObject.data[i].floor + ',' + rootObject.data[i].houseId;
          }
        }
      }
  }))
  .subscribe(() => {
    this.isLoading = false;
  },
    error => {
      console.error(error);
      this.isLoading = false;
    });
}

  async isPrint() {
    console.log(this.isClick);
    this.isClick = true;
    await this.sleep(5000);
    this.isClick = false;
}

async sleep(time: number): Promise<void> {
  return new Promise<void>((res, rej) => {
    setTimeout(res, time);
  });
}
}

interface AppMemberQuery {
  commId?: any;
}

interface MemberQrCode {
  qrAddress?: string;
}
