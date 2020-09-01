import { Pipe, PipeTransform } from '@angular/core';
import { Terms, Summary, Waterfall } from './+state';

@Pipe({ name: 'amountSize' })
export class AmountSize implements PipeTransform {
  transform(multiplier: number) {
    return multiplier === 1000 ? 'k' : '';
  }
}

@Pipe({ name: 'onlyOrigin' })
export class OnlyOriginPipe implements PipeTransform {
  transform(terms: Terms[]) {
    return terms.filter(t => t.type === 'origin');
  }
}

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
    return [ 'name', 'total', ...terms.map(t => t.id) ];
  }
}

@Pipe({ name: 'margin' })
export class MarginPipe implements PipeTransform {
  transform(waterfall: Waterfall, summary: Summary, orgId: string) {
    return summary.orgs[orgId].total - waterfall.investments[orgId];
  }
}

export const pipes = [OnlyOriginPipe, OrgDataSourcePipe, OrgSeriesPipe, OrgLabelPipe, TableColumnPipe, MarginPipe]