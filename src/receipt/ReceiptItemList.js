import React from "react";

import TextField from "@material-ui/core/TextField";
import Table from "../common/SpreadTable";

const ReceiptItemListVisualizer = (props) => {
  let items = props.items || [];

  const amountUpdate = (e) => {
    const index =
      e.target.parentElement.parentElement.parentElement.parentElement
        .firstChild.innerHTML;
    const amount = e.target.value;
    props.updateItem(parseInt(index), { amount: amount });
  };

  const biUpdate = (e) => {
    const index =
      e.target.parentElement.parentElement.parentElement.parentElement
        .firstChild.innerHTML;
    const bi = e.target.value;
    props.updateItem(parseInt(index), { bi: bi });
  };

  const deleteItem = (e) => {
    const index = e.target.parentElement.firstChild.innerHTML;
    props.deleteItem(index);
  };

  const rowItems = items.map((item, i) => [
    i,
    item.brand,
    item.model,
    item.description,
    <TextField
      onChange={amountUpdate}
      value={item.amount}
      inputProps={{ style: { textAlign: "center", width: "50px" } }}
    />,
    `${item.provider_price.toFixed(2)} €`,
    <TextField
      onChange={biUpdate}
      value={item.bi.toFixed(2)}
      inputProps={{ style: { textAlign: "center", width: "50px" } }}
    />,
    `${item.pvp.toFixed(2)} €`,
    `${item.total.toFixed(2)} €`,
    `${((item.pvp - item.provider_price) * item.amount).toFixed(2)} €`,
  ]);

  const rows = [
    [
      "Item",
      "Marca",
      "Modelo",
      "Descripción",
      "Cantidad",
      "PP",
      "BI (%)",
      "PVP",
      "Total",
      "Ganancia",
    ],
    ...rowItems,
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      <Table maxHeight="250px" rows={rows} onDoubleClick={deleteItem} />
    </div>
  );
};

export default ReceiptItemListVisualizer;
