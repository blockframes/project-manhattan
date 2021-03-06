import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RightService } from '../+state';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { slideUpList, slideDown } from '../../animations';

import { RIGHTS, TERMS, Right, Terms } from '@blockframes/right';

@Component({
  selector: 'right-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [slideDown, slideUpList('h2, mat-card')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  waterfall$: Observable<[Right[], Terms[]]>;
  terms$: Observable<Terms[]>;
  right: Right;
  trackById = (i: number, item: any) => item?.id;

  constructor(
    private db: AngularFirestore,
    private service: RightService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.terms$ = this.route.params.pipe(
      map(params => params.movieId),
      switchMap(movieId => this.service.queryTerms(movieId))
    )
  }

  select(right: Right) {
    this.right = right;
  }

  uplaodDataset() {
    const movieId = this.route.snapshot.params.movieId;
    return this.service.uploadDemo(movieId);
  }
}
