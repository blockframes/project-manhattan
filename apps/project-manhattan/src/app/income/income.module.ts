import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';

import { CreateComponent } from './create/create.component';

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
    RouterModule.forChild(routes)
  ]
})
export class IncomeModule { }
