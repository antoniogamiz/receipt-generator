import React from "react";

import Table from "../common/Table";

const addEuroSymbol = (str) => `${str.toFixed(2)} €`;

const Total = (props) => {
  const rows = [
    ["Subtotal", "IVA (21%)", "General Expenses", "Total"],
    [
      props.subtotal,
      props.subtotal * 0.21,
      props.subtotal * 0.13,
      props.subtotal * (1.0 + 0.21 + 0.13),
    ].map((x) => addEuroSymbol(x)),
  ];

  return (
    <div id="total_table">
      <Table rows={rows} />
    </div>
  );
};

export default Total;
