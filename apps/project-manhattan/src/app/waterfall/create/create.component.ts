import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WaterfallService } from '../+state';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'waterfall-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent {

  constructor(
    private service: WaterfallService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async uploadWaterfall() {
    const movieId = this.route.snapshot.params.movieId;
    const id = await this.service.upload(movieId);
    this.router.navigate(['..', id], { relativeTo: this.route });
  }
}
