import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { Observable, Subject } from 'rxjs';
import { ApiUrl } from 'environments/api-url';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommRootObject, RootObject } from 'app/api-result/api-result.interface';
import { environment } from 'environments/environment';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'fds-steward-calendar-add',
  templateUrl: './fds-steward-calendar-add.component.html',
  styleUrls: ['./fds-steward-calendar-add.component.scss']
})
export class FdsStewardCalendarAddComponent implements OnInit {

  eventDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  attachIdZero = null;
  attachIdFirst = null;
  attachIdTwo = null;
  CalendarId = null;
  form1: FormGroup;
  isLoading = true;
  fileisLoading = false;
  focused: boolean;
  searchTerm$ = new Subject<string>();
  dynamicUser: any[] = [];
  selectedIndex = 0;
  file_upload_URL = ApiUrl.fs_create_mgr_attach_path;
  private mgr_calendar_path = ApiUrl.fs_create_mgr_calendar_path;
  mode: 'create' | 'update' = 'create';
  getUserInCharge: any[] = [];
  kcToken = localStorage.getItem('kc_token');
  public uploader = new FileUploader({
    method: 'POST',
    authTokenHeader: 'Authorization',
    authToken: `Bearer ${this.kcToken}`,
    itemAlias: 'mgrAttach',
    autoUpload: false,
    queueLimit: 1
  });
  uploader1 = new FileUploader({
    method: 'POST',
    authTokenHeader: 'Authorization',
    authToken: `Bearer ${this.kcToken}`,
    itemAlias: 'mgrAttach',
    autoUpload: false,
    queueLimit: 1
  });
  uploader2 = new FileUploader({
    method: 'POST',
    authTokenHeader: 'Authorization',
    authToken: `Bearer ${this.kcToken}`,
    itemAlias: 'mgrAttach',
    autoUpload: false,
    queueLimit: 1
  });
  input;
  private Local_HOST = 'http://localhost:8088/';
  getVisitType$: Observable<any[]>;
  getContact$: Observable<any[]>;
  getContactPeople$: Observable<any[]>;
  private VisitType_path = ApiUrl.fs_visit_path;
  private ContactType_path = ApiUrl.fs_contact_path;
  private ContactPeople_path = ApiUrl.fs_contact_p_path;
  private CalendarId_path = ApiUrl.fs_next_calendarId_path;
  private UserInCharge_path = ApiUrl.fs_user_in_charge_path;
  constructor(private fb: FormBuilder, private httpService: HttpServiceService,
    private snackbar: MatSnackBar, public dialog: MatDialog, public router: Router) { }

  ngOnInit() {
    this.form1 = this.fb.group({
      calendarId: [],
      userId: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      visitType: ['', [Validators.required]],
      visitPlace: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      contactP: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      visitRec: ['']
    });

    this.searchTerm$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(event => {
        this.dynamicUser = this.getUserInCharge.filter((item: { 'userId': string, 'userName': string }) => {
          // console.log(item.userName);
          return item.userName.includes(event);
        });
        this.getUserInCharge.forEach((item: { 'userId': string, 'userName': string }) => {
          if (item.userId.includes(event) && !(this.dynamicUser.includes(event))) {
            this.dynamicUser.unshift(item);
          }
        });
      });
    this.getInitType();
    this.nextCalendarId();
  }

