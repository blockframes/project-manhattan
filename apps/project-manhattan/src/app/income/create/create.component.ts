import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { IncomeService, createIncome, Income } from '../+state';
import { Summary, emulateSummary, fromTicketToIncome, createSummary } from '@blockframes/right';
import { Terms } from '../../right/+state';
import { slideDown, slideUpList } from '../../animations';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  animations: [slideDown, slideUpList('.up')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnInit {

  ticketForm = new FormGroup({
    amount: new FormControl(),
    price: new FormControl(),
  });
  incomes: Income[] = [];
  columns: string[];
  summary: Summary;
  isLoading: boolean;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    const movieId: string = this.route.snapshot.params.movieId;
    const terms = await this.db.collection(`movies/${movieId}/terms`).ref.get()
      .then(snap => snap.docs.map(doc => doc.data() as Terms));
    this.columns = ['name', 'total', ...terms.map(t => t.id)];
  }

  async emulate() {
    const movieId: string = this.route.snapshot.params.movieId;
    const { amount, price } = this.ticketForm.value;
    this.isLoading = true;
    this.incomes = fromTicketToIncome(amount, price);
    let summary = createSummary();
    for (const income of this.incomes) {
      summary = await emulateSummary(this.db.firestore, income, movieId, summary);
    }
    this.summary = summary;
    this.isLoading = false;
    this.cdr.markForCheck();
  }

}
