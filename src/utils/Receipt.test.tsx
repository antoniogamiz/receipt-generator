import {
  Item,
  addItem,
  updateItem,
  deleteItem,
  DEFAULT_BI,
  applyExpectedTotal,
} from "./Receipt";

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

describe("Delete an item", () => {
  test("Delete an item", () => {
    const input: Item[] = addItem([], genericRawItem);
    const output: Item[] = [];
    expect(deleteItem(input, "0-0000")).toEqual(output);
  });
});

describe("Apply expected total", () => {
  test("Non-zero expected total", () => {
    const input: Item[] = addItem([], genericRawItem);
    const output: Item[] = [
      {
        ...input[0],
        bi: -33.33333333333333,
        pvp: 100.00000000000001,
        total: 100.00000000000001,
      },
    ];
    expect(applyExpectedTotal(input, 100)).toEqual(output);
  });
});
