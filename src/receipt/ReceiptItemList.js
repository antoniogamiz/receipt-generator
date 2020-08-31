import React from "react";

import Table from "../common/SpreadTable";

const ReceiptItemListVisualizer = (props) => {
  let items = props.items || [];

  const amountUpdate = (e) => {
    const index = e.target.parentElement.parentElement.firstChild.innerHTML;
    const amount = e.target.value;
    props.updateItem(index, { amount: amount });
  };

  const biUpdate = (e) => {
    const index = e.target.parentElement.parentElement.firstChild.innerHTML;
    const bi = e.target.value;
    props.updateItem(index, { bi: bi });
  };

  const deleteItem = (e) => {
    const index = e.target.parentElement.firstChild.innerHTML;
    console.log(index);
    props.deleteItem(index);
  };

  const rowItems = items.map((item, i) => [
    i,
    item.brand,
    item.model,
    item.description,
    <input onChange={amountUpdate} value={item.amount} />,
    `${item.provider_price.toFixed(2)} €`,
    <input onChange={biUpdate} value={item.bi} />,
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
