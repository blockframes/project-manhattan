import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MovieForm } from '../+state/form';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Movie } from '../+state/model';

@Component({
  selector: 'movie-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent {

  movies: Partial<Movie>[] = [{
    title: 'Road of the North',
    poster: 'assets/img/poster-1.png',
    description: 'A brilliant Canadian student, Christopher Malain has a bright future ahead of him. Yet, he rejects the principles of modern society and after a dinner face to face with his fiancee Cyndie, obsessed with her business career, he decides to leave without telling anyone. He then discovers the beautiful roads of the North.'
  }, {
    title: 'Hiding in the Graves',
    poster: 'assets/img/poster-2.png',
    description: 'In Scotland, in the cemetery of County Windham, Jane Fauster, young widow devastated by the sudden disappearance of her husband during a banal fishing trip, finds herself embarked in an intriguing game of hide and seek between the graves. Her misplaced curiosity and his willingness to break away from boredom will lead her to trials even more clumsy than the worst of mourning.'
  }, {
    title: 'Romantic Holiday',
    poster: 'assets/img/poster-3.png',
    description: 'The plot is set during the Industrial Revolution in London. Janie Jones a rich  married woman escapes her day to day life and takes some holiday in the south of the country where she meets Andre, an elegant writer. Quickly, she will have to choose between duty and romance.'
  }]

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  async create(movie: Partial<Movie>) {
    const { id } = await this.db.collection('movies').add(movie);
    this.router.navigate(['..', id], { relativeTo: this.route });
  }
}
