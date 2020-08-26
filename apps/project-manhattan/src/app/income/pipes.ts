import { Pipe, PipeTransform } from '@angular/core';
import { Summary, Terms } from '@blockframes/right';

@Pipe({ name: 'orgDataSource' })
export class OrgDataSourcePipe implements PipeTransform {
  transform(summary: Summary) {
    return Object.keys(summary.orgs).map(orgId => ({
      name: orgId,
      ...summary.orgs[orgId],
    }));
  }
}

@Pipe({ name: 'orgSeries' })
export class OrgSeriesPipe implements PipeTransform {
  transform(summary: Summary) {
    return Object.values(summary.orgs).map(({ total }) => Math.round(total));
  }
}

@Pipe({ name: 'orgLabel' })
export class OrgLabelPipe implements PipeTransform {
  transform(summary: Summary) {
    return Object.keys(summary.orgs);
  }
}

@Pipe({ name: 'tableColumns' })
export class TableColumnPipe implements PipeTransform {
  transform(terms: Terms[]) {
    console.log([ 'name', 'total', ...terms.map(t => t.id) ]);
    return [ 'name', 'total', ...terms.map(t => t.id) ];
  }
}