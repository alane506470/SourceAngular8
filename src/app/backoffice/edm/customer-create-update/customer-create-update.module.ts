import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { CustomerCreateUpdateComponent } from './customer-create-update.component';
import { MaterialModule } from '../../../../@fury/shared/material-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MaterialModule
  ],
  declarations: [CustomerCreateUpdateComponent],
  entryComponents: [CustomerCreateUpdateComponent],
  exports: [CustomerCreateUpdateComponent]
})
export class CustomerCreateUpdateModule {
}
