import { Item, addItem, DEFAULT_BI, updateItem } from "./Receipt";

const genericItem: Item = {
  reference: "0-0000",
  brand: "foo",
  model: "bar",
  description: "testing",
  amount: 0,
  provider_price: 0,
  discount: 0,
  bi: 0,
  pvp: 150,
  total: 150,
};

const genericRawItem: any[] = [
  "0-0000",
  "brand",
  "model",
  "description",
  "random-value",
  1, // discount
  0, // pvp (not used)
  150, // provider_price
];

describe("Add an item", () => {
  test("Add an item", () => {
    const input: Item[] = [genericItem];
    const output: Item[] = [
      genericItem,
      {
        reference: "0-0000",
        brand: "brand",
        model: "model",
        description: "description",
        amount: 1,
        provider_price: 150,
        discount: 1,
        bi: DEFAULT_BI,
        pvp: 150 * (1 + DEFAULT_BI / 100.0),
        total: 150 * (1 + DEFAULT_BI / 100.0),
      },
    ];

    expect(addItem(input, genericRawItem)).toEqual(output);
  });
});

describe("Update an item", () => {
  test("Update BI", () => {
    const input: Item[] = addItem([], genericRawItem);
    const output: Item[] = [{ ...input[0], bi: 0, pvp: 150, total: 150 }];
    expect(updateItem(input, "0-0000", { bi: 0 })).toEqual(output);
  });

  test("Update BI", () => {
    const input: Item[] = addItem([], genericRawItem);
    const output: Item[] = [{ ...input[0], bi: 0, pvp: 150, total: 150 }];
    expect(updateItem(input, "0-0000", { bi: 0 })).toEqual(output);
  });

  test("Update nothing", () => {
    const input: Item[] = addItem([], genericRawItem);
    const output: Item[] = input;
    expect(updateItem(input, "0-0000", {})).toEqual(output);
  });
});

test("Delete an item", () => {});
