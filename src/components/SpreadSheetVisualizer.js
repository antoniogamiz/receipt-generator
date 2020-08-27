import React from "react";

class SpreadSheetVisualizer extends React.Component {
  render() {
    let header = this.props.sheet ? this.props.sheet[0] : [];
    let rows = this.props.sheet ? this.props.sheet.slice(1) : [];
    return (
      <div id="excel_worksheet_container">
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
              <tr key={i} onDoubleClick={() => this.props.addItem(row[0])}>
                {row.map((e, j) => (
                  <td key={i * header.length + j}>{e}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SpreadSheetVisualizer;
