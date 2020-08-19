import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MovieService } from '../+state/service';
import { Observable } from 'rxjs';
import { Movie } from '../+state/model';

@Component({
  selector: 'movie-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit {

  movie$: Observable<Movie>;

  constructor(private service: MovieService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.movie$ = this.route.params.pipe(
      map(params => params['movieId'] as string),
      switchMap(movieId => this.service.valueChanges(movieId))
    );
  }

}
