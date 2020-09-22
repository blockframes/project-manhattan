import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Waterfall } from '../+state';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  modes = { default: ['zoom-canvas', 'drag-canvas'] };

  constructor(@Inject(MAT_DIALOG_DATA) public waterfall: Waterfall) {}

  ngOnInit(): void {
  }

}
