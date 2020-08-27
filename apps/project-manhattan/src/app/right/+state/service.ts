import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { RIGHTS, TERMS, Right, Terms } from '@blockframes/right';
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

  uploadDemo(movieId: string) {
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