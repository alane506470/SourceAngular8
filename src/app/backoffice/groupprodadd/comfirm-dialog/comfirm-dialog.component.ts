import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
@Component({
  selector: 'fury-comfirm-dialog',
  templateUrl: './comfirm-dialog.component.html',
  styleUrls: ['./comfirm-dialog.component.scss']
})
export class ComfirmDialogComponent implements OnInit {
  @Output() doConfirm = new EventEmitter<any>();
  @Output() doConfirm2 = new EventEmitter<any>();
  @Output() doConfirm3 = new EventEmitter<any>();
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

  confirm2() {
    this.doConfirm2.emit();
    console.info('confirm2');
    this.dialog.closeAll();
  }
  confirm3() {
    this.doConfirm3.emit();
    console.info('confirm3');
  }
}
