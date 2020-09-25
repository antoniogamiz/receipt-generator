import React from "react";
import { TextField, Checkbox } from "@material-ui/core";

import Table from "../common/SpreadTable";

import {
  Receipt, computeDetailedTotal, DetailedTotal
} from "../utils/Receipt";

const addEuroSymbol = (x: number) => `${x.toFixed(2)} €`;

interface TotalProps {
  receipt: Receipt;
  onExpectedTotalChange: (total: number) => void;
  enableTotalChange: () => void;
  enableGeneralExpenses: () => void;
}

const Total = ({
  receipt,
  onExpectedTotalChange,
  enableTotalChange,
  enableGeneralExpenses,
}: TotalProps) => {
  const dTotal: DetailedTotal = computeDetailedTotal(receipt);
  const rows = [
    [
      "Subtotal",
      "IVA (21%)",
      <div>
        <Checkbox
          checked={receipt.generalExpensesEnabled}
          onChange={enableGeneralExpenses}
          name="checkedG"
        />
        Gastos Generales
      </div>,
      "Total",
      "Beneficios",
      <div>
        <Checkbox
          checked={receipt.expectedTotalEnabled}
          onChange={enableTotalChange}
          name="checkedG"
        />
        Subtotal deseado
      </div>,
    ],
    [
      ...[dTotal.subtotal, dTotal.vat, dTotal.generalExpenses, dTotal.total, dTotal.benefits].map((x) => addEuroSymbol(x)),
      <TextField
        onChange={(e) =>
          onExpectedTotalChange(parseFloat(e.currentTarget.value))
        }
        value={receipt.expectedTotal}
        inputProps={{ style: { textAlign: "center" } }}
      />,
    ],
  ];

  return (
    <div id="total_table" style={{ marginTop: "20px" }}>
      {/* hotfix, change onDoubleClick */}
      <Table maxHeight="100px" rows={rows} onDoubleClick={() => { }} />
    </div>
  );
};

export default Total;
