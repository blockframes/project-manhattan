import { Right, Event, Terms, Income, termIncompatibility, Party, Condition, StepCondition, isStepCondition, Summary, isStepListCondition, StepListCondition } from './model';

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
    this.summary = { title: { total: 0 } };
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

  /** Update the right & trigger onUpdate */
  updateRight(id: string, update: Partial<Right>) {
    const before = { ...this.rights[id] };
    const after = { ...update, ...this.rights[id] };
    this.rights[id] = after;
    this.onUpdateRight({ before, after });
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

  /** Update the summary */
  onUpdateRight(change: {before: Right, after: Right}) {
    const amount = change.after.received - change.before.received;
    const right = change.after;
    if (amount > 0) {
      this.summary[right.orgId].total += amount;
      this.summary[right.orgId][right.termsId] += amount;
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

  async getIncome(income: Income, right: Right): Promise<number> {
    
    throw new Error("Method not implemented.");
  }

  /**
   * Update the amount received by the party & return the rest
   * @param base The amount incoming to the right
   * @param right The right used for calculation
   */
  async cashIn(base: number, right: Right): Promise<number> {
    const amount = base * right.percentage;
    const remain = removeOverflow(amount, right);
    this.updateRight(right.id, { received: right.received + remain });
    return base - remain;
  }

  ///////////////
  // CONDITION //
  ///////////////
  async checkAllCondition(right: Right) {
    if (right.conditions?.length) {
      const summary = await this.getSummary();
      return right.conditions.every(cdt => this.checkCondition(cdt, summary));
    } else {
      return true;
    }
  }

  checkCondition(condition: Condition, summary: Summary) {
    if (isStepCondition(condition)) {
      return checkStepCondition(condition, summary);
    }
    if (isStepListCondition(condition)) {
      return checkListStepCondition(condition, summary);
    }
  }
}

/** remove the overflow of an income */
export function removeOverflow(amount: number, right: Right) {
  const selfTarget = (cdt: Condition): cdt is StepCondition => isStepCondition(cdt) && cdt.rightId === right.id;
  const step = right.conditions?.find(selfTarget);
  if (step?.max) {
    const remain = step.max - right.received;
    return Math.min(amount, remain);
  } else {
    return amount;
  }
}


function checkStepCondition(cdt: StepCondition, summary: Summary) {
  const total = summary[cdt.rightId].total;
  const checkMin = !cdt.min || total > cdt.min;
  const checkMax = !cdt.max || total < cdt.max;
  return checkMin && checkMax;
}

function checkListStepCondition(cdt: StepListCondition, summary: Summary) {}