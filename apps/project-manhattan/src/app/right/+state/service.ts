import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Right, Terms } from '@blockframes/right';
import { combineLatest } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RightService {

  constructor(private db: AngularFirestore) {}

  queryWaterfall(movieId: string) {
    return combineLatest([
      this.queryRights(movieId),
      this.queryTerms(movieId),
    ]);
  }

  queryRights(movieId: string, queryFn: QueryFn = ref => ref) {
    return this.db.collection<Right>(`movies/${movieId}/rights`, queryFn).valueChanges();
  }

  queryTerms(movieId: string, queryFn: QueryFn = ref => ref) {
    return this.db.collection<Terms>(`movies/${movieId}/terms`, queryFn).valueChanges();
  }

}