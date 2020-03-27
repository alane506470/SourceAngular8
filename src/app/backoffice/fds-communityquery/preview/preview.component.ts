import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatTableDataSource,MatSnackBar, MatPaginator, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpServiceService } from '../../../../app/http-service/http-service.service';
import { ApiUrl } from '../../../../environments/api-url';
import { Community } from '../fds-communityquery.component';
import { CommRootObject } from '../../../../app/api-result/api-result.interface';
import { ListColumn } from '../../../../@fury/shared/list/list-column.model';


@Component({
  selector: 'fury-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  @Input()
  columns: ListColumn[] = [
    { name: '社區名稱', property: 'commName', visible: true, isModelProperty: true },
    { name: '社區縣市', property: 'commAdd1', visible: true, isModelProperty: true },
    { name: '社區鄉鎮市', property: 'commAdd2', visible: true, isModelProperty: true },
    { name: '地址', property: 'commAdd3', visible: true, isModelProperty: true}
  ] as ListColumn[];

  isLoading: boolean;
  form1: FormGroup;
  getCountyId: any[] = [];
  getTownshipId: any[] = [];
  commAdd1: any;
  commAdd2: any;

  private put_post_path = ApiUrl.appCommunityUpdate_path;

  constructor(private snackbar: MatSnackBar,
    private httpService: HttpServiceService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<PreviewComponent>) { }

  ngOnInit() {
     console.info(this.data);
    this.getCountyId = this.data.getCountyId;
    this.getTownshipId = this.data.getTownshipId;
    this.createForm();
  }

  createForm() {
    this.form1 = new FormGroup({
      commId: new FormControl(this.data.data.commId || ''),
      commName: new FormControl(this.data.data.commName || ''),
      commAdd1: new FormControl(this.data.data.commAdd1 || ''),
      commAdd2: new FormControl(this.data.data.commAdd2 || ''),
      commAdd3: new FormControl(this.data.data.commAdd3 || '')
    });
  }

  changeTownshipId($eventValue: string) {
    // tslint:disable-next-line: radix
    const county = parseInt($eventValue) - 1;
    console.log(county);
    this.getTownshipId = this.getCountyId[county].areaList;
  }

  onSubmit() {
    this.isLoading = true;
    if (!this.form1.get('commName').valid || !this.form1.get('commAdd1').valid || !this.form1.get('commAdd2').valid
    || !this.form1.get('commAdd3').valid) {
      this.snackbar.open('請輸入查詢條件' , '我知道了');
      this.isLoading = false;
    } else {
      const temp: Community = this.form1.value;
      this.isLoading = false;
      console.info(temp);
       this.httpService.putData(this.put_post_path, temp)
        .subscribe((result: CommRootObject) => {
          console.log('result-data:' + result.data);
            this.snackbar.open(result.message, null, {
              duration: 5000
            });
            this.dialogRef.close();
          this.isLoading = false;
        },
        error => {
          console.error(error);
          this.isLoading = false;
        });
    }
  }
  }

interface Commdetail {
  commName: any;
  commAdd1: any;
  commAdd2: any;
  commAdd3: any;
}
