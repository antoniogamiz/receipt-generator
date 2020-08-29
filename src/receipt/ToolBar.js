import React from "react";

const ToolBar = (props) => {
  const updateFile = (e) => {
    const path = e.target.files[0].path;
    props.updateFile(path);
  };

  return (
    <div id="tool-bar">
      <input
        className="form-control"
        placeholder="Reference"
        id="search-reference"
        onChange={props.updateSearch}
      />
      <div id="input_xlsx" className="form-group">
        <input
          onChange={updateFile}
          className="from-control"
          type="file"
          name="xlsx_file"
          accept=".xlsx"
        />
      </div>
    </div>
  );
};

export default ToolBar;
