import React from "react";

import NavBar from "./NavBar";
import SpreadSheetVisualizer from "./SpreadSheetVisualizer";

class ReceiptPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      xlsx: props.xlsx,
    };

    this.changeSpreadSheet = this.changeSpreadSheet.bind(this);
  }

  changeSpreadSheet(index) {
    this.setState({ pageIndex: index });
  }

  render() {
    let sheetData = this.state.xlsx.pages
      ? this.state.xlsx.pages[this.state.pageIndex]
      : [];
    let names = this.state.xlsx.sheetNames || [];
    return (
      <div className="window-content">
        <div className="pane-group">
          <div className="pane pane-sm sidebar">
            <NavBar names={names} onclick={this.changeSpreadSheet} />
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
