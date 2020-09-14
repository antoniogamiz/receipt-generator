import { Item, addItem, DEFAULT_BI } from "./Receipt";

const genericItem: Item = {
  reference: "0-0000",
  brand: "foo",
  model: "bar",
  description: "testing",
  amount: 0,
  provider_price: 0,
  discount: 0,
  bi: 0,
  pvp: 0,
  total: 0,
};

const genericRawItem: any[] = [
  "reference",
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
        reference: "reference",
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

test("Update an item", () => {});

test("Delete an item", () => {});
