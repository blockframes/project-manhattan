////////////
// INCOME //
////////////


export interface Income {
  id: string;
  termsId: string;
  amount: number;
}

export function createIncome(params: Partial<Income> = {}): Income {
  return {
    id: '',
    termsId: '',
    amount: 0,
    ...params
  }
}