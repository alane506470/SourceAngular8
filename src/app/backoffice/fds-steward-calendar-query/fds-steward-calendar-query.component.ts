import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { ApiUrl } from 'environments/api-url';
import * as moment from 'moment';

@Component({
  selector: 'fds-steward-calendar-query',
  templateUrl: './fds-steward-calendar-query.component.html',
  styleUrls: ['./fds-steward-calendar-query.component.scss']
})
export class FdsStewardCalendarQueryComponent implements OnInit {

  form1: FormGroup;
  isLoading = false;
  private exportInfo_path = ApiUrl.fs_export_calendar_path;
  constructor(private fb: FormBuilder, private httpService: HttpServiceService) { }

  ngOnInit() {
    this.form1 = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });
  }

  reset() {
    this.form1.reset();
  }

  concatUrl = (path) => {
    let uri = path.concat('?');
    if (this.getValue('startDate') === undefined || this.getValue('startDate') === null || this.getValue('endDate') === '') {
      uri = uri.concat(`startDate=&`);
    } else {
      uri = uri.concat(`startDate=${ moment(new Date(this.getValue('startDate'))).format('YYYY-MM-DD hh:mm:ss')}&`);
    }
    if (this.getValue('endDate') === undefined || this.getValue('endDate') === null || this.getValue('endDate') === '') {
      uri = uri.concat(`endDate=&`);
    } else {
      console.log(this.getValue('endDate'));
      uri = uri.concat(`endDate=${moment(new Date(this.getValue('endDate'))).format('YYYY-MM-DD hh:mm:ss')}&`);
    }
    return decodeURIComponent(uri);
  }

  getValue = (column) => {
    return this.form1.get(column).value;
  }

  async onSubmit() {
    this.isLoading = true;
    this.httpService.getRemoteBlobByPost(this.concatUrl(this.exportInfo_path), {}, '行事曆明細');
    await this.delay(5000);
    this.isLoading = false;
  }

  async delay(time: number): Promise<void> {
    return new Promise<void>((res, rej) => {
      setTimeout(res, time);
    });
  }

}
