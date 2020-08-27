import React from "react";

import NavBar from "./NavBar";
import SpreadSheetVisualizer from "./SpreadSheetVisualizer";

class ReceiptPage extends React.Component {
  render() {
    let sheetData = this.props.xlsx.pages ? this.props.xlsx.pages[0] : [];
    let names = this.props.xlsx.sheetNames || [];
    return (
      <div className="window-content">
        <div className="pane-group">
          <div className="pane pane-sm sidebar">
            <NavBar names={names} />
          </div>
          <div className="pane">
            <SpreadSheetVisualizer sheet={sheetData} />
          </div>
        </div>
      </div>
    );
  }
}

export default ReceiptPage;
