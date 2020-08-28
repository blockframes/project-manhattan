import { firestore, initializeAdminApp } from '@firebase/testing';

// Import functions only after initializing the app
import { emulateSummary } from '../lib/local';
import { Income, Right, createRight, Terms, createTerms, Summary, createSummary } from '../lib/model';
import { RIGHTS, TERMS } from '../lib/fixtures';
import { supportIncome } from '../lib/income';

describe.skip('Distribute income', () => {
  const movieId = 'movie_0';
  let db: firestore.Firestore;

  /////////////
  // HELPERS //
  /////////////

  const setRight = (right: Right) => db.doc(`movies/${movieId}/rights/${right.id}`).set(createRight(right));
  const setTerms = (terms: Terms) =>  db.doc(`movies/${movieId}/terms/${terms.id}`).set(createTerms(terms));

  const roundSummary = (summary: Summary) => {
    for (const key in summary.title) {
      summary.title[key] = Math.round(summary.title[key]);
    }
    for (const key in summary.rights) {
      summary.rights[key] = Math.round(summary.rights[key]);
    }
    for (const org in summary.orgs) {
      for (const key in summary.orgs[org]) {
        summary.orgs[org][key] = Math.round(summary.orgs[org][key]);
      }
    }
  }

  const addIncome = (income: Income, oldSummary: Summary = createSummary()) => {
    return emulateSummary(db, income, movieId, oldSummary);
  }

  ////////////////
  // LIFE CYCLE //
  ////////////////

  beforeAll(async () => {
    const app = initializeAdminApp({ projectId: 'test' });
    db = app.firestore();
    db.settings({
      host: "localhost:8080",
      ssl: false
    });
    
    await Promise.all([
      RIGHTS.map(right => setRight(right)),
      TERMS.map(terms => setTerms(terms))
    ]);
  });

  // Remove everythinga
  afterEach(async () => {
    const docs = await db.collection(`movies/${movieId}/summaries`).get().then(snap => snap.docs);
    return Promise.all(docs.map(doc => doc.ref.delete()));
  });

  ///////////
  // TESTS //
  ///////////

  it('Creates a Summary', async () => {
    const incomeId = 'income_0';
    const termsId = 'originTheatrical';
    const summary = await addIncome({
      id: incomeId,
      termsId: termsId,
      amount: 0
    });

    expect(summary).toBeDefined();
  })

  it('Update title', async () => {
    const incomeId = 'income_1';
    const termsId = 'originTheatrical';
    const summary = await addIncome({
      id: incomeId,
      termsId: termsId,
      amount: 100
    });

    expect(summary.title.total).toBe(100);
    expect(summary.title[termsId]).toBe(100);
  });

  it('originTheatrical 2600', async () => {
    const incomeId = 'income_0';
    const summary = await addIncome({ id: incomeId, termsId: 'originTheatrical', amount: 2600 });
    roundSummary(summary);

    expect(summary.title['originTheatrical']).toBe(2600);
    expect(summary.rights['originTheatricalDistributionFees']).toBe(520);
    expect(summary.rights['originTheatricalExpenses']).toBe(1150);
    expect(summary.orgs['pathe'].total).toBe(2023);
    expect(summary.orgs['pathe']['originTheatrical']).toBe(2023);
    expect(summary.orgs['AYD'].total).toBe(577);
    expect(summary.orgs['AYD']['originTheatrical']).toBe(577);
  });


  it('List of 5 incomes', async () => {
    const quantity =  1_000_000;
    const price = 6.01;
    const incomes = [
      { id: 'theatricalIncome', termsId: 'originTheatrical', amount: 2600000 },
      { id: 'tvIncome', termsId: 'originTv', amount: 600000 },
      { id: 'videoIncome', termsId: 'originVideo', amount: 312340 },
      { id: 'vodIncome', termsId: 'originVod', amount: 299000},
      { id: 'rowIncome', termsId: 'rowAllRights', amount: 816000 },
    ];
    // Terms
    let summary = createSummary();
    for (const income of incomes) {
      summary = await addIncome(income, summary);
    }
    // Support
    const supports = supportIncome(quantity, price, summary);
    for (const support of supports) {
      summary = await addIncome(support, summary);
    }
  
    roundSummary(summary);
    console.log(summary);
    expect(summary.title['originTheatrical']).toBe(2600000);
    expect(summary.title['originTv']).toBe(600000);
    expect(summary.title['originVideo']).toBe(312320);
    expect(summary.title['originVod']).toBe(299000);
    expect(summary.title['rowAllRights']).toBe(816000);
    expect(summary.rights['originTheatricalDistributionFees']).toBe(520000);
    expect(summary.rights['originTvDistributionFees']).toBe(120000);
    expect(summary.rights['originVideoDistributionFees']).toBe(62000);
    expect(summary.rights['originVodDistributionFees']).toBe(60000);
    expect(summary.rights['rowAllRightsDistributionFees']).toBe(163000);
    expect(summary.rights['originTheatricalExpenses']).toBe(1150000);
    expect(summary.rights['originVideoExpenses']).toBe(137000);
    expect(summary.rights['rowExpenses']).toBe(56000);
    expect(summary.orgs['pathe'].total).toBe(3422000);
    expect(summary.orgs['AYD'].total).toBe(1438000);
    expect(summary.orgs['tVBroadcaster'].total).toBe(142000);
    expect(summary.orgs['equity'].total).toBe(45000);
    expect(summary.orgs['prod'].total).toBe(502000);
    expect(summary.orgs['AYD']['originTheatrical']).toBe(577000);
    expect(summary.orgs['AYD']['originTv']).toBe(274000);
    expect(summary.orgs['AYD']['originVideo']).toBe(70000);
    expect(summary.orgs['AYD']['originVod']).toBe(148000);
    expect(summary.orgs['AYD']['rowAllRights']).toBe(370000);
    expect(summary.orgs['tVBroadcaster'].total).toBe(38000);
    expect(summary.orgs['tVBroadcaster']['originTv']).toBe(38000);
    expect(summary.orgs['pathe']['originTheatrical']).toBe(2023000);
    expect(summary.orgs['pathe']['originTv']).toBe(288000);
    expect(summary.orgs['pathe']['originVideo']).toBe(243000);
    expect(summary.orgs['pathe']['originVod']).toBe(151000);
    expect(summary.orgs['pathe']['rowAllRights']).toBe(446000);
    expect(summary.rights['tVBroadcasterSupport']).toBe(70000);
    expect(summary.rights['equitySupport']).toBe(45000);
    expect(summary.rights['prodFullSupport']).toBe(150000);
    expect(summary.rights['prodFollowingSupport']).toBe(352000);
    expect(summary.rights['patheSupport']).toBe(236000);
    expect(summary.rights['patheBonusSupport']).toBe(35000);
  })

})
