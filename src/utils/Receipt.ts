export const DEFAULT_IVA = 0.21;
export const DEFAULT_BI = 0.13;

export type Item = {
  reference: string;
  brand: string;
  model: string;
  description: string;
  amount: bigint;
  provider_price: number;
  discount: number;
  bi: number;
  pvp: number;
  total: number;
};

export type Receipt = {
  items: Item[];
};

export const addItem = (items: Item[], reference: string, xlsx): Item[] => {};

export const updateItem = (
  items: Item[],
  reference: string,
  { bi, amount }: { bi: string; amount: bigint }
): Item => {};

export const deleteItem = (items: Item[], reference: string): Item[] => {};

export const applyExpectedTotal = (
  receipt: Receipt,
  expectedTotal: number
): Receipt => {};

export const computeBenefits = (receipt: Receipt): number => {};
