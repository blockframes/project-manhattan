import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RightService, Right, Terms } from '../+state';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { slideUpList, slideDown } from '../../animations';

import { RIGHTS, TERMS } from '@blockframes/right';

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
    const batch = this.db.firestore.batch();
    for (const right of RIGHTS) {
      const ref = this.db.doc(`movies/${movieId}/rights/${right.id}`).ref;
      batch.set(ref, right);
    }
    for (const terms of TERMS) {
      const ref = this.db.doc(`movies/${movieId}/terms/${terms.id}`).ref;
      batch.set(ref, terms);
    }
    return batch.commit();
  }
}
