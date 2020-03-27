import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export class GiftStock {
  channelId: string;
  createDate: Date;
  giftId: string;
  giftStock: number;
  giftTotal: number;
  grno: string;
  recStock: number;
  storeId: string;

  constructor(giftStock) {
    this.channelId = giftStock.channelId;
    this.createDate = giftStock.createDate;
    this.giftId = giftStock.giftId;
    this.giftStock = giftStock.giftStock;
    this.giftTotal = giftStock.giftTotal;
    this.grno = giftStock.grno;
    this.recStock = giftStock.recStock;
    this.storeId = giftStock.storeId;
  }

  get name() {
    const name = '';



    return name;
  }

  set name(value) {
  }

  get address() {
    return '';
  }

  set address(value) {
  }
}
