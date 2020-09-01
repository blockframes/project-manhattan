import { Income, createIncome, Summary } from './model';
import { CNC_SUPPORT, getTheatricalSupport } from './support';



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
      amount: 0.045 * summary.title['originVideo'] || 0,
    }),
    createIncome({
      id: 'tvSupportIncome',
      termsId: 'tvSupport',
      amount: 0.1 * 900_000, // TODO: get 900 from contract investment
    }),
  ]
}
