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
    <TableContainer component={Paper}>
      <Table size="small" className={classes.table} aria-label="a dense table">
        <TableHead>
          <TableRow>
            {header.map((text) => (
              <TableCell align="center">{text}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              style={{ height: "10px" }}
              onDoubleClick={props.onDoubleClick}
              key={row[0]}
            >
              {row.map((text) => (
                <TableCell fontSize="small" align="right">
                  {text}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpreadTable;
