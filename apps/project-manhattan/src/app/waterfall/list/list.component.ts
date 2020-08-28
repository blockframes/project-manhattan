import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { WaterfallService } from '../+state';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { routeAnimation } from '../../animations';

@Component({
  selector: 'waterfall-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [routeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  waterfalls$: Observable<any[]>;
  constructor(
    private service: WaterfallService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.waterfalls$ = this.route.params.pipe(
      map(params => params['movieId'] as string),
      switchMap(movieId => this.service.queryScenario(movieId))
    );
  }

  routeChange(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }

  uploadWaterfall() {
    const movieId = this.route.snapshot.params.movieId;
    return this.service.upload(movieId);
  }
}
