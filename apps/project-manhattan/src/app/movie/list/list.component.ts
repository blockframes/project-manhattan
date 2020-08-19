import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MovieService } from '../+state/service';

@Component({
  selector: 'movie-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {

  list$ = this.service.query();

  constructor(private service: MovieService) { }

  ngOnInit(): void {
  }

}
