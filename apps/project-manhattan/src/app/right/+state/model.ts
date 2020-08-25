///////////
// RIGHT //
///////////
export interface Right {
  id: string;
  percentage: number;
  parentIds: string[];
  orgId: string;
  termsIds: string[];
  conditions?: Condition[];
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

///////////////
// CONDITION //
///////////////
export interface Condition {
  kind: 'titleTotal' | 'titleTerms' | 'orgTotal' | 'orgTerms' | 'right';
  min?: number;
  max?: number;
}


export interface TitleCondition extends Condition {
  kind: 'titleTotal';
}

export function createTitleCondition(params: Partial<TitleCondition> = {}): TitleCondition {
  return {
    kind: 'titleTotal',
    ...params
  }
}

export function isTitleCondition(cdt: Condition): cdt is TitleCondition {
  return cdt.kind === 'titleTotal';
}

/** Stop when movie received a certain amount */
export interface TitleTermsCondition extends Condition {
  kind: 'titleTerms';
  termsId: string;
}


export function createTitleTermsCondition(params: Partial<TitleTermsCondition> = {}): TitleTermsCondition {
  return {
    kind: 'titleTerms',
    termsId: '',
    ...params
  }
}


export function isTitleTermsCondition(cdt: Condition): cdt is TitleTermsCondition {
  return cdt.kind === 'titleTerms';
}

/** Stop when right received some amount */
export interface RightCondition extends Condition {
  kind: 'right';
  rightId: string;
}

export function createRightCondition(params: Partial<RightCondition> = {}): RightCondition {
  return {
    kind: 'right',
    rightId: '',
    ...params
  }
}

export function isRightCondition(cdt: Condition): cdt is RightCondition {
  return cdt.kind === 'right';
}

export interface OrgCondition extends Condition {
  kind: 'orgTotal';
  orgId: string;
}


export function createOrgCondition(params: Partial<OrgCondition> = {}): OrgCondition {
  return {
    kind: 'orgTotal',
    orgId: '',
    ...params
  }
}

export function isOrgCondition(cdt: Condition): cdt is OrgCondition {
  return cdt.kind === 'orgTotal';
}

/** Stop when a Party receive a certain amount on one terms */
export interface OrgTermsCondition extends Condition {
  kind: 'orgTerms';
  termsId: string;
  orgId: string;
}

export function createOrgTermsCondition(params: Partial<OrgTermsCondition> = {}): OrgTermsCondition {
  return {
    kind: 'orgTerms',
    termsId: '',
    orgId: '',
    ...params
  }
}

export function isOrgTermsCondition(cdt: Condition): cdt is OrgTermsCondition {
  return cdt.kind === 'orgTerms';
}
