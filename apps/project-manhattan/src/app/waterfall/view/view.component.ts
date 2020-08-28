import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Waterfall, WaterfallService, createForm } from '../+state';
import { ActivatedRoute } from '@angular/router';
import { switchMap, filter, distinctUntilKeyChanged, shareReplay } from 'rxjs/operators';
import { Income, Summary, Simulation } from '@blockframes/right';
import { slideDownList, slideUpList } from '../../animations';

@Component({
  selector: 'waterfall-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  animations: [slideUpList('.up'), slideDownList('mat-form-field')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit {
  private sub: Subscription;
  incomes: Income[] = [];
  summary: Summary;
  waterfall$: Observable<Waterfall>;
  form = createForm([]);

  constructor(
    private service: WaterfallService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.waterfall$ = this.route.params.pipe(
      switchMap(({ movieId, waterfallId}) => this.service.valueChanges(movieId, waterfallId)),
      shareReplay(1)
    );
    this.sub = this.waterfall$.pipe(
      filter(waterfall => !!waterfall),
      distinctUntilKeyChanged('id'),
    ).subscribe(waterfall => this.form = createForm(waterfall.terms))
  }

  runSimulation(waterfall: Waterfall, name?: string) {
    delete this.incomes;
    if (name) {
      const simulation = waterfall.simulations.find(s => s.name === name);
      this.form.setValue(simulation);
    } 
    const source = this.form.value;
    const { incomes, summary } = this.service.runSimulation(waterfall, source);
    this.incomes = incomes;
    this.summary = summary;
  }

  createSimulation(waterfall: Waterfall) {
    const movieId = this.route.snapshot.params.movieId;
    waterfall.simulations.push(this.form.value);
    this.service.update(movieId, waterfall);
  }

  removeSimulation(waterfall: Waterfall, simulation: Simulation) {
    const movieId = this.route.snapshot.params.movieId;
    const simulations = waterfall.simulations.filter(s => s.name !== simulation.name);
    waterfall.simulations = simulations;
    this.service.update(movieId, waterfall);
  }
}
