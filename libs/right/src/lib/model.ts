interface ReceiptRight {
  id: string;
  title?: string;
  type?: string; // used only for presentation matter
  terms?: Terms[]; // rightIds / vc: looks redundant with from
  cashedIn?: number;
  amount?: number;
  min?: number; // vc: added because of expenses
  max?: number; // vc: added because of expenses
  // vc: base has been removed for from, if and after into blocks
  blocks: {
    percentage: number;
    if?: string; // eventId
    from?: string; // rightsId (brut)
    after?: string; // receiptRightId (net)
    until?: string; // eventId
  }[];
}


/** Terms of a right */
interface Terms {
  territories: Excludable;
  channels: Excludable;
}

interface Excludable {
  included: string[];
  excluded: string[];
}