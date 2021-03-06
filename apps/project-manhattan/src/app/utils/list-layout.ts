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

// SLIDE IN
export const slideInEnter = 
  animate(`0.2s ${Easing.easeOutcubic}`, style({opacity: '1', transform: 'translateY(0)'}));
export const slideInLeave = 
  animate(`0.2s ${Easing.easeIncubic}`, style({opacity: '0', transform: 'translateY(-20px)'}));

// SCALE IN
export const scaleInEnter = 
  animate(`0.2s ${Easing.easeOutcubic}`, style({opacity: '1', transform: 'scale(1)'}));

export const animation = trigger('animation', [
  transition('void => loading', [
    query(':enter', [
      style({ opacity: '0' }),
      animate(`0.2s ${Easing.easeIncubic}`, style({ opacity: '1' })),
      animateChild()
    ], { optional: true })
  ]),
  transition('void => empty', [
    query(':enter', [
      style({ opacity: '0', transform: 'scale(0.95)' }),
      scaleInEnter,
      animateChild()
    ], { optional: true })
  ]),
  transition('loading => list', [
    ...prepare,
    query(':enter', [style({ opacity: '0', transform: `translateY(20px)` })], { optional: true }),
    sequence([
      query(':leave', [slideInLeave], { optional: true }),
      query(':enter', [slideInEnter, animateChild()], { optional: true }),
    ])
  ]),
  transition('loading => empty', []),
  transition('empty => list', []),
  transition('list => empty', []),
]);

@Directive({ selector: '[listView]' })
export class ListView {}
@Directive({ selector: '[emptyView]' })
export class EmptyView {}
@Directive({ selector: '[loadingView]' })
export class LoadingView {}

@Component({
  selector: 'list-layout',
  animations: [animation],
  template: `
    <ng-container [ngSwitch]="state">
      <ng-container *ngSwitchCase="'list'">
        <ng-content select=".list, [listView]"></ng-content>
      </ng-container>
      <ng-container *ngSwitchCase="'empty'">
        <ng-content select=".empty, [emptyView]"></ng-content>
      </ng-container>
      <ng-container *ngSwitchCase="'loading'">
        <ng-content select=".loading, [loadingView]"></ng-content>
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
export class NgAsync<T = unknown> {
  ref: EmbeddedViewRef<ListContext<T>>|null = null;
  @Input()
  set ngAsync(ngAsync: T) {
    if (this.ref) {
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
  declarations: [ListLayoutComponent, NgAsync, ListView, EmptyView, LoadingView],
  exports: [ListLayoutComponent, NgAsync, ListView, EmptyView, LoadingView],
  imports: [CommonModule]
})
export class ListLayoutModule {}
