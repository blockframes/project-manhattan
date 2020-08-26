import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MovieService } from '../+state/service';
import { Observable } from 'rxjs';
import { Movie } from '../+state/model';
import { routeAnimation } from '../../animations';

@Component({
  selector: 'movie-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  animations: [routeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit {

  movie$: Observable<Movie>;
  links = {
    'right': 'waterfall', 
    'income': 'emulator'
  };

  constructor(private service: MovieService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.movie$ = this.route.params.pipe(
      map(params => params['movieId'] as string),
      switchMap(movieId => this.service.valueChanges(movieId))
    );
  }

  routeChange(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }

}
