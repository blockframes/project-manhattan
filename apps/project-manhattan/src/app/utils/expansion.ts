import { Component, Input, HostBinding, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';


@Component({
  selector: 'expansion',
  animations: [],
  template: `
    <header fxLayout>
      <ng-content select=".header"></ng-content>
      <button mat-icon-button >
        <mat-icon>keyboard_arrow_down</mat-icon>
      </button>
    </header>
    <section *ngIf="expanded">
      <ng-content select=".content"></ng-content>
    </section>
  `,
  styles: [`:host {
    display: 'block';
    height: auto;
    max-height: 300px;
    transition: max-height 0.3s;
  }`]
})
export class ExpansionComponent {
  // @HostBinding('@expanded')
  @Input() expanded = false;
}


@NgModule({
  declarations: [ExpansionComponent],
  exports: [ExpansionComponent],
  imports: [CommonModule, FlexLayoutModule, MatButtonModule, MatIconModule],
})
export class ExpansionModule {}