import React from "react";

import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "../common/SpreadTable";

import {
  Receipt,
  computeSubtotal,
  computeSubtotalVAT,
  computeGeneralExpenses,
  computeTotal,
  computeBenefits,
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
  const subtotal = computeSubtotal(receipt.items);
  const vat = computeSubtotalVAT(receipt.items);
  const gg = computeGeneralExpenses(receipt);
  const total = computeTotal(receipt);
  const benefits = computeBenefits(receipt.items);
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
      ...[subtotal, vat, gg, total, benefits].map((x) => addEuroSymbol(x)),
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
      <Table maxHeight="100px" rows={rows} onDoubleClick={() => {}} />
    </div>
  );
};

export default Total;
