import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { ApiUrl } from 'environments/api-url';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommRootObject } from 'app/api-result/api-result.interface';
import * as moment from 'moment';

@Component({
  selector: 'construction',
  templateUrl: './construction.component.html',
  styleUrls: ['./construction.component.scss']
})
export class ConstructionComponent implements OnInit {

  @Input() modify;
  @Output()
  getModal = new EventEmitter();
  @Output()
  sendForm = new EventEmitter();
  form2: FormGroup;
  hyear: string;
  getcomm_type$: Observable<any[]>;
  getcomm_pattern$: Observable<any[]>;
  getinterior_type$: Observable<any[]>;
  getbuild_exterior$: Observable<any[]>;
  private comm_type_path = ApiUrl.fs_comm_type_path;
  private comm_pattern_path = ApiUrl.fs_comm_pattern_path;
  private interior_type_path = ApiUrl.fs_comm_interior_path;
  private build_exterior_path = ApiUrl.fs_comm_exterior_path;
  constructor(private httpService: HttpServiceService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form2 = this.fb.group({
      buildCompany: ['', [Validators.maxLength(40)]],
      buildDate: [''],
      commType: [['']],
      commPattern: [['']],
      interiorType: [['']],
      buildExterior: [['']],
      house_age: ['']
    });
    this.onValueChanges();
    this.getInitType();

    if (this.modify.buildDate) {
      this.form2.patchValue(this.modify);
      this.form2.patchValue({ 'buildDate': moment(new Date(this.modify.buildDate)).format('YYYY-MM-DD') });
      this.houseAge(this.modify.buildDate);
    }

    this.form2.get('buildDate').valueChanges.subscribe((date) => {
      this.houseAge(date);
    });
  }

  houseAge(date) {
    const nowTime = new Date().toString();
    const tDistance = (Date.parse(nowTime).valueOf() - Date.parse(date).valueOf()) / (1000 * 60 * 60 * 24 * 365);
    this.form2.patchValue({ 'house_age': Math.ceil(tDistance) + '年' });
  }

  getInitType = () => {
    this.getcomm_type$ = this.httpService.getRemoteData(this.comm_type_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getcomm_pattern$ = this.httpService.getRemoteData(this.comm_pattern_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getinterior_type$ = this.httpService.getRemoteData(this.interior_type_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getbuild_exterior$ = this.httpService.getRemoteData(this.build_exterior_path)
      .pipe(map((data: CommRootObject) => data.data));
  }

  onValueChanges = () => {
    this.form2.valueChanges.subscribe((val) => {
      console.log(val);
      this.getModal.emit({ 'val': val, 'count': 2 });
    });

  }
  reset = (formdata: FormGroup) => {
    if (this.modify) {
      this.form2.patchValue(this.modify);
      this.form2.patchValue({ 'buildDate': moment(new Date(this.modify.buildDate)).format('YYYY-MM-DD') });
    } else {
      formdata.reset();
    }
  }

  saveForm = () => {
    this.sendForm.emit();
  }
}
