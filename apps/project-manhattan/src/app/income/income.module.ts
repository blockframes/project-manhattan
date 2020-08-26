import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { CreateComponent } from './create/create.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';

const routes: Route[] = [{
  path: '',
  redirectTo: 'create',
  pathMatch: 'full'
}, {
  path: 'create',
  component: CreateComponent
}];


@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    TranslocoLocaleModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatTableModule,
    RouterModule.forChild(routes)
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'income' }],
})
export class IncomeModule { }
