import { Condition } from './condition.model';

/////////////
// SUMMARY //
/////////////
export interface Summary {
  id: string;
  date: Date;
  previous?: string;
  next?: string;
  title: {
    total: number;
    [termsId: string]: number;
  };
  orgs: {
    [orgId: string]: {
      total: number;
      [termsId: string]: number;
    }
  };
  rights: {
    [rightId: string]: number;
  }
}

export function createSummary(params: Partial<Summary> = {}): Summary {
  return {
    id: 'genesis',
    date: new Date(),
    title: {
      total: 0
    },
    orgs: {},
    rights: {},
    ...params
  }
}

///////////
// RIGHT //
///////////
export interface Right {
  id: string;
  percentage: number;
  parentIds: string[];
  orgId: string;
  termsIds: string[];
  conditions?:  Condition[];
}

export function createRight(params: Partial<Right> = {}): Right {
  return {
    id: '',
    percentage: 0,
    orgId: '',
    termsIds: [],
    parentIds: [],
    ...params
  };
}

///////////
// TERMS //
///////////

export interface Excludable {
  included: string[];
  excluded: string[];
}

/** Terms of a right */
export interface Terms {
  id: string;
  type: 'origin' | 'support';
  title: string;
  territories: Excludable;
  channels: Excludable;
}

export const createTerms = (params: Partial<Terms>): Terms => ({
  id: '',
  type: 'origin',
  title: '',
  territories: {
    included: [],
    excluded: []
  },
  channels: {
    included: [],
    excluded: []
  },
  ...params
})


////////////
// INCOME //
////////////


export interface Income {
  id: string;
  termsId: string;
  amount: number;
}

export function createIncome(params: Partial<Income> = {}): Income {
  return {
    id: '',
    termsId: '',
    amount: 0,
    ...params
  }
}

export interface Waterfall {
  // terms: Terms[];
  // rights: Right[];
  // events: Event[];
  // parties: any[];

  getEvent(id: string): Promise<Event>;
  getRight(id: string): Promise<Right>;
  getTerms(id: string): Promise<Terms>;

  getIncome(income: Income, rightId: string): void;
  /** Return the amount taken */
  cashIn(amount: number, rightId: string): number;
  /** Update an event to true on a cashIn process */
  triggerEvent(): void;
  /** Verify if an event has been triggered */
  checkCondition(rightId: string): boolean;
}