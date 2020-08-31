import React from "react";

import Table from "../common/SpreadTable";

const addEuroSymbol = (str) => `${str.toFixed(2)} €`;

const Total = (props) => {
  const rows = [
    ["Subtotal", "IVA (21%)", "Gastos Generales", "Total"],
    [
      props.subtotal,
      props.subtotal * 0.21,
      props.subtotal * 0.13,
      props.subtotal * (1.0 + 0.21 + 0.13),
    ].map((x) => addEuroSymbol(x)),
  ];

  return (
    <div id="total_table" style={{ marginTop: "20px" }}>
      <Table maxHeight="70px" rows={rows} />
    </div>
  );
};

export default Total;
