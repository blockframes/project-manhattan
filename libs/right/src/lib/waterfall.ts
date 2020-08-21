import { Right, Terms, Income, Party, Summary, createSummary, createIncome } from './model';
import { removeOverflow, checkCondition, termIncompatibility } from './utils';

interface WaterfallJson {
  rights?: Right[];
  terms?: Terms[];
  parties?: Party[];
}

function toObject<T extends { id: string }>(list?: T[]): Record<string, T> {
  const output: Record<string, T> = {};
  if (!Array.isArray(list)) {
    return output;
  }
  for (const item of list) {
    output[item.id] = item;
  }
  return output;
}

/**
 * For an income
 * 1. queryFirstRight(income) => right
 * 2. getIncome(income, right)
 * 21. checkEventCondition(right) -> boolean
 * 22. cashIn(income.amount) -> rest
 * 23. emitEvent()
 * 24. queryNext() -> next
 * 25. getIncome(restIncome, )
 */

export class LocalWaterfall {
  private rights: Record<string, Right> = {};
  private terms: Record<string, Terms> = {};
  private incomes: Record<string, Income> = {};
  private summary: Summary;

  constructor(data: WaterfallJson = {}) {
    this.rights = toObject(data.rights);
    this.terms = toObject(data.terms);
    this.summary = createSummary();
  }

  async queryRights(parentId: string | 'root', termsId: string) {
    return Object.values(this.rights).filter((right) => {
      const hasParent = right.parentIds.includes(parentId);
      const hasTerms = right.termsIds.includes(termsId);
      return hasParent && hasTerms;
    });
  }
  async getTerms(id: string) {
    if (!id) throw new Error('Provide an id to method "getTerms"');
    return this.terms[id];
  }
  async getSummary() {
    return this.summary;
  }

  /** Add an income to the movie & trigger the rest */
  createIncome(income: Income) {
    this.incomes[income.id] = income;
    this.onCreateIncome(income);
  }

  /** When an income is created update summary & run process */
  async onCreateIncome(income: Income) {
    const right = await this.queryFirstRight(income);
    if (right) {
      this.summary.title.total += income.amount;
      this.summary.title[income.termsId] += income.amount;
      this.getIncome(income, right);
    } else {
      throw new Error('There is no first right for the income with id ' + income.id);
    }
  }


  /** Check if terms are compatible */
  async areTermsCompatible(termsA: string, termsB: string): Promise<boolean> {
    // Same terms: Obviously compatible
    if (termsA === termsB) {
      return true;
    }
    const [ a, b ] = await Promise.all([
      this.getTerms(termsA),
      this.getTerms(termsB),
    ]);
    if (termIncompatibility(a, b, 'channels')) {
      return false;
    }
    if (termIncompatibility(a, b, 'territories')) {
      return false;
    }
    return true;
  }
  
  /** Get the first right for a specific income */
  async queryFirstRight(income: Income): Promise<Right | undefined> {
    const rights = await this.queryRights('root', income.termsId);
    if (rights.length > 1) {
      throw new Error('There are multiple first right for terms id: ' + income.termsId);
    }
    if (rights.length === 0) {
      throw new Error('Could not find first right for terms id: ' + income.termsId);
    }
    return rights[0];
  }

  async getIncome(income: Income, right: Right): Promise<void> {
    const canCashIn = await this.checkAllCondition(right);
    const rest = canCashIn
      ? await this.cashIn(income, right)
      : income.amount;

    if (rest > 0) {
      // Create a copy of the income with the amount updated after right took value
      const nextIncome = createIncome({ ...income, amount: rest });
      const nexts = await this.queryRights(right.id, income.termsId);
      for (const next of nexts) {
        this.getIncome(nextIncome, next);
      }
    }
  }

  /**
   * Update the amount received by the party & return the rest
   * @param base The amount incoming to the right
   * @param right The right used for calculation
   */
  async cashIn(income: Income, right: Right): Promise<number> {
    const amount = income.amount * right.percentage;
    const summary = await this.getSummary();
    const remain = removeOverflow(amount, right, summary);
    // Update summary
    summary.rights[right.id] += remain;
    summary.orgs[right.orgId].total += remain;
    summary.orgs[right.orgId][income.termsId] += remain;
    
    return income.amount - remain;
  }

  ///////////////
  // CONDITION //
  ///////////////
  async checkAllCondition(right: Right) {
    if (right.conditions?.length) {
      const summary = await this.getSummary();
      return right.conditions.every(cdt => checkCondition(cdt, summary));
    } else {
      return true;
    }
  }


}
