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

export interface Right {
  id: string;
  percentage: number;
  parentId?: string;
  termsId: string;
}

/** Etape dans le waterfall */
// vc: name changed because of reserved word Event
export interface Event {
  id: string;
  condition?: "union" | "intersection";
  events: {
    ref: string; // vc: RightId
    percentage: number; // => percentage of money cashed in / amount invested
  }[];
}

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




export interface Income {
  termId: string;
  amount: number;
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