import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MovieForm } from '../+state/form';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'movie-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnInit {

  form = new MovieForm();
  posters = [
    "assets/img/poster-1.png",
    "assets/img/poster-2.png",
    "assets/img/poster-3.png",
  ];

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  async create() {
    if (this.form.valid) {
      const { id } = await this.db.collection('movies').add(this.form.value);
      this.router.navigate(['..', id], { relativeTo: this.route });
    }
  }
}
