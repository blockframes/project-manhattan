import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MovieService } from '../+state/service';
import { slideDown, slideUpList, scaleIn } from '../../animations';

@Component({
  selector: 'movie-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [slideDown, scaleIn, slideUpList('.movie-card')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {

  trackById = (i, item) => item.id;
  list$ = this.service.query();

  constructor(private service: MovieService) { }

  ngOnInit(): void {
  }

}
