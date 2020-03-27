import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'fury-preview-pic',
  templateUrl: './preview-pic.component.html',
  styleUrls: ['./preview-pic.component.scss']
})
export class PreviewPicComponent implements OnInit, AfterViewInit {

  slider;
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.slider = new Swiper('.swiper-container', {
      autoplay: {
        delay: 1000,
        disableOnInteraction: false
      },
      speed: 1000,
      direction: 'horizontal',
      loop: true,
      // 分頁器
      pagination: {
        el: '.swiper-pagination'
      },
      // 下一頁上一頁
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  get allImg() {
    return this.hack(this.data.allImg);
  }

  hack(val) {
    return Array.from(val);
  }

}
