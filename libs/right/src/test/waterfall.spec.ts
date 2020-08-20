import { Right, Terms, Income, createTerms, createRight, createParty, Party } from '../index';
import { createIncome, Summary, createSummary } from '../lib/model';
import { removeOverflow, LocalWaterfall } from '../lib/waterfall';

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
      createRight({ id: '2', percentage: 1, termsId: 'terms', parentIds: ['1'] }),
      createRight({ id: '1', percentage: 0.5, termsId: 'terms', parentIds: ['0'] }),
      createRight({ id: '0', percentage: 0.5,  termsId: 'terms' }),
    ];
    const income: Income = createIncome({ termsId: 'terms', amount: 100 });
    const waterfall = new LocalWaterfall({ rights, terms });
    const first = await waterfall.queryFirstRight(income);
    expect(first?.id).toBe('0');
  });

  test('Query the next right', async () => {
    const rights: Right[] = [
      createRight({ id: '2(bis)', percentage: 1, termsId: 'local', parentIds: ['1'] }),
      createRight({ id: '2', percentage: 1, termsId: 'inter', parentIds: ['1'] }),
      createRight({ id: '1', percentage: 0.5, termsId: 'inter', parentIds: ['0'] }),
      createRight({ id: '0', percentage: 0.5,  termsId: 'inter' }),
    ];
    const waterfall = new LocalWaterfall({ rights });
    const next = await waterfall.queryNext('1');
    const has2 = next.map(v => v.id).includes('2');
    const has2Bis = next.map(v => v.id).includes('2(bis)');
    expect(has2 && has2Bis).toBeTruthy();
  });

  test('Simple cashIn', async () => {
    const parties: Party[] = [createParty({ id: 'c8' })];
    const rights: Right[] = [createRight({ id: '0', percentage: 0.5, orgId: 'c8' })];
    const waterfall = new LocalWaterfall({ rights, parties });
    const right = await waterfall.getRight('0');
    const rest = await waterfall.cashIn(100, right);
    expect(rest).toBe(50);
  });

  // test('Simple income', async () => {
  //   const terms: Terms[] = [createTerms({ id: 'terms' })];
  //   const rights: Right[] = [createRight({ id: '0', percentage: 0.5,  termsId: 'terms' })];
  //   const income: Income = { termId: 'terms', amount: 100 };
  //   const waterfall = new LocalWaterfall({ rights, terms });
  //   const right = await waterfall.getRight('0');
  //   const rest = await waterfall.getIncome(income, right);
  //   expect(rest).toBe(50);
  // });
});