import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { ApiUrl } from 'environments/api-url';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommRootObject } from 'app/api-result/api-result.interface';

@Component({
  selector: 'bath',
  templateUrl: './bath.component.html',
  styleUrls: ['./bath.component.scss']
})
export class BathComponent implements OnInit {

  @Input() modify;
  @Output()
  getModal = new EventEmitter();
  @Output()
  sendForm = new EventEmitter();
  form6: FormGroup;
  getbath_type$: Observable<any[]>;
  gettoilet_washlet$: Observable<any[]>;
  getwashlet$: Observable<any[]>;
  getbath_wall$: Observable<any[]>;
  gettoilet_pipe$: Observable<any[]>;
  gettoilet_s$: Observable<any[]>;
  getkitchen$: Observable<any[]>;

  getbath_brand$: Observable<any[]>;
  getsink_in$: Observable<any[]>;
  getsink_out$: Observable<any[]>;
  getbalcony$: Observable<any[]>;
  getbalcony_w$: Observable<any[]>;
  gethanger$: Observable<any[]>;
  private bath_type_path = ApiUrl.fs_comm_bath_type_path;
  private toilet_plug_path = ApiUrl.fs_comm_toilet_plug_path;
  private washlet_path = ApiUrl.fs_comm_washlet_path;
  private bath_wall_path = ApiUrl.fs_comm_bath_wall_path;
  private toilet_pipe_path = ApiUrl.fs_comm_toilet_p_path;
  private toilet_s_path = ApiUrl.fs_comm_toilet_s_path;
  private kitchen_path = ApiUrl.fs_comm_kitchen_path;

  private bath_brand_path = ApiUrl.fs_comm_bath_brand_path;
  private sink_in_path = ApiUrl.fs_comm_sink_in_path;
  private sink_out_path = ApiUrl.fs_comm_sink_out_path;
  private balcony_path = ApiUrl.fs_comm_balcony_path;
  private balcony_w_path = ApiUrl.fs_comm_balcony_w_path;
  private hanger_path = ApiUrl.fs_comm_hanger_path;
  constructor(private httpService: HttpServiceService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form6 = this.fb.group({
      bathType: [['']],
      bathWall: [''],
      toiletPipe: [''],
      bathBrand: [''],
      sinkIn: [''],
      sinkOut: [''],
      balcony: [''],
      hanger: [''],
      balconyW: [''],
      kitchen: [''],
      toiletShape: [''],
      washlet: [['']],
      plug: [['']],
    });

    this.onValueChanges();
    this.getInitType();

    if (this.modify) {
      this.form6.patchValue(this.modify);
    }
  }

  getInitType = () => {
    this.getbath_type$ = this.httpService.getRemoteData(this.bath_type_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.gettoilet_washlet$ = this.httpService.getRemoteData(this.toilet_plug_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.getwashlet$ = this.httpService.getRemoteData(this.washlet_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.getbath_wall$ = this.httpService.getRemoteData(this.bath_wall_path)
    .pipe(map((data: CommRootObject) => data.data));

    this. gettoilet_pipe$ = this.httpService.getRemoteData(this.toilet_pipe_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.gettoilet_s$ = this.httpService.getRemoteData(this.toilet_s_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.getkitchen$ = this.httpService.getRemoteData(this.kitchen_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.getbath_brand$ = this.httpService.getRemoteData(this.bath_brand_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.getsink_in$ = this.httpService.getRemoteData(this.sink_in_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.getsink_out$ = this.httpService.getRemoteData(this.sink_out_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.getbalcony$ = this.httpService.getRemoteData(this.balcony_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.getbalcony_w$ = this.httpService.getRemoteData(this.balcony_w_path)
    .pipe(map((data: CommRootObject) => data.data));

    this.gethanger$ = this.httpService.getRemoteData(this.hanger_path)
    .pipe(map((data: CommRootObject) => data.data));

  }

  onValueChanges = () => {
    this.form6.valueChanges.subscribe((val) => {
      console.log(val);
      this.getModal.emit({'val': val, 'count': 6});
    });

  }
  saveForm = (data) => {
    this.sendForm.emit();
  }

  reset = (formdata: FormGroup) => {
    if (this.modify) {
      this.form6.patchValue(this.modify);
    } else {
      formdata.reset();
    }
  }

}
