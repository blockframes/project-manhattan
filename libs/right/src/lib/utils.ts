import { Terms, Right, Summary } from './model';
import * as cdt from './condition.model';

/** Either a exclude something from b or a includes something from b */
export function termIncompatibility(a: Terms, b: Terms, field: 'territories' | 'channels') {
  return a[field].excluded.some(excluded => b[field].included.includes(excluded))
  || a[field].included.some(included => b[field].excluded.includes(included));
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
export function checkCondition(condition: cdt.Condition, summary: Summary) {
  const total = getTotal(condition, summary);
  // TODO: what about equality
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
  } else if (cdt.isOrgCondition(condition)) {
    return summary.orgs[condition.orgId].total;
  } else if (cdt.isOrgTermsCondition(condition)) {
    return summary.orgs[condition.orgId][condition.termsId];
  } else if (cdt.isTitleCondition(condition)) {
    return summary.title.total;
  } else if (cdt.isTitleTermsCondition(condition)) {
    return summary.title[condition.termsId];
  } else {
    return 0;
  }
}