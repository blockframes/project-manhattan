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

// Material
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  data: { animation: 'view' }
}];

@NgModule({
  declarations: [ListComponent, CreateComponent, ViewComponent, GetMoviePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    FlexLayoutModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    RouterModule.forChild(routes)
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'movie' }],
})
export class MovieModule { }
