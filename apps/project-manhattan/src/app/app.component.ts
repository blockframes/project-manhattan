import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'project-manhattan-root',
  template: '<router-outlet></router-outlet>',
  styles: [':host { display: block; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
