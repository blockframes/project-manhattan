import { Right, Waterfall, Event, Terms, Income, termIncompatibility } from './model';

interface WaterfallJson {
  events?: Event[];
  rights?: Right[];
  terms?: Terms[];
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

export class LocalWaterfall implements Waterfall {
  private events: Record<string, Event> = {};
  private rights: Record<string, Right> = {};
  private terms: Record<string, Terms> = {};

  constructor(data: WaterfallJson = {}) {
    this.events = toObject(data.events);
    this.rights = toObject(data.rights);
    this.terms = toObject(data.terms);
  }

  async getEvent(id: string) {
    return this.events[id];
  }
  async getRight(id: string) {
    return this.rights[id];
  }
  async getTerms(id: string) {
    return this.terms[id];
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
  
  async getFirstRight(income: Income): Promise<Right | undefined> {
    return Object.values(this.rights).find((right) => right.termsId === income.termId && !right.parentId);
  }

  queryNext(right: Right) {
    throw new Error("Method not implemented.");
  }

  async getIncome(income: Income, rightId: string): Promise<number> {
    throw new Error("Method not implemented.");
  }

  cashIn(amount: number, rightId: string): number {
    throw new Error("Method not implemented.");
  }
  triggerEvent(): void {
    throw new Error("Method not implemented.");
  }
  checkCondition(rightId: string): boolean {
    throw new Error("Method not implemented.");
  }
  
}