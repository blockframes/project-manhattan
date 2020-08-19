import {transition, trigger, style, animate, query, stagger, group, sequence } from '@angular/animations';
export const enum Easing {
  easeInSine = ' cubic-bezier(0.47, 0, 0.745, 0.715)',
  easeOutSine = ' cubic-bezier(0.39, 0.575, 0.565, 1)',
  easeInOutSine = ' cubic-bezier(0.445, 0.05, 0.55, 0.95)',

  easeIncubic = ' cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutcubic = ' cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutcubic = ' cubic-bezier(0.645, 0.045, 0.355, 1)',

  easeInQuint = ' cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  easeOutQuint = ' cubic-bezier(0.23, 1, 0.32, 1)',
  easeInOutQuint = ' cubic-bezier(0.86, 0, 0.07, 1)',

  easeInCirc = ' cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  easeOutCirc = ' cubic-bezier(0.075, 0.82, 0.165, 1)',
  easeInOutCirc = ' cubic-bezier(0.785, 0.135, 0.15, 0.86)',

  easeInQuad = ' cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad = ' cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad = ' cubic-bezier(0.455, 0.03, 0.515, 0.955)',

  easeInQuart = ' cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart = ' cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart = ' cubic-bezier(0.77, 0, 0.175, 1)',

  easeInExpo = ' cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  easeOutExpo = ' cubic-bezier(0.19, 1, 0.22, 1)',
  easeInOutExpo = ' cubic-bezier(1, 0, 0, 1)',

  easeInBack = ' cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  easeOutBack = ' cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutBack = ' cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}

///////////
// SLIDE //
///////////
const slide = (name: string, distance: string) => trigger(name, [
  transition(':enter', [
    style({ opacity: '0', transform: `translateY(${distance})` }),
    animate(`0.2s ${Easing.easeOutcubic}`, style({opacity: '1', transform: 'translateY(0)'})
 )]),
  transition(':leave', [
    style({opacity: '1', transform: 'translateY(0)'}),
    animate(`0.2s ${Easing.easeIncubic}`, style({opacity: '0', transform: `translateY(${distance})`})
 )])
]);
/** Animation used for view-like pages */
export const slideDown = slide('slideDown', '-20px');
/** Animation used for view-like pages */
export const slideUp = slide('slideUp', '20px');

const slideList = (name: string, distance: string) => (selector: string) => trigger(name, [
  transition(':enter', [
    query(selector, [
      style({  opacity: 0, transform: `translateY(${distance})` }),
      stagger(20, [animate(`0.3s ${Easing.easeOutcubic}`, style({opacity: 1, transform: 'translateY(0)'}))])
    ], { optional: true }),
  ]),
  transition(':leave', [
    query(selector, [
      style({ opacity: 1, transform: 'translateY(0)'}),
      stagger(-20, [animate(`0.3s ${Easing.easeIncubic}`, style({opacity: 1, transform: `translateY(${distance})`}))])
    ], { optional: true }),
  ])
]);

/** Animation used for view-like pages */
export const slideDownList = slideList('slideDownList', '-20px');
/** Animation used for view-like pages */
export const slideUpList = slideList('slideUpList', '20px');






//////////
// PAGE //
//////////
/** Prepare page before leaving/entering (use absolute to get out of the page flow) */
const prepare = [
  style({ position: 'relative', overflow: 'hidden' }),
  query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflow: 'hidden'
      })
  ], { optional: true }),
];

export const routeAnimation = trigger('routeAnimation', [
  transition('list => view', [
      ...prepare,
      query(':enter', [ style({ transform: 'translateY(100vh)', boxShadow: '0px -2px 16px 0px rgba(0,0,0,0.3)' }) ], { optional: true }),
      group([
          query(':leave', [ animate(`200ms ease-in`, style({ opacity: 0, transform: 'scale(0.95)' })) ], { optional: true }),
          query(':enter', [ animate(`500ms 100ms ${Easing.easeOutCirc}`, style({ transform: 'translateY(0)' })) ], { optional: true })
      ]),
  ]),
  transition('view => list', [
      ...prepare,
      query(':enter', [ style({ opacity: 0, transform: 'scale(0.95)' }) ], { optional: true }),
      query(':leave', [ style({ zIndex: 1, boxShadow: '0px -2px 16px 0px rgba(0,0,0,0.3)' }) ], { optional: true }),
      group([
        query(':leave', [ animate(`400ms ease-in`, style({ transform: 'translateY(100vh)' })) ], { optional: true }),
        query(':enter', [ animate(`200ms 200ms ${Easing.easeOutCirc}`, style({ opacity: 1, transform: 'scale(1)' })) ], { optional: true }),
      ]),
  ]),
]);
