import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { Gamedtl } from '../../../api-result/api-result.interface';
@Component({
  selector: 'fury-add-lev-goal-dialog',
  templateUrl: './add-lev-goal-dialog.component.html',
  styleUrls: ['./add-lev-goal-dialog.component.scss']
})
export class AddLevGoalDialogComponent implements OnInit {
  levName;
  sku;
  grno;
  marketId;
  rebate = '10';
  levListArray: Gamedtl[] = [];
  tempGoalLevId;
  @Output() doConfirm = new EventEmitter<any>();
  get type() {
    return this.data.type;
  }
  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<AddLevGoalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    console.info('data', this.data);
    if (this.data.type === 'modify') {
      this.levName = this.data.levlist.levName;
      this.sku = this.data.levlist.sku;
    } else if (this.data.type === 'addgoal') {
      this.levListArray = this.data.levList;
      this.tempGoalLevId = this.levListArray[0].levId;
    } else if (this.data.type === 'modifygoal') {
      this.levListArray = this.data.levList;
      this.tempGoalLevId = this.data.goallist.levId;
      this.grno = this.data.goallist.grno;
      this.marketId = this.data.goallist.marketId;
      this.rebate = this.data.goallist.rebateMethod;
    }
  }

  ngOnInit() {
  }
  confirm() {
    const sku = this.paddingLeft((<HTMLInputElement>document.getElementById('sku')).value.trim(), 18);
    const levName = (<HTMLInputElement>document.getElementById('levName')).value.trim();
    if (sku.length > 0 && levName.length > 0) {
      this.dialogRef.close([levName, sku]);
      this.doConfirm.emit();
    } else {
      const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: '請完整輸入關卡名稱&商品',
          type: '3'
        }
      });
      confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
        confirmDialogRef.close();
      });
    }

  }

  confirm2() {
    const mm = (<HTMLInputElement>document.getElementById('marketId')).value.trim();
    const gg = (<HTMLInputElement>document.getElementById('grno')).value.trim();
    if (mm.length > 0 || gg.length > 0) {
      this.dialogRef.close([this.tempGoalLevId, gg, mm, this.rebate]);
      this.doConfirm.emit();
    } else {
      const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: '請輸入[折價券代碼]或[紅利點數代碼]',
          type: '3'
        }
      });
      confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
        confirmDialogRef.close();
      });
    }

  }

  paddingLeft(str, length) {
    if(str.length >= length)
      return str;
    else
      return this.paddingLeft("0" + str, length);
  }
}
