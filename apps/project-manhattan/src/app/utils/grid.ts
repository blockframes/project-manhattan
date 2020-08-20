import { Component, NgModule, Directive } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'grid',
  template: `
  <div gdColumns.gt-sm="repeat(6, 1fr)" gdColumns.sm="repeat(4, 1fr)"  gdColumns.xs="repeat(2, 1fr)" gdGap="16px">
    <ng-content></ng-content>
  </div>`,
  styles: [':host { display: block; padding: 24px; }']
})
export class GridComponent {}

@NgModule({
  imports: [FlexLayoutModule],
  declarations: [GridComponent],
  exports: [GridComponent]
})
export class GridModule {}
