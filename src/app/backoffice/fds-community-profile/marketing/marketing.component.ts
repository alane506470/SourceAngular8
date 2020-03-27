import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiUrl } from 'environments/api-url';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommRootObject } from 'app/api-result/api-result.interface';


@Component({
  selector: 'marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss']
})
export class MarketingComponent implements OnInit {

  @Input() modify;
  @Output() getModal = new EventEmitter();
  @Output()
  sendForm = new EventEmitter();
  form7: FormGroup;
  getMarket_type$: Observable<any[]>;
  getDM_method$: Observable<any[]>;
  private Market_type_path = ApiUrl.fs_comm_marketing_path;
  private DM_method_path = ApiUrl.fs_comm_marketing_dm_path;
  constructor(private httpService: HttpServiceService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form7 = this.fb.group({
      marketType: [['']],
      dmMethod: [['']]
    });

    this.onValueChanges();
    this.getInitType();

    if (this.modify) {
      this.form7.patchValue(this.modify);
    }
  }

  getInitType = () => {
   this.getMarket_type$ = this.httpService.getRemoteData(this.Market_type_path)
      .pipe(map((data: CommRootObject) => data.data));

    this.getDM_method$ = this.httpService.getRemoteData(this.DM_method_path)
    .pipe(map((data: CommRootObject) => data.data));

  }

  onValueChanges = () => {
    this.form7.valueChanges.subscribe((val) => {
      console.log(val);
      this.getModal.emit({'val': val, 'count': 7});
    });

  }

  saveForm = (data) => {
    this.sendForm.emit();
  }

  reset = (formdata: FormGroup) => {
    if (this.modify) {
      this.form7.patchValue(this.modify);
    } else {
      formdata.reset();
    }
  }


}
