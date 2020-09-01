import { isIncome, Income, Right, createSummary, createIncome, Terms, Summary } from './model';
import { removeOverflow, checkCondition } from './utils';
import { supportIncome } from './income';

export interface Simulation {
  name?: string;
  multiplier: number;
  ticket: {
    amount: number;
    price: number;
  };
  terms: Record<string, number>;
}

export interface SimulationResult {
  summary: Summary;
  incomes: Income[];
}

export interface Waterfall {
  id: string;
  type: 'scenario' | 'main';
  name?: string;
  orgId: string;
  simulations: Simulation[];
  terms: Terms[];
  rights: Right[];
  investments: {
    [orgId: string]: number
  }
}

export function createSimulation(params: Partial<Simulation> = {}): Simulation {
  return {
    multiplier: 1,
    ticket: {
      amount: 0,
      price: 0,
    },
    terms: {},
    ...params
  }
}

// Run locally the script
function emulateSummary(
  watefall: Waterfall,
  income: Income,
  lastSummary = createSummary()
) {

  // Create the summary: use the incomeId as id
  const summary = createSummary({
    id: income.id,
    previous: lastSummary.id,
    title: lastSummary.title,
    rights: lastSummary.rights,
    orgs: lastSummary.orgs,
  });

  ///////////
  // SETUP //
  ///////////

  /** Query rights by their parentId, if 'root' then it's the first */
  const queryRights = (parentId: string) => {
    return watefall.rights.filter(right => right.parentIds.includes(parentId));
  }

  /** Get the first right for a specific income */
  const queryFirstRight = (income: Income): Right => {
    // If a right is the first for a terms, the parentId is the termsId
    const rights = queryRights(income.termsId);

    if (rights.length > 1) {
      throw new Error('There are multiple first right for terms id: ' + income.termsId);
    }
    if (rights.length === 0) {
      throw new Error('Could not find first right for terms id: ' + income.termsId);
    }
    return rights[0];
  }

  // We need to use parent / key to keep the mutation
  /** Set the value of an entry of the summary */
  const setSummaryEntry = (parent: { [key: string]: number }, key: string, increment: number): void => {
    if (parent[key]) {
      parent[key] = parent[key] + increment;
    } else {
      parent[key] = increment;
    }
  }

  /**
   * Update the amount received by the party & return the rest
   * @param income The income for this right
   * @param right The right used for calculation
   */
  const cashIn = (income: Income, right: Right): number => {
    const amount = income.amount * right.percentage;
    const remain = removeOverflow(amount, right, summary);
    // Update summary
    if (!summary.orgs[right.orgId]) {
      summary.orgs[right.orgId] = { total: 0 };
    }
    setSummaryEntry(summary.orgs[right.orgId], 'total', remain);
    setSummaryEntry(summary.orgs[right.orgId], income.termsId, remain);
    setSummaryEntry(summary.rights, right.id, remain);

    return income.amount - remain;
  }

  /** For one right, verify that each condition is validated */
  const checkAllCondition = (right: Right) => {
    return right.conditions?.length
      ? right.conditions.every(cdt => checkCondition(cdt, summary))
      : true;
  }

  /**
   * Main process: recursively calculate the amount 
   * @param income The income with the amount updated 
   * @param right The right that get the income
   */
  const getIncome = (income: Income, right: Right): void => {
    const canCashIn = checkAllCondition(right);
    const rest = canCashIn
      ? cashIn(income, right)
      : income.amount;

    if (rest > 0) {
      // Create a copy of the income with the amount updated after right took value
      const nextIncome = createIncome({ ...income, amount: rest });
      const nexts = queryRights(right.id);

      for (const next of nexts) {
        // Verify if next has current termsId here because
        // query doesn't support multiple array contains
        if (next.termsIds.includes(income.termsId)) {
          getIncome(nextIncome, next);
        }
      }
    }
  }


  /////////////////
  // RUN PROCESS //
  /////////////////
  /** Update the amount received by the title */
  setSummaryEntry(summary.title, 'total', income.amount);
  setSummaryEntry(summary.title, income.termsId, income.amount);

  const firstRight = queryFirstRight(income);
  getIncome(income, firstRight);

  return summary;
}

export type SimulationSource = Partial<Simulation> | Income | Income[] | string;

/** Create a simulation object out of a simulation source */
export function getSimulation(waterfall: Waterfall, simulation: SimulationSource) {
  if (typeof simulation === 'string') {
    return waterfall.simulations.find(s => s?.name === simulation);
  }
  const result = createSimulation();
  if (Array.isArray(simulation)) {
    for (const income of simulation) {
      result.terms[income.termsId] = income.amount;
    }
    return result;
  }
  if (isIncome(simulation)) {
    result.terms[simulation.termsId] = simulation.amount;
    return result;
  }
  return createSimulation(simulation);
}

/** Run one simulation */
export function runSimulation(waterfall: Waterfall, simulation: SimulationSource) {
  const simu = getSimulation(waterfall, simulation);
  if (!simu) {
    throw new Error('Could not find simulation ' + simulation);
  }
  const { terms, ticket } = simu;
  const incomes: Income[] = [];
  let summary = createSummary();
  for (const termsId in terms) {
    const amount = terms[termsId];
    if (amount) {
      const income = createIncome({ id: termsId, termsId, amount: terms[termsId] });
      summary = emulateSummary(waterfall, income, summary);
      incomes.push(income);
    }
  }
  // Do support after the other one because it might need information for summary
  const supports = supportIncome(ticket.amount, ticket.price, summary);
  for (const support of supports) {
    summary = emulateSummary(waterfall, support, summary);
    incomes.push(support);
  }

  const bonus = createIncome({
    id: 'bonusSupportIncome',
    termsId: 'bonusSupport',
    amount: 0.15 * summary.rights['patheSupport'] || 0,
  });
  summary = emulateSummary(waterfall, bonus, summary);
  incomes.push(bonus);


  return { summary, incomes };
}