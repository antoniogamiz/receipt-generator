import React from "react";

import TextField from "@material-ui/core/TextField";
import { green } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "../common/SpreadTable";

const addEuroSymbol = (str) => `${str.toFixed(2)} €`;

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const Total = ({
  subtotal,
  expectedTotal,
  onChange,
  isGeneralExpensesEnabled,
  enableGeneralExpenses,
  isTotalChangeEnabled,
  enableTotalChange,
  benefits,
}) => {
  const rows = [
    [
      "Subtotal",
      "IVA (21%)",
      <div>
        <GreenCheckbox
          checked={isGeneralExpensesEnabled}
          onChange={enableGeneralExpenses}
          name="checkedG"
        />
        Gastos Generales
      </div>,
      "Total",
      "Beneficios",
      <div>
        <GreenCheckbox
          checked={isTotalChangeEnabled}
          onChange={enableTotalChange}
          name="checkedG"
        />
        Subtotal deseado
      </div>,
    ],
    [
      ...[
        subtotal,
        subtotal * 0.21,
        isGeneralExpensesEnabled ? subtotal * 0.13 : 0,
        isGeneralExpensesEnabled
          ? subtotal * (1.0 + 0.21 + 0.13)
          : subtotal * (1.0 + 0.21),
        benefits,
      ].map((x) => addEuroSymbol(x)),

      <TextField
        onChange={onChange}
        value={expectedTotal}
        inputProps={{ style: { textAlign: "center" } }}
      />,
    ],
  ];

  return (
    <div id="total_table" style={{ marginTop: "20px" }}>
      <Table maxHeight="100px" rows={rows} />
    </div>
  );
};

export default Total;
