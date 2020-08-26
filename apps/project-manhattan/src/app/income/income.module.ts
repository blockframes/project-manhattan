import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { NgApexchartsModule } from "ng-apexcharts";

import { SimulatorComponent } from './simulator/simulator.component';
import { OrgDataSourcePipe, OrgLabelPipe, OrgSeriesPipe, TableColumnPipe } from './pipes';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormComponent } from './form/form.component';


const routes: Route[] = [{
  path: '',
  component: SimulatorComponent
}];


@NgModule({
  declarations: [
    SimulatorComponent,
    OrgDataSourcePipe,
    OrgLabelPipe,
    OrgSeriesPipe,
    TableColumnPipe,
    FormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    TranslocoLocaleModule,
    NgApexchartsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes)
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'income' }],
})
export class IncomeModule { }
