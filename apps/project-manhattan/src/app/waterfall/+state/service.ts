import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Waterfall } from './model';
import { WATERFALL, runSimulation, SimulationSource } from '@blockframes/right';

@Injectable({ providedIn: 'root' })
export class WaterfallService {
  constructor(private db: AngularFirestore) {}

  queryScenario(movieId: string) {
    const queryFn = ref => ref.where('type', '==', 'scenario');
    return this.db.collection<Waterfall>(`movies/${movieId}/waterfalls`, queryFn).valueChanges();
  }

  valueChanges(movieId: string, id: string) {
    return this.db.doc<Waterfall>(`movies/${movieId}/waterfalls/${id}`).valueChanges();
  }

  update(movieId: string, waterfall: Partial<Waterfall>) {
    this.db.doc<Waterfall>(`movies/${movieId}/waterfalls/${waterfall.id}`).update(waterfall);
  }

  async upload(movieId: string) {
    const id = this.db.createId();
    WATERFALL.id = id;
    await this.db.doc<Waterfall>(`movies/${movieId}/waterfalls/${id}`).set(WATERFALL);
    return id;
  }

  runSimulation(waterfall: Waterfall, source: SimulationSource) {
    return runSimulation(waterfall, source);
  }
}