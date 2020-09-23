import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ListLayoutModule } from '../utils/list-layout';
import { ExpansionModule } from '../utils/expansion';

import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { CreateComponent } from './create/create.component';
import { pipes } from './pipe';
import { WaterfallGuard } from './guard';
import { BeneficeDirective } from './directive';

import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { GraphComponent } from './graph/graph.component';
import { G6GraphModule } from 'ng-antv-g6';

const routes: Route[] = [{
  path: '',
  component: ListComponent,
  canActivate: [WaterfallGuard],
  children: [{
    path: 'create',
    component: CreateComponent,
    data: { animation: 2 }
  }, {
    path: ':waterfallId',
    component: ViewComponent,
    data: { animation: 1 }
  }]
}]

@NgModule({
  declarations: [ListComponent, ViewComponent, CreateComponent, GraphComponent, BeneficeDirective, ...pipes],
  imports: [
    CommonModule,
    ExpansionModule,
    ReactiveFormsModule,
    ListLayoutModule,
    FlexLayoutModule,
    TranslocoModule,
    TranslocoLocaleModule,
    NgApexchartsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatDividerModule,
    G6GraphModule,
    RouterModule.forChild(routes)
  ],
  providers: [{provide: TRANSLOCO_SCOPE, useValue: 'waterfall'}]
})
export class WaterfallModule { }
