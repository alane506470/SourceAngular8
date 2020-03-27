import { Component, OnInit, Inject,  Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'fury-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  imagePath = 'assets/img/phone.png';
  get img() {
    return this.data.img;
  }
  get allImg() {
    return this.data.allImg.slice(0, 6);
  }

  get type() {
    return this.data.type;
  }

  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
  }
  getPic(data): any {
    return `pic${data}`;
  }
  confirm() {
    this.dialog.closeAll();
  }
}
