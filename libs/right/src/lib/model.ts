interface Deal {
  duration: any;
  channels: string[];
  territories: string[];
  languages: string[];
  buyerRights: Right;
  sellerRights: Right;
}

///////////////////////////////////
/** Option on an right with a flat fee */
interface Option {
  duration: number;
  // price: Receipts;
  compensation: any;
  whoCanTransformIntoContract: any; // who can raise the option
}

/** Document to be signed to triggre transfert */
interface Contract {
  deals: Deal[];
  option: Option;
  parties: any[];
}

/** Small version of a contract on an Exploitation Right */
interface DealMemo extends Contract {}

/** Long version of a contract */
interface LongFormAgreement extends Contract {}

interface ReceiptRight {
  id: string;
  title?: string;
  type?: string; // used only for presentation matter
  rights?: string[]; // rightIds / vc: looks redundant with from
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

interface Mandate extends Contract {
  licensee: {
    // Exploitation right
  };
  licensor: {
    fee: ReceiptRight[];
    mg: ReceiptRight[];
    expenses: ReceiptRight[];
    perks: Perk[];
  };
  bonuses: Bonus[];
}

interface CoproContract extends Contract {
  parties: {
    properties;
    distribution;
    perks: Perk[];
  }[];
}

interface FinancingContract {
  roles: {
    financers: string[];
    prod: string[];
  };
  investment: number;
  financers: {
    /** Percentage of the investment */
    premium: number;
    backends: ReceiptRight[];
    recoupments: ReceiptRight[];
    expenses: ReceiptRight[];
    perks: Perk[];
    security: Security;
  };
  prod: Payment[];
}

interface Payment {
  trigger: Trigger;
  amount: number;
}

interface Perk {
  trigger;
  description: string;
}

/** Oracle */
interface Trigger {}

/** Etape dans le waterfall */
// vc: name changed because of reserved word Event
interface Events {
  id: string;
  condition?: "union" | "intersection";
  events: {
    ref: string; // vc: receiptRightId
    percentage: number; // => percentage of money cashed in / amount invested
  }[];
}

/** Condition on an event */
interface Condition {}

/** Terms of a right */
interface Right {
  id: string;
  territories: Excludable;
  channels: Excludable;
}

interface Excludable {
  included: string[];
  excluded: string[];
}