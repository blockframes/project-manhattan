import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';
import { GetMoviePipe } from './pipes';

// Libs
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { GridModule } from '../utils/grid';
import { ListLayoutModule } from '../utils/list-layout';

// Material
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';

const routes: Route[] = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full'
},{
  path: 'list',
  component: ListComponent,
  data: { animation: 'list' }
},{
  path: 'create',
  component: CreateComponent,
  data: { animation: 'view' }
}, {
  path: ':movieId',
  component: ViewComponent,
  data: { animation: 'view' },
  children: [{
    path: '',
    redirectTo: 'waterfall',
    pathMatch: 'full'
  },{
    path: 'income',
    data: { animation: 0 },
    loadChildren: () => import('../income/income.module').then(m => m.IncomeModule)
  }, {
    path: 'right',
    data: { animation: 1 },
    loadChildren: () => import('../right/right.module').then(m => m.RightModule)
  }, {
    path: 'waterfall',
    loadChildren: () => import('../waterfall/waterfall.module').then(m => m.WaterfallModule)
  }]
}];

@NgModule({
  declarations: [ListComponent, CreateComponent, ViewComponent, GetMoviePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    FlexLayoutModule,
    ListLayoutModule,
    GridModule,
    MatCardModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatRippleModule,
    RouterModule.forChild(routes)
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'movie' }],
})
export class MovieModule { }
