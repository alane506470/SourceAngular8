import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FuryCardModule } from '../../../../../@fury/shared/card/card.module';
import { LoadingOverlayModule } from '../../../../../@fury/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from '../../../../../@fury/shared/material-components.module';
import { DonutChartWidgetComponent } from './donut-chart-widget.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,

    // Core
    FuryCardModule,
    LoadingOverlayModule,
  ],
  declarations: [DonutChartWidgetComponent],
  exports: [DonutChartWidgetComponent]
})
export class DonutChartWidgetModule {
}
