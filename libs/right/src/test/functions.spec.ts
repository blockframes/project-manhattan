import * as functionTest from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { WrappedFunction } from 'firebase-functions-test/lib/main';

const projectId = 'test';
const test = functionTest({ projectId }, 'credentials/firebase-sdk.json');

// Import functions only after initializing the app
import { incomeOnCreate } from '../lib/functions';
import { Income, createSummary } from '../lib/model';

describe.only('Distribute income', () => {
  let wrapped: WrappedFunction;
  let db: FirebaseFirestore.Firestore;
  beforeAll(() => {
    // Seems not required, but I put it anyway
    process.env.FIRESTORE_EMULATOR_HOST="localhost:8080"
    const app = admin.initializeApp({ projectId });
    db = app.firestore();
  });

  beforeEach(() => {
    wrapped = test.wrap(incomeOnCreate);
  });

  it.only('run the income', async (done) => {
    const movieId = 'movie_0';
    const incomeId = 'income_0';
    const termsId = 'terms_0';
    await Promise.all([
      db.doc(`movies/${movieId}/terms/${termsId}`).set({ id: termsId }),
      db.doc(`movies/${movieId}/rights/${termsId}`).set({ parentIds: [termsId], termsIds: [termsId]}),
      db.doc(`movies/${movieId}/summaries/genesis`).set(createSummary()),
    ]);
    
    const ctx = {
      params: { movieId, incomeId }
    }
    const data = test.firestore.makeDocumentSnapshot(<Income>{
      id: incomeId,
      termsId: termsId,
      amount: 100
    }, `movies/${movieId}/incomes/${incomeId}`);
    return wrapped(data, ctx).then(async () => {
      const summary = await db.doc(`movies/${movieId}/summaries/${incomeId}`).get()
      expect(summary.exists).toBeTruthy();
      done();
    });

  })

  afterAll(() => test.cleanup());
})
