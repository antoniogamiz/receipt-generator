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
  expectedTotal: number;
  expectedTotalEnabled: boolean;
  generalExpenses: number;
  generalExpensesEnabled: boolean;
};

export const addItem = (items: Item[], item: any[]): Item[] => {
  if (items.find((e) => e.reference === item[0])) return items;

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

export const deleteItem = (items: Item[], reference: string): Item[] => {
  return items.filter((item) => item.reference !== reference);
};

// this needs to be renamed to computeTotal
// create new function called computeBenefits, really compute them
export const computeSubtotal = (items: Item[]): number =>
  items.reduce((result, item) => result + item.total, 0);

export const computeSubtotalVAT = (items: Item[]): number =>
  computeSubtotal(items) * (DEFAULT_IVA / 100);

export const computeGeneralExpenses = (receipt: Receipt): number =>
  receipt.generalExpensesEnabled
    ? computeSubtotalVAT(receipt.items) * (receipt.generalExpenses / 100)
    : 0;

export const computeTotal = (receipt: Receipt): number =>
  computeSubtotal(receipt.items) +
  computeSubtotalVAT(receipt.items) +
  computeGeneralExpenses(receipt);

export const computeBenefits = (items: Item[]): number =>
  items.reduce(
    (accumulator, item) =>
      (item.amount * item.provider_price * item.bi) / 100 + accumulator,
    0
  );

export const applyExpectedTotal = (
  items: Item[],
  expectedTotal: number
): Item[] => {
  const total: number = computeSubtotal(items);
  const lambda: number = (expectedTotal || total) / total;

  const newItems: Item[] = items.map((item) => {
    const newBI = (lambda * (1 + item.bi / 100) - 1) * 100;
    const pvp = item.provider_price * (1 + newBI / 100.0);
    const total = pvp * item.amount;
    return { ...item, bi: newBI, pvp: pvp, total: total };
  });

  return newItems;
};
