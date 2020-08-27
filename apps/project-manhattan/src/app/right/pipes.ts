import { Pipe, PipeTransform } from '@angular/core';
import { RightService } from './+state';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Terms, Right }  from '@blockframes/right';

function orderRights(rights: Right[], termsId: string) {
  const sorted: Right[] = [];

  sorted[0] = rights.find(right => right.parentIds.includes(termsId));
  for (let i = 1; i < rights.length; i++) {
    const right = rights.find(right => right.parentIds.includes(sorted[i - 1]?.id));
    if (right) {
      sorted[i] = right;
    } else {
      break;
    }
  }

  return sorted;
}

@Pipe({ name: 'queryRight' })
export class QueryRightPipe implements PipeTransform {
  constructor(private service: RightService, private route: ActivatedRoute) {}
  transform(terms: Terms) {
    return this.route.params.pipe(
      map(params => params.movieId),
      switchMap(movieId => this.service.queryRights(movieId, ref => ref.where('termsIds', 'array-contains', terms.id))),
      map(rights => orderRights(rights, terms.id))
    );
  }
}
