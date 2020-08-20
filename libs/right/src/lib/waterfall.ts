import { Right, Event, Terms, Income, termIncompatibility, Party, Summary, createSummary, createIncome } from './model';
import * as cdt from './condition.model';

interface WaterfallJson {
  events?: Event[];
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
  private events: Record<string, Event> = {};
  private rights: Record<string, Right> = {};
  private terms: Record<string, Terms> = {};
  private incomes: Record<string, Income> = {};
  private summary: Summary;

  constructor(data: WaterfallJson = {}) {
    this.events = toObject(data.events);
    this.rights = toObject(data.rights);
    this.terms = toObject(data.terms);
    this.summary = createSummary();
  }

  async getEvent(id: string) {
    if (!id) throw new Error('Provide an id to method "getEvent"');
    return this.events[id];
  }
  async getRight(id: string) {
    if (!id) throw new Error('Provide an id to method "getRight"');
    return this.rights[id];
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
    return Object.values(this.rights).find((right) => {
      const hasParent = !!right.parentIds?.length;
      return !hasParent && this.areTermsCompatible(right.termsId, income.termsId);
    });
  }

  /** Query all rights after this one */
  async queryNext(parentId: string) {
    return Object.values(this.rights).filter((right) => right.parentIds?.includes(parentId));
  }

  async getIncome(income: Income, right: Right): Promise<void> {
    const canCashIn = await this.checkAllCondition(right);
    const rest = canCashIn
      ? await this.cashIn(income.amount, right)
      : income.amount;

    if (rest > 0) {
      // Create a copy of the income with the amount updated after right took value
      const nextIncome = createIncome({ ...income, amount: rest });
      const nexts = await this.queryNext(right.id);
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
  async cashIn(base: number, right: Right): Promise<number> {
    const amount = base * right.percentage;
    const summary = await this.getSummary();
    const remain = removeOverflow(amount, right, summary);
    // Update summary
    summary.rights[right.id] += remain;
    summary.orgs[right.orgId].total += remain;
    summary.orgs[right.orgId][right.termsId] += remain;
    
    return base - remain;
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

/** remove the overflow of an income */
export function removeOverflow(amount: number, right: Right, summary: Summary) {
  const selfTarget = (condition: cdt.Condition): condition is cdt.RightCondition => {
    return cdt.isRightCondition(condition) && condition.rightId === right.id;
  };
  const step = right.conditions?.find(selfTarget);
  if (step?.max) {
    const remain = step.max - summary.rights[right.id];
    return Math.min(amount, remain);
  } else {
    return amount;
  }
}

/** Verify a condition */
function checkCondition(condition: cdt.Condition, summary: Summary) {
  const total = getTotal(condition, summary);
  if (total) {
    const checkMin = !condition.min || total > condition.min;
    const checkMax = !condition.max || total < condition.max;
    return checkMin && checkMax;
  } else {
    return false; // TODO: what if this is a custom condition ???
  }
}

function getTotal(condition: cdt.Condition, summary: Summary) {
  if (cdt.isRightCondition(condition)) {
    return summary.rights[condition.rightId];
  }
  if (cdt.isOrgCondition(condition)) {
    return summary.orgs[condition.orgId].total;
  }
  if (cdt.isOrgTermsCondition(condition)) {
    return summary.orgs[condition.orgId][condition.termsId];
  }
  if (cdt.isTitleCondition(condition)) {
    return summary.title.total;
  }
  if (cdt.isTitleTermsCondition(condition)) {
    return summary.title[condition.termsId];
  }
  return 0;
}