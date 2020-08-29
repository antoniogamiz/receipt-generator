import React from "react";

import Table from "../common/Table";

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
    `${item.provider_price} €`,
    <input onChange={biUpdate} value={item.bi} />,
    `${item.pvp} €`,
    `${item.total} €`,
  ]);

  const rows = [
    [
      "Item",
      "Marca",
      "Modelo",
      "Descripción",
      "Cantidad",
      "PP",
      "BI",
      "PVP",
      "Total",
    ],
    ...rowItems,
  ];

  return (
    <div className="excel_receipt_container">
      <Table rows={rows} onDoubleClick={deleteItem} />
    </div>
  );
};

export default ReceiptItemListVisualizer;
