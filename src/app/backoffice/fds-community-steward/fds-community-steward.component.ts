import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiUrl } from 'environments/api-url';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { CommRootObject } from 'app/api-result/api-result.interface';
import { map } from 'rxjs/operators';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'fds-community-steward',
  templateUrl: './fds-community-steward.component.html',
  styleUrls: ['./fds-community-steward.component.scss']
})
export class FdsCommunityStewardComponent implements OnInit {

  eventDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  selectedIndex = 0;
  isLoadingLS = true;
  isLoading = false;
  form1: FormGroup;
  mode: 'create' | 'update' = 'create';
  license_type$: Observable<any[]>;
  private license_type_path = ApiUrl.fs_license_path;
  private mgr_mst_path = ApiUrl.fs_create_mgr_mst_path;
  private update_mgr_mst_path = ApiUrl.fs_update_mgr_mst_path;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any, private fb: FormBuilder, private httpService: HttpServiceService,
    private dialog: MatDialog, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.createForm();
    this.getInitType();
    if (this.defaults) {
      this.mode = 'update';
      // console.log(this.defaults);
      this.form1.patchValue(this.defaults);
      this.form1.patchValue({ 'onboardDate': moment(new Date(this.defaults.onboardDate)).format('YYYY-MM-DD') });
      this.form1.patchValue({ 'quitDate': moment(new Date(this.defaults.quitDate)).format('YYYY-MM-DD') });
    } else {
      this.mode = 'create';
    }
  }

  createForm = () => {
    this.form1 = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(10)]],
      userId: ['', [Validators.required,  Validators.maxLength(20),
        ]],
      mobile: ['', [ Validators.pattern('^09[0-9]{8}$'), Validators.required,  Validators.maxLength(10)]],
      license: ['', [Validators.required]],
      onboardDate: ['', [Validators.required]],
      quitDate: [''],
      storeMgrName: ['', [Validators.required,  Validators.maxLength(10)]],
      storeMgrId: ['', [Validators.required,  Validators.maxLength(20)]],
      dutymName: ['', [Validators.required,  Validators.maxLength(10)]],
      dutymId: ['', [Validators.required,  Validators.maxLength(20)]],
      remark: ['', Validators.maxLength(200)]
    });
  }

  reset(data) {
    if (this.mode === 'create') {
      this.form1.reset();
    } else {
      this.form1.patchValue(this.defaults);
      this.form1.patchValue({ 'onboardDate': moment(new Date(this.defaults.onboardDate)).format('YYYY-MM-DD') });
      this.form1.patchValue({ 'quitDate': moment(new Date(this.defaults.quitDate)).format('YYYY-MM-DD') });
    }
  }

  getInitType = () => {
    this.license_type$ = this.httpService.getRemoteData(this.license_type_path)
      .pipe(map((data: CommRootObject) => data.data));

  }

  saveForm = (formValue) => {
    // console.log(formValue);
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要儲存嗎？`,
        type: '1'
      }
    });

    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      formValue.onboardDate = moment(new Date(this.form1.get('onboardDate').value)).format(this.eventDateFormat);
      formValue.quitDate = moment(new Date(this.form1.get('quitDate').value)).format(this.eventDateFormat);
      if (this.mode === 'create') {
        this.httpService.postData(this.mgr_mst_path, this.form1.value)
        .subscribe(
          (val: CommRootObject) => {
            if (val.errorCode === '100') {
              this.snackbar.open(val.message, null, {
                duration: 5000
              });
              this.form1.reset();
              // this.router.navigateByUrl('');
            }
          },
          error => {
            if (error.errorCode === '999') {
              this.snackbar.open('已存在的管家工號', null, {
                duration: 5000
              });
            }
            if (error.errorCode === '903') {
              this.snackbar.open('建立失敗，必填欄位未輸入', null, {
                duration: 5000
              });
            }
            this.isLoading = false;
          },
          () => { this.isLoading = false; }
        );
      } else {
        this.httpService.putData(this.update_mgr_mst_path, this.form1.value)
        .subscribe(
          (val: CommRootObject) => {
            if (val.errorCode === '117') {
              this.snackbar.open(val.message, null, {
                duration: 5000
              });

            }
          },
          error => {
            if (error.errorCode === '927') {
              this.snackbar.open(error.message, null, {
                duration: 5000
              });
            }
            if (error.errorCode === '918') {
              this.snackbar.open(error.message, null, {
                duration: 5000
              });
            }
          },
          () => { this.isLoading = false; }
        );
    }
  });

}
}
