import { Component, OnInit, Inject } from '@angular/core';
import { HttpServiceService } from '../../http-service/http-service.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ApiUrl } from '../../../environments/api-url';
import { RootObject, AppCodeList, AppGameMstList, Gamedtl, Gamegoal } from '../../api-result/api-result.interface';
import { SortablejsOptions } from 'angular-sortablejs';
import { AddLevGoalDialogComponent } from './add-lev-goal-dialog/add-lev-goal-dialog.component';
import { ComfirmDialogComponent } from './comfirm-dialog/comfirm-dialog.component';
import { zip  } from 'rxjs';
@Component({
  selector: 'fury-gameadd',
  templateUrl: './gameadd.component.html',
  styleUrls: ['./gameadd.component.scss']
})
export class GameaddComponent implements OnInit {
  isLoading: boolean;
  selectedIndex = 0;
  private getGameId$: Observable<any>;
  private getGameStatus$: Observable<any>;
  private getChannelId$: Observable<any>;
  private getGameFreq$: Observable<any>;
  private gameId;
  public gameStatusValue;
  statusList: AppCodeList[] = [];
  getChannelId: AppCodeList[] = [];
  actTypeList: AppCodeList[] = [];
  gameFreqList: AppCodeList[] = [];
  eventDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  datePickerMinDate = moment(new Date()).format('YYYY-MM-DD');
  datePickerMaxDate = moment(new Date()).add(180, 'days').format('YYYY-MM-DD');
  mode: 'create' | 'update' = 'create';
  form1: FormGroup;
  form2: FormGroup;
  levListArray: Gamedtl[] = [];
  goalListArray: Gamegoal[] = [];
  simpleOptions: SortablejsOptions = {
    animation: 300
  };
  constructor(private httpService: HttpServiceService,
    private dialogRef: MatDialogRef<GameaddComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialog: MatDialog,
    private router: Router) {
      this.isLoading = true;

    }
  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {};
    }
    console.info('this.mode=', this.mode);
    this.createForm();
    this.getInitGameValue();
  }

  createForm() {
    this.form1 = new FormGroup({
      'gameId': new FormControl(this.defaults.gameId || ''),
      'gameDesc': new FormControl(this.defaults.gameDesc || '', [
        Validators.required
      ]),
      'channelId': new FormControl(this.defaults.channelId || '', [Validators.required]),
      'startDate': new FormControl(moment(new Date(this.defaults.startDate)).format('YYYY-MM-DD') || '', [Validators.required]),
      'endDate': new FormControl(moment(new Date(this.defaults.endDate)).format('YYYY-MM-DD') || '', [Validators.required]),
      'gameStatus': new FormControl(this.defaults.gameStatus || 'N'),
      'frequency': new FormControl(this.defaults.frequency || '', [Validators.required])
    });
    if (this.mode === 'update') {
      for (const list of this.defaults.gamedtl) {
        this.levListArray.push(list);
      }
      for (const list of this.defaults.gamegoal) {
        this.goalListArray.push(list);
      }
    }

  }
  // 取得基本參數
  private getInitGameValue() {
    this.getGameStatus$ = this.httpService.getRemoteData(ApiUrl.appCodes_path.concat('?codeClass=game_sta'));
    this.getChannelId$ = this.httpService.getRemoteData(ApiUrl.appCodes_path.concat(`?codeClass=channel_id`));
    this.getGameFreq$ = this.httpService.getRemoteData(ApiUrl.appCodes_path.concat(`?codeClass=frequency`));

    if (this.mode === 'create') {
      this.getGameId$ = this.httpService.getRemoteData(ApiUrl.appGame_getNextGameId_path);

        zip(this.getGameStatus$, this.getChannelId$, this.getGameId$, this.getGameFreq$).subscribe((data) => {
          console.info('data subscribe:', data);
          const rootObject: RootObject[] = data;

          this.statusList = rootObject[0].data.list;
          this.getChannelId = rootObject[1].data.list;
          this.gameId = rootObject[2].data;
          this.gameFreqList = rootObject[3].data.list;

          this.form1.patchValue({ 'gameId': this.gameId });
          this.form1.patchValue({ 'frequency': this.gameFreqList[0].codeNo });
          for (const i in this.statusList) {
            if (this.form1.get('gameStatus').value === this.statusList[i].codeNo) {
              this.gameStatusValue = this.statusList[i].codeExplain;
            }
          }

          this.isLoading = false;
        },
          error => {
            console.info('gameadd getInitGameValue error', error);
            this.isLoading = false;
          });
    } else {

        zip(this.getGameStatus$, this.getChannelId$, this.getGameFreq$).subscribe((data) => {
          console.info('data subscribe:', data);
          const rootObject: RootObject[] = data;
          this.statusList = rootObject[0].data.list;
          this.getChannelId = rootObject[1].data.list;
          this.gameFreqList = rootObject[2].data.list;
          for (const i in this.statusList) {
            if (this.form1.get('gameStatus').value === this.statusList[i].codeNo) {
              this.gameStatusValue = this.statusList[i].codeExplain;
            }
          }

          this.isLoading = false;
        },
          error => {
            console.info('gameadd getInitGameValue error', error);
            this.isLoading = false;
          });
    }
  }
  // 新增關卡
  addLevList() {
    const confirmDialogRef = this.dialog.open(AddLevGoalDialogComponent, {
      data: {
        type: 'add'
      }
    });
    confirmDialogRef.afterClosed().subscribe((data) => {
      console.info('data', data);
      if (data) {
        if (this.levListArray.findIndex((existingCustomer) =>
          existingCustomer.sku === data[1]) === -1) {
          const arr = {
            'gameId': this.form1.get('gameId').value,
            'levId': this.levListArray.length + 1,
            'sku': data[1],
            'levName': data[0]
          };
          this.levListArray.push(arr);

        } else {
          this.dialog.open(ComfirmDialogComponent, {
            data: {
              message: `此商品代碼已存在，請重新輸入`,
              type: '1'
            }
          });

        }
      }
      console.info('this.levListArray', this.levListArray);
      confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
        confirmDialogRef.close();
      });
    });
  }
  // 刪除關卡
  deleteLevList(list) {
    if (this.goalListArray.length > 0) {
      if (this.goalListArray.findIndex((existingCustomer) =>
        existingCustomer.levId === list.levId) !== -1) {
        const confirmDialogRef1 = this.dialog.open(ComfirmDialogComponent, {
          data: {
            message: `第${list.levId}關卡尚有獎勵未刪除，請先刪除所有第${list.levId}關卡獎勵後，再刪除關卡`,
            type: '3'
          }
        });
        confirmDialogRef1.componentInstance.doConfirm3.subscribe(() => {
          confirmDialogRef1.close();
          return;
        });
        return;
      }
    }

    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要刪除第${list.levId}關卡嗎？`,
        type: '3'
      }
    });
    confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
      // 刪除關卡
      this.levListArray.splice(this.levListArray.findIndex((existingCustomer) =>
        existingCustomer.levId === list.levId), 1);
      // 重新排序levid
      this.levListArray.forEach(stock => {
        const temp = this.levListArray.findIndex((existingCustomer) =>
          existingCustomer.levId === stock.levId);
        stock.levId = temp + 1;
      });
      confirmDialogRef.close();

    });


    console.info('this.levListArray', this.levListArray);

  }
  // 修改關卡
  modifyLevList(list) {
    const confirmDialogRef = this.dialog.open(AddLevGoalDialogComponent, {
      data: {
        type: 'modify',
        levlist: list
      }
    });
    confirmDialogRef.afterClosed().subscribe((data) => {
      console.info('data', data);
      if (data) {

        const arr = {
          'gameId': this.form1.get('gameId').value,
          'levId': list.levId,
          'sku': data[1],
          'levName': data[0]
        };
        this.levListArray[this.levListArray.findIndex((existingCustomer) =>
          existingCustomer.levId === list.levId)] = arr;

      }
      console.info('this.levListArray', this.levListArray);
      confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
        confirmDialogRef.close();
      });
    });
  }
  // 新增獎勵
  addGoalList() {
    if (this.levListArray.length > 0) {
      const confirmDialogRef = this.dialog.open(AddLevGoalDialogComponent, {
        data: {
          type: 'addgoal',
          levList: this.levListArray
        }
      });
      confirmDialogRef.afterClosed().subscribe((data) => {
        console.info('data', data);
        if (data) {
          const arr = {
            'gameId': this.form1.get('gameId').value,
            'levId': data[0],
            'goalId': this.goalListArray.length + 1,
            'grno': data[1],
            'marketId': data[2],
            'rebateMethod': data[3]
          };
          this.goalListArray.push(arr);
        }
        console.info('this.goalListArray', this.goalListArray);
        confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
          confirmDialogRef.close();
        });
      });
    } else {
      this.dialog.open(ComfirmDialogComponent, {
        data: {
          message: `請至少建立一筆關卡，再新增獎勵`,
          type: '1'
        }
      });
    }
  }
  // 刪除獎勵

  deleteGoalList(list) {

    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要刪除此獎勵嗎？`,
        type: '3'
      }
    });
    confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
      // 刪除關卡
      this.goalListArray.splice(this.goalListArray.findIndex((existingCustomer) =>
        existingCustomer.levId === list.levId && existingCustomer.goalId === list.goalId), 1);
      confirmDialogRef.close();

    });


    console.info('this.goalListArray', this.goalListArray);
  }
  // 修改獎勵
  modifyGoalList(list) {
    const confirmDialogRef = this.dialog.open(AddLevGoalDialogComponent, {
      data: {
        type: 'modifygoal',
        goallist: list,
        levList: this.levListArray
      }
    });
    confirmDialogRef.afterClosed().subscribe((data) => {
      console.info('data', data);
      if (data) {
        const arr = {
          'gameId': this.form1.get('gameId').value,
          'levId': data[0],
          'goalId': this.goalListArray.length + 1,
          'grno': data[1],
          'marketId': data[2],
          'rebateMethod': data[3]
        };
        this.goalListArray[this.goalListArray.findIndex((existingCustomer) =>
          existingCustomer.levId === list.levId && existingCustomer.goalId === list.goalId)] = arr;
      }

      console.info('this.goalListArray', this.goalListArray);
      confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
        confirmDialogRef.close();
      });
    });
  }
  // 判斷是否為update mode
  isUpdateMode() {
    return this.mode === 'update';
  }
  // 回上一頁
  previousStep() {
    this.selectedIndex -= 1;
  }
  // 下一頁
  nextStep() {
    if (moment(this.form1.get('startDate').value).format(this.eventDateFormat) >
      moment(this.form1.get('endDate').value).format(this.eventDateFormat)) {
      this.snackbar.open('注意!「生效起日」比「生效迄日」大', null, {
        duration: 5000
      });
    } else {
      this.selectedIndex += 1;
    }
  }
  // 重設所有資料
  reset() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: '確定要重設頁面嗎？',
        type: '3'
      }
    });
    confirmDialogRef.componentInstance.doConfirm3.subscribe(() => {
      this.form1.reset();
      if (this.mode === 'create') {
        this.form1.patchValue({ 'gameId': this.gameId });
      } else {
        this.form1.patchValue({ 'gameId': this.defaults.gameId });
      }
      while (this.levListArray.length > 0) {
        this.levListArray.pop();
      }
      while (this.goalListArray.length > 0) {
        this.goalListArray.pop();
      }

      this.snackbar.open('已重設所有欄位', null, {
        duration: 5000
      });
      confirmDialogRef.close();
    });
  }
  // 儲存
  onSubmit() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要儲存嗎？(遊戲代碼${this.form1.get('gameId').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.isLoading = true;
      console.info('this.form1.value', this.form1.value);
      const temp: AppGameMstList = this.form1.value;
      temp.startDate = moment(new Date(temp.startDate)).format(this.eventDateFormat);
      temp.endDate = moment(new Date(temp.endDate)).format(this.eventDateFormat);
      if (!(temp.gameDesc === null)) {
        temp.gameDesc = temp.gameDesc.trim();
      }
      const tempGoalListArray: Gamegoal[] = [];

      for (let i = 0; i < this.levListArray.length; i++) {
        let num = 1;
        for (let j = 0; j < this.goalListArray.length; j++) {
          if (this.levListArray[i].levId === this.goalListArray[j].levId) {
            this.goalListArray[j].goalId = num;
            tempGoalListArray.push(this.goalListArray[j]);
            num++;
          }
        }
      }
      temp.gamedtl = this.levListArray;

      temp.gamegoal = tempGoalListArray;
      temp.level = this.levListArray.length;
      temp.goal = this.goalListArray.length;
      if (this.mode === 'create') {
        this.postData(temp);
      } else {
        this.putData(temp);

      }
      (<HTMLInputElement>document.getElementById('fiel1')).disabled = true;
    });
  }
  private putData(temp) {
    this.httpService.putData(ApiUrl.appGame_path, temp)
      .subscribe((result: RootObject) => {
        console.info('put result:', result);
        this.showSubmitResult(result.message, result.status, '儲存');
        this.isLoading = false;
      },
        error => {
          console.error(error);
          this.isLoading = false;
        });
  }
  private postData(temp) {
    this.httpService.postData(ApiUrl.appGame_path, temp)
      .subscribe((result: RootObject) => {
        console.info('post result:', result);

        this.showSubmitResult(result.message, result.status, '儲存');
        this.isLoading = false;
      },
        error => {
          console.error(error);
          this.isLoading = false;
        });
  }

  showSubmitResult(message: string, status: string, wording: string) {
    if (status === 'ERROR') {
      this.snackbar.open(`${wording}失敗，原因：${message}`, '我知道了');
    } else if (status === 'SUCCESS') {
      if (this.mode === 'update') {
        this.dialogRef.close('1');
      } else {
        this.router.navigateByUrl('');
      }
      this.snackbar.open(`${wording}成功`, null, {
        duration: 5000
      });
    } else {
      this.snackbar.open(`${wording}異常，請洽相關窗口`, '我知道了');
    }
  }

  deleteClick() {
    const confirmDialogRef = this.dialog.open(ComfirmDialogComponent, {
      data: {
        message: `確定要刪除嗎？(遊戲代碼${this.form1.get('gameId').value})`,
        type: '1'
      }
    });
    confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
      this.httpService.deleteData(`${ApiUrl.appGame_delete_path}${this.form1.get('gameId').value}`)
        .subscribe((result: RootObject) => {
          this.showSubmitResult(result.message, result.status, '刪除');
        },
          error => {
            console.error(error);
          });
    });
  }

}
