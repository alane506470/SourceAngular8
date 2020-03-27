import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiUrl } from 'environments/api-url';
import { HttpServiceService } from 'app/http-service/http-service.service';

@Component({
  selector: 'fds-comm-address-add',
  templateUrl: './fds-comm-address-add.component.html',
  styleUrls: ['./fds-comm-address-add.component.scss']
})
export class FdsCommAddressAddComponent implements OnInit {

  selectedIndex = 0;
  form1: FormGroup;
  getCountyId: any[] = [];
  getTownshipId: any[] = [];
  private County_path = ApiUrl.appCounty_path;
  constructor(private httpService: HttpServiceService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form1 = this.fb.group({
      comm_id: [''],
      comm_name: ['', [Validators.maxLength(40)]],
      comm_add1: [''],
      comm_add2: [''],
      comm_add3: ['', [Validators.maxLength(200)]],
    });
    this.getInitCommunityValue();
  }

  // 獲取縣市鄉鎮
  getInitCommunityValue() {
    this.httpService.getRemoteData(this.County_path)
      .subscribe((data: FsAddress) => {
        console.log('data subscribe', data);
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
    formdata.reset();
  }

  saveForm = () => {

  }
}
interface FsAddress {
  status: string;
  errorCode: string;
  message: string;
  data: Array<any>;
}

