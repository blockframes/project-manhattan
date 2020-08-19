import { Component, ChangeDetectionStrategy, HostBinding, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimation } from './animations';

@Component({
  selector: 'app-root',
  template: `<router-outlet #outlet="outlet"></router-outlet>`,
  styles: [':host { display: block; height: 100%; }'],
  animations: [routeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild('outlet') outlet: RouterOutlet;
  
  @HostBinding('@routeAnimation')
  get animation() {
    return this.outlet?.activatedRouteData?.animation;
  }
}
