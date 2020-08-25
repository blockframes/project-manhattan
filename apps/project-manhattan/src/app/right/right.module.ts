import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';

import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';

import { ListComponent } from './list/list.component';
import { QueryRightPipe } from './pipes';


const routes: Route[] = [{
  path: '',
  component: ListComponent
}];

@NgModule({
  declarations: [ListComponent, QueryRightPipe],
  imports: [
    CommonModule,
    TranslocoModule,
    TranslocoLocaleModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatRippleModule,
    RouterModule.forChild(routes)
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'right' }],
})
export class RightModule { }
