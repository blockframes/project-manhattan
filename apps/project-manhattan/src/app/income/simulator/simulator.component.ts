import type { Summary, Terms, Income } from '@blockframes/right';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { slideDown, slideUpList } from '../../animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss'],
  animations: [slideDown, slideUpList('.up')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimulatorComponent implements OnInit {

  terms$: Observable<Terms[]>;
  columns$: Observable<string[]>;
  incomes: Income[] = [];
  columns: string[];
  summary: Summary;
  isLoading: boolean;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    const movieId: string = this.route.snapshot.params.movieId;
    const queryFn = ref => ref.where('type', '==', 'origin');
    this.terms$ = this.db.collection<Terms>(`movies/${movieId}/terms`, queryFn).valueChanges().pipe(
      shareReplay(1)
    );
    this.columns$ = this.terms$.pipe(
      map(terms => [ 'name', 'total', ...terms.map(t => t.id) ])
    );
  }

  setResult({ summary, incomes }) {
    this.summary = summary;
    this.incomes = incomes;
  }

  // async emulate() {
  //   const movieId: string = this.route.snapshot.params.movieId;
  //   const { amount, price } = this.ticketForm.value;
  //   this.isLoading = true;
  //   this.incomes = fromTicketToIncome(amount, price);
  //   let summary = createSummary();
  //   for (const income of this.incomes) {
  //     summary = await emulateSummary(this.db.firestore, income, movieId, summary);
  //   }
  //   this.summary = summary;
  //   this.isLoading = false;
  //   this.cdr.markForCheck();
  // }

}
