import type { firestore } from 'firebase';
import { Income, Right, createSummary, createIncome } from './model';
import { removeOverflow, checkCondition } from './utils';

// Run locally the script
export async function processIncome(
  db: firestore.Firestore,
  income: Income,
  movieId: string,
  lastSummary = createSummary()
) {

  // Create the summary: use the incomeId as id
  const summary = createSummary({
    id: income.id,
    previous: lastSummary.id,
    title: lastSummary.title,
    rights: lastSummary.rights,
    orgs: lastSummary.orgs,
  });

  ///////////
  // SETUP //
  ///////////

  /** Query rights by their parentId, if 'root' then it's the first */
  const queryRights = (parentId: string) => {
    const query = db.collection(`movies/${movieId}/rights`).where('parentIds', 'array-contains', parentId);
    return query.get().then(snap => snap.docs.map(doc => doc.data() as Right))
  }

  /** Get the first right for a specific income */
  const queryFirstRight = async (income: Income): Promise<Right> => {
    // If a right is the first for a terms, the parentId is the termsId
    const rights = await queryRights(income.termsId);

    if (rights.length > 1) {
      throw new Error('There are multiple first right for terms id: ' + income.termsId);
    }
    if (rights.length === 0) {
      throw new Error('Could not find first right for terms id: ' + income.termsId);
    }
    return rights[0];
  }

  // We need to use parent / key to keep the mutation
  /** Set the value of an entry of the summary */
  const setSummaryEntry = (parent: { [key: string]: number }, key: string, increment: number): void => {
    if (parent[key]) {
      parent[key] = parent[key] + increment;
    } else {
      parent[key] = increment;
    }
  }

  /**
   * Update the amount received by the party & return the rest
   * @param income The income for this right
   * @param right The right used for calculation
   */
  const cashIn = async (income: Income, right: Right): Promise<number> => {
    const amount = income.amount * right.percentage;
    const remain = removeOverflow(amount, right, summary);
    // Update summary
    if (!summary.orgs[right.orgId]) {
      summary.orgs[right.orgId] = { total: 0 };
    }
    setSummaryEntry(summary.orgs[right.orgId], 'total', remain);
    setSummaryEntry(summary.orgs[right.orgId], income.termsId, remain);
    setSummaryEntry(summary.rights, right.id, remain);

    return income.amount - remain;
  }

  /** For one right, verify that each condition is validated */
  const checkAllCondition = (right: Right) => {
    return right.conditions?.length
      ? right.conditions.every(cdt => checkCondition(cdt, summary))
      : true;
  }

  /**
   * Main process: recursively calculate the amount 
   * @param income The income with the amount updated 
   * @param right The right that get the income
   */
  const getIncome = async (income: Income, right: Right): Promise<void> => {
    const canCashIn = checkAllCondition(right);
    const rest = canCashIn
      ? await cashIn(income, right)
      : income.amount;

    if (rest > 0) {
      // Create a copy of the income with the amount updated after right took value
      const nextIncome = createIncome({ ...income, amount: rest });
      const nexts = await queryRights(right.id);

      for (const next of nexts) {
        // Verify if next has current termsId here because
        // query doesn't support multiple array contains
        if (next.termsIds.includes(income.termsId)) {
          await getIncome(nextIncome, next);
        }
      }
    }
  }


  /////////////////
  // RUN PROCESS //
  /////////////////
  /** Update the amount received by the title */
  setSummaryEntry(summary.title, 'total', income.amount);
  setSummaryEntry(summary.title, income.termsId, income.amount);

  const firstRight = await queryFirstRight(income);
  await getIncome(income, firstRight);

  return summary;
}