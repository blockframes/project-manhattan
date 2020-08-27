import { Component, Input, NgModule, Directive, ViewChild, HostBinding, TemplateRef, ContentChild, ViewContainerRef, EmbeddedViewRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { slideUp, Easing } from '../animations';
import { style, query, trigger, transition, group, sequence, animate, animateChild } from '@angular/animations';

/** Prepare page before leaving/entering (use absolute to get out of the page flow) */
const prepare = [
  style({ overflow: 'hidden' }),
  query(':enter, :leave', [
    style({ position: 'absolute', overflow: 'hidden' })
  ], { optional: true }),
];

export const slideInEnter = 
  animate(`0.2s ${Easing.easeOutcubic}`, style({opacity: '1', transform: 'translateY(0)'}));
export const slideInLeave = 
  animate(`0.2s ${Easing.easeIncubic}`, style({opacity: '0', transform: 'translateY(-20px)'}));

export const animation = trigger('animation', [
  transition('void => loading', [
    query(':enter', [
      style({ opacity: '0' }),
      animate(`0.2s ${Easing.easeIncubic}`, style({ opacity: '1' })),
      animateChild()
    ])
  ]),
  transition('loading => list', [
    ...prepare,
    query(':enter', [style({ opacity: '0', transform: `translateY(20px)` })]),
    sequence([
      query(':leave', [slideInLeave]),
      query(':enter', [slideInEnter, animateChild()]),
    ])
  ]),
  transition('loading => empty', []),
  transition('empty => list', []),
  transition('list => empty', []),
]);

@Directive({ selector: 'list-items' })
export class ListItem {}

@Component({
  selector: 'list-layout',
  animations: [animation],
  template: `
    <ng-container [ngSwitch]="state">
      <ng-container *ngSwitchCase="'list'">
        <ng-content select=".list"></ng-content>
      </ng-container>
      <ng-container *ngSwitchCase="'empty'">
        <ng-content select=".empty"></ng-content>
      </ng-container>
      <ng-container *ngSwitchCase="'loading'">
        <ng-content select=".loading"></ng-content>
      </ng-container>
    </ng-container>
  `,
  styles: [':host { display: block; }']
})
export class ListLayoutComponent<T> {
  @HostBinding('@animation') state: 'list' | 'empty' | 'loading';
  @Input()
  set list(list: T[]) {
    this.state = list ? (list.length ? 'list' : 'empty') : 'loading';
  }
}

export class ListContext<T = unknown> {
  public $implicit?: T = null!;
  public ngAsync: T = null!;
}

@Directive({ selector: '[ngAsync]' })
export class List<T = unknown> {
  ref: EmbeddedViewRef<ListContext<T>>|null = null;
  @Input()
  set ngAsync(ngAsync: T) {
    if (this.ref) {
      console.log(ngAsync);
      this.ref.context.$implicit = ngAsync;
      this.ref.context.ngAsync = ngAsync;
      this.ref.markForCheck();
    } else {
      this.ref = this.viewContaier.createEmbeddedView(this.templateRef, { $implicit: ngAsync, ngAsync });
    }
  }

  constructor(
    private viewContaier: ViewContainerRef,
    private templateRef: TemplateRef<ListContext<T>>,
  ) {}
}


@NgModule({
  declarations: [ListLayoutComponent, List],
  exports: [ListLayoutComponent, List],
  imports: [CommonModule]
})
export class ListLayoutModule {}


// @Directive({ selector: '[list]' })
// export class List<T = unknown> {
//   @ViewChild()
//   @Input()
//   set list(list: T[]) {
//     this._context.$implicit = this._context.ngIf = condition;
//     this._updateView();
//   }
//   @Input()
//   set listAs(list: T[]) {
//     this._context.$implicit = this._context.ngIf = condition;
//     this._updateView();
//   }
// }