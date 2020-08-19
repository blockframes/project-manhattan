import { Right, Terms, Income, LocalWaterfall, createTerms } from '../index';



describe('Get Income from waterfall', () => {

  test('Get first right', async () => {
    const terms: Terms[] = [createTerms({ id: 'terms' })];
    const rights: Right[] = [
      { id: '2', percentage: 1, termsId: 'terms', parentId: '1' },
      { id: '1', percentage: 0.5, termsId: 'terms', parentId: '0' },
      { id: '0', percentage: 0.5,  termsId: 'terms' },
    ];
    const income: Income = { termId: 'terms', amount: 100 };
    const waterfall = new LocalWaterfall({ rights, terms });
    const first = await waterfall.getFirstRight(income);
    expect(first?.id).toBe('0');
  });

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

  test('Simple income', async () => {
    const terms: Terms[] = [createTerms({ id: 'terms' })];
    const rights: Right[] = [{ id: '0', percentage: 0.5,  termsId: 'terms' }];
    const income: Income = { termId: 'terms', amount: 100 };
    const waterfall = new LocalWaterfall({ rights, terms });
    const rest = await waterfall.getIncome(income, '0');
    expect(rest).toBe(50);
  });
});