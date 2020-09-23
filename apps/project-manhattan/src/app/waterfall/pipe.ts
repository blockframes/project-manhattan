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

@Pipe({ name: 'getTerms' })
export class GetTermsPipe implements PipeTransform {
  transform(waterfall: Waterfall, termsId: string) {
    if (termsId === 'name') return { title: 'Nom' };
    if (termsId === 'total') return { title: 'Total' };
    return waterfall.terms.find(t => t.id === termsId);
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
  transform(terms: Terms[]): string[] {
    return [ 'name', 'total', ...terms.map(t => t.id) ]
  }
}



@Pipe({ name: 'largeCurrency' })
export class LargeNumberPipe implements PipeTransform {
  constructor(private service: TranslocoLocaleService) {}

  transform(value: number) {
    if (!value) return '';
    return Math.abs(value / 1000) > 1
      ? `${this.service.localizeNumber(value / 1000, 'decimal')}k €`
      : `${this.service.localizeNumber(value, 'decimal')} €`;
  }
}



//// MARGE
function receipts(summary: Summary) {
  const { rights, title } = summary;
  return title['originTheatrical'] + title['originTv']+ title['originVideo'] + title['originVod'] + title['rowAllRights'] + title['theatricalDistSupport'] + title['videoDistSupport'] - rights['originTheatricalExpenses'] - rights['originVideoExpenses'] - rights['rowExpenses']
}
@Pipe({ name: 'receipts' })
export class ReceiptsPipe implements PipeTransform {
  transform(summary: Summary) {
    return receipts(summary);
  }
}

function support(summary: Summary) {
  const { title, orgs } = summary;
  return title['theatricalSupport'] + title['videoSupport'] + title['tvSupport'] + title['bonusSupport'] - orgs['tvBroadcaster']['theatricalSupport'] - orgs['tvBroadcaster']['videoSupport'] - orgs['tvBroadcaster']['tvSupport'] - orgs['prod']['theatricalSupport'] - orgs['prod']['videoSupport'] - orgs['prod']['tvSupport'] - orgs['equity']['theatricalSupport'] - orgs['equity']['videoSupport'] - orgs['equity']['tvSupport'];
}
@Pipe({ name: 'support' })
export class SupportPipe implements PipeTransform {
  transform(summary: Summary) {
    return support(summary);
  }
}

function shareholders(summary: Summary, waterfall: Waterfall) {
  const { orgs } = summary;
  return - orgs['AYD'].total - orgs['tvBroadcaster']['originTv'] - orgs['partner'].total + waterfall.investments['partner'] 
}
@Pipe({ name: 'shareholders' })
export class ShareholdersPipe implements PipeTransform {
  transform(summary: Summary, waterfall: Waterfall) {
    return shareholders(summary, waterfall);
  }
}

function investment(waterfall: Waterfall) {
  return - waterfall.investments['partner'] - waterfall.investments['pathe']
}
@Pipe({ name: 'investment' })
export class InvestmentPipe implements PipeTransform {
  transform(waterfall: Waterfall) {
    return investment(waterfall);
  }
}

@Pipe({ name: 'margin' })
export class MarginPipe implements PipeTransform {
  transform(summary: Summary, waterfall: Waterfall) {
    return receipts(summary) + support(summary) + shareholders(summary, waterfall) + investment(waterfall);
  }
}


export const pipes = [
  GetTermsPipe,
  OnlyOriginPipe,
  OrgDataSourcePipe,
  OrgSeriesPipe,
  TermsSeriesPipe,
  OrgLabelPipe,
  TermsLabelPipe,
  TableColumnPipe,
  LargeNumberPipe,
  ReceiptsPipe,
  SupportPipe,
  ShareholdersPipe,
  InvestmentPipe,
  MarginPipe,
];