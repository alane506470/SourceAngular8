import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiUrl } from 'environments/api-url';
import { HttpServiceService } from 'app/http-service/http-service.service';
import { map } from 'rxjs/operators';
import { CommRootObject } from 'app/api-result/api-result.interface';

@Component({
  selector: 'other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

  @Input() modify;
  @Output() getModal = new EventEmitter();
  @Output()
  sendForm = new EventEmitter();
  form8: FormGroup;
  getTrash_type$: Observable<any[]>;
  private trash_type_path = ApiUrl.fs_comm_trash_type;
  constructor(private httpService: HttpServiceService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form8 = this.fb.group({
      trash: [''],
      trashTime: []
    });

    this.onValueChanges();
    this.getInitType();

    if (this.modify) {
      this.form8.patchValue(this.modify);
    }
  }

  getInitType = () => {
    this.getTrash_type$ = this.httpService.getRemoteData(this.trash_type_path)
      .pipe(map((data: CommRootObject) => data.data));

  }

  onValueChanges = () => {
    this.form8.valueChanges.subscribe((val) => {
      console.log(val);
      this.getModal.emit({'val': val, 'count': 8});
    });

  }

  saveForm = (data) => {
    this.sendForm.emit();
  }

  reset = (formdata: FormGroup) => {
    if (this.modify) {
      this.form8.patchValue(this.modify);
    } else {
      formdata.reset();
    }
  }

}
