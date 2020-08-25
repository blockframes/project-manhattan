import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Income } from './model';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  collectionRef = this.db.firestore.collection('incomes');
  collection = this.db.collection<Income>(this.collectionRef);
  
  constructor(private db: AngularFirestore) {}

  query(queryFn: QueryFn = ref => ref) {
    return this.collection.valueChanges(queryFn);
  }

  valueChanges(id: string) {
    return this.collection.doc<Income>(id).valueChanges();
  }
}