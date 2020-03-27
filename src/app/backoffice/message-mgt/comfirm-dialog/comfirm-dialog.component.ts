import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'fury-comfirm-dialog',
  templateUrl: './comfirm-dialog.component.html',
  styleUrls: ['./comfirm-dialog.component.scss']
})
export class ComfirmDialogComponent implements OnInit {
  @Output() doConfirm = new EventEmitter<any>();
  get message() {
    return this.data.message;
  }
  get type() {
    return this.data.type;
  }
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any, private snackBar: MatSnackBar) { }

  ngOnInit() { }
  confirm() {
    this.doConfirm.emit();
    console.info('confirm');
    this.dialog.closeAll();
  }

  openAnotherDialogConfirm() {
    this.doConfirm.emit();
    console.log('openAnotherDialogConfirm');
  }


}
