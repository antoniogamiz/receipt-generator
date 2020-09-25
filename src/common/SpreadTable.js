import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {},
});

const SpreadTable = (props) => {
  const classes = useStyles();

  let header = props.rows.length ? props.rows[0] : [];
  let rows = props.rows.length ? props.rows.slice(1) : [];

  return (
    <div>
      <TableContainer
        component={Paper}
        style={{ maxHeight: props.maxHeight, minHeight: props.maxHeight }}
      >
        <Table
          size="small"
          className={classes.table}
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              {header.map((text, i) => (
                <TableCell key={i} align="center">
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                onDoubleClick={(e) => props.onDoubleClick(e, row[0])}
                key={i}
              >
                {row.map((cell, i) => (
                  <TableCell key={i} fontSize="small" align="center">
                    {typeof cell === "number" ? cell.toFixed(2) : cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SpreadTable;
