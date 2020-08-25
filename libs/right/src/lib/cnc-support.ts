
/**
 * Calculate the amount of income given by a support organization
 * @param ticketSold Amount of ticket sold
 * @param ticketPrice Price of one ticket
 * @param steps The steps to used for the support (key: limit, value: percentage)
 */
function getTheatricalSupport(ticketSold: number, ticketPrice: number, steps: Record<number, number>) {
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
