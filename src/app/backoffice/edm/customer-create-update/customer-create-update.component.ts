import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators, FormGroupDirective } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GiftStock } from '../gift-stock/gift-stock.module';

@Component({
  selector: 'vr-customer-create-update',
  templateUrl: './customer-create-update.component.html',
  styleUrls: ['./customer-create-update.component.scss']
})
export class CustomerCreateUpdateComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  selectedIndex = 0;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<CustomerCreateUpdateComponent>,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as GiftStock;
    }
console.info('mode=',this.mode);
console.info('defaults=',this.defaults);
    this.form = this.fb.group({
      grno: [this.defaults.grno || '', ],
      name: [this.defaults.name || '', Validators.compose(
        [
          Validators.required,
          Validators.minLength(100)
        ]
      )],
      giftType: [this.defaults.name || '', Validators.required],
      msgYn: [this.defaults.msgYn||'', Validators.required],
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {
    const customer = this.form.value;
    this.dialogRef.close(customer);
  }

  updateCustomer() {
    const customer = this.form.value;
    customer.storeId = this.defaults.storeId;

    this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
