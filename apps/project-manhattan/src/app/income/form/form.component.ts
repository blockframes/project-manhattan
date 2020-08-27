import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Terms, createIncome } from '@blockframes/right';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { createForm } from '../+state/form';
import { Income, Summary, emulateSummary, supportIncome, createSummary } from '@blockframes/right';
import { slideDown, slideDownList } from '../../animations';
import { RightService } from '../../right/+state';

interface Result {
  summary: Summary;
  incomes: Income[];
}

@Component({
  selector: 'income-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  animations: [slideDown, slideDownList('mat-form-field, button')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent {
  form: FormGroup;
  termsList: Terms[];
  isLoading: boolean;

  @Output() loading = new EventEmitter<boolean>();
  @Output() onResult = new EventEmitter<Result>();
  @Input()
  set terms(terms: Terms[]) {
    if (terms?.length) {
      this.form = createForm(terms);
      this.termsList = terms;
    }
    this.isLoading = !terms;
  }

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private rightService: RightService,
  ) { }

  get formTerms() {
    return this.form.get('terms') as FormGroup;
  }

  uplaodDataset() {
    const movieId = this.route.snapshot.params.movieId;
    return this.rightService.uploadDemo(movieId);
  }
  
  async emulate() {
    const movieId: string = this.route.snapshot.params.movieId;
    const { ticket, terms } = this.form.value;
    this.loading.emit(true);
    const incomes: Income[] = [];
    let summary = createSummary();
    for (const termsId in terms) {
      const amount = terms[termsId];
      if (amount) {
        const income = createIncome({ id: termsId, termsId, amount: terms[termsId] });
        summary = await emulateSummary(this.db.firestore, income, movieId, summary);
        incomes.push(income);
      }
    }
    // Do support after the other one because it might need information for summary
    const supports = supportIncome(ticket.amount, ticket.price, summary);
    for (const support of supports) {
      summary = await emulateSummary(this.db.firestore, support, movieId, summary);
    }
    this.loading.emit(false);
    this.onResult.emit({ summary, incomes })
  }
}
