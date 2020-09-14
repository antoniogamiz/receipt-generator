export const DEFAULT_IVA = 21;
export const DEFAULT_BI = 13;

export type Item = {
  reference: string;
  brand: string;
  model: string;
  description: string;
  amount: number;
  provider_price: number;
  discount: number;
  bi: number;
  pvp: number;
  total: number;
};

export type Receipt = {
  items: Item[];
};

export const addItem = (items: Item[], item: any[]): Item[] => {
  const provider_price: number = parseFloat(item[item.length - 1]);
  const newItem = {
    reference: item[0],
    brand: item[1],
    model: item[2],
    description: item[3],
    amount: 1,
    provider_price: provider_price,
    discount: item[item.length - 3],
    bi: DEFAULT_BI,
    pvp: provider_price * (1 + DEFAULT_BI / 100.0),
    total: provider_price * (1 + DEFAULT_BI / 100.0),
  };
  return [...items, newItem];
};

export const updateItem = (
  items: Item[],
  reference: string,
  { bi, amount }: { bi?: number; amount?: number }
): Item[] => {
  const index = items.findIndex((i) => i.reference === reference);
  const item = items[index];
  amount = amount ?? item.amount;
  bi = bi ?? item.bi;

  let newItems: Item[] = [...items];
  const pvp: number = item.provider_price * (1 + bi / 100.0);
  const total: number = pvp * amount;

  newItems[index] = {
    ...item,
    amount: amount,
    bi: bi,
    pvp: pvp,
    total: total,
  };

  return newItems;
};

export const deleteItem = (items: Item[], reference: string): Item[] => {};

export const applyExpectedTotal = (
  receipt: Receipt,
  expectedTotal: number
): Receipt => {};

export const computeBenefits = (receipt: Receipt): number => {};
