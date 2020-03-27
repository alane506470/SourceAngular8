import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


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
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() { }
  confirm() {
    this.doConfirm.emit();
    this.dialog.closeAll();
  }

  confirm2() {
    this.doConfirm2.emit();
    this.dialog.closeAll();
  }
  confirm3() {
    this.doConfirm3.emit();
  }
}
