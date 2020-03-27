import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { Observable } from 'rxjs';
import { ApiUrl } from 'environments/api-url';
import { CommRootObject } from 'app/api-result/api-result.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'hydropower',
  templateUrl: './hydropower.component.html',
  styleUrls: ['./hydropower.component.scss']
})
export class HydropowerComponent implements OnInit {

  @Input() modify;
  @Output()
  getModal = new EventEmitter();
  @Output()
  sendForm = new EventEmitter();
  form4: FormGroup;
  getGasType$: Observable<any>;
  getVoltage$: Observable<any>;
  getCpipeType$: Observable<any>;
  getHpipeType$: Observable<any>;
  private gas_type_path = ApiUrl.fs_gas_type_path;
  private voltage_path = ApiUrl.fs_voltage_path;
  private cpipe_type_path = ApiUrl.fs_cpip_path;
  private hpipe_type_path = ApiUrl.fs_hpip_path;
  constructor(private httpService: HttpServiceService, private fb: FormBuilder) {

   }

  ngOnInit() {
    this.form4 = this.fb.group({
      gasType: [''],
      voltage: [''],
      cpipeType: [''],
      hpipeType: [''],
    });
    this.onValueChanges();
    this.getInitType();

    if (this.modify) {
      this.form4.patchValue(this.modify);
    }
  }

  getInitType = () => {
    this.getGasType$ = this.httpService.getRemoteData(this.gas_type_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getVoltage$ = this.httpService.getRemoteData(this.voltage_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.getCpipeType$ = this.httpService.getRemoteData(this.cpipe_type_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.getHpipeType$ = this.httpService.getRemoteData(this.hpipe_type_path)
    .pipe(map((data: CommRootObject) => data.data));
  }

  onValueChanges = () => {
    this.form4.valueChanges.subscribe((val) => {
      console.log(val);
      this.getModal.emit({'val': val, 'count': 4});
    });

  }

  saveForm = (data) => {
    this.sendForm.emit();
  }

  reset = (formdata: FormGroup) => {
    if (this.modify) {
      this.form4.patchValue(this.modify);
    } else {
      formdata.reset();
    }
  }

}
