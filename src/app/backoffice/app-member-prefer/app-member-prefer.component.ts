import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppCodeList } from 'app/api-result/api-result.interface';
import { Observable } from 'rxjs/Observable';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { ApiUrl } from 'environments/api-url';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { result } from 'lodash-es';
@Component({
  selector: 'fury-app-member-prefer',
  templateUrl: './app-member-prefer.component.html',
  styleUrls: ['./app-member-prefer.component.scss']
})
export class AppMemberPreferComponent implements OnInit {

  isLoading = false;
  startIsDefault = true;
  endisDefault = true;
  dbDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  preferform: FormGroup;
  private appExportPreference_path = ApiUrl.appExportPreference_path;
  datePickerMinDate = moment(new Date()).add(-180, 'days').format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(180, 'days').format('YYYY-MM-DD');
  getPrefer = [
    {
      name: '品類',
      codeNo: '1'
    },
    {
      name: '店別',
      codeNo: '2'
    },
    {
      name: '全部',
      codeNo: '3'
    },
];
private appCodes_path = ApiUrl.appCodes_path;

getChannelId: AppCodeList[] = [];
  constructor(private httpService: HttpServiceService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.getInitChannelId();
    this.getInitForm();

}

getInitForm() {
  this.preferform = new FormGroup({
    'channelId': new FormControl(''),
    'likeType': new FormControl(''),
    'startDate': new FormControl(moment(new Date()).format('YYYY-MM-DD') || '', [Validators.required]),
    'endDate': new FormControl(moment(new Date()).add(10, 'days').add(-7, 'hours')
    .add(-59, 'minutes').format('YYYY-MM-DD') || '', [Validators.required])
  });
}

getInitChannelId() {
  this.isLoading = true;
  this.httpService.getRemoteData(this.appCodes_path.concat(`?codeClass=channel_id`))
  .subscribe(
    (data: any) => {
      console.log(data);
      this.getChannelId = data.data.list;
      console.log(this.getChannelId);
      this.isLoading = false;
    },
    error => {
      console.log(error);
    }
  );
}


EndisDefault() {
  this.endisDefault = false;
}

StartisDefault() {
  this.startIsDefault = false;
}

async getData() {
  const userDate: any = this.preferform.value;
  console.log(this.startIsDefault, this.endisDefault);
  if (this.endisDefault && this.startIsDefault ) {
    userDate.startDate = moment(new Date(userDate.startDate)).add(-8, 'hours').format(this.dbDateFormat);
    userDate.endDate = moment(new Date(userDate.endDate)).add(15, 'hours').add(59, 'minutes').add(59, 'seconds').format(this.dbDateFormat);
  } else if (this.endisDefault) {
    userDate.startDate = moment(new Date(userDate.startDate)).format(this.dbDateFormat);
    userDate.endDate = moment(new Date(userDate.endDate)).add(15, 'hours').add(59, 'minutes').add(59, 'seconds').format(this.dbDateFormat);
  }  else if (this.startIsDefault) {
    userDate.startDate = moment(new Date(userDate.startDate)).add(-8, 'hours').format(this.dbDateFormat);
    userDate.endDate = moment(new Date(userDate.endDate)).add(23, 'hours').add(59, 'minutes').add(59, 'seconds').format(this.dbDateFormat);
  } else {
    userDate.startDate = moment(new Date(userDate.startDate)).format(this.dbDateFormat);
    userDate.endDate = moment(new Date(userDate.endDate)).add(23, 'hours').add(59, 'minutes').add(59, 'seconds').format(this.dbDateFormat);
  }

  if ( userDate.startDate >  userDate.endDate) {
    this.snackbar.open('開始時間不能在結束時間之後' , '我知道了');
  } else {
    this.isLoading = true;
     console.log(userDate);
    this.httpService.getRemoteBlobByPost(this.appExportPreference_path, userDate, 'memberLikes');
    await this.delay(5000);
    this.isLoading = false;
  }
}

async delay(time: number): Promise<void> {
  return new Promise<void>( (res, rej) => {
    setTimeout(res, time);
  });
}

}

