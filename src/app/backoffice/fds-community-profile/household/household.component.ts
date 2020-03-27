import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { Observable } from 'rxjs';
import { ApiUrl } from 'environments/api-url';
import { map } from 'rxjs/operators';
import { CommRootObject } from 'app/api-result/api-result.interface';

@Component({
  selector: 'household',
  templateUrl: './household.component.html',
  styleUrls: ['./household.component.scss']
})
export class HouseholdComponent implements OnInit {

  @Input() modify;
  @Output()
  getModal = new EventEmitter();
  @Output() sendForm = new EventEmitter();
  form3: FormGroup;
  gethousehold$: Observable<any[]>;
  getAppYn$: Observable<any[]>;
  getAppName$: Observable<any[]>;
  private household_type_path = ApiUrl.fs_household_type_path;
  private app_yn_path = ApiUrl.fs_app_yn_path;
  private app_name_path = ApiUrl.fs_app_name_path;
  constructor(private httpService: HttpServiceService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form3 = this.fb.group({
      orgType: ['', [Validators.maxLength(7)]],
      householdType: [''],
      orgTee: [null],
      housePrice: [null],
      appYn: [''],
      appName: ['']
    });
    this.onValueChanges();
    this.getInitType();

    if (this.modify) {
      this.form3.patchValue(this.modify);
      this.form3.patchValue({
        'orgTee': this.modify.orgTee,
        'housePrice': this.modify.housePrice
      });
    }
  }

  getInitType = () => {
    this.gethousehold$ = this.httpService.getRemoteData(this.household_type_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getAppYn$ = this.httpService.getRemoteData(this.app_yn_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getAppName$ = this.httpService.getRemoteData(this.app_name_path)
      .pipe(map((data: CommRootObject) => data.data));
  }

  onValueChanges = () => {
    this.form3.valueChanges.subscribe((val) => {
      console.log(val);
      this.getModal.emit({ 'val': val, 'count': 3 });
    });

  }
  saveForm = (data) => {
    this.sendForm.emit();
  }

  reset = (formdata: FormGroup) => {
    if (this.modify) {
      this.form3.patchValue(this.modify);
    } else {
      formdata.reset();
    }
  }

}
