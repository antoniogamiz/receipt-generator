import React from "react";

import TextField from "@material-ui/core/TextField";
import Table from "../common/SpreadTable";

const ReceiptItemListVisualizer = (props) => {
  let items = props.items || [];

  const amountUpdate = (e, index) => {
    const amount = e.target.value;
    props.updateItem(parseInt(index), { amount: amount });
  };

  const biUpdate = (e, index) => {
    const bi = e.target.value;
    props.updateItem(parseInt(index), { bi: bi });
  };

  const deleteItem = (e, index) => {
    props.deleteItem(index);
  };

  const rowItems = items.map((item, i) => [
    item.ref,
    item.brand,
    item.model,
    item.description,
    <TextField
      onChange={(e) => amountUpdate(e, i)}
      value={item.amount}
      inputProps={{ style: { textAlign: "center", width: "50px" } }}
    />,
    `${item.provider_price.toFixed(2)} €`,
    item.discount,
    <TextField
      onChange={(e) => biUpdate(e, i)}
      value={parseFloat(item.bi.toFixed(2)).toString()}
      inputProps={{ style: { textAlign: "center", width: "50px" } }}
    />,
    `${item.pvp.toFixed(2)} €`,
    `${item.total.toFixed(2)} €`,
    `${((item.amount * item.bi * item.provider_price) / 100).toFixed(2)} €`,
  ]);

  const rows = [
    [
      "Item",
      "Marca",
      "Modelo",
      "Descripción",
      "Cantidad",
      "PP",
      "Descuento (%)",
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
