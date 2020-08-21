import { Right, Terms, Income, createTerms, createRight } from '../index';
import { createIncome, Summary, createSummary } from '../lib/model';
import { LocalWaterfall } from '../lib/waterfall';
import { removeOverflow } from '../lib/utils';

describe('Remove overflow', () => {
  let right: Right;
  let summary: Summary;
  beforeEach(() => {
    summary = createSummary({ rights: { '0': 10 }});
    right = createRight({
      id: '0',
      conditions: [{ kind: 'step', rightId: '0', max: 50 } as any]
    });
  })
  it('Without overflow', () => {
    const total = removeOverflow(10, right, summary);
    expect(total).toBe(10);
  });
  it('With overflow', () => {
    const total = removeOverflow(100, right, summary);
    expect(total).toBe(40);
  });
})

describe('Get Income from waterfall', () => {

  test('Check terms incompatibility on territory', async () => {
    const terms: Terms[] = [
      createTerms({ id: 'local', territories: { included: ['FR'], excluded: [] } }),
      createTerms({ id: 'extended', territories: { included: ['FR', 'BEL', 'SW'], excluded: [] } }),
      createTerms({ id: 'inter', territories: { included: [], excluded: ['FR'] } }),
    ];
    const waterfall = new LocalWaterfall({ terms });
    const [ same, truthy, falsy ] = await Promise.all([
      waterfall.areTermsCompatible('local', 'local'),
      waterfall.areTermsCompatible('local', 'extended'),
      waterfall.areTermsCompatible('local', 'inter')
    ]);
    expect(same).toBeTruthy();
    expect(truthy).toBeTruthy();
    expect(falsy).toBeFalsy();
  });

  // TODO: check also on channels


  test('Get first right', async () => {
    const terms: Terms[] = [createTerms({ id: 'terms' })];
    const rights: Right[] = [
      createRight({ id: '2', percentage: 1, termsIds: ['terms'], parentIds: ['1'] }),
      createRight({ id: '1', percentage: 0.5, termsIds: ['terms'], parentIds: ['0'] }),
      createRight({ id: '0', percentage: 0.5,  termsIds: ['terms'] }),
    ];
    const income: Income = createIncome({ termsId: 'terms', amount: 100 });
    const waterfall = new LocalWaterfall({ rights, terms });
    const first = await waterfall.queryFirstRight(income);
    expect(first?.id).toBe('0');
  });

  test('Query the next right', async () => {
    const rights: Right[] = [
      createRight({ id: '2(bis)', percentage: 1, termsIds: ['local'], parentIds: ['1'] }),
      createRight({ id: '2', percentage: 1, termsIds: ['inter'], parentIds: ['1'] }),
      createRight({ id: '1', percentage: 0.5, termsIds: ['inter'], parentIds: ['0'] }),
      createRight({ id: '0', percentage: 0.5,  termsIds: ['inter'] }),
    ];
    const waterfall = new LocalWaterfall({ rights });
    const next = await waterfall.queryRights('1', 'inter');
    const has2 = next.map(v => v.id).includes('2');
    const has2Bis = next.map(v => v.id).includes('2(bis)');
    expect(has2).toBeTruthy();
    expect(has2Bis).toBeFalsy();
  });

});