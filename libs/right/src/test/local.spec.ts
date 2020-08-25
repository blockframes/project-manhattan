import { firestore, initializeAdminApp } from '@firebase/testing';

// Import functions only after initializing the app
import { processIncome } from '../lib/local';
import { Income, Right, createRight, Terms, createTerms, Summary, createSummary } from '../lib/model';
import { RIGHTS, TERMS } from './fixtures';

describe.only('Distribute income', () => {
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
    return processIncome(db, income, movieId, oldSummary);
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
    await addIncome({
      id: incomeId,
      termsId: termsId,
      amount: 0
    });

    const summary = await db.doc(`movies/${movieId}/summaries/${incomeId}`).get();
    expect(summary.exists).toBeTruthy();
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
    expect(summary.orgs['Pathe'].total).toBe(2023);
    expect(summary.orgs['Pathe']['originTheatrical']).toBe(2023);
    expect(summary.orgs['AYD'].total).toBe(577);
    expect(summary.orgs['AYD']['originTheatrical']).toBe(577);
  });


  it.only('List of 5 incomes', async () => {
    const incomes = [
      { id: '0', termsId: 'originTheatrical', amount: 2600 },
      { id: '1', termsId: 'originTv', amount: 600 },
      { id: '2', termsId: 'originVideo', amount: 312.32 },
      { id: '3', termsId: 'originVod', amount: 299 },
      { id: '4', termsId: 'rowAllRights', amount: 816 },
    ];
    let summary = createSummary();
    for (const income of incomes) {
        summary = await addIncome(income, summary);
    }

    roundSummary(summary);
    expect(summary.title['originTheatrical']).toBe(2600);
    expect(summary.title['originTv']).toBe(600);
    expect(summary.title['originVideo']).toBe(312);
    expect(summary.title['originVod']).toBe(299);
    expect(summary.title['rowAllRights']).toBe(816);
    expect(summary.rights['originTheatricalDistributionFees']).toBe(520);
    expect(summary.rights['originTvDistributionFees']).toBe(120);
    expect(summary.rights['originVideoDistributionFees']).toBe(62);
    expect(summary.rights['originVodDistributionFees']).toBe(60);
    expect(summary.rights['rowAllRightsDistributionFees']).toBe(163);
    expect(summary.rights['originTheatricalExpenses']).toBe(1150);
    expect(summary.rights['originVideoExpenses']).toBe(137);
    expect(summary.rights['rowExpenses']).toBe(56);
    expect(summary.orgs['Pathe'].total).toBe(3150);
    expect(summary.orgs['AYD'].total).toBe(1438);
    expect(summary.orgs['Pathe']['originTheatrical']).toBe(2023);
    expect(summary.orgs['Pathe']['originTv']).toBe(288);
    expect(summary.orgs['Pathe']['originVideo']).toBe(242);
    expect(summary.orgs['Pathe']['originVod']).toBe(151);
    expect(summary.orgs['Pathe']['rowAllRights']).toBe(446);
    expect(summary.orgs['AYD']['originTheatrical']).toBe(577);
    expect(summary.orgs['AYD']['originTv']).toBe(274);
    expect(summary.orgs['AYD']['originVideo']).toBe(70);
    expect(summary.orgs['AYD']['originVod']).toBe(148);
    expect(summary.orgs['AYD']['rowAllRights']).toBe(370);
    expect(summary.orgs['TVBroadcaster'].total).toBe(38);
    expect(summary.orgs['TVBroadcaster']['originTv']).toBe(38);
  })

})
