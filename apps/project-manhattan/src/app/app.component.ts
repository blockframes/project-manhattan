import { Component, ChangeDetectionStrategy, HostBinding, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimation } from './animations';

@Component({
  selector: 'app-root',
  template: `
  <ng-container *transloco="let t">
    <mat-toolbar fxLayoutAlign="space-between center">
      <a class="img-link" routerLink="movie/list">
        <img src="assets/img/upload.svg" />
      </a>
      <a mat-stroked-button routerLink="movie/create">
        <mat-icon>add</mat-icon>
        <span>{{ t('create') | titlecase }}</span>
      </a>
    </mat-toolbar>
    
    <main [@routeAnimation]="animation(outlet)">
      <router-outlet #outlet="outlet"></router-outlet>
    </main>
  </ng-container>`,
  styles: [
    ':host { display: block; height: 100%; }',
    '.img-link { height: 80%; }',
    'img { height: 100%; }',
    'main { height: calc(100% - 64px) }'
  ],
  animations: [routeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  animation(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }
}
