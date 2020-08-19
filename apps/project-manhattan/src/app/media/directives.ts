import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[bgImg]' })
export class BackgroundImg {
  @HostBinding('style.backgroundImage') image: string;
  
  @Input()
  set bgImg(image: string) {
    this.image =`url(${image})`
  }
}