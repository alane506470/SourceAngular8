import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewPicComponent } from './preview-pic.component';
import { MaterialModule } from '../../../@fury/shared/material-components.module';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [PreviewPicComponent],
  declarations: [PreviewPicComponent]
})
export class PreviewPicModule { }
