import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { ApiUrl } from 'environments/api-url';
import { Observable } from 'rxjs';
import { CommRootObject } from 'app/api-result/api-result.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'air',
  templateUrl: './air.component.html',
  styleUrls: ['./air.component.scss']
})
export class AirComponent implements OnInit {

  @Input() modify;
  @Output()
  getModal = new EventEmitter();
  @Output()
  sendForm = new EventEmitter();
  form5: FormGroup;
  getAirType$: Observable<any[]>;
  getWindowType$: Observable<any[]>;
  getSeparateType$: Observable<any[]>;
  getIndoorType$: Observable<any[]>;
  getSunType$: Observable<any[]>;
  private AirType_path = ApiUrl.fs_comm_ac_type;
  private WindowType_path = ApiUrl.fs_comm_ac_window_path;
  private SeparateType_path = ApiUrl.fs_comm_ac_seperate_path;
  private IndoorType_path = ApiUrl.fs_comm_ac_indoor_path;
  private SunType_path = ApiUrl.fs_comm_ac_sun_path;
  constructor(private httpService: HttpServiceService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form5 = this.fb.group({
      acType: [''],
      windowType: [['']],
      separateType: [['']],
      indoorType: [['']],
      sunType: [['']]
    });
    this.onValueChanges();
    this.getInitType();
    console.log(this.modify);
    if (this.modify) {
      this.form5.patchValue(this.modify);
    }
  }

  getInitType = () => {
    this.getAirType$ = this.httpService.getRemoteData(this.AirType_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getWindowType$ = this.httpService.getRemoteData(this.WindowType_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getSeparateType$ = this.httpService.getRemoteData(this.SeparateType_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getIndoorType$ = this.httpService.getRemoteData(this.IndoorType_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getSunType$ = this.httpService.getRemoteData(this.SunType_path)
      .pipe(map((data: CommRootObject) => data.data));
  }

  onValueChanges = () => {
    this.form5.valueChanges.subscribe((val) => {
      // console.log(val);
      this.getModal.emit({ 'val': val, 'count': 5 });
    });
  }

  saveForm = (data) => {
    this.sendForm.emit();
  }

  reset = (formdata: FormGroup) => {
    if (this.modify) {
      this.form5.patchValue(this.modify);
    } else {
      formdata.reset();
    }

  }

}
