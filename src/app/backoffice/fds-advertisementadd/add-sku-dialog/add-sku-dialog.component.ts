import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ComfirmDialogComponent } from 'app/backoffice/comfirm-dialog/comfirm-dialog.component';


@Component({
  selector: 'fury-add-sku-dialog',
  templateUrl: './add-sku-dialog.component.html',
  styleUrls: ['./add-sku-dialog.component.scss']
})
export class AddSkuDialogComponent implements OnInit {
  file: any;
  @Output() doConfirm = new EventEmitter<any>();

  get type() {
    return this.data.type;
  }

  constructor(private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddSkuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
  }

  confirm() {
    const sku = (<HTMLInputElement>document.getElementById('skuid')).value;
    this.dialogRef.close(sku.trim());
    this.doConfirm.emit();
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  uploadDocument() {
    const fileReader = new FileReader();
    const skuList = [];
    fileReader.onload = (e) => {
      // By lines
      const a = <string>fileReader.result;
      const lines = a.split('\n');
      if (lines.length > 50) {
        const confirmDialogRef3 = this.dialog.open(ComfirmDialogComponent, {
          data: {
            message: '商品數超過50筆，請分批上傳',
            type: '3'
          }
        });
        confirmDialogRef3.componentInstance.dodelayCloseConfirm.subscribe(() => {
          confirmDialogRef3.close();
        });
      } else {
        for (let line = 0; line < lines.length; line++) {
          skuList.push(lines[line].trim());
        }
        this.dialogRef.close(skuList);
        this.doConfirm.emit();
      }
    };
    fileReader.readAsText(this.file);
  }


}
