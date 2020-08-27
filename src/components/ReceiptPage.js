import React from "react";

import NavBar from "./NavBar";
import SpreadSheetVisualizer from "./SpreadSheetVisualizer";

class ReceiptPage extends React.Component {
  render() {
    return (
      <div class="window-content">
        <div class="pane-group">
          <div class="pane pane-sm sidebar">
            <NavBar />
          </div>
          <div class="pane">
            <SpreadSheetVisualizer />
          </div>
        </div>
      </div>
    );
  }
}

export default ReceiptPage;
