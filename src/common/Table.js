import React from "react";

const Table = (props) => {
  let header = props.rows.length ? props.rows[0] : [];
  let rows = props.rows.length ? props.rows.slice(1) : [];
  return (
    <table className="table-striped">
      <thead>
        <tr>
          {header.map((e, i) => (
            <th key={i}>{e}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} onDoubleClick={props.onDoubleClick}>
            {row.map((e, j) => (
              <td key={i * header.length + j}>{e}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
