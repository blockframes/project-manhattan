import { Condition } from './condition.model';

export interface ReceiptRight {
  id: string;
  title?: string;
  type?: string; // used only for presentation matter
  cashedIn?: number;  // amount already received from this right
  amount?: number;
  min?: number; // vc: added because of expenses
  max?: number; // vc: added because of expenses
  // vc: base has been removed for from, if and after into blocks
  blocks: {
    percentage: number;
    if?: Event; // eventId
    fromTerm?: Terms; // rightsId (brut)
    parent?: string; // RightId (net)
    until?: Event; // eventId
  }[];
}

/////////////
// SUMMARY //
/////////////
export interface Summary {
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
  parentIds?: string[];
  orgId: string;
  termsId: string;
  conditions?:  Condition[];
}

export function createRight(params: Partial<Right> = {}): Right {
  return {
    id: '',
    percentage: 0,
    orgId: '',
    termsId: '',
    parentIds: [],
    ...params
  };
}

///////////
// EVENT //
///////////

export interface Event {
  id: string;
  
}

/** Etape dans le waterfall
// vc: name changed because of reserved word Event
export interface Event {
  id: string;
  condition?: "union" | "intersection";
  events: {
    ref: string; // vc: RightId
    percentage: number; // => percentage of money cashed in / amount invested
  }[];
} */

///////////
// PARTY //
///////////

export interface Party {
  id: string;
  received: number;
}

export function createParty(params: Partial<Party> = {}): Party {
  return {
    id: '',
    received: 0,
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
  territories: Excludable;
  channels: Excludable;
}

export const createTerms = (params: Partial<Terms>): Terms => ({
  id: '',
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

/** Either a exclude something from b or a includes something from b */
export function termIncompatibility(a: Terms, b: Terms, field: 'territories' | 'channels') {
  return a[field].excluded.some(excluded => b[field].included.includes(excluded))
  || a[field].included.some(included => b[field].excluded.includes(included));
}

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