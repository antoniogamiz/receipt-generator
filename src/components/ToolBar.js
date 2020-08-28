import React from "react";

class ToolBar extends React.Component {
  render() {
    return (
      <div id="tool-bar">
        <input
          className="form-control"
          placeholder="Reference"
          id="search-reference"
        />
        <div id="input_xlsx" className="form-group">
          <input
            onChange={this.props.updateFile}
            className="from-control"
            type="file"
            name="xlsx_file"
            accept=".xlsx"
          />
        </div>
      </div>
    );
  }
}

export default ToolBar;
