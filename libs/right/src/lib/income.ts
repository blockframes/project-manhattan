import { Income, createIncome } from './model';
import { CNC_SUPPORT, getTheatricalSupport } from './support';

export function fromTicketToIncome(amount: number, price: number): Income[] {
  const theatricalIncome = createIncome({
    id: 'theatricalIncome',
    termsId: 'originTheatrical',
    amount: amount * price,
  });

  const theatricalSupportIncome = createIncome({
    id: 'theatricalSupportIncome',
    termsId: 'theatricalSupport',
    amount: getTheatricalSupport(amount, price, CNC_SUPPORT),
  });
  return [theatricalIncome, theatricalSupportIncome];
}
