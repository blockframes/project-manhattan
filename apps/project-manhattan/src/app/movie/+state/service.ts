import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Movie, movieConverter } from './model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  collectionRef = this.db.firestore.collection('movies').withConverter(movieConverter);
  collection = this.db.collection<Movie>(this.collectionRef);
  
  constructor(private db: AngularFirestore) {}

  query(queryFn: QueryFn = ref => ref) {
    return this.collection.valueChanges(queryFn);
  }

  valueChanges(id: string) {
    return this.collection.doc<Movie>(id).valueChanges();
  }
}