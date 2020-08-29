import React from "react";

import Table from "../common/Table";

const addEuroSymbol = (str) => `${str.toFixed(2)} €`;

const Total = (props) => {
  const subtotal = props.items.reduce((x, e) => x + parseFloat(e.total), 0);

  const rows = [
    ["Subtotal", "IVA (21%)", "General Expenses", "Total"],
    [
      subtotal,
      subtotal * 0.21,
      subtotal * 0.13,
      subtotal * (1.0 + 0.21 + 0.13),
    ].map((x) => addEuroSymbol(x)),
  ];

  return (
    <div id="total_table">
      <Table rows={rows} />
    </div>
  );
};

export default Total;
