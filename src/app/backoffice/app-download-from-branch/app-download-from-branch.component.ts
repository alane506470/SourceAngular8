import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ApiUrl } from 'environments/api-url';
import { AppCodeList } from 'app/api-result/api-result.interface';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'fury-app-download-from-branch',
  templateUrl: './app-download-from-branch.component.html',
  styleUrls: ['./app-download-from-branch.component.scss']
})
export class AppDownloadFromBranchComponent implements OnInit {

  isLoading: boolean;
  storeDownloadForm: FormGroup;
  endisDefault = true;
  startIsDefault = true;
  dbDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  datePickerMinDate = moment(new Date()).add(-180, 'days').format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(180, 'days').format('YYYY-MM-DD');
  private appCodes_path = ApiUrl.appCodes_path;
  private appExportBranch_path = ApiUrl.appExportBranch_path;
  getChannelId: AppCodeList[] = [];
  constructor(private httpService: HttpServiceService,  private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.getInitForm();
    this.getInitChannelId();
  }

  getInitForm() {
    this.storeDownloadForm = new FormGroup({
      'channelId': new FormControl(''),
      'fromDate': new FormControl(moment(new Date()).format('YYYY-MM-DD') || '', [Validators.required]),
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
    const userDate: any = this.storeDownloadForm.value;
    if (this.endisDefault && this.startIsDefault ) {
      userDate.fromDate = moment(new Date(userDate.fromDate)).add(-8, 'hours').format(this.dbDateFormat);
      userDate.endDate = moment(new Date(userDate.endDate))
      .add(15, 'hours').add(59, 'minutes').add(59, 'seconds').format(this.dbDateFormat);
    } else if (this.endisDefault) {
      userDate.fromDate = moment(new Date(userDate.fromDate)).format(this.dbDateFormat);
      userDate.endDate = moment(new Date(userDate.endDate))
      .add(15, 'hours').add(59, 'minutes').add(59, 'seconds').format(this.dbDateFormat);
    }  else if (this.startIsDefault) {
      userDate.fromDate = moment(new Date(userDate.fromDate)).add(-8, 'hours').format(this.dbDateFormat);
      userDate.endDate = moment(new Date(userDate.endDate))
      .add(23, 'hours').add(59, 'minutes').add(59, 'seconds').format(this.dbDateFormat);
    } else {
      userDate.fromDate = moment(new Date(userDate.fromDate)).format(this.dbDateFormat);
      userDate.endDate = moment(new Date(userDate.endDate))
      .add(23, 'hours').add(59, 'minutes').add(59, 'seconds').format(this.dbDateFormat);
    }

    if ( userDate.fromDate >  userDate.endDate) {
      this.snackbar.open('開始時間不能在結束時間之後' , '我知道了');
    } else {
      this.isLoading = true;
      console.log(userDate);
      this.httpService.getRemoteBlobByPost(this.appExportBranch_path, userDate, 'appStoreDownload');
      await this.delay(5000);
      // this.storeDownloadForm.reset();
      this.isLoading = false;
}
  }

  async delay(time: number): Promise<void> {
    return new Promise<void>((res, rej) => {
      setTimeout(res, time);
    });
  }

}
