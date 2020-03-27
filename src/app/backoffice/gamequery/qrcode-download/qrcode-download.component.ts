import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppStoreList, AppCodeList } from '../../../api-result/api-result.interface';

@Component({
  selector: 'fury-qrcode-download',
  templateUrl: './qrcode-download.component.html',
  styleUrls: ['./qrcode-download.component.scss']
})
export class QrcodeDownloadComponent implements OnInit {
  @Output() doConfirm = new EventEmitter<any>();
  showList: AppStoreList[] = [];
  storeId = null;
  fileChoose = 'all';
  constructor(private dialogRef: MatDialogRef<QrcodeDownloadComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    console.info('data', this.data);
    if (data) {
      if (data.channelId === 'HOLA') {
        this.showList = data.hola;
      } else if (data.channelId === 'TLW') {
        this.showList = data.tlw;
      }
      this.storeId = this.showList[0].storeId;
    }
  }

  ngOnInit() {
  }

  confirm() {
    const allStore = [];

    if (this.fileChoose === 'single') {
      allStore.push(this.storeId);
      this.dialogRef.close(allStore);
    } else {
      for (let i = 0; i < this.showList.length; i++) {
        allStore.push(this.showList[i].storeId);
      }
      this.dialogRef.close(allStore);
    }

    this.doConfirm.emit();
  }

}
