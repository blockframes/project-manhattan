import { Pipe, PipeTransform, Inject } from '@angular/core';
import { Terms, Summary, Waterfall } from './+state';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

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

@Pipe({ name: 'termsSeries' })
export class TermsSeriesPipe implements PipeTransform {
  transform(summary: Summary, orgId: string) {
    return Object.keys(summary.orgs[orgId])
      .filter(key => key !== 'total')
      .map(termsId => summary.orgs[orgId][termsId]);
  }
}

@Pipe({ name: 'orgLabel' })
export class OrgLabelPipe implements PipeTransform {
  transform(summary: Summary) {
    return Object.keys(summary.orgs);
  }
}

@Pipe({ name: 'termsLabel' })
export class TermsLabelPipe implements PipeTransform {
  transform(summary: Summary, orgId: string) {
    return Object.keys(summary.orgs[orgId]).filter(key => key !== 'total');
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


@Pipe({ name: 'largeCurrency' })
export class LargeNumberPipe implements PipeTransform {
  constructor(private service: TranslocoLocaleService) {}

  transform(value: number) {
    if (!value) return '';
    return (value / 1000) > 1
      ? `${this.service.localizeNumber(value / 1000, 'decimal')}k €`
      : `${this.service.localizeNumber(value, 'decimal')} €`;
  }
}

export const pipes = [
  OnlyOriginPipe,
  OrgDataSourcePipe,
  OrgSeriesPipe,
  TermsSeriesPipe,
  OrgLabelPipe,
  TermsLabelPipe,
  TableColumnPipe,
  MarginPipe,
  LargeNumberPipe,
];