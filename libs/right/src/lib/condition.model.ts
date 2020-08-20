
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

export function isTitleCondition(cdt: Condition): cdt is TitleCondition {
  return cdt.kind === 'titleTotal';
}

/** Stop when movie received a certain amount */
export interface TitleTermsCondition extends Condition {
  kind: 'titleTerms';
  termsId: string;
}

export function isTitleTermsCondition(cdt: Condition): cdt is TitleTermsCondition {
  return cdt.kind === 'titleTerms';
}

/** Stop when right received some amount */
export interface RightCondition extends Condition {
  kind: 'right';
  rightId: string;
}

export function isRightCondition(cdt: Condition): cdt is RightCondition {
  return cdt.kind === 'right';
}

export interface OrgCondition extends Condition {
  kind: 'orgTotal';
  orgId: string;
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

export function isOrgTermsCondition(cdt: Condition): cdt is OrgTermsCondition {
  return cdt.kind === 'orgTerms';
}
