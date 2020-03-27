import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { ApiUrl } from 'environments/api-url';
import { Observable, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, delay } from 'rxjs/operators';
import { CommRootObject } from 'app/api-result/api-result.interface';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'comm-info',
  templateUrl: './comm-info.component.html',
  styleUrls: ['./comm-info.component.scss']
})
export class CommInfoComponent implements OnInit {

  // 宣告往外傳遞的事件
  @Output()
  getModal = new EventEmitter();
  @Output()
  sendForm = new EventEmitter();
  form1: FormGroup;
  @Input() modify;
  searchTerm$ = new Subject<string>();
  private CommId;
  isLoading = true;
  commIdisLoading = false;
  getCountyId: any[] = [];
  getTownshipId: any[] = [];
  getSiteInCharge$: Observable<any>;
  getStatus$: Observable<any>;
  getUserInCharge: any[] = [];
  dynamicUser: any[] = [];
  private County_path = ApiUrl.appCounty_path;
  private SiteInCharge_path = ApiUrl.fs_site_in_charge_path;
  private Status_path = ApiUrl.fs_status_path;
  private NextCommId_path = ApiUrl.fs_nextCommId_path;
  private UserInCharge_path = ApiUrl.fs_user_in_charge_path;
  focused = false;
  constructor(private httpService: HttpServiceService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public defaults: any) { }

  ngOnInit() {
    this.form1 = this.fb.group({
      commId: [],
      commName: ['', [Validators.maxLength(40), Validators.required]],
      commAdd1: ['', [Validators.required]],
      commAdd2: ['', [Validators.required]],
      commAdd3: ['', [Validators.maxLength(200), Validators.required]],
      siteInCharge: ['', [Validators.required]],
      userInCharge: ['', [Validators.required]],
      status: [''],
      numHouse: ['', [Validators.pattern('^[0-9]*$'), Validators.required]],
      chiefStaffName: ['', [Validators.maxLength(20)]],
      chiefStaffTel: ['', [Validators.maxLength(20)]],
      chiefStaffMobile: ['', [Validators.maxLength(10)]],
      chairmanName: ['', [Validators.maxLength(20)]],
      chairmanTel: ['', [Validators.maxLength(20)]],
      chairmanMobile: ['', [Validators.maxLength(10)]]
    });
    this.onValueChanges();
    this.getInitCommunityValue();
    this.getInitType();
    if (!this.modify.commId) {
      this.getCommId();
    }
    console.log('modify', this.modify);

    this.searchTerm$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(event => {
        // console.log(event);
        this.dynamicUser = this.getUserInCharge.filter((item: { 'userId': string, 'userName': string }) => {
          return item.userName.includes(event);
        });
        this.getUserInCharge.forEach((item: { 'userId': string, 'userName': string }) => {
          if (item.userId.includes(event) && !(this.dynamicUser.includes(event))) {
            this.dynamicUser.unshift(item);
          }
        });

      });
  }

  getInitType = () => {
    this.getSiteInCharge$ = this.httpService.getRemoteData(this.SiteInCharge_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getStatus$ = this.httpService.getRemoteData(this.Status_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.httpService.getRemoteData(this.UserInCharge_path)
      .pipe(map((data: CommRootObject) => data.data))
      .subscribe(mapData => {
        this.getUserInCharge = mapData;

        if (this.modify.commId) {
          this.CommId = this.modify.commId;
          this.form1.patchValue(this.modify);
          this.form1.patchValue({'userInCharge': this.modify.userInCharge});
        }
      });
  }

  getCommId = async () => {
    this.commIdisLoading = true;
    await delay(10000);
    this.httpService.getRemoteData(this.NextCommId_path)
      .subscribe(
        (value: any) => {
          this.CommId = value.data;
          this.form1.patchValue({ 'commId': value.data });
        },
        error => {
          console.log('getCommId error ', error);
          this.commIdisLoading = false;
        },
        () => { this.commIdisLoading = false; }
      );
  }

  onValueChanges = () => {
    this.form1.valueChanges.subscribe((val) => {
      this.getModal.emit({ 'val': val, 'count': 1, 'invalid': this.form1.invalid });
    });

  }

  // 變化鄉鎮
  changeTownshipId($eventValue: string) {
    // tslint:disable-next-line: radix
    const county = parseInt($eventValue) - 1;
    this.getTownshipId = this.getCountyId[county].areaList;
  }

  // 獲取縣市鄉鎮
  getInitCommunityValue() {
    this.httpService.getRemoteData(this.County_path)
      .subscribe((data: FsAddress) => {
        // console.log('data subscribe', data);
        if (data.data) {
          this.getCountyId = data.data;
          for (const i in this.getCountyId) {
            if (!(this.getCountyId === [])) {
              for (const j in data.data[i].areaList) {
                if (!(data.data[i].areaList === [])) {
                  // console.log(data.data[i].areaList[j]);
                  this.getTownshipId.push(data.data[i].areaList[j]);
                }
              }
            }
          }
        }

      },
        error => {
          console.log('communityadd getInitCommunityValue error', error);
        });
  }

  reset = (formdata: FormGroup) => {
    console.log(this.modify.commId);
    if (this.modify.commId) {
      this.form1.patchValue(this.modify);
    } else {
      this.form1.reset();
      this.form1.patchValue(
        { commId: this.CommId }
      );
    }
  }

  saveForm = () => {
    this.form1.markAllAsTouched();
    this.sendForm.emit();
  }

  openDropdown() {
    this.focused = true;
  }

  closeDropdown() {
    // console.log('two',this.form1.get('userInCharge').value);
    // console.log('modifyUserInCharge');
    this.focused = false;
    let existence = false;
    for (const item of this.getUserInCharge) {
      if (item.userId !== this.form1.get('userInCharge').value) {
        existence = false;
      } else {
        existence = true;
        break;
      }
  }
  if (!existence) {
    this.form1.patchValue({'userInCharge': ''});
  }
}

  selectUserInCharge = (item) => {
    // console.log(item);
    // console.log('three',this.form1.get('userInCharge').value);
    this.form1.patchValue({'userInCharge': item.userId});
  }
}


interface FsAddress {
  status: string;
  errorCode: string;
  message: string;
  data: Array<any>;
}
