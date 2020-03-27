import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';

import { HttpServiceService } from '../../../app/http-service/http-service.service';
import { ApiUrl } from '../../../environments/api-url';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CommRootObject } from '../../../app/api-result/api-result.interface';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { zip  } from 'rxjs';
@Component({
  selector: 'fury-fds-communityadminadd',
  templateUrl: './fds-communityadminadd.component.html',
  styleUrls: ['./fds-communityadminadd.component.scss']
})
export class FdsCommunityadminaddComponent implements OnInit {

  isLoading: boolean;
  form1: FormGroup;
  communityList: any[] = [];

  private getComm$: Observable<any>;
  private getComm_path = ApiUrl.appQueryAllComm_path;
  private addadmin_path = ApiUrl.appAddCommAdmin_path;
  constructor( private httpService: HttpServiceService,
     public dialog: MatDialog, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.createForm();
    this.getInitAllComm();
  }

  createForm(){
    this.form1 = new FormGroup({
      'commId': new FormControl(''),
      'admNum': new FormControl('')
    });
  }

  getInitAllComm() {
    this.isLoading = true;
    this.getComm$ = this.httpService.postData(this.getComm_path, '');


    zip(this.getComm$).subscribe((data) => {
      this.communityList = data[0].data;
      this.isLoading = false;
    },
    error => {
      console.info('fds-communityadminadd getInit error', error);
      this.isLoading = false;
    });
  }

  addadmin() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要儲存嗎？`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      // console.info(this.form1.value.admNum);
      const temp = {commId: this.form1.value.commId, adminNum: String(this.form1.get('admNum').value)};
      this.httpService.postData(this.addadmin_path, temp)
      .subscribe((result: CommRootObject) => {
        this.snackbar.open(result.message, null, {
         duration: 5000
       });
        console.log(result.message);
        this.isLoading = false;
       },
       error => {
         this.snackbar.open(error, null, {
           duration: 5000
         });
         console.error(error);
         this.isLoading = false;
       });
     });
   }


}
