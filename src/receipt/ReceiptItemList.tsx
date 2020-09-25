import React from "react";
import { TextField } from "@material-ui/core";

import Table from "../common/SpreadTable";
import { Item } from "../utils/Receipt";

interface props {
  items: Item[];
  onUpdateItem: (
    reference: string,
    { bi, amount }: { bi?: number | undefined; amount?: number | undefined }
  ) => void;
  onDeleteItem: (reference: string) => void;
}

const ReceiptItemList = (props: props) => {
  let items = props.items || [];

  const amountUpdate = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    reference: string
  ) => {
    const amount = parseInt(e.target.value) || 0;
    props.onUpdateItem(reference, { amount: amount });
  };

  const biUpdate = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    reference: string
  ) => {
    const bi = parseFloat(e.target.value) || 0;
    props.onUpdateItem(reference, { bi: bi });
  };

  const rowItems = items.map((item) => [
    item.reference,
    item.brand,
    item.model,
    item.description,
    <TextField
      onChange={(e) => amountUpdate(e, item.reference)}
      value={item.amount}
      inputProps={{ style: { textAlign: "center", width: "50px" } }}
    />,
    `${item.provider_price.toFixed(2)} €`,
    item.discount,
    <TextField
      onChange={(e) => biUpdate(e, item.reference)}
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
      <Table maxHeight="250px" rows={rows} onDoubleClick={props.onDeleteItem} />
    </div>
  );
};

export default ReceiptItemList;
