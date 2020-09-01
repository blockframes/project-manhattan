import { Directive, Input, HostBinding } from '@angular/core';

@Directive({ selector: '[benefice]' })
export class BeneficeDirective {
  @Input() benefice: number;
  @HostBinding('style.color') get color() {
    return this.benefice > 0 ? 'green' : 'red';
  }
}