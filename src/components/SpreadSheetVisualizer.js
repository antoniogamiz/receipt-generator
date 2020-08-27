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
              {header.map((e) => (
                <th>{e}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr>
                {row.map((e) => (
                  <td>{e}</td>
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
