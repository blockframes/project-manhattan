import { RightCondition } from './condition.model';

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
  orgName?: string;
  title?: string;
  percentage: number;
  parentIds: string[];
  orgId: string;
  termsIds: string[];
  conditions?:  RightCondition[];
}

export function createRight(params: Partial<Right> = {}): Right {
  return {
    id: '',
    title: '',
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
  title: string;
  termsId: string;
  amount: number;
}

export function isIncome(value: any): value is Income {
  return 'termsId' in value && 'amount' in value;
}

export function createIncome(params: Partial<Income> = {}): Income {
  return {
    id: '',
    title: '',
    termsId: '',
    amount: 0,
    ...params
  }
}
