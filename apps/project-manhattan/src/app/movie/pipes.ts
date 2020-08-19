import { Pipe, PipeTransform } from '@angular/core';
import { MovieService } from './+state/service';

@Pipe({ name: 'getMovie '})
export class GetMoviePipe implements PipeTransform {
  constructor(private service: MovieService) {}
  transform(movieId: string) {
    if (movieId) {
      return this.service.valueChanges(movieId);
    }
  }
}