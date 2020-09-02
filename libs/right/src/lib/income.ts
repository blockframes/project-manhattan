import { Income, createIncome, Summary } from './model';

// Base: ticketSold
export const CNC_SUPPORT: Record<number, number> = {
  0: 1.25, // should be: 1.1187,
  1_500_000: 0.95, // should be: 0.8502,
  5_000_000: 0.1 // should be: 0.0895
};

// Base: price * ticketSold
export const DIST_THEATRICAL_SUPPORT: Record<number, number> = {
  0: 2.20,
  308_000: 1.40,
  615_000: 1.20,
  1_230_000: 0.50,
  3_075_000: 0.30,
  4_305_000: 0.10,
  6_150_000: 0,
};


/**
 * Calculate the amount of income given by a support organization
 * @param ticketSold Amount of ticket sold
 * @param ticketPrice Price of one ticket
 * @param steps The steps to used for the support (key: limit, value: percentage)
 */
export function getTheatricalSupport(ticketSold: number, ticketPrice: number, steps: Record<number, number>) {
  const TSA = 0.1072; // Static
  let incomeAmount = 0;
  let rest = ticketSold;

  const limits = Object.keys(steps).sort();
  for (let i = 0; i < limits.length; i++) {
    if (rest === 0) break;
    const limit = Number(limits[i]);
    const percentage = steps[limit];
    // If last limit take the rest
    if (i === limits.length) {
      incomeAmount += rest * ticketPrice * percentage * TSA;
    } else {
      const nextLimit = Number(limits[i + 1]);
      const range = Math.min(nextLimit - limit, rest);
      incomeAmount += range * ticketPrice * percentage * TSA;
      rest -= range;
    }
  }
  return incomeAmount;
}


export function getDistTheatricalSupport(ticketSold: number, ticketPrice: number, steps: Record<number, number>) {
  const TSA = 0.1072; // Static

  let incomeAmount = 0;
  let rest = ticketSold * ticketPrice;  // Limit is done on income

  const limits = Object.keys(steps).sort();
  for (let i = 0; i < limits.length; i++) {
    if (rest === 0) break;
    const limit = Number(limits[i]);
    const percentage = steps[limit];
    // If last limit take the rest
    if (i === limits.length) {
      incomeAmount += rest * ticketPrice * percentage * TSA;
    } else {
      const nextLimit = Number(limits[i + 1]);
      const range = Math.min(nextLimit - limit, rest);
      incomeAmount += range * ticketPrice * percentage * TSA;
      rest -= range;
    }
  }
  return incomeAmount;
}




export function supportIncome(amount: number, price: number, summary: Summary): Income[] {
  return [
    createIncome({
      id: 'theatricalSupportIncome',
      termsId: 'theatricalSupport',
      amount: 0.93 * getTheatricalSupport(amount, price, CNC_SUPPORT),
    }),
    createIncome({
      id: 'videoSupportIncome',
      termsId: 'videoSupport',
      amount: (0.045 * summary.title['originVideo']) || 0,
    }),
    createIncome({
      id: 'tvSupportIncome',
      termsId: 'tvSupport',
      amount: 0.1 * 900_000, // TODO: get 900 from contract investment
    }),
    createIncome({
      id: 'theatricalDistSupportIncome',
      termsId: 'theatricalDistSupport',
      amount: getDistTheatricalSupport(amount, 6, DIST_THEATRICAL_SUPPORT),
    }),
    createIncome({
      id: 'videoDistSupportIncome',
      termsId: 'videoDistSupport',
      amount: (0.045 * summary.title['originVideo']) || 0,
    }),
  ]
}