  nextCalendarId = () => {
    this.httpService.getRemoteData(this.CalendarId_path)
      .subscribe((data: CommRootObject) => {
        console.log(data.data);
        this.CalendarId = data.data;
        this.form1.patchValue({ 'calendarId': data.data });
      });
  }
  getInitType = () => {
    this.getVisitType$ = this.httpService.getRemoteData(this.VisitType_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getContact$ = this.httpService.getRemoteData(this.ContactType_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getContactPeople$ = this.httpService.getRemoteData(this.ContactPeople_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.httpService.getRemoteData(this.UserInCharge_path)
      .pipe(map((data: CommRootObject) => data.data))
      .subscribe(mapData => {
        this.getUserInCharge = mapData;
      });
  }

  handleFileInput(files: File[], type: any) {
    if (type === 'one') {
      this.uploader1.clearQueue();
    } else if (type === 'two') {
      this.uploader2.clearQueue();
    } else if (type === 'zero') {
      this.uploader.clearQueue();
    }

  }



  reset(data) {
    this.form1.reset();
    this.form1.patchValue(
      { calendarId: this.CalendarId }
    );
  }

  fileUploadSubmit(type) {
    this.fileisLoading = true;
    if (type === 'one') {
      this.prepareFile(this.uploader1, 'one');
    } else if (type === 'two') {
      this.prepareFile(this.uploader2, 'two');
    } else if　(type === 'zero') {
      console.log(this.uploader);
      this.prepareFile(this.uploader, 'zero');
    }
  }

  prepareFile = (uploader: FileUploader, type: string) => {
    let upload_path = `${this.Local_HOST}${this.file_upload_URL}/${this.form1.get('calendarId').value}/`;
    uploader.queue.forEach((item: any) => {
      upload_path = this.concatUrl(upload_path, item.some.name);
    });
    uploader.onBeforeUploadItem = (item) => {
      item.url = decodeURIComponent(upload_path);
    };
    console.log(uploader);
    uploader.uploadAll();
    uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, type);
  }

  fileDelSubmit(type: any) {
    this.fileisLoading = true;
    const upload_path = `${this.file_upload_URL}/${this.form1.get('calendarId').value}/${type}`;
    this.httpService.deleteData(upload_path)
      .subscribe((data: CommRootObject) => {
        if (data.errorCode === '145') {
          this.snackbar.open(data.message, null, {
            duration: 5000
          });
        }
      },
      error => {
        if (error.errorCode === '937') {
          this.snackbar.open(error.message, null, {
            duration: 5000
          });
        }
        if (error.errorCode === '918') {
          this.snackbar.open(error.message, null, {
            duration: 5000
          });
        }
        console.log(error);
        this.isLoading = false;
      },
      () => { this.isLoading = false; });
  }

  concatUrl(url, fileName) {
    url = url.concat(`${fileName},`);
    return url;
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    console.log('file server fail response', response);
    this.fileisLoading = false;
    this.snackbar.open(`連線檔案上傳Server失敗，請洽管理人員`, '我知道了');
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders, type: string): any {
    const resault: RootObject = JSON.parse(response);
    console.log(this.fileisLoading);
    this.fileisLoading = false;
    console.log('file success', resault);
    if (resault.status === 'SUCCESS') {
      this.snackbar.open('上傳成功', null, {
        duration: 5000
      });
      if (type === 'one') {
        this.attachIdFirst = resault.data;
      } else if (type === 'two') {
        this.attachIdTwo = resault.data;
      } else {
        this.attachIdZero = resault.data;
      }
    } else {
      this.snackbar.open(`上傳失敗，原因：${resault.message}`, '我知道了', {
        duration: 5000
      });
      if (type === 'one') {
        this.attachIdFirst = null;
      } else if (type === 'two') {
        this.attachIdTwo = null;
      } else {
        this.attachIdZero = null;
      }
    }
  }

  openDropdown() {
    this.focused = true;
  }

  closeDropdown() {
    this.focused = false;
    let existence = false;
    for (const item of this.getUserInCharge) {
      if (item.userId !== this.form1.get('userId').value) {
        existence = false;
      } else {
        existence = true;
        break;
      }
    }
    if (!existence) {
      this.form1.patchValue({ 'userId': null });
    }
  }

  selectUserInCharge = (item) => {
    this.form1.patchValue({ 'userId': item.userId });
  }

  sendForm = (formValue) => {
    formValue.startDate = moment(new Date(this.form1.get('startDate').value)).format(this.eventDateFormat);
    formValue.endDate = moment(new Date(this.form1.get('endDate').value)).format(this.eventDateFormat);
    console.log(formValue);
    if (this.form1.valid === false) {
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
          this.httpService.postData(this.mgr_calendar_path, formValue)
            .subscribe(
              (val: CommRootObject) => {
                if (val.errorCode === '903') {
                  this.snackbar.open(val.message, null, {
                    duration: 5000
                  });
                }
                if (val.errorCode === '100') {
                  this.snackbar.open(val.message, null, {
                    duration: 5000
                  });
                  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                  this.router.onSameUrlNavigation = 'reload';
                  this.router.navigate(['/apps/fds-steward-calendar-add']);
                }
              },
              error => {
                console.log(error);
                this.snackbar.open('建立失敗', null, {
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

}
