import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'fury-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  imagePath = 'assets/img/phone.png';

  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
  }

  get img() {
    return this.data.img;
  }

  get allImg() {
    return this.data.allImg.slice(0, 6);
  }

  get type() {
    return this.data.type;
  }

  getPic(data): any {
    return `pic${data}`;
  }

  confirm() {
    this.dialog.closeAll();
  }
}
