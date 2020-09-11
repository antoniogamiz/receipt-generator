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
  checked,
  onCheckChange,
  benefits,
}) => {
  const rows = [
    [
      "Subtotal",
      "IVA (21%)",
      "Gastos Generales",
      "Total",
      "Beneficios",
      <div>
        <GreenCheckbox
          checked={checked}
          onChange={onCheckChange}
          name="checkedG"
        />
        Subtotal deseado
      </div>,
    ],
    [
      ...[
        subtotal,
        subtotal * 0.21,
        subtotal * 0.13,
        subtotal * (1.0 + 0.21 + 0.13),
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
