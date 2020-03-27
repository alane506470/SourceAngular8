import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';

import * as moment from 'moment';
import { ApiUrl } from 'environments/api-url';

import { HttpServiceService } from 'app/http-service/http-service.service';
import { CommRootObject } from 'app/api-result/api-result.interface';

@Component({
  selector: 'fury-repairadd',
  templateUrl: './repairadd.component.html',
  styleUrls: ['./repairadd.component.scss']
})
export class RepairaddComponent implements OnInit {

  changeStatusList = [
    {ticketStatus: 'W', ticketStatusName: '待處理'},
    {ticketStatus: 'F', ticketStatusName: '已結束'},
  ];

  form1: FormGroup;
  isLoading: boolean;
  private put_post_path = ApiUrl.appRepairUpdate_path;

  constructor(
    private dialogRef: MatDialogRef<RepairaddComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
     private httpService: HttpServiceService) { }

  ngOnInit() {
    console.log(this.defaults);
   this.createForm();
  }

  createForm() {
    // console.log(this.defaults);
    this.form1 = new FormGroup({
        commName: new FormControl(this.defaults.stock.commName || ''),
        ticketId: new FormControl(this.defaults.stock.ticketId || ''),
        ticketContent: new FormControl(this.defaults.stock.ticketContent || ''),
        ticketStatus: new FormControl(this.defaults.stock.ticketStatus || '', [
          Validators.required
        ]),
        applyName:  new FormControl(this.defaults.stock.applyName || ''),
        applyMobile:  new FormControl(this.defaults.stock.applyMobile || ''),
        applyAddress:  new FormControl(this.defaults.stock.applyAddress || ''),
        createDate:  new FormControl(moment(new Date(this.defaults.stock.createDate)).format('YYYY-MM-DD') || ''),
    }
    );
  }

  onSubmit() {
    this.isLoading = true;
    const temp: CommAdd = {
      commId : this.defaults.stock.commId,
      ticketId: this.form1.get('ticketId').value,
      ticketStatus: this.form1.get('ticketStatus').value
    };
    // console.info(temp);

    this.httpService.postData(this.put_post_path, temp)
       .subscribe((result: CommRootObject) => {
         if (result.status !== 'ERROR' && result.data !== null) {
           if (result.status === 'SUCCESS') {
            console.log(result);
            this.snackbar.open('修改完成', null, {
              duration: 5000
            });
              this.dialogRef.close();
              this.isLoading = false;
          }
       } else {
        this.snackbar.open(result.message, null, {
          duration: 5000
        });
         this.isLoading = false;
       }
      },
       error => {
         console.error(error);
         this.isLoading = false;
       });
      }

}

interface CommAdd {
  commId: any;
  ticketId?: any;
  ticketStatus?: any;
}
