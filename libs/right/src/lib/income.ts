import { Income, createIncome, Summary } from './model';

// Base: ticketSold
export const CNC_SUPPORT: Record<number, number> = {
  0: 1.25, // should be: 1.1187,
  1_500_000: 0.95, // should be: 0.8502,
  5_000_000: 0.1 // should be: 0.0895
};

// Base: price * ticketSold
export const DIST_THEATRICAL_SUPPORT: Record<number, number> = {
  // Divided by 6 to get the ticket amount
  0: 2.2,
  51333: 1.4,
  102500: 1.2,
  205000: 0.5,
  512500: 0.3,
  717500: 0.1,
  1025000: 0,
  // Original values
  // 0: 2.20,
  // 308000: 1.40,
  // 615000: 1.20,
  // 1230000: 0.50,
  // 3075000: 0.30,
  // 4305000: 0.10,
  // 6150000: 0,
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

  // We don't sort the keys as they are considered as string
  const limits = Object.keys(steps);
  for (let i = 0; i < limits.length; i++) {
    if (rest === 0) break;
    const limit = Number(limits[i]);
    const percentage = steps[limit];
    // If last limit take the rest
    if (i === limits.length - 1) {
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


// export function getDistTheatricalSupport(ticketSold: number, ticketPrice: number, steps: Record<number, number>) {
//   const TSA = 0.1072; // Static

//   let incomeAmount = 0;
//   let rest = ticketSold * ticketPrice;  // Limit is done on income

//   const limits = Object.keys(steps); //.map(s => Number(s)).sort();
//   for (let i = 0; i < limits.length; i++) {
//     if (rest === 0) break;
//     const limit = Number(limits[i]);
//     const percentage = steps[limit];
//     // If last limit take the rest
//     if (i === limits.length - 1) {
//       incomeAmount += rest * percentage;
//     } else {
//       const nextLimit = Number(limits[i + 1]);
//       const range = Math.min(nextLimit - limit, rest);
//       console.log(nextLimit, limit, rest, range);
//       incomeAmount += range * percentage;
//       rest -= range;
//     }
//   }
//   console.log(incomeAmount * TSA);
//   return incomeAmount * TSA;
// }




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
      amount: getTheatricalSupport(amount, 6, DIST_THEATRICAL_SUPPORT),
    }),
    createIncome({
      id: 'videoDistSupportIncome',
      termsId: 'videoDistSupport',
      amount: (0.045 * summary.title['originVideo']) || 0,
    }),
  ]
}
